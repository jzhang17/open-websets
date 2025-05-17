[ Skip to content](#deployment-quickstart) 

**Help us build the JS tools that power AI apps at companies like Replit, Uber, LinkedIn, GitLab, and more. [Join our team!](https://jobs.ashbyhq.com/langchain/05efa205-8560-43fd-bfcc-3f7697561cfb?utm%5Fsource=https%3A%2F%2Flangchain-ai.github.io%2Flanggraphjs%2F&utm%5Fcampaign=langgraphjs%5Fdocs)** 

[ ![logo](../../static/wordmark_dark.svg) ![logo](../../static/wordmark_light.svg) ](../..) 

 Cloud Deploy 

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
         * [  Concepts ](../../concepts/)  
         * [  Tutorials ](../../tutorials/)  
          Tutorials  
                  * [  Quick Start ](../../tutorials/workflows/)  
                   Quick Start  
                              * [  Quick Start ](../../tutorials#quick-start)  
                              * [  Learn the basics ](../../tutorials/quickstart/)  
                              * Cloud Deploy [  Cloud Deploy ](./)  
                               Table of contents  
                                             * [  Prerequisites ](#prerequisites)  
                                             * [  1\. Create a repository on GitHub ](#1-create-a-repository-on-github)  
                                             * [  2\. Deploy to LangGraph Platform ](#2-deploy-to-langgraph-platform)  
                                             * [  3\. Test your application in LangGraph Studio ](#3-test-your-application-in-langgraph-studio)  
                                             * [  4\. Get the API URL for your deployment ](#4-get-the-api-url-for-your-deployment)  
                                             * [  5\. Test the API ](#5-test-the-api)  
                                             * [  Next steps ](#next-steps)  
                  * [  Chatbots ](../../tutorials/chatbots/customer%5Fsupport%5Fsmall%5Fmodel/)  
                  * [  RAG ](../../tutorials#rag)  
                  * [  Agent Architectures ](../../tutorials#agent-architectures)  
                  * [  Evaluation & Analysis ](../../tutorials#evaluation)  
   * Resources  
    Resources  
         * [  Adopters ](../../adopters/)  
         * [  LLMS-txt ](../../llms-txt-overview/)  
         * [  FAQ ](../../concepts/faq/)  
         * [  Troubleshooting ](../../troubleshooting/errors/)  
         * [  LangGraph Academy Course ](https://academy.langchain.com/courses/intro-to-langgraph)
* [  Agents ](../../agents/overview/)
* [  API reference ](../../reference/)
* [  Versions ](../../versions/)

 Table of contents 
* [  Prerequisites ](#prerequisites)
* [  1\. Create a repository on GitHub ](#1-create-a-repository-on-github)
* [  2\. Deploy to LangGraph Platform ](#2-deploy-to-langgraph-platform)
* [  3\. Test your application in LangGraph Studio ](#3-test-your-application-in-langgraph-studio)
* [  4\. Get the API URL for your deployment ](#4-get-the-api-url-for-your-deployment)
* [  5\. Test the API ](#5-test-the-api)
* [  Next steps ](#next-steps)

1. [  LangGraph ](../..)
2. [  Guides ](../../how-tos/)
3. [  Tutorials ](../../tutorials/)
4. [  Quick Start ](../../tutorials#quick-start)

# Deployment quickstart[¶](#deployment-quickstart "Permanent link")

This guide shows you how to set up and use LangGraph Platform for a cloud deployment.

## Prerequisites[¶](#prerequisites "Permanent link")

Before you begin, ensure you have the following:

* A [GitHub account](https://github.com/)
* A [LangSmith account](https://smith.langchain.com/) – free to sign up

## 1\. Create a repository on GitHub[¶](#1-create-a-repository-on-github "Permanent link")

To deploy an application to **LangGraph Platform**, your application code must reside in a GitHub repository. Both public and private repositories are supported. For this quickstart, use the [new-langgraph-project template](https://github.com/langchain-ai/react-agent) for your application:

1. Go to the [new-langgraph-project repository](https://github.com/langchain-ai/new-langgraph-project) or [new-langgraphjs-project template](https://github.com/langchain-ai/new-langgraphjs-project).
2. Click the `Fork` button in the top right corner to fork the repository to your GitHub account.
3. Click **Create fork**.

## 2\. Deploy to LangGraph Platform[¶](#2-deploy-to-langgraph-platform "Permanent link")

1. Log in to [LangSmith](https://smith.langchain.com/).
2. In the left sidebar, select **LangGraph Platform**.
3. Click the **\+ New Deployment** button. A pane will open where you can fill in the required fields.
4. If you are a first time user or adding a private repository that has not been previously connected, click the **Import from GitHub** button and follow the instructions to connect your GitHub account.
5. Select your New LangGraph Project repository.
6. Click **Submit** to deploy.  
This may take about 15 minutes to complete. You can check the status in the **Deployment details** view.

## 3\. Test your application in LangGraph Studio[¶](#3-test-your-application-in-langgraph-studio "Permanent link")

Once your application is deployed:

1. Select the deployment you just created to view more details.
2. Click the **LangGraph Studio** button in the top right corner.  
LangGraph Studio will open to display your graph.  
[![image](deployment/img/langgraph_studio.png)](deployment/img/langgraph%5Fstudio.png)  
 Sample graph run in LangGraph Studio.

## 4\. Get the API URL for your deployment[¶](#4-get-the-api-url-for-your-deployment "Permanent link")

1. In the **Deployment details** view in LangGraph, click the **API URL** to copy it to your clipboard.
2. Click the `URL` to copy it to the clipboard.

## 5\. Test the API[¶](#5-test-the-api "Permanent link")

You can now test the API:

Python SDK (Async)Python SDK (Sync)JavaScript SDKRest API

1. Install the LangGraph Python SDK:  
`[](#%5F%5Fcodelineno-0-1)pip install langgraph-sdk  
`
2. Send a message to the assistant (threadless run):  
`[](#%5F%5Fcodelineno-1-1)from langgraph_sdk import get_client  
[](#%5F%5Fcodelineno-1-2)  
[](#%5F%5Fcodelineno-1-3)client = get_client(url="your-deployment-url", api_key="your-langsmith-api-key")  
[](#%5F%5Fcodelineno-1-4)  
[](#%5F%5Fcodelineno-1-5)async for chunk in client.runs.stream(  
[](#%5F%5Fcodelineno-1-6)    None,  # Threadless run  
[](#%5F%5Fcodelineno-1-7)    "agent", # Name of assistant. Defined in langgraph.json.  
[](#%5F%5Fcodelineno-1-8)    input={  
[](#%5F%5Fcodelineno-1-9)        "messages": [{  
[](#%5F%5Fcodelineno-1-10)            "role": "human",  
[](#%5F%5Fcodelineno-1-11)            "content": "What is LangGraph?",  
[](#%5F%5Fcodelineno-1-12)        }],  
[](#%5F%5Fcodelineno-1-13)    },  
[](#%5F%5Fcodelineno-1-14)    stream_mode="updates",  
[](#%5F%5Fcodelineno-1-15)):  
[](#%5F%5Fcodelineno-1-16)    print(f"Receiving new event of type: {chunk.event}...")  
[](#%5F%5Fcodelineno-1-17)    print(chunk.data)  
[](#%5F%5Fcodelineno-1-18)    print("\n\n")  
`

1. Install the LangGraph Python SDK:  
`[](#%5F%5Fcodelineno-2-1)pip install langgraph-sdk  
`
2. Send a message to the assistant (threadless run):  
`[](#%5F%5Fcodelineno-3-1)from langgraph_sdk import get_sync_client  
[](#%5F%5Fcodelineno-3-2)  
[](#%5F%5Fcodelineno-3-3)client = get_sync_client(url="your-deployment-url", api_key="your-langsmith-api-key")  
[](#%5F%5Fcodelineno-3-4)  
[](#%5F%5Fcodelineno-3-5)for chunk in client.runs.stream(  
[](#%5F%5Fcodelineno-3-6)    None,  # Threadless run  
[](#%5F%5Fcodelineno-3-7)    "agent", # Name of assistant. Defined in langgraph.json.  
[](#%5F%5Fcodelineno-3-8)    input={  
[](#%5F%5Fcodelineno-3-9)        "messages": [{  
[](#%5F%5Fcodelineno-3-10)            "role": "human",  
[](#%5F%5Fcodelineno-3-11)            "content": "What is LangGraph?",  
[](#%5F%5Fcodelineno-3-12)        }],  
[](#%5F%5Fcodelineno-3-13)    },  
[](#%5F%5Fcodelineno-3-14)    stream_mode="updates",  
[](#%5F%5Fcodelineno-3-15)):  
[](#%5F%5Fcodelineno-3-16)    print(f"Receiving new event of type: {chunk.event}...")  
[](#%5F%5Fcodelineno-3-17)    print(chunk.data)  
[](#%5F%5Fcodelineno-3-18)    print("\n\n")  
`

1. Install the LangGraph JS SDK  
`[](#%5F%5Fcodelineno-4-1)npm install @langchain/langgraph-sdk  
`
2. Send a message to the assistant (threadless run):  
`` [](#%5F%5Fcodelineno-5-1)const { Client } = await import("@langchain/langgraph-sdk");  
[](#%5F%5Fcodelineno-5-2)  
[](#%5F%5Fcodelineno-5-3)const client = new Client({ apiUrl: "your-deployment-url", apiKey: "your-langsmith-api-key" });  
[](#%5F%5Fcodelineno-5-4)  
[](#%5F%5Fcodelineno-5-5)const streamResponse = client.runs.stream(  
[](#%5F%5Fcodelineno-5-6)    null, // Threadless run  
[](#%5F%5Fcodelineno-5-7)    "agent", // Assistant ID  
[](#%5F%5Fcodelineno-5-8)    {  
[](#%5F%5Fcodelineno-5-9)        input: {  
[](#%5F%5Fcodelineno-5-10)            "messages": [  
[](#%5F%5Fcodelineno-5-11)                { "role": "user", "content": "What is LangGraph?"}  
[](#%5F%5Fcodelineno-5-12)            ]  
[](#%5F%5Fcodelineno-5-13)        },  
[](#%5F%5Fcodelineno-5-14)        streamMode: "messages",  
[](#%5F%5Fcodelineno-5-15)    }  
[](#%5F%5Fcodelineno-5-16));  
[](#%5F%5Fcodelineno-5-17)  
[](#%5F%5Fcodelineno-5-18)for await (const chunk of streamResponse) {  
[](#%5F%5Fcodelineno-5-19)    console.log(`Receiving new event of type: ${chunk.event}...`);  
[](#%5F%5Fcodelineno-5-20)    console.log(JSON.stringify(chunk.data));  
[](#%5F%5Fcodelineno-5-21)    console.log("\n\n");  
[](#%5F%5Fcodelineno-5-22)}  
 ``

`[](#%5F%5Fcodelineno-6-1)curl -s --request POST \
[](#%5F%5Fcodelineno-6-2)    --url <DEPLOYMENT_URL> \
[](#%5F%5Fcodelineno-6-3)    --header 'Content-Type: application/json' \
[](#%5F%5Fcodelineno-6-4)    --data "{
[](#%5F%5Fcodelineno-6-5)        \"assistant_id\": \"agent\",
[](#%5F%5Fcodelineno-6-6)        \"input\": {
[](#%5F%5Fcodelineno-6-7)            \"messages\": [
[](#%5F%5Fcodelineno-6-8)                {
[](#%5F%5Fcodelineno-6-9)                    \"role\": \"human\",
[](#%5F%5Fcodelineno-6-10)                    \"content\": \"What is LangGraph?\"
[](#%5F%5Fcodelineno-6-11)                }
[](#%5F%5Fcodelineno-6-12)            ]
[](#%5F%5Fcodelineno-6-13)        },
[](#%5F%5Fcodelineno-6-14)        \"stream_mode\": \"updates\"
[](#%5F%5Fcodelineno-6-15)    }" 
`

## Next steps[¶](#next-steps "Permanent link")

Congratulations! You have deployed an application using LangGraph Platform.

Here are some other resources to check out:

* [LangGraph Platform overview](../../concepts/langgraph%5Fplatform/)
* [Deployment options](../../concepts/deployment%5Foptions/)

 Was this page helpful? 

 Thanks for your feedback!

 Thanks for your feedback! Please help us improve this page by adding to the discussion below.

 Back to top 

[  Previous  Workflows and Agents ](../../tutorials/workflows/) [  Next  Chatbots ](../../tutorials/chatbots/customer%5Fsupport%5Fsmall%5Fmodel/) 

 Copyright © 2025 LangChain, Inc | [Consent Preferences](#%5F%5Fconsent) 

 Made with[ Material for MkDocs Insiders](https://squidfunk.github.io/mkdocs-material/) 

[ ](https://langchain-ai.github.io/langgraph/ "langchain-ai.github.io") [ ](https://github.com/langchain-ai/langgraphjs "github.com") [ ](https://twitter.com/LangChainAI "twitter.com") 

#### Cookie consent

We use cookies to recognize your repeated visits and preferences, as well as to measure the effectiveness of our documentation and whether users find what they're searching for. **Clicking "Accept" makes our documentation better. Thank you!** ❤️

* Google Analytics
* GitHub

Accept Reject 