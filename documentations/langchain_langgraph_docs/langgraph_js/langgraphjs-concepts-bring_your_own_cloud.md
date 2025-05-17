[ Skip to content](#bring-your-own-cloud-byoc) 

**Help us build the JS tools that power AI apps at companies like Replit, Uber, LinkedIn, GitLab, and more. [Join our team!](https://jobs.ashbyhq.com/langchain/05efa205-8560-43fd-bfcc-3f7697561cfb?utm%5Fsource=https%3A%2F%2Flangchain-ai.github.io%2Flanggraphjs%2F&utm%5Fcampaign=langgraphjs%5Fdocs)** 

[ ![logo](../../static/wordmark_dark.svg) ![logo](../../static/wordmark_light.svg) ](../..) 

 Bring Your Own Cloud (BYOC) 

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
                                             * [  Cloud SaaS ](../langgraph%5Fcloud/)  
                                             * Bring Your Own Cloud (BYOC) [  Bring Your Own Cloud (BYOC) ](./)  
                                              Table of contents  
                                                               * [  Architecture ](#architecture)  
                                                               * [  Requirements ](#requirements)  
                                                               * [  How it works ](#how-it-works)  
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
* [  Architecture ](#architecture)
* [  Requirements ](#requirements)
* [  How it works ](#how-it-works)

1. [  LangGraph ](../..)
2. [  Guides ](../../how-tos/)
3. [  Concepts ](../)
4. [  LangGraph Platform ](../../concepts#langgraph-platform)
5. [  Deployment Options ](../../concepts#deployment-options)

# Bring Your Own Cloud (BYOC)[¶](#bring-your-own-cloud-byoc "Permanent link")

Note

* [LangGraph Platform](../langgraph%5Fplatform/)
* [Deployment Options](../deployment%5Foptions/)

## Architecture[¶](#architecture "Permanent link")

Split control plane (hosted by us) and data plane (hosted by you, managed by us).

| Control Plane               | Data Plane                      |                                               |
| --------------------------- | ------------------------------- | --------------------------------------------- |
| What it does                | Manages deployments, revisions. | Runs your LangGraph graphs, stores your data. |
| Where it is hosted          | LangChain Cloud account         | Your cloud account                            |
| Who provisions and monitors | LangChain                       | LangChain                                     |

LangChain has no direct access to the resources created in your cloud account, and can only interact with them via AWS APIs. Your data never leaves your cloud account / VPC at rest or in transit.

![Architecture](../img/byoc_architecture.png)

## Requirements[¶](#requirements "Permanent link")

* You’re using AWS already.
* You use `langgraph-cli` and/or [LangGraph Studio](../langgraph%5Fstudio/) app to test graph locally.
* You use `langgraph build` command to build image and then push it to your AWS ECR repository (`docker push`).

## How it works[¶](#how-it-works "Permanent link")

* We provide you a [Terraform module](https://github.com/langchain-ai/terraform/tree/main/modules/langgraph%5Fcloud%5Fsetup) which you run to set up our requirements  
   1. Creates an AWS role (which our control plane will later assume to provision and monitor resources)  
         * <https://docs.aws.amazon.com/aws-managed-policy/latest/reference/AmazonVPCReadOnlyAccess.html>  
                  * Read VPCS to find subnets  
         * <https://docs.aws.amazon.com/aws-managed-policy/latest/reference/AmazonECS%5FFullAccess.html>  
                  * Used to create/delete ECS resources for your LangGraph Cloud instances  
         * <https://docs.aws.amazon.com/aws-managed-policy/latest/reference/SecretsManagerReadWrite.html>  
                  * Create secrets for your ECS resources  
         * <https://docs.aws.amazon.com/aws-managed-policy/latest/reference/CloudWatchReadOnlyAccess.html>  
                  * Read CloudWatch metrics/logs to monitor your instances/push deployment logs  
         * <https://docs.aws.amazon.com/aws-managed-policy/latest/reference/AmazonRDSFullAccess.html>  
                  * Provision `RDS` instances for your LangGraph Cloud instances  
   2. Either  
         * Tags an existing vpc / subnets as `langgraph-cloud-enabled`  
         * Creates a new vpc and subnets and tags them as `langgraph-cloud-enabled`
* You create a LangGraph Cloud Project in `smith.langchain.com` providing  
   * the ID of the AWS role created in the step above  
   * the AWS ECR repo to pull the service image from
* We provision the resources in your cloud account using the role above
* We monitor those resources to ensure uptime and recovery from errors

Notes for customers using [self-hosted LangSmith](https://docs.smith.langchain.com/self%5Fhosting):

* Creation of new LangGraph Cloud projects and revisions currently needs to be done on smith.langchain.com.
* You can however set up the project to trace to your self-hosted LangSmith instance if desired

 Was this page helpful? 

 Thanks for your feedback!

 Thanks for your feedback! Please help us improve this page by adding to the discussion below.

 Back to top 

[  Previous  Cloud SaaS ](../langgraph%5Fcloud/) [  Next  Tutorials ](../../tutorials/) 

 Copyright © 2025 LangChain, Inc | [Consent Preferences](#%5F%5Fconsent) 

 Made with[ Material for MkDocs Insiders](https://squidfunk.github.io/mkdocs-material/) 

[ ](https://langchain-ai.github.io/langgraph/ "langchain-ai.github.io") [ ](https://github.com/langchain-ai/langgraphjs "github.com") [ ](https://twitter.com/LangChainAI "twitter.com") 

#### Cookie consent

We use cookies to recognize your repeated visits and preferences, as well as to measure the effectiveness of our documentation and whether users find what they're searching for. **Clicking "Accept" makes our documentation better. Thank you!** ❤️

* Google Analytics
* GitHub

Accept Reject 