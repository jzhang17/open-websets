[ Skip to content](#assistants) 

**Help us build the JS tools that power AI apps at companies like Replit, Uber, LinkedIn, GitLab, and more. [Join our team!](https://jobs.ashbyhq.com/langchain/05efa205-8560-43fd-bfcc-3f7697561cfb?utm%5Fsource=https%3A%2F%2Flangchain-ai.github.io%2Flanggraphjs%2F&utm%5Fcampaign=langgraphjs%5Fdocs)** 

[ ![logo](../../static/wordmark_dark.svg) ![logo](../../static/wordmark_light.svg) ](../..) 

 Assistants 

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
                                             * [  Application Structure ](../application%5Fstructure/)  
                                             * Assistants [  Assistants ](./)  
                                              Table of contents  
                                                               * [  Configuring Assistants ](#configuring-assistants)  
                                                               * [  Versioning Assistants ](#versioning-assistants)  
                                                               * [  Resources ](#resources)  
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
* [  Configuring Assistants ](#configuring-assistants)
* [  Versioning Assistants ](#versioning-assistants)
* [  Resources ](#resources)

1. [  LangGraph ](../..)
2. [  Guides ](../../how-tos/)
3. [  Concepts ](../)
4. [  LangGraph Platform ](../../concepts#langgraph-platform)
5. [  LangGraph Server ](../../concepts#langgraph-server)

# Assistants[¶](#assistants "Permanent link")

Prerequisites

* [LangGraph Server](../langgraph%5Fserver/)

When building agents, it is fairly common to make rapid changes that _do not_ alter the graph logic. For example, simply changing prompts or the LLM selection can have significant impacts on the behavior of the agents. Assistants offer an easy way to make and save these types of changes to agent configuration. This can have at least two use-cases:

* Assistants give developers a quick and easy way to modify and version agents for experimentation.
* Assistants can be modified via LangGraph Studio, offering a no-code way to configure agents (e.g., for business users).

Assistants build off the concept of ["configuration"](../low%5Flevel/#configuration). While ["configuration"](../low%5Flevel/#configuration) is available in the open source LangGraph library as well, assistants are only present in [LangGraph Platform](../langgraph%5Fplatform/). This is because Assistants are tightly coupled to your deployed graph, and so we can only make them available when we are also deploying the graphs.

## Configuring Assistants[¶](#configuring-assistants "Permanent link")

In practice, an assistant is just an _instance_ of a graph with a specific configuration. Because of this, multiple assistants can reference the same graph but can contain different configurations, such as prompts, models, and other graph configuration options. The LangGraph Cloud API provides several endpoints for creating and managing assistants. See [this how-to](/langgraphjs/cloud/how-tos/configuration%5Fcloud) for more details on how to create assistants.

## Versioning Assistants[¶](#versioning-assistants "Permanent link")

Once you've created an assistant, you can save and version it to track changes to the configuration over time. You can think about this at three levels:

1) The graph lays out the general agent application logic 2) The agent configuration options represent parameters that can be changed 3) Assistant versions save and track specific settings of the agent configuration options

For example, let's imagine you have a general writing agent. You have created a general graph architecture that works well for writing. However, there are different types of writing, e.g. blogs vs tweets. In order to get the best performance on each use case, you need to make some minor changes to the models and prompts used. In this setup, you could create an assistant for each use case - one for blog writing and one for tweeting. These would share the same graph structure, but they may use different models and different prompts. Read [this how-to](/langgraphjs/cloud/how-tos/assistant%5Fversioning) to learn how you can use assistant versioning through both the [Studio](/langgraphjs/cloud/how-tos/index/#langgraph-studio) and the SDK.

![assistant versions](../img/assistants.png)

## Resources[¶](#resources "Permanent link")

For more information on assistants, see the following resources:

* [Assistants how-to guides](../../how-tos/#assistants)

 Was this page helpful? 

 Thanks for your feedback!

 Thanks for your feedback! Please help us improve this page by adding to the discussion below.

 Back to top 

[  Previous  Application Structure ](../application%5Fstructure/) [  Next  Double Texting ](../double%5Ftexting/) 

 Copyright © 2025 LangChain, Inc | [Consent Preferences](#%5F%5Fconsent) 

 Made with[ Material for MkDocs Insiders](https://squidfunk.github.io/mkdocs-material/) 

[ ](https://langchain-ai.github.io/langgraph/ "langchain-ai.github.io") [ ](https://github.com/langchain-ai/langgraphjs "github.com") [ ](https://twitter.com/LangChainAI "twitter.com") 

#### Cookie consent

We use cookies to recognize your repeated visits and preferences, as well as to measure the effectiveness of our documentation and whether users find what they're searching for. **Clicking "Accept" makes our documentation better. Thank you!** ❤️

* Google Analytics
* GitHub

Accept Reject 