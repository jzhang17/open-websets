[ Skip to content](#langgraph-sdk) 

**Help us build the JS tools that power AI apps at companies like Replit, Uber, LinkedIn, GitLab, and more. [Join our team!](https://jobs.ashbyhq.com/langchain/05efa205-8560-43fd-bfcc-3f7697561cfb?utm%5Fsource=https%3A%2F%2Flangchain-ai.github.io%2Flanggraphjs%2F&utm%5Fcampaign=langgraphjs%5Fdocs)** 

[ ![logo](../../static/wordmark_dark.svg) ![logo](../../static/wordmark_light.svg) ](../..) 

 LangGraph SDK 

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
                                             * [  LangGraph Server ](../langgraph%5Fserver/)  
                                             * [  LangGraph Studio ](../langgraph%5Fstudio/)  
                                             * [  LangGraph.js CLI ](../langgraph%5Fcli/)  
                                             * LangGraph SDK [  LangGraph SDK ](./)  
                                              Table of contents  
                                                               * [  Installation ](#installation)  
                                                               * [  API Reference ](#api-reference)  
                                                               * [  Python Sync vs. Async ](#python-sync-vs-async)  
                                                               * [  Related ](#related)  
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
* [  Installation ](#installation)
* [  API Reference ](#api-reference)
* [  Python Sync vs. Async ](#python-sync-vs-async)
* [  Related ](#related)

1. [  LangGraph ](../..)
2. [  Guides ](../../how-tos/)
3. [  Concepts ](../)
4. [  LangGraph Platform ](../../concepts#langgraph-platform)
5. [  Components ](../../concepts#components)

# LangGraph SDK[¶](#langgraph-sdk "Permanent link")

Prerequisites

* [LangGraph Platform](../langgraph%5Fplatform/)
* [LangGraph Server](../langgraph%5Fserver/)

The LangGraph Platform provides both a Python and JS SDK for interacting with the [LangGraph Server API](../langgraph%5Fserver/). 

## Installation[¶](#installation "Permanent link")

You can install the packages using the appropriate package manager for your language.

PythonJS

`[](#%5F%5Fcodelineno-0-1)pip install langgraph-sdk
`

`[](#%5F%5Fcodelineno-1-1)yarn add @langchain/langgraph-sdk
`

## API Reference[¶](#api-reference "Permanent link")

You can find the API reference for the SDKs here:

* [Python SDK Reference](/langgraphjs/cloud/reference/sdk/python%5Fsdk%5Fref/)
* [JS/TS SDK Reference](/langgraphjs/cloud/reference/sdk/js%5Fts%5Fsdk%5Fref/)

## Python Sync vs. Async[¶](#python-sync-vs-async "Permanent link")

The Python SDK provides both synchronous (`get_sync_client`) and asynchronous (`get_client`) clients for interacting with the LangGraph Server API.

AsyncSync

`[](#%5F%5Fcodelineno-2-1)from langgraph_sdk import get_client
[](#%5F%5Fcodelineno-2-2)
[](#%5F%5Fcodelineno-2-3)client = get_client(url=..., api_key=...)
[](#%5F%5Fcodelineno-2-4)await client.assistants.search()
`

`[](#%5F%5Fcodelineno-3-1)from langgraph_sdk import get_sync_client
[](#%5F%5Fcodelineno-3-2)
[](#%5F%5Fcodelineno-3-3)client = get_sync_client(url=..., api_key=...)
[](#%5F%5Fcodelineno-3-4)client.assistants.search()
`

## Related[¶](#related "Permanent link")

* [LangGraph CLI API Reference](/langgraphjs/cloud/reference/cli/)
* [Python SDK Reference](/langgraphjs/cloud/reference/sdk/python%5Fsdk%5Fref/)
* [JS/TS SDK Reference](/langgraphjs/cloud/reference/sdk/js%5Fts%5Fsdk%5Fref/)

 Was this page helpful? 

 Thanks for your feedback!

 Thanks for your feedback! Please help us improve this page by adding to the discussion below.

 Back to top 

[  Previous  LangGraph.js CLI ](../langgraph%5Fcli/) [  Next  How to interact with the deployment using RemoteGraph ](../../how-tos/use-remote-graph/) 

 Copyright © 2025 LangChain, Inc | [Consent Preferences](#%5F%5Fconsent) 

 Made with[ Material for MkDocs Insiders](https://squidfunk.github.io/mkdocs-material/) 

[ ](https://langchain-ai.github.io/langgraph/ "langchain-ai.github.io") [ ](https://github.com/langchain-ai/langgraphjs "github.com") [ ](https://twitter.com/LangChainAI "twitter.com") 

#### Cookie consent

We use cookies to recognize your repeated visits and preferences, as well as to measure the effectiveness of our documentation and whether users find what they're searching for. **Clicking "Accept" makes our documentation better. Thank you!** ❤️

* Google Analytics
* GitHub

Accept Reject 