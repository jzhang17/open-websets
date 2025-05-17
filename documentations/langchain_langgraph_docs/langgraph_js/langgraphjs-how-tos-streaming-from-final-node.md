[Skip to content](#how-to-stream-from-the-final-node)

**Help us build the JS tools that power AI apps at companies like Replit, Uber, LinkedIn, GitLab, and more. [Join our team!](https://jobs.ashbyhq.com/langchain/05efa205-8560-43fd-bfcc-3f7697561cfb?utm_source=https%3A%2F%2Flangchain-ai.github.io%2Flanggraphjs%2F&utm_campaign=langgraphjs_docs)**

[![logo](../../static/wordmark_dark.svg)
![logo](../../static/wordmark_light.svg)](../..)

How to stream from the final node

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
        + Streaming

          Streaming
          - [Streaming](../../how-tos#streaming)
          - [How to stream full state of your graph](../stream-values/)
          - [How to stream state updates of your graph](../stream-updates/)
          - [How to stream LLM tokens from your graph](../stream-tokens/)
          - [How to stream LLM tokens (without LangChain models)](../streaming-tokens-without-langchain/)
          - [How to stream custom data](../streaming-content/)
          - [How to configure multiple streaming modes at the same time](../stream-multiple/)
          - [How to stream events from within a tool](../streaming-events-from-within-tools/)
          - How to stream from the final node

            [How to stream from the final node](./)

            Table of contents
            * [Define model and tools](#define-model-and-tools)
            * [Define graph](#define-graph)
            * [Stream outputs from the final node](#stream-outputs-from-the-final-node)
        + [Tool calling](../../how-tos#tool-calling)
        + [Subgraphs](../../how-tos#subgraphs)
        + [Multi-agent](../multi-agent-network/)
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

* [Define model and tools](#define-model-and-tools)
* [Define graph](#define-graph)
* [Stream outputs from the final node](#stream-outputs-from-the-final-node)

1. [LangGraph](../..)
2. [Guides](../)
3. [How-to Guides](../)
4. [LangGraph](../../how-tos#langgraph)
5. [Streaming](../../how-tos#streaming)

# How to stream from the final node[¶](#how-to-stream-from-the-final-node "Permanent link")

One common pattern for graphs is to stream LLM tokens from inside the final node only. This guide demonstrates how you can do this.

## Define model and tools[¶](#define-model-and-tools "Permanent link")

First, set up a chat model and a tool to call within your graph:

```
npm install @langchain/langgraph @langchain/anthropic @langchain/core

```

```
import { z } from "zod";
import { tool } from "@langchain/core/tools";
import { ChatAnthropic } from "@langchain/anthropic";

const getWeather = tool(async ({ city }) => {
  if (city === "nyc") {
    return "It might be cloudy in nyc";
  } else if (city === "sf") {
    return "It's always sunny in sf";
  } else {
    throw new Error("Unknown city.");
  }
}, {
  name: "get_weather",
  schema: z.object({
    city: z.enum(["nyc", "sf"]),
  }),
  description: "Use this to get weather information",
});

const tools = [getWeather];

const model = new ChatAnthropic({
  model: "claude-3-5-sonnet-20240620",
}).bindTools(tools);

// We add a tag that we'll be using later to filter outputs
const finalModel = new ChatAnthropic({
  model: "claude-3-5-sonnet-20240620",
}).withConfig({
  tags: ["final_node"],
});

```

## Define graph[¶](#define-graph "Permanent link")

Now, lay out your graph:

```
import { StateGraph, MessagesAnnotation } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";

const shouldContinue = async (state: typeof MessagesAnnotation.State) => {
  const messages = state.messages;
  const lastMessage: AIMessage = messages[messages.length - 1];
  // If the LLM makes a tool call, then we route to the "tools" node
  if (lastMessage.tool_calls?.length) {
    return "tools";
  }
  // Otherwise, we stop (reply to the user)
  return "final";
};

const callModel = async (state: typeof MessagesAnnotation.State) => {
  const messages = state.messages;
  const response = await model.invoke(messages);
  // We return a list, because this will get added to the existing list
  return { messages: [response] };
};

const callFinalModel = async (state: typeof MessagesAnnotation.State) => {
  const messages = state.messages;
  const lastAIMessage = messages[messages.length - 1];
  const response = await finalModel.invoke([
    new SystemMessage("Rewrite this in the voice of Al Roker"),
    new HumanMessage({ content: lastAIMessage.content })
  ]);
  // MessagesAnnotation allows you to overwrite messages from the agent
  // by returning a message with the same id
  response.id = lastAIMessage.id;
  return { messages: [response] };
}

const toolNode = new ToolNode<typeof MessagesAnnotation.State>(tools);

const graph = new StateGraph(MessagesAnnotation)
  .addNode("agent", callModel)
  .addNode("tools", toolNode)
  // add a separate final node
  .addNode("final", callFinalModel)
  .addEdge("__start__", "agent")
  // Third parameter is optional and only here to draw a diagram of the graph
  .addConditionalEdges("agent", shouldContinue, {
    tools: "tools",
    final: "final",
  })
  .addEdge("tools", "agent")
  .addEdge("final", "__end__")
  .compile();

```

```
import * as tslab from "tslab";

const diagram = graph.getGraph();
const image = await diagram.drawMermaidPng();
const arrayBuffer = await image.arrayBuffer();

tslab.display.png(new Uint8Array(arrayBuffer));

```

![](data:image/png;base64...)

## Stream outputs from the final node[¶](#stream-outputs-from-the-final-node "Permanent link")

```
const inputs = { messages: [new HumanMessage("What's the weather in nyc?")] };

const eventStream = await graph.streamEvents(inputs, { version: "v2"});

for await (const { event, tags, data } of eventStream) {
  if (event === "on_chat_model_stream" && tags.includes("final_node")) {
    if (data.chunk.content) {
      // Empty content in the context of OpenAI or Anthropic usually means
      // that the model is asking for a tool to be invoked.
      // So we only print non-empty content
      console.log(data.chunk.content, "|");
    }
  }
}

```

```
Hey |
 there, folks |
! Al |
 Roker here with |
 your weather update. |

Well |
, well |
, well, it seems |
 like |
 the |
 Big |
 Apple might |
 be getting |
 a little over |
cast today. That |
's right |
, we |
're |
 looking |
 at some |
 cloud cover moving in over |
 New |
 York City. But hey |
, don't let that |
 dampen your spirits! |
 A |
 little clou |
d never |
 hurt anybody |
, |
 right?

Now |
, I |
' |
d love |
 to give |
 you more |
 details, |
 but Mother |
 Nature can |
 be as |
 unpredictable as |
 a game |
 of chance sometimes |
. So |
, if |
 you want |
 the full |
 scoop on NYC |
's weather |
 or |
 if |
 you're |
 curious |
 about conditions |
 in any other city across |
 this |
 great nation of ours |
, just give |
 me a ho |
ller! I'm here |
 to keep |
 you in the know, |
 whether |
 it's sunshine |
, |
 rain, or anything |
 in between.

Remember |
, a clou |
dy day is |
 just |
 the |
 sun |
's |
 way of letting |
 you know it's still |
 there, even if you |
 can't see it. |
 Stay |
 weather |
-aware |
, |
 an |
d don |
't forget your |
 umbrella... |
 just in case! |

```

```

```

Was this page helpful?

Thanks for your feedback!

Thanks for your feedback! Please help us improve this page by adding to the discussion below.

Back to top

[Previous

How to stream events from within a tool](../streaming-events-from-within-tools/)
[Next

How to call tools using ToolNode](../tool-calling/)

Copyright © 2025 LangChain, Inc | [Consent Preferences](#__consent)

Made with
[Material for MkDocs Insiders](https://squidfunk.github.io/mkdocs-material/)

#### Cookie consent

We use cookies to recognize your repeated visits and preferences, as well as to measure the effectiveness of our documentation and whether users find what they're searching for. **Clicking "Accept" makes our documentation better. Thank you!** ❤️

* Google Analytics
* GitHub

Accept
Reject