---
title: Quick Daisy Tips
sidebar_position: 6
sidebar_label: Quick Tips
description: Best practices for working with Daisy
---

### Daisy works on your behalf
Daisy is an AI agent, which means you can prompt Daisy to perform tasks for you like opening applications, running shell commands, automating workflows, writing code, browsing the web, and more.

### Prompt Daisy using natural language
You don't need fancy language or special syntax to prompt Daisy. Talk with Daisy like you would talk to a friend. You can even use slang or say please and thank you; Daisy will understand.

### Extend Daisy's capabilities to any application
Daisy's capabilities are extensible. As an [MCP](https://modelcontextprotocol.io/) client, Daisy can connect to your apps and services through [extensions](/extensions), allowing it to work across your entire workflow.

### Choose how much control Daisy has
You can customize how much [supervision](/docs/guides/daisy-permissions) Daisy needs. Choose between full autonomy, requiring approval before actions, or simply chatting without any actions.

### Choose the right LLM
Your experience with Daisy is shaped by your [choice of LLM](/blog/2025/03/31/daisy-benchmark), as it handles all the planning while Daisy manages the execution. When choosing an LLM, consider its tool support, specific capabilities, and associated costs.

### Keep sessions short
LLMs have context windows, which are limits on how much conversation history they can retain. Once exceeded, they may forget earlier parts of the conversation. Monitor your token usage and [start new sessions](/docs/guides/sessions/session-management) as needed.

### Turn off unnecessary extensions or tool
Turning on too many extensions can degrade performance. Enable only essential [extensions and tools](/docs/guides/managing-tools/tool-permissions) to improve tool selection accuracy, save context window space, and stay within provider tool limits.

### Teach Daisy your preferences
Help Daisy remember how you like to work by using [`.daisyhints` or other context files](/docs/guides/using-daisyhints/) for permanent project preferences and the [Memory extension](/docs/mcp/memory-mcp) for things you want Daisy to dynamically recall later. Both can help save valuable context window space while keeping your preferences available.

### Protect sensitive files
Daisy is often eager to make changes. You can stop it from changing specific files by creating a [.daisyignore](/docs/guides/using-daisyignore) file. In this file, you can list all the file paths you want it to avoid.

### Version Control
Commit your code changes early and often. This allows you to rollback any unexpected changes.

### Control which extensions Daisy can use
Administrators can use an [allowlist](/docs/guides/allowlist) to restrict Daisy to approved extensions only. This helps prevent risky installs from unknown MCP servers.

### Set up starter templates
You can turn a successful session into a reusable "[recipe](/docs/guides/recipes/session-recipes)" to share with others or use again later—no need to start from scratch.

### Embrace an experimental mindset
You don’t need to get it right the first time. Iterating on prompts and tools is part of the workflow.

### Keep Daisy updated
Regularly [update](/docs/guides/updating-daisy) Daisy to benefit from the latest features, bug fixes, and performance improvements.
