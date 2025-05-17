[ Skip to content](#how-to-add-human-in-the-loop-processes-to-the-prebuilt-react-agent) 

**Help us build the JS tools that power AI apps at companies like Replit, Uber, LinkedIn, GitLab, and more. [Join our team!](https://jobs.ashbyhq.com/langchain/05efa205-8560-43fd-bfcc-3f7697561cfb?utm%5Fsource=https%3A%2F%2Flangchain-ai.github.io%2Flanggraphjs%2F&utm%5Fcampaign=langgraphjs%5Fdocs)** 

[ ![logo](../../static/wordmark_dark.svg) ![logo](../../static/wordmark_light.svg) ](../..) 

 How to add human-in-the-loop processes to the prebuilt ReAct agent 

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
                                             * How to add human-in-the-loop processes to the prebuilt ReAct agent [  How to add human-in-the-loop processes to the prebuilt ReAct agent ](./)  
                                              Table of contents  
                                                               * [  Setup ](#setup)  
                                                               * [  Code ](#code)  
                                                               * [  Usage ](#usage)  
                                             * [  How to return structured output from the prebuilt ReAct agent ](../react-return-structured-output/)  
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

1. [  LangGraph ](../..)
2. [  Guides ](../)
3. [  How-to Guides ](../)
4. [  LangGraph ](../../how-tos#langgraph)
5. [  Prebuilt ReAct Agent ](../../how-tos#prebuilt-react-agent)

# How to add human-in-the-loop processes to the prebuilt ReAct agent[¶](#how-to-add-human-in-the-loop-processes-to-the-prebuilt-react-agent "Permanent link")

This tutorial will show how to add human-in-the-loop processes to the prebuilt ReAct agent. Please see [this tutorial](./create-react-agent.ipynb) for how to get started with the prebuilt ReAct agent

You can add a a breakpoint before tools are called by passing `interruptBefore: ["tools"]` to `createReactAgent`. Note that you need to be using a checkpointer for this to work.

## Setup[¶](#setup "Permanent link")

First, we need to install the required packages.

`[](#%5F%5Fcodelineno-0-1)yarn add @langchain/langgraph @langchain/openai @langchain/core
`

This guide will use OpenAI's GPT-4o model. We will optionally set our API key for [LangSmith tracing](https://smith.langchain.com/), which will give us best-in-class observability.

`[](#%5F%5Fcodelineno-1-1)// process.env.OPENAI_API_KEY = "sk_...";
[](#%5F%5Fcodelineno-1-2)
[](#%5F%5Fcodelineno-1-3)// Optional, add tracing in LangSmith
[](#%5F%5Fcodelineno-1-4)// process.env.LANGCHAIN_API_KEY = "ls__..."
[](#%5F%5Fcodelineno-1-5)// process.env.LANGCHAIN_CALLBACKS_BACKGROUND = "true";
[](#%5F%5Fcodelineno-1-6)process.env.LANGCHAIN_CALLBACKS_BACKGROUND = "true";
[](#%5F%5Fcodelineno-1-7)process.env.LANGCHAIN_TRACING_V2 = "true";
[](#%5F%5Fcodelineno-1-8)process.env.LANGCHAIN_PROJECT = "ReAct Agent with human-in-the-loop: LangGraphJS";
`

`[](#%5F%5Fcodelineno-2-1)ReAct Agent with human-in-the-loop: LangGraphJS
`

## Code[¶](#code "Permanent link")

Now we can use the prebuilt `createReactAgent` function to setup our agent with human-in-the-loop interactions:

`[](#%5F%5Fcodelineno-3-1)import { ChatOpenAI } from "@langchain/openai";
[](#%5F%5Fcodelineno-3-2)import { tool } from '@langchain/core/tools';
[](#%5F%5Fcodelineno-3-3)import { z } from 'zod';
[](#%5F%5Fcodelineno-3-4)import { createReactAgent } from "@langchain/langgraph/prebuilt";
[](#%5F%5Fcodelineno-3-5)import { MemorySaver } from "@langchain/langgraph";
[](#%5F%5Fcodelineno-3-6)
[](#%5F%5Fcodelineno-3-7)const model = new ChatOpenAI({
[](#%5F%5Fcodelineno-3-8)    model: "gpt-4o",
[](#%5F%5Fcodelineno-3-9)  });
[](#%5F%5Fcodelineno-3-10)
[](#%5F%5Fcodelineno-3-11)const getWeather = tool((input) => {
[](#%5F%5Fcodelineno-3-12)    if (['sf', 'san francisco'].includes(input.location.toLowerCase())) {
[](#%5F%5Fcodelineno-3-13)        return 'It\'s always sunny in sf';
[](#%5F%5Fcodelineno-3-14)    } else if (['nyc', 'new york city'].includes(input.location.toLowerCase())) {
[](#%5F%5Fcodelineno-3-15)        return 'It might be cloudy in nyc';
[](#%5F%5Fcodelineno-3-16)    }
[](#%5F%5Fcodelineno-3-17)    else {
[](#%5F%5Fcodelineno-3-18)        throw new Error("Unknown Location");
[](#%5F%5Fcodelineno-3-19)    }
[](#%5F%5Fcodelineno-3-20)}, {
[](#%5F%5Fcodelineno-3-21)    name: 'get_weather',
[](#%5F%5Fcodelineno-3-22)    description: 'Call to get the current weather in a given location.',
[](#%5F%5Fcodelineno-3-23)    schema: z.object({
[](#%5F%5Fcodelineno-3-24)        location: z.string().describe("Location to get the weather for."),
[](#%5F%5Fcodelineno-3-25)    })
[](#%5F%5Fcodelineno-3-26)})
[](#%5F%5Fcodelineno-3-27)
[](#%5F%5Fcodelineno-3-28)// Here we only save in-memory
[](#%5F%5Fcodelineno-3-29)const memory = new MemorySaver();
[](#%5F%5Fcodelineno-3-30)
[](#%5F%5Fcodelineno-3-31)const agent = createReactAgent({ llm: model, tools: [getWeather], interruptBefore: ["tools"], checkpointSaver: memory });
`

## Usage[¶](#usage "Permanent link")

`[](#%5F%5Fcodelineno-4-1)let inputs = { messages: [{ role: "user", content: "what is the weather in SF california?" }] };
[](#%5F%5Fcodelineno-4-2)let config = { configurable: { thread_id: "1" } };
[](#%5F%5Fcodelineno-4-3)
[](#%5F%5Fcodelineno-4-4)let stream = await agent.stream(inputs, {
[](#%5F%5Fcodelineno-4-5)  ...config,
[](#%5F%5Fcodelineno-4-6)  streamMode: "values",
[](#%5F%5Fcodelineno-4-7)});
[](#%5F%5Fcodelineno-4-8)
[](#%5F%5Fcodelineno-4-9)for await (
[](#%5F%5Fcodelineno-4-10)  const { messages } of stream
[](#%5F%5Fcodelineno-4-11)) {
[](#%5F%5Fcodelineno-4-12)  let msg = messages[messages?.length - 1];
[](#%5F%5Fcodelineno-4-13)  if (msg?.content) {
[](#%5F%5Fcodelineno-4-14)    console.log(msg.content);
[](#%5F%5Fcodelineno-4-15)  }
[](#%5F%5Fcodelineno-4-16)  if (msg?.tool_calls?.length > 0) {
[](#%5F%5Fcodelineno-4-17)    console.log(msg.tool_calls);
[](#%5F%5Fcodelineno-4-18)  }
[](#%5F%5Fcodelineno-4-19)  console.log("-----\n");
[](#%5F%5Fcodelineno-4-20)}
`

`[](#%5F%5Fcodelineno-5-1)what is the weather in SF california?
[](#%5F%5Fcodelineno-5-2)-----
[](#%5F%5Fcodelineno-5-3)
[](#%5F%5Fcodelineno-5-4)[
[](#%5F%5Fcodelineno-5-5)  {
[](#%5F%5Fcodelineno-5-6)    name: 'get_weather',
[](#%5F%5Fcodelineno-5-7)    args: { location: 'SF, California' },
[](#%5F%5Fcodelineno-5-8)    type: 'tool_call',
[](#%5F%5Fcodelineno-5-9)    id: 'call_AWgaSjqaYVQN73kL0H4BNn1Q'
[](#%5F%5Fcodelineno-5-10)  }
[](#%5F%5Fcodelineno-5-11)]
[](#%5F%5Fcodelineno-5-12)-----
`

We can verify that our graph stopped at the right place: 

`[](#%5F%5Fcodelineno-6-1)const state = await agent.getState(config)
[](#%5F%5Fcodelineno-6-2)console.log(state.next)
`

`[](#%5F%5Fcodelineno-7-1)[ 'tools' ]
`

Now we can either approve or edit the tool call before proceeding to the next node. If we wanted to approve the tool call, we would simply continue streaming the graph with `null` input. If we wanted to edit the tool call we need to update the state to have the correct tool call, and then after the update has been applied we can continue. 

We can try resuming and we will see an error arise:

`[](#%5F%5Fcodelineno-8-1)stream = await agent.stream(null, {
[](#%5F%5Fcodelineno-8-2)  ...config,
[](#%5F%5Fcodelineno-8-3)  streamMode: "values",
[](#%5F%5Fcodelineno-8-4)});
[](#%5F%5Fcodelineno-8-5)
[](#%5F%5Fcodelineno-8-6)for await (
[](#%5F%5Fcodelineno-8-7)    const { messages } of stream
[](#%5F%5Fcodelineno-8-8)  ) {
[](#%5F%5Fcodelineno-8-9)    let msg = messages[messages?.length - 1];
[](#%5F%5Fcodelineno-8-10)    if (msg?.content) {
[](#%5F%5Fcodelineno-8-11)      console.log(msg.content);
[](#%5F%5Fcodelineno-8-12)    }
[](#%5F%5Fcodelineno-8-13)    if (msg?.tool_calls?.length > 0) {
[](#%5F%5Fcodelineno-8-14)      console.log(msg.tool_calls);
[](#%5F%5Fcodelineno-8-15)    }
[](#%5F%5Fcodelineno-8-16)    console.log("-----\n");
[](#%5F%5Fcodelineno-8-17)  }
`

`[](#%5F%5Fcodelineno-9-1)Error: Unknown Location
[](#%5F%5Fcodelineno-9-2) Please fix your mistakes.
[](#%5F%5Fcodelineno-9-3)-----
[](#%5F%5Fcodelineno-9-4)
[](#%5F%5Fcodelineno-9-5)[
[](#%5F%5Fcodelineno-9-6)  {
[](#%5F%5Fcodelineno-9-7)    name: 'get_weather',
[](#%5F%5Fcodelineno-9-8)    args: { location: 'San Francisco, California' },
[](#%5F%5Fcodelineno-9-9)    type: 'tool_call',
[](#%5F%5Fcodelineno-9-10)    id: 'call_MfIPKpRDXRL4LcHm1BxwcSTk'
[](#%5F%5Fcodelineno-9-11)  }
[](#%5F%5Fcodelineno-9-12)]
[](#%5F%5Fcodelineno-9-13)-----
`

This error arose because our tool argument of "SF, California" is not a location our tool recognizes. 

Let's show how we would edit the tool call to search for "San Francisco" instead of "SF, California" - since our tool as written treats "San Francisco, CA" as an unknown location. We will update the state and then resume streaming the graph and should see no errors arise. Note that the reducer we use for our `messages` channel will replace a messaege only if a message with the exact same ID is used. For that reason we can do `new AiMessage(...)` and instead have to directly modify the last message from the `messages` channel, making sure not to edit its ID.

`` [](#%5F%5Fcodelineno-10-1)// First, lets get the current state
[](#%5F%5Fcodelineno-10-2)const currentState = await agent.getState(config);
[](#%5F%5Fcodelineno-10-3)
[](#%5F%5Fcodelineno-10-4)// Let's now get the last message in the state
[](#%5F%5Fcodelineno-10-5)// This is the one with the tool calls that we want to update
[](#%5F%5Fcodelineno-10-6)let lastMessage = currentState.values.messages[currentState.values.messages.length - 1]
[](#%5F%5Fcodelineno-10-7)
[](#%5F%5Fcodelineno-10-8)// Let's now update the args for that tool call
[](#%5F%5Fcodelineno-10-9)lastMessage.tool_calls[0].args = { location: "San Francisco" }
[](#%5F%5Fcodelineno-10-10)
[](#%5F%5Fcodelineno-10-11)// Let's now call `updateState` to pass in this message in the `messages` key
[](#%5F%5Fcodelineno-10-12)// This will get treated as any other update to the state
[](#%5F%5Fcodelineno-10-13)// It will get passed to the reducer function for the `messages` key
[](#%5F%5Fcodelineno-10-14)// That reducer function will use the ID of the message to update it
[](#%5F%5Fcodelineno-10-15)// It's important that it has the right ID! Otherwise it would get appended
[](#%5F%5Fcodelineno-10-16)// as a new message
[](#%5F%5Fcodelineno-10-17)await agent.updateState(config, { messages: lastMessage });
 ``

`[](#%5F%5Fcodelineno-11-1){
[](#%5F%5Fcodelineno-11-2)  configurable: {
[](#%5F%5Fcodelineno-11-3)    thread_id: '1',
[](#%5F%5Fcodelineno-11-4)    checkpoint_ns: '',
[](#%5F%5Fcodelineno-11-5)    checkpoint_id: '1ef6638d-bfbd-61d0-8004-2751c8c3f226'
[](#%5F%5Fcodelineno-11-6)  }
[](#%5F%5Fcodelineno-11-7)}
`

`[](#%5F%5Fcodelineno-12-1)stream = await agent.stream(null, {
[](#%5F%5Fcodelineno-12-2)  ...config,
[](#%5F%5Fcodelineno-12-3)  streamMode: "values",
[](#%5F%5Fcodelineno-12-4)});
[](#%5F%5Fcodelineno-12-5)
[](#%5F%5Fcodelineno-12-6)for await (
[](#%5F%5Fcodelineno-12-7)  const { messages } of stream
[](#%5F%5Fcodelineno-12-8)) {
[](#%5F%5Fcodelineno-12-9)  let msg = messages[messages?.length - 1];
[](#%5F%5Fcodelineno-12-10)  if (msg?.content) {
[](#%5F%5Fcodelineno-12-11)    console.log(msg.content);
[](#%5F%5Fcodelineno-12-12)  }
[](#%5F%5Fcodelineno-12-13)  if (msg?.tool_calls?.length > 0) {
[](#%5F%5Fcodelineno-12-14)    console.log(msg.tool_calls);
[](#%5F%5Fcodelineno-12-15)  }
[](#%5F%5Fcodelineno-12-16)  console.log("-----\n");
[](#%5F%5Fcodelineno-12-17)}
`

`[](#%5F%5Fcodelineno-13-1)It's always sunny in sf
[](#%5F%5Fcodelineno-13-2)-----
[](#%5F%5Fcodelineno-13-3)
[](#%5F%5Fcodelineno-13-4)The climate in San Francisco is sunny right now. If you need more specific details, feel free to ask!
[](#%5F%5Fcodelineno-13-5)-----
`

Fantastic! Our graph updated properly to query the weather in San Francisco and got the correct "The weather in San Francisco is sunny today! " response from the tool. 

 Was this page helpful? 

 Thanks for your feedback!

 Thanks for your feedback! Please help us improve this page by adding to the discussion below.

 Back to top 

[  Previous  How to add a custom system prompt to the prebuilt ReAct agent ](../react-system-prompt/) [  Next  How to return structured output from the prebuilt ReAct agent ](../react-return-structured-output/) 

 Copyright © 2025 LangChain, Inc | [Consent Preferences](#%5F%5Fconsent) 

 Made with[ Material for MkDocs Insiders](https://squidfunk.github.io/mkdocs-material/) 

[ ](https://langchain-ai.github.io/langgraph/ "langchain-ai.github.io") [ ](https://github.com/langchain-ai/langgraphjs "github.com") [ ](https://twitter.com/LangChainAI "twitter.com") 

#### Cookie consent

We use cookies to recognize your repeated visits and preferences, as well as to measure the effectiveness of our documentation and whether users find what they're searching for. **Clicking "Accept" makes our documentation better. Thank you!** ❤️

* Google Analytics
* GitHub

Accept Reject 