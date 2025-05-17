[ Skip to content](#add-node-to-dataset) 

**Help us build the JS tools that power AI apps at companies like Replit, Uber, LinkedIn, GitLab, and more. [Join our team!](https://jobs.ashbyhq.com/langchain/05efa205-8560-43fd-bfcc-3f7697561cfb?utm%5Fsource=https%3A%2F%2Flangchain-ai.github.io%2Flanggraphjs%2F&utm%5Fcampaign=langgraphjs%5Fdocs)** 

[ ![logo](../../../static/wordmark_dark.svg) ![logo](../../../static/wordmark_light.svg) ](../../..) 

 Add node to dataset 

[ ](javascript:void%280%29 "Share") 

 Initializing search

[  GitHub ](https://github.com/langchain-ai/langgraphjs "Go to repository") 

* [ LangGraph](../../..)
* [ Agents](../../../agents/overview/)
* [ API reference](../../../reference/)
* [ Versions](../../../versions/)

[ ![logo](../../../static/wordmark_dark.svg) ![logo](../../../static/wordmark_light.svg) ](../../..) 

[  GitHub ](https://github.com/langchain-ai/langgraphjs "Go to repository") 

* [  LangGraph ](../../..)  
 LangGraph  
   * Get started  
    Get started  
         * [  Learn the basics ](../../../tutorials/quickstart/)  
         * [  Deployment ](../../../tutorials/deployment/)  
   * Guides  
    Guides  
         * [  How-to Guides ](../../../how-tos/)  
          How-to Guides  
                  * [  Installation ](../../../how-tos#installation)  
                  * [  LangGraph ](../../../how-tos#langgraph)  
                  * LangGraph Platform  
                   LangGraph Platform  
                              * [  LangGraph Platform ](../../../how-tos#langgraph-platform)  
                              * [  Application Structure ](../../../how-tos#application-structure)  
                              * [  Deployment ](../../../how-tos#deployment)  
                              * [  Authentication & Access Control ](../../../how-tos#authentication-access-control)  
                              * [  Assistants ](../../../how-tos#assistants)  
                              * [  Threads ](../../../how-tos#threads)  
                              * [  Runs ](../../../how-tos#runs)  
                              * [  Streaming ](../../../how-tos#streaming%5F1)  
                              * [  Frontend & Generative UI ](../../../how-tos#frontend-generative-ui)  
                              * [  Human-in-the-loop ](../../../how-tos#human-in-the-loop%5F1)  
                              * [  Double-texting ](../../../how-tos#double-texting)  
                              * [  Webhooks ](../webhooks/)  
                              * [  Cron Jobs ](../cron%5Fjobs/)  
                              * [  Modifying the API ](../../../how-tos#modifying-the-api)  
                              * LangGraph Studio  
                               LangGraph Studio  
                                             * [  LangGraph Studio ](../../../how-tos#langgraph-studio)  
                                             * [  None ](../test%5Fdeployment.md)  
                                             * [  None ](../test%5Flocal%5Fdeployment.md)  
                                             * [  Run application ](../invoke%5Fstudio/)  
                                             * [  Manage threads ](../threads%5Fstudio/)  
                                             * [  Add node to dataset ](./)  
         * [  Concepts ](../../../concepts/)  
         * [  Tutorials ](../../../tutorials/)  
   * Resources  
    Resources  
         * [  Adopters ](../../../adopters/)  
         * [  LLMS-txt ](../../../llms-txt-overview/)  
         * [  FAQ ](../../../concepts/faq/)  
         * [  Troubleshooting ](../../../troubleshooting/errors/)  
         * [  LangGraph Academy Course ](https://academy.langchain.com/courses/intro-to-langgraph)
* [  Agents ](../../../agents/overview/)
* [  API reference ](../../../reference/)
* [  Versions ](../../../versions/)

1. [  LangGraph ](../../..)
2. [  Guides ](../../../how-tos/)
3. [  How-to Guides ](../../../how-tos/)
4. [  LangGraph Platform ](../../../how-tos#langgraph-platform)
5. [  LangGraph Studio ](../../../how-tos#langgraph-studio)

# Add node to dataset[¶](#add-node-to-dataset "Permanent link")

This guide shows how to add examples to [LangSmith datasets](https://docs.smith.langchain.com/evaluation/how%5Fto%5Fguides#dataset-management) from nodes in the thread log. This is useful to evaluate indivudal steps of the agent.

1. Select a thread.
2. Click on the `Add to Dataset` button.
3. Select nodes whose input/output you want to add to a dataset.
4. For each selected node, select the target dataset to create the example in. By default a dataset for the specific assistant and node will be selected. If this dataset does not yet exist, it will be created.
5. Edit the example's input/output as needed before adding it to the dataset.
6. Select "Add to dataset" at the bottom of the page to add all selected nodes to their respective datasets.

See [Evaluating intermediate steps](https://docs.smith.langchain.com/evaluation/how%5Fto%5Fguides/langgraph#evaluating-intermediate-steps) for more details on how to evaluate intermediate steps.

 Was this page helpful? 

 Thanks for your feedback!

 Thanks for your feedback! Please help us improve this page by adding to the discussion below.

 Back to top 

[  Previous  Manage threads ](../threads%5Fstudio/) [  Next  Concepts ](../../../concepts/) 

 Copyright © 2025 LangChain, Inc | [Consent Preferences](#%5F%5Fconsent) 

 Made with[ Material for MkDocs Insiders](https://squidfunk.github.io/mkdocs-material/) 

[ ](https://langchain-ai.github.io/langgraph/ "langchain-ai.github.io") [ ](https://github.com/langchain-ai/langgraphjs "github.com") [ ](https://twitter.com/LangChainAI "twitter.com") 

#### Cookie consent

We use cookies to recognize your repeated visits and preferences, as well as to measure the effectiveness of our documentation and whether users find what they're searching for. **Clicking "Accept" makes our documentation better. Thank you!** ❤️

* Google Analytics
* GitHub

Accept Reject 