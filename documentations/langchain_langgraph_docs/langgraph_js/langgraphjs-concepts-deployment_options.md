[ Skip to content](#deployment-options) 

**Help us build the JS tools that power AI apps at companies like Replit, Uber, LinkedIn, GitLab, and more. [Join our team!](https://jobs.ashbyhq.com/langchain/05efa205-8560-43fd-bfcc-3f7697561cfb?utm%5Fsource=https%3A%2F%2Flangchain-ai.github.io%2Flanggraphjs%2F&utm%5Fcampaign=langgraphjs%5Fdocs)** 

[ ![logo](../../static/wordmark_dark.svg) ![logo](../../static/wordmark_light.svg) ](../..) 

 Deployment Options 

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
                              * High Level  
                               High Level  
                                             * [  High Level ](../../concepts#high-level)  
                                             * [  LangGraph Platform ](../langgraph%5Fplatform/)  
                                             * Deployment Options [  Deployment Options ](./)  
                                              Table of contents  
                                                               * [  Overview ](#overview)  
                                                               * [  Self-Hosted Enterprise ](#self-hosted-enterprise)  
                                                               * [  Self-Hosted Lite ](#self-hosted-lite)  
                                                               * [  Cloud SaaS ](#cloud-saas)  
                                                               * [  Bring Your Own Cloud ](#bring-your-own-cloud)  
                                                               * [  Related ](#related)  
                                             * [  LangGraph Platform Plans ](../plans/)  
                                             * [  Template Applications ](../template%5Fapplications/)  
                              * [  Components ](../../concepts#components)  
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
* [  Self-Hosted Enterprise ](#self-hosted-enterprise)
* [  Self-Hosted Lite ](#self-hosted-lite)
* [  Cloud SaaS ](#cloud-saas)
* [  Bring Your Own Cloud ](#bring-your-own-cloud)
* [  Related ](#related)

1. [  LangGraph ](../..)
2. [  Guides ](../../how-tos/)
3. [  Concepts ](../)
4. [  LangGraph Platform ](../../concepts#langgraph-platform)
5. [  High Level ](../../concepts#high-level)

# Deployment Options[¶](#deployment-options "Permanent link")

Prerequisites

* [LangGraph Platform](../langgraph%5Fplatform/)
* [LangGraph Server](../langgraph%5Fserver/)
* [LangGraph Platform Plans](../plans/)

## Overview[¶](#overview "Permanent link")

There are 4 main options for deploying with the LangGraph Platform:

1. **[Self-Hosted Lite](#self-hosted-lite)**: Available for all plans.
2. **[Self-Hosted Enterprise](#self-hosted-enterprise)**: Available for the **Enterprise** plan.
3. **[Cloud SaaS](#cloud-saas)**: Available for **Plus** and **Enterprise** plans.
4. **[Bring Your Own Cloud](#bring-your-own-cloud)**: Available only for **Enterprise** plans and **only on AWS**.

Please see the [LangGraph Platform Plans](../plans/) for more information on the different plans.

The guide below will explain the differences between the deployment options.

## Self-Hosted Enterprise[¶](#self-hosted-enterprise "Permanent link")

Important

The Self-Hosted Enterprise version is only available for the **Enterprise** plan.

With a Self-Hosted Enterprise deployment, you are responsible for managing the infrastructure, including setting up and maintaining required databases and Redis instances.

You’ll build a Docker image using the [LangGraph CLI](../langgraph%5Fcli/), which can then be deployed on your own infrastructure.

For more information, please see:

* [Self-Hosted conceptual guide](../self%5Fhosted/)
* [Self-Hosted Deployment how-to guide](../../how-tos/deploy-self-hosted/)

## Self-Hosted Lite[¶](#self-hosted-lite "Permanent link")

Important

The Self-Hosted Lite version is available for all plans.

The Self-Hosted Lite deployment option is a free (up to 1 million nodes executed), limited version of LangGraph Platform that you can run locally or in a self-hosted manner.

With a Self-Hosted Lite deployment, you are responsible for managing the infrastructure, including setting up and maintaining required databases and Redis instances.

You’ll build a Docker image using the [LangGraph CLI](../langgraph%5Fcli/), which can then be deployed on your own infrastructure.

For more information, please see:

* [Self-Hosted conceptual guide](../self%5Fhosted/)
* [Self-Hosted Deployment how-to guide](https://langchain-ai.github.io/langgraphjs/how-tos/deploy-self-hosted/)

## Cloud SaaS[¶](#cloud-saas "Permanent link")

Important

The Cloud SaaS version of LangGraph Platform is only available for **Plus** and **Enterprise** plans.

The [Cloud SaaS](../langgraph%5Fcloud/) version of LangGraph Platform is hosted as part of [LangSmith](https://smith.langchain.com/).

The Cloud SaaS version of LangGraph Platform provides a simple way to deploy and manage your LangGraph applications.

This deployment option provides an integration with GitHub, allowing you to deploy code from any of your repositories on GitHub.

For more information, please see:

* [Cloud SaaS Conceptual Guide](../langgraph%5Fcloud/)
* [How to deploy to Cloud SaaS](/langgraphjs/cloud/deployment/cloud.md)

## Bring Your Own Cloud[¶](#bring-your-own-cloud "Permanent link")

Important

The Bring Your Own Cloud version of LangGraph Platform is only available for **Enterprise** plans.

This combines the best of both worlds for Cloud and Self-Hosted. We manage the infrastructure, so you don't have to, but the infrastructure all runs within your cloud. This is currently only available on AWS.

For more information please see:

* [Bring Your Own Cloud Conceptual Guide](../bring%5Fyour%5Fown%5Fcloud/)

## Related[¶](#related "Permanent link")

For more information please see:

* [LangGraph Platform Plans](../plans/)
* [LangGraph Platform Pricing](https://www.langchain.com/langgraph-platform-pricing)
* [Deployment how-to guides](../../how-tos/#deployment)

 Was this page helpful? 

 Thanks for your feedback!

 Thanks for your feedback! Please help us improve this page by adding to the discussion below.

 Back to top 

[  Previous  LangGraph Platform ](../langgraph%5Fplatform/) [  Next  LangGraph Platform Plans ](../plans/) 

 Copyright © 2025 LangChain, Inc | [Consent Preferences](#%5F%5Fconsent) 

 Made with[ Material for MkDocs Insiders](https://squidfunk.github.io/mkdocs-material/) 

[ ](https://langchain-ai.github.io/langgraph/ "langchain-ai.github.io") [ ](https://github.com/langchain-ai/langgraphjs "github.com") [ ](https://twitter.com/LangChainAI "twitter.com") 

#### Cookie consent

We use cookies to recognize your repeated visits and preferences, as well as to measure the effectiveness of our documentation and whether users find what they're searching for. **Clicking "Accept" makes our documentation better. Thank you!** ❤️

* Google Analytics
* GitHub

Accept Reject 