IMPORTANT: currently DAISY_ALLOWLIST is used in main.ts in ui/desktop, and not in daisy-server. The following is for reference in case it is used on the server side for launch time enforcement.

# Daisy Extension Allowlist

The allowlist feature provides a security mechanism for controlling which MCP commands can be used by daisy. 
By default, daisy will let you run any MCP via any command, which isn't always desired.

## How It Works

1. When enabled, Daisy will only allow execution of commands that match entries in the allowlist
2. Commands not in the allowlist will be rejected with an error message
3. The allowlist is fetched from a URL specified by the `DAISY_ALLOWLIST` environment variable and cached while running.

## Setup

Set the `DAISY_ALLOWLIST` environment variable to the URL of your allowlist YAML file:

```bash
export DAISY_ALLOWLIST=https://example.com/daisy-allowlist.yaml
```

If this environment variable is not set, no allowlist restrictions will be applied (all commands will be allowed).

## Bypassing the Allowlist

In certain development or testing scenarios, you may need to bypass the allowlist restrictions. You can do this by setting the `DAISY_ALLOWLIST_BYPASS` environment variable to `true`:

```bash
# For the GUI, you can have it show a warning instead of blocking (but it will always show a warning):
export DAISY_ALLOWLIST_WARNING=true
```


When this environment variable is set to `true` (case insensitive), the allowlist check will be bypassed and all commands will be allowed, even if the `DAISY_ALLOWLIST` environment variable is set.

## Allowlist File Format

The allowlist file should be a YAML file with the following structure:

```yaml
extensions:
  - id: extension-id-1
    command: command-name-1
  - id: extension-id-2
    command: command-name-2
```

Example:

```yaml
extensions:
  - id: slack
    command: uvx mcp_slack
  - id: github
    command: uvx mcp_github
  - id: jira
    command: uvx mcp_jira
```

Note that the command should be the full command to launch the MCP (environment variables are provided for context by daisy). Additional arguments will be rejected (to avoid injection attacks)