[ Skip to content](#why-langgraph) 

**Help us build the JS tools that power AI apps at companies like Replit, Uber, LinkedIn, GitLab, and more. [Join our team!](https://jobs.ashbyhq.com/langchain/05efa205-8560-43fd-bfcc-3f7697561cfb?utm%5Fsource=https%3A%2F%2Flangchain-ai.github.io%2Flanggraphjs%2F&utm%5Fcampaign=langgraphjs%5Fdocs)** 

[ ![logo](../../static/wordmark_dark.svg) ![logo](../../static/wordmark_light.svg) ](../..) 

 Why LangGraph? 

[ ](javascript:void%280%29 "Share") 

 Initializing search

[  GitHub ](https://github.com/langchain-ai/langgraphjs "Go to repository") 

* [ LangGraph](../..)
* [ Agents](../../agents/overview/)
* [ API reference](../../reference/)
* [ Versions](../../versions/)

[ ![logo](../../static/wordmark_dark.svg) ![logo](../../static/wordmark_light.svg) ](../..) 

[  GitHub ](https://github.com/langchain-ai/langgraphjs "Go to repository") 

* [  LangGraph ](../..)  
 LangGraph  
   * Get started  
    Get started  
         * [  Learn the basics ](../../tutorials/quickstart/)  
         * [  Deployment ](../../tutorials/deployment/)  
   * Guides  
    Guides  
         * [  How-to Guides ](../../how-tos/)  
         * [  Concepts ](../)  
          Concepts  
                  * LangGraph  
                   LangGraph  
                              * [  LangGraph ](../../concepts#langgraph)  
                              * Why LangGraph? [  Why LangGraph? ](./)  
                               Table of contents  
                                             * [  Challenges ](#challenges)  
                                             * [  Core Principles ](#core-principles)  
                                             * [  Debugging ](#debugging)  
                                             * [  Deployment ](#deployment)  
                              * [  LangGraph Glossary ](../low%5Flevel/)  
                              * [  Agent architectures ](../agentic%5Fconcepts/)  
                              * [  Multi-agent Systems ](../multi%5Fagent/)  
                              * [  Human-in-the-loop ](../human%5Fin%5Fthe%5Floop/)  
                              * [  Persistence ](../persistence/)  
                              * [  Memory ](../memory/)  
                              * [  Streaming ](../streaming/)  
                              * [  Functional API ](../functional%5Fapi/)  
                  * [  LangGraph Platform ](../../concepts#langgraph-platform)  
         * [  Tutorials ](../../tutorials/)  
   * Resources  
    Resources  
         * [  Adopters ](../../adopters/)  
         * [  LLMS-txt ](../../llms-txt-overview/)  
         * [  FAQ ](../faq/)  
         * [  Troubleshooting ](../../troubleshooting/errors/)  
         * [  LangGraph Academy Course ](https://academy.langchain.com/courses/intro-to-langgraph)
* [  Agents ](../../agents/overview/)
* [  API reference ](../../reference/)
* [  Versions ](../../versions/)

 Table of contents 
* [  Challenges ](#challenges)
* [  Core Principles ](#core-principles)
* [  Debugging ](#debugging)
* [  Deployment ](#deployment)

1. [  LangGraph ](../..)
2. [  Guides ](../../how-tos/)
3. [  Concepts ](../)
4. [  LangGraph ](../../concepts#langgraph)

# Why LangGraph?[¶](#why-langgraph "Permanent link")

LLMs are extremely powerful, particularly when connected to other systems such as a retriever or APIs. This is why many LLM applications use a control flow of steps before and / or after LLM calls. As an example [RAG](https://github.com/langchain-ai/rag-from-scratch) performs retrieval of relevant documents to a question, and passes those documents to an LLM in order to ground the response. Often a control flow of steps before and / or after an LLM is called a "chain." Chains are a popular paradigm for programming with LLMs and offer a high degree of reliability; the same set of steps runs with each chain invocation.

However, we often want LLM systems that can pick their own control flow! This is one definition of an [agent](https://blog.langchain.dev/what-is-an-agent/): an agent is a system that uses an LLM to decide the control flow of an application. Unlike a chain, an agent given an LLM some degree of control over the sequence of steps in the application. Examples of using an LLM to decide the control of an application:

* Using an LLM to route between two potential paths
* Using an LLM to decide which of many tools to call
* Using an LLM to decide whether the generated answer is sufficient or more work is need

There are many different types of [agent architectures](https://blog.langchain.dev/what-is-a-cognitive-architecture/) to consider, which given an LLM varying levels of control. On one extreme, a router allows an LLM to select a single step from a specified set of options and, on the other extreme, a fully autonomous long-running agent may have complete freedom to select any sequence of steps that it wants for a given problem. 

![Agent Types](../img/agent_types.png)

Several concepts are utilized in many agent architectures:

* [Tool calling](../agentic%5Fconcepts/#tool-calling): this is often how LLMs make decisions
* Action taking: often times, the LLMs' outputs are used as the input to an action
* [Memory](../agentic%5Fconcepts/#memory): reliable systems need to have knowledge of things that occurred
* [Planning](../agentic%5Fconcepts/#planning): planning steps (either explicit or implicit) are useful for ensuring that the LLM, when making decisions, makes them in the highest fidelity way.

## Challenges[¶](#challenges "Permanent link")

In practice, there is often a trade-off between control and reliability. As we give LLMs more control, the application often become less reliable. This can be due to factors such as LLM non-determinism and / or errors in selecting tools (or steps) that the agent uses (takes).

![Agent Challenge](../img/challenge.png)

## Core Principles[¶](#core-principles "Permanent link")

The motivation of LangGraph is to help bend the curve, preserving higher reliability as we give the agent more control over the application. We'll outline a few specific pillars of LangGraph that make it well suited for building reliable agents. 

![Langgraph](../img/langgraph.png)

**Controllability**

LangGraph gives the developer a high degree of [control](/langgraphjs/how-tos#controllability) by expressing the flow of the application as a set of nodes and edges. All nodes can access and modify a common state (memory). The control flow of the application can set using edges that connect nodes, either deterministically or via conditional logic. 

**Persistence**

LangGraph gives the developer many options for [persisting](/langgraphjs/how-tos#persistence) graph state using short-term or long-term (e.g., via a database) memory. 

**Human-in-the-Loop**

The persistence layer enables several different [human-in-the-loop](/langgraphjs/how-tos#human-in-the-loop) interaction patterns with agents; for example, it's possible to pause an agent, review its state, edit it state, and approve a follow-up step. 

**Streaming**

LangGraph comes with first class support for [streaming](/langgraphjs/how-tos#streaming), which can expose state to the user (or developer) over the course of agent execution. LangGraph supports streaming of both events ([like a tool call being taken](/langgraphjs/how-tos/stream-updates.ipynb)) as well as of [tokens that an LLM may emit](/langgraphjs/how-tos/streaming-tokens).

## Debugging[¶](#debugging "Permanent link")

Once you've built a graph, you often want to test and debug it. [LangGraph Studio](https://github.com/langchain-ai/langgraph-studio?tab=readme-ov-file) is a specialized IDE for visualization and debugging of LangGraph applications.

![Langgraph Studio](../img/lg_studio.png)

## Deployment[¶](#deployment "Permanent link")

Once you have confidence in your LangGraph application, many developers want an easy path to deployment. [LangGraph Cloud](/langgraphjs/cloud) is an opinionated, simple way to deploy LangGraph objects from the LangChain team. Of course, you can also use services like [Express.js](https://expressjs.com/) and call your graph from inside the Express.js server as you see fit.

 Was this page helpful? 

 Thanks for your feedback!

 Thanks for your feedback! Please help us improve this page by adding to the discussion below.

 Back to top 

[  Previous  Concepts ](../) [  Next  LangGraph Glossary ](../low%5Flevel/) 

 Copyright © 2025 LangChain, Inc | [Consent Preferences](#%5F%5Fconsent) 

 Made with[ Material for MkDocs Insiders](https://squidfunk.github.io/mkdocs-material/) 

[ ](https://langchain-ai.github.io/langgraph/ "langchain-ai.github.io") [ ](https://github.com/langchain-ai/langgraphjs "github.com") [ ](https://twitter.com/LangChainAI "twitter.com") 

#### Cookie consent

We use cookies to recognize your repeated visits and preferences, as well as to measure the effectiveness of our documentation and whether users find what they're searching for. **Clicking "Accept" makes our documentation better. Thank you!** ❤️

* Google Analytics
* GitHub

Accept Reject 