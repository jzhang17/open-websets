[Skip to content](#how-to-guides)

**Help us build the JS tools that power AI apps at companies like Replit, Uber, LinkedIn, GitLab, and more. [Join our team!](https://jobs.ashbyhq.com/langchain/05efa205-8560-43fd-bfcc-3f7697561cfb?utm_source=https%3A%2F%2Flangchain-ai.github.io%2Flanggraphjs%2F&utm_campaign=langgraphjs_docs)**

[![logo](../static/wordmark_dark.svg)
![logo](../static/wordmark_light.svg)](..)

How-to Guides

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
    - [How-to Guides](./)

      How-to Guides
      * [Installation](../how-tos#installation)
      * [LangGraph](../how-tos#langgraph)
      * [LangGraph Platform](../how-tos#langgraph-platform)
    - [Concepts](../concepts/)
    - [Tutorials](../tutorials/)
  + Resources

    Resources
    - [Adopters](../adopters/)
    - [LLMS-txt](../llms-txt-overview/)
    - [FAQ](../concepts/faq/)
    - [Troubleshooting](../troubleshooting/errors/)
    - [LangGraph Academy Course](https://academy.langchain.com/courses/intro-to-langgraph)
* [Agents](../agents/overview/)
* [API reference](../reference/)
* [Versions](../versions/)

Table of contents

* [Installation](#installation)
* [LangGraph](#langgraph)

  + [Controllability](#controllability)
  + [Persistence](#persistence)
  + [Memory](#memory)
  + [Human-in-the-loop](#human-in-the-loop)
  + [Time Travel](#time-travel)
  + [Streaming](#streaming)
  + [Tool calling](#tool-calling)
  + [Subgraphs](#subgraphs)
  + [Multi-agent](#multi-agent)
  + [State management](#state-management)
  + [Other](#other)
  + [Prebuilt ReAct Agent](#prebuilt-react-agent)
* [LangGraph Platform](#langgraph-platform)

  + [Application Structure](#application-structure)
  + [Deployment](#deployment)
  + [Authentication & Access Control](#authentication-access-control)
  + [Modifying the API](#modifying-the-api)
  + [Assistants](#assistants)
  + [Threads](#threads)
  + [Runs](#runs)
  + [Streaming](#streaming_1)
  + [Frontend & Generative UI](#frontend-generative-ui)
  + [Human-in-the-loop](#human-in-the-loop_1)
  + [Double-texting](#double-texting)
  + [Webhooks](#webhooks)
  + [Cron Jobs](#cron-jobs)
  + [LangGraph Studio](#langgraph-studio)
* [Troubleshooting](#troubleshooting)

1. [LangGraph](..)
2. [Guides](./)
3. [How-to Guides](./)

# How-to guides[¶](#how-to-guides "Permanent link")

Here you’ll find answers to “How do I...?” types of questions. These guides are **goal-oriented** and concrete; they're meant to help you complete a specific task. For conceptual explanations see the [Conceptual guide](../concepts/). For end-to-end walk-throughs see [Tutorials](../tutorials/). For comprehensive descriptions of every class and function see the [API Reference](https://langchain-ai.github.io/langgraphjs/reference/).

## Installation[¶](#installation "Permanent link")

* [How to install and manage dependencies](manage-ecosystem-dependencies/)
* [How to use LangGraph.js in web environments](use-in-web-environments/)

## LangGraph[¶](#langgraph "Permanent link")

### Controllability[¶](#controllability "Permanent link")

LangGraph.js is known for being a highly controllable agent framework.
These how-to guides show how to achieve that controllability.

* [How to create branches for parallel execution](branching/)
* [How to create map-reduce branches for parallel execution](map-reduce/)
* [How to combine control flow and state updates with Command](command/)
* [How to create and control loops with recursion limits](recursion-limit/)

### Persistence[¶](#persistence "Permanent link")

LangGraph.js makes it easy to persist state across graph runs. The guides below shows how to add persistence to your graph.

* [How to add thread-level persistence to your graph](persistence/)
* [How to add thread-level persistence to subgraphs](subgraph-persistence/)
* [How to add cross-thread persistence](cross-thread-persistence/)
* [How to use a Postgres checkpointer for persistence](persistence-postgres/)

See the below guides for how-to add persistence to your workflow using the [Functional API](../concepts/functional_api/):

* [How to add thread-level persistence (functional API)](persistence-functional/)
* [How to add cross-thread persistence (functional API)](cross-thread-persistence-functional/)

### Memory[¶](#memory "Permanent link")

LangGraph makes it easy to manage conversation [memory](../concepts/memory/) in your graph. These how-to guides show how to implement different strategies for that.

* [How to manage conversation history](manage-conversation-history/)
* [How to delete messages](delete-messages/)
* [How to add summary of the conversation history](add-summary-conversation-history/)
* [How to add long-term memory (cross-thread)](cross-thread-persistence/)
* [How to use semantic search for long-term memory](semantic-search/)

### Human-in-the-loop[¶](#human-in-the-loop "Permanent link")

[Human-in-the-loop](/langgraphjs/concepts/human_in_the_loop) functionality allows
you to involve humans in the decision-making process of your graph. These how-to guides show how to implement human-in-the-loop workflows in your graph.

Key workflows:

* [How to wait for user input](wait-user-input/): A basic example that shows how to implement a human-in-the-loop workflow in your graph using the `interrupt` function.
* [How to review tool calls](review-tool-calls/): Incorporate human-in-the-loop for reviewing/editing/accepting tool call requests before they executed using the `interrupt` function.

Other methods:

* [How to add static breakpoints](breakpoints/): Use for debugging purposes. For [**human-in-the-loop**](/langgraphjs/concepts/human_in_the_loop) workflows, we recommend the [`interrupt` function](/langgraphjs/reference/functions/langgraph.interrupt-1.html) instead.
* [How to edit graph state](edit-graph-state/): Edit graph state using `graph.update_state` method. Use this if implementing a **human-in-the-loop** workflow via **static breakpoints**.
* [How to add dynamic breakpoints with `NodeInterrupt`](dynamic_breakpoints/): **Not recommended**: Use the [`interrupt` function](/langgraphjs/concepts/human_in_the_loop) instead.

See the below guides for how-to implement human-in-the-loop workflows with the [Functional API](../concepts/functional_api/):

* [How to wait for user input (Functional API)](wait-user-input-functional/)
* [How to review tool calls (Functional API)](review-tool-calls-functional/)

### Time Travel[¶](#time-travel "Permanent link")

[Time travel](../concepts/time-travel/) allows you to replay past actions in your LangGraph application to explore alternative paths and debug issues. These how-to guides show how to use time travel in your graph.

* [How to view and update past graph state](time-travel/)

### Streaming[¶](#streaming "Permanent link")

LangGraph is built to be streaming first.
These guides show how to use different streaming modes.

* [How to stream the full state of your graph](stream-values/)
* [How to stream state updates of your graph](stream-updates/)
* [How to stream LLM tokens](stream-tokens/)
* [How to stream LLM tokens without LangChain models](streaming-tokens-without-langchain/)
* [How to stream custom data](streaming-content/)
* [How to configure multiple streaming modes](stream-multiple/)
* [How to stream events from within a tool](streaming-events-from-within-tools/)
* [How to stream from the final node](streaming-from-final-node/)

### Tool calling[¶](#tool-calling "Permanent link")

* [How to call tools using ToolNode](tool-calling/)
* [How to force an agent to call a tool](force-calling-a-tool-first/)
* [How to handle tool calling errors](tool-calling-errors/)
* [How to pass runtime values to tools](pass-run-time-values-to-tools/)
* [How to update graph state from tools](update-state-from-tools/)

### Subgraphs[¶](#subgraphs "Permanent link")

[Subgraphs](../concepts/low_level/#subgraphs) allow you to reuse an existing graph from another graph. These how-to guides show how to use subgraphs:

* [How to add and use subgraphs](subgraph/)
* [How to view and update state in subgraphs](subgraphs-manage-state/)
* [How to transform inputs and outputs of a subgraph](subgraph-transform-state/)

### Multi-agent[¶](#multi-agent "Permanent link")

* [How to build a multi-agent network](multi-agent-network/)
* [How to add multi-turn conversation in a multi-agent application](multi-agent-multi-turn-convo/)

See the [multi-agent tutorials](../tutorials/#multi-agent-systems) for implementations of other multi-agent architectures.

See the below guides for how-to implement multi-agent workflows with the [Functional API](../concepts/functional_api/):

* [How to build a multi-agent network (functional API)](multi-agent-network-functional/)
* [How to add multi-turn conversation in a multi-agent application (functional API)](multi-agent-multi-turn-convo-functional/)

### State management[¶](#state-management "Permanent link")

* [How to define graph state](define-state/)
* [Have a separate input and output schema](input_output_schema/)
* [Pass private state between nodes inside the graph](pass_private_state/)

### Other[¶](#other "Permanent link")

* [How to add runtime configuration to your graph](configuration/)
* [How to add node retries](node-retry-policies/)
* [How to let an agent return tool results directly](dynamically-returning-directly/)
* [How to have an agent respond in structured format](respond-in-format/)
* [How to manage agent steps](managing-agent-steps/)

### Prebuilt ReAct Agent[¶](#prebuilt-react-agent "Permanent link")

* [How to create a ReAct agent](create-react-agent/)
* [How to add memory to a ReAct agent](react-memory/)
* [How to add a system prompt to a ReAct agent](react-system-prompt/)
* [How to add Human-in-the-loop to a ReAct agent](react-human-in-the-loop/)
* [How to return structured output from a ReAct agent](react-return-structured-output/)

See the below guide for how-to build ReAct agents with the [Functional API](../concepts/functional_api/):

* [How to create a ReAct agent from scratch (Functional API)](react-agent-from-scratch-functional/)

## LangGraph Platform[¶](#langgraph-platform "Permanent link")

This section includes how-to guides for LangGraph Platform.

LangGraph Platform is a commercial solution for deploying agentic applications in production, built on the open-source LangGraph framework. It provides four deployment options to fit a range of needs: a free tier, a self-hosted version, a cloud SaaS, and a Bring Your Own Cloud (BYOC) option. You can explore these options in detail in the [deployment options guide](../concepts/deployment_options/).

Tip

* LangGraph is an MIT-licensed open-source library, which we are committed to maintaining and growing for the community.
* You can always deploy LangGraph applications on your own infrastructure using the open-source LangGraph project without using LangGraph Platform.

### Application Structure[¶](#application-structure "Permanent link")

Learn how to set up your app for deployment to LangGraph Platform:

* [How to set up app for deployment (requirements.txt)](/langgraphjs/cloud/deployment/setup)
* [How to set up app for deployment (pyproject.toml)](/langgraphjs/cloud/deployment/setup_pyproject)
* [How to set up app for deployment (JavaScript)](/langgraphjs/cloud/deployment/setup_javascript)
* [How to customize Dockerfile](/langgraphjs/cloud/deployment/custom_docker)
* [How to test locally](/langgraphjs/cloud/deployment/test_locally)
* [How to integrate LangGraph into your React application](/langgraphjs/cloud/how-tos/use_stream_react)

### Deployment[¶](#deployment "Permanent link")

LangGraph applications can be deployed using LangGraph Cloud, which provides a range of services to help you deploy, manage, and scale your applications.

* [How to deploy to LangGraph cloud](/langgraphjs/cloud/deployment/cloud)
* [How to deploy to a self-hosted environment](deploy-self-hosted/)
* [How to interact with the deployment using RemoteGraph](use-remote-graph/)

### Authentication & Access Control[¶](#authentication-access-control "Permanent link")

* [How to add custom authentication](auth/custom_auth/)

### Modifying the API[¶](#modifying-the-api "Permanent link")

* [How to add custom routes](http/custom_routes/)
* [How to add custom middleware](http/custom_middleware/)

### Assistants[¶](#assistants "Permanent link")

[Assistants](../concepts/assistants/) are a configured instance of a template.

* [How to configure agents](/langgraphjs/cloud/how-tos/configuration_cloud)
* [How to version assistants](/langgraphjs/cloud/how-tos/assistant_versioning)

### Threads[¶](#threads "Permanent link")

* [How to copy threads](/langgraphjs/cloud/how-tos/copy_threads)
* [How to check status of your threads](/langgraphjs/cloud/how-tos/check_thread_status)

### Runs[¶](#runs "Permanent link")

LangGraph Cloud supports multiple types of runs besides streaming runs.

* [How to run an agent in the background](/langgraphjs/cloud/how-tos/background_run)
* [How to run multiple agents in the same thread](/langgraphjs/cloud/how-tos/same-thread)
* [How to create cron jobs](/langgraphjs/cloud/how-tos/cron_jobs)
* [How to create stateless runs](/langgraphjs/cloud/how-tos/stateless_runs)

### Streaming[¶](#streaming_1 "Permanent link")

Streaming the results of your LLM application is vital for ensuring a good user experience, especially when your graph may call multiple models and take a long time to fully complete a run. Read about how to stream values from your graph in these how to guides:

* [How to stream values](/langgraphjs/cloud/how-tos/stream_values)
* [How to stream updates](/langgraphjs/cloud/how-tos/stream_updates)
* [How to stream messages](/langgraphjs/cloud/how-tos/stream_messages)
* [How to stream events](/langgraphjs/cloud/how-tos/stream_events)
* [How to stream in debug mode](/langgraphjs/cloud/how-tos/stream_debug)
* [How to stream multiple modes](/langgraphjs/cloud/how-tos/stream_multiple)

### Frontend & Generative UI[¶](#frontend-generative-ui "Permanent link")

With LangGraph Platform you can integrate LangGraph agents into your React applications and colocate UI components with your agent code.

* [How to integrate LangGraph into your React application](/langgraphjs/cloud/how-tos/use_stream_react)
* [How to implement Generative User Interfaces with LangGraph](/langgraphjs/cloud/how-tos/generative_ui_react)

### Human-in-the-loop[¶](#human-in-the-loop_1 "Permanent link")

When creating complex graphs, leaving every decision up to the LLM can be dangerous, especially when the decisions involve invoking certain tools or accessing specific documents. To remedy this, LangGraph allows you to insert human-in-the-loop behavior to ensure your graph does not have undesired outcomes. Read more about the different ways you can add human-in-the-loop capabilities to your LangGraph Cloud projects in these how-to guides:

* [How to add a breakpoint](/langgraphjs/cloud/how-tos/human_in_the_loop_breakpoint)
* [How to wait for user input](/langgraphjs/cloud/how-tos/human_in_the_loop_user_input)
* [How to edit graph state](/langgraphjs/cloud/how-tos/human_in_the_loop_edit_state)
* [How to replay and branch from prior states](/langgraphjs/cloud/how-tos/human_in_the_loop_time_travel)
* [How to review tool calls](/langgraphjs/cloud/how-tos/human_in_the_loop_review_tool_calls)

### Double-texting[¶](#double-texting "Permanent link")

Graph execution can take a while, and sometimes users may change their mind about the input they wanted to send before their original input has finished running. For example, a user might notice a typo in their original request and will edit the prompt and resend it. Deciding what to do in these cases is important for ensuring a smooth user experience and preventing your graphs from behaving in unexpected ways. The following how-to guides provide information on the various options LangGraph Cloud gives you for dealing with double-texting:

* [How to use the interrupt option](/langgraphjs/cloud/how-tos/interrupt_concurrent)
* [How to use the rollback option](/langgraphjs/cloud/how-tos/rollback_concurrent)
* [How to use the reject option](/langgraphjs/cloud/how-tos/reject_concurrent)
* [How to use the enqueue option](/langgraphjs/cloud/how-tos/enqueue_concurrent)

### Webhooks[¶](#webhooks "Permanent link")

* [How to integrate webhooks](/langgraphjs/cloud/how-tos/webhooks)

### Cron Jobs[¶](#cron-jobs "Permanent link")

* [How to create cron jobs](/langgraphjs/cloud/how-tos/cron_jobs)

### LangGraph Studio[¶](#langgraph-studio "Permanent link")

LangGraph Studio is a built-in UI for visualizing, testing, and debugging your agents.

* [How to connect to a LangGraph Cloud deployment](/langgraphjs/cloud/how-tos/test_deployment)
* [How to connect to a local deployment](/langgraphjs/cloud/how-tos/test_local_deployment)
* [How to test your graph in LangGraph Studio](/langgraphjs/cloud/how-tos/invoke_studio)
* [How to interact with threads in LangGraph Studio](/langgraphjs/cloud/how-tos/threads_studio)

## Troubleshooting[¶](#troubleshooting "Permanent link")

These are the guides for resolving common errors you may find while building with LangGraph. Errors referenced below will have an `lc_error_code` property corresponding to one of the below codes when they are thrown in code.

* [GRAPH\_RECURSION\_LIMIT](../troubleshooting/errors/GRAPH_RECURSION_LIMIT/)
* [INVALID\_CONCURRENT\_GRAPH\_UPDATE](../troubleshooting/errors/INVALID_CONCURRENT_GRAPH_UPDATE/)
* [INVALID\_GRAPH\_NODE\_RETURN\_VALUE](../troubleshooting/errors/INVALID_GRAPH_NODE_RETURN_VALUE/)
* [MULTIPLE\_SUBGRAPHS](../troubleshooting/errors/MULTIPLE_SUBGRAPHS/)
* [UNREACHABLE\_NODE](../troubleshooting/errors/UNREACHABLE_NODE/)

Was this page helpful?

Thanks for your feedback!

Thanks for your feedback! Please help us improve this page by adding to the discussion below.

Back to top

[Previous

Cloud Deploy](../cloud/quick_start/)
[Next

How to install and manage dependencies](manage-ecosystem-dependencies/)

Copyright © 2025 LangChain, Inc | [Consent Preferences](#__consent)

Made with
[Material for MkDocs Insiders](https://squidfunk.github.io/mkdocs-material/)

#### Cookie consent

We use cookies to recognize your repeated visits and preferences, as well as to measure the effectiveness of our documentation and whether users find what they're searching for. **Clicking "Accept" makes our documentation better. Thank you!** ❤️

* Google Analytics
* GitHub

Accept
Reject