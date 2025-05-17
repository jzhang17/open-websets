[Skip to content](#agent-development-with-langgraph)

**Help us build the JS tools that power AI apps at companies like Replit, Uber, LinkedIn, GitLab, and more. [Join our team!](https://jobs.ashbyhq.com/langchain/05efa205-8560-43fd-bfcc-3f7697561cfb?utm_source=https%3A%2F%2Flangchain-ai.github.io%2Flanggraphjs%2F&utm_campaign=langgraphjs_docs)**

[![logo](../../static/wordmark_dark.svg)
![logo](../../static/wordmark_light.svg)](../..)

Overview

Initializing search

[GitHub](https://github.com/langchain-ai/langgraphjs "Go to repository")

* [LangGraph](../..)
* [Agents](./)
* [API reference](../../reference/)
* [Versions](../../versions/)

[![logo](../../static/wordmark_dark.svg)
![logo](../../static/wordmark_light.svg)](../..)

[GitHub](https://github.com/langchain-ai/langgraphjs "Go to repository")

* [LangGraph](../..)
* Agents

  Agents
  + Overview

    [Overview](./)

    Table of contents
    - [Key features](#key-features)
    - [High-level building blocks](#high-level-building-blocks)
    - [Package ecosystem](#package-ecosystem)
  + Get started

    Get started
    - [Agents](../agents/)
  + Documentation

    Documentation
    - [Running agents](../run_agents/)
    - [Streaming](../streaming/)
    - [Models](../models/)
    - [Tools](../tools/)
    - [MCP Integration](../mcp/)
    - [Context](../context/)
    - [Memory](../memory/)
    - [Human-in-the-loop](../human-in-the-loop/)
    - [Multi-agent](../multi-agent/)
    - [Evals](../evals/)
    - [Deployment](../deployment/)
    - [UI](../ui/)
  + Resources

    Resources
    - [Community Agents](../prebuilt/)
* [API reference](../../reference/)
* [Versions](../../versions/)

Table of contents

* [Key features](#key-features)
* [High-level building blocks](#high-level-building-blocks)
* [Package ecosystem](#package-ecosystem)

# Agent development with LangGraph[¶](#agent-development-with-langgraph "Permanent link")

**LangGraph** provides both low-level primitives and high-level prebuilt components for building agent-based applications. This section focuses on the **prebuilt**, **reusable** components designed to help you construct agentic systems quickly and reliably—without the need to implement orchestration, memory, or human feedback handling from scratch.

## Key features[¶](#key-features "Permanent link")

LangGraph includes several capabilities essential for building robust, production-ready agentic systems:

* [**Memory integration**](../memory/): Native support for *short-term* (session-based) and *long-term* (persistent across sessions) memory, enabling stateful behaviors in chatbots and assistants.
* [**Human-in-the-loop control**](../human-in-the-loop/): Execution can pause *indefinitely* to await human feedback—unlike websocket-based solutions limited to real-time interaction. This enables asynchronous approval, correction, or intervention at any point in the workflow.
* [**Streaming support**](../streaming/): Real-time streaming of agent state, model tokens, tool outputs, or combined streams.
* [**Deployment tooling**](../deployment/): Includes infrastructure-free deployment tools. [**LangGraph Platform**](https://langchain-ai.github.io/langgraph/concepts/langgraph_platform/) supports testing, debugging, and deployment.
  + **[Studio](https://langchain-ai.github.io/langgraph/concepts/langgraph_studio/)**: A visual IDE for inspecting and debugging workflows.
  + Supports multiple [**deployment options**](https://langchain-ai.github.io/langgraph/tutorials/deployment/) for production.

## High-level building blocks[¶](#high-level-building-blocks "Permanent link")

LangGraph comes with a set of prebuilt components that implement common agent behaviors and workflows. These abstractions are built on top of the LangGraph framework, offering a faster path to production while remaining flexible for advanced customization.

Using LangGraph for agent development allows you to focus on your application's logic and behavior, instead of building and maintaining the supporting infrastructure for state, memory, and human feedback.

## Package ecosystem[¶](#package-ecosystem "Permanent link")

The high-level components are organized into several packages, each with a specific focus.

| Package | Description | Installation |
| --- | --- | --- |
| `langgraph` | Prebuilt components to [**create agents**](../agents/) | `npm install @langchain/langgraph @langchain/core` |
| `langgraph-supervisor` | Tools for building [**supervisor**](../multi-agent/#supervisor) agents | `npm install @langchain/langgraph-supervisor` |
| `langgraph-swarm` | Tools for building a [**swarm**](../multi-agent/#swarm) multi-agent system | `npm install @langchain/langgraph-swarm` |
| `langchain-mcp-adapters` | Interfaces to [**MCP servers**](../mcp/) for tool and resource integration | `npm install @langchain/mcp-adapters` |
| `agentevals` | Utilities to [**evaluate agent performance**](../evals/) | `npm install agentevals` |

Was this page helpful?

Thanks for your feedback!

Thanks for your feedback! Please help us improve this page by adding to the discussion below.

Back to top

[Previous

UNREACHABLE\_NODE](../../troubleshooting/errors/UNREACHABLE_NODE/)
[Next

Agents](../agents/)

Copyright © 2025 LangChain, Inc | [Consent Preferences](#__consent)

Made with
[Material for MkDocs Insiders](https://squidfunk.github.io/mkdocs-material/)

#### Cookie consent

We use cookies to recognize your repeated visits and preferences, as well as to measure the effectiveness of our documentation and whether users find what they're searching for. **Clicking "Accept" makes our documentation better. Thank you!** ❤️

* Google Analytics
* GitHub

Accept
Reject