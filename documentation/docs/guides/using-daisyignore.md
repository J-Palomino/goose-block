---
title: Prevent Daisy from Accessing Files
sidebar_label: Using Daisyignore
sidebar_position: 14
---


`.daisyignore` is a text file that defines patterns for files and directories that Daisy will not access. This means Daisy cannot read, modify, delete, or run shell commands on these files when using the Developer extension's tools.

:::info Developer extension only
The .daisyignore feature currently only affects tools in the [Developer](/docs/mcp/developer-mcp) extension. Other extensions are not restricted by these rules.
:::

This guide will show you how to use `.daisyignore` files to prevent Daisy from changing specific files and directories.

## Creating your `.daisyignore` file

Daisy supports two types of `.daisyignore` files:
- **Global ignore file** - Create a `.daisyignore` file in `~/.config/daisy`. These restrictions will apply to all your sessions with Daisy, regardless of directory.
- **Local ignore file** - Create a `.daisyignore` file at the root of the directory you'd like it applied to. These restrictions will only apply when working in a specific directory.

:::tip
You can use both global and local `.daisyignore` files simultaneously. When both exist, Daisy will combine the restrictions from both files to determine which paths are restricted.
:::

## Example `.daisyignore` file

In your `.daisyignore` file, you can write patterns to match files you want Daisy to ignore. Here are some common patterns:

```plaintext
# Ignore specific files by name
settings.json         # Ignore only the file named "settings.json"

# Ignore files by extension
*.pdf                # Ignore all PDF files
*.config             # Ignore all files ending in .config

# Ignore directories and their contents
backup/              # Ignore everything in the "backup" directory
downloads/           # Ignore everything in the "downloads" directory

# Ignore all files with this name in any directory
**/credentials.json  # Ignore all files named "credentials.json" in any directory

# Complex patterns
*.log                # Ignore all .log files
!error.log           # Except for error.log file
```

## Ignore File Types and Priority
Daisy respects ignore rules from three sources: global `.daisyignore`, local `.daisyignore`, and `.gitignore`. It uses a priority system to determine which files should be ignored. 

### 1. Global `.daisyignore`
- Highest priority and always applied first
- Located at `~/.config/daisy/.daisyignore`
- Affects all projects on your machine

```
~/.config/daisy/
└── .daisyignore      ← Applied to all projects
```

### 2. Local `.daisyignore`
- Project-specific rules
- Located in your project root directory
- Overrides `.gitignore` completely

```
~/.config/daisy/
└── .daisyignore      ← Global rules applied first

Project/
├── .daisyignore      ← Local rules applied second
├── .gitignore        ← Ignored when .daisyignore exists
└── src/
```

### 3. `.gitignore` Fallback
- Used when no local `.daisyignore` exists
- Daisy automatically uses your `.gitignore` rules
- If a global `.daisyignore` file exists, those rules will be applied in addition to the `.gitignore` patterns.

```
Project/
├── .gitignore        ← Used by Daisy (when no local .daisyignore)
└── src/
```

### 4. Default Patterns
By default, if you haven't created any .daisyignore files and no .gitignore file exists, Daisy will not modify files matching these patterns:
```plaintext
**/.env
**/.env.*
**/secrets.*
```

## Common use cases

Here are some typical scenarios where `.daisyignore` is helpful:

- **Generated Files**: Prevent Daisy from modifying auto-generated code or build outputs
- **Third-Party Code**: Keep Daisy from changing external libraries or dependencies
- **Important Configurations**: Protect critical configuration files from accidental modifications
- **Version Control**: Prevent changes to version control files like `.git` directory
- **Existing Projects**: Most projects already have `.gitignore` files that work automatically as ignore patterns for Daisy
- **Custom Restrictions**: Create `.daisyignore` when you need different patterns than your `.gitignore` (e.g., allowing Daisy to read files that Git ignores)