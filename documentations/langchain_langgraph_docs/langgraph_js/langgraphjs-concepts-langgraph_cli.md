[Skip to content](#langgraphjs-cli)

**Help us build the JS tools that power AI apps at companies like Replit, Uber, LinkedIn, GitLab, and more. [Join our team!](https://jobs.ashbyhq.com/langchain/05efa205-8560-43fd-bfcc-3f7697561cfb?utm_source=https%3A%2F%2Flangchain-ai.github.io%2Flanggraphjs%2F&utm_campaign=langgraphjs_docs)**

[![logo](../../static/wordmark_dark.svg)
![logo](../../static/wordmark_light.svg)](../..)

LangGraph.js CLI

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
          - [LangGraph Studio](../langgraph_studio/)
          - LangGraph.js CLI

            [LangGraph.js CLI](./)

            Table of contents
            * [Installation](#installation)
            * [Commands](#commands)

              + [build](#build)
              + [dev](#dev)
              + [up](#up)
              + [dockerfile](#dockerfile)
            * [Related](#related)
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

* [Installation](#installation)
* [Commands](#commands)

  + [build](#build)
  + [dev](#dev)
  + [up](#up)
  + [dockerfile](#dockerfile)
* [Related](#related)

1. [LangGraph](../..)
2. [Guides](../../how-tos/)
3. [Concepts](../)
4. [LangGraph Platform](../../concepts#langgraph-platform)
5. [Components](../../concepts#components)

# LangGraph.js CLI[¶](#langgraphjs-cli "Permanent link")

Prerequisites

* [LangGraph Platform](../langgraph_platform/)
* [LangGraph Server](../langgraph_server/)

The LangGraph.js CLI is a multi-platform command-line tool for building and running the [LangGraph.js API server](../langgraph_server/) locally. This offers an alternative to the [LangGraph Studio desktop app](../langgraph_studio/) for developing and testing agents across all major operating systems (Linux, Windows, MacOS). The resulting server includes all API endpoints for your graph's runs, threads, assistants, etc. as well as the other services required to run your agent, including a managed database for checkpointing and storage.

## Installation[¶](#installation "Permanent link")

The LangGraph.js CLI can be installed from the NPM registry:

npxnpmyarnpnpmbun

```
npx @langchain/langgraph-cli

```

```
npm install @langchain/langgraph-cli

```

```
yarn add @langchain/langgraph-cli

```

```
pnpm add @langchain/langgraph-cli

```

```
bun add @langchain/langgraph-cli

```

## Commands[¶](#commands "Permanent link")

The CLI provides the following core functionality:

### `build`[¶](#build "Permanent link")

The `langgraph build` command builds a Docker image for the [LangGraph API server](../langgraph_server/) that can be directly deployed.

### `dev`[¶](#dev "Permanent link")

The `langgraph dev` command starts a lightweight development server that requires no Docker installation. This server is ideal for rapid development and testing, with features like:

* Hot reloading: Changes to your code are automatically detected and reloaded
* In-memory state with local persistence: Server state is stored in memory for speed but persisted locally between restarts

**Note**: This command is intended for local development and testing only. It is not recommended for production use.

### `up`[¶](#up "Permanent link")

The `langgraph up` command starts an instance of the [LangGraph API server](../langgraph_server/) locally in a docker container. This requires the docker server to be running locally. It also requires a LangSmith API key for local development or a license key for production use.

The server includes all API endpoints for your graph's runs, threads, assistants, etc. as well as the other services required to run your agent, including a managed database for checkpointing and storage.

### `dockerfile`[¶](#dockerfile "Permanent link")

The `langgraph dockerfile` command generates a [Dockerfile](https://docs.docker.com/reference/dockerfile/) that can be used to build images for and deploy instances of the [LangGraph API server](../langgraph_server/). This is useful if you want to further customize the dockerfile or deploy in a more custom way.

Updating your langgraph.json file

The `langgraph dockerfile` command translates all the configuration in your `langgraph.json` file into Dockerfile commands. When using this command, you will have to re-run it whenever you update your `langgraph.json` file. Otherwise, your changes will not be reflected when you build or run the dockerfile.

## Related[¶](#related "Permanent link")

* [LangGraph CLI API Reference](/langgraphjs/cloud/reference/cli/)

Was this page helpful?

Thanks for your feedback!

Thanks for your feedback! Please help us improve this page by adding to the discussion below.

Back to top

[Previous

LangGraph Studio](../langgraph_studio/)
[Next

LangGraph SDK](../sdk/)

Copyright © 2025 LangChain, Inc | [Consent Preferences](#__consent)

Made with
[Material for MkDocs Insiders](https://squidfunk.github.io/mkdocs-material/)

#### Cookie consent

We use cookies to recognize your repeated visits and preferences, as well as to measure the effectiveness of our documentation and whether users find what they're searching for. **Clicking "Accept" makes our documentation better. Thank you!** ❤️

* Google Analytics
* GitHub

Accept
Reject