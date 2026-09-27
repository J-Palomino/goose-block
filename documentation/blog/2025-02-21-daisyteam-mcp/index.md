---
title: Let A Team of AI Agents Do It For You
description: Community Spotlight on Cliff Hall's DaisyTeam MCP server.
authors: 
    - tania
---

![blog banner](daisyteam-mcp.png)

During our [previous livestream](https://youtu.be/9tq-QUnE29U), Aaron Goldsmith, Infrastructure Operations Engineer at Cash App, showed a team of Daisy AI agents collaborating in real time to create a website. Our community loved it so much, Cliff Hall was inspired to iterate on that idea and create a DaisyTeam MCP server.

<!--truncate-->

## The Original Protocol

Aaron Goldsmith made an AI agent team consisting of multiple Daisy instances a reality with his lightweight [Agent Communication Protocol](https://gist.github.com/AaronGoldsmith/114c439ae67e4f4c47cc33e829c82fac). With it, each Daisy agent enters the chat, gets assigned a role (e.g. Project Coordinator, Researcher, Web Developer), and works on its part of a given task. The protocol specifies instructions guiding how the agents should talk and behave, allowing multiple Daisy agents to collaborate. It also specifies that communication between the agents should be done via a Python-based websocket server with text/markdown . 

## DaisyTeam MCP Server

Introducing [DaisyTeam](https://github.com/cliffhall/DaisyTeam), created by Software Architect and community member, Cliff Hall. DaisyTeam takes Aaron's protocol and iterates on it into an MCP server and collaboration protocol for Daisy Agents. With features like task management, message storage, and agent waiting, you can have an entire team of Daisy agents work together on a task or project for you.

A Daisy agent with the Project Coordinator role will assign roles to other agents, your connected agents will send messages that can retrieved at any time, and your team of agents will connect to the same MCP server to collaborate together.

![Daisy Agents](daisyteam-agents.png)

## A New Way to Daisy

Working with a team of AI agents on a task is a game changer. Instead of getting confused as to how to improve your prompt engineering on your own or work across sessions manually, tools like Cliff's DaisyTeam or Aaron's Agent Communication Protocol help us make sure AI agents like Daisy are doing the work for us as efficiently as possible. The possibilities feel endless!

## Get Your Contribution Featured
Hopefully this contribution inspired you as much as it inspired our community. If you have a Daisy contribution or project you'd like to share with our community, join our [Discord](https://discord.gg/block-opensource) and share your work in the **#share-your-work** channel. You may just be featured on our livestream or get a cool prize. 👀 You can also star Daisy on GitHub or follow us on social media so you never miss an update from us. Until next time!


<head>
  <meta property="og:title" content="Let A Team of AI Agents Do It For You" />
  <meta property="og:type" content="article" />
  <meta property="og:url" content="https://block.github.io/daisy/blog/2025/02/17/daisyteam-mcp" />
  <meta property="og:description" content="Community Spotlight on Cliff Hall's DaisyTeam MCP server." />
  <meta property="og:image" content="https://block.github.io/daisy/assets/images/daisyteam-mcp-082fa2890c313519c2a1637ca979c219.png" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta property="twitter:domain" content="block.github.io/daisy" />
  <meta name="twitter:title" content="Let A Team of AI Agents Do It For You" />
  <meta name="twitter:description" content="Community Spotlight on Cliff Hall's DaisyTeam MCP server." />
  <meta name="twitter:image" content="https://block.github.io/daisy/assets/images/daisyteam-mcp-082fa2890c313519c2a1637ca979c219.png" />
</head>