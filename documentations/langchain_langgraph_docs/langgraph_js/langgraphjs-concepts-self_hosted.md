[ Skip to content](#self-hosted) 

**Help us build the JS tools that power AI apps at companies like Replit, Uber, LinkedIn, GitLab, and more. [Join our team!](https://jobs.ashbyhq.com/langchain/05efa205-8560-43fd-bfcc-3f7697561cfb?utm%5Fsource=https%3A%2F%2Flangchain-ai.github.io%2Flanggraphjs%2F&utm%5Fcampaign=langgraphjs%5Fdocs)** 

[ ![logo](../../static/wordmark_dark.svg) ![logo](../../static/wordmark_light.svg) ](../..) 

 Self-Hosted 

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
                              * [  LangGraph Server ](../../concepts#langgraph-server)  
                              * Deployment Options  
                               Deployment Options  
                                             * [  Deployment Options ](../../concepts#deployment-options)  
                                             * Self-Hosted [  Self-Hosted ](./)  
                                              Table of contents  
                                                               * [  Versions ](#versions)  
                                                                                    * [  Self-Hosted Lite ](#self-hosted-lite)  
                                                                                    * [  Self-Hosted Enterprise ](#self-hosted-enterprise)  
                                                               * [  Requirements ](#requirements)  
                                                               * [  How it works ](#how-it-works)  
                                             * [  Cloud SaaS ](../langgraph%5Fcloud/)  
                                             * [  Bring Your Own Cloud (BYOC) ](../bring%5Fyour%5Fown%5Fcloud/)  
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
* [  Versions ](#versions)  
   * [  Self-Hosted Lite ](#self-hosted-lite)  
   * [  Self-Hosted Enterprise ](#self-hosted-enterprise)
* [  Requirements ](#requirements)
* [  How it works ](#how-it-works)

1. [  LangGraph ](../..)
2. [  Guides ](../../how-tos/)
3. [  Concepts ](../)
4. [  LangGraph Platform ](../../concepts#langgraph-platform)
5. [  Deployment Options ](../../concepts#deployment-options)

# Self-Hosted[¶](#self-hosted "Permanent link")

Note

* [LangGraph Platform](../langgraph%5Fplatform/)
* [Deployment Options](../deployment%5Foptions/)

## Versions[¶](#versions "Permanent link")

There are two versions of the self hosted deployment: [Self-Hosted Enterprise](../deployment%5Foptions/#self-hosted-enterprise) and [Self-Hosted Lite](../deployment%5Foptions/#self-hosted-lite).

### Self-Hosted Lite[¶](#self-hosted-lite "Permanent link")

The Self-Hosted Lite version is a limited version of LangGraph Platform that you can run locally or in a self-hosted manner (up to 1 million nodes executed).

When using the Self-Hosted Lite version, you authenticate with a [LangSmith](https://smith.langchain.com/) API key.

### Self-Hosted Enterprise[¶](#self-hosted-enterprise "Permanent link")

The Self-Hosted Enterprise version is the full version of LangGraph Platform.

To use the Self-Hosted Enterprise version, you must acquire a license key that you will need to pass in when running the Docker image. To acquire a license key, please email [sales@langchain.dev](mailto:sales@langchain.dev).

## Requirements[¶](#requirements "Permanent link")

* You use `langgraph-cli` and/or [LangGraph Studio](../langgraph%5Fstudio/) app to test graph locally.
* You use `langgraph build` command to build image.

## How it works[¶](#how-it-works "Permanent link")

* Deploy Redis and Postgres instances on your own infrastructure.
* Build the docker image for [LangGraph Server](../langgraph%5Fserver/) using the [LangGraph CLI](../langgraph%5Fcli/)
* Deploy a web server that will run the docker image and pass in the necessary environment variables.

See the [how-to guide](../../how-tos/deploy-self-hosted/)

 Was this page helpful? 

 Thanks for your feedback!

 Thanks for your feedback! Please help us improve this page by adding to the discussion below.

 Back to top 

[  Previous  Authentication & Access Control ](../auth/) [  Next  Cloud SaaS ](../langgraph%5Fcloud/) 

 Copyright © 2025 LangChain, Inc | [Consent Preferences](#%5F%5Fconsent) 

 Made with[ Material for MkDocs Insiders](https://squidfunk.github.io/mkdocs-material/) 

[ ](https://langchain-ai.github.io/langgraph/ "langchain-ai.github.io") [ ](https://github.com/langchain-ai/langgraphjs "github.com") [ ](https://twitter.com/LangChainAI "twitter.com") 

#### Cookie consent

We use cookies to recognize your repeated visits and preferences, as well as to measure the effectiveness of our documentation and whether users find what they're searching for. **Clicking "Accept" makes our documentation better. Thank you!** ❤️

* Google Analytics
* GitHub

Accept Reject 