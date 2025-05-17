[Skip to content](#how-to-build-a-multi-agent-network-functional-api)

**Help us build the JS tools that power AI apps at companies like Replit, Uber, LinkedIn, GitLab, and more. [Join our team!](https://jobs.ashbyhq.com/langchain/05efa205-8560-43fd-bfcc-3f7697561cfb?utm_source=https%3A%2F%2Flangchain-ai.github.io%2Flanggraphjs%2F&utm_campaign=langgraphjs_docs)**

[![logo](../../static/wordmark_dark.svg)
![logo](../../static/wordmark_light.svg)](../..)

How to build a multi-agent network (functional API)

Initializing search

[GitHub](https://github.com/langchain-ai/langgraphjs "Go to repository")

* [LangGraph](../..)
* [Agents](../../agents/overview/)
* [API reference](../../reference/)
* [Versions](../../versions/)

[![logo](../../static/wordmark_dark.svg)
![logo](../../static/wordmark_light.svg)](../..)

[GitHub](https://github.com/langchain-ai/langgraphjs "Go to repository")

* [LangGraph](../..)

  LangGraph
  + Get started

    Get started
    - [Learn the basics](../../tutorials/quickstart/)
    - [Deployment](../../tutorials/deployment/)
  + Guides

    Guides
    - [How-to Guides](../)

      How-to Guides
      * [Installation](../../how-tos#installation)
      * LangGraph

        LangGraph
        + [LangGraph](../../how-tos#langgraph)
        + [Controllability](../../how-tos#controllability)
        + [Persistence](../../how-tos#persistence)
        + [Memory](../../how-tos#memory)
        + [Human-in-the-loop](../../how-tos#human-in-the-loop)
        + [Streaming](../../how-tos#streaming)
        + [Tool calling](../../how-tos#tool-calling)
        + [Subgraphs](../../how-tos#subgraphs)
        + Multi-agent

          Multi-agent
          - [How to build a multi-agent network](../multi-agent-network/)
          - How to build a multi-agent network (functional API)

            [How to build a multi-agent network (functional API)](./)

            Table of contents
            * [Setup](#setup)
            * [Travel agent example](#travel-agent-example)
          - [How to add multi-turn conversation in a multi-agent application](../multi-agent-multi-turn-convo/)
          - [How to add multi-turn conversation in a multi-agent application (functional API)](../multi-agent-multi-turn-convo-functional/)
        + [State Management](../../how-tos#state-management)
        + [Other](../../how-tos#other)
        + [Prebuilt ReAct Agent](../../how-tos#prebuilt-react-agent)
      * [LangGraph Platform](../../how-tos#langgraph-platform)
    - [Concepts](../../concepts/)
    - [Tutorials](../../tutorials/)
  + Resources

    Resources
    - [Adopters](../../adopters/)
    - [LLMS-txt](../../llms-txt-overview/)
    - [FAQ](../../concepts/faq/)
    - [Troubleshooting](../../troubleshooting/errors/)
    - [LangGraph Academy Course](https://academy.langchain.com/courses/intro-to-langgraph)
* [Agents](../../agents/overview/)
* [API reference](../../reference/)
* [Versions](../../versions/)

Table of contents

* [Setup](#setup)
* [Travel agent example](#travel-agent-example)

1. [LangGraph](../..)
2. [Guides](../)
3. [How-to Guides](../)
4. [LangGraph](../../how-tos#langgraph)
5. [Multi-agent](../multi-agent-network/)

# How to build a multi-agent network (functional API)[¶](#how-to-build-a-multi-agent-network-functional-api "Permanent link")

Prerequisites

This guide assumes familiarity with the following:

* [Multi-agent systems](../../concepts/multi_agent)
* [Functional API](../../concepts/functional_api)
* [Command](../../concepts/low_level/#command)
* [LangGraph Glossary](../../concepts/low_level/)

In this how-to guide we will demonstrate how to implement a [multi-agent network](../../concepts/multi_agent#network) architecture where each agent can communicate with every other agent (many-to-many connections) and can decide which agent to call next. We will be using LangGraph's [functional API](../../concepts/functional_api) — individual agents will be defined as tasks and the agent handoffs will be defined in the main [entrypoint()](/langgraphjs/reference/functions/langgraph.entrypoint-1.html):

```
import { entrypoint, task } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { tool } from "@langchain/core/tools";
import { z } from "zod";

// Define a tool to signal intent to hand off to a different agent
const transferToHotelAdvisor = tool(async () => {
  return "Successfully transferred to hotel advisor";
}, {
  name: "transferToHotelAdvisor",
  description: "Ask hotel advisor agent for help.",
  schema: z.object({}),
  returnDirect: true,
});

// define an agent
const travelAdvisorTools = [transferToHotelAdvisor, ...];
const travelAdvisor = createReactAgent({
  llm: model,
  tools: travelAdvisorTools,
});

// define a task that calls an agent
const callTravelAdvisor = task("callTravelAdvisor", async (messages: BaseMessage[]) => {
  const response = travelAdvisor.invoke({ messages });
  return response.messages;
});

const networkGraph = entrypoint(
  { name: "networkGraph" },
  async (messages: BaseMessageLike[]) => {
    let callActiveAgent = callTravelAdvisor;
    let agentMessages;
    while (true) {
      agentMessages = await callActiveAgent(messages);
      messages = addMessages(messages, agentMessages);
      callActiveAgent = getNextAgent(messages);
    }
    return messages;
  });

```

## Setup[¶](#setup "Permanent link")

Note

This guide requires `@langchain/langgraph>=0.2.42`.

First, install the required dependencies for this example:

```
npm install @langchain/langgraph @langchain/anthropic @langchain/core zod

```

Next, we need to set API keys for Anthropic (the LLM we will use):

```
process.env.ANTHROPIC_API_KEY = "YOUR_API_KEY";

```

Set up [LangSmith](https://smith.langchain.com) for LangGraph development

Sign up for LangSmith to quickly spot issues and improve the performance of your LangGraph projects. LangSmith lets you use trace data to debug, test, and monitor your LLM apps built with LangGraph — read more about how to get started [here](https://docs.smith.langchain.com)

## Travel agent example[¶](#travel-agent-example "Permanent link")

In this example we will build a team of travel assistant agents that can communicate with each other.

We will create 2 agents:

* `travelAdvisor`: can help with travel destination recommendations. Can ask `hotelAdvisor` for help.
* `hotelAdvisor`: can help with hotel recommendations. Can ask `travelAdvisor` for help.

This is a fully-connected network - every agent can talk to any other agent.

First, let's create some of the tools that the agents will be using:

```
import { tool } from "@langchain/core/tools";
import { z } from "zod";

// Tool for getting travel recommendations
const getTravelRecommendations = tool(async () => {
  const destinations = ["aruba", "turks and caicos"];
  return destinations[Math.floor(Math.random() * destinations.length)];
}, {
  name: "getTravelRecommendations",
  description: "Get recommendation for travel destinations",
  schema: z.object({}),
});

// Tool for getting hotel recommendations
const getHotelRecommendations = tool(async (input: { location: "aruba" | "turks and caicos" }) => {
  const recommendations = {
    "aruba": [
      "The Ritz-Carlton, Aruba (Palm Beach)",
      "Bucuti & Tara Beach Resort (Eagle Beach)"
    ],
    "turks and caicos": ["Grace Bay Club", "COMO Parrot Cay"]
  };
  return recommendations[input.location];
}, {
  name: "getHotelRecommendations",
  description: "Get hotel recommendations for a given destination.",
  schema: z.object({
    location: z.enum(["aruba", "turks and caicos"])
  }),
});

// Define a tool to signal intent to hand off to a different agent
// Note: this is not using Command(goto) syntax for navigating to different agents:
// `workflow()` below handles the handoffs explicitly
const transferToHotelAdvisor = tool(async () => {
  return "Successfully transferred to hotel advisor";
}, {
  name: "transferToHotelAdvisor",
  description: "Ask hotel advisor agent for help.",
  schema: z.object({}),
  // Hint to our agent implementation that it should stop
  // immediately after invoking this tool
  returnDirect: true,
});

const transferToTravelAdvisor = tool(async () => {
  return "Successfully transferred to travel advisor";
}, {
  name: "transferToTravelAdvisor",
  description: "Ask travel advisor agent for help.",
  schema: z.object({}),
  // Hint to our agent implementation that it should stop
  // immediately after invoking this tool
  returnDirect: true,
});

```

Transfer tools

You might have noticed that we're using `tool(... { returnDirect: true })` in the transfer tools. This is done so that individual agents (e.g., `travelAdvisor`) can exit the ReAct loop early once these tools are called without calling the model a final time to process the result of the tool call. This is the desired behavior, as we want to detect when the agent calls this tool and hand control off *immediately* to a different agent.

**NOTE**: This is meant to work with the prebuilt [`createReactAgent`](/langgraphjs/reference/functions/langgraph_prebuilt.createReactAgent.html) - if you are building a custom agent, make sure to manually add logic for handling early exit for tools that are marked with `returnDirect`.

Now let's define our agent tasks and combine them into a single multi-agent network workflow:

```
import {
  AIMessage,
  type BaseMessageLike
} from "@langchain/core/messages";
import { ChatAnthropic } from "@langchain/anthropic";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import {
  addMessages,
  entrypoint,
  task,
} from "@langchain/langgraph";

const model = new ChatAnthropic({
  model: "claude-3-5-sonnet-latest",
});

const travelAdvisorTools = [
  getTravelRecommendations,
  transferToHotelAdvisor,
];

// Define travel advisor ReAct agent
const travelAdvisor = createReactAgent({
  llm: model,
  tools: travelAdvisorTools,
  stateModifier: [
    "You are a general travel expert that can recommend travel destinations (e.g. countries, cities, etc).",
    "If you need hotel recommendations, ask 'hotel_advisor' for help.",
    "You MUST include human-readable response before transferring to another agent.",
  ].join(" "),
});

// You can also add additional logic like changing the input to the agent / output from the agent, etc.
// NOTE: we're invoking the ReAct agent with the full history of messages in the state
const callTravelAdvisor = task("callTravelAdvisor", async (messages: BaseMessageLike[]) => {
  const response = await travelAdvisor.invoke({ messages });
  return response.messages;
});

const hotelAdvisorTools = [
  getHotelRecommendations,
  transferToTravelAdvisor,
];

// Define hotel advisor ReAct agent
const hotelAdvisor = createReactAgent({
  llm: model,
  tools: hotelAdvisorTools,
  stateModifier: [
    "You are a hotel expert that can provide hotel recommendations for a given destination.",
    "If you need help picking travel destinations, ask 'travel_advisor' for help.",
    "You MUST include a human-readable response before transferring to another agent."
  ].join(" "),
});

// Add task for hotel advisor
const callHotelAdvisor = task("callHotelAdvisor", async (messages: BaseMessageLike[]) => {
  const response = await hotelAdvisor.invoke({ messages });
  return response.messages;
});

const networkGraph = entrypoint(
  "networkGraph",
  async (messages: BaseMessageLike[]) => {
    // Converts inputs to LangChain messages as a side-effect
    let currentMessages = addMessages([], messages);

    let callActiveAgent = callTravelAdvisor;
    while (true) {
      const agentMessages = await callActiveAgent(currentMessages);
      currentMessages = addMessages(currentMessages, agentMessages);

      // Find the last AI message
      // If one of the handoff tools is called, the last message returned
      // by the agent will be a ToolMessage because we set them to have
      // "returnDirect: true". This means that the last AIMessage will
      // have tool calls.
      // Otherwise, the last returned message will be an AIMessage with
      // no tool calls, which means we are ready for new input.
      const aiMsg = [...agentMessages].reverse()
        .find((m): m is AIMessage => m.getType() === "ai");

      // If no tool calls, we're done
      if (!aiMsg?.tool_calls?.length) {
        break;
      }

      // Get the last tool call and determine next agent
      const toolCall = aiMsg.tool_calls.at(-1)!;
      if (toolCall.name === "transferToTravelAdvisor") {
        callActiveAgent = callTravelAdvisor;
      } else if (toolCall.name === "transferToHotelAdvisor") {
        callActiveAgent = callHotelAdvisor;
      } else {
        throw new Error(`Expected transfer tool, got '${toolCall.name}'`);
      }
    }

    return messages;
  });

```

Lastly, let's define a helper to render the agent outputs:

```
const prettyPrintMessages = (update: Record<string, any>) => {
  // Handle tuple case with namespace
  if (Array.isArray(update)) {
    const [ns, updateData] = update;
    // Skip parent graph updates in the printouts
    if (ns.length === 0) {
      return;
    }

    const graphId = ns[ns.length - 1].split(":")[0];
    console.log(`Update from subgraph ${graphId}:\n`);
    update = updateData;
  }

  if (update.__metadata__?.cached) {
    return;
  }
  // Print updates for each node
  for (const [nodeName, updateValue] of Object.entries(update)) {
    console.log(`Update from node ${nodeName}:\n`);

    const coercedMessages = addMessages([], updateValue.messages);
    for (const message of coercedMessages) {
      const textContent = typeof message.content === "string"
        ? message.content
        : JSON.stringify(message.content);
      // Print message content based on role
      if (message.getType() === "ai") {
        console.log("=".repeat(33) + " Assistant Message " + "=".repeat(33));
        console.log(textContent);
        console.log();
      } else if (message.getType() === "human") {
        console.log("=".repeat(33) + " Human Message " + "=".repeat(33));
        console.log(textContent);
        console.log();
      } else if (message.getType() === "tool") {
        console.log("=".repeat(33) + " Tool Message " + "=".repeat(33));
        console.log(textContent);
        console.log();
      }
    }
    console.log("\n");
  }
};

```

Let's test it out:

```
const stream = await networkGraph.stream([{
  role: "user",
  content: "i wanna go somewhere warm in the caribbean. pick one destination and give me hotel recommendations"
}], { subgraphs: true })

for await (const chunk of stream) {
  prettyPrintMessages(chunk);
}

```

```
Update from subgraph callTravelAdvisor:

Update from node agent:

================================= Assistant Message =================================
[{"type":"text","text":"I'll help you find a warm Caribbean destination and then get specific hotel recommendations for you.\n\nLet me first get some destination recommendations for the Caribbean region."},{"type":"tool_use","id":"toolu_019fN1etkqtCSausSv8XufhL","name":"getTravelRecommendations","input":{}}]

Update from subgraph callTravelAdvisor:

Update from node tools:

================================= Tool Message =================================
turks and caicos

Update from subgraph callTravelAdvisor:

Update from node agent:

================================= Assistant Message =================================
[{"type":"text","text":"Great! I recommend Turks and Caicos for your Caribbean getaway. This beautiful British Overseas Territory is known for its stunning white-sand beaches, crystal-clear turquoise waters, and perfect warm weather year-round. Grace Bay Beach in Providenciales (often called \"Provo\") is consistently ranked among the world's best beaches. The islands offer excellent snorkeling, diving, and water sports opportunities, plus a relaxed Caribbean atmosphere.\n\nNow, let me connect you with our hotel advisor to get specific accommodation recommendations for Turks and Caicos."},{"type":"tool_use","id":"toolu_01UHAnBBK9zm2nAEh7brR7TY","name":"transferToHotelAdvisor","input":{}}]

Update from subgraph callTravelAdvisor:

Update from node tools:

================================= Tool Message =================================
Successfully transferred to hotel advisor

Update from subgraph callHotelAdvisor:

Update from node agent:

================================= Assistant Message =================================
[{"type":"text","text":"Let me get some hotel recommendations for Turks and Caicos:"},{"type":"tool_use","id":"toolu_012GUHBGXxyzwE5dY6nePq9s","name":"getHotelRecommendations","input":{"location":"turks and caicos"}}]

Update from subgraph callHotelAdvisor:

Update from node tools:

================================= Tool Message =================================
[
  "Grace Bay Club",
  "COMO Parrot Cay"
]

Update from subgraph callHotelAdvisor:

Update from node agent:

================================= Assistant Message =================================
Based on the recommendations, here are two excellent options in Turks and Caicos:

1. Grace Bay Club: This luxurious resort is located on the world-famous Grace Bay Beach. It offers all-oceanfront suites, exceptional dining options, and top-notch amenities including multiple pools, a spa, and various water sports activities. The resort is perfect for both couples and families, with adult-only and family-friendly sections.

2. COMO Parrot Cay: This exclusive private island resort offers the ultimate luxury experience. Located on its own island, it features pristine beaches, world-class spa treatments, and exceptional dining. The resort is known for its privacy, making it a favorite among celebrities. The rooms and villas offer sophisticated design with private pools and direct beach access.

Would you like more specific information about either of these properties or shall I search for additional options?

```

Voila - `travelAdvisor` picks a destination and then makes a decision to call `hotelAdvisor` for more info!

Was this page helpful?

Thanks for your feedback!

Thanks for your feedback! Please help us improve this page by adding to the discussion below.

Back to top

[Previous

How to build a multi-agent network](../multi-agent-network/)
[Next

How to add multi-turn conversation in a multi-agent application](../multi-agent-multi-turn-convo/)

Copyright © 2025 LangChain, Inc | [Consent Preferences](#__consent)

Made with
[Material for MkDocs Insiders](https://squidfunk.github.io/mkdocs-material/)

#### Cookie consent

We use cookies to recognize your repeated visits and preferences, as well as to measure the effectiveness of our documentation and whether users find what they're searching for. **Clicking "Accept" makes our documentation better. Thank you!** ❤️

* Google Analytics
* GitHub

Accept
Reject