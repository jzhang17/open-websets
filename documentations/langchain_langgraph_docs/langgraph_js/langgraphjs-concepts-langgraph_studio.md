[Skip to content](#langgraph-studio)

**Help us build the JS tools that power AI apps at companies like Replit, Uber, LinkedIn, GitLab, and more. [Join our team!](https://jobs.ashbyhq.com/langchain/05efa205-8560-43fd-bfcc-3f7697561cfb?utm_source=https%3A%2F%2Flangchain-ai.github.io%2Flanggraphjs%2F&utm_campaign=langgraphjs_docs)**

[![logo](../../static/wordmark_dark.svg)
![logo](../../static/wordmark_light.svg)](../..)

LangGraph Studio

Initializing search

[GitHub](https://github.com/langchain-ai/langgraphjs "Go to repository")

* [LangGraph](../..)
* [Agents](../../agents/overview/)
* [API reference](../../reference/)
* [Versions](../../versions/)

[![logo](../../static/wordmark_dark.svg)
![logo](../../static/wordmark_light.svg)](../..)

[GitHub](https://github.com/langchain-ai/langgraphjs "Go to repository")

* [LangGraph](../..)

  LangGraph
  + Get started

    Get started
    - [Learn the basics](../../tutorials/quickstart/)
    - [Deployment](../../tutorials/deployment/)
  + Guides

    Guides
    - [How-to Guides](../../how-tos/)
    - [Concepts](../)

      Concepts
      * [LangGraph](../../concepts#langgraph)
      * LangGraph Platform

        LangGraph Platform
        + [LangGraph Platform](../../concepts#langgraph-platform)
        + [High Level](../../concepts#high-level)
        + Components

          Components
          - [Components](../../concepts#components)
          - [LangGraph Server](../langgraph_server/)
          - LangGraph Studio

            [LangGraph Studio](./)

            Table of contents
            * [Features](#features)
            * [Types](#types)

              + [Desktop app](#desktop-app)
              + [Cloud studio](#cloud-studio)
            * [Studio FAQs](#studio-faqs)

              + [Why is my project failing to start?](#why-is-my-project-failing-to-start)

                - [Docker issues (desktop only)](#docker-issues-desktop-only)
                - [Configuration or environment issues](#configuration-or-environment-issues)
              + [How does interrupt work?](#how-does-interrupt-work)
              + [How do I reload the app? (desktop only)](#how-do-i-reload-the-app-desktop-only)
              + [How does automatic rebuilding work? (desktop only)](#how-does-automatic-rebuilding-work-desktop-only)

                - [Rebuilds from source code changes](#rebuilds-from-source-code-changes)
                - [Rebuilds from configuration or dependency changes](#rebuilds-from-configuration-or-dependency-changes)
              + [Why is my graph taking so long to startup? (desktop only)](#why-is-my-graph-taking-so-long-to-startup-desktop-only)
            * [Why are extra edges showing up in my graph?](#why-are-extra-edges-showing-up-in-my-graph)

              + [Solution 1: Include a path map](#solution-1-include-a-path-map)
              + [Solution 2: Update the typing of the router (Python only)](#solution-2-update-the-typing-of-the-router-python-only)
            * [Related](#related)
          - [LangGraph.js CLI](../langgraph_cli/)
          - [LangGraph SDK](../sdk/)
          - [How to interact with the deployment using RemoteGraph](../../how-tos/use-remote-graph/)
        + [LangGraph Server](../../concepts#langgraph-server)
        + [Deployment Options](../../concepts#deployment-options)
    - [Tutorials](../../tutorials/)
  + Resources

    Resources
    - [Adopters](../../adopters/)
    - [LLMS-txt](../../llms-txt-overview/)
    - [FAQ](../faq/)
    - [Troubleshooting](../../troubleshooting/errors/)
    - [LangGraph Academy Course](https://academy.langchain.com/courses/intro-to-langgraph)
* [Agents](../../agents/overview/)
* [API reference](../../reference/)
* [Versions](../../versions/)

Table of contents

* [Features](#features)
* [Types](#types)

  + [Desktop app](#desktop-app)
  + [Cloud studio](#cloud-studio)
* [Studio FAQs](#studio-faqs)

  + [Why is my project failing to start?](#why-is-my-project-failing-to-start)

    - [Docker issues (desktop only)](#docker-issues-desktop-only)
    - [Configuration or environment issues](#configuration-or-environment-issues)
  + [How does interrupt work?](#how-does-interrupt-work)
  + [How do I reload the app? (desktop only)](#how-do-i-reload-the-app-desktop-only)
  + [How does automatic rebuilding work? (desktop only)](#how-does-automatic-rebuilding-work-desktop-only)

    - [Rebuilds from source code changes](#rebuilds-from-source-code-changes)
    - [Rebuilds from configuration or dependency changes](#rebuilds-from-configuration-or-dependency-changes)
  + [Why is my graph taking so long to startup? (desktop only)](#why-is-my-graph-taking-so-long-to-startup-desktop-only)
* [Why are extra edges showing up in my graph?](#why-are-extra-edges-showing-up-in-my-graph)

  + [Solution 1: Include a path map](#solution-1-include-a-path-map)
  + [Solution 2: Update the typing of the router (Python only)](#solution-2-update-the-typing-of-the-router-python-only)
* [Related](#related)

1. [LangGraph](../..)
2. [Guides](../../how-tos/)
3. [Concepts](../)
4. [LangGraph Platform](../../concepts#langgraph-platform)
5. [Components](../../concepts#components)

# LangGraph Studio[¶](#langgraph-studio "Permanent link")

Prerequisites

* [LangGraph Platform](../langgraph_platform/)
* [LangGraph Server](../langgraph_server/)

LangGraph Studio offers a new way to develop LLM applications by providing a specialized agent IDE that enables visualization, interaction, and debugging of complex agentic applications.

With visual graphs and the ability to edit state, you can better understand agent workflows and iterate faster. LangGraph Studio integrates with LangSmith allowing you to collaborate with teammates to debug failure modes.

![](../img/lg_studio.png)

## Features[¶](#features "Permanent link")

The key features of LangGraph Studio are:

* Visualizes your graph
* Test your graph by running it from the UI
* Debug your agent by [modifying its state and rerunning](../human_in_the_loop/)
* Create and manage [assistants](../assistants/)
* View and manage [threads](../persistence/#threads)
* View and manage [long term memory](../memory/)
* Add node input/outputs to [LangSmith](https://smith.langchain.com/) datasets for testing

## Types[¶](#types "Permanent link")

### Desktop app[¶](#desktop-app "Permanent link")

LangGraph Studio is available as a [desktop app](https://studio.langchain.com/) for MacOS users.

While in Beta, LangGraph Studio is available for free to all [LangSmith](https://smith.langchain.com/) users on any plan tier.

### Cloud studio[¶](#cloud-studio "Permanent link")

If you have deployed your LangGraph application on LangGraph Platform (Cloud), you can access the studio as part of that

## Studio FAQs[¶](#studio-faqs "Permanent link")

### Why is my project failing to start?[¶](#why-is-my-project-failing-to-start "Permanent link")

There are a few reasons that your project might fail to start, here are some of the most common ones.

#### Docker issues (desktop only)[¶](#docker-issues-desktop-only "Permanent link")

LangGraph Studio (desktop) requires Docker Desktop version 4.24 or higher. Please make sure you have a version of Docker installed that satisfies that requirement and also make sure you have the Docker Desktop app up and running before trying to use LangGraph Studio. In addition, make sure you have docker-compose updated to version 2.22.0 or higher.

#### Configuration or environment issues[¶](#configuration-or-environment-issues "Permanent link")

Another reason your project might fail to start is because your configuration file is defined incorrectly, or you are missing required environment variables.

### How does interrupt work?[¶](#how-does-interrupt-work "Permanent link")

When you select the `Interrupts` dropdown and select a node to interrupt the graph will pause execution before and after (unless the node goes straight to `END`) that node has run. This means that you will be able to both edit the state before the node is ran and the state after the node has ran. This is intended to allow developers more fine-grained control over the behavior of a node and make it easier to observe how the node is behaving. You will not be able to edit the state after the node has ran if the node is the final node in the graph.

### How do I reload the app? (desktop only)[¶](#how-do-i-reload-the-app-desktop-only "Permanent link")

If you would like to reload the app, don't use Command+R as you might normally do. Instead, close and reopen the app for a full refresh.

### How does automatic rebuilding work? (desktop only)[¶](#how-does-automatic-rebuilding-work-desktop-only "Permanent link")

One of the key features of LangGraph Studio is that it automatically rebuilds your image when you change the source code. This allows for a super fast development and testing cycle which makes it easy to iterate on your graph. There are two different ways that LangGraph rebuilds your image: either by editing the image or completely rebuilding it.

#### Rebuilds from source code changes[¶](#rebuilds-from-source-code-changes "Permanent link")

If you modified the source code only (no configuration or dependency changes!) then the image does not require a full rebuild, and LangGraph Studio will only update the relevant parts. The UI status in the bottom left will switch from `Online` to `Stopping` temporarily while the image gets edited. The logs will be shown as this process is happening, and after the image has been edited the status will change back to `Online` and you will be able to run your graph with the modified code!

#### Rebuilds from configuration or dependency changes[¶](#rebuilds-from-configuration-or-dependency-changes "Permanent link")

If you edit your graph configuration file (`langgraph.json`) or the dependencies (either `pyproject.toml` or `requirements.txt`) then the entire image will be rebuilt. This will cause the UI to switch away from the graph view and start showing the logs of the new image building process. This can take a minute or two, and once it is done your updated image will be ready to use!

### Why is my graph taking so long to startup? (desktop only)[¶](#why-is-my-graph-taking-so-long-to-startup-desktop-only "Permanent link")

The LangGraph Studio interacts with a local LangGraph API server. To stay aligned with ongoing updates, the LangGraph API requires regular rebuilding. As a result, you may occasionally experience slight delays when starting up your project.

## Why are extra edges showing up in my graph?[¶](#why-are-extra-edges-showing-up-in-my-graph "Permanent link")

If you don't define your conditional edges carefully, you might notice extra edges appearing in your graph. This is because without proper definition, LangGraph Studio assumes the conditional edge could access all other nodes. In order for this to not be the case, you need to be explicit about how you define the nodes the conditional edge routes to. There are two ways you can do this:

### Solution 1: Include a path map[¶](#solution-1-include-a-path-map "Permanent link")

The first way to solve this is to add path maps to your conditional edges. A path map is just a dictionary or array that maps the possible outputs of your router function with the names of the nodes that each output corresponds to. The path map is passed as the third argument to the `add_conditional_edges` function like so:

PythonJavascript

```
graph.add_conditional_edges("node_a", routing_function, {True: "node_b", False: "node_c"})

```

```
graph.addConditionalEdges("node_a", routingFunction, { foo: "node_b", bar: "node_c" });

```

In this case, the routing function returns either True or False, which map to `node_b` and `node_c` respectively.

### Solution 2: Update the typing of the router (Python only)[¶](#solution-2-update-the-typing-of-the-router-python-only "Permanent link")

Instead of passing a path map, you can also be explicit about the typing of your routing function by specifying the nodes it can map to using the `Literal` python definition. Here is an example of how to define a routing function in that way:

```
def routing_function(state: GraphState) -> Literal["node_b","node_c"]:
    if state['some_condition'] == True:
        return "node_b"
    else:
        return "node_c"

```

## Related[¶](#related "Permanent link")

For more information please see the following:

* [LangGraph Studio how-to guides](../../how-tos/#langgraph-studio)

Was this page helpful?

Thanks for your feedback!

Thanks for your feedback! Please help us improve this page by adding to the discussion below.

Back to top

[Previous

LangGraph Server](../langgraph_server/)
[Next

LangGraph.js CLI](../langgraph_cli/)

Copyright © 2025 LangChain, Inc | [Consent Preferences](#__consent)

Made with
[Material for MkDocs Insiders](https://squidfunk.github.io/mkdocs-material/)

#### Cookie consent

We use cookies to recognize your repeated visits and preferences, as well as to measure the effectiveness of our documentation and whether users find what they're searching for. **Clicking "Accept" makes our documentation better. Thank you!** ❤️

* Google Analytics
* GitHub

Accept
Reject