[ Skip to content](#langgraphjs) 

**Help us build the JS tools that power AI apps at companies like Replit, Uber, LinkedIn, GitLab, and more. [Join our team!](https://jobs.ashbyhq.com/langchain/05efa205-8560-43fd-bfcc-3f7697561cfb?utm%5Fsource=https%3A%2F%2Flangchain-ai.github.io%2Flanggraphjs%2F&utm%5Fcampaign=langgraphjs%5Fdocs)** 

[ ![logo](static/wordmark_dark.svg) ![logo](static/wordmark_light.svg) ](.) 

 LangGraph 

[ ](javascript:void%280%29 "Share") 

 Initializing search

[  GitHub ](https://github.com/langchain-ai/langgraphjs "Go to repository") 

* [ LangGraph](.)
* [ Agents](agents/overview/)
* [ API reference](reference/)
* [ Versions](versions/)

[ ![logo](static/wordmark_dark.svg) ![logo](static/wordmark_light.svg) ](.) 

[  GitHub ](https://github.com/langchain-ai/langgraphjs "Go to repository") 

* [  LangGraph ](.)  
 LangGraph  
   * Get started  
    Get started  
         * [  Learn the basics ](tutorials/quickstart/)  
         * [  Deployment ](tutorials/deployment/)  
   * Guides  
    Guides  
         * [  How-to Guides ](how-tos/)  
         * [  Concepts ](concepts/)  
         * [  Tutorials ](tutorials/)  
   * Resources  
    Resources  
         * [  Adopters ](adopters/)  
         * [  LLMS-txt ](llms-txt-overview/)  
         * [  FAQ ](concepts/faq/)  
         * [  Troubleshooting ](troubleshooting/errors/)  
         * [  LangGraph Academy Course ](https://academy.langchain.com/courses/intro-to-langgraph)
* [  Agents ](agents/overview/)
* [  API reference ](reference/)
* [  Versions ](versions/)

 Table of contents 
* [  Full-stack Quickstart ](#full-stack-quickstart)
* [  Why use LangGraph? ](#why-use-langgraph)
* [  LangGraph’s ecosystem ](#langgraphs-ecosystem)
* [  Pairing with LangGraph Platform ](#pairing-with-langgraph-platform)
* [  Additional resources ](#additional-resources)
* [  Acknowledgements ](#acknowledgements)

# 🦜🕸️LangGraph.js[¶](#langgraphjs "Permanent link")

[![Docs](https://img.shields.io/badge/docs-latest-blue)](https://langchain-ai.github.io/langgraphjs/) ![Version](https://img.shields.io/npm/v/@langchain/langgraph?logo=npm)  
[![Downloads](https://img.shields.io/npm/dm/@langchain/langgraph)](https://www.npmjs.com/package/@langchain/langgraph) [![Open Issues](https://img.shields.io/github/issues-raw/langchain-ai/langgraphjs)](https://github.com/langchain-ai/langgraphjs/issues)

Note

Looking for the Python version? See the [Python repo](https://github.com/langchain-ai/langgraph) and the [Python docs](https://langchain-ai.github.io/langgraph/).

LangGraph — used by Replit, Uber, LinkedIn, GitLab and more — is a low-level orchestration framework for building controllable agents. While langchain provides integrations and composable components to streamline LLM application development, the LangGraph library enables agent orchestration — offering customizable architectures, long-term memory, and human-in-the-loop to reliably handle complex tasks.

`[](#%5F%5Fcodelineno-0-1)npm install @langchain/langgraph @langchain/core
`

To learn more about how to use LangGraph, check out [the docs](https://langchain-ai.github.io/langgraphjs/). We show a simple example below of how to create a ReAct agent.

`[](#%5F%5Fcodelineno-1-1)// npm install @langchain-anthropic
[](#%5F%5Fcodelineno-1-2)import { createReactAgent } from "@langchain/langgraph/prebuilt";
[](#%5F%5Fcodelineno-1-3)import { ChatAnthropic } from "@langchain/anthropic";
[](#%5F%5Fcodelineno-1-4)import { tool } from "@langchain/core/tools";
[](#%5F%5Fcodelineno-1-5)
[](#%5F%5Fcodelineno-1-6)import { z } from "zod";
[](#%5F%5Fcodelineno-1-7)
[](#%5F%5Fcodelineno-1-8)const search = tool(async ({ query }) => {
[](#%5F%5Fcodelineno-1-9)  if (query.toLowerCase().includes("sf") || query.toLowerCase().includes("san francisco")) {
[](#%5F%5Fcodelineno-1-10)    return "It's 60 degrees and foggy."
[](#%5F%5Fcodelineno-1-11)  }
[](#%5F%5Fcodelineno-1-12)  return "It's 90 degrees and sunny."
[](#%5F%5Fcodelineno-1-13)}, {
[](#%5F%5Fcodelineno-1-14)  name: "search",
[](#%5F%5Fcodelineno-1-15)  description: "Call to surf the web.",
[](#%5F%5Fcodelineno-1-16)  schema: z.object({
[](#%5F%5Fcodelineno-1-17)    query: z.string().describe("The query to use in your search."),
[](#%5F%5Fcodelineno-1-18)  }),
[](#%5F%5Fcodelineno-1-19)});
[](#%5F%5Fcodelineno-1-20)
[](#%5F%5Fcodelineno-1-21)const model =  new ChatAnthropic({
[](#%5F%5Fcodelineno-1-22)  model: "claude-3-7-sonnet-latest"
[](#%5F%5Fcodelineno-1-23)});
[](#%5F%5Fcodelineno-1-24)
[](#%5F%5Fcodelineno-1-25)const agent = createReactAgent({
[](#%5F%5Fcodelineno-1-26)  llm: model,
[](#%5F%5Fcodelineno-1-27)  tools: [search],
[](#%5F%5Fcodelineno-1-28)});
[](#%5F%5Fcodelineno-1-29)
[](#%5F%5Fcodelineno-1-30)const result = await agent.invoke(
[](#%5F%5Fcodelineno-1-31)  {
[](#%5F%5Fcodelineno-1-32)    messages: [{
[](#%5F%5Fcodelineno-1-33)      role: "user",
[](#%5F%5Fcodelineno-1-34)      content: "what is the weather in sf"
[](#%5F%5Fcodelineno-1-35)    }]
[](#%5F%5Fcodelineno-1-36)  }
[](#%5F%5Fcodelineno-1-37));
`

## Full-stack Quickstart[¶](#full-stack-quickstart "Permanent link")

Get started quickly by building a full-stack LangGraph application using the [create-agent-chat-app](https://www.npmjs.com/package/create-agent-chat-app) CLI:

`[](#%5F%5Fcodelineno-2-1)npx create-agent-chat-app@latest
`

The CLI sets up a chat interface and helps you configure your application, including:

* 🧠 Choice of 4 prebuilt agents (ReAct, Memory, Research, Retrieval)
* 🌐 Frontend framework (Next.js or Vite)
* 📦 Package manager (`npm`, `yarn`, or `pnpm`)

## Why use LangGraph?[¶](#why-use-langgraph "Permanent link")

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

## LangGraph’s ecosystem[¶](#langgraphs-ecosystem "Permanent link")

While LangGraph can be used standalone, it also integrates seamlessly with any LangChain product, giving developers a full suite of tools for building agents. To improve your LLM application development, pair LangGraph with:

* [LangSmith](http://www.langchain.com/langsmith) — Helpful for agent evals and observability. Debug poor-performing LLM app runs, evaluate agent trajectories, gain visibility in production, and improve performance over time.
* [LangGraph Platform](https://langchain-ai.github.io/langgraphjs/concepts/#langgraph-platform) — Deploy and scale agents effortlessly with a purpose-built deployment platform for long running, stateful workflows. Discover, reuse, configure, and share agents across teams — and iterate quickly with visual prototyping in [LangGraph Studio](https://langchain-ai.github.io/langgraphjs/concepts/langgraph%5Fstudio/).

## Pairing with LangGraph Platform[¶](#pairing-with-langgraph-platform "Permanent link")

While LangGraph is our open-source agent orchestration framework, enterprises that need scalable agent deployment can benefit from [LangGraph Platform](https://langchain-ai.github.io/langgraphjs/concepts/langgraph%5Fplatform/).

LangGraph Platform can help engineering teams:

* **Accelerate agent development**: Quickly create agent UXs with configurable templates and [LangGraph Studio](https://langchain-ai.github.io/langgraphjs/concepts/langgraph%5Fstudio/) for visualizing and debugging agent interactions.
* **Deploy seamlessly**: We handle the complexity of deploying your agent. LangGraph Platform includes robust APIs for memory, threads, and cron jobs plus auto-scaling task queues & servers.
* **Centralize agent management & reusability**: Discover, reuse, and manage agents across the organization. Business users can also modify agents without coding.

## Additional resources[¶](#additional-resources "Permanent link")

* [LangChain Academy](https://academy.langchain.com/courses/intro-to-langgraph): Learn the basics of LangGraph in our free, structured course.
* [Tutorials](https://langchain-ai.github.io/langgraphjs/tutorials/): Simple walkthroughs with guided examples on getting started with LangGraph.
* [Templates](https://langchain-ai.github.io/langgraphjs/concepts/template%5Fapplications/): Pre-built reference apps for common agentic workflows (e.g. ReAct agent, memory, retrieval etc.) that can be cloned and adapted.
* [How-to Guides](https://langchain-ai.github.io/langgraphjs/how-tos/): Quick, actionable code snippets for topics such as streaming, adding memory & persistence, and design patterns (e.g. branching, subgraphs, etc.).
* [API Reference](https://langchain-ai.github.io/langgraphjs/reference/): Detailed reference on core classes, methods, how to use the graph and checkpointing APIs, and higher-level prebuilt components.
* [Built with LangGraph](https://www.langchain.com/built-with-langgraph): Hear how industry leaders use LangGraph to ship powerful, production-ready AI applications.

## Acknowledgements[¶](#acknowledgements "Permanent link")

LangGraph is inspired by [Pregel](https://research.google/pubs/pub37252/) and [Apache Beam](https://beam.apache.org/). The public interface draws inspiration from [NetworkX](https://networkx.org/documentation/latest/). LangGraph is built by LangChain Inc, the creators of LangChain, but can be used without LangChain.

 Was this page helpful? 

 Thanks for your feedback!

 Thanks for your feedback! Please help us improve this page by adding to the discussion below.

 Back to top 

[  Next  Learn the basics ](tutorials/quickstart/) 

 Copyright © 2025 LangChain, Inc | [Consent Preferences](#%5F%5Fconsent) 

 Made with[ Material for MkDocs Insiders](https://squidfunk.github.io/mkdocs-material/) 

[ ](https://langchain-ai.github.io/langgraph/ "langchain-ai.github.io") [ ](https://github.com/langchain-ai/langgraphjs "github.com") [ ](https://twitter.com/LangChainAI "twitter.com") 

#### Cookie consent

We use cookies to recognize your repeated visits and preferences, as well as to measure the effectiveness of our documentation and whether users find what they're searching for. **Clicking "Accept" makes our documentation better. Thank you!** ❤️

* Google Analytics
* GitHub

Accept Reject 