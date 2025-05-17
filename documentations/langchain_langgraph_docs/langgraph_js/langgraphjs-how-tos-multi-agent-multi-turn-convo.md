[Skip to content](#how-to-add-multi-turn-conversation-in-a-multi-agent-application)

**Help us build the JS tools that power AI apps at companies like Replit, Uber, LinkedIn, GitLab, and more. [Join our team!](https://jobs.ashbyhq.com/langchain/05efa205-8560-43fd-bfcc-3f7697561cfb?utm_source=https%3A%2F%2Flangchain-ai.github.io%2Flanggraphjs%2F&utm_campaign=langgraphjs_docs)**

[![logo](../../static/wordmark_dark.svg)
![logo](../../static/wordmark_light.svg)](../..)

How to add multi-turn conversation in a multi-agent application

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
          - [How to build a multi-agent network (functional API)](../multi-agent-network-functional/)
          - How to add multi-turn conversation in a multi-agent application

            [How to add multi-turn conversation in a multi-agent application](./)

            Table of contents
            * [Setup](#setup)
            * [Travel Recommendations Example](#travel-recommendations-example)

              + [Test multi-turn conversation](#test-multi-turn-conversation)
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
* [Travel Recommendations Example](#travel-recommendations-example)

  + [Test multi-turn conversation](#test-multi-turn-conversation)

1. [LangGraph](../..)
2. [Guides](../)
3. [How-to Guides](../)
4. [LangGraph](../../how-tos#langgraph)
5. [Multi-agent](../multi-agent-network/)

# How to add multi-turn conversation in a multi-agent application[¶](#how-to-add-multi-turn-conversation-in-a-multi-agent-application "Permanent link")

Prerequisites

This guide assumes familiarity with the following:

* [Node](/langgraphjs/concepts/low_level/#nodes)
* [Command](/langgraphjs/concepts/low_level/#command)
* [Multi-agent systems](/langgraphjs/concepts/multi_agent)
* [Human-in-the-loop](/langgraphjs/concepts/human_in_the_loop)

In this how-to guide, we’ll build an application that allows an end-user to engage in a *multi-turn conversation* with one or more agents. We'll create a node that uses an [`interrupt`](/langgraphjs/reference/functions/langgraph.interrupt-1.html) to collect user input and routes back to the **active** agent.

The agents will be implemented as nodes in a graph that executes agent steps and determines the next action:

1. **Wait for user input** to continue the conversation, or
2. **Route to another agent** (or back to itself, such as in a loop) via a [**handoff**](/langgraphjs/concepts/multi_agent/#handoffs).

```
function human(state: typeof MessagesAnnotation.State): Command {
  const userInput: string = interrupt("Ready for user input.");

  // Determine the active agent
  const activeAgent = ...;

  return new Command({
    update: {
      messages: [{
        role: "human",
        content: userInput,
      }]
    },
    goto: activeAgent,
  });
}

function agent(state: typeof MessagesAnnotation.State): Command {
  // The condition for routing/halting can be anything, e.g. LLM tool call / structured output, etc.
  const goto = getNextAgent(...); // 'agent' / 'anotherAgent'

  if (goto) {
    return new Command({
      goto,
      update: { myStateKey: "myStateValue" }
    });
  } else {
    return new Command({
      goto: "human"
    });
  }
}

```

## Setup[¶](#setup "Permanent link")

First, let's install the required packages
npm install [langchain/langgraph](https://github.com/langchain/langgraph "GitHub Repository: langchain/langgraph") [langchain/openai](https://github.com/langchain/openai "GitHub Repository: langchain/openai") [langchain/core](https://github.com/langchain/core "GitHub Repository: langchain/core") uuid zod

```
// process.env.OPENAI_API_KEY = "sk_...";

// Optional, add tracing in LangSmith
// process.env.LANGCHAIN_API_KEY = "ls__...";
process.env.LANGCHAIN_CALLBACKS_BACKGROUND = "true";
process.env.LANGCHAIN_TRACING_V2 = "true";
process.env.LANGCHAIN_PROJECT = "Time Travel: LangGraphJS";

```

```
Time Travel: LangGraphJS

```

Set up [LangSmith](https://smith.langchain.com) for LangGraph development

Sign up for LangSmith to quickly spot issues and improve the performance of your LangGraph projects. LangSmith lets you use trace data to debug, test, and monitor your LLM apps built with LangGraph — read more about how to get started [here](https://docs.smith.langchain.com).

## Travel Recommendations Example[¶](#travel-recommendations-example "Permanent link")

In this example, we will build a team of travel assistant agents that can communicate with each other via handoffs.

We will create 3 agents:

* `travelAdvisor`: can help with general travel destination recommendations. Can ask `sightseeingAdvisor` and `hotelAdvisor` for help.
* `sightseeingAdvisor`: can help with sightseeing recommendations. Can ask `travelAdvisor` and `hotelAdvisor` for help.
* `hotelAdvisor`: can help with hotel recommendations. Can ask `sightseeingAdvisor` and `hotelAdvisor` for help.

This is a fully-connected network - every agent can talk to any other agent.

To implement the handoffs between the agents we'll be using LLMs with structured output. Each agent's LLM will return an output with both its text response (`response`) as well as which agent to route to next (`goto`). If the agent has enough information to respond to the user, the `goto` will be set to `human` to route back and collect information from a human.

Now, let's define our agent nodes and graph!

```
import { z } from "zod";
import { ChatOpenAI } from "@langchain/openai";
import { BaseMessage } from "@langchain/core/messages";
import {
  MessagesAnnotation,
  StateGraph,
  START,
  Command,
  interrupt,
  MemorySaver
} from "@langchain/langgraph";

const model = new ChatOpenAI({ model: "gpt-4o" });

/**
 * Call LLM with structured output to get a natural language response as well as a target agent (node) to go to next.
 * @param messages list of messages to pass to the LLM
 * @param targetAgentNodes list of the node names of the target agents to navigate to
 */
function callLlm(messages: BaseMessage[], targetAgentNodes: string[]) {
  // define the schema for the structured output:
  // - model's text response (`response`)
  // - name of the node to go to next (or 'finish')
  const outputSchema = z.object({
    response: z.string().describe("A human readable response to the original question. Does not need to be a final response. Will be streamed back to the user."),
    goto: z.enum(["finish", ...targetAgentNodes]).describe("The next agent to call, or 'finish' if the user's query has been resolved. Must be one of the specified values."),
  })
  return model.withStructuredOutput(outputSchema, { name: "Response" }).invoke(messages)
}

async function travelAdvisor(
  state: typeof MessagesAnnotation.State
): Promise<Command> {
  const systemPrompt =
      "You are a general travel expert that can recommend travel destinations (e.g. countries, cities, etc). " +
      "If you need specific sightseeing recommendations, ask 'sightseeingAdvisor' for help. " +
      "If you need hotel recommendations, ask 'hotelAdvisor' for help. " +
      "If you have enough information to respond to the user, return 'finish'. " +
      "Never mention other agents by name.";

  const messages = [{"role": "system", "content": systemPrompt}, ...state.messages] as BaseMessage[];
  const targetAgentNodes = ["sightseeingAdvisor", "hotelAdvisor"];
  const response = await callLlm(messages, targetAgentNodes);
  const aiMsg = {"role": "ai", "content": response.response, "name": "travelAdvisor"};

  let goto = response.goto;
  if (goto === "finish") {
      goto = "human";
  }

  return new Command({goto, update: { "messages": [aiMsg] } });
}

async function sightseeingAdvisor(
  state: typeof MessagesAnnotation.State
): Promise<Command> {
  const systemPrompt =
      "You are a travel expert that can provide specific sightseeing recommendations for a given destination. " +
      "If you need general travel help, go to 'travelAdvisor' for help. " +
      "If you need hotel recommendations, go to 'hotelAdvisor' for help. " +
      "If you have enough information to respond to the user, return 'finish'. " +
      "Never mention other agents by name.";

  const messages = [{"role": "system", "content": systemPrompt}, ...state.messages] as BaseMessage[];
  const targetAgentNodes = ["travelAdvisor", "hotelAdvisor"];
  const response = await callLlm(messages, targetAgentNodes);
  const aiMsg = {"role": "ai", "content": response.response, "name": "sightseeingAdvisor"};

  let goto = response.goto;
  if (goto === "finish") {
      goto = "human";
  }

  return new Command({ goto, update: {"messages": [aiMsg] } });
}

async function hotelAdvisor(
  state: typeof MessagesAnnotation.State
): Promise<Command> {
  const systemPrompt =
      "You are a travel expert that can provide hotel recommendations for a given destination. " +
      "If you need general travel help, ask 'travelAdvisor' for help. " +
      "If you need specific sightseeing recommendations, ask 'sightseeingAdvisor' for help. " +
      "If you have enough information to respond to the user, return 'finish'. " +
      "Never mention other agents by name.";

  const messages = [{"role": "system", "content": systemPrompt}, ...state.messages] as BaseMessage[];
  const targetAgentNodes = ["travelAdvisor", "sightseeingAdvisor"];
  const response = await callLlm(messages, targetAgentNodes);
  const aiMsg = {"role": "ai", "content": response.response, "name": "hotelAdvisor"};

  let goto = response.goto;
  if (goto === "finish") {
      goto = "human";
  }

  return new Command({ goto, update: {"messages": [aiMsg] } });
}

function humanNode(
  state: typeof MessagesAnnotation.State
): Command {
  const userInput: string = interrupt("Ready for user input.");

  let activeAgent: string | undefined = undefined;

  // Look up the active agent
  for (let i = state.messages.length - 1; i >= 0; i--) {
      if (state.messages[i].name) {
          activeAgent = state.messages[i].name;
          break;
      }
  }

  if (!activeAgent) {
      throw new Error("Could not determine the active agent.");
  }

  return new Command({
      goto: activeAgent,
      update: {
        "messages": [
            {
                "role": "human",
                "content": userInput,
            }
        ]
      }
  });
}

const builder = new StateGraph(MessagesAnnotation)
  .addNode("travelAdvisor", travelAdvisor, {
    ends: ["sightseeingAdvisor", "hotelAdvisor"]
  })
  .addNode("sightseeingAdvisor", sightseeingAdvisor, {
    ends: ["human", "travelAdvisor", "hotelAdvisor"]
  })
  .addNode("hotelAdvisor", hotelAdvisor, {
    ends: ["human", "travelAdvisor", "sightseeingAdvisor"]
  })
  // This adds a node to collect human input, which will route
  // back to the active agent.
  .addNode("human", humanNode, {
    ends: ["hotelAdvisor", "sightseeingAdvisor", "travelAdvisor", "human"]
  })
  // We'll always start with a general travel advisor.
  .addEdge(START, "travelAdvisor")

const checkpointer = new MemorySaver()
const graph = builder.compile({ checkpointer })

```

```
import * as tslab from "tslab";

const drawableGraph = graph.getGraph();
const image = await drawableGraph.drawMermaidPng();
const arrayBuffer = await image.arrayBuffer();

await tslab.display.png(new Uint8Array(arrayBuffer));

```

![](data:image/png;base64...)

### Test multi-turn conversation[¶](#test-multi-turn-conversation "Permanent link")

Let's test a multi turn conversation with this application.

```
import { Command } from "@langchain/langgraph";
import { v4 as uuidv4 } from "uuid";

const threadConfig = { configurable: { thread_id: uuidv4() }, streamMode: "values" as const };

const inputs = [
  // 1st round of conversation
  {
    messages: [
      { role: "user", content: "i wanna go somewhere warm in the caribbean" }
    ]
  },
  // Since we're using `interrupt`, we'll need to resume using the Command primitive.
  // 2nd round of conversation
  new Command({
    resume: "could you recommend a nice hotel in one of the areas and tell me which area it is."
  }),
  // Third round of conversation
  new Command({ resume: "could you recommend something to do near the hotel?" }),
]

let iter = 0;
for await (const userInput of inputs) {
  iter += 1;
  console.log(`\n--- Conversation Turn ${iter} ---\n`);
  console.log(`User: ${JSON.stringify(userInput)}\n`);

  for await (const update of await graph.stream(userInput, threadConfig)) {
    const lastMessage = update.messages ? update.messages[update.messages.length - 1] : undefined;
    if (lastMessage && lastMessage._getType() === "ai") {
      console.log(`${lastMessage.name}: ${lastMessage.content}`)
    }
  }
}

```

```
--- Conversation Turn 1 ---

User: {"messages":[{"role":"user","content":"i wanna go somewhere warm in the caribbean"}]}

travelAdvisor: The Caribbean is a fantastic choice for a warm getaway! Some popular destinations you might consider include Jamaica, the Dominican Republic, and the Bahamas. Each destination offers beautiful beaches, warm weather, and a plethora of activities to enjoy in a tropical setting. Aruba and Barbados are also great choices if you prefer lively beach towns with vibrant nightlife and cultural richness.

Would you like recommendations on sightseeing or places to stay in any of these Caribbean destinations?

--- Conversation Turn 2 ---

User: {"lg_name":"Command","lc_direct_tool_output":true,"resume":"could you recommend a nice hotel in one of the areas and tell me which area it is.","goto":[]}

travelAdvisor: The Caribbean is a fantastic choice for a warm getaway! Some popular destinations you might consider include Jamaica, the Dominican Republic, and the Bahamas. Each destination offers beautiful beaches, warm weather, and a plethora of activities to enjoy in a tropical setting. Aruba and Barbados are also great choices if you prefer lively beach towns with vibrant nightlife and cultural richness.

Would you like recommendations on sightseeing or places to stay in any of these Caribbean destinations?
travelAdvisor: Let's focus on Jamaica, known for its beautiful beaches and vibrant culture, perfect for a warm Caribbean escape. I'll find a nice hotel for you there.
hotelAdvisor: In Jamaica, consider staying at the "Round Hill Hotel and Villas" located in Montego Bay. It's a luxurious resort offering a private beach, beautiful villas, and a spa. Montego Bay is known for its stunning beaches, lively nightlife, and rich history with plantations and cultural sites to explore.

--- Conversation Turn 3 ---

User: {"lg_name":"Command","lc_direct_tool_output":true,"resume":"could you recommend something to do near the hotel?","goto":[]}

hotelAdvisor: In Jamaica, consider staying at the "Round Hill Hotel and Villas" located in Montego Bay. It's a luxurious resort offering a private beach, beautiful villas, and a spa. Montego Bay is known for its stunning beaches, lively nightlife, and rich history with plantations and cultural sites to explore.
hotelAdvisor: Let's find some sightseeing recommendations or activities around Round Hill Hotel and Villas in Montego Bay, Jamaica for you.
sightseeingAdvisor: While staying at the Round Hill Hotel and Villas in Montego Bay, you can explore a variety of activities nearby:

1. **Doctor’s Cave Beach**: One of Montego Bay’s most famous beaches, it’s perfect for swimming and enjoying the sun.

2. **Rose Hall Great House**: Visit this historic plantation house, rumored to be haunted, for a tour of the beautiful grounds and a taste of Jamaican history.

3. **Martha Brae River**: Enjoy rafting on this beautiful river, surrounded by lush Jamaican flora. It's a peaceful and scenic way to experience the natural beauty of the area.

4. **Dunn’s River Falls**: Although a bit farther than the other attractions, these stunning waterfalls in Ocho Rios are worth the visit for a unique climbing experience.

5. **Montego Bay Marine Park**: Explore the coral reefs and marine life through snorkeling or diving adventures.

```

Was this page helpful?

Thanks for your feedback!

Thanks for your feedback! Please help us improve this page by adding to the discussion below.

Back to top

[Previous

How to build a multi-agent network (functional API)](../multi-agent-network-functional/)
[Next

How to add multi-turn conversation in a multi-agent application (functional API)](../multi-agent-multi-turn-convo-functional/)

Copyright © 2025 LangChain, Inc | [Consent Preferences](#__consent)

Made with
[Material for MkDocs Insiders](https://squidfunk.github.io/mkdocs-material/)

#### Cookie consent

We use cookies to recognize your repeated visits and preferences, as well as to measure the effectiveness of our documentation and whether users find what they're searching for. **Clicking "Accept" makes our documentation better. Thank you!** ❤️

* Google Analytics
* GitHub

Accept
Reject