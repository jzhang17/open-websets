[ Skip to content](#how-to-return-structured-output-from-the-prebuilt-react-agent) 

**Help us build the JS tools that power AI apps at companies like Replit, Uber, LinkedIn, GitLab, and more. [Join our team!](https://jobs.ashbyhq.com/langchain/05efa205-8560-43fd-bfcc-3f7697561cfb?utm%5Fsource=https%3A%2F%2Flangchain-ai.github.io%2Flanggraphjs%2F&utm%5Fcampaign=langgraphjs%5Fdocs)** 

[ ![logo](../../static/wordmark_dark.svg) ![logo](../../static/wordmark_light.svg) ](../..) 

 How to return structured output from the prebuilt ReAct agent 

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
         * [  How-to Guides ](../)  
          How-to Guides  
                  * [  Installation ](../../how-tos#installation)  
                  * LangGraph  
                   LangGraph  
                              * [  LangGraph ](../../how-tos#langgraph)  
                              * [  Controllability ](../../how-tos#controllability)  
                              * [  Persistence ](../../how-tos#persistence)  
                              * [  Memory ](../../how-tos#memory)  
                              * [  Human-in-the-loop ](../../how-tos#human-in-the-loop)  
                              * [  Streaming ](../../how-tos#streaming)  
                              * [  Tool calling ](../../how-tos#tool-calling)  
                              * [  Subgraphs ](../../how-tos#subgraphs)  
                              * [  Multi-agent ](../multi-agent-network/)  
                              * [  State Management ](../../how-tos#state-management)  
                              * [  Other ](../../how-tos#other)  
                              * Prebuilt ReAct Agent  
                               Prebuilt ReAct Agent  
                                             * [  Prebuilt ReAct Agent ](../../how-tos#prebuilt-react-agent)  
                                             * [  How to use the prebuilt ReAct agent ](../create-react-agent/)  
                                             * [  How to add memory to the prebuilt ReAct agent ](../react-memory/)  
                                             * [  How to add a custom system prompt to the prebuilt ReAct agent ](../react-system-prompt/)  
                                             * [  How to add human-in-the-loop processes to the prebuilt ReAct agent ](../react-human-in-the-loop/)  
                                             * How to return structured output from the prebuilt ReAct agent [  How to return structured output from the prebuilt ReAct agent ](./)  
                                              Table of contents  
                                                               * [  Setup ](#setup)  
                                                               * [  Code ](#code)  
                                                               * [  Usage ](#usage)  
                                                                                    * [  Customizing system prompt ](#customizing-system-prompt)  
                                             * [  How to create a ReAct agent from scratch (Functional API) ](../react-agent-from-scratch-functional/)  
                  * [  LangGraph Platform ](../../how-tos#langgraph-platform)  
         * [  Concepts ](../../concepts/)  
         * [  Tutorials ](../../tutorials/)  
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
* [  Setup ](#setup)
* [  Code ](#code)
* [  Usage ](#usage)  
   * [  Customizing system prompt ](#customizing-system-prompt)

1. [  LangGraph ](../..)
2. [  Guides ](../)
3. [  How-to Guides ](../)
4. [  LangGraph ](../../how-tos#langgraph)
5. [  Prebuilt ReAct Agent ](../../how-tos#prebuilt-react-agent)

# How to return structured output from the prebuilt ReAct agent[¶](#how-to-return-structured-output-from-the-prebuilt-react-agent "Permanent link")

Prerequisites

* [Agent Architectures](../../concepts/agentic%5Fconcepts/)
* [Chat Models](https://js.langchain.com/docs/concepts/chat%5Fmodels/)
* [Tools](https://js.langchain.com/docs/concepts/tools/)
* [Structured Output](https://js.langchain.com/docs/concepts/structured%5Foutputs/)

To return structured output from the prebuilt ReAct agent you can provide a `responseFormat` parameter with the desired output schema to [createReactAgent](https://langchain-ai.github.io/langgraphjs/reference/functions/prebuilt.createReactAgent.html):

`` [](#%5F%5Fcodelineno-0-1)import { z } from "zod";
[](#%5F%5Fcodelineno-0-2)import { createReactAgent } from "@langchain/langgraph/prebuilt";
[](#%5F%5Fcodelineno-0-3)
[](#%5F%5Fcodelineno-0-4)const responseFormat = z.object({
[](#%5F%5Fcodelineno-0-5)    // Respond to the user in this format
[](#%5F%5Fcodelineno-0-6)    mySpecialOutput: z.string(),
[](#%5F%5Fcodelineno-0-7)})
[](#%5F%5Fcodelineno-0-8)
[](#%5F%5Fcodelineno-0-9)const graph = createReactAgent({
[](#%5F%5Fcodelineno-0-10)    llm: llm,
[](#%5F%5Fcodelineno-0-11)    tools: tools,
[](#%5F%5Fcodelineno-0-12)    // specify the schema for the structured output using `responseFormat` parameter
[](#%5F%5Fcodelineno-0-13)    responseFormat: responseFormat
[](#%5F%5Fcodelineno-0-14)})
 ``

The agent will return the output in the format specified by the `responseFormat` schema by making an additional LLM call at the end of the conversation, once there are no more tool calls to be made. You can read [this guide](/langgraphjs/how-tos/respond-in-format/) to learn about an alternate way - treating the structured output as another tool - to achieve structured output from the agent.

## Setup[¶](#setup "Permanent link")

First, we need to install the required packages.

`[](#%5F%5Fcodelineno-1-1)yarn add @langchain/langgraph @langchain/openai @langchain/core zod
`

This guide will use OpenAI's GPT-4o model. We will optionally set our API key for [LangSmith tracing](https://smith.langchain.com/), which will give us best-in-class observability.

`[](#%5F%5Fcodelineno-2-1)// process.env.OPENAI_API_KEY = "sk_...";
[](#%5F%5Fcodelineno-2-2)
[](#%5F%5Fcodelineno-2-3)// Optional, add tracing in LangSmith
[](#%5F%5Fcodelineno-2-4)// process.env.LANGSMITH_API_KEY = "ls__..."
[](#%5F%5Fcodelineno-2-5)process.env.LANGSMITH_TRACING = "true";
[](#%5F%5Fcodelineno-2-6)process.env.LANGSMITH_PROJECT = "ReAct Agent with system prompt: LangGraphJS";
`

## Code[¶](#code "Permanent link")

`[](#%5F%5Fcodelineno-3-1)import { ChatOpenAI } from "@langchain/openai";
[](#%5F%5Fcodelineno-3-2)import { createReactAgent } from "@langchain/langgraph/prebuilt";
[](#%5F%5Fcodelineno-3-3)import { tool } from "@langchain/core/tools";
[](#%5F%5Fcodelineno-3-4)import { z } from "zod";
[](#%5F%5Fcodelineno-3-5)
[](#%5F%5Fcodelineno-3-6)const weatherTool = tool(
[](#%5F%5Fcodelineno-3-7)  async (input): Promise<string> => {
[](#%5F%5Fcodelineno-3-8)    if (input.city === "nyc") {
[](#%5F%5Fcodelineno-3-9)      return "It might be cloudy in nyc";
[](#%5F%5Fcodelineno-3-10)    } else if (input.city === "sf") {
[](#%5F%5Fcodelineno-3-11)      return "It's always sunny in sf";
[](#%5F%5Fcodelineno-3-12)    } else {
[](#%5F%5Fcodelineno-3-13)      throw new Error("Unknown city");
[](#%5F%5Fcodelineno-3-14)    }
[](#%5F%5Fcodelineno-3-15)  },
[](#%5F%5Fcodelineno-3-16)  {
[](#%5F%5Fcodelineno-3-17)    name: "get_weather",
[](#%5F%5Fcodelineno-3-18)    description: "Use this to get weather information.",
[](#%5F%5Fcodelineno-3-19)    schema: z.object({
[](#%5F%5Fcodelineno-3-20)      city: z.enum(["nyc", "sf"]).describe("The city to get weather for"),
[](#%5F%5Fcodelineno-3-21)    }),
[](#%5F%5Fcodelineno-3-22)  }
[](#%5F%5Fcodelineno-3-23));
[](#%5F%5Fcodelineno-3-24)
[](#%5F%5Fcodelineno-3-25)const WeatherResponseSchema = z.object({
[](#%5F%5Fcodelineno-3-26)  conditions: z.string().describe("Weather conditions"),
[](#%5F%5Fcodelineno-3-27)});
[](#%5F%5Fcodelineno-3-28)
[](#%5F%5Fcodelineno-3-29)const tools = [weatherTool];
[](#%5F%5Fcodelineno-3-30)
[](#%5F%5Fcodelineno-3-31)const agent = createReactAgent({
[](#%5F%5Fcodelineno-3-32)  llm: new ChatOpenAI({ model: "gpt-4o", temperature: 0 }),
[](#%5F%5Fcodelineno-3-33)  tools: tools,
[](#%5F%5Fcodelineno-3-34)  responseFormat: WeatherResponseSchema,
[](#%5F%5Fcodelineno-3-35)}); 
`

## Usage[¶](#usage "Permanent link")

Let's now test our agent:

`[](#%5F%5Fcodelineno-4-1)const response = await agent.invoke({
[](#%5F%5Fcodelineno-4-2)  messages: [
[](#%5F%5Fcodelineno-4-3)    {
[](#%5F%5Fcodelineno-4-4)      role: "user",
[](#%5F%5Fcodelineno-4-5)      content: "What's the weather in NYC?",
[](#%5F%5Fcodelineno-4-6)    },
[](#%5F%5Fcodelineno-4-7)  ],
[](#%5F%5Fcodelineno-4-8)})
`

You can see that the agent output contains a `structuredResponse` key with the structured output conforming to the specified `WeatherResponse` schema, in addition to the message history under `messages` key

`[](#%5F%5Fcodelineno-5-1)response.structuredResponse
`

`[](#%5F%5Fcodelineno-6-1){ conditions: 'cloudy' }
`

### Customizing system prompt[¶](#customizing-system-prompt "Permanent link")

You might need to further customize the second LLM call for the structured output generation and provide a system prompt. To do so, you can pass an object with the keys `prompt`, `schema` to the `responseFormat` parameter:

`[](#%5F%5Fcodelineno-7-1)const agent = createReactAgent({
[](#%5F%5Fcodelineno-7-2)  llm: new ChatOpenAI({ model: "gpt-4o", temperature: 0 }),
[](#%5F%5Fcodelineno-7-3)  tools: tools,
[](#%5F%5Fcodelineno-7-4)  responseFormat: {
[](#%5F%5Fcodelineno-7-5)    prompt: "Always return capitalized weather conditions",
[](#%5F%5Fcodelineno-7-6)    schema: WeatherResponseSchema,
[](#%5F%5Fcodelineno-7-7)  }
[](#%5F%5Fcodelineno-7-8)}); 
[](#%5F%5Fcodelineno-7-9)
[](#%5F%5Fcodelineno-7-10)const response = await agent.invoke({
[](#%5F%5Fcodelineno-7-11)  messages: [
[](#%5F%5Fcodelineno-7-12)    {
[](#%5F%5Fcodelineno-7-13)      role: "user",
[](#%5F%5Fcodelineno-7-14)      content: "What's the weather in NYC?",
[](#%5F%5Fcodelineno-7-15)    },
[](#%5F%5Fcodelineno-7-16)  ],
[](#%5F%5Fcodelineno-7-17)})
`

You can verify that the structured response now contains a capitalized value:

`[](#%5F%5Fcodelineno-8-1)response.structuredResponse
`

`[](#%5F%5Fcodelineno-9-1){ conditions: 'Cloudy' }
`

 Was this page helpful? 

 Thanks for your feedback!

 Thanks for your feedback! Please help us improve this page by adding to the discussion below.

 Back to top 

[  Previous  How to add human-in-the-loop processes to the prebuilt ReAct agent ](../react-human-in-the-loop/) [  Next  How to create a ReAct agent from scratch (Functional API) ](../react-agent-from-scratch-functional/) 

 Copyright © 2025 LangChain, Inc | [Consent Preferences](#%5F%5Fconsent) 

 Made with[ Material for MkDocs Insiders](https://squidfunk.github.io/mkdocs-material/) 

[ ](https://langchain-ai.github.io/langgraph/ "langchain-ai.github.io") [ ](https://github.com/langchain-ai/langgraphjs "github.com") [ ](https://twitter.com/LangChainAI "twitter.com") 

#### Cookie consent

We use cookies to recognize your repeated visits and preferences, as well as to measure the effectiveness of our documentation and whether users find what they're searching for. **Clicking "Accept" makes our documentation better. Thank you!** ❤️

* Google Analytics
* GitHub

Accept Reject 