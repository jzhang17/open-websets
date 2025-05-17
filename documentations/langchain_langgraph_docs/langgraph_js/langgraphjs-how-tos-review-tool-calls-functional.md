[ Skip to content](#how-to-review-tool-calls-functional-api) 

**Help us build the JS tools that power AI apps at companies like Replit, Uber, LinkedIn, GitLab, and more. [Join our team!](https://jobs.ashbyhq.com/langchain/05efa205-8560-43fd-bfcc-3f7697561cfb?utm%5Fsource=https%3A%2F%2Flangchain-ai.github.io%2Flanggraphjs%2F&utm%5Fcampaign=langgraphjs%5Fdocs)** 

[ ![logo](../../static/wordmark_dark.svg) ![logo](../../static/wordmark_light.svg) ](../..) 

 How to review tool calls (Functional API) 

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
                              * Human-in-the-loop  
                               Human-in-the-loop  
                                             * [  Human-in-the-loop ](../../how-tos#human-in-the-loop)  
                                             * [  How to add breakpoints ](../breakpoints/)  
                                             * [  How to add dynamic breakpoints ](../dynamic%5Fbreakpoints/)  
                                             * [  How to edit graph state ](../edit-graph-state/)  
                                             * [  How to wait for user input ](../wait-user-input/)  
                                             * [  How to wait for user input (Functional API) ](../wait-user-input-functional/)  
                                             * [  How to view and update past graph state ](../time-travel/)  
                                             * [  Review Tool Calls ](../review-tool-calls/)  
                                             * How to review tool calls (Functional API) [  How to review tool calls (Functional API) ](./)  
                                              Table of contents  
                                                               * [  Setup ](#setup)  
                                                               * [  Define model and tools ](#define-model-and-tools)  
                                                               * [  Define tasks ](#define-tasks)  
                                                               * [  Define entrypoint ](#define-entrypoint)  
                                                                                    * [  Usage ](#usage)  
                                                                                    * [  Accept a tool call ](#accept-a-tool-call)  
                                                                                    * [  Revise a tool call ](#revise-a-tool-call)  
                                                                                    * [  Generate a custom ToolMessage ](#generate-a-custom-toolmessage)  
                              * [  Streaming ](../../how-tos#streaming)  
                              * [  Tool calling ](../../how-tos#tool-calling)  
                              * [  Subgraphs ](../../how-tos#subgraphs)  
                              * [  Multi-agent ](../multi-agent-network/)  
                              * [  State Management ](../../how-tos#state-management)  
                              * [  Other ](../../how-tos#other)  
                              * [  Prebuilt ReAct Agent ](../../how-tos#prebuilt-react-agent)  
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
* [  Define model and tools ](#define-model-and-tools)
* [  Define tasks ](#define-tasks)
* [  Define entrypoint ](#define-entrypoint)  
   * [  Usage ](#usage)  
   * [  Accept a tool call ](#accept-a-tool-call)  
   * [  Revise a tool call ](#revise-a-tool-call)  
   * [  Generate a custom ToolMessage ](#generate-a-custom-toolmessage)

1. [  LangGraph ](../..)
2. [  Guides ](../)
3. [  How-to Guides ](../)
4. [  LangGraph ](../../how-tos#langgraph)
5. [  Human-in-the-loop ](../../how-tos#human-in-the-loop)

# How to review tool calls (Functional API)[¶](#how-to-review-tool-calls-functional-api "Permanent link")

Prerequisites

This guide assumes familiarity with the following:

* Implementing [human-in-the-loop](../../concepts/human%5Fin%5Fthe%5Floop) workflows with [interrupt](../../concepts/human%5Fin%5Fthe%5Floop/#interrupt)
* [How to create a ReAct agent using the Functional API](../../how-tos/react-agent-from-scratch-functional)

This guide demonstrates how to implement human-in-the-loop workflows in a ReAct agent using the LangGraph [Functional API](../../concepts/functional%5Fapi).

We will build off of the agent created in the [How to create a ReAct agent using the Functional API](../../how-tos/react-agent-from-scratch-functional) guide.

Specifically, we will demonstrate how to review [tool calls](https://js.langchain.com/docs/concepts/tool%5Fcalling/) generated by a [chat model](https://js.langchain.com/docs/concepts/chat%5Fmodels/) prior to their execution. This can be accomplished through use of the [interrupt](../../concepts/human%5Fin%5Fthe%5Floop/#interrupt) function at key points in our application.

**Preview**:

We will implement a simple function that reviews tool calls generated from our chat model and call it from inside our application's [entrypoint](../../concepts/functional%5Fapi/#entrypoint):

`` [](#%5F%5Fcodelineno-0-1)function reviewToolCall(toolCall: ToolCall): ToolCall | ToolMessage {
[](#%5F%5Fcodelineno-0-2)  // Interrupt for human review
[](#%5F%5Fcodelineno-0-3)  const humanReview = interrupt({
[](#%5F%5Fcodelineno-0-4)    question: "Is this correct?",
[](#%5F%5Fcodelineno-0-5)    tool_call: toolCall,
[](#%5F%5Fcodelineno-0-6)  });
[](#%5F%5Fcodelineno-0-7)
[](#%5F%5Fcodelineno-0-8)  const { action, data } = humanReview;
[](#%5F%5Fcodelineno-0-9)
[](#%5F%5Fcodelineno-0-10)  if (action === "continue") {
[](#%5F%5Fcodelineno-0-11)    return toolCall;
[](#%5F%5Fcodelineno-0-12)  } else if (action === "update") {
[](#%5F%5Fcodelineno-0-13)    return {
[](#%5F%5Fcodelineno-0-14)      ...toolCall,
[](#%5F%5Fcodelineno-0-15)      args: data,
[](#%5F%5Fcodelineno-0-16)    };
[](#%5F%5Fcodelineno-0-17)  } else if (action === "feedback") {
[](#%5F%5Fcodelineno-0-18)    return new ToolMessage({
[](#%5F%5Fcodelineno-0-19)      content: data,
[](#%5F%5Fcodelineno-0-20)      name: toolCall.name,
[](#%5F%5Fcodelineno-0-21)      tool_call_id: toolCall.id,
[](#%5F%5Fcodelineno-0-22)    });
[](#%5F%5Fcodelineno-0-23)  }
[](#%5F%5Fcodelineno-0-24)  throw new Error(`Unsupported review action: ${action}`);
[](#%5F%5Fcodelineno-0-25)}
 ``

## Setup[¶](#setup "Permanent link")

Note

This guide requires `@langchain/langgraph>=0.2.42`.

First, install the required dependencies for this example:

`[](#%5F%5Fcodelineno-1-1)npm install @langchain/langgraph @langchain/openai @langchain/core zod
`

Next, we need to set API keys for OpenAI (the LLM we will use):

`[](#%5F%5Fcodelineno-2-1)process.env.OPENAI_API_KEY = "YOUR_API_KEY";
`

Set up [LangSmith](https://smith.langchain.com) for LangGraph development

Sign up for LangSmith to quickly spot issues and improve the performance of your LangGraph projects. LangSmith lets you use trace data to debug, test, and monitor your LLM apps built with LangGraph — read more about how to get started [here](https://docs.smith.langchain.com)

## Define model and tools[¶](#define-model-and-tools "Permanent link")

Let's first define the tools and model we will use for our example. As in the [ReAct agent guide](../../how-tos/react-agent-from-scratch-functional), we will use a single place-holder tool that gets a description of the weather for a location.

We will use an [OpenAI](https://js.langchain.com/docs/integrations/providers/openai/) chat model for this example, but any model [supporting tool-calling](https://js.langchain.com/docs/integrations/chat/) will suffice.

`` [](#%5F%5Fcodelineno-3-1)import { ChatOpenAI } from "@langchain/openai";
[](#%5F%5Fcodelineno-3-2)import { tool } from "@langchain/core/tools";
[](#%5F%5Fcodelineno-3-3)import { z } from "zod";
[](#%5F%5Fcodelineno-3-4)
[](#%5F%5Fcodelineno-3-5)const model = new ChatOpenAI({
[](#%5F%5Fcodelineno-3-6)  model: "gpt-4o-mini",
[](#%5F%5Fcodelineno-3-7)});
[](#%5F%5Fcodelineno-3-8)
[](#%5F%5Fcodelineno-3-9)const getWeather = tool(async ({ location }) => {
[](#%5F%5Fcodelineno-3-10)  // This is a placeholder for the actual implementation
[](#%5F%5Fcodelineno-3-11)  const lowercaseLocation = location.toLowerCase();
[](#%5F%5Fcodelineno-3-12)  if (lowercaseLocation.includes("sf") || lowercaseLocation.includes("san francisco")) {
[](#%5F%5Fcodelineno-3-13)    return "It's sunny!";
[](#%5F%5Fcodelineno-3-14)  } else if (lowercaseLocation.includes("boston")) {
[](#%5F%5Fcodelineno-3-15)    return "It's rainy!";
[](#%5F%5Fcodelineno-3-16)  } else {
[](#%5F%5Fcodelineno-3-17)    return `I am not sure what the weather is in ${location}`;
[](#%5F%5Fcodelineno-3-18)  }
[](#%5F%5Fcodelineno-3-19)}, {
[](#%5F%5Fcodelineno-3-20)  name: "getWeather",
[](#%5F%5Fcodelineno-3-21)  schema: z.object({
[](#%5F%5Fcodelineno-3-22)    location: z.string().describe("Location to get the weather for"),
[](#%5F%5Fcodelineno-3-23)  }),
[](#%5F%5Fcodelineno-3-24)  description: "Call to get the weather from a specific location.",
[](#%5F%5Fcodelineno-3-25)});
[](#%5F%5Fcodelineno-3-26)
[](#%5F%5Fcodelineno-3-27)const tools = [getWeather];
 ``

## Define tasks[¶](#define-tasks "Permanent link")

Our [tasks](../../concepts/functional%5Fapi/#task) are unchanged from the [ReAct agent guide](../../how-tos/react-agent-from-scratch-functional):

1. **Call model**: We want to query our chat model with a list of messages.
2. **Call tool**: If our model generates tool calls, we want to execute them.

`[](#%5F%5Fcodelineno-4-1)import {
[](#%5F%5Fcodelineno-4-2)  type BaseMessageLike,
[](#%5F%5Fcodelineno-4-3)  AIMessage,
[](#%5F%5Fcodelineno-4-4)  ToolMessage,
[](#%5F%5Fcodelineno-4-5)} from "@langchain/core/messages";
[](#%5F%5Fcodelineno-4-6)import { type ToolCall } from "@langchain/core/messages/tool";
[](#%5F%5Fcodelineno-4-7)import { task } from "@langchain/langgraph";
[](#%5F%5Fcodelineno-4-8)
[](#%5F%5Fcodelineno-4-9)const toolsByName = Object.fromEntries(tools.map((tool) => [tool.name, tool]));
[](#%5F%5Fcodelineno-4-10)
[](#%5F%5Fcodelineno-4-11)const callModel = task("callModel", async (messages: BaseMessageLike[]) => {
[](#%5F%5Fcodelineno-4-12)  const response = await model.bindTools(tools).invoke(messages);
[](#%5F%5Fcodelineno-4-13)  return response;
[](#%5F%5Fcodelineno-4-14)});
[](#%5F%5Fcodelineno-4-15)
[](#%5F%5Fcodelineno-4-16)const callTool = task(
[](#%5F%5Fcodelineno-4-17)  "callTool",
[](#%5F%5Fcodelineno-4-18)  async (toolCall: ToolCall): Promise<AIMessage> => {
[](#%5F%5Fcodelineno-4-19)    const tool = toolsByName[toolCall.name];
[](#%5F%5Fcodelineno-4-20)    const observation = await tool.invoke(toolCall.args);
[](#%5F%5Fcodelineno-4-21)    return new ToolMessage({ content: observation, tool_call_id: toolCall.id });
[](#%5F%5Fcodelineno-4-22)    // Can also pass toolCall directly into the tool to return a ToolMessage
[](#%5F%5Fcodelineno-4-23)    // return tool.invoke(toolCall);
[](#%5F%5Fcodelineno-4-24)  });
`

## Define entrypoint[¶](#define-entrypoint "Permanent link")

To review tool calls before execution, we add a `reviewToolCalls` function that calls [interrupt](../../concepts/human%5Fin%5Fthe%5Floop/#interrupt). When this function is called, execution will be paused until we issue a command to resume it.

Given a tool call, our function will `interrupt` for human review. At that point we can either:

* Accept the tool call;
* Revise the tool call and continue;
* Generate a custom tool message (e.g., instructing the model to re-format its tool call).

We will demonstrate these three cases in the [usage examples](#usage) below.

`` [](#%5F%5Fcodelineno-5-1)import { interrupt } from "@langchain/langgraph";
[](#%5F%5Fcodelineno-5-2)
[](#%5F%5Fcodelineno-5-3)function reviewToolCall(toolCall: ToolCall): ToolCall | ToolMessage {
[](#%5F%5Fcodelineno-5-4)  // Interrupt for human review
[](#%5F%5Fcodelineno-5-5)  const humanReview = interrupt({
[](#%5F%5Fcodelineno-5-6)    question: "Is this correct?",
[](#%5F%5Fcodelineno-5-7)    tool_call: toolCall,
[](#%5F%5Fcodelineno-5-8)  });
[](#%5F%5Fcodelineno-5-9)
[](#%5F%5Fcodelineno-5-10)  const { action, data } = humanReview;
[](#%5F%5Fcodelineno-5-11)
[](#%5F%5Fcodelineno-5-12)  if (action === "continue") {
[](#%5F%5Fcodelineno-5-13)    return toolCall;
[](#%5F%5Fcodelineno-5-14)  } else if (action === "update") {
[](#%5F%5Fcodelineno-5-15)    return {
[](#%5F%5Fcodelineno-5-16)      ...toolCall,
[](#%5F%5Fcodelineno-5-17)      args: data,
[](#%5F%5Fcodelineno-5-18)    };
[](#%5F%5Fcodelineno-5-19)  } else if (action === "feedback") {
[](#%5F%5Fcodelineno-5-20)    return new ToolMessage({
[](#%5F%5Fcodelineno-5-21)      content: data,
[](#%5F%5Fcodelineno-5-22)      name: toolCall.name,
[](#%5F%5Fcodelineno-5-23)      tool_call_id: toolCall.id,
[](#%5F%5Fcodelineno-5-24)    });
[](#%5F%5Fcodelineno-5-25)  }
[](#%5F%5Fcodelineno-5-26)  throw new Error(`Unsupported review action: ${action}`);
[](#%5F%5Fcodelineno-5-27)}
 ``

We can now update our [entrypoint](../../concepts/functional%5Fapi/#entrypoint) to review the generated tool calls. If a tool call is accepted or revised, we execute in the same way as before. Otherwise, we just append the `ToolMessage` supplied by the human.

Tip

The results of prior tasks — in this case the initial model call — are persisted, so that they are not run again following the `interrupt`.

`[](#%5F%5Fcodelineno-6-1)import {
[](#%5F%5Fcodelineno-6-2)  MemorySaver,
[](#%5F%5Fcodelineno-6-3)  addMessages,
[](#%5F%5Fcodelineno-6-4)  entrypoint,
[](#%5F%5Fcodelineno-6-5)  getPreviousState,
[](#%5F%5Fcodelineno-6-6)} from "@langchain/langgraph";
[](#%5F%5Fcodelineno-6-7)
[](#%5F%5Fcodelineno-6-8)const checkpointer = new MemorySaver();
[](#%5F%5Fcodelineno-6-9)
[](#%5F%5Fcodelineno-6-10)const agent = entrypoint({
[](#%5F%5Fcodelineno-6-11)  checkpointer,
[](#%5F%5Fcodelineno-6-12)  name: "agent",
[](#%5F%5Fcodelineno-6-13)}, async (messages: BaseMessageLike[]) => {
[](#%5F%5Fcodelineno-6-14)  const previous = getPreviousState<BaseMessageLike[]>() ?? [];
[](#%5F%5Fcodelineno-6-15)  let currentMessages = addMessages(previous, messages);
[](#%5F%5Fcodelineno-6-16)  let llmResponse = await callModel(currentMessages);
[](#%5F%5Fcodelineno-6-17)  while (true) {
[](#%5F%5Fcodelineno-6-18)    if (!llmResponse.tool_calls?.length) {
[](#%5F%5Fcodelineno-6-19)      break;
[](#%5F%5Fcodelineno-6-20)    }
[](#%5F%5Fcodelineno-6-21)    // Review tool calls
[](#%5F%5Fcodelineno-6-22)    const toolResults: ToolMessage[] = [];
[](#%5F%5Fcodelineno-6-23)    const toolCalls: ToolCall[] = [];
[](#%5F%5Fcodelineno-6-24)
[](#%5F%5Fcodelineno-6-25)    for (let i = 0; i < llmResponse.tool_calls.length; i++) {
[](#%5F%5Fcodelineno-6-26)      const review = await reviewToolCall(llmResponse.tool_calls[i]);
[](#%5F%5Fcodelineno-6-27)      if (review instanceof ToolMessage) {
[](#%5F%5Fcodelineno-6-28)        toolResults.push(review);
[](#%5F%5Fcodelineno-6-29)      } else { // is a validated tool call
[](#%5F%5Fcodelineno-6-30)        toolCalls.push(review);
[](#%5F%5Fcodelineno-6-31)        if (review !== llmResponse.tool_calls[i]) {
[](#%5F%5Fcodelineno-6-32)          llmResponse.tool_calls[i] = review;
[](#%5F%5Fcodelineno-6-33)        }
[](#%5F%5Fcodelineno-6-34)      }
[](#%5F%5Fcodelineno-6-35)    }
[](#%5F%5Fcodelineno-6-36)    // Execute remaining tool calls
[](#%5F%5Fcodelineno-6-37)    const remainingToolResults = await Promise.all(
[](#%5F%5Fcodelineno-6-38)      toolCalls.map((toolCall) => callTool(toolCall))
[](#%5F%5Fcodelineno-6-39)    );
[](#%5F%5Fcodelineno-6-40)
[](#%5F%5Fcodelineno-6-41)    // Append to message list
[](#%5F%5Fcodelineno-6-42)    currentMessages = addMessages(
[](#%5F%5Fcodelineno-6-43)      currentMessages,
[](#%5F%5Fcodelineno-6-44)      [llmResponse, ...toolResults, ...remainingToolResults]
[](#%5F%5Fcodelineno-6-45)    );
[](#%5F%5Fcodelineno-6-46)
[](#%5F%5Fcodelineno-6-47)    // Call model again
[](#%5F%5Fcodelineno-6-48)    llmResponse = await callModel(currentMessages);
[](#%5F%5Fcodelineno-6-49)  }
[](#%5F%5Fcodelineno-6-50)  // Generate final response
[](#%5F%5Fcodelineno-6-51)  currentMessages = addMessages(currentMessages, llmResponse);
[](#%5F%5Fcodelineno-6-52)  return entrypoint.final({
[](#%5F%5Fcodelineno-6-53)    value: llmResponse,
[](#%5F%5Fcodelineno-6-54)    save: currentMessages
[](#%5F%5Fcodelineno-6-55)  });
[](#%5F%5Fcodelineno-6-56)});
`

### Usage[¶](#usage "Permanent link")

Let's demonstrate some scenarios.

`` [](#%5F%5Fcodelineno-7-1)import { BaseMessage, isAIMessage } from "@langchain/core/messages";
[](#%5F%5Fcodelineno-7-2)
[](#%5F%5Fcodelineno-7-3)const prettyPrintMessage = (message: BaseMessage) => {
[](#%5F%5Fcodelineno-7-4)  console.log("=".repeat(30), `${message.getType()} message`, "=".repeat(30));
[](#%5F%5Fcodelineno-7-5)  console.log(message.content);
[](#%5F%5Fcodelineno-7-6)  if (isAIMessage(message) && message.tool_calls?.length) {
[](#%5F%5Fcodelineno-7-7)    console.log(JSON.stringify(message.tool_calls, null, 2));
[](#%5F%5Fcodelineno-7-8)  }
[](#%5F%5Fcodelineno-7-9)}
[](#%5F%5Fcodelineno-7-10)
[](#%5F%5Fcodelineno-7-11)const printStep = (step: Record<string, any>) => {
[](#%5F%5Fcodelineno-7-12)  if (step.__metadata__?.cached) {
[](#%5F%5Fcodelineno-7-13)    return;
[](#%5F%5Fcodelineno-7-14)  }
[](#%5F%5Fcodelineno-7-15)  for (const [taskName, result] of Object.entries(step)) {
[](#%5F%5Fcodelineno-7-16)    if (taskName === "agent") {
[](#%5F%5Fcodelineno-7-17)      continue; // just stream from tasks
[](#%5F%5Fcodelineno-7-18)    }
[](#%5F%5Fcodelineno-7-19)
[](#%5F%5Fcodelineno-7-20)    console.log(`\n${taskName}:`);
[](#%5F%5Fcodelineno-7-21)    if (taskName === "__interrupt__" || taskName === "reviewToolCall") {
[](#%5F%5Fcodelineno-7-22)      console.log(JSON.stringify(result, null, 2));
[](#%5F%5Fcodelineno-7-23)    } else {
[](#%5F%5Fcodelineno-7-24)      prettyPrintMessage(result);
[](#%5F%5Fcodelineno-7-25)    }
[](#%5F%5Fcodelineno-7-26)  }
[](#%5F%5Fcodelineno-7-27)};
 ``

### Accept a tool call[¶](#accept-a-tool-call "Permanent link")

To accept a tool call, we just indicate in the data we provide in the `Command` that the tool call should pass through.

`[](#%5F%5Fcodelineno-8-1)const config = {
[](#%5F%5Fcodelineno-8-2)  configurable: {
[](#%5F%5Fcodelineno-8-3)    thread_id: "1"
[](#%5F%5Fcodelineno-8-4)  }
[](#%5F%5Fcodelineno-8-5)};
[](#%5F%5Fcodelineno-8-6)
[](#%5F%5Fcodelineno-8-7)const userMessage = {
[](#%5F%5Fcodelineno-8-8)  role: "user",
[](#%5F%5Fcodelineno-8-9)  content: "What's the weather in san francisco?"
[](#%5F%5Fcodelineno-8-10)};
[](#%5F%5Fcodelineno-8-11)console.log(userMessage);
[](#%5F%5Fcodelineno-8-12)
[](#%5F%5Fcodelineno-8-13)const stream = await agent.stream([userMessage], config);
[](#%5F%5Fcodelineno-8-14)
[](#%5F%5Fcodelineno-8-15)for await (const step of stream) {
[](#%5F%5Fcodelineno-8-16)  printStep(step);
[](#%5F%5Fcodelineno-8-17)}
`

``````` [](#%5F%5Fcodelineno-9-1){ role: 'user', content: "What's the weather in san francisco?" }
[](#%5F%5Fcodelineno-9-2)``````output
[](#%5F%5Fcodelineno-9-3)
[](#%5F%5Fcodelineno-9-4)callModel:
[](#%5F%5Fcodelineno-9-5)============================== ai message ==============================
[](#%5F%5Fcodelineno-9-6)
[](#%5F%5Fcodelineno-9-7)[
[](#%5F%5Fcodelineno-9-8)  {
[](#%5F%5Fcodelineno-9-9)    "name": "getWeather",
[](#%5F%5Fcodelineno-9-10)    "args": {
[](#%5F%5Fcodelineno-9-11)      "location": "San Francisco"
[](#%5F%5Fcodelineno-9-12)    },
[](#%5F%5Fcodelineno-9-13)    "type": "tool_call",
[](#%5F%5Fcodelineno-9-14)    "id": "call_pe7ee3A4lOO4Llr2NcfRukyp"
[](#%5F%5Fcodelineno-9-15)  }
[](#%5F%5Fcodelineno-9-16)]
[](#%5F%5Fcodelineno-9-17)
[](#%5F%5Fcodelineno-9-18)__interrupt__:
[](#%5F%5Fcodelineno-9-19)[
[](#%5F%5Fcodelineno-9-20)  {
[](#%5F%5Fcodelineno-9-21)    "value": {
[](#%5F%5Fcodelineno-9-22)      "question": "Is this correct?",
[](#%5F%5Fcodelineno-9-23)      "tool_call": {
[](#%5F%5Fcodelineno-9-24)        "name": "getWeather",
[](#%5F%5Fcodelineno-9-25)        "args": {
[](#%5F%5Fcodelineno-9-26)          "location": "San Francisco"
[](#%5F%5Fcodelineno-9-27)        },
[](#%5F%5Fcodelineno-9-28)        "type": "tool_call",
[](#%5F%5Fcodelineno-9-29)        "id": "call_pe7ee3A4lOO4Llr2NcfRukyp"
[](#%5F%5Fcodelineno-9-30)      }
[](#%5F%5Fcodelineno-9-31)    },
[](#%5F%5Fcodelineno-9-32)    "when": "during",
[](#%5F%5Fcodelineno-9-33)    "resumable": true,
[](#%5F%5Fcodelineno-9-34)    "ns": [
[](#%5F%5Fcodelineno-9-35)      "agent:dcee519a-80f5-5950-9e1c-e8bb85ed436f"
[](#%5F%5Fcodelineno-9-36)    ]
[](#%5F%5Fcodelineno-9-37)  }
[](#%5F%5Fcodelineno-9-38)]
 ```````

`[](#%5F%5Fcodelineno-10-1)import { Command } from "@langchain/langgraph";
[](#%5F%5Fcodelineno-10-2)
[](#%5F%5Fcodelineno-10-3)const humanInput = new Command({
[](#%5F%5Fcodelineno-10-4)  resume: {
[](#%5F%5Fcodelineno-10-5)    action: "continue",
[](#%5F%5Fcodelineno-10-6)  },
[](#%5F%5Fcodelineno-10-7)});
[](#%5F%5Fcodelineno-10-8)
[](#%5F%5Fcodelineno-10-9)const resumedStream = await agent.stream(humanInput, config)
[](#%5F%5Fcodelineno-10-10)
[](#%5F%5Fcodelineno-10-11)for await (const step of resumedStream) {
[](#%5F%5Fcodelineno-10-12)  printStep(step);
[](#%5F%5Fcodelineno-10-13)}
`

`[](#%5F%5Fcodelineno-11-1)callTool:
[](#%5F%5Fcodelineno-11-2)============================== tool message ==============================
[](#%5F%5Fcodelineno-11-3)It's sunny!
[](#%5F%5Fcodelineno-11-4)
[](#%5F%5Fcodelineno-11-5)callModel:
[](#%5F%5Fcodelineno-11-6)============================== ai message ==============================
[](#%5F%5Fcodelineno-11-7)The weather in San Francisco is sunny!
`

### Revise a tool call[¶](#revise-a-tool-call "Permanent link")

To revise a tool call, we can supply updated arguments.

`[](#%5F%5Fcodelineno-12-1)const config2 = {
[](#%5F%5Fcodelineno-12-2)  configurable: {
[](#%5F%5Fcodelineno-12-3)    thread_id: "2"
[](#%5F%5Fcodelineno-12-4)  }
[](#%5F%5Fcodelineno-12-5)};
[](#%5F%5Fcodelineno-12-6)
[](#%5F%5Fcodelineno-12-7)const userMessage2 = {
[](#%5F%5Fcodelineno-12-8)  role: "user",
[](#%5F%5Fcodelineno-12-9)  content: "What's the weather in san francisco?"
[](#%5F%5Fcodelineno-12-10)};
[](#%5F%5Fcodelineno-12-11)
[](#%5F%5Fcodelineno-12-12)console.log(userMessage2);
[](#%5F%5Fcodelineno-12-13)
[](#%5F%5Fcodelineno-12-14)const stream2 = await agent.stream([userMessage2], config2);
[](#%5F%5Fcodelineno-12-15)
[](#%5F%5Fcodelineno-12-16)for await (const step of stream2) {
[](#%5F%5Fcodelineno-12-17)  printStep(step);
[](#%5F%5Fcodelineno-12-18)}
`

`[](#%5F%5Fcodelineno-13-1){ role: 'user', content: "What's the weather in san francisco?" }
[](#%5F%5Fcodelineno-13-2)
[](#%5F%5Fcodelineno-13-3)callModel:
[](#%5F%5Fcodelineno-13-4)============================== ai message ==============================
[](#%5F%5Fcodelineno-13-5)
[](#%5F%5Fcodelineno-13-6)[
[](#%5F%5Fcodelineno-13-7)  {
[](#%5F%5Fcodelineno-13-8)    "name": "getWeather",
[](#%5F%5Fcodelineno-13-9)    "args": {
[](#%5F%5Fcodelineno-13-10)      "location": "San Francisco"
[](#%5F%5Fcodelineno-13-11)    },
[](#%5F%5Fcodelineno-13-12)    "type": "tool_call",
[](#%5F%5Fcodelineno-13-13)    "id": "call_JEOqaUEvYJ4pzMtVyCQa6H2H"
[](#%5F%5Fcodelineno-13-14)  }
[](#%5F%5Fcodelineno-13-15)]
[](#%5F%5Fcodelineno-13-16)
[](#%5F%5Fcodelineno-13-17)__interrupt__:
[](#%5F%5Fcodelineno-13-18)[
[](#%5F%5Fcodelineno-13-19)  {
[](#%5F%5Fcodelineno-13-20)    "value": {
[](#%5F%5Fcodelineno-13-21)      "question": "Is this correct?",
[](#%5F%5Fcodelineno-13-22)      "tool_call": {
[](#%5F%5Fcodelineno-13-23)        "name": "getWeather",
[](#%5F%5Fcodelineno-13-24)        "args": {
[](#%5F%5Fcodelineno-13-25)          "location": "San Francisco"
[](#%5F%5Fcodelineno-13-26)        },
[](#%5F%5Fcodelineno-13-27)        "type": "tool_call",
[](#%5F%5Fcodelineno-13-28)        "id": "call_JEOqaUEvYJ4pzMtVyCQa6H2H"
[](#%5F%5Fcodelineno-13-29)      }
[](#%5F%5Fcodelineno-13-30)    },
[](#%5F%5Fcodelineno-13-31)    "when": "during",
[](#%5F%5Fcodelineno-13-32)    "resumable": true,
[](#%5F%5Fcodelineno-13-33)    "ns": [
[](#%5F%5Fcodelineno-13-34)      "agent:d5c54c67-483a-589a-a1e7-2a8465b3ef13"
[](#%5F%5Fcodelineno-13-35)    ]
[](#%5F%5Fcodelineno-13-36)  }
[](#%5F%5Fcodelineno-13-37)]
`

`[](#%5F%5Fcodelineno-14-1)const humanInput2 = new Command({
[](#%5F%5Fcodelineno-14-2)  resume: {
[](#%5F%5Fcodelineno-14-3)    action: "update",
[](#%5F%5Fcodelineno-14-4)    data: { location: "SF, CA" },
[](#%5F%5Fcodelineno-14-5)  },
[](#%5F%5Fcodelineno-14-6)});
[](#%5F%5Fcodelineno-14-7)
[](#%5F%5Fcodelineno-14-8)const resumedStream2 = await agent.stream(humanInput2, config2)
[](#%5F%5Fcodelineno-14-9)
[](#%5F%5Fcodelineno-14-10)for await (const step of resumedStream2) {
[](#%5F%5Fcodelineno-14-11)  printStep(step);
[](#%5F%5Fcodelineno-14-12)}
`

`[](#%5F%5Fcodelineno-15-1)callTool:
[](#%5F%5Fcodelineno-15-2)============================== tool message ==============================
[](#%5F%5Fcodelineno-15-3)It's sunny!
[](#%5F%5Fcodelineno-15-4)
[](#%5F%5Fcodelineno-15-5)callModel:
[](#%5F%5Fcodelineno-15-6)============================== ai message ==============================
[](#%5F%5Fcodelineno-15-7)The weather in San Francisco is sunny!
`

The LangSmith traces for this run are particularly informative: 
* In the trace [before the interrupt](https://smith.langchain.com/public/abf80a16-3e15-484b-bbbb-23017593bd39/r), we generate a tool call for location `"San Francisco"`.
* In the trace [after resuming](https://smith.langchain.com/public/233a7e32-a43e-4939-9c04-96fd4254ce65/r), we see that the tool call in the message has been updated to `"SF, CA"`.

### Generate a custom ToolMessage[¶](#generate-a-custom-toolmessage "Permanent link")

To Generate a custom `ToolMessage`, we supply the content of the message. In this case we will ask the model to reformat its tool call.

`[](#%5F%5Fcodelineno-16-1)const config3 = {
[](#%5F%5Fcodelineno-16-2)  configurable: {
[](#%5F%5Fcodelineno-16-3)    thread_id: "3"
[](#%5F%5Fcodelineno-16-4)  }
[](#%5F%5Fcodelineno-16-5)};
[](#%5F%5Fcodelineno-16-6)
[](#%5F%5Fcodelineno-16-7)const userMessage3 = {
[](#%5F%5Fcodelineno-16-8)  role: "user",
[](#%5F%5Fcodelineno-16-9)  content: "What's the weather in san francisco?"
[](#%5F%5Fcodelineno-16-10)};
[](#%5F%5Fcodelineno-16-11)
[](#%5F%5Fcodelineno-16-12)console.log(userMessage3);
[](#%5F%5Fcodelineno-16-13)
[](#%5F%5Fcodelineno-16-14)const stream3 = await agent.stream([userMessage3], config3);
[](#%5F%5Fcodelineno-16-15)
[](#%5F%5Fcodelineno-16-16)for await (const step of stream3) {
[](#%5F%5Fcodelineno-16-17)  printStep(step);
[](#%5F%5Fcodelineno-16-18)}
`

`[](#%5F%5Fcodelineno-17-1){ role: 'user', content: "What's the weather in san francisco?" }
[](#%5F%5Fcodelineno-17-2)
[](#%5F%5Fcodelineno-17-3)callModel:
[](#%5F%5Fcodelineno-17-4)============================== ai message ==============================
[](#%5F%5Fcodelineno-17-5)
[](#%5F%5Fcodelineno-17-6)[
[](#%5F%5Fcodelineno-17-7)  {
[](#%5F%5Fcodelineno-17-8)    "name": "getWeather",
[](#%5F%5Fcodelineno-17-9)    "args": {
[](#%5F%5Fcodelineno-17-10)      "location": "San Francisco"
[](#%5F%5Fcodelineno-17-11)    },
[](#%5F%5Fcodelineno-17-12)    "type": "tool_call",
[](#%5F%5Fcodelineno-17-13)    "id": "call_HNRjJLJo4U78dtk0uJ9YZF6V"
[](#%5F%5Fcodelineno-17-14)  }
[](#%5F%5Fcodelineno-17-15)]
[](#%5F%5Fcodelineno-17-16)
[](#%5F%5Fcodelineno-17-17)__interrupt__:
[](#%5F%5Fcodelineno-17-18)[
[](#%5F%5Fcodelineno-17-19)  {
[](#%5F%5Fcodelineno-17-20)    "value": {
[](#%5F%5Fcodelineno-17-21)      "question": "Is this correct?",
[](#%5F%5Fcodelineno-17-22)      "tool_call": {
[](#%5F%5Fcodelineno-17-23)        "name": "getWeather",
[](#%5F%5Fcodelineno-17-24)        "args": {
[](#%5F%5Fcodelineno-17-25)          "location": "San Francisco"
[](#%5F%5Fcodelineno-17-26)        },
[](#%5F%5Fcodelineno-17-27)        "type": "tool_call",
[](#%5F%5Fcodelineno-17-28)        "id": "call_HNRjJLJo4U78dtk0uJ9YZF6V"
[](#%5F%5Fcodelineno-17-29)      }
[](#%5F%5Fcodelineno-17-30)    },
[](#%5F%5Fcodelineno-17-31)    "when": "during",
[](#%5F%5Fcodelineno-17-32)    "resumable": true,
[](#%5F%5Fcodelineno-17-33)    "ns": [
[](#%5F%5Fcodelineno-17-34)      "agent:6f313de8-c19e-5c3e-bdff-f90cdd68d0de"
[](#%5F%5Fcodelineno-17-35)    ]
[](#%5F%5Fcodelineno-17-36)  }
[](#%5F%5Fcodelineno-17-37)]
`

`[](#%5F%5Fcodelineno-18-1)const humanInput3 = new Command({
[](#%5F%5Fcodelineno-18-2)  resume: {
[](#%5F%5Fcodelineno-18-3)    action: "feedback",
[](#%5F%5Fcodelineno-18-4)    data: "Please format as <City>, <State>.",
[](#%5F%5Fcodelineno-18-5)  },
[](#%5F%5Fcodelineno-18-6)});
[](#%5F%5Fcodelineno-18-7)
[](#%5F%5Fcodelineno-18-8)const resumedStream3 = await agent.stream(humanInput3, config3)
[](#%5F%5Fcodelineno-18-9)
[](#%5F%5Fcodelineno-18-10)for await (const step of resumedStream3) {
[](#%5F%5Fcodelineno-18-11)  printStep(step);
[](#%5F%5Fcodelineno-18-12)}
`

`[](#%5F%5Fcodelineno-19-1)callModel:
[](#%5F%5Fcodelineno-19-2)============================== ai message ==============================
[](#%5F%5Fcodelineno-19-3)
[](#%5F%5Fcodelineno-19-4)[
[](#%5F%5Fcodelineno-19-5)  {
[](#%5F%5Fcodelineno-19-6)    "name": "getWeather",
[](#%5F%5Fcodelineno-19-7)    "args": {
[](#%5F%5Fcodelineno-19-8)      "location": "San Francisco, CA"
[](#%5F%5Fcodelineno-19-9)    },
[](#%5F%5Fcodelineno-19-10)    "type": "tool_call",
[](#%5F%5Fcodelineno-19-11)    "id": "call_5V4Oj4JV2DVfeteM4Aaf2ieD"
[](#%5F%5Fcodelineno-19-12)  }
[](#%5F%5Fcodelineno-19-13)]
[](#%5F%5Fcodelineno-19-14)
[](#%5F%5Fcodelineno-19-15)__interrupt__:
[](#%5F%5Fcodelineno-19-16)[
[](#%5F%5Fcodelineno-19-17)  {
[](#%5F%5Fcodelineno-19-18)    "value": {
[](#%5F%5Fcodelineno-19-19)      "question": "Is this correct?",
[](#%5F%5Fcodelineno-19-20)      "tool_call": {
[](#%5F%5Fcodelineno-19-21)        "name": "getWeather",
[](#%5F%5Fcodelineno-19-22)        "args": {
[](#%5F%5Fcodelineno-19-23)          "location": "San Francisco, CA"
[](#%5F%5Fcodelineno-19-24)        },
[](#%5F%5Fcodelineno-19-25)        "type": "tool_call",
[](#%5F%5Fcodelineno-19-26)        "id": "call_5V4Oj4JV2DVfeteM4Aaf2ieD"
[](#%5F%5Fcodelineno-19-27)      }
[](#%5F%5Fcodelineno-19-28)    },
[](#%5F%5Fcodelineno-19-29)    "when": "during",
[](#%5F%5Fcodelineno-19-30)    "resumable": true,
[](#%5F%5Fcodelineno-19-31)    "ns": [
[](#%5F%5Fcodelineno-19-32)      "agent:6f313de8-c19e-5c3e-bdff-f90cdd68d0de"
[](#%5F%5Fcodelineno-19-33)    ]
[](#%5F%5Fcodelineno-19-34)  }
[](#%5F%5Fcodelineno-19-35)]
`

Once it is re-formatted, we can accept it: 

`[](#%5F%5Fcodelineno-20-1)const continueCommand = new Command({
[](#%5F%5Fcodelineno-20-2)  resume: {
[](#%5F%5Fcodelineno-20-3)    action: "continue",
[](#%5F%5Fcodelineno-20-4)  },
[](#%5F%5Fcodelineno-20-5)});
[](#%5F%5Fcodelineno-20-6)
[](#%5F%5Fcodelineno-20-7)const continueStream = await agent.stream(continueCommand, config3)
[](#%5F%5Fcodelineno-20-8)
[](#%5F%5Fcodelineno-20-9)for await (const step of continueStream) {
[](#%5F%5Fcodelineno-20-10)  printStep(step);
[](#%5F%5Fcodelineno-20-11)}
`

`[](#%5F%5Fcodelineno-21-1)callTool:
[](#%5F%5Fcodelineno-21-2)============================== tool message ==============================
[](#%5F%5Fcodelineno-21-3)It's sunny!
[](#%5F%5Fcodelineno-21-4)
[](#%5F%5Fcodelineno-21-5)callModel:
[](#%5F%5Fcodelineno-21-6)============================== ai message ==============================
[](#%5F%5Fcodelineno-21-7)The weather in San Francisco, CA is sunny!
`

`[](#%5F%5Fcodelineno-22-1)
`

 Was this page helpful? 

 Thanks for your feedback!

 Thanks for your feedback! Please help us improve this page by adding to the discussion below.

 Back to top 

[  Previous  Review Tool Calls ](../review-tool-calls/) [  Next  How to stream full state of your graph ](../stream-values/) 

 Copyright © 2025 LangChain, Inc | [Consent Preferences](#%5F%5Fconsent) 

 Made with[ Material for MkDocs Insiders](https://squidfunk.github.io/mkdocs-material/) 

[ ](https://langchain-ai.github.io/langgraph/ "langchain-ai.github.io") [ ](https://github.com/langchain-ai/langgraphjs "github.com") [ ](https://twitter.com/LangChainAI "twitter.com") 

#### Cookie consent

We use cookies to recognize your repeated visits and preferences, as well as to measure the effectiveness of our documentation and whether users find what they're searching for. **Clicking "Accept" makes our documentation better. Thank you!** ❤️

* Google Analytics
* GitHub

Accept Reject 