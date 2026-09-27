---
sidebar_position: 15
title: Configuration File
sidebar_label: Configuration File
---

# Configuration File

Daisy uses a YAML configuration file to manage settings and extensions. This file is located at:

* macOS/Linux: `~/.config/daisy/config.yaml`
* Windows: `%APPDATA%\Block\daisy\config\config.yaml`

The configuration file allows you to set default behaviors, configure language models, and manage extensions. While many settings can also be set using [environment variables](/docs/guides/environment-variables), the config file provides a persistent way to maintain your preferences.

## Global Settings

The following settings can be configured at the root level of your config.yaml file:

| Setting | Purpose | Values | Default | Required |
|---------|---------|---------|---------|-----------|
| `DAISY_PROVIDER` | Primary [LLM provider](/docs/getting-started/providers) | "anthropic", "openai", etc. | None | Yes |
| `DAISY_MODEL` | Default model to use | Model name (e.g., "claude-3.5-sonnet", "gpt-4") | None | Yes |
| `DAISY_TEMPERATURE` | Model response randomness | Float between 0.0 and 1.0 | Model-specific | No |
| `DAISY_MODE` | [Tool execution behavior](/docs/guides/daisy-permissions) | "auto", "approve", "chat", "smart_approve" | "smart_approve" | No |
| `DAISY_MAX_TURNS` | [Maximum number of turns](/docs/guides/sessions/smart-context-management#maximum-turns) allowed without user input | Integer (e.g., 10, 50, 100) | 1000 | No |
| `DAISY_LEAD_PROVIDER` | Provider for lead model in [lead/worker mode](/docs/guides/environment-variables#leadworker-model-configuration) | Same as `DAISY_PROVIDER` options | Falls back to `DAISY_PROVIDER` | No |
| `DAISY_LEAD_MODEL` | Lead model for lead/worker mode | Model name | None | No |
| `DAISY_PLANNER_PROVIDER` | Provider for [planning mode](/docs/guides/creating-plans) | Same as `DAISY_PROVIDER` options | Falls back to `DAISY_PROVIDER` | No |
| `DAISY_PLANNER_MODEL` | Model for planning mode | Model name | Falls back to `DAISY_MODEL` | No |
| `DAISY_TOOLSHIM` | Enable tool interpretation | true/false | false | No |
| `DAISY_TOOLSHIM_OLLAMA_MODEL` | Model for tool interpretation | Model name (e.g., "llama3.2") | System default | No |
| `DAISY_CLI_MIN_PRIORITY` | Tool output verbosity | Float between 0.0 and 1.0 | 0.0 | No |
| `DAISY_CLI_THEME` | [Theme](/docs/guides/daisy-cli-commands#themes) for CLI response  markdown | "light", "dark", "ansi" | "dark" | No |
| `DAISY_CLI_SHOW_COST` | Show estimated cost for token use in the CLI | true/false | false | No |
| `DAISY_ALLOWLIST` | URL for allowed extensions | Valid URL | None | No |
| `DAISY_RECIPE_GITHUB_REPO` | GitHub repository for recipes | Format: "org/repo" | None | No |
| `DAISY_AUTO_COMPACT_THRESHOLD` | Set the percentage threshold at which Daisy [automatically summarizes your session](/docs/guides/sessions/smart-context-management#automatic-compaction). | Float between 0.0 and 1.0 (disabled at 0.0)| 0.8 | No |

## Experimental Features

These settings enable experimental features that are in active development. These may change or be removed in future releases.

| Setting | Purpose | Values | Default | Required |
|---------|---------|---------|---------|-----------|
| `ALPHA_FEATURES` | Enables experimental alpha features like [subagents](/docs/experimental/subagents) | true/false | false | No |

Additional [environment variables](/docs/guides/environment-variables) may also be supported in config.yaml.

## Example Configuration

Here's a basic example of a config.yaml file:

```yaml
# Model Configuration
DAISY_PROVIDER: "anthropic"
DAISY_MODEL: "claude-3.5-sonnet"
DAISY_TEMPERATURE: 0.7

# Planning Configuration
DAISY_PLANNER_PROVIDER: "openai"
DAISY_PLANNER_MODEL: "gpt-4"

# Tool Configuration
DAISY_MODE: "smart_approve"
DAISY_TOOLSHIM: true
DAISY_CLI_MIN_PRIORITY: 0.2

# Recipe Configuration
DAISY_RECIPE_GITHUB_REPO: "block/daisy-recipes"

# Experimental Features
ALPHA_FEATURES: true

# Extensions Configuration
extensions:
  developer:
    bundled: true
    enabled: true
    name: developer
    timeout: 300
    type: builtin
  
  memory:
    bundled: true
    enabled: true
    name: memory
    timeout: 300
    type: builtin
```

## Extensions Configuration

Extensions are configured under the `extensions` key. Each extension can have the following settings:

```yaml
extensions:
  extension_name:
    bundled: true/false        # Whether it's included with Daisy
    display_name: "Name"       # Human-readable name (optional)
    enabled: true/false        # Whether the extension is active
    name: "extension_name"     # Internal name
    timeout: 300              # Operation timeout in seconds
    type: "builtin"/"stdio"   # Extension type
    
    # Additional settings for stdio extensions:
    cmd: "command"            # Command to execute
    args: ["arg1", "arg2"]    # Command arguments
    description: "text"       # Extension description
    env_keys: []             # Required environment variables
    envs: {}                 # Environment values
```

## Configuration Priority

Settings are applied in the following order of precedence:

1. Environment variables (highest priority)
2. Config file settings
3. Default values (lowest priority)

## Security Considerations

- Avoid storing sensitive information (API keys, tokens) in the config file
- Use the system keyring for storing secrets
- If keyring is disabled, secrets are stored in a separate `secrets.yaml` file

## Updating Configuration

Changes to the config file require restarting Daisy to take effect. You can verify your current configuration using:

```bash
daisy info -v
```

This will show all active settings and their current values.

## See Also

- [Environment Variables](./environment-variables.md) - For environment variable configuration
- [Using Extensions](/docs/getting-started/using-extensions.md) - For more details on extension configuration
- [Creating Plans](./creating-plans.md) - For information about planning mode configuration