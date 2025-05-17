[Skip to content](#conceptual-guide)

**Help us build the JS tools that power AI apps at companies like Replit, Uber, LinkedIn, GitLab, and more. [Join our team!](https://jobs.ashbyhq.com/langchain/05efa205-8560-43fd-bfcc-3f7697561cfb?utm_source=https%3A%2F%2Flangchain-ai.github.io%2Flanggraphjs%2F&utm_campaign=langgraphjs_docs)**

[![logo](../static/wordmark_dark.svg)
![logo](../static/wordmark_light.svg)](..)

Concepts

Initializing search

[GitHub](https://github.com/langchain-ai/langgraphjs "Go to repository")

* [LangGraph](..)
* [Agents](../agents/overview/)
* [API reference](../reference/)
* [Versions](../versions/)

[![logo](../static/wordmark_dark.svg)
![logo](../static/wordmark_light.svg)](..)

[GitHub](https://github.com/langchain-ai/langgraphjs "Go to repository")

* [LangGraph](..)

  LangGraph
  + Get started

    Get started
    - [Learn the basics](../tutorials/quickstart/)
    - [Deployment](../tutorials/deployment/)
  + Guides

    Guides
    - [How-to Guides](../how-tos/)
    - [Concepts](./)

      Concepts
      * [LangGraph](../concepts#langgraph)
      * [LangGraph Platform](../concepts#langgraph-platform)
    - [Tutorials](../tutorials/)
  + Resources

    Resources
    - [Adopters](../adopters/)
    - [LLMS-txt](../llms-txt-overview/)
    - [FAQ](faq/)
    - [Troubleshooting](../troubleshooting/errors/)
    - [LangGraph Academy Course](https://academy.langchain.com/courses/intro-to-langgraph)
* [Agents](../agents/overview/)
* [API reference](../reference/)
* [Versions](../versions/)

Table of contents

* [LangGraph](#langgraph)

  + [High Level](#high-level)
  + [Concepts](#concepts)
* [LangGraph Platform](#langgraph-platform)

  + [High Level](#high-level_1)
  + [Components](#components)
  + [LangGraph Server](#langgraph-server)
  + [Deployment Options](#deployment-options)

1. [LangGraph](..)
2. [Guides](../how-tos/)
3. [Concepts](./)

# Conceptual Guide[¶](#conceptual-guide "Permanent link")

This guide provides explanations of the key concepts behind the LangGraph framework and AI applications more broadly.

We recommend that you go through at least the [Quick Start](../tutorials/quickstart/) before diving into the conceptual guide. This will provide practical context that will make it easier to understand the concepts discussed here.

The conceptual guide does not cover step-by-step instructions or specific implementation examples — those are found in the [Tutorials](../tutorials/) and [How-to guides](../how-tos/). For detailed reference material, please see the [API reference](https://langchain-ai.github.io/langgraphjs/reference/).

## LangGraph[¶](#langgraph "Permanent link")

### High Level[¶](#high-level "Permanent link")

* [Why LangGraph?](high_level/): A high-level overview of LangGraph and its goals.

### Concepts[¶](#concepts "Permanent link")

* [LangGraph Glossary](low_level/): LangGraph workflows are designed as graphs, with nodes representing different components and edges representing the flow of information between them. This guide provides an overview of the key concepts associated with LangGraph graph primitives.
* [Common Agentic Patterns](agentic_concepts/): An agent uses an LLM to pick its own control flow to solve more complex problems! Agents are a key building block in many LLM applications. This guide explains the different types of agent architectures and how they can be used to control the flow of an application.
* [Multi-Agent Systems](multi_agent/): Complex LLM applications can often be broken down into multiple agents, each responsible for a different part of the application. This guide explains common patterns for building multi-agent systems.
* [Breakpoints](breakpoints/): Breakpoints allow pausing the execution of a graph at specific points. Breakpoints allow stepping through graph execution for debugging purposes.
* [Human-in-the-Loop](human_in_the_loop/): Explains different ways of integrating human feedback into a LangGraph application.
* [Time Travel](time-travel/): Time travel allows you to replay past actions in your LangGraph application to explore alternative paths and debug issues.
* [Persistence](persistence/): LangGraph has a built-in persistence layer, implemented through checkpointers. This persistence layer helps to support powerful capabilities like human-in-the-loop, memory, time travel, and fault-tolerance.
* [Memory](memory/): Memory in AI applications refers to the ability to process, store, and effectively recall information from past interactions. With memory, your agents can learn from feedback and adapt to users' preferences.
* [Streaming](streaming/): Streaming is crucial for enhancing the responsiveness of applications built on LLMs. By displaying output progressively, even before a complete response is ready, streaming significantly improves user experience (UX), particularly when dealing with the latency of LLMs.
* [Functional API](functional_api/): An alternative to [Graph API (StateGraph)](low_level/#stategraph) for development in LangGraph.
* [FAQ](faq/): Frequently asked questions about LangGraph.

## LangGraph Platform[¶](#langgraph-platform "Permanent link")

LangGraph Platform is a commercial solution for deploying agentic applications in production, built on the open-source LangGraph framework.

The LangGraph Platform offers a few different deployment options described in the [deployment options guide](deployment_options/).

Tip

* LangGraph is an MIT-licensed open-source library, which we are committed to maintaining and growing for the community.
* You can always deploy LangGraph applications on your own infrastructure using the open-source LangGraph project without using LangGraph Platform.

### High Level[¶](#high-level_1 "Permanent link")

* [Why LangGraph Platform?](langgraph_platform/): The LangGraph platform is an opinionated way to deploy and manage LangGraph applications. This guide provides an overview of the key features and concepts behind LangGraph Platform.
* [Deployment Options](deployment_options/): LangGraph Platform offers four deployment options: [Self-Hosted Lite](self_hosted/#self-hosted-lite), [Self-Hosted Enterprise](self_hosted/#self-hosted-enterprise), [bring your own cloud (BYOC)](bring_your_own_cloud/), and [Cloud SaaS](langgraph_cloud/). This guide explains the differences between these options, and which Plans they are available on.
* [Plans](plans/): LangGraph Platforms offer three different plans: Developer, Plus, Enterprise. This guide explains the differences between these options, what deployment options are available for each, and how to sign up for each one.
* [Template Applications](template_applications/): Reference applications designed to help you get started quickly when building with LangGraph.

### Components[¶](#components "Permanent link")

The LangGraph Platform comprises several components that work together to support the deployment and management of LangGraph applications:

* [LangGraph Server](langgraph_server/): The LangGraph Server is designed to support a wide range of agentic application use cases, from background processing to real-time interactions.
* [LangGraph Studio](langgraph_studio/): LangGraph Studio is a specialized IDE that can connect to a LangGraph Server to enable visualization, interaction, and debugging of the application locally.
* [LangGraph CLI](langgraph_cli/): LangGraph CLI is a command-line interface that helps to interact with a local LangGraph
* [Python/JS SDK](sdk/): The Python/JS SDK provides a programmatic way to interact with deployed LangGraph Applications.
* [Remote Graph](../how-tos/use-remote-graph/): A RemoteGraph allows you to interact with any deployed LangGraph application as though it were running locally.

### LangGraph Server[¶](#langgraph-server "Permanent link")

* [Application Structure](application_structure/): A LangGraph application consists of one or more graphs, a LangGraph API Configuration file (`langgraph.json`), a file that specifies dependencies, and environment variables.
* [Assistants](assistants/): Assistants are a way to save and manage different configurations of your LangGraph applications.
* [Web-hooks](langgraph_server/#webhooks): Webhooks allow your running LangGraph application to send data to external services on specific events.
* [Cron Jobs](langgraph_server/#cron-jobs): Cron jobs are a way to schedule tasks to run at specific times in your LangGraph application.
* [Double Texting](double_texting/): Double texting is a common issue in LLM applications where users may send multiple messages before the graph has finished running. This guide explains how to handle double texting with LangGraph Deploy.
* [Authentication & Access Control](auth/): Learn about options for authentication and access control when deploying the LangGraph Platform.

### Deployment Options[¶](#deployment-options "Permanent link")

* [Self-Hosted Lite](self_hosted/): A free (up to 1 million nodes executed), limited version of LangGraph Platform that you can run locally or in a self-hosted manner
* [Cloud SaaS](langgraph_cloud/): Hosted as part of LangSmith.
* [Bring Your Own Cloud](bring_your_own_cloud/): We manage the infrastructure, so you don't have to, but the infrastructure all runs within your cloud.
* [Self-Hosted Enterprise](self_hosted/): Completely managed by you.

Was this page helpful?

Thanks for your feedback!

Thanks for your feedback! Please help us improve this page by adding to the discussion below.

Back to top

[Previous

Add node to dataset](../cloud/how-tos/datasets_studio/)
[Next

Why LangGraph?](high_level/)

Copyright © 2025 LangChain, Inc | [Consent Preferences](#__consent)

Made with
[Material for MkDocs Insiders](https://squidfunk.github.io/mkdocs-material/)

#### Cookie consent

We use cookies to recognize your repeated visits and preferences, as well as to measure the effectiveness of our documentation and whether users find what they're searching for. **Clicking "Accept" makes our documentation better. Thank you!** ❤️

* Google Analytics
* GitHub

Accept
Reject