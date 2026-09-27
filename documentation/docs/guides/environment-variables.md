---
sidebar_position: 20
title: Environment Variables
sidebar_label: Environment Variables
---

Daisy supports various environment variables that allow you to customize its behavior. This guide provides a comprehensive list of available environment variables grouped by their functionality.

## Model Configuration

These variables control the [language models](/docs/getting-started/providers) and their behavior.

### Basic Provider Configuration

These are the minimum required variables to get started with Daisy.

| Variable | Purpose | Values | Default |
|----------|---------|---------|---------|
| `DAISY_PROVIDER` | Specifies the LLM provider to use | [See available providers](/docs/getting-started/providers#available-providers) | None (must be [configured](/docs/getting-started/providers#configure-provider)) |
| `DAISY_MODEL` | Specifies which model to use from the provider | Model name (e.g., "gpt-4", "claude-sonnet-4-20250514") | None (must be configured) |
| `DAISY_TEMPERATURE` | Sets the [temperature](https://medium.com/@kelseyywang/a-comprehensive-guide-to-llm-temperature-%EF%B8%8F-363a40bbc91f) for model responses | Float between 0.0 and 1.0 | Model-specific default |

**Examples**

```bash
# Basic model configuration
export DAISY_PROVIDER="anthropic"
export DAISY_MODEL="claude-sonnet-4-20250514"
export DAISY_TEMPERATURE=0.7
```

### Advanced Provider Configuration

These variables are needed when using custom endpoints, enterprise deployments, or specific provider implementations.

| Variable | Purpose | Values | Default |
|----------|---------|---------|---------|
| `DAISY_PROVIDER__TYPE` | The specific type/implementation of the provider | [See available providers](/docs/getting-started/providers#available-providers) | Derived from DAISY_PROVIDER |
| `DAISY_PROVIDER__HOST` | Custom API endpoint for the provider | URL (e.g., "https://api.openai.com") | Provider-specific default |
| `DAISY_PROVIDER__API_KEY` | Authentication key for the provider | API key string | None |

**Examples**

```bash
# Advanced provider configuration
export DAISY_PROVIDER__TYPE="anthropic"
export DAISY_PROVIDER__HOST="https://api.anthropic.com"
export DAISY_PROVIDER__API_KEY="your-api-key-here"
```

### Lead/Worker Model Configuration

These variables configure a [lead/worker model pattern](/docs/tutorials/lead-worker) where a powerful lead model handles initial planning and complex reasoning, then switches to a faster/cheaper worker model for execution. The switch happens automatically based on your settings.

| Variable | Purpose | Values | Default |
|----------|---------|---------|---------|
| `DAISY_LEAD_MODEL` | **Required to enable lead mode.** Name of the lead model | Model name (e.g., "gpt-4o", "claude-sonnet-4-20250514") | None |
| `DAISY_LEAD_PROVIDER` | Provider for the lead model | [See available providers](/docs/getting-started/providers#available-providers) | Falls back to `DAISY_PROVIDER` |
| `DAISY_LEAD_TURNS` | Number of initial turns using the lead model before switching to the worker model | Integer | 3 |
| `DAISY_LEAD_FAILURE_THRESHOLD` | Consecutive failures before fallback to the lead model | Integer | 2 |
| `DAISY_LEAD_FALLBACK_TURNS` | Number of turns to use the lead model in fallback mode | Integer | 2 |

A _turn_ is one complete prompt-response interaction. Here's how it works with the default settings:
- Use the lead model for the first 3 turns
- Use the worker model starting on the 4th turn
- Fallback to the lead model if the worker model struggles for 2 consecutive turns
- Use the lead model for 2 turns and then switch back to the worker model

The lead model and worker model names are displayed at the start of the Daisy CLI session. If you don't export a `DAISY_MODEL` for your session, the worker model defaults to the `DAISY_MODEL` in your [configuration file](/docs/guides/config-file).

**Examples**

```bash
# Basic lead/worker setup
export DAISY_LEAD_MODEL="o4"

# Advanced lead/worker configuration
export DAISY_LEAD_MODEL="claude4-opus"
export DAISY_LEAD_PROVIDER="anthropic"
export DAISY_LEAD_TURNS=5
export DAISY_LEAD_FAILURE_THRESHOLD=3
export DAISY_LEAD_FALLBACK_TURNS=2
```

### Planning Mode Configuration

These variables control Daisy's [planning functionality](/docs/guides/creating-plans).

| Variable | Purpose | Values | Default |
|----------|---------|---------|---------|
| `DAISY_PLANNER_PROVIDER` | Specifies which provider to use for planning mode | [See available providers](/docs/getting-started/providers#available-providers) | Falls back to DAISY_PROVIDER |
| `DAISY_PLANNER_MODEL` | Specifies which model to use for planning mode | Model name (e.g., "gpt-4", "claude-sonnet-4-20250514")| Falls back to DAISY_MODEL |

**Examples**

```bash
# Planning mode with different model
export DAISY_PLANNER_PROVIDER="openai"
export DAISY_PLANNER_MODEL="gpt-4"
```

### Provider Retries

Configurable retry parameters for LLM providers. 

#### AWS Bedrock

| Variable | Purpose | Default |
|---------------------|-------------|---------|
| `BEDROCK_MAX_RETRIES` | The max number of retry attempts before giving up | 6 |
| `BEDROCK_INITIAL_RETRY_INTERVAL_MS` | How long to wait (in milliseconds) before the first retry | 2000 |
| `BEDROCK_BACKOFF_MULTIPLIER` | The factor by which the retry interval increases after each attempt | 2 (doubles every time) |
| `BEDROCK_MAX_RETRY_INTERVAL_MS` | The cap on the retry interval in milliseconds |  120000 |

**Examples**

```bash
export BEDROCK_MAX_RETRIES=10                    # 10 retry attempts
export BEDROCK_INITIAL_RETRY_INTERVAL_MS=1000    # start with 1 second before first retry
export BEDROCK_BACKOFF_MULTIPLIER=3              # each retry waits 3x longer than the previous
export BEDROCK_MAX_RETRY_INTERVAL_MS=300000      # cap the maximum retry delay at 5 min
```

#### Databricks

| Variable | Purpose | Default |
|---------------------|-------------|---------|
| `DATABRICKS_MAX_RETRIES` | The max number of retry attempts before giving up | 3 |
| `DATABRICKS_INITIAL_RETRY_INTERVAL_MS` | How long to wait (in milliseconds) before the first retry | 1000 |
| `DATABRICKS_BACKOFF_MULTIPLIER` | The factor by which the retry interval increases after each attempt | 2 (doubles every time) |
| `DATABRICKS_MAX_RETRY_INTERVAL_MS` | The cap on the retry interval in milliseconds |  30000 |

**Examples**

```bash
export DATABRICKS_MAX_RETRIES=5                      # 5 retry attempts
export DATABRICKS_INITIAL_RETRY_INTERVAL_MS=500      # start with 0.5 second before first retry
export DATABRICKS_BACKOFF_MULTIPLIER=2               # each retry waits 2x longer than the previous
export DATABRICKS_MAX_RETRY_INTERVAL_MS=60000        # cap the maximum retry delay at 1 min
```


## Session Management

These variables control how Daisy manages conversation sessions and context.

| Variable | Purpose | Values | Default |
|----------|---------|---------|---------|
| `DAISY_CONTEXT_STRATEGY` | Controls how Daisy handles context limit exceeded situations | "summarize", "truncate", "clear", "prompt" | "prompt" (interactive), "summarize" (headless) |
| `DAISY_MAX_TURNS` | [Maximum number of turns](/docs/guides/sessions/smart-context-management#maximum-turns) allowed without user input | Integer (e.g., 10, 50, 100) | 1000 |
| `CONTEXT_FILE_NAMES` | Specifies custom filenames for [hint/context files](/docs/guides/using-daisyhints#custom-context-files) | JSON array of strings (e.g., `["CLAUDE.md", ".daisyhints"]`) | `[".daisyhints"]` |
| `DAISY_CLI_THEME` | [Theme](/docs/guides/daisy-cli-commands#themes) for CLI response  markdown | "light", "dark", "ansi" | "dark" |
| `DAISY_SCHEDULER_TYPE` | Controls which scheduler Daisy uses for [scheduled recipes](/docs/guides/recipes/session-recipes.md#schedule-recipe) | "legacy" or "temporal" | "legacy" (Daisy's built-in cron scheduler) | 
| `DAISY_TEMPORAL_BIN` | Optional custom path to your Temporal binary | /path/to/temporal-service | None |
| `DAISY_RANDOM_THINKING_MESSAGES` | Controls whether to show amusing random messages during processing | "true", "false" | "true" |
| `DAISY_CLI_SHOW_COST` | Toggles display of model cost estimates in CLI output | "true", "1" (case insensitive) to enable | false |
| `DAISY_AUTO_COMPACT_THRESHOLD` | Set the percentage threshold at which Daisy [automatically summarizes your session](/docs/guides/sessions/smart-context-management#automatic-compaction). | Float between 0.0 and 1.0 (disabled at 0.0) | 0.8 |

**Examples**

```bash
# Automatically summarize when context limit is reached
export DAISY_CONTEXT_STRATEGY=summarize

# Always prompt user to choose (default for interactive mode)
export DAISY_CONTEXT_STRATEGY=prompt

# Set a low limit for step-by-step control
export DAISY_MAX_TURNS=5

# Set a moderate limit for controlled automation
export DAISY_MAX_TURNS=25

# Set a reasonable limit for production
export DAISY_MAX_TURNS=100

# Use multiple context files
export CONTEXT_FILE_NAMES='["CLAUDE.md", ".daisyhints", ".cursorrules", "project_rules.txt"]'

# Set the ANSI theme for the session
export DAISY_CLI_THEME=ansi

# Use Temporal for scheduled recipes
export DAISY_SCHEDULER_TYPE=temporal

# Custom Temporal binary (optional)
export DAISY_TEMPORAL_BIN=/path/to/temporal-service

# Disable random thinking messages for less distraction
export DAISY_RANDOM_THINKING_MESSAGES=false

# Enable model cost display in CLI
export DAISY_CLI_SHOW_COST=true

# Automatically compact sessions when 60% of available tokens are used
export DAISY_AUTO_COMPACT_THRESHOLD=0.6
```

### Model Context Limit Overrides

These variables allow you to override the default context window size (token limit) for your models. This is particularly useful when using [LiteLLM proxies](https://docs.litellm.ai/docs/providers/litellm_proxy) or custom models that don't match Daisy's predefined model patterns.

| Variable | Purpose | Values | Default |
|----------|---------|---------|---------|
| `DAISY_CONTEXT_LIMIT` | Override context limit for the main model | Integer (number of tokens) | Model-specific default or 128,000 |
| `DAISY_LEAD_CONTEXT_LIMIT` | Override context limit for the lead model in [lead/worker mode](/docs/tutorials/lead-worker) | Integer (number of tokens) | Falls back to `DAISY_CONTEXT_LIMIT` or model default |
| `DAISY_WORKER_CONTEXT_LIMIT` | Override context limit for the worker model in lead/worker mode | Integer (number of tokens) | Falls back to `DAISY_CONTEXT_LIMIT` or model default |
| `DAISY_PLANNER_CONTEXT_LIMIT` | Override context limit for the [planner model](/docs/guides/creating-plans) | Integer (number of tokens) | Falls back to `DAISY_CONTEXT_LIMIT` or model default |

**Examples**

```bash
# Set context limit for main model (useful for LiteLLM proxies)
export DAISY_CONTEXT_LIMIT=200000

# Set different context limits for lead/worker models
export DAISY_LEAD_CONTEXT_LIMIT=500000   # Large context for planning
export DAISY_WORKER_CONTEXT_LIMIT=128000 # Smaller context for execution

# Set context limit for planner
export DAISY_PLANNER_CONTEXT_LIMIT=1000000
```

For more details and examples, see [Model Context Limit Overrides](/docs/guides/sessions/smart-context-management#model-context-limit-overrides).

## Tool Configuration

These variables control how Daisy handles [tool execution](/docs/guides/daisy-permissions) and [tool management](/docs/guides/managing-tools/).

| Variable | Purpose | Values | Default |
|----------|---------|---------|---------|
| `DAISY_MODE` | Controls how Daisy handles tool execution | "auto", "approve", "chat", "smart_approve" | "smart_approve" |
| `DAISY_ENABLE_ROUTER` | Enables [intelligent tool selection strategy](/docs/guides/managing-tools/tool-router) | "true", "false" | "false" |
| `DAISY_TOOLSHIM` | Enables/disables tool call interpretation | "1", "true" (case insensitive) to enable | false |
| `DAISY_TOOLSHIM_OLLAMA_MODEL` | Specifies the model for [tool call interpretation](/docs/experimental/ollama) | Model name (e.g. llama3.2, qwen2.5) | System default |
| `DAISY_CLI_MIN_PRIORITY` | Controls verbosity of [tool output](/docs/guides/managing-tools/adjust-tool-output) | Float between 0.0 and 1.0 | 0.0 |
| `DAISY_CLI_TOOL_PARAMS_TRUNCATION_MAX_LENGTH` | Maximum length for tool parameter values before truncation in CLI output (not in debug mode) | Integer | 40 |

**Examples**

```bash
# Enable intelligent tool selection
export DAISY_ENABLE_ROUTER=true

# Enable tool interpretation
export DAISY_TOOLSHIM=true
export DAISY_TOOLSHIM_OLLAMA_MODEL=llama3.2
export DAISY_MODE="auto"
export DAISY_CLI_MIN_PRIORITY=0.2  # Show only medium and high importance output
export DAISY_CLI_TOOL_PARAMS_MAX_LENGTH=100  # Show up to 100 characters for tool parameters in CLI output
```

### Enhanced Code Editing

These variables configure [AI-powered code editing](/docs/guides/enhanced-code-editing) for the Developer extension's `str_replace` tool. All three variables must be set and non-empty for the feature to activate.

| Variable | Purpose | Values | Default |
|----------|---------|---------|---------|
| `DAISY_EDITOR_API_KEY` | API key for the code editing model | API key string | None |
| `DAISY_EDITOR_HOST` | API endpoint for the code editing model | URL (e.g., "https://api.openai.com/v1") | None |
| `DAISY_EDITOR_MODEL` | Model to use for code editing | Model name (e.g., "gpt-4o", "claude-sonnet-4") | None |

**Examples**

This feature works with any OpenAI-compatible API endpoint, for example:

```bash
# OpenAI configuration
export DAISY_EDITOR_API_KEY="sk-..."
export DAISY_EDITOR_HOST="https://api.openai.com/v1"
export DAISY_EDITOR_MODEL="gpt-4o"

# Anthropic configuration (via OpenAI-compatible proxy)
export DAISY_EDITOR_API_KEY="sk-ant-..."
export DAISY_EDITOR_HOST="https://api.anthropic.com/v1"
export DAISY_EDITOR_MODEL="claude-sonnet-4-20250514"

# Local model configuration
export DAISY_EDITOR_API_KEY="your-key"
export DAISY_EDITOR_HOST="http://localhost:8000/v1"
export DAISY_EDITOR_MODEL="your-model"
```

## Security Configuration

These variables control security related features.

| Variable | Purpose | Values | Default |
|----------|---------|---------|---------|
| `DAISY_ALLOWLIST` | Controls which extensions can be loaded | URL for [allowed extensions](/docs/guides/allowlist) list | Unset |
| `DAISY_DISABLE_KEYRING` | Disables the system keyring for secret storage | Set to any value (e.g., "1", "true", "yes") to disable. The actual value doesn't matter, only whether the variable is set. | Unset (keyring enabled) |

:::tip
When the keyring is disabled, secrets are stored here:

* macOS/Linux: `~/.config/daisy/secrets.yaml`
* Windows: `%APPDATA%\Block\daisy\config\secrets.yaml`
:::

## Langfuse Integration

These variables configure the [Langfuse integration for observability](/docs/tutorials/langfuse).

| Variable | Purpose | Values | Default |
|----------|---------|---------|---------|
| `LANGFUSE_PUBLIC_KEY` | Public key for Langfuse integration | String | None |
| `LANGFUSE_SECRET_KEY` | Secret key for Langfuse integration | String | None |
| `LANGFUSE_URL` | Custom URL for Langfuse service | URL String | Default Langfuse URL |
| `LANGFUSE_INIT_PROJECT_PUBLIC_KEY` | Alternative public key for Langfuse | String | None |
| `LANGFUSE_INIT_PROJECT_SECRET_KEY` | Alternative secret key for Langfuse | String | None |

## Experimental Features

These variables enable experimental features that are in active development. These may change or be removed in future releases. Use with caution in production environments.

| Variable | Purpose | Values | Default |
|----------|---------|---------|---------|
| `ALPHA_FEATURES` | Enables experimental alpha features like [subagents](/docs/experimental/subagents) | "true", "1" (case insensitive) to enable | false |

**Examples**

```bash
# Enable alpha features
export ALPHA_FEATURES=true

# Or enable for a single session
ALPHA_FEATURES=true daisy session
```

## Variables Controlled by Daisy

These variables are automatically set by Daisy during command execution.

| Variable | Purpose | Values | Default |
|----------|---------|---------|---------|
| `DAISY_TERMINAL` | Indicates that a command is being executed by Daisy, enables customizing shell behavior | "1" when set | Unset |

### Customizing Shell Behavior

Sometimes you want Daisy to use different commands or have different shell behavior than your normal terminal usage. For example, you might want Daisy to use a different tool, or prevent Daisy from running long-running development servers that could hang the AI agent. This is most useful when using Daisy CLI, where shell commands are executed directly in your terminal environment.

**How it works:**
1. When Daisy runs commands, `DAISY_TERMINAL` is automatically set to "1"
2. Your shell configuration can detect this and direct Daisy to change its default behavior while keeping your normal terminal usage unchanged

**Example:**

```bash
# In your ~/.bashrc or ~/.zshrc

# Guide Daisy toward better tool choices
if [[ -n "$DAISY_TERMINAL" ]]; then
  alias find="echo 'Use rg instead: rg --files | rg <pattern> for filenames, or rg <pattern> for content search'"
fi
```

## Notes

- Environment variables take precedence over configuration files.
- For security-sensitive variables (like API keys), consider using the system keyring instead of environment variables.
- Some variables may require restarting Daisy to take effect.
- When using the planning mode, if planner-specific variables are not set, Daisy will fall back to the main model configuration.

