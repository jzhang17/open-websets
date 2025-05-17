[ Skip to content](#how-to-add-multi-turn-conversation-in-a-multi-agent-application-functional-api) 

**Help us build the JS tools that power AI apps at companies like Replit, Uber, LinkedIn, GitLab, and more. [Join our team!](https://jobs.ashbyhq.com/langchain/05efa205-8560-43fd-bfcc-3f7697561cfb?utm%5Fsource=https%3A%2F%2Flangchain-ai.github.io%2Flanggraphjs%2F&utm%5Fcampaign=langgraphjs%5Fdocs)** 

[ ![logo](../../static/wordmark_dark.svg) ![logo](../../static/wordmark_light.svg) ](../..) 

 How to add multi-turn conversation in a multi-agent application (functional API) 

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
                              * Multi-agent  
                               Multi-agent  
                                             * [  How to build a multi-agent network ](../multi-agent-network/)  
                                             * [  How to build a multi-agent network (functional API) ](../multi-agent-network-functional/)  
                                             * [  How to add multi-turn conversation in a multi-agent application ](../multi-agent-multi-turn-convo/)  
                                             * How to add multi-turn conversation in a multi-agent application (functional API) [  How to add multi-turn conversation in a multi-agent application (functional API) ](./)  
                                              Table of contents  
                                                               * [  Setup ](#setup)  
                                                               * [  Test multi-turn conversation ](#test-multi-turn-conversation)  
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
* [  Test multi-turn conversation ](#test-multi-turn-conversation)

1. [  LangGraph ](../..)
2. [  Guides ](../)
3. [  How-to Guides ](../)
4. [  LangGraph ](../../how-tos#langgraph)
5. [  Multi-agent ](../multi-agent-network/)

# How to add multi-turn conversation in a multi-agent application (functional API)[¶](#how-to-add-multi-turn-conversation-in-a-multi-agent-application-functional-api "Permanent link")

Prerequisites

This guide assumes familiarity with the following:

* [Multi-agent systems](../../concepts/multi%5Fagent)
* [Human-in-the-loop](../../concepts/human%5Fin%5Fthe%5Floop)
* [Functional API](../../concepts/functional%5Fapi)
* [Command](../../concepts/low%5Flevel/#command)
* [LangGraph Glossary](../../concepts/low%5Flevel/)

In this how-to guide, we’ll build an application that allows an end-user to engage in a _multi-turn conversation_ with one or more agents. We'll create a node that uses an [interrupt](https://langchain-ai.github.io/langgraphjs/reference/functions/langgraph.interrupt-1.html) to collect user input and routes back to the **active** agent.

The agents will be implemented as tasks in a workflow that executes agent steps and determines the next action:

1. **Wait for user input** to continue the conversation, or
2. **Route to another agent** (or back to itself, such as in a loop) via a [**handoff**](../../concepts/multi%5Fagent/#handoffs).

Note

This guide requires `@langchain/langgraph>=0.2.42` and `@langchain/core>=0.3.36`.

## Setup[¶](#setup "Permanent link")

First, install the required dependencies for this example:

`[](#%5F%5Fcodelineno-0-1)npm install @langchain/langgraph @langchain/anthropic @langchain/core uuid zod
`

Next, we need to set API keys for Anthropic (the LLM we will use):

`[](#%5F%5Fcodelineno-1-1)process.env.ANTHROPIC_API_KEY = "YOUR_API_KEY";
`

Set up [LangSmith](https://smith.langchain.com) for LangGraph development

Sign up for LangSmith to quickly spot issues and improve the performance of your LangGraph projects. LangSmith lets you use trace data to debug, test, and monitor your LLM apps built with LangGraph — read more about how to get started [here](https://docs.smith.langchain.com)

In this example we will build a team of travel assistant agents that can communicate with each other.

We will create 2 agents:

* `travelAdvisor`: can help with travel destination recommendations. Can ask `hotelAdvisor` for help.
* `hotelAdvisor`: can help with hotel recommendations. Can ask `travelAdvisor` for help.

This is a fully-connected network - every agent can talk to any other agent. 

`` [](#%5F%5Fcodelineno-2-1)import { tool } from "@langchain/core/tools";
[](#%5F%5Fcodelineno-2-2)import { z } from "zod";
[](#%5F%5Fcodelineno-2-3)
[](#%5F%5Fcodelineno-2-4)// Tool for getting travel recommendations
[](#%5F%5Fcodelineno-2-5)const getTravelRecommendations = tool(async () => {
[](#%5F%5Fcodelineno-2-6)  const destinations = ["aruba", "turks and caicos"];
[](#%5F%5Fcodelineno-2-7)  return destinations[Math.floor(Math.random() * destinations.length)];
[](#%5F%5Fcodelineno-2-8)}, {
[](#%5F%5Fcodelineno-2-9)  name: "getTravelRecommendations",
[](#%5F%5Fcodelineno-2-10)  description: "Get recommendation for travel destinations",
[](#%5F%5Fcodelineno-2-11)  schema: z.object({}),
[](#%5F%5Fcodelineno-2-12)});
[](#%5F%5Fcodelineno-2-13)
[](#%5F%5Fcodelineno-2-14)// Tool for getting hotel recommendations
[](#%5F%5Fcodelineno-2-15)const getHotelRecommendations = tool(async (input: { location: "aruba" | "turks and caicos" }) => {
[](#%5F%5Fcodelineno-2-16)  const recommendations = {
[](#%5F%5Fcodelineno-2-17)    "aruba": [
[](#%5F%5Fcodelineno-2-18)      "The Ritz-Carlton, Aruba (Palm Beach)",
[](#%5F%5Fcodelineno-2-19)      "Bucuti & Tara Beach Resort (Eagle Beach)"
[](#%5F%5Fcodelineno-2-20)    ],
[](#%5F%5Fcodelineno-2-21)    "turks and caicos": ["Grace Bay Club", "COMO Parrot Cay"]
[](#%5F%5Fcodelineno-2-22)  };
[](#%5F%5Fcodelineno-2-23)  return recommendations[input.location];
[](#%5F%5Fcodelineno-2-24)}, {
[](#%5F%5Fcodelineno-2-25)  name: "getHotelRecommendations",
[](#%5F%5Fcodelineno-2-26)  description: "Get hotel recommendations for a given destination.",
[](#%5F%5Fcodelineno-2-27)  schema: z.object({
[](#%5F%5Fcodelineno-2-28)    location: z.enum(["aruba", "turks and caicos"])
[](#%5F%5Fcodelineno-2-29)  }),
[](#%5F%5Fcodelineno-2-30)});
[](#%5F%5Fcodelineno-2-31)
[](#%5F%5Fcodelineno-2-32)// Define a tool to signal intent to hand off to a different agent
[](#%5F%5Fcodelineno-2-33)// Note: this is not using Command(goto) syntax for navigating to different agents:
[](#%5F%5Fcodelineno-2-34)// `workflow()` below handles the handoffs explicitly
[](#%5F%5Fcodelineno-2-35)const transferToHotelAdvisor = tool(async () => {
[](#%5F%5Fcodelineno-2-36)  return "Successfully transferred to hotel advisor";
[](#%5F%5Fcodelineno-2-37)}, {
[](#%5F%5Fcodelineno-2-38)  name: "transferToHotelAdvisor",
[](#%5F%5Fcodelineno-2-39)  description: "Ask hotel advisor agent for help.",
[](#%5F%5Fcodelineno-2-40)  schema: z.object({}),
[](#%5F%5Fcodelineno-2-41)  // Hint to our agent implementation that it should stop
[](#%5F%5Fcodelineno-2-42)  // immediately after invoking this tool 
[](#%5F%5Fcodelineno-2-43)  returnDirect: true,
[](#%5F%5Fcodelineno-2-44)}); 
[](#%5F%5Fcodelineno-2-45)
[](#%5F%5Fcodelineno-2-46)const transferToTravelAdvisor = tool(async () => {
[](#%5F%5Fcodelineno-2-47)  return "Successfully transferred to travel advisor";
[](#%5F%5Fcodelineno-2-48)}, {
[](#%5F%5Fcodelineno-2-49)  name: "transferToTravelAdvisor", 
[](#%5F%5Fcodelineno-2-50)  description: "Ask travel advisor agent for help.",
[](#%5F%5Fcodelineno-2-51)  schema: z.object({}),
[](#%5F%5Fcodelineno-2-52)  // Hint to our agent implementation that it should stop
[](#%5F%5Fcodelineno-2-53)  // immediately after invoking this tool
[](#%5F%5Fcodelineno-2-54)  returnDirect: true,
[](#%5F%5Fcodelineno-2-55)});
 ``

Transfer tools

You might have noticed that we're using `tool(... { returnDirect: true })` in the transfer tools. This is done so that individual agents (e.g., `travelAdvisor`) can exit the ReAct loop early once these tools are called without calling the model a final time to process the result of the tool call. This is the desired behavior, as we want to detect when the agent calls this tool and hand control off _immediately_ to a different agent.

**NOTE**: This is meant to work with the prebuilt [createReactAgent](/langgraphjs/reference/functions/langgraph%5Fprebuilt.createReactAgent.html) \- if you are building a custom agent, make sure to manually add logic for handling early exit for tools that are marked with `returnDirect`.

Let's now create our agents using the the prebuilt [createReactAgent](/langgraphjs/reference/functions/langgraph%5Fprebuilt.createReactAgent.html) and our multi-agent workflow. Note that will be calling [interrupt](/langgraphjs/reference/functions/langgraph.interrupt-1.html) every time after we get the final response from each of the agents.

`` [](#%5F%5Fcodelineno-3-1)import {
[](#%5F%5Fcodelineno-3-2)  AIMessage,
[](#%5F%5Fcodelineno-3-3)  type BaseMessage,
[](#%5F%5Fcodelineno-3-4)  type BaseMessageLike
[](#%5F%5Fcodelineno-3-5)} from "@langchain/core/messages";
[](#%5F%5Fcodelineno-3-6)import { ChatAnthropic } from "@langchain/anthropic";
[](#%5F%5Fcodelineno-3-7)import { createReactAgent } from "@langchain/langgraph/prebuilt";
[](#%5F%5Fcodelineno-3-8)import {
[](#%5F%5Fcodelineno-3-9)  addMessages,
[](#%5F%5Fcodelineno-3-10)  entrypoint,
[](#%5F%5Fcodelineno-3-11)  task,
[](#%5F%5Fcodelineno-3-12)  MemorySaver,
[](#%5F%5Fcodelineno-3-13)  interrupt,
[](#%5F%5Fcodelineno-3-14)} from "@langchain/langgraph";
[](#%5F%5Fcodelineno-3-15)
[](#%5F%5Fcodelineno-3-16)const model = new ChatAnthropic({
[](#%5F%5Fcodelineno-3-17)  model: "claude-3-5-sonnet-latest",
[](#%5F%5Fcodelineno-3-18)});
[](#%5F%5Fcodelineno-3-19)
[](#%5F%5Fcodelineno-3-20)const travelAdvisorTools = [
[](#%5F%5Fcodelineno-3-21)  getTravelRecommendations,
[](#%5F%5Fcodelineno-3-22)  transferToHotelAdvisor,
[](#%5F%5Fcodelineno-3-23)];
[](#%5F%5Fcodelineno-3-24)
[](#%5F%5Fcodelineno-3-25)// Define travel advisor ReAct agent
[](#%5F%5Fcodelineno-3-26)const travelAdvisor = createReactAgent({
[](#%5F%5Fcodelineno-3-27)  llm: model,
[](#%5F%5Fcodelineno-3-28)  tools: travelAdvisorTools,
[](#%5F%5Fcodelineno-3-29)  stateModifier: [
[](#%5F%5Fcodelineno-3-30)    "You are a general travel expert that can recommend travel destinations (e.g. countries, cities, etc).",
[](#%5F%5Fcodelineno-3-31)    "If you need hotel recommendations, ask 'hotel_advisor' for help.",
[](#%5F%5Fcodelineno-3-32)    "You MUST include human-readable response before transferring to another agent.",
[](#%5F%5Fcodelineno-3-33)  ].join(" "),
[](#%5F%5Fcodelineno-3-34)});
[](#%5F%5Fcodelineno-3-35)
[](#%5F%5Fcodelineno-3-36)// You can also add additional logic like changing the input to the agent / output from the agent, etc.
[](#%5F%5Fcodelineno-3-37)// NOTE: we're invoking the ReAct agent with the full history of messages in the state
[](#%5F%5Fcodelineno-3-38)const callTravelAdvisor = task("callTravelAdvisor", async (messages: BaseMessageLike[]) => {
[](#%5F%5Fcodelineno-3-39)  const response = await travelAdvisor.invoke({ messages });
[](#%5F%5Fcodelineno-3-40)  return response.messages;
[](#%5F%5Fcodelineno-3-41)});
[](#%5F%5Fcodelineno-3-42)
[](#%5F%5Fcodelineno-3-43)const hotelAdvisorTools = [
[](#%5F%5Fcodelineno-3-44)  getHotelRecommendations,
[](#%5F%5Fcodelineno-3-45)  transferToTravelAdvisor,
[](#%5F%5Fcodelineno-3-46)];
[](#%5F%5Fcodelineno-3-47)
[](#%5F%5Fcodelineno-3-48)// Define hotel advisor ReAct agent
[](#%5F%5Fcodelineno-3-49)const hotelAdvisor = createReactAgent({
[](#%5F%5Fcodelineno-3-50)  llm: model,
[](#%5F%5Fcodelineno-3-51)  tools: hotelAdvisorTools,
[](#%5F%5Fcodelineno-3-52)  stateModifier: [
[](#%5F%5Fcodelineno-3-53)    "You are a hotel expert that can provide hotel recommendations for a given destination.",
[](#%5F%5Fcodelineno-3-54)    "If you need help picking travel destinations, ask 'travel_advisor' for help.",
[](#%5F%5Fcodelineno-3-55)    "You MUST include a human-readable response before transferring to another agent."
[](#%5F%5Fcodelineno-3-56)  ].join(" "),
[](#%5F%5Fcodelineno-3-57)});
[](#%5F%5Fcodelineno-3-58)
[](#%5F%5Fcodelineno-3-59)// Add task for hotel advisor
[](#%5F%5Fcodelineno-3-60)const callHotelAdvisor = task("callHotelAdvisor", async (messages: BaseMessageLike[]) => {
[](#%5F%5Fcodelineno-3-61)  const response = await hotelAdvisor.invoke({ messages });
[](#%5F%5Fcodelineno-3-62)  return response.messages;
[](#%5F%5Fcodelineno-3-63)});
[](#%5F%5Fcodelineno-3-64)
[](#%5F%5Fcodelineno-3-65)const checkpointer = new MemorySaver();
[](#%5F%5Fcodelineno-3-66)
[](#%5F%5Fcodelineno-3-67)const multiTurnGraph = entrypoint({
[](#%5F%5Fcodelineno-3-68)  name: "multiTurnGraph",
[](#%5F%5Fcodelineno-3-69)  checkpointer,
[](#%5F%5Fcodelineno-3-70)}, async (messages: BaseMessageLike[]) => {  
[](#%5F%5Fcodelineno-3-71)  let callActiveAgent = callTravelAdvisor;
[](#%5F%5Fcodelineno-3-72)  let agentMessages: BaseMessage[];
[](#%5F%5Fcodelineno-3-73)  let currentMessages = messages;
[](#%5F%5Fcodelineno-3-74)  while (true) {
[](#%5F%5Fcodelineno-3-75)    agentMessages = await callActiveAgent(currentMessages);
[](#%5F%5Fcodelineno-3-76)
[](#%5F%5Fcodelineno-3-77)    // Find the last AI message
[](#%5F%5Fcodelineno-3-78)    // If one of the handoff tools is called, the last message returned
[](#%5F%5Fcodelineno-3-79)    // by the agent will be a ToolMessages because we set them to have
[](#%5F%5Fcodelineno-3-80)    // "returnDirect: true". This means that the last AIMessage will
[](#%5F%5Fcodelineno-3-81)    // have tool calls.
[](#%5F%5Fcodelineno-3-82)    // Otherwise, the last returned message will be an AIMessage with
[](#%5F%5Fcodelineno-3-83)    // no tool calls, which means we are ready for new input.
[](#%5F%5Fcodelineno-3-84)    const reversedMessages = [...agentMessages].reverse();
[](#%5F%5Fcodelineno-3-85)    const aiMsgIndex = reversedMessages
[](#%5F%5Fcodelineno-3-86)      .findIndex((m): m is AIMessage => m.getType() === "ai");
[](#%5F%5Fcodelineno-3-87)
[](#%5F%5Fcodelineno-3-88)    const aiMsg: AIMessage = reversedMessages[aiMsgIndex];
[](#%5F%5Fcodelineno-3-89)
[](#%5F%5Fcodelineno-3-90)    // We append all messages up to the last AI message to the current messages.
[](#%5F%5Fcodelineno-3-91)    // This may include ToolMessages (if the handoff tool was called)
[](#%5F%5Fcodelineno-3-92)    const messagesToAdd = reversedMessages.slice(0, aiMsgIndex + 1).reverse();
[](#%5F%5Fcodelineno-3-93)
[](#%5F%5Fcodelineno-3-94)    // Add the agent's responses
[](#%5F%5Fcodelineno-3-95)    currentMessages = addMessages(currentMessages, messagesToAdd);
[](#%5F%5Fcodelineno-3-96)
[](#%5F%5Fcodelineno-3-97)    if (!aiMsg?.tool_calls?.length) {
[](#%5F%5Fcodelineno-3-98)      const userInput = await interrupt("Ready for user input.");
[](#%5F%5Fcodelineno-3-99)      if (typeof userInput !== "string") {
[](#%5F%5Fcodelineno-3-100)        throw new Error("User input must be a string.");
[](#%5F%5Fcodelineno-3-101)      }
[](#%5F%5Fcodelineno-3-102)      if (userInput.toLowerCase() === "done") {
[](#%5F%5Fcodelineno-3-103)        break;
[](#%5F%5Fcodelineno-3-104)      }
[](#%5F%5Fcodelineno-3-105)      currentMessages = addMessages(currentMessages, [{
[](#%5F%5Fcodelineno-3-106)        role: "human",
[](#%5F%5Fcodelineno-3-107)        content: userInput,
[](#%5F%5Fcodelineno-3-108)      }]);
[](#%5F%5Fcodelineno-3-109)      continue;
[](#%5F%5Fcodelineno-3-110)    }
[](#%5F%5Fcodelineno-3-111)
[](#%5F%5Fcodelineno-3-112)    const toolCall = aiMsg.tool_calls.at(-1)!;
[](#%5F%5Fcodelineno-3-113)    if (toolCall.name === "transferToHotelAdvisor") {
[](#%5F%5Fcodelineno-3-114)      callActiveAgent = callHotelAdvisor;
[](#%5F%5Fcodelineno-3-115)    } else if (toolCall.name === "transferToTravelAdvisor") {
[](#%5F%5Fcodelineno-3-116)      callActiveAgent = callTravelAdvisor;
[](#%5F%5Fcodelineno-3-117)    } else {
[](#%5F%5Fcodelineno-3-118)      throw new Error(`Expected transfer tool, got '${toolCall.name}'`);
[](#%5F%5Fcodelineno-3-119)    }
[](#%5F%5Fcodelineno-3-120)  }
[](#%5F%5Fcodelineno-3-121)
[](#%5F%5Fcodelineno-3-122)  return entrypoint.final({
[](#%5F%5Fcodelineno-3-123)    value: agentMessages[agentMessages.length - 1],
[](#%5F%5Fcodelineno-3-124)    save: currentMessages,
[](#%5F%5Fcodelineno-3-125)  });
[](#%5F%5Fcodelineno-3-126)});
 ``

We use a while loop to enable continuous conversation between agents and the user. The loop allows for:

1. Getting agent responses
2. Handling agent-to-agent transfers
3. Collecting user input via interrupts
4. Resuming using special inputs (see `Command` below)

## Test multi-turn conversation[¶](#test-multi-turn-conversation "Permanent link")

Let's test a multi turn conversation with this application.

`` [](#%5F%5Fcodelineno-4-1)import { v4 as uuidv4 } from 'uuid';
[](#%5F%5Fcodelineno-4-2)import { Command } from "@langchain/langgraph";
[](#%5F%5Fcodelineno-4-3)import { isBaseMessage } from "@langchain/core/messages";
[](#%5F%5Fcodelineno-4-4)
[](#%5F%5Fcodelineno-4-5)const threadConfig = {
[](#%5F%5Fcodelineno-4-6)  configurable: { 
[](#%5F%5Fcodelineno-4-7)    thread_id: uuidv4() 
[](#%5F%5Fcodelineno-4-8)  },
[](#%5F%5Fcodelineno-4-9)  streamMode: "updates" as const,
[](#%5F%5Fcodelineno-4-10)};
[](#%5F%5Fcodelineno-4-11)
[](#%5F%5Fcodelineno-4-12)const inputs = [
[](#%5F%5Fcodelineno-4-13)  // 1st round of conversation
[](#%5F%5Fcodelineno-4-14)  [{ role: "user", content: "i wanna go somewhere warm in the caribbean" }],
[](#%5F%5Fcodelineno-4-15)  // Since we're using `interrupt`, we'll need to resume using the Command primitive
[](#%5F%5Fcodelineno-4-16)  // 2nd round of conversation
[](#%5F%5Fcodelineno-4-17)  new Command({
[](#%5F%5Fcodelineno-4-18)    resume: "could you recommend a nice hotel in one of the areas and tell me which area it is."
[](#%5F%5Fcodelineno-4-19)  }),
[](#%5F%5Fcodelineno-4-20)  // 3rd round of conversation
[](#%5F%5Fcodelineno-4-21)  new Command({
[](#%5F%5Fcodelineno-4-22)    resume: "i like the first one. could you recommend something to do near the hotel?"
[](#%5F%5Fcodelineno-4-23)  })
[](#%5F%5Fcodelineno-4-24)];
[](#%5F%5Fcodelineno-4-25)
[](#%5F%5Fcodelineno-4-26)const runConversation = async () => {
[](#%5F%5Fcodelineno-4-27)  for (const [idx, userInput] of inputs.entries()) {
[](#%5F%5Fcodelineno-4-28)    console.log();
[](#%5F%5Fcodelineno-4-29)    console.log(`--- Conversation Turn ${idx + 1} ---`);
[](#%5F%5Fcodelineno-4-30)    console.log();
[](#%5F%5Fcodelineno-4-31)    console.log(`User: ${JSON.stringify(userInput, null, 2)}`);
[](#%5F%5Fcodelineno-4-32)    console.log();
[](#%5F%5Fcodelineno-4-33)
[](#%5F%5Fcodelineno-4-34)    const stream = await multiTurnGraph.stream(
[](#%5F%5Fcodelineno-4-35)      userInput as any,
[](#%5F%5Fcodelineno-4-36)      threadConfig,
[](#%5F%5Fcodelineno-4-37)    );
[](#%5F%5Fcodelineno-4-38)
[](#%5F%5Fcodelineno-4-39)    for await (const update of stream) {
[](#%5F%5Fcodelineno-4-40)      if (update.__metadata__?.cached) {
[](#%5F%5Fcodelineno-4-41)        continue;
[](#%5F%5Fcodelineno-4-42)      }
[](#%5F%5Fcodelineno-4-43)      for (const [nodeId, value] of Object.entries(update)) {
[](#%5F%5Fcodelineno-4-44)        if (Array.isArray(value) && value.length > 0) {
[](#%5F%5Fcodelineno-4-45)          const lastMessage = value.at(-1);
[](#%5F%5Fcodelineno-4-46)          if (isBaseMessage(lastMessage) && lastMessage?.getType() === "ai") {
[](#%5F%5Fcodelineno-4-47)            console.log(`${nodeId}: ${lastMessage.content}`);
[](#%5F%5Fcodelineno-4-48)          }
[](#%5F%5Fcodelineno-4-49)        }
[](#%5F%5Fcodelineno-4-50)      }
[](#%5F%5Fcodelineno-4-51)    }
[](#%5F%5Fcodelineno-4-52)  }
[](#%5F%5Fcodelineno-4-53)};
[](#%5F%5Fcodelineno-4-54)
[](#%5F%5Fcodelineno-4-55)// Execute the conversation
[](#%5F%5Fcodelineno-4-56)try {
[](#%5F%5Fcodelineno-4-57)  await runConversation();
[](#%5F%5Fcodelineno-4-58)} catch (e) {
[](#%5F%5Fcodelineno-4-59)  console.error(e);
[](#%5F%5Fcodelineno-4-60)}
 ``

`[](#%5F%5Fcodelineno-5-1)--- Conversation Turn 1 ---
[](#%5F%5Fcodelineno-5-2)
[](#%5F%5Fcodelineno-5-3)User: [
[](#%5F%5Fcodelineno-5-4)  {
[](#%5F%5Fcodelineno-5-5)    "role": "user",
[](#%5F%5Fcodelineno-5-6)    "content": "i wanna go somewhere warm in the caribbean"
[](#%5F%5Fcodelineno-5-7)  }
[](#%5F%5Fcodelineno-5-8)]
[](#%5F%5Fcodelineno-5-9)
[](#%5F%5Fcodelineno-5-10)callTravelAdvisor: Based on the recommendations, Turks and Caicos would be an excellent choice for your Caribbean getaway! This British Overseas Territory is known for its stunning white-sand beaches, crystal-clear turquoise waters, and year-round warm weather. Grace Bay Beach in Providenciales is consistently rated as one of the world's best beaches.
[](#%5F%5Fcodelineno-5-11)
[](#%5F%5Fcodelineno-5-12)You can enjoy:
[](#%5F%5Fcodelineno-5-13)- World-class snorkeling and diving
[](#%5F%5Fcodelineno-5-14)- Luxury resorts and spas
[](#%5F%5Fcodelineno-5-15)- Fresh seafood cuisine
[](#%5F%5Fcodelineno-5-16)- Water sports like kayaking and paddleboarding
[](#%5F%5Fcodelineno-5-17)- Beautiful coral reefs
[](#%5F%5Fcodelineno-5-18)- Average temperatures between 75-85°F (24-29°C) year-round
[](#%5F%5Fcodelineno-5-19)
[](#%5F%5Fcodelineno-5-20)Would you like me to connect you with our hotel advisor to help you find the perfect place to stay in Turks and Caicos?
[](#%5F%5Fcodelineno-5-21)
[](#%5F%5Fcodelineno-5-22)--- Conversation Turn 2 ---
[](#%5F%5Fcodelineno-5-23)
[](#%5F%5Fcodelineno-5-24)User: {
[](#%5F%5Fcodelineno-5-25)  "resume": "could you recommend a nice hotel in one of the areas and tell me which area it is.",
[](#%5F%5Fcodelineno-5-26)  "goto": []
[](#%5F%5Fcodelineno-5-27)}
[](#%5F%5Fcodelineno-5-28)
[](#%5F%5Fcodelineno-5-29)callHotelAdvisor: I can recommend two excellent options in Turks and Caicos:
[](#%5F%5Fcodelineno-5-30)
[](#%5F%5Fcodelineno-5-31)1. Grace Bay Club - This luxury resort is located on the world-famous Grace Bay Beach in Providenciales (often called "Provo"). This area is the most developed and popular island in Turks and Caicos, known for its 12-mile stretch of pristine beach, excellent restaurants, and shopping. The resort offers all-oceanfront suites and is perfect if you want to be close to amenities while enjoying luxury beachfront accommodations.
[](#%5F%5Fcodelineno-5-32)
[](#%5F%5Fcodelineno-5-33)2. COMO Parrot Cay - This is an exclusive private island resort located on Parrot Cay, a secluded island accessible by boat from Providenciales. This is the ultimate luxury escape if you're looking for privacy and seclusion. The resort is set on 1,000 unspoiled acres with pristine white beaches. This location is perfect for those who want to truly get away from it all while enjoying world-class service and amenities.
[](#%5F%5Fcodelineno-5-34)
[](#%5F%5Fcodelineno-5-35)Would you like more specific information about either of these properties or their locations?
[](#%5F%5Fcodelineno-5-36)
[](#%5F%5Fcodelineno-5-37)--- Conversation Turn 3 ---
[](#%5F%5Fcodelineno-5-38)
[](#%5F%5Fcodelineno-5-39)User: {
[](#%5F%5Fcodelineno-5-40)  "resume": "i like the first one. could you recommend something to do near the hotel?",
[](#%5F%5Fcodelineno-5-41)  "goto": []
[](#%5F%5Fcodelineno-5-42)}
[](#%5F%5Fcodelineno-5-43)
[](#%5F%5Fcodelineno-5-44)callHotelAdvisor: Grace Bay Club is perfectly situated to enjoy many activities in Providenciales! Since the hotel is located on Grace Bay Beach in Provo, here are some excellent activities nearby:
[](#%5F%5Fcodelineno-5-45)
[](#%5F%5Fcodelineno-5-46)1. Beach Activities (right at your doorstep):
[](#%5F%5Fcodelineno-5-47)- Swimming and sunbathing on Grace Bay Beach
[](#%5F%5Fcodelineno-5-48)- Snorkeling right off the beach
[](#%5F%5Fcodelineno-5-49)- Beach walks along the pristine 12-mile stretch
[](#%5F%5Fcodelineno-5-50)
[](#%5F%5Fcodelineno-5-51)2. Within Walking Distance:
[](#%5F%5Fcodelineno-5-52)- Salt Mills Plaza (shopping center with local boutiques and restaurants)
[](#%5F%5Fcodelineno-5-53)- Graceway Gourmet (upscale grocery store)
[](#%5F%5Fcodelineno-5-54)- Several beachfront restaurants and bars
[](#%5F%5Fcodelineno-5-55)
[](#%5F%5Fcodelineno-5-56)3. Very Close By (5-10 minute drive):
[](#%5F%5Fcodelineno-5-57)- Princess Alexandra National Park (great for snorkeling)
[](#%5F%5Fcodelineno-5-58)- Leeward Marina (for boat tours and fishing trips)
[](#%5F%5Fcodelineno-5-59)- Provo Golf Club (18-hole championship golf course)
[](#%5F%5Fcodelineno-5-60)- Thursday Night Fish Fry at Bight Park (local culture and food)
[](#%5F%5Fcodelineno-5-61)
[](#%5F%5Fcodelineno-5-62)4. Water Activities (operators will pick you up):
[](#%5F%5Fcodelineno-5-63)- Snorkeling or diving trips to the barrier reef
[](#%5F%5Fcodelineno-5-64)- Sunset sailing cruises
[](#%5F%5Fcodelineno-5-65)- Half-day trips to Iguana Island
[](#%5F%5Fcodelineno-5-66)- Whale watching (in season - January to April)
[](#%5F%5Fcodelineno-5-67)
[](#%5F%5Fcodelineno-5-68)Would you like me to connect you with our travel advisor for more specific activity recommendations or help with booking any excursions?
`

`[](#%5F%5Fcodelineno-6-1)
`

 Was this page helpful? 

 Thanks for your feedback!

 Thanks for your feedback! Please help us improve this page by adding to the discussion below.

 Back to top 

[  Previous  How to add multi-turn conversation in a multi-agent application ](../multi-agent-multi-turn-convo/) [  Next  How to define graph state ](../define-state/) 

 Copyright © 2025 LangChain, Inc | [Consent Preferences](#%5F%5Fconsent) 

 Made with[ Material for MkDocs Insiders](https://squidfunk.github.io/mkdocs-material/) 

[ ](https://langchain-ai.github.io/langgraph/ "langchain-ai.github.io") [ ](https://github.com/langchain-ai/langgraphjs "github.com") [ ](https://twitter.com/LangChainAI "twitter.com") 

#### Cookie consent

We use cookies to recognize your repeated visits and preferences, as well as to measure the effectiveness of our documentation and whether users find what they're searching for. **Clicking "Accept" makes our documentation better. Thank you!** ❤️

* Google Analytics
* GitHub

Accept Reject 