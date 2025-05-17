[ Skip to content](#how-to-add-cross-thread-persistence-functional-api) 

**Help us build the JS tools that power AI apps at companies like Replit, Uber, LinkedIn, GitLab, and more. [Join our team!](https://jobs.ashbyhq.com/langchain/05efa205-8560-43fd-bfcc-3f7697561cfb?utm%5Fsource=https%3A%2F%2Flangchain-ai.github.io%2Flanggraphjs%2F&utm%5Fcampaign=langgraphjs%5Fdocs)** 

[ ![logo](../../static/wordmark_dark.svg) ![logo](../../static/wordmark_light.svg) ](../..) 

 How to add cross-thread persistence (functional API) 

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
                              * Persistence  
                               Persistence  
                                             * [  Persistence ](../../how-tos#persistence)  
                                             * [  Persistence ](../persistence/)  
                                             * [  How to add thread-level persistence (functional API) ](../persistence-functional/)  
                                             * [  How to add thread-level persistence to subgraphs ](../subgraph-persistence/)  
                                             * [  How to add cross-thread persistence to your graph ](../cross-thread-persistence/)  
                                             * How to add cross-thread persistence (functional API) [  How to add cross-thread persistence (functional API) ](./)  
                                              Table of contents  
                                                               * [  Setup ](#setup)  
                                                               * [  Example: simple chatbot with long-term memory ](#example-simple-chatbot-with-long-term-memory)  
                                                                                    * [  Define store ](#define-store)  
                                                                                    * [  Create workflow ](#create-workflow)  
                                                                                    * [  Run the workflow! ](#run-the-workflow)  
                                             * [  How to use Postgres checkpointer for persistence ](../persistence-postgres/)  
                              * [  Memory ](../../how-tos#memory)  
                              * [  Human-in-the-loop ](../../how-tos#human-in-the-loop)  
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
* [  Example: simple chatbot with long-term memory ](#example-simple-chatbot-with-long-term-memory)  
   * [  Define store ](#define-store)  
   * [  Create workflow ](#create-workflow)  
   * [  Run the workflow! ](#run-the-workflow)

1. [  LangGraph ](../..)
2. [  Guides ](../)
3. [  How-to Guides ](../)
4. [  LangGraph ](../../how-tos#langgraph)
5. [  Persistence ](../../how-tos#persistence)

# How to add cross-thread persistence (functional API)[¶](#how-to-add-cross-thread-persistence-functional-api "Permanent link")

Prerequisites

This guide assumes familiarity with the following:

* [Functional API](../../concepts/functional%5Fapi/)
* [Persistence](../../concepts/persistence/)
* [Memory](../../concepts/memory/)
* [Chat Models](https://js.langchain.com/docs/concepts/chat%5Fmodels/)

LangGraph allows you to persist data across **different [threads](../../concepts/persistence/#threads)**. For instance, you can store information about users (their names or preferences) in a shared (cross-thread) memory and reuse them in the new threads (e.g., new conversations).

When using the [functional API](../../concepts/functional%5Fapi/), you can set it up to store and retrieve memories by using the [Store](/langgraphjs/reference/classes/checkpoint.BaseStore.html) interface:

1. Create an instance of a `Store`  
`[](#%5F%5Fcodelineno-0-1)import { InMemoryStore } from "@langchain/langgraph";  
[](#%5F%5Fcodelineno-0-2)  
[](#%5F%5Fcodelineno-0-3)const store = new InMemoryStore();  
`
2. Pass the `store` instance to the `entrypoint()` wrapper function. It will be passed to the workflow as `config.store`.  
`[](#%5F%5Fcodelineno-1-1)import { entrypoint } from "@langchain/langgraph";  
[](#%5F%5Fcodelineno-1-2)  
[](#%5F%5Fcodelineno-1-3)const workflow = entrypoint({  
[](#%5F%5Fcodelineno-1-4)  store,  
[](#%5F%5Fcodelineno-1-5)  name: "myWorkflow",  
[](#%5F%5Fcodelineno-1-6)}, async (input, config) => {  
[](#%5F%5Fcodelineno-1-7)  const foo = await myTask({input, store: config.store});  
[](#%5F%5Fcodelineno-1-8)  ...  
[](#%5F%5Fcodelineno-1-9)});  
`

In this guide, we will show how to construct and use a workflow that has a shared memory implemented using the [Store](/langgraphjs/reference/classes/checkpoint.BaseStore.html) interface.

Note

If you need to add cross-thread persistence to a `StateGraph`, check out this [how-to guide](../cross-thread-persistence).

## Setup[¶](#setup "Permanent link")

Note

This guide requires `@langchain/langgraph>=0.2.42`.

First, install the required dependencies for this example:

`[](#%5F%5Fcodelineno-2-1)npm install @langchain/langgraph @langchain/openai @langchain/anthropic @langchain/core uuid
`

Next, we need to set API keys for Anthropic and OpenAI (the LLM and embeddings we will use):

`[](#%5F%5Fcodelineno-3-1)process.env.OPENAI_API_KEY = "YOUR_API_KEY";
[](#%5F%5Fcodelineno-3-2)process.env.ANTHROPIC_API_KEY = "YOUR_API_KEY";
`

Set up [LangSmith](https://smith.langchain.com) for LangGraph development

Sign up for LangSmith to quickly spot issues and improve the performance of your LangGraph projects. LangSmith lets you use trace data to debug, test, and monitor your LLM apps built with LangGraph — read more about how to get started [here](https://docs.smith.langchain.com)

## Example: simple chatbot with long-term memory[¶](#example-simple-chatbot-with-long-term-memory "Permanent link")

### Define store[¶](#define-store "Permanent link")

In this example we will create a workflow that will be able to retrieve information about a user's preferences. We will do so by defining an `InMemoryStore` \- an object that can store data in memory and query that data.

When storing objects using the `Store` interface you define two things:

* the namespace for the object, a tuple (similar to directories)
* the object key (similar to filenames)

In our example, we'll be using `["memories", <user_id>]` as namespace and random UUID as key for each new memory.

Let's first define our store:

`[](#%5F%5Fcodelineno-4-1)import { InMemoryStore } from "@langchain/langgraph";
[](#%5F%5Fcodelineno-4-2)import { OpenAIEmbeddings } from "@langchain/openai";
[](#%5F%5Fcodelineno-4-3)
[](#%5F%5Fcodelineno-4-4)const inMemoryStore = new InMemoryStore({
[](#%5F%5Fcodelineno-4-5)  index: {
[](#%5F%5Fcodelineno-4-6)    embeddings: new OpenAIEmbeddings({
[](#%5F%5Fcodelineno-4-7)      model: "text-embedding-3-small",
[](#%5F%5Fcodelineno-4-8)    }),
[](#%5F%5Fcodelineno-4-9)    dims: 1536,
[](#%5F%5Fcodelineno-4-10)  },
[](#%5F%5Fcodelineno-4-11)});
`

### Create workflow[¶](#create-workflow "Permanent link")

Now let's create our workflow:

`` [](#%5F%5Fcodelineno-5-1)import { v4 } from "uuid";
[](#%5F%5Fcodelineno-5-2)import { ChatAnthropic } from "@langchain/anthropic";
[](#%5F%5Fcodelineno-5-3)import {
[](#%5F%5Fcodelineno-5-4)  entrypoint,
[](#%5F%5Fcodelineno-5-5)  task,
[](#%5F%5Fcodelineno-5-6)  MemorySaver,
[](#%5F%5Fcodelineno-5-7)  addMessages,
[](#%5F%5Fcodelineno-5-8)  type BaseStore,
[](#%5F%5Fcodelineno-5-9)  getStore,
[](#%5F%5Fcodelineno-5-10)} from "@langchain/langgraph";
[](#%5F%5Fcodelineno-5-11)import type { BaseMessage, BaseMessageLike } from "@langchain/core/messages";
[](#%5F%5Fcodelineno-5-12)
[](#%5F%5Fcodelineno-5-13)const model = new ChatAnthropic({
[](#%5F%5Fcodelineno-5-14)  model: "claude-3-5-sonnet-latest",
[](#%5F%5Fcodelineno-5-15)});
[](#%5F%5Fcodelineno-5-16)
[](#%5F%5Fcodelineno-5-17)const callModel = task("callModel", async (
[](#%5F%5Fcodelineno-5-18)  messages: BaseMessage[],
[](#%5F%5Fcodelineno-5-19)  memoryStore: BaseStore,
[](#%5F%5Fcodelineno-5-20)  userId: string
[](#%5F%5Fcodelineno-5-21)) => {
[](#%5F%5Fcodelineno-5-22)  const namespace = ["memories", userId];
[](#%5F%5Fcodelineno-5-23)  const lastMessage = messages.at(-1);
[](#%5F%5Fcodelineno-5-24)  if (typeof lastMessage?.content !== "string") {
[](#%5F%5Fcodelineno-5-25)    throw new Error("Received non-string message content.");
[](#%5F%5Fcodelineno-5-26)  }
[](#%5F%5Fcodelineno-5-27)  const memories = await memoryStore.search(namespace, {
[](#%5F%5Fcodelineno-5-28)    query: lastMessage.content,
[](#%5F%5Fcodelineno-5-29)  });
[](#%5F%5Fcodelineno-5-30)  const info = memories.map((memory) => memory.value.data).join("\n");
[](#%5F%5Fcodelineno-5-31)  const systemMessage = `You are a helpful assistant talking to the user. User info: ${info}`;
[](#%5F%5Fcodelineno-5-32)
[](#%5F%5Fcodelineno-5-33)  // Store new memories if the user asks the model to remember
[](#%5F%5Fcodelineno-5-34)  if (lastMessage.content.toLowerCase().includes("remember")) {
[](#%5F%5Fcodelineno-5-35)    // Hard-coded for demo
[](#%5F%5Fcodelineno-5-36)    const memory = `Username is Bob`;
[](#%5F%5Fcodelineno-5-37)    await memoryStore.put(namespace, v4(), { data: memory });
[](#%5F%5Fcodelineno-5-38)  }
[](#%5F%5Fcodelineno-5-39)  const response = await model.invoke([
[](#%5F%5Fcodelineno-5-40)    {
[](#%5F%5Fcodelineno-5-41)      role: "system",
[](#%5F%5Fcodelineno-5-42)      content: systemMessage 
[](#%5F%5Fcodelineno-5-43)    },
[](#%5F%5Fcodelineno-5-44)    ...messages
[](#%5F%5Fcodelineno-5-45)  ]);
[](#%5F%5Fcodelineno-5-46)  return response;
[](#%5F%5Fcodelineno-5-47)});
[](#%5F%5Fcodelineno-5-48)
[](#%5F%5Fcodelineno-5-49)// NOTE: we're passing the store object here when creating a workflow via entrypoint()
[](#%5F%5Fcodelineno-5-50)const workflow = entrypoint({
[](#%5F%5Fcodelineno-5-51)  checkpointer: new MemorySaver(),
[](#%5F%5Fcodelineno-5-52)  store: inMemoryStore,
[](#%5F%5Fcodelineno-5-53)  name: "workflow",
[](#%5F%5Fcodelineno-5-54)}, async (params: {
[](#%5F%5Fcodelineno-5-55)  messages: BaseMessageLike[];
[](#%5F%5Fcodelineno-5-56)  userId: string;
[](#%5F%5Fcodelineno-5-57)}, config) => {
[](#%5F%5Fcodelineno-5-58)  const messages = addMessages([], params.messages)
[](#%5F%5Fcodelineno-5-59)  const response = await callModel(messages, config.store, params.userId);
[](#%5F%5Fcodelineno-5-60)  return entrypoint.final({
[](#%5F%5Fcodelineno-5-61)    value: response,
[](#%5F%5Fcodelineno-5-62)    save: addMessages(messages, response),
[](#%5F%5Fcodelineno-5-63)  });
[](#%5F%5Fcodelineno-5-64)});
 ``

The current store is passed in as part of the entrypoint's second argument, as `config.store`.

Note

If you're using LangGraph Cloud or LangGraph Studio, you **don't need** to pass store into the entrypoint, since it's done automatically.

### Run the workflow![¶](#run-the-workflow "Permanent link")

Now let's specify a user ID in the config and tell the model our name:

`[](#%5F%5Fcodelineno-6-1)const config = {
[](#%5F%5Fcodelineno-6-2)  configurable: {
[](#%5F%5Fcodelineno-6-3)    thread_id: "1",
[](#%5F%5Fcodelineno-6-4)  },
[](#%5F%5Fcodelineno-6-5)  streamMode: "values" as const,
[](#%5F%5Fcodelineno-6-6)};
[](#%5F%5Fcodelineno-6-7)
[](#%5F%5Fcodelineno-6-8)const inputMessage = {
[](#%5F%5Fcodelineno-6-9)  role: "user",
[](#%5F%5Fcodelineno-6-10)  content: "Hi! Remember: my name is Bob",
[](#%5F%5Fcodelineno-6-11)};
[](#%5F%5Fcodelineno-6-12)
[](#%5F%5Fcodelineno-6-13)const stream = await workflow.stream({ messages: [inputMessage], userId: "1" }, config);
[](#%5F%5Fcodelineno-6-14)
[](#%5F%5Fcodelineno-6-15)for await (const chunk of stream) {
[](#%5F%5Fcodelineno-6-16)  console.log(chunk);
[](#%5F%5Fcodelineno-6-17)}
`

`[](#%5F%5Fcodelineno-7-1)AIMessage {
[](#%5F%5Fcodelineno-7-2)  "id": "msg_01U4xHvf4REPSCGWzpLeh1qJ",
[](#%5F%5Fcodelineno-7-3)  "content": "Hi Bob! Nice to meet you. I'll remember that your name is Bob. How can I help you today?",
[](#%5F%5Fcodelineno-7-4)  "additional_kwargs": {
[](#%5F%5Fcodelineno-7-5)    "id": "msg_01U4xHvf4REPSCGWzpLeh1qJ",
[](#%5F%5Fcodelineno-7-6)    "type": "message",
[](#%5F%5Fcodelineno-7-7)    "role": "assistant",
[](#%5F%5Fcodelineno-7-8)    "model": "claude-3-5-sonnet-20241022",
[](#%5F%5Fcodelineno-7-9)    "stop_reason": "end_turn",
[](#%5F%5Fcodelineno-7-10)    "stop_sequence": null,
[](#%5F%5Fcodelineno-7-11)    "usage": {
[](#%5F%5Fcodelineno-7-12)      "input_tokens": 28,
[](#%5F%5Fcodelineno-7-13)      "cache_creation_input_tokens": 0,
[](#%5F%5Fcodelineno-7-14)      "cache_read_input_tokens": 0,
[](#%5F%5Fcodelineno-7-15)      "output_tokens": 27
[](#%5F%5Fcodelineno-7-16)    }
[](#%5F%5Fcodelineno-7-17)  },
[](#%5F%5Fcodelineno-7-18)  "response_metadata": {
[](#%5F%5Fcodelineno-7-19)    "id": "msg_01U4xHvf4REPSCGWzpLeh1qJ",
[](#%5F%5Fcodelineno-7-20)    "model": "claude-3-5-sonnet-20241022",
[](#%5F%5Fcodelineno-7-21)    "stop_reason": "end_turn",
[](#%5F%5Fcodelineno-7-22)    "stop_sequence": null,
[](#%5F%5Fcodelineno-7-23)    "usage": {
[](#%5F%5Fcodelineno-7-24)      "input_tokens": 28,
[](#%5F%5Fcodelineno-7-25)      "cache_creation_input_tokens": 0,
[](#%5F%5Fcodelineno-7-26)      "cache_read_input_tokens": 0,
[](#%5F%5Fcodelineno-7-27)      "output_tokens": 27
[](#%5F%5Fcodelineno-7-28)    },
[](#%5F%5Fcodelineno-7-29)    "type": "message",
[](#%5F%5Fcodelineno-7-30)    "role": "assistant"
[](#%5F%5Fcodelineno-7-31)  },
[](#%5F%5Fcodelineno-7-32)  "tool_calls": [],
[](#%5F%5Fcodelineno-7-33)  "invalid_tool_calls": [],
[](#%5F%5Fcodelineno-7-34)  "usage_metadata": {
[](#%5F%5Fcodelineno-7-35)    "input_tokens": 28,
[](#%5F%5Fcodelineno-7-36)    "output_tokens": 27,
[](#%5F%5Fcodelineno-7-37)    "total_tokens": 55,
[](#%5F%5Fcodelineno-7-38)    "input_token_details": {
[](#%5F%5Fcodelineno-7-39)      "cache_creation": 0,
[](#%5F%5Fcodelineno-7-40)      "cache_read": 0
[](#%5F%5Fcodelineno-7-41)    }
[](#%5F%5Fcodelineno-7-42)  }
[](#%5F%5Fcodelineno-7-43)}
`

`[](#%5F%5Fcodelineno-8-1)const config2 = {
[](#%5F%5Fcodelineno-8-2)  configurable: {
[](#%5F%5Fcodelineno-8-3)    thread_id: "2",
[](#%5F%5Fcodelineno-8-4)  },
[](#%5F%5Fcodelineno-8-5)  streamMode: "values" as const,
[](#%5F%5Fcodelineno-8-6)};
[](#%5F%5Fcodelineno-8-7)
[](#%5F%5Fcodelineno-8-8)const followupStream = await workflow.stream({
[](#%5F%5Fcodelineno-8-9)  messages: [{
[](#%5F%5Fcodelineno-8-10)    role: "user",
[](#%5F%5Fcodelineno-8-11)    content: "what is my name?",
[](#%5F%5Fcodelineno-8-12)  }],
[](#%5F%5Fcodelineno-8-13)  userId: "1"
[](#%5F%5Fcodelineno-8-14)}, config2);
[](#%5F%5Fcodelineno-8-15)
[](#%5F%5Fcodelineno-8-16)for await (const chunk of followupStream) {
[](#%5F%5Fcodelineno-8-17)  console.log(chunk);
[](#%5F%5Fcodelineno-8-18)}
`

`[](#%5F%5Fcodelineno-9-1)AIMessage {
[](#%5F%5Fcodelineno-9-2)  "id": "msg_01LB4YapkFawBUbpiu3oeWbF",
[](#%5F%5Fcodelineno-9-3)  "content": "Your name is Bob.",
[](#%5F%5Fcodelineno-9-4)  "additional_kwargs": {
[](#%5F%5Fcodelineno-9-5)    "id": "msg_01LB4YapkFawBUbpiu3oeWbF",
[](#%5F%5Fcodelineno-9-6)    "type": "message",
[](#%5F%5Fcodelineno-9-7)    "role": "assistant",
[](#%5F%5Fcodelineno-9-8)    "model": "claude-3-5-sonnet-20241022",
[](#%5F%5Fcodelineno-9-9)    "stop_reason": "end_turn",
[](#%5F%5Fcodelineno-9-10)    "stop_sequence": null,
[](#%5F%5Fcodelineno-9-11)    "usage": {
[](#%5F%5Fcodelineno-9-12)      "input_tokens": 28,
[](#%5F%5Fcodelineno-9-13)      "cache_creation_input_tokens": 0,
[](#%5F%5Fcodelineno-9-14)      "cache_read_input_tokens": 0,
[](#%5F%5Fcodelineno-9-15)      "output_tokens": 8
[](#%5F%5Fcodelineno-9-16)    }
[](#%5F%5Fcodelineno-9-17)  },
[](#%5F%5Fcodelineno-9-18)  "response_metadata": {
[](#%5F%5Fcodelineno-9-19)    "id": "msg_01LB4YapkFawBUbpiu3oeWbF",
[](#%5F%5Fcodelineno-9-20)    "model": "claude-3-5-sonnet-20241022",
[](#%5F%5Fcodelineno-9-21)    "stop_reason": "end_turn",
[](#%5F%5Fcodelineno-9-22)    "stop_sequence": null,
[](#%5F%5Fcodelineno-9-23)    "usage": {
[](#%5F%5Fcodelineno-9-24)      "input_tokens": 28,
[](#%5F%5Fcodelineno-9-25)      "cache_creation_input_tokens": 0,
[](#%5F%5Fcodelineno-9-26)      "cache_read_input_tokens": 0,
[](#%5F%5Fcodelineno-9-27)      "output_tokens": 8
[](#%5F%5Fcodelineno-9-28)    },
[](#%5F%5Fcodelineno-9-29)    "type": "message",
[](#%5F%5Fcodelineno-9-30)    "role": "assistant"
[](#%5F%5Fcodelineno-9-31)  },
[](#%5F%5Fcodelineno-9-32)  "tool_calls": [],
[](#%5F%5Fcodelineno-9-33)  "invalid_tool_calls": [],
[](#%5F%5Fcodelineno-9-34)  "usage_metadata": {
[](#%5F%5Fcodelineno-9-35)    "input_tokens": 28,
[](#%5F%5Fcodelineno-9-36)    "output_tokens": 8,
[](#%5F%5Fcodelineno-9-37)    "total_tokens": 36,
[](#%5F%5Fcodelineno-9-38)    "input_token_details": {
[](#%5F%5Fcodelineno-9-39)      "cache_creation": 0,
[](#%5F%5Fcodelineno-9-40)      "cache_read": 0
[](#%5F%5Fcodelineno-9-41)    }
[](#%5F%5Fcodelineno-9-42)  }
[](#%5F%5Fcodelineno-9-43)}
`

We can now inspect our in-memory store and verify that we have in fact saved the memories for the user: 

`[](#%5F%5Fcodelineno-10-1)const memories = await inMemoryStore.search(["memories", "1"]);
[](#%5F%5Fcodelineno-10-2)for (const memory of memories) {
[](#%5F%5Fcodelineno-10-3)  console.log(memory.value);
[](#%5F%5Fcodelineno-10-4)}
`

`[](#%5F%5Fcodelineno-11-1){ data: 'Username is Bob' }
`

Let's now run the workflow for another user to verify that the memories about the first user are self contained: 

`[](#%5F%5Fcodelineno-12-1)const config3 = {
[](#%5F%5Fcodelineno-12-2)  configurable: {
[](#%5F%5Fcodelineno-12-3)    thread_id: "3",
[](#%5F%5Fcodelineno-12-4)  },
[](#%5F%5Fcodelineno-12-5)  streamMode: "values" as const,
[](#%5F%5Fcodelineno-12-6)};
[](#%5F%5Fcodelineno-12-7)
[](#%5F%5Fcodelineno-12-8)const otherUserStream = await workflow.stream({
[](#%5F%5Fcodelineno-12-9)  messages: [{
[](#%5F%5Fcodelineno-12-10)    role: "user",
[](#%5F%5Fcodelineno-12-11)    content: "what is my name?",
[](#%5F%5Fcodelineno-12-12)  }],
[](#%5F%5Fcodelineno-12-13)  userId: "2"
[](#%5F%5Fcodelineno-12-14)}, config3);
[](#%5F%5Fcodelineno-12-15)
[](#%5F%5Fcodelineno-12-16)for await (const chunk of otherUserStream) {
[](#%5F%5Fcodelineno-12-17)  console.log(chunk);
[](#%5F%5Fcodelineno-12-18)}
`

`[](#%5F%5Fcodelineno-13-1)AIMessage {
[](#%5F%5Fcodelineno-13-2)  "id": "msg_01KK7CweVY4ZdHxU5bPa4skv",
[](#%5F%5Fcodelineno-13-3)  "content": "I don't have any information about your name. While I aim to be helpful, I can only know what you directly tell me during our conversation.",
[](#%5F%5Fcodelineno-13-4)  "additional_kwargs": {
[](#%5F%5Fcodelineno-13-5)    "id": "msg_01KK7CweVY4ZdHxU5bPa4skv",
[](#%5F%5Fcodelineno-13-6)    "type": "message",
[](#%5F%5Fcodelineno-13-7)    "role": "assistant",
[](#%5F%5Fcodelineno-13-8)    "model": "claude-3-5-sonnet-20241022",
[](#%5F%5Fcodelineno-13-9)    "stop_reason": "end_turn",
[](#%5F%5Fcodelineno-13-10)    "stop_sequence": null,
[](#%5F%5Fcodelineno-13-11)    "usage": {
[](#%5F%5Fcodelineno-13-12)      "input_tokens": 25,
[](#%5F%5Fcodelineno-13-13)      "cache_creation_input_tokens": 0,
[](#%5F%5Fcodelineno-13-14)      "cache_read_input_tokens": 0,
[](#%5F%5Fcodelineno-13-15)      "output_tokens": 33
[](#%5F%5Fcodelineno-13-16)    }
[](#%5F%5Fcodelineno-13-17)  },
[](#%5F%5Fcodelineno-13-18)  "response_metadata": {
[](#%5F%5Fcodelineno-13-19)    "id": "msg_01KK7CweVY4ZdHxU5bPa4skv",
[](#%5F%5Fcodelineno-13-20)    "model": "claude-3-5-sonnet-20241022",
[](#%5F%5Fcodelineno-13-21)    "stop_reason": "end_turn",
[](#%5F%5Fcodelineno-13-22)    "stop_sequence": null,
[](#%5F%5Fcodelineno-13-23)    "usage": {
[](#%5F%5Fcodelineno-13-24)      "input_tokens": 25,
[](#%5F%5Fcodelineno-13-25)      "cache_creation_input_tokens": 0,
[](#%5F%5Fcodelineno-13-26)      "cache_read_input_tokens": 0,
[](#%5F%5Fcodelineno-13-27)      "output_tokens": 33
[](#%5F%5Fcodelineno-13-28)    },
[](#%5F%5Fcodelineno-13-29)    "type": "message",
[](#%5F%5Fcodelineno-13-30)    "role": "assistant"
[](#%5F%5Fcodelineno-13-31)  },
[](#%5F%5Fcodelineno-13-32)  "tool_calls": [],
[](#%5F%5Fcodelineno-13-33)  "invalid_tool_calls": [],
[](#%5F%5Fcodelineno-13-34)  "usage_metadata": {
[](#%5F%5Fcodelineno-13-35)    "input_tokens": 25,
[](#%5F%5Fcodelineno-13-36)    "output_tokens": 33,
[](#%5F%5Fcodelineno-13-37)    "total_tokens": 58,
[](#%5F%5Fcodelineno-13-38)    "input_token_details": {
[](#%5F%5Fcodelineno-13-39)      "cache_creation": 0,
[](#%5F%5Fcodelineno-13-40)      "cache_read": 0
[](#%5F%5Fcodelineno-13-41)    }
[](#%5F%5Fcodelineno-13-42)  }
[](#%5F%5Fcodelineno-13-43)}
`

 Was this page helpful? 

 Thanks for your feedback!

 Thanks for your feedback! Please help us improve this page by adding to the discussion below.

 Back to top 

[  Previous  How to add cross-thread persistence to your graph ](../cross-thread-persistence/) [  Next  How to use Postgres checkpointer for persistence ](../persistence-postgres/) 

 Copyright © 2025 LangChain, Inc | [Consent Preferences](#%5F%5Fconsent) 

 Made with[ Material for MkDocs Insiders](https://squidfunk.github.io/mkdocs-material/) 

[ ](https://langchain-ai.github.io/langgraph/ "langchain-ai.github.io") [ ](https://github.com/langchain-ai/langgraphjs "github.com") [ ](https://twitter.com/LangChainAI "twitter.com") 

#### Cookie consent

We use cookies to recognize your repeated visits and preferences, as well as to measure the effectiveness of our documentation and whether users find what they're searching for. **Clicking "Accept" makes our documentation better. Thank you!** ❤️

* Google Analytics
* GitHub

Accept Reject 