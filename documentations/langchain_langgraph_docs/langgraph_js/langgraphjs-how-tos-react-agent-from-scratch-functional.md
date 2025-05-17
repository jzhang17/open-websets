[ Skip to content](#how-to-create-a-react-agent-from-scratch-functional-api) 

**Help us build the JS tools that power AI apps at companies like Replit, Uber, LinkedIn, GitLab, and more. [Join our team!](https://jobs.ashbyhq.com/langchain/05efa205-8560-43fd-bfcc-3f7697561cfb?utm%5Fsource=https%3A%2F%2Flangchain-ai.github.io%2Flanggraphjs%2F&utm%5Fcampaign=langgraphjs%5Fdocs)** 

[ ![logo](../../static/wordmark_dark.svg) ![logo](../../static/wordmark_light.svg) ](../..) 

 How to create a ReAct agent from scratch (Functional API) 

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
                                             * [  How to return structured output from the prebuilt ReAct agent ](../react-return-structured-output/)  
                                             * How to create a ReAct agent from scratch (Functional API) [  How to create a ReAct agent from scratch (Functional API) ](./)  
                                              Table of contents  
                                                               * [  Setup ](#setup)  
                                                               * [  Create ReAct agent ](#create-react-agent)  
                                                                                    * [  Define model and tools ](#define-model-and-tools)  
                                                                                    * [  Define tasks ](#define-tasks)  
                                                                                    * [  Define entrypoint ](#define-entrypoint)  
                                                               * [  Usage ](#usage)  
                                                               * [  Add thread-level persistence ](#add-thread-level-persistence)  
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
* [  Create ReAct agent ](#create-react-agent)  
   * [  Define model and tools ](#define-model-and-tools)  
   * [  Define tasks ](#define-tasks)  
   * [  Define entrypoint ](#define-entrypoint)
* [  Usage ](#usage)
* [  Add thread-level persistence ](#add-thread-level-persistence)

1. [  LangGraph ](../..)
2. [  Guides ](../)
3. [  How-to Guides ](../)
4. [  LangGraph ](../../how-tos#langgraph)
5. [  Prebuilt ReAct Agent ](../../how-tos#prebuilt-react-agent)

# How to create a ReAct agent from scratch (Functional API)[¶](#how-to-create-a-react-agent-from-scratch-functional-api "Permanent link")

Prerequisites

This guide assumes familiarity with the following:

* [Chat Models](https://js.langchain.com/docs/concepts/chat%5Fmodels)
* [Messages](https://js.langchain.com/docs/concepts/messages)
* [Tool Calling](https://js.langchain.com/docs/concepts/tool%5Fcalling/)
* [Entrypoints](../../concepts/functional%5Fapi/#entrypoint) and [Tasks](../../concepts/functional%5Fapi/#task)

This guide demonstrates how to implement a ReAct agent using the LangGraph [Functional API](../../concepts/functional%5Fapi).

The ReAct agent is a [tool-calling agent](../../concepts/agentic%5Fconcepts/#tool-calling-agent) that operates as follows:

1. Queries are issued to a chat model;
2. If the model generates no [tool calls](../../concepts/agentic%5Fconcepts/#tool-calling), we return the model response.
3. If the model generates tool calls, we execute the tool calls with available tools, append them as [tool messages](https://js.langchain.com/docs/concepts/messages/) to our message list, and repeat the process.

This is a simple and versatile set-up that can be extended with memory, human-in-the-loop capabilities, and other features. See the dedicated [how-to guides](../../how-tos/#prebuilt-react-agent) for examples.

## Setup[¶](#setup "Permanent link")

Note

This guide requires `@langchain/langgraph>=0.2.42`.

First, install the required dependencies for this example:

`[](#%5F%5Fcodelineno-0-1)npm install @langchain/langgraph @langchain/openai @langchain/core zod
`

Next, we need to set API keys for OpenAI (the LLM we will use):

`[](#%5F%5Fcodelineno-1-1)process.env.OPENAI_API_KEY = "YOUR_API_KEY";
`

Set up [LangSmith](https://smith.langchain.com) for LangGraph development

Sign up for LangSmith to quickly spot issues and improve the performance of your LangGraph projects. LangSmith lets you use trace data to debug, test, and monitor your LLM apps built with LangGraph — read more about how to get started [here](https://docs.smith.langchain.com)

## Create ReAct agent[¶](#create-react-agent "Permanent link")

Now that you have installed the required packages and set your environment variables, we can create our agent.

### Define model and tools[¶](#define-model-and-tools "Permanent link")

Let's first define the tools and model we will use for our example. Here we will use a single place-holder tool that gets a description of the weather for a location.

We will use an [OpenAI](https://js.langchain.com/docs/integrations/providers/openai/) chat model for this example, but any model [supporting tool-calling](https://js.langchain.com/docs/integrations/chat/) will suffice.

`` [](#%5F%5Fcodelineno-2-1)import { ChatOpenAI } from "@langchain/openai";
[](#%5F%5Fcodelineno-2-2)import { tool } from "@langchain/core/tools";
[](#%5F%5Fcodelineno-2-3)import { z } from "zod";
[](#%5F%5Fcodelineno-2-4)
[](#%5F%5Fcodelineno-2-5)const model = new ChatOpenAI({
[](#%5F%5Fcodelineno-2-6)  model: "gpt-4o-mini",
[](#%5F%5Fcodelineno-2-7)});
[](#%5F%5Fcodelineno-2-8)
[](#%5F%5Fcodelineno-2-9)const getWeather = tool(async ({ location }) => {
[](#%5F%5Fcodelineno-2-10)  const lowercaseLocation = location.toLowerCase();
[](#%5F%5Fcodelineno-2-11)  if (lowercaseLocation.includes("sf") || lowercaseLocation.includes("san francisco")) {
[](#%5F%5Fcodelineno-2-12)    return "It's sunny!";
[](#%5F%5Fcodelineno-2-13)  } else if (lowercaseLocation.includes("boston")) {
[](#%5F%5Fcodelineno-2-14)    return "It's rainy!";
[](#%5F%5Fcodelineno-2-15)  } else {
[](#%5F%5Fcodelineno-2-16)    return `I am not sure what the weather is in ${location}`;
[](#%5F%5Fcodelineno-2-17)  }
[](#%5F%5Fcodelineno-2-18)}, {
[](#%5F%5Fcodelineno-2-19)  name: "getWeather",
[](#%5F%5Fcodelineno-2-20)  schema: z.object({
[](#%5F%5Fcodelineno-2-21)    location: z.string().describe("location to get the weather for"),
[](#%5F%5Fcodelineno-2-22)  }),
[](#%5F%5Fcodelineno-2-23)  description: "Call to get the weather from a specific location."
[](#%5F%5Fcodelineno-2-24)});
[](#%5F%5Fcodelineno-2-25)
[](#%5F%5Fcodelineno-2-26)const tools = [getWeather];
 ``

### Define tasks[¶](#define-tasks "Permanent link")

We next define the [tasks](../../concepts/functional%5Fapi/#task) we will execute. Here there are two different tasks:

1. **Call model**: We want to query our chat model with a list of messages.
2. **Call tool**: If our model generates tool calls, we want to execute them.

`[](#%5F%5Fcodelineno-3-1)import {
[](#%5F%5Fcodelineno-3-2)  type BaseMessageLike,
[](#%5F%5Fcodelineno-3-3)  AIMessage,
[](#%5F%5Fcodelineno-3-4)  ToolMessage,
[](#%5F%5Fcodelineno-3-5)} from "@langchain/core/messages";
[](#%5F%5Fcodelineno-3-6)import { type ToolCall } from "@langchain/core/messages/tool";
[](#%5F%5Fcodelineno-3-7)import { task } from "@langchain/langgraph";
[](#%5F%5Fcodelineno-3-8)
[](#%5F%5Fcodelineno-3-9)const toolsByName = Object.fromEntries(tools.map((tool) => [tool.name, tool]));
[](#%5F%5Fcodelineno-3-10)
[](#%5F%5Fcodelineno-3-11)const callModel = task("callModel", async (messages: BaseMessageLike[]) => {
[](#%5F%5Fcodelineno-3-12)  const response = await model.bindTools(tools).invoke(messages);
[](#%5F%5Fcodelineno-3-13)  return response;
[](#%5F%5Fcodelineno-3-14)});
[](#%5F%5Fcodelineno-3-15)
[](#%5F%5Fcodelineno-3-16)const callTool = task(
[](#%5F%5Fcodelineno-3-17)  "callTool",
[](#%5F%5Fcodelineno-3-18)  async (toolCall: ToolCall): Promise<AIMessage> => {
[](#%5F%5Fcodelineno-3-19)    const tool = toolsByName[toolCall.name];
[](#%5F%5Fcodelineno-3-20)    const observation = await tool.invoke(toolCall.args);
[](#%5F%5Fcodelineno-3-21)    return new ToolMessage({ content: observation, tool_call_id: toolCall.id });
[](#%5F%5Fcodelineno-3-22)    // Can also pass toolCall directly into the tool to return a ToolMessage
[](#%5F%5Fcodelineno-3-23)    // return tool.invoke(toolCall);
[](#%5F%5Fcodelineno-3-24)  });
`

### Define entrypoint[¶](#define-entrypoint "Permanent link")

Our [entrypoint](../../concepts/functional%5Fapi/#entrypoint) will handle the orchestration of these two tasks. As described above, when our `callModel` task generates tool calls, the `callTool` task will generate responses for each. We append all messages to a single messages list.

`[](#%5F%5Fcodelineno-4-1)import { entrypoint, addMessages } from "@langchain/langgraph";
[](#%5F%5Fcodelineno-4-2)
[](#%5F%5Fcodelineno-4-3)const agent = entrypoint(
[](#%5F%5Fcodelineno-4-4)  "agent",
[](#%5F%5Fcodelineno-4-5)  async (messages: BaseMessageLike[]) => {
[](#%5F%5Fcodelineno-4-6)    let currentMessages = messages;
[](#%5F%5Fcodelineno-4-7)    let llmResponse = await callModel(currentMessages);
[](#%5F%5Fcodelineno-4-8)    while (true) {
[](#%5F%5Fcodelineno-4-9)      if (!llmResponse.tool_calls?.length) {
[](#%5F%5Fcodelineno-4-10)        break;
[](#%5F%5Fcodelineno-4-11)      }
[](#%5F%5Fcodelineno-4-12)
[](#%5F%5Fcodelineno-4-13)      // Execute tools
[](#%5F%5Fcodelineno-4-14)      const toolResults = await Promise.all(
[](#%5F%5Fcodelineno-4-15)        llmResponse.tool_calls.map((toolCall) => {
[](#%5F%5Fcodelineno-4-16)          return callTool(toolCall);
[](#%5F%5Fcodelineno-4-17)        })
[](#%5F%5Fcodelineno-4-18)      );
[](#%5F%5Fcodelineno-4-19)
[](#%5F%5Fcodelineno-4-20)      // Append to message list
[](#%5F%5Fcodelineno-4-21)      currentMessages = addMessages(currentMessages, [llmResponse, ...toolResults]);
[](#%5F%5Fcodelineno-4-22)
[](#%5F%5Fcodelineno-4-23)      // Call model again
[](#%5F%5Fcodelineno-4-24)      llmResponse = await callModel(currentMessages);
[](#%5F%5Fcodelineno-4-25)    }
[](#%5F%5Fcodelineno-4-26)
[](#%5F%5Fcodelineno-4-27)    return llmResponse;
[](#%5F%5Fcodelineno-4-28)  }
[](#%5F%5Fcodelineno-4-29));
`

## Usage[¶](#usage "Permanent link")

To use our agent, we invoke it with a messages list. Based on our implementation, these can be LangChain [message](https://js.langchain.com/docs/concepts/messages/) objects or OpenAI-style objects:

`` [](#%5F%5Fcodelineno-5-1)import { BaseMessage, isAIMessage } from "@langchain/core/messages";
[](#%5F%5Fcodelineno-5-2)
[](#%5F%5Fcodelineno-5-3)const prettyPrintMessage = (message: BaseMessage) => {
[](#%5F%5Fcodelineno-5-4)  console.log("=".repeat(30), `${message.getType()} message`, "=".repeat(30));
[](#%5F%5Fcodelineno-5-5)  console.log(message.content);
[](#%5F%5Fcodelineno-5-6)  if (isAIMessage(message) && message.tool_calls?.length) {
[](#%5F%5Fcodelineno-5-7)    console.log(JSON.stringify(message.tool_calls, null, 2));
[](#%5F%5Fcodelineno-5-8)  }
[](#%5F%5Fcodelineno-5-9)}
[](#%5F%5Fcodelineno-5-10)
[](#%5F%5Fcodelineno-5-11)// Usage example
[](#%5F%5Fcodelineno-5-12)const userMessage = { role: "user", content: "What's the weather in san francisco?" };
[](#%5F%5Fcodelineno-5-13)console.log(userMessage);
[](#%5F%5Fcodelineno-5-14)
[](#%5F%5Fcodelineno-5-15)const stream = await agent.stream([userMessage]);
[](#%5F%5Fcodelineno-5-16)
[](#%5F%5Fcodelineno-5-17)for await (const step of stream) {
[](#%5F%5Fcodelineno-5-18)  for (const [taskName, update] of Object.entries(step)) {
[](#%5F%5Fcodelineno-5-19)    const message = update as BaseMessage;
[](#%5F%5Fcodelineno-5-20)    // Only print task updates
[](#%5F%5Fcodelineno-5-21)    if (taskName === "agent") continue;
[](#%5F%5Fcodelineno-5-22)    console.log(`\n${taskName}:`);
[](#%5F%5Fcodelineno-5-23)    prettyPrintMessage(message);
[](#%5F%5Fcodelineno-5-24)  }
[](#%5F%5Fcodelineno-5-25)}
 ``

`[](#%5F%5Fcodelineno-6-1){ role: 'user', content: "What's the weather in san francisco?" }
[](#%5F%5Fcodelineno-6-2)
[](#%5F%5Fcodelineno-6-3)callModel:
[](#%5F%5Fcodelineno-6-4)============================== ai message ==============================
[](#%5F%5Fcodelineno-6-5)
[](#%5F%5Fcodelineno-6-6)[
[](#%5F%5Fcodelineno-6-7)  {
[](#%5F%5Fcodelineno-6-8)    "name": "getWeather",
[](#%5F%5Fcodelineno-6-9)    "args": {
[](#%5F%5Fcodelineno-6-10)      "location": "San Francisco"
[](#%5F%5Fcodelineno-6-11)    },
[](#%5F%5Fcodelineno-6-12)    "type": "tool_call",
[](#%5F%5Fcodelineno-6-13)    "id": "call_m5jZoH1HUtH6wA2QvexOHutj"
[](#%5F%5Fcodelineno-6-14)  }
[](#%5F%5Fcodelineno-6-15)]
[](#%5F%5Fcodelineno-6-16)
[](#%5F%5Fcodelineno-6-17)callTool:
[](#%5F%5Fcodelineno-6-18)============================== tool message ==============================
[](#%5F%5Fcodelineno-6-19)It's sunny!
[](#%5F%5Fcodelineno-6-20)
[](#%5F%5Fcodelineno-6-21)callModel:
[](#%5F%5Fcodelineno-6-22)============================== ai message ==============================
[](#%5F%5Fcodelineno-6-23)The weather in San Francisco is sunny!
`

Perfect! The graph correctly calls the `getWeather` tool and responds to the user after receiving the information from the tool. Check out the LangSmith trace [here](https://smith.langchain.com/public/8132d3b8-2c91-40fc-b660-b766ca33e9cb/r). 

## Add thread-level persistence[¶](#add-thread-level-persistence "Permanent link")

Adding [thread-level persistence](../../concepts/persistence#threads) lets us support conversational experiences with our agent: subsequent invocations will append to the prior messages list, retaining the full conversational context.

To add thread-level persistence to our agent:

1. Select a [checkpointer](../../concepts/persistence#checkpointer-libraries): here we will use [MemorySaver](/langgraphjs/reference/classes/checkpoint.MemorySaver.html), a simple in-memory checkpointer.
2. Update our entrypoint to accept the previous messages state as a second argument. Here, we simply append the message updates to the previous sequence of messages.
3. Choose which values will be returned from the workflow and which will be saved by the checkpointer. We will be able to access it as `getPreviousState()` if we return it from `entrypoint.final` (optional)

`[](#%5F%5Fcodelineno-7-1)import {
[](#%5F%5Fcodelineno-7-2)  MemorySaver,
[](#%5F%5Fcodelineno-7-3)  getPreviousState,
[](#%5F%5Fcodelineno-7-4)} from "@langchain/langgraph";
[](#%5F%5Fcodelineno-7-5)
[](#%5F%5Fcodelineno-7-6)const checkpointer = new MemorySaver();
[](#%5F%5Fcodelineno-7-7)
[](#%5F%5Fcodelineno-7-8)const agentWithMemory = entrypoint({
[](#%5F%5Fcodelineno-7-9)  name: "agentWithMemory",
[](#%5F%5Fcodelineno-7-10)  checkpointer,
[](#%5F%5Fcodelineno-7-11)}, async (messages: BaseMessageLike[]) => {
[](#%5F%5Fcodelineno-7-12)  const previous = getPreviousState<BaseMessage>() ?? [];
[](#%5F%5Fcodelineno-7-13)  let currentMessages = addMessages(previous, messages);
[](#%5F%5Fcodelineno-7-14)  let llmResponse = await callModel(currentMessages);
[](#%5F%5Fcodelineno-7-15)  while (true) {
[](#%5F%5Fcodelineno-7-16)    if (!llmResponse.tool_calls?.length) {
[](#%5F%5Fcodelineno-7-17)      break;
[](#%5F%5Fcodelineno-7-18)    }
[](#%5F%5Fcodelineno-7-19)
[](#%5F%5Fcodelineno-7-20)    // Execute tools
[](#%5F%5Fcodelineno-7-21)    const toolResults = await Promise.all(
[](#%5F%5Fcodelineno-7-22)      llmResponse.tool_calls.map((toolCall) => {
[](#%5F%5Fcodelineno-7-23)        return callTool(toolCall);
[](#%5F%5Fcodelineno-7-24)      })
[](#%5F%5Fcodelineno-7-25)    );
[](#%5F%5Fcodelineno-7-26)
[](#%5F%5Fcodelineno-7-27)    // Append to message list
[](#%5F%5Fcodelineno-7-28)    currentMessages = addMessages(currentMessages, [llmResponse, ...toolResults]);
[](#%5F%5Fcodelineno-7-29)
[](#%5F%5Fcodelineno-7-30)    // Call model again
[](#%5F%5Fcodelineno-7-31)    llmResponse = await callModel(currentMessages);
[](#%5F%5Fcodelineno-7-32)  }
[](#%5F%5Fcodelineno-7-33)
[](#%5F%5Fcodelineno-7-34)  // Append final response for storage
[](#%5F%5Fcodelineno-7-35)  currentMessages = addMessages(currentMessages, llmResponse);
[](#%5F%5Fcodelineno-7-36)
[](#%5F%5Fcodelineno-7-37)  return entrypoint.final({
[](#%5F%5Fcodelineno-7-38)    value: llmResponse,
[](#%5F%5Fcodelineno-7-39)    save: currentMessages,
[](#%5F%5Fcodelineno-7-40)  });
[](#%5F%5Fcodelineno-7-41)});
`

We will now need to pass in a config when running our application. The config will specify an identifier for the conversational thread.

Tip

Read more about thread-level persistence in our [concepts page](../../concepts/persistence/) and [how-to guides](../../how-tos/#persistence).

`[](#%5F%5Fcodelineno-8-1)const config = { configurable: { thread_id: "1" } };
`

We start a thread the same way as before, this time passing in the config:

`` [](#%5F%5Fcodelineno-9-1)const streamWithMemory = await agentWithMemory.stream([{
[](#%5F%5Fcodelineno-9-2)  role: "user",
[](#%5F%5Fcodelineno-9-3)  content: "What's the weather in san francisco?",
[](#%5F%5Fcodelineno-9-4)}], config);
[](#%5F%5Fcodelineno-9-5)
[](#%5F%5Fcodelineno-9-6)for await (const step of streamWithMemory) {
[](#%5F%5Fcodelineno-9-7)  for (const [taskName, update] of Object.entries(step)) {
[](#%5F%5Fcodelineno-9-8)    const message = update as BaseMessage;
[](#%5F%5Fcodelineno-9-9)    // Only print task updates
[](#%5F%5Fcodelineno-9-10)    if (taskName === "agentWithMemory") continue;
[](#%5F%5Fcodelineno-9-11)    console.log(`\n${taskName}:`);
[](#%5F%5Fcodelineno-9-12)    prettyPrintMessage(message);
[](#%5F%5Fcodelineno-9-13)  }
[](#%5F%5Fcodelineno-9-14)}
 ``

`[](#%5F%5Fcodelineno-10-1)callModel:
[](#%5F%5Fcodelineno-10-2)============================== ai message ==============================
[](#%5F%5Fcodelineno-10-3)
[](#%5F%5Fcodelineno-10-4)[
[](#%5F%5Fcodelineno-10-5)  {
[](#%5F%5Fcodelineno-10-6)    "name": "getWeather",
[](#%5F%5Fcodelineno-10-7)    "args": {
[](#%5F%5Fcodelineno-10-8)      "location": "san francisco"
[](#%5F%5Fcodelineno-10-9)    },
[](#%5F%5Fcodelineno-10-10)    "type": "tool_call",
[](#%5F%5Fcodelineno-10-11)    "id": "call_4vaZqAxUabthejqKPRMq0ngY"
[](#%5F%5Fcodelineno-10-12)  }
[](#%5F%5Fcodelineno-10-13)]
[](#%5F%5Fcodelineno-10-14)
[](#%5F%5Fcodelineno-10-15)callTool:
[](#%5F%5Fcodelineno-10-16)============================== tool message ==============================
[](#%5F%5Fcodelineno-10-17)It's sunny!
[](#%5F%5Fcodelineno-10-18)
[](#%5F%5Fcodelineno-10-19)callModel:
[](#%5F%5Fcodelineno-10-20)============================== ai message ==============================
[](#%5F%5Fcodelineno-10-21)The weather in San Francisco is sunny!
`

When we ask a follow-up conversation, the model uses the prior context to infer that we are asking about the weather: 

`` [](#%5F%5Fcodelineno-11-1)const followupStreamWithMemory = await agentWithMemory.stream([{
[](#%5F%5Fcodelineno-11-2)  role: "user",
[](#%5F%5Fcodelineno-11-3)  content: "How does it compare to Boston, MA?",
[](#%5F%5Fcodelineno-11-4)}], config);
[](#%5F%5Fcodelineno-11-5)
[](#%5F%5Fcodelineno-11-6)for await (const step of followupStreamWithMemory) {
[](#%5F%5Fcodelineno-11-7)  for (const [taskName, update] of Object.entries(step)) {
[](#%5F%5Fcodelineno-11-8)    const message = update as BaseMessage;
[](#%5F%5Fcodelineno-11-9)    // Only print task updates
[](#%5F%5Fcodelineno-11-10)    if (taskName === "agentWithMemory") continue;
[](#%5F%5Fcodelineno-11-11)    console.log(`\n${taskName}:`);
[](#%5F%5Fcodelineno-11-12)    prettyPrintMessage(message);
[](#%5F%5Fcodelineno-11-13)  }
[](#%5F%5Fcodelineno-11-14)}
 ``

`[](#%5F%5Fcodelineno-12-1)callModel:
[](#%5F%5Fcodelineno-12-2)============================== ai message ==============================
[](#%5F%5Fcodelineno-12-3)
[](#%5F%5Fcodelineno-12-4)[
[](#%5F%5Fcodelineno-12-5)  {
[](#%5F%5Fcodelineno-12-6)    "name": "getWeather",
[](#%5F%5Fcodelineno-12-7)    "args": {
[](#%5F%5Fcodelineno-12-8)      "location": "boston, ma"
[](#%5F%5Fcodelineno-12-9)    },
[](#%5F%5Fcodelineno-12-10)    "type": "tool_call",
[](#%5F%5Fcodelineno-12-11)    "id": "call_YDrNfZr5XnuBBq5jlIXaxC5v"
[](#%5F%5Fcodelineno-12-12)  }
[](#%5F%5Fcodelineno-12-13)]
[](#%5F%5Fcodelineno-12-14)
[](#%5F%5Fcodelineno-12-15)callTool:
[](#%5F%5Fcodelineno-12-16)============================== tool message ==============================
[](#%5F%5Fcodelineno-12-17)It's rainy!
[](#%5F%5Fcodelineno-12-18)
[](#%5F%5Fcodelineno-12-19)callModel:
[](#%5F%5Fcodelineno-12-20)============================== ai message ==============================
[](#%5F%5Fcodelineno-12-21)In comparison, while San Francisco is sunny, Boston, MA is experiencing rain.
`

In the [LangSmith trace](https://smith.langchain.com/public/ec803712-ecfc-49b6-8f54-92252d1e5e33/r), we can see that the full conversational context is retained in each model call. 

 Was this page helpful? 

 Thanks for your feedback!

 Thanks for your feedback! Please help us improve this page by adding to the discussion below.

 Back to top 

[  Previous  How to return structured output from the prebuilt ReAct agent ](../react-return-structured-output/) [  Next  How to Set Up a LangGraph Application with requirements.txt ](../../cloud/deployment/setup/) 

 Copyright © 2025 LangChain, Inc | [Consent Preferences](#%5F%5Fconsent) 

 Made with[ Material for MkDocs Insiders](https://squidfunk.github.io/mkdocs-material/) 

[ ](https://langchain-ai.github.io/langgraph/ "langchain-ai.github.io") [ ](https://github.com/langchain-ai/langgraphjs "github.com") [ ](https://twitter.com/LangChainAI "twitter.com") 

#### Cookie consent

We use cookies to recognize your repeated visits and preferences, as well as to measure the effectiveness of our documentation and whether users find what they're searching for. **Clicking "Accept" makes our documentation better. Thank you!** ❤️

* Google Analytics
* GitHub

Accept Reject 