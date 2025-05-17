[ Skip to content](#cloud-saas) 

**Help us build the JS tools that power AI apps at companies like Replit, Uber, LinkedIn, GitLab, and more. [Join our team!](https://jobs.ashbyhq.com/langchain/05efa205-8560-43fd-bfcc-3f7697561cfb?utm%5Fsource=https%3A%2F%2Flangchain-ai.github.io%2Flanggraphjs%2F&utm%5Fcampaign=langgraphjs%5Fdocs)** 

[ ![logo](../../static/wordmark_dark.svg) ![logo](../../static/wordmark_light.svg) ](../..) 

 Cloud SaaS 

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
                                             * [  Self-Hosted ](../self%5Fhosted/)  
                                             * Cloud SaaS [  Cloud SaaS ](./)  
                                              Table of contents  
                                                               * [  Overview ](#overview)  
                                                               * [  Deployment ](#deployment)  
                                                               * [  Revision ](#revision)  
                                                               * [  Asynchronous Deployment ](#asynchronous-deployment)  
                                                               * [  Architecture ](#architecture)  
                                                               * [  Related ](#related)  
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
* [  Overview ](#overview)
* [  Deployment ](#deployment)
* [  Revision ](#revision)
* [  Asynchronous Deployment ](#asynchronous-deployment)
* [  Architecture ](#architecture)
* [  Related ](#related)

1. [  LangGraph ](../..)
2. [  Guides ](../../how-tos/)
3. [  Concepts ](../)
4. [  LangGraph Platform ](../../concepts#langgraph-platform)
5. [  Deployment Options ](../../concepts#deployment-options)

# Cloud SaaS[¶](#cloud-saas "Permanent link")

Prerequisites

* [LangGraph Platform](../langgraph%5Fplatform/)
* [LangGraph Server](../langgraph%5Fserver/)

## Overview[¶](#overview "Permanent link")

LangGraph's Cloud SaaS is a managed service that provides a scalable and secure environment for deploying LangGraph APIs. It is designed to work seamlessly with your LangGraph API regardless of how it is defined, what tools it uses, or any dependencies. Cloud SaaS provides a simple way to deploy and manage your LangGraph API in the cloud.

## Deployment[¶](#deployment "Permanent link")

A **deployment** is an instance of a LangGraph API. A single deployment can have many [revisions](#revision). When a deployment is created, all the necessary infrastructure (e.g. database, containers, secrets store) are automatically provisioned. See the [architecture diagram](#architecture) below for more details.

See the [how-to guide](/langgraphjs/cloud/deployment/cloud.md#create-new-deployment) for creating a new deployment.

## Revision[¶](#revision "Permanent link")

A revision is an iteration of a [deployment](#deployment). When a new deployment is created, an initial revision is automatically created. To deploy new code changes or update environment variable configurations for a deployment, a new revision must be created. When a revision is created, a new container image is built automatically.

See the [how-to guide](/langgraphjs/cloud/deployment/cloud.md#create-new-revision) for creating a new revision.

## Asynchronous Deployment[¶](#asynchronous-deployment "Permanent link")

Infrastructure for [deployments](#deployment) and [revisions](#revision) are provisioned and deployed asynchronously. They are not deployed immediately after submission. Currently, deployment can take up to several minutes.

## Architecture[¶](#architecture "Permanent link")

Subject to Change

The Cloud SaaS deployment architecture may change in the future.

A high-level diagram of a Cloud SaaS deployment.

![diagram](../img/langgraph_cloud_architecture.png)

## Related[¶](#related "Permanent link")

* [Deployment Options](../deployment%5Foptions/)

 Was this page helpful? 

 Thanks for your feedback!

 Thanks for your feedback! Please help us improve this page by adding to the discussion below.

 Back to top 

[  Previous  Self-Hosted ](../self%5Fhosted/) [  Next  Bring Your Own Cloud (BYOC) ](../bring%5Fyour%5Fown%5Fcloud/) 

 Copyright © 2025 LangChain, Inc | [Consent Preferences](#%5F%5Fconsent) 

 Made with[ Material for MkDocs Insiders](https://squidfunk.github.io/mkdocs-material/) 

[ ](https://langchain-ai.github.io/langgraph/ "langchain-ai.github.io") [ ](https://github.com/langchain-ai/langgraphjs "github.com") [ ](https://twitter.com/LangChainAI "twitter.com") 

#### Cookie consent

We use cookies to recognize your repeated visits and preferences, as well as to measure the effectiveness of our documentation and whether users find what they're searching for. **Clicking "Accept" makes our documentation better. Thank you!** ❤️

* Google Analytics
* GitHub

Accept Reject 