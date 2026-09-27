---
title: ElevenLabs Extension
description: Add ElevenLabs MCP Server as a Daisy Extension
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import YouTubeShortEmbed from '@site/src/components/YouTubeShortEmbed';
import DaisyDesktopInstaller from '@site/src/components/DaisyDesktopInstaller';

<YouTubeShortEmbed videoUrl="https://www.youtube.com/embed/1Z8XtjQ9El0" />


This tutorial covers how to add the [ElevenLabs MCP Server](https://github.com/yamadashy/repomix) as a Daisy extension to enable AI-powered voice generation, voice cloning, audio editing, and speech-to-text transcription.

:::tip TLDR
<Tabs groupId="interface">
  <TabItem value="ui" label="Daisy Desktop" default>
  [Launch the installer](daisy://extension?cmd=uvx&arg=elevenlabs-mcp&id=elevenlabs&name=ElevenLabs&description=ElevenLabs%20voice%20synthesis%20server&env=ELEVENLABS_API_KEY)
  </TabItem>
  <TabItem value="cli" label="Daisy CLI">
  **Command**
  ```sh
  uvx elevenlabs-mcp
  ```
  </TabItem>
</Tabs>

  **Environment Variable**
  ```
  ELEVENLABS_API_KEY: <YOUR_API_KEY>
  ```
:::

## Configuration

<DaisyDesktopInstaller
  extensionId="elevenlabs"
  extensionName="ElevenLabs"
  description="ElevenLabs voice synthesis server"
  command="uvx"
  args={["elevenlabs-mcp"]}
  envVars={[
    { name: "ELEVENLABS_API_KEY", label: "ElevenLabs API Key" }
  ]}
  apiKeyLink="https://elevenlabs.io/app/settings/api-keys"
  apiKeyLinkText="Get your ElevenLabs API Key"
/>

## Example Usage

In this example, I’ll show you how to use Daisy with the ElevenLabs Extension to create AI-generated voiceovers for a YouTube Short. Daisy will take a sample script I provided, generate a narrated version using different AI voices, and seamlessly switch tones mid-script to match the content flow.

By connecting to the ElevenLabs MCP server, Daisy can transform plain text into natural-sounding speech, offering multiple voice styles and character options — all without any manual recording or editing.

### Daisy Prompt

> Hey Daisy, create a script for me for my youtube short video, I want there to be two different voices. The first voice should cut me off and be a human narrator style and then switch to a cassual AI tone after I read the prompt. Here's an example of a YT short script I've done in the past: 

Wait… Within Seconds, Daisy performed Security Audits Across Multiple Projects?! 🔥

Lets, plug & play to find out how 

Let’s provide Daisy with the command it needs to connect to the Filesystem MCP server extension…

Now lets play 
propmt:  "Hey Daisy, I need to perform a security audit across multiple projects. Let's check for…🔹 Hardcoded Credentials – API keys, passwords, and secrets left in the code.🔹 SQL Injection Risks – Unsafe queries that could expose data.🔹 Insecure Cryptographic Practices – Weak encryption methods that put data at risk.AND🔹 Exposed Config Files – Sensitive information that shouldn't be public.🔹 Outdated Dependencies – Security vulnerabilities in third-party libraries."

Go Daisy, go Daisy!

✅ Daisy scanned the entire codebase across 3 different projects, identified security risks, generated a detailed report with fixes and provided me with step by step instructions on how I can test and verify these code fixes! 

If that’s not amazing idk what is …

🚀 to get started visit block.github.io/daisy_


### Daisy Output

:::note Desktop

I'll create your YouTube script for you using the given script as reference. 

───────────── Text To Speech ─────────────

───────────── Text To Speech ─────────────

───────────── Text To Speech ─────────────

───────────── Text To Speech ─────────────

───────────── Text To Speech ─────────────

───────────── Play Audio  ────────────────

───────────── Play Audio  ────────────────

The script has been created and read aloud using the specified voices and style. The audio files have been saved to your desktop.

Press play and hear it for yourself! 🔊

<audio controls>
  <source src="/daisy/audio/elevenlabs-mcp-demo.mp3" type="audio/mpeg" />
  Your browser does not support the audio element.
</audio>

:::