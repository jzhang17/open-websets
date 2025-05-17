[Back to documentation](/langgraphjs/)

* Preparing search index...
* The search index is not available

[API Reference](/)

## API Reference

# [🦜🕸️LangGraph.js](#md:🦜🕸️langgraphjs)

[![Docs](https://img.shields.io/badge/docs-latest-blue)](https://langchain-ai.github.io/langgraphjs/)
![Version](https://img.shields.io/npm/v/@langchain/langgraph?logo=npm)
[![Downloads](https://img.shields.io/npm/dm/@langchain/langgraph)](https://www.npmjs.com/package/%40langchain/langgraph)
[![Open Issues](https://img.shields.io/github/issues-raw/langchain-ai/langgraphjs)](https://github.com/langchain-ai/langgraphjs/issues)

> [!NOTE]
> Looking for the Python version? See the [Python repo](https://github.com/langchain-ai/langgraph) and the [Python docs](https://langchain-ai.github.io/langgraph/).

LangGraph — used by Replit, Uber, LinkedIn, GitLab and more — is a low-level orchestration framework for building controllable agents. While langchain provides integrations and composable components to streamline LLM application development, the LangGraph library enables agent orchestration — offering customizable architectures, long-term memory, and human-in-the-loop to reliably handle complex tasks.

```
npm install @langchain/langgraph @langchain/core
Copy
```

To learn more about how to use LangGraph, check out [the docs](https://langchain-ai.github.io/langgraphjs/). We show a simple example below of how to create a ReAct agent.

```
// npm install @langchain-anthropic
Copy
```

## [Full-stack Quickstart](#md:full-stack-quickstart)

Get started quickly by building a full-stack LangGraph application using the [`create-agent-chat-app`](https://www.npmjs.com/package/create-agent-chat-app) CLI:

```
npx create-agent-chat-app@latest
Copy
```

The CLI sets up a chat interface and helps you configure your application, including:

* 🧠 Choice of 4 prebuilt agents (ReAct, Memory, Research, Retrieval)
* 🌐 Frontend framework (Next.js or Vite)
* 📦 Package manager (`npm`, `yarn`, or `pnpm`)

## [Why use LangGraph?](#md:why-use-langgraph)

LangGraph is built for developers who want to build powerful, adaptable AI agents. Developers choose LangGraph for:

* **Reliability and controllability.** Steer agent actions with moderation checks and human-in-the-loop approvals. LangGraph persists context for long-running workflows, keeping your agents on course.
* **Low-level and extensible.** Build custom agents with fully descriptive, low-level primitives – free from rigid abstractions that limit customization. Design scalable multi-agent systems, with each agent serving a specific role tailored to your use case.
* **First-class streaming support.** With token-by-token streaming and streaming of intermediate steps, LangGraph gives users clear visibility into agent reasoning and actions as they unfold in real time.

LangGraph is trusted in production and powering agents for companies like:

* [Klarna](https://blog.langchain.dev/customers-klarna/): Customer support bot for 85 million active users
* [Elastic](https://www.elastic.co/blog/elastic-security-generative-ai-features): Security AI assistant for threat detection
* [Uber](https://dpe.org/sessions/ty-smith-adam-huda/this-year-in-ubers-ai-driven-developer-productivity-revolution/): Automated unit test generation
* [Replit](https://www.langchain.com/breakoutagents/replit): Code generation
* And many more ([see list here](https://www.langchain.com/built-with-langgraph))

## [LangGraph’s ecosystem](#md:langgraphs-ecosystem)

While LangGraph can be used standalone, it also integrates seamlessly with any LangChain product, giving developers a full suite of tools for building agents. To improve your LLM application development, pair LangGraph with:

* [LangSmith](http://www.langchain.com/langsmith) — Helpful for agent evals and observability. Debug poor-performing LLM app runs, evaluate agent trajectories, gain visibility in production, and improve performance over time.
* [LangGraph Platform](https://langchain-ai.github.io/langgraphjs/concepts/#langgraph-platform) — Deploy and scale agents effortlessly with a purpose-built deployment platform for long running, stateful workflows. Discover, reuse, configure, and share agents across teams — and iterate quickly with visual prototyping in [LangGraph Studio](https://langchain-ai.github.io/langgraphjs/concepts/langgraph_studio/).

## [Pairing with LangGraph Platform](#md:pairing-with-langgraph-platform)

While LangGraph is our open-source agent orchestration framework, enterprises that need scalable agent deployment can benefit from [LangGraph Platform](https://langchain-ai.github.io/langgraphjs/concepts/langgraph_platform/).

LangGraph Platform can help engineering teams:

* **Accelerate agent development**: Quickly create agent UXs with configurable templates and [LangGraph Studio](https://langchain-ai.github.io/langgraphjs/concepts/langgraph_studio/) for visualizing and debugging agent interactions.
* **Deploy seamlessly**: We handle the complexity of deploying your agent. LangGraph Platform includes robust APIs for memory, threads, and cron jobs plus auto-scaling task queues & servers.
* **Centralize agent management & reusability**: Discover, reuse, and manage agents across the organization. Business users can also modify agents without coding.

## [Additional resources](#md:additional-resources)

* [LangChain Academy](https://academy.langchain.com/courses/intro-to-langgraph): Learn the basics of LangGraph in our free, structured course.
* [Tutorials](https://langchain-ai.github.io/langgraphjs/tutorials/): Simple walkthroughs with guided examples on getting started with LangGraph.
* [Templates](https://langchain-ai.github.io/langgraphjs/concepts/template_applications/): Pre-built reference apps for common agentic workflows (e.g. ReAct agent, memory, retrieval etc.) that can be cloned and adapted.
* [How-to Guides](https://langchain-ai.github.io/langgraphjs/how-tos/): Quick, actionable code snippets for topics such as streaming, adding memory & persistence, and design patterns (e.g. branching, subgraphs, etc.).
* [API Reference](https://langchain-ai.github.io/langgraphjs/reference/): Detailed reference on core classes, methods, how to use the graph and checkpointing APIs, and higher-level prebuilt components.
* [Built with LangGraph](https://www.langchain.com/built-with-langgraph): Hear how industry leaders use LangGraph to ship powerful, production-ready AI applications.

## [Acknowledgements](#md:acknowledgements)

LangGraph is inspired by [Pregel](https://research.google/pubs/pub37252/) and [Apache Beam](https://beam.apache.org/). The public interface draws inspiration from [NetworkX](https://networkx.org/documentation/latest/). LangGraph is built by LangChain Inc, the creators of LangChain, but can be used without LangChain.

### Settings

#### Member Visibility

* Protected
* Inherited
* External

#### Theme

OSLightDark

### On This Page

[🦜🕸️LangGraph.js](#md:🦜🕸️langgraphjs)

* [Full-stack Quickstart](#md:full-stack-quickstart)
* [Why use LangGraph?](#md:why-use-langgraph)
* [LangGraph’s ecosystem](#md:langgraphs-ecosystem)
* [Pairing with LangGraph Platform](#md:pairing-with-langgraph-platform)
* [Additional resources](#md:additional-resources)
* [Acknowledgements](#md:acknowledgements)

[API Reference](index.html)

* Loading...

Generated using [TypeDoc](https://typedoc.org/)