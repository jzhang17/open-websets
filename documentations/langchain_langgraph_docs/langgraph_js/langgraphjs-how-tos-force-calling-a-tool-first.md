[ Skip to content](#how-to-force-an-agent-to-call-a-tool) 

**Help us build the JS tools that power AI apps at companies like Replit, Uber, LinkedIn, GitLab, and more. [Join our team!](https://jobs.ashbyhq.com/langchain/05efa205-8560-43fd-bfcc-3f7697561cfb?utm%5Fsource=https%3A%2F%2Flangchain-ai.github.io%2Flanggraphjs%2F&utm%5Fcampaign=langgraphjs%5Fdocs)** 

[ ![logo](../../static/wordmark_dark.svg) ![logo](../../static/wordmark_light.svg) ](../..) 

 How to force an agent to call a tool 

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
                              * Tool calling  
                               Tool calling  
                                             * [  Tool calling ](../../how-tos#tool-calling)  
                                             * [  How to call tools using ToolNode ](../tool-calling/)  
                                             * How to force an agent to call a tool [  How to force an agent to call a tool ](./)  
                                              Table of contents  
                                                               * [  Setup ](#setup)  
                                                               * [  Set up the tools ](#set-up-the-tools)  
                                                               * [  Set up the model ](#set-up-the-model)  
                                                               * [  Define the agent state ](#define-the-agent-state)  
                                                               * [  Define the nodes ](#define-the-nodes)  
                                                               * [  Define the graph ](#define-the-graph)  
                                                               * [  Use it! ](#use-it)  
                                             * [  How to handle tool calling errors ](../tool-calling-errors/)  
                                             * [  How to pass runtime values to tools ](../pass-run-time-values-to-tools/)  
                                             * [  How to update graph state from tools ](../update-state-from-tools/)  
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
* [  Set up the tools ](#set-up-the-tools)
* [  Set up the model ](#set-up-the-model)
* [  Define the agent state ](#define-the-agent-state)
* [  Define the nodes ](#define-the-nodes)
* [  Define the graph ](#define-the-graph)
* [  Use it! ](#use-it)

1. [  LangGraph ](../..)
2. [  Guides ](../)
3. [  How-to Guides ](../)
4. [  LangGraph ](../../how-tos#langgraph)
5. [  Tool calling ](../../how-tos#tool-calling)

# How to force an agent to call a tool[¶](#how-to-force-an-agent-to-call-a-tool "Permanent link")

In this example we will build a ReAct agent that **always** calls a certain tool first, before making any plans. In this example, we will create an agent with a search tool. However, at the start we will force the agent to call the search tool (and then let it do whatever it wants after). This is useful when you know you want to execute specific actions in your application but also want the flexibility of letting the LLM follow up on the user's query after going through that fixed sequence.

## Setup[¶](#setup "Permanent link")

First we need to install the packages required

`[](#%5F%5Fcodelineno-0-1)yarn add @langchain/langgraph @langchain/openai @langchain/core
`

Next, we need to set API keys for OpenAI (the LLM we will use). Optionally, we can set API key for [LangSmith tracing](https://smith.langchain.com/), which will give us best-in-class observability.

`[](#%5F%5Fcodelineno-1-1)// process.env.OPENAI_API_KEY = "sk_...";
[](#%5F%5Fcodelineno-1-2)
[](#%5F%5Fcodelineno-1-3)// Optional, add tracing in LangSmith
[](#%5F%5Fcodelineno-1-4)// process.env.LANGCHAIN_API_KEY = "ls__...";
[](#%5F%5Fcodelineno-1-5)// process.env.LANGCHAIN_CALLBACKS_BACKGROUND = "true";
[](#%5F%5Fcodelineno-1-6)process.env.LANGCHAIN_TRACING_V2 = "true";
[](#%5F%5Fcodelineno-1-7)process.env.LANGCHAIN_PROJECT = "Force Calling a Tool First: LangGraphJS";
`

`[](#%5F%5Fcodelineno-2-1)Force Calling a Tool First: LangGraphJS
`

## Set up the tools[¶](#set-up-the-tools "Permanent link")

We will first define the tools we want to use. For this simple example, we will use a built-in search tool via Tavily. However, it is really easy to create your own tools - see documentation[here](https://js.langchain.com/docs/modules/agents/tools/dynamic) on how to do that.

`[](#%5F%5Fcodelineno-3-1)import { DynamicStructuredTool } from "@langchain/core/tools";
[](#%5F%5Fcodelineno-3-2)import { z } from "zod";
[](#%5F%5Fcodelineno-3-3)
[](#%5F%5Fcodelineno-3-4)const searchTool = new DynamicStructuredTool({
[](#%5F%5Fcodelineno-3-5)  name: "search",
[](#%5F%5Fcodelineno-3-6)  description:
[](#%5F%5Fcodelineno-3-7)    "Use to surf the web, fetch current information, check the weather, and retrieve other information.",
[](#%5F%5Fcodelineno-3-8)  schema: z.object({
[](#%5F%5Fcodelineno-3-9)    query: z.string().describe("The query to use in your search."),
[](#%5F%5Fcodelineno-3-10)  }),
[](#%5F%5Fcodelineno-3-11)  func: async ({}: { query: string }) => {
[](#%5F%5Fcodelineno-3-12)    // This is a placeholder for the actual implementation
[](#%5F%5Fcodelineno-3-13)    return "Cold, with a low of 13 ℃";
[](#%5F%5Fcodelineno-3-14)  },
[](#%5F%5Fcodelineno-3-15)});
[](#%5F%5Fcodelineno-3-16)
[](#%5F%5Fcodelineno-3-17)await searchTool.invoke({ query: "What's the weather like?" });
[](#%5F%5Fcodelineno-3-18)
[](#%5F%5Fcodelineno-3-19)const tools = [searchTool];
`

We can now wrap these tools in a `ToolNode`. This is a prebuilt node that takes in a LangChain chat model's generated tool call and calls that tool, returning the output.

`[](#%5F%5Fcodelineno-4-1)import { ToolNode } from "@langchain/langgraph/prebuilt";
[](#%5F%5Fcodelineno-4-2)
[](#%5F%5Fcodelineno-4-3)const toolNode = new ToolNode(tools);
`

## Set up the model[¶](#set-up-the-model "Permanent link")

Now we need to load the chat model we want to use.\\ Importantly, this should satisfy two criteria:

1. It should work with messages. We will represent all agent state in the form of messages, so it needs to be able to work well with them.
2. It should work with OpenAI function calling. This means it should either be an OpenAI model or a model that exposes a similar interface.

Note: these model requirements are not requirements for using LangGraph - they are just requirements for this one example.

`[](#%5F%5Fcodelineno-5-1)import { ChatOpenAI } from "@langchain/openai";
[](#%5F%5Fcodelineno-5-2)
[](#%5F%5Fcodelineno-5-3)const model = new ChatOpenAI({
[](#%5F%5Fcodelineno-5-4)  temperature: 0,
[](#%5F%5Fcodelineno-5-5)  model: "gpt-4o",
[](#%5F%5Fcodelineno-5-6)});
`

After we've done this, we should make sure the model knows that it has these tools available to call. We can do this by converting the LangChain tools into the format for OpenAI function calling, and then bind them to the model class.

`[](#%5F%5Fcodelineno-6-1)const boundModel = model.bindTools(tools);
`

## Define the agent state[¶](#define-the-agent-state "Permanent link")

The main type of graph in `langgraph` is the `StateGraph`. This graph is parameterized by a state object that it passes around to each node. Each node then returns operations to update that state.

For this example, the state we will track will just be a list of messages. We want each node to just add messages to that list. Therefore, we will define the agent state as an object with one key (`messages`) with the value specifying how to update the state.

`[](#%5F%5Fcodelineno-7-1)import { Annotation } from "@langchain/langgraph";
[](#%5F%5Fcodelineno-7-2)import { BaseMessage } from "@langchain/core/messages";
[](#%5F%5Fcodelineno-7-3)
[](#%5F%5Fcodelineno-7-4)const AgentState = Annotation.Root({
[](#%5F%5Fcodelineno-7-5)  messages: Annotation<BaseMessage[]>({
[](#%5F%5Fcodelineno-7-6)    reducer: (x, y) => x.concat(y),
[](#%5F%5Fcodelineno-7-7)  }),
[](#%5F%5Fcodelineno-7-8)});
`

## Define the nodes[¶](#define-the-nodes "Permanent link")

We now need to define a few different nodes in our graph. In `langgraph`, a node can be either a function or a[runnable](https://js.langchain.com/docs/expression%5Flanguage/). There are two main nodes we need for this:

1. The agent: responsible for deciding what (if any) actions to take.
2. A function to invoke tools: if the agent decides to take an action, this node will then execute that action.

We will also need to define some edges. Some of these edges may be conditional. The reason they are conditional is that based on the output of a node, one of several paths may be taken. The path that is taken is not known until that node is run (the LLM decides).

1. Conditional Edge: after the agent is called, we should either: a. If the agent said to take an action, then the function to invoke tools should be called\\ b. If the agent said that it was finished, then it should finish
2. Normal Edge: after the tools are invoked, it should always go back to the agent to decide what to do next

Let's define the nodes, as well as a function to decide how what conditional edge to take.

`[](#%5F%5Fcodelineno-8-1)import { AIMessage, AIMessageChunk } from "@langchain/core/messages";
[](#%5F%5Fcodelineno-8-2)import { RunnableConfig } from "@langchain/core/runnables";
[](#%5F%5Fcodelineno-8-3)import { concat } from "@langchain/core/utils/stream";
[](#%5F%5Fcodelineno-8-4)
[](#%5F%5Fcodelineno-8-5)// Define logic that will be used to determine which conditional edge to go down
[](#%5F%5Fcodelineno-8-6)const shouldContinue = (state: typeof AgentState.State) => {
[](#%5F%5Fcodelineno-8-7)  const { messages } = state;
[](#%5F%5Fcodelineno-8-8)  const lastMessage = messages[messages.length - 1] as AIMessage;
[](#%5F%5Fcodelineno-8-9)  // If there is no function call, then we finish
[](#%5F%5Fcodelineno-8-10)  if (!lastMessage.tool_calls || lastMessage.tool_calls.length === 0) {
[](#%5F%5Fcodelineno-8-11)    return "end";
[](#%5F%5Fcodelineno-8-12)  }
[](#%5F%5Fcodelineno-8-13)  // Otherwise if there is, we continue
[](#%5F%5Fcodelineno-8-14)  return "continue";
[](#%5F%5Fcodelineno-8-15)};
[](#%5F%5Fcodelineno-8-16)
[](#%5F%5Fcodelineno-8-17)// Define the function that calls the model
[](#%5F%5Fcodelineno-8-18)const callModel = async (
[](#%5F%5Fcodelineno-8-19)  state: typeof AgentState.State,
[](#%5F%5Fcodelineno-8-20)  config?: RunnableConfig,
[](#%5F%5Fcodelineno-8-21)) => {
[](#%5F%5Fcodelineno-8-22)  const { messages } = state;
[](#%5F%5Fcodelineno-8-23)  let response: AIMessageChunk | undefined;
[](#%5F%5Fcodelineno-8-24)  for await (const message of await boundModel.stream(messages, config)) {
[](#%5F%5Fcodelineno-8-25)    if (!response) {
[](#%5F%5Fcodelineno-8-26)      response = message;
[](#%5F%5Fcodelineno-8-27)    } else {
[](#%5F%5Fcodelineno-8-28)      response = concat(response, message);
[](#%5F%5Fcodelineno-8-29)    }
[](#%5F%5Fcodelineno-8-30)  }
[](#%5F%5Fcodelineno-8-31)  // We return an object, because this will get added to the existing list
[](#%5F%5Fcodelineno-8-32)  return {
[](#%5F%5Fcodelineno-8-33)    messages: response ? [response as AIMessage] : [],
[](#%5F%5Fcodelineno-8-34)  };
[](#%5F%5Fcodelineno-8-35)};
`

**MODIFICATION**

Here we create a node that returns an AIMessage with a tool call - we will use this at the start to force it call a tool

`[](#%5F%5Fcodelineno-9-1)// This is the new first - the first call of the model we want to explicitly hard-code some action
[](#%5F%5Fcodelineno-9-2)const firstModel = async (state: typeof AgentState.State) => {
[](#%5F%5Fcodelineno-9-3)  const humanInput = state.messages[state.messages.length - 1].content || "";
[](#%5F%5Fcodelineno-9-4)  return {
[](#%5F%5Fcodelineno-9-5)    messages: [
[](#%5F%5Fcodelineno-9-6)      new AIMessage({
[](#%5F%5Fcodelineno-9-7)        content: "",
[](#%5F%5Fcodelineno-9-8)        tool_calls: [
[](#%5F%5Fcodelineno-9-9)          {
[](#%5F%5Fcodelineno-9-10)            name: "search",
[](#%5F%5Fcodelineno-9-11)            args: {
[](#%5F%5Fcodelineno-9-12)              query: humanInput,
[](#%5F%5Fcodelineno-9-13)            },
[](#%5F%5Fcodelineno-9-14)            id: "tool_abcd123",
[](#%5F%5Fcodelineno-9-15)          },
[](#%5F%5Fcodelineno-9-16)        ],
[](#%5F%5Fcodelineno-9-17)      }),
[](#%5F%5Fcodelineno-9-18)    ],
[](#%5F%5Fcodelineno-9-19)  };
[](#%5F%5Fcodelineno-9-20)};
`

## Define the graph[¶](#define-the-graph "Permanent link")

We can now put it all together and define the graph!

**MODIFICATION**

We will define a `firstModel` node which we will set as the entrypoint.

`` [](#%5F%5Fcodelineno-10-1)import { END, START, StateGraph } from "@langchain/langgraph";
[](#%5F%5Fcodelineno-10-2)
[](#%5F%5Fcodelineno-10-3)// Define a new graph
[](#%5F%5Fcodelineno-10-4)const workflow = new StateGraph(AgentState)
[](#%5F%5Fcodelineno-10-5)  // Define the new entrypoint
[](#%5F%5Fcodelineno-10-6)  .addNode("first_agent", firstModel)
[](#%5F%5Fcodelineno-10-7)  // Define the two nodes we will cycle between
[](#%5F%5Fcodelineno-10-8)  .addNode("agent", callModel)
[](#%5F%5Fcodelineno-10-9)  .addNode("action", toolNode)
[](#%5F%5Fcodelineno-10-10)  // Set the entrypoint as `first_agent`
[](#%5F%5Fcodelineno-10-11)  // by creating an edge from the virtual __start__ node to `first_agent`
[](#%5F%5Fcodelineno-10-12)  .addEdge(START, "first_agent")
[](#%5F%5Fcodelineno-10-13)  // We now add a conditional edge
[](#%5F%5Fcodelineno-10-14)  .addConditionalEdges(
[](#%5F%5Fcodelineno-10-15)    // First, we define the start node. We use `agent`.
[](#%5F%5Fcodelineno-10-16)    // This means these are the edges taken after the `agent` node is called.
[](#%5F%5Fcodelineno-10-17)    "agent",
[](#%5F%5Fcodelineno-10-18)    // Next, we pass in the function that will determine which node is called next.
[](#%5F%5Fcodelineno-10-19)    shouldContinue,
[](#%5F%5Fcodelineno-10-20)    // Finally we pass in a mapping.
[](#%5F%5Fcodelineno-10-21)    // The keys are strings, and the values are other nodes.
[](#%5F%5Fcodelineno-10-22)    // END is a special node marking that the graph should finish.
[](#%5F%5Fcodelineno-10-23)    // What will happen is we will call `should_continue`, and then the output of that
[](#%5F%5Fcodelineno-10-24)    // will be matched against the keys in this mapping.
[](#%5F%5Fcodelineno-10-25)    // Based on which one it matches, that node will then be called.
[](#%5F%5Fcodelineno-10-26)    {
[](#%5F%5Fcodelineno-10-27)      // If `tools`, then we call the tool node.
[](#%5F%5Fcodelineno-10-28)      continue: "action",
[](#%5F%5Fcodelineno-10-29)      // Otherwise we finish.
[](#%5F%5Fcodelineno-10-30)      end: END,
[](#%5F%5Fcodelineno-10-31)    },
[](#%5F%5Fcodelineno-10-32)  )
[](#%5F%5Fcodelineno-10-33)  // We now add a normal edge from `tools` to `agent`.
[](#%5F%5Fcodelineno-10-34)  // This means that after `tools` is called, `agent` node is called next.
[](#%5F%5Fcodelineno-10-35)  .addEdge("action", "agent")
[](#%5F%5Fcodelineno-10-36)  // After we call the first agent, we know we want to go to action
[](#%5F%5Fcodelineno-10-37)  .addEdge("first_agent", "action");
[](#%5F%5Fcodelineno-10-38)
[](#%5F%5Fcodelineno-10-39)// Finally, we compile it!
[](#%5F%5Fcodelineno-10-40)// This compiles it into a LangChain Runnable,
[](#%5F%5Fcodelineno-10-41)// meaning you can use it as you would any other runnable
[](#%5F%5Fcodelineno-10-42)const app = workflow.compile();
 ``

## Use it![¶](#use-it "Permanent link")

We can now use it! This now exposes the[same interface](https://js.langchain.com/docs/expression%5Flanguage/) as all other LangChain runnables.

`[](#%5F%5Fcodelineno-11-1)import { HumanMessage } from "@langchain/core/messages";
[](#%5F%5Fcodelineno-11-2)
[](#%5F%5Fcodelineno-11-3)const inputs = {
[](#%5F%5Fcodelineno-11-4)  messages: [new HumanMessage("what is the weather in sf")],
[](#%5F%5Fcodelineno-11-5)};
[](#%5F%5Fcodelineno-11-6)
[](#%5F%5Fcodelineno-11-7)for await (const output of await app.stream(inputs)) {
[](#%5F%5Fcodelineno-11-8)  console.log(output);
[](#%5F%5Fcodelineno-11-9)  console.log("-----\n");
[](#%5F%5Fcodelineno-11-10)}
`

`[](#%5F%5Fcodelineno-12-1){
[](#%5F%5Fcodelineno-12-2)  first_agent: {
[](#%5F%5Fcodelineno-12-3)    messages: [
[](#%5F%5Fcodelineno-12-4)      AIMessage {
[](#%5F%5Fcodelineno-12-5)        "content": "",
[](#%5F%5Fcodelineno-12-6)        "additional_kwargs": {},
[](#%5F%5Fcodelineno-12-7)        "response_metadata": {},
[](#%5F%5Fcodelineno-12-8)        "tool_calls": [
[](#%5F%5Fcodelineno-12-9)          {
[](#%5F%5Fcodelineno-12-10)            "name": "search",
[](#%5F%5Fcodelineno-12-11)            "args": {
[](#%5F%5Fcodelineno-12-12)              "query": "what is the weather in sf"
[](#%5F%5Fcodelineno-12-13)            },
[](#%5F%5Fcodelineno-12-14)            "id": "tool_abcd123"
[](#%5F%5Fcodelineno-12-15)          }
[](#%5F%5Fcodelineno-12-16)        ],
[](#%5F%5Fcodelineno-12-17)        "invalid_tool_calls": []
[](#%5F%5Fcodelineno-12-18)      }
[](#%5F%5Fcodelineno-12-19)    ]
[](#%5F%5Fcodelineno-12-20)  }
[](#%5F%5Fcodelineno-12-21)}
[](#%5F%5Fcodelineno-12-22)-----
[](#%5F%5Fcodelineno-12-23)
[](#%5F%5Fcodelineno-12-24){
[](#%5F%5Fcodelineno-12-25)  action: {
[](#%5F%5Fcodelineno-12-26)    messages: [
[](#%5F%5Fcodelineno-12-27)      ToolMessage {
[](#%5F%5Fcodelineno-12-28)        "content": "Cold, with a low of 13 ℃",
[](#%5F%5Fcodelineno-12-29)        "name": "search",
[](#%5F%5Fcodelineno-12-30)        "additional_kwargs": {},
[](#%5F%5Fcodelineno-12-31)        "response_metadata": {},
[](#%5F%5Fcodelineno-12-32)        "tool_call_id": "tool_abcd123"
[](#%5F%5Fcodelineno-12-33)      }
[](#%5F%5Fcodelineno-12-34)    ]
[](#%5F%5Fcodelineno-12-35)  }
[](#%5F%5Fcodelineno-12-36)}
[](#%5F%5Fcodelineno-12-37)-----
[](#%5F%5Fcodelineno-12-38)
[](#%5F%5Fcodelineno-12-39){
[](#%5F%5Fcodelineno-12-40)  agent: {
[](#%5F%5Fcodelineno-12-41)    messages: [
[](#%5F%5Fcodelineno-12-42)      AIMessageChunk {
[](#%5F%5Fcodelineno-12-43)        "id": "chatcmpl-9y562g16z0MUNBJcS6nKMsDuFMRsS",
[](#%5F%5Fcodelineno-12-44)        "content": "The current weather in San Francisco is cold, with a low of 13°C.",
[](#%5F%5Fcodelineno-12-45)        "additional_kwargs": {},
[](#%5F%5Fcodelineno-12-46)        "response_metadata": {
[](#%5F%5Fcodelineno-12-47)          "prompt": 0,
[](#%5F%5Fcodelineno-12-48)          "completion": 0,
[](#%5F%5Fcodelineno-12-49)          "finish_reason": "stop",
[](#%5F%5Fcodelineno-12-50)          "system_fingerprint": "fp_3aa7262c27fp_3aa7262c27fp_3aa7262c27fp_3aa7262c27fp_3aa7262c27fp_3aa7262c27fp_3aa7262c27fp_3aa7262c27fp_3aa7262c27fp_3aa7262c27fp_3aa7262c27fp_3aa7262c27fp_3aa7262c27fp_3aa7262c27fp_3aa7262c27fp_3aa7262c27fp_3aa7262c27fp_3aa7262c27fp_3aa7262c27"
[](#%5F%5Fcodelineno-12-51)        },
[](#%5F%5Fcodelineno-12-52)        "tool_calls": [],
[](#%5F%5Fcodelineno-12-53)        "tool_call_chunks": [],
[](#%5F%5Fcodelineno-12-54)        "invalid_tool_calls": [],
[](#%5F%5Fcodelineno-12-55)        "usage_metadata": {
[](#%5F%5Fcodelineno-12-56)          "input_tokens": 104,
[](#%5F%5Fcodelineno-12-57)          "output_tokens": 18,
[](#%5F%5Fcodelineno-12-58)          "total_tokens": 122
[](#%5F%5Fcodelineno-12-59)        }
[](#%5F%5Fcodelineno-12-60)      }
[](#%5F%5Fcodelineno-12-61)    ]
[](#%5F%5Fcodelineno-12-62)  }
[](#%5F%5Fcodelineno-12-63)}
[](#%5F%5Fcodelineno-12-64)-----
`

 Was this page helpful? 

 Thanks for your feedback!

 Thanks for your feedback! Please help us improve this page by adding to the discussion below.

 Back to top 

[  Previous  How to call tools using ToolNode ](../tool-calling/) [  Next  How to handle tool calling errors ](../tool-calling-errors/) 

 Copyright © 2025 LangChain, Inc | [Consent Preferences](#%5F%5Fconsent) 

 Made with[ Material for MkDocs Insiders](https://squidfunk.github.io/mkdocs-material/) 

[ ](https://langchain-ai.github.io/langgraph/ "langchain-ai.github.io") [ ](https://github.com/langchain-ai/langgraphjs "github.com") [ ](https://twitter.com/LangChainAI "twitter.com") 

#### Cookie consent

We use cookies to recognize your repeated visits and preferences, as well as to measure the effectiveness of our documentation and whether users find what they're searching for. **Clicking "Accept" makes our documentation better. Thank you!** ❤️

* Google Analytics
* GitHub

Accept Reject 