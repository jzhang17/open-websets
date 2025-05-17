[ Skip to content](#application-structure) 

**Help us build the JS tools that power AI apps at companies like Replit, Uber, LinkedIn, GitLab, and more. [Join our team!](https://jobs.ashbyhq.com/langchain/05efa205-8560-43fd-bfcc-3f7697561cfb?utm%5Fsource=https%3A%2F%2Flangchain-ai.github.io%2Flanggraphjs%2F&utm%5Fcampaign=langgraphjs%5Fdocs)** 

[ ![logo](../../static/wordmark_dark.svg) ![logo](../../static/wordmark_light.svg) ](../..) 

 Application Structure 

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
                              * [  Components ](../../concepts#components)  
                              * LangGraph Server  
                               LangGraph Server  
                                             * [  LangGraph Server ](../../concepts#langgraph-server)  
                                             * Application Structure [  Application Structure ](./)  
                                              Table of contents  
                                                               * [  Overview ](#overview)  
                                                               * [  Key Concepts ](#key-concepts)  
                                                               * [  File Structure ](#file-structure)  
                                                               * [  Configuration File ](#configuration-file)  
                                                                                    * [  Examples ](#examples)  
                                                               * [  Dependencies ](#dependencies)  
                                                               * [  Graphs ](#graphs)  
                                                               * [  Environment Variables ](#environment-variables)  
                                                               * [  Related ](#related)  
                                             * [  Assistants ](../assistants/)  
                                             * [  Double Texting ](../double%5Ftexting/)  
                                             * [  Authentication & Access Control ](../auth/)  
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
* [  Key Concepts ](#key-concepts)
* [  File Structure ](#file-structure)
* [  Configuration File ](#configuration-file)  
   * [  Examples ](#examples)
* [  Dependencies ](#dependencies)
* [  Graphs ](#graphs)
* [  Environment Variables ](#environment-variables)
* [  Related ](#related)

1. [  LangGraph ](../..)
2. [  Guides ](../../how-tos/)
3. [  Concepts ](../)
4. [  LangGraph Platform ](../../concepts#langgraph-platform)
5. [  LangGraph Server ](../../concepts#langgraph-server)

# Application Structure[¶](#application-structure "Permanent link")

Prerequisites

* [LangGraph Server](../langgraph%5Fserver/)
* [LangGraph Glossary](../low%5Flevel/)

## Overview[¶](#overview "Permanent link")

A LangGraph application consists of one or more graphs, a LangGraph API Configuration file (`langgraph.json`), a file that specifies dependencies, and an optional .env file that specifies environment variables.

This guide shows a typical structure for a LangGraph application and shows how the required information to deploy a LangGraph application using the LangGraph Platform is specified.

## Key Concepts[¶](#key-concepts "Permanent link")

To deploy using the LangGraph Platform, the following information should be provided:

1. A [LangGraph API Configuration file](#configuration-file) (`langgraph.json`) that specifies the dependencies, graphs, environment variables to use for the application.
2. The [graphs](#graphs) that implement the logic of the application.
3. A file that specifies [dependencies](#dependencies) required to run the application.
4. [Environment variable](#environment-variables) that are required for the application to run.

## File Structure[¶](#file-structure "Permanent link")

Below are examples of directory structures for Python and JavaScript applications:

JS (package.json)Python (requirements.txt)Python (pyproject.toml)

`[](#%5F%5Fcodelineno-0-1)my-app/
[](#%5F%5Fcodelineno-0-2)├── src # all project code lies within here
[](#%5F%5Fcodelineno-0-3)│   ├── utils # optional utilities for your graph
[](#%5F%5Fcodelineno-0-4)│   │   ├── tools.ts # tools for your graph
[](#%5F%5Fcodelineno-0-5)│   │   ├── nodes.ts # node functions for you graph
[](#%5F%5Fcodelineno-0-6)│   │   └── state.ts # state definition of your graph
[](#%5F%5Fcodelineno-0-7)│   └── agent.ts # code for constructing your graph
[](#%5F%5Fcodelineno-0-8)├── package.json # package dependencies
[](#%5F%5Fcodelineno-0-9)├── .env # environment variables
[](#%5F%5Fcodelineno-0-10)└── langgraph.json # configuration file for LangGraph
`

`[](#%5F%5Fcodelineno-1-1)my-app/
[](#%5F%5Fcodelineno-1-2)├── my_agent # all project code lies within here
[](#%5F%5Fcodelineno-1-3)│   ├── utils # utilities for your graph
[](#%5F%5Fcodelineno-1-4)│   │   ├── __init__.py
[](#%5F%5Fcodelineno-1-5)│   │   ├── tools.py # tools for your graph
[](#%5F%5Fcodelineno-1-6)│   │   ├── nodes.py # node functions for you graph
[](#%5F%5Fcodelineno-1-7)│   │   └── state.py # state definition of your graph
[](#%5F%5Fcodelineno-1-8)│   ├── requirements.txt # package dependencies
[](#%5F%5Fcodelineno-1-9)│   ├── __init__.py
[](#%5F%5Fcodelineno-1-10)│   └── agent.py # code for constructing your graph
[](#%5F%5Fcodelineno-1-11)├── .env # environment variables
[](#%5F%5Fcodelineno-1-12)└── langgraph.json # configuration file for LangGraph
`

`[](#%5F%5Fcodelineno-2-1)my-app/
[](#%5F%5Fcodelineno-2-2)├── my_agent # all project code lies within here
[](#%5F%5Fcodelineno-2-3)│   ├── utils # utilities for your graph
[](#%5F%5Fcodelineno-2-4)│   │   ├── __init__.py
[](#%5F%5Fcodelineno-2-5)│   │   ├── tools.py # tools for your graph
[](#%5F%5Fcodelineno-2-6)│   │   ├── nodes.py # node functions for you graph
[](#%5F%5Fcodelineno-2-7)│   │   └── state.py # state definition of your graph
[](#%5F%5Fcodelineno-2-8)│   ├── __init__.py
[](#%5F%5Fcodelineno-2-9)│   └── agent.py # code for constructing your graph
[](#%5F%5Fcodelineno-2-10)├── .env # environment variables
[](#%5F%5Fcodelineno-2-11)├── langgraph.json  # configuration file for LangGraph
[](#%5F%5Fcodelineno-2-12)└── pyproject.toml # dependencies for your project
`

Note

The directory structure of a LangGraph application can vary depending on the programming language and the package manager used.

## Configuration File[¶](#configuration-file "Permanent link")

The `langgraph.json` file is a JSON file that specifies the dependencies, graphs, environment variables, and other settings required to deploy a LangGraph application.

The file supports specification of the following information:

| Key               | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| dependencies      | **Required**. Array of dependencies for LangGraph API server. Dependencies can be one of the following: (1) ".", which will look for local Python packages, (2) pyproject.toml, setup.py or requirements.txt in the app directory "./local\_package", or (3) a package name.                                                                                                                                                                                                                             |
| graphs            | **Required**. Mapping from graph ID to path where the compiled graph or a function that makes a graph is defined. Example: ./your\_package/your\_file.py:variable, where variable is an instance of langgraph.graph.state.CompiledStateGraph./your\_package/your\_file.py:make\_graph, where make\_graph is a function that takes a config dictionary (langchain\_core.runnables.RunnableConfig) and creates an instance of langgraph.graph.state.StateGraph / langgraph.graph.state.CompiledStateGraph. |
| env               | Path to .env file or a mapping from environment variable to its value.                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| node\_version     | Defaults to 20.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| dockerfile\_lines | Array of additional lines to add to Dockerfile following the import from parent image.                                                                                                                                                                                                                                                                                                                                                                                                                   |

Tip

The LangGraph CLI defaults to using the configuration file **langgraph.json** in the current directory.

### Examples[¶](#examples "Permanent link")

JavaScriptPython

* The dependencies will be loaded from a dependency file in the local directory (e.g., `package.json`).
* A single graph will be loaded from the file `./your_package/your_file.js` with the function `agent`.
* The environment variable `OPENAI_API_KEY` is set inline.

`[](#%5F%5Fcodelineno-3-1){
[](#%5F%5Fcodelineno-3-2)    "dependencies": [
[](#%5F%5Fcodelineno-3-3)      "."
[](#%5F%5Fcodelineno-3-4)    ],
[](#%5F%5Fcodelineno-3-5)    "graphs": {
[](#%5F%5Fcodelineno-3-6)      "my_agent": "./your_package/your_file.js:agent"
[](#%5F%5Fcodelineno-3-7)    },
[](#%5F%5Fcodelineno-3-8)    "env": {
[](#%5F%5Fcodelineno-3-9)      "OPENAI_API_KEY": "secret-key"
[](#%5F%5Fcodelineno-3-10)    }
[](#%5F%5Fcodelineno-3-11)}
`

* The dependencies involve a custom local package and the `langchain_openai` package.
* A single graph will be loaded from the file `./your_package/your_file.py` with the variable `variable`.
* The environment variables are loaded from the `.env` file.

`[](#%5F%5Fcodelineno-4-1){
[](#%5F%5Fcodelineno-4-2)    "dependencies": [
[](#%5F%5Fcodelineno-4-3)        "langchain_openai",
[](#%5F%5Fcodelineno-4-4)        "./your_package"
[](#%5F%5Fcodelineno-4-5)    ],
[](#%5F%5Fcodelineno-4-6)    "graphs": {
[](#%5F%5Fcodelineno-4-7)        "my_agent": "./your_package/your_file.py:agent"
[](#%5F%5Fcodelineno-4-8)    },
[](#%5F%5Fcodelineno-4-9)    "env": "./.env"
[](#%5F%5Fcodelineno-4-10)}
`

## Dependencies[¶](#dependencies "Permanent link")

A LangGraph application may depend on other Python packages or JavaScript libraries (depending on the programming language in which the application is written).

You will generally need to specify the following information for dependencies to be set up correctly:

1. A file in the directory that specifies the dependencies (e.g., `requirements.txt`, `pyproject.toml`, or `package.json`).
2. A `dependencies` key in the [LangGraph configuration file](#configuration-file) that specifies the dependencies required to run the LangGraph application.
3. Any additional binaries or system libraries can be specified using `dockerfile_lines` key in the [LangGraph configuration file](#configuration-file).

## Graphs[¶](#graphs "Permanent link")

Use the `graphs` key in the [LangGraph configuration file](#configuration-file) to specify which graphs will be available in the deployed LangGraph application.

You can specify one or more graphs in the configuration file. Each graph is identified by a name (which should be unique) and a path for either: (1) the compiled graph or (2) a function that makes a graph is defined.

## Environment Variables[¶](#environment-variables "Permanent link")

If you're working with a deployed LangGraph application locally, you can configure environment variables in the `env` key of the [LangGraph configuration file](#configuration-file).

For a production deployment, you will typically want to configure the environment variables in the deployment environment.

## Related[¶](#related "Permanent link")

Please see the following resources for more information:

* How-to guides for [Application Structure](../../how-tos/#application-structure).

 Was this page helpful? 

 Thanks for your feedback!

 Thanks for your feedback! Please help us improve this page by adding to the discussion below.

 Back to top 

[  Previous  How to interact with the deployment using RemoteGraph ](../../how-tos/use-remote-graph/) [  Next  Assistants ](../assistants/) 

 Copyright © 2025 LangChain, Inc | [Consent Preferences](#%5F%5Fconsent) 

 Made with[ Material for MkDocs Insiders](https://squidfunk.github.io/mkdocs-material/) 

[ ](https://langchain-ai.github.io/langgraph/ "langchain-ai.github.io") [ ](https://github.com/langchain-ai/langgraphjs "github.com") [ ](https://twitter.com/LangChainAI "twitter.com") 

#### Cookie consent

We use cookies to recognize your repeated visits and preferences, as well as to measure the effectiveness of our documentation and whether users find what they're searching for. **Clicking "Accept" makes our documentation better. Thank you!** ❤️

* Google Analytics
* GitHub

Accept Reject 