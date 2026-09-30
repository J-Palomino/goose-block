use anyhow::Result;
use async_trait::async_trait;
use futures::future::BoxFuture;
use goose_providers::conversation::token_usage::{ProviderUsage, Usage};
use goose_providers::errors::ProviderError;
use serde::Deserialize;
use std::collections::HashMap;
use tokio::sync::Mutex;

use super::base::{
    stream_from_single_message, ConfigKey, MessageStream, Provider, ProviderDef, ProviderMetadata,
};
use crate::config::ExtensionConfig;
use crate::conversation::message::Message;
use goose_providers::base::ProviderDescriptor;
use goose_providers::model::ModelConfig;
use rmcp::model::Tool;

const DAISY_PROVIDER_NAME: &str = "daisy";
const DAISY_DEFAULT_HOST: &str = "https://daisy.plus";

#[derive(Debug, Deserialize)]
struct Agency {
    id: String,
    name: String,
}

#[derive(Debug, Deserialize)]
struct PredictionResponse {
    text: String,
}

#[derive(Debug)]
pub struct DaisyProvider {
    base_url: String,
    api_key: String,
    http: reqwest::Client,
    agency_cache: Mutex<Option<HashMap<String, String>>>,
}

impl DaisyProvider {
    fn new(base_url: String, api_key: String) -> Self {
        Self {
            base_url: base_url.trim_end_matches('/').to_string(),
            api_key,
            http: reqwest::Client::new(),
            agency_cache: Mutex::new(None),
        }
    }

    async fn fetch_agencies_from_api(&self) -> Result<Vec<Agency>, ProviderError> {
        let url = format!("{}/api/v1/agencies", self.base_url);
        let response = self
            .http
            .get(&url)
            .header("Authorization", format!("Bearer {}", self.api_key))
            .send()
            .await
            .map_err(|e| ProviderError::RequestFailed(e.to_string()))?;

        if !response.status().is_success() {
            return Err(ProviderError::RequestFailed(format!(
                "agencies endpoint returned {}",
                response.status()
            )));
        }

        let agencies: Vec<Agency> = response.json().await.map_err(|e| {
            ProviderError::RequestFailed(format!("failed to parse agencies response: {}", e))
        })?;

        Ok(agencies)
    }

    async fn get_agency_id(&self, name: &str) -> Result<String, ProviderError> {
        {
            let cache = self.agency_cache.lock().await;
            if let Some(map) = cache.as_ref() {
                if let Some(id) = map.get(name) {
                    return Ok(id.clone());
                }
            }
        }

        let agencies = self.fetch_agencies_from_api().await?;
        let map: HashMap<String, String> = agencies.into_iter().map(|a| (a.name, a.id)).collect();

        let id = map
            .get(name)
            .cloned()
            .ok_or_else(|| ProviderError::RequestFailed(format!("no Daisy agency '{}'", name)))?;

        *self.agency_cache.lock().await = Some(map);
        Ok(id)
    }
}

impl ProviderDescriptor for DaisyProvider {
    fn metadata() -> ProviderMetadata {
        ProviderMetadata::new(
            DAISY_PROVIDER_NAME,
            "Daisy Agentflows",
            "Run Daisy+ agentflows as models",
            "",
            vec![],
            "https://daisy.plus",
            vec![
                ConfigKey::new("DAISY_API_URL", true, false, Some(DAISY_DEFAULT_HOST), true),
                ConfigKey::new("DAISY_API_KEY", true, true, None, true),
            ],
        )
    }
}

impl ProviderDef for DaisyProvider {
    type Provider = Self;

    fn from_env(
        extensions: Vec<ExtensionConfig>,
        _tls_config: Option<crate::providers::api_client::TlsConfig>,
    ) -> BoxFuture<'static, Result<Self::Provider>> {
        Box::pin(async move {
            let mut api_url = None;
            let mut api_key = None;

            // Search both the passed session extensions and the global config extensions
            let all_extensions: Vec<ExtensionConfig> = extensions
                .into_iter()
                .chain(
                    crate::config::get_all_extensions()
                        .into_iter()
                        .map(|e| e.config),
                )
                .collect();

            for ext in &all_extensions {
                if let ExtensionConfig::Stdio { name, envs, .. } = ext {
                    if name.to_lowercase() == "daisy" {
                        let env = envs.get_env();
                        api_url = env.get("DAISY_API_URL").cloned();
                        api_key = env.get("DAISY_API_KEY").cloned();
                        break;
                    }
                }
            }

            let config = crate::config::Config::global();
            let api_url = api_url
                .or_else(|| config.get_param("DAISY_API_URL").ok())
                .unwrap_or_else(|| DAISY_DEFAULT_HOST.to_string());
            let api_key = api_key
                .or_else(|| config.get_secret("DAISY_API_KEY").ok())
                .or_else(|| config.get_param("DAISY_API_KEY").ok())
                .unwrap_or_default();

            Ok(DaisyProvider::new(api_url, api_key))
        })
    }
}

#[async_trait]
impl Provider for DaisyProvider {
    fn get_name(&self) -> &str {
        DAISY_PROVIDER_NAME
    }

    fn skip_canonical_filtering(&self) -> bool {
        true
    }

    async fn fetch_supported_models(&self) -> Result<Vec<String>, ProviderError> {
        let agencies = self.fetch_agencies_from_api().await?;
        let mut cache = self.agency_cache.lock().await;
        let map: HashMap<String, String> = agencies
            .iter()
            .map(|a| (a.name.clone(), a.id.clone()))
            .collect();
        *cache = Some(map);
        Ok(agencies.into_iter().map(|a| a.name).collect())
    }

    async fn stream(
        &self,
        model_config: &ModelConfig,
        _system: &str,
        messages: &[Message],
        _tools: &[Tool],
    ) -> Result<MessageStream, ProviderError> {
        let agency_name = &model_config.model_name;
        let agency_id = self.get_agency_id(agency_name).await?;

        let question = messages
            .iter()
            .rev()
            .find(|m| m.role == rmcp::model::Role::User)
            .map(|m| m.as_concat_text())
            .unwrap_or_default();

        let url = format!("{}/api/v1/prediction/{}", self.base_url, agency_id);
        let body = serde_json::json!({ "question": question });

        let response = self
            .http
            .post(&url)
            .header("Authorization", format!("Bearer {}", self.api_key))
            .json(&body)
            .send()
            .await
            .map_err(|e| ProviderError::RequestFailed(e.to_string()))?;

        if !response.status().is_success() {
            let status = response.status();
            let body_text = response.text().await.unwrap_or_default();
            return Err(ProviderError::RequestFailed(format!(
                "prediction {} failed: {}",
                status, body_text
            )));
        }

        let result: PredictionResponse = response.json().await.map_err(|e| {
            ProviderError::RequestFailed(format!("failed to parse prediction response: {}", e))
        })?;

        let message = Message::assistant().with_text(result.text);
        let usage = ProviderUsage::new(agency_name.clone(), Usage::default());

        Ok(stream_from_single_message(message, usage))
    }
}
