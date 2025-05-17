[ Skip to content](#langgraph-server) 

**Help us build the JS tools that power AI apps at companies like Replit, Uber, LinkedIn, GitLab, and more. [Join our team!](https://jobs.ashbyhq.com/langchain/05efa205-8560-43fd-bfcc-3f7697561cfb?utm%5Fsource=https%3A%2F%2Flangchain-ai.github.io%2Flanggraphjs%2F&utm%5Fcampaign=langgraphjs%5Fdocs)** 

[ ![logo](../../static/wordmark_dark.svg) ![logo](../../static/wordmark_light.svg) ](../..) 

 LangGraph Server 

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
                  * [  LangGraph ](../../concepts#langgraph)  
                  * LangGraph Platform  
                   LangGraph Platform  
                              * [  LangGraph Platform ](../../concepts#langgraph-platform)  
                              * [  High Level ](../../concepts#high-level)  
                              * Components  
                               Components  
                                             * [  Components ](../../concepts#components)  
                                             * LangGraph Server [  LangGraph Server ](./)  
                                              Table of contents  
                                                               * [  Overview ](#overview)  
                                                               * [  Key Features ](#key-features)  
                                                               * [  What are you deploying? ](#what-are-you-deploying)  
                                                                                    * [  Graphs ](#graphs)  
                                                                                    * [  Persistence and Task Queue ](#persistence-and-task-queue)  
                                                               * [  Application Structure ](#application-structure)  
                                                               * [  LangGraph Server API ](#langgraph-server-api)  
                                                                                    * [  Assistants ](#assistants)  
                                                                                    * [  Threads ](#threads)  
                                                                                    * [  Runs ](#runs)  
                                                                                    * [  Store ](#store)  
                                                                                    * [  Cron Jobs ](#cron-jobs)  
                                                                                    * [  Webhooks ](#webhooks)  
                                                               * [  Related ](#related)  
                                             * [  LangGraph Studio ](../langgraph%5Fstudio/)  
                                             * [  LangGraph.js CLI ](../langgraph%5Fcli/)  
                                             * [  LangGraph SDK ](../sdk/)  
                                             * [  How to interact with the deployment using RemoteGraph ](../../how-tos/use-remote-graph/)  
                              * [  LangGraph Server ](../../concepts#langgraph-server)  
                              * [  Deployment Options ](../../concepts#deployment-options)  
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
* [  Overview ](#overview)
* [  Key Features ](#key-features)
* [  What are you deploying? ](#what-are-you-deploying)  
   * [  Graphs ](#graphs)  
   * [  Persistence and Task Queue ](#persistence-and-task-queue)
* [  Application Structure ](#application-structure)
* [  LangGraph Server API ](#langgraph-server-api)  
   * [  Assistants ](#assistants)  
   * [  Threads ](#threads)  
   * [  Runs ](#runs)  
   * [  Store ](#store)  
   * [  Cron Jobs ](#cron-jobs)  
   * [  Webhooks ](#webhooks)
* [  Related ](#related)

1. [  LangGraph ](../..)
2. [  Guides ](../../how-tos/)
3. [  Concepts ](../)
4. [  LangGraph Platform ](../../concepts#langgraph-platform)
5. [  Components ](../../concepts#components)

# LangGraph Server[¶](#langgraph-server "Permanent link")

Prerequisites

* [LangGraph Platform](../langgraph%5Fplatform/)
* [LangGraph Glossary](../low%5Flevel/)

## Overview[¶](#overview "Permanent link")

LangGraph Server offers an API for creating and managing agent-based applications. It is built on the concept of [assistants](../assistants/), which are agents configured for specific tasks, and includes built-in [persistence](../persistence/#memory-store) and a **task queue**. This versatile API supports a wide range of agentic application use cases, from background processing to real-time interactions.

## Key Features[¶](#key-features "Permanent link")

The LangGraph Platform incorporates best practices for agent deployment, so you can focus on building your agent logic.

* **Streaming endpoints**: Endpoints that expose [multiple different streaming modes](../streaming/). We've made these work even for long-running agents that may go minutes between consecutive stream events.
* **Background runs**: The LangGraph Server supports launching assistants in the background with endpoints for polling the status of the assistant's run and webhooks to monitor run status effectively.
* **Support for long runs**: Our blocking endpoints for running assistants send regular heartbeat signals, preventing unexpected connection closures when handling requests that take a long time to complete.
* **Task queue**: We've added a task queue to make sure we don't drop any requests if they arrive in a bursty nature.
* **Horizontally scalable infrastructure**: LangGraph Server is designed to be horizontally scalable, allowing you to scale up and down your usage as needed.
* **Double texting support**: Many times users might interact with your graph in unintended ways. For instance, a user may send one message and before the graph has finished running send a second message. We call this ["double texting"](../double%5Ftexting/) and have added four different ways to handle this.
* **Optimized checkpointer**: LangGraph Platform comes with a built-in [checkpointer](../persistence/#checkpoints) optimized for LangGraph applications.
* **Human-in-the-loop endpoints**: We've exposed all endpoints needed to support [human-in-the-loop](../human%5Fin%5Fthe%5Floop/) features.
* **Memory**: In addition to thread-level persistence (covered above by \[checkpointers\]l(./persistence.md#checkpoints)), LangGraph Platform also comes with a built-in [memory store](../persistence/#memory-store).
* **Cron jobs**: Built-in support for scheduling tasks, enabling you to automate regular actions like data clean-up or batch processing within your applications.
* **Webhooks**: Allows your application to send real-time notifications and data updates to external systems, making it easy to integrate with third-party services and trigger actions based on specific events.
* **Monitoring**: LangGraph Server integrates seamlessly with the [LangSmith](https://docs.smith.langchain.com/) monitoring platform, providing real-time insights into your application's performance and health.

## What are you deploying?[¶](#what-are-you-deploying "Permanent link")

When you deploy a LangGraph Server, you are deploying one or more [graphs](#graphs), a database for [persistence](../persistence/), and a task queue.

### Graphs[¶](#graphs "Permanent link")

When you deploy a graph with LangGraph Server, you are deploying a "blueprint" for an [Assistant](../assistants/). 

An [Assistant](../assistants/) is a graph paired with specific configuration settings. You can create multiple assistants per graph, each with unique settings to accommodate different use cases that can be served by the same graph.

Upon deployment, LangGraph Server will automatically create a default assistant for each graph using the graph's default configuration settings.

You can interact with assistants through the [LangGraph Server API](#langgraph-server-api).

Note

We often think of a graph as implementing an [agent](../agentic%5Fconcepts/), but a graph does not necessarily need to implement an agent. For example, a graph could implement a simple chatbot that only supports back-and-forth conversation, without the ability to influence any application control flow. In reality, as applications get more complex, a graph will often implement a more complex flow that may use [multiple agents](../multi%5Fagent/) working in tandem.

### Persistence and Task Queue[¶](#persistence-and-task-queue "Permanent link")

The LangGraph Server leverages a database for [persistence](../persistence/) and a task queue.

Currently, only [Postgres](https://www.postgresql.org/) is supported as a database for LangGraph Server and [Redis](https://redis.io/) as the task queue.

If you're deploying using [LangGraph Cloud](../langgraph%5Fcloud/), these components are managed for you. If you're deploying LangGraph Server on your own infrastructure, you'll need to set up and manage these components yourself.

Please review the [deployment options](../deployment%5Foptions/) guide for more information on how these components are set up and managed.

## Application Structure[¶](#application-structure "Permanent link")

To deploy a LangGraph Server application, you need to specify the graph(s) you want to deploy, as well as any relevant configuration settings, such as dependencies and environment variables.

Read the [application structure](../application%5Fstructure/) guide to learn how to structure your LangGraph application for deployment.

## LangGraph Server API[¶](#langgraph-server-api "Permanent link")

The LangGraph Server API allows you to create and manage [assistants](../assistants/), [threads](#threads), [runs](#runs), [cron jobs](#cron-jobs), and more.

The [LangGraph Cloud API Reference](/langgraphjs/cloud/reference/api/api%5Fref.html) provides detailed information on the API endpoints and data models.

### Assistants[¶](#assistants "Permanent link")

An [Assistant](../assistants/) refers to a [graph](#graphs) plus specific [configuration](../low%5Flevel/#configuration) settings for that graph.

You can think of an assistant as a saved configuration of an [agent](../agentic%5Fconcepts/).

When building agents, it is fairly common to make rapid changes that _do not_ alter the graph logic. For example, simply changing prompts or the LLM selection can have significant impacts on the behavior of the agents. Assistants offer an easy way to make and save these types of changes to agent configuration.

### Threads[¶](#threads "Permanent link")

A thread contains the accumulated state of a sequence of [runs](#runs). If a run is executed on a thread, then the [state](../low%5Flevel/#state) of the underlying graph of the assistant will be persisted to the thread.

A thread's current and historical state can be retrieved. To persist state, a thread must be created prior to executing a run.

The state of a thread at a particular point in time is called a [checkpoint](../persistence/#checkpoints). Checkpoints can be used to restore the state of a thread at a later time.

For more on threads and checkpoints, see this section of the [LangGraph conceptual guide](../low%5Flevel/#persistence).

The LangGraph Cloud API provides several endpoints for creating and managing threads and thread state. See the [API reference](/langgraphjs/cloud/reference/api/api%5Fref.html#tag/threadscreate) for more details.

### Runs[¶](#runs "Permanent link")

A run is an invocation of an [assistant](#assistants). Each run may have its own input, configuration, and metadata, which may affect execution and output of the underlying graph. A run can optionally be executed on a [thread](#threads).

The LangGraph Cloud API provides several endpoints for creating and managing runs. See the [API reference](/langgraphjs/cloud/reference/api/api%5Fref.html#tag/runsmanage) for more details.

### Store[¶](#store "Permanent link")

Store is an API for managing persistent [key-value store](../persistence/#memory-store) that is available from any [thread](#threads).

Stores are useful for implementing [memory](../memory/) in your LangGraph application.

### Cron Jobs[¶](#cron-jobs "Permanent link")

There are many situations in which it is useful to run an assistant on a schedule. 

For example, say that you're building an assistant that runs daily and sends an email summary of the day's news. You could use a cron job to run the assistant every day at 8:00 PM.

LangGraph Cloud supports cron jobs, which run on a user-defined schedule. The user specifies a schedule, an assistant, and some input. After that, on the specified schedule, the server will:

* Create a new thread with the specified assistant
* Send the specified input to that thread

Note that this sends the same input to the thread every time. See the [how-to guide](/langgraphjs/cloud/how-tos/cron%5Fjobs.md) for creating cron jobs.

The LangGraph Cloud API provides several endpoints for creating and managing cron jobs. See the [API reference](/langgraphjs/cloud/reference/api/api%5Fref.html#tag/crons-enterprise-only) for more details.

### Webhooks[¶](#webhooks "Permanent link")

Webhooks enable event-driven communication from your LangGraph Cloud application to external services. For example, you may want to issue an update to a separate service once an API call to LangGraph Cloud has finished running.

Many LangGraph Cloud endpoints accept a `webhook` parameter. If this parameter is specified by a an endpoint that can accept POST requests, LangGraph Cloud will send a request at the completion of a run.

See the corresponding [how-to guide](/langgraphjs/cloud/how-tos/webhooks.md) for more detail.

## Related[¶](#related "Permanent link")

* LangGraph [Application Structure](../application%5Fstructure/) guide explains how to structure your LangGraph application for deployment.
* [How-to guides for the LangGraph Platform](../../how-tos/).
* The [LangGraph Cloud API Reference](/langgraphjs/cloud/reference/api/api%5Fref.html) provides detailed information on the API endpoints and data models.

 Was this page helpful? 

 Thanks for your feedback!

 Thanks for your feedback! Please help us improve this page by adding to the discussion below.

 Back to top 

[  Previous  Template Applications ](../template%5Fapplications/) [  Next  LangGraph Studio ](../langgraph%5Fstudio/) 

 Copyright © 2025 LangChain, Inc | [Consent Preferences](#%5F%5Fconsent) 

 Made with[ Material for MkDocs Insiders](https://squidfunk.github.io/mkdocs-material/) 

[ ](https://langchain-ai.github.io/langgraph/ "langchain-ai.github.io") [ ](https://github.com/langchain-ai/langgraphjs "github.com") [ ](https://twitter.com/LangChainAI "twitter.com") 

#### Cookie consent

We use cookies to recognize your repeated visits and preferences, as well as to measure the effectiveness of our documentation and whether users find what they're searching for. **Clicking "Accept" makes our documentation better. Thank you!** ❤️

* Google Analytics
* GitHub

Accept Reject 