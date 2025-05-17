[Skip to content](#how-to-stream-llm-tokens-without-langchain-models)

**Help us build the JS tools that power AI apps at companies like Replit, Uber, LinkedIn, GitLab, and more. [Join our team!](https://jobs.ashbyhq.com/langchain/05efa205-8560-43fd-bfcc-3f7697561cfb?utm_source=https%3A%2F%2Flangchain-ai.github.io%2Flanggraphjs%2F&utm_campaign=langgraphjs_docs)**

[![logo](../../static/wordmark_dark.svg)
![logo](../../static/wordmark_light.svg)](../..)

How to stream LLM tokens (without LangChain models)

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
          - How to stream LLM tokens (without LangChain models)

            [How to stream LLM tokens (without LangChain models)](./)

            Table of contents
            * [Setup](#setup)
            * [Defining a model and a tool schema](#defining-a-model-and-a-tool-schema)
            * [Calling the model](#calling-the-model)
            * [Define tools and a tool-calling node](#define-tools-and-a-tool-calling-node)
            * [Build the graph](#build-the-graph)
            * [Streaming tokens](#streaming-tokens)
          - [How to stream custom data](../streaming-content/)
          - [How to configure multiple streaming modes at the same time](../stream-multiple/)
          - [How to stream events from within a tool](../streaming-events-from-within-tools/)
          - [How to stream from the final node](../streaming-from-final-node/)
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

* [Setup](#setup)
* [Defining a model and a tool schema](#defining-a-model-and-a-tool-schema)
* [Calling the model](#calling-the-model)
* [Define tools and a tool-calling node](#define-tools-and-a-tool-calling-node)
* [Build the graph](#build-the-graph)
* [Streaming tokens](#streaming-tokens)

1. [LangGraph](../..)
2. [Guides](../)
3. [How-to Guides](../)
4. [LangGraph](../../how-tos#langgraph)
5. [Streaming](../../how-tos#streaming)

# How to stream LLM tokens (without LangChain models)[¶](#how-to-stream-llm-tokens-without-langchain-models "Permanent link")

In this guide, we will stream tokens from the language model powering an agent without using LangChain chat models. We'll be using the OpenAI client library directly in a ReAct agent as an example.

## Setup[¶](#setup "Permanent link")

To get started, install the `openai` and `langgraph` packages separately:

```
$ npm install openai @langchain/langgraph @langchain/core

```

Compatibility

This guide requires `@langchain/core>=0.2.19`, and if you are using LangSmith, `langsmith>=0.1.39`. For help upgrading, see [this guide](/langgraphjs/how-tos/manage-ecosystem-dependencies/).

You'll also need to make sure you have your OpenAI key set as `process.env.OPENAI_API_KEY`.

## Defining a model and a tool schema[¶](#defining-a-model-and-a-tool-schema "Permanent link")

First, initialize the OpenAI SDK and define a tool schema for the model to populate using [OpenAI's format](https://platform.openai.com/docs/api-reference/chat/create#chat-create-tools):

```
import OpenAI from "openai";

const openaiClient = new OpenAI({});

const toolSchema: OpenAI.ChatCompletionTool = {
  type: "function",
  function: {
    name: "get_items",
    description: "Use this tool to look up which items are in the given place.",
    parameters: {
      type: "object",
      properties: {
        place: {
          type: "string",
        },
      },
      required: ["place"],
    }
  }
};

```

## Calling the model[¶](#calling-the-model "Permanent link")

Now, define a method for a LangGraph node that will call the model. It will handle formatting tool calls to and from the model, as well as streaming via [custom callback events](https://js.langchain.com/docs/how_to/callbacks_custom_events).

If you are using [LangSmith](https://docs.smith.langchain.com/), you can also wrap the OpenAI client for the same nice tracing you'd get with a LangChain chat model.

Here's what that looks like:

```
import { dispatchCustomEvent } from "@langchain/core/callbacks/dispatch";
import { wrapOpenAI } from "langsmith/wrappers/openai";
import { Annotation } from "@langchain/langgraph";

const StateAnnotation = Annotation.Root({
  messages: Annotation<OpenAI.ChatCompletionMessageParam[]>({
    reducer: (x, y) => x.concat(y),
  }),
});

// If using LangSmith, use "wrapOpenAI" on the whole client or
// "traceable" to wrap a single method for nicer tracing:
// https://docs.smith.langchain.com/how_to_guides/tracing/annotate_code
const wrappedClient = wrapOpenAI(openaiClient);

const callModel = async (state: typeof StateAnnotation.State) => {
  const { messages } = state;
  const stream = await wrappedClient.chat.completions.create({
    messages,
    model: "gpt-4o-mini",
    tools: [toolSchema],
    stream: true,
  });
  let responseContent = "";
  let role: string = "assistant";
  let toolCallId: string | undefined;
  let toolCallName: string | undefined;
  let toolCallArgs = "";
  for await (const chunk of stream) {
    const delta = chunk.choices[0].delta;
    if (delta.role !== undefined) {
      role = delta.role;
    }
    if (delta.content) {
      responseContent += delta.content;
      await dispatchCustomEvent("streamed_token", {
        content: delta.content,
      });
    }
    if (delta.tool_calls !== undefined && delta.tool_calls.length > 0) {
      // note: for simplicity we're only handling a single tool call here
      const toolCall = delta.tool_calls[0];
      if (toolCall.function?.name !== undefined) {
        toolCallName = toolCall.function.name;
      }
      if (toolCall.id !== undefined) {
        toolCallId = toolCall.id;
      }
      await dispatchCustomEvent("streamed_tool_call_chunk", toolCall);
      toolCallArgs += toolCall.function?.arguments ?? "";
    }
  }
  let finalToolCalls;
  if (toolCallName !== undefined && toolCallId !== undefined) {
    finalToolCalls = [{
      id: toolCallId,
      function: {
        name: toolCallName,
        arguments: toolCallArgs
      },
      type: "function" as const,
    }];
  }

  const responseMessage = {
    role: role as any,
    content: responseContent,
    tool_calls: finalToolCalls,
  };
  return { messages: [responseMessage] };
}

```

Note that you can't call this method outside of a LangGraph node since `dispatchCustomEvent` will fail if it is called outside the proper context.

## Define tools and a tool-calling node[¶](#define-tools-and-a-tool-calling-node "Permanent link")

Next, set up the actual tool function and the node that will call it when the model populates a tool call:

```
const getItems = async ({ place }: { place: string }) => {
  if (place.toLowerCase().includes("bed")) {  // For under the bed
    return "socks, shoes and dust bunnies";
  } else if (place.toLowerCase().includes("shelf")) {  // For 'shelf'
    return "books, pencils and pictures";
  } else {  // if the agent decides to ask about a different place
    return "cat snacks";
  }
};

const callTools = async (state: typeof StateAnnotation.State) => {
  const { messages } = state;
  const mostRecentMessage = messages[messages.length - 1];
  const toolCalls = (mostRecentMessage as OpenAI.ChatCompletionAssistantMessageParam).tool_calls;
  if (toolCalls === undefined || toolCalls.length === 0) {
    throw new Error("No tool calls passed to node.");
  }
  const toolNameMap = {
    get_items: getItems,
  };
  const functionName = toolCalls[0].function.name;
  const functionArguments = JSON.parse(toolCalls[0].function.arguments);
  const response = await toolNameMap[functionName](functionArguments);
  const toolMessage = {
    tool_call_id: toolCalls[0].id,
    role: "tool" as const,
    name: functionName,
    content: response,
  }
  return { messages: [toolMessage] };
}

```

## Build the graph[¶](#build-the-graph "Permanent link")

Finally, it's time to build your graph:

```
import { StateGraph } from "@langchain/langgraph";
import OpenAI from "openai";

// We can reuse the same `GraphState` from above as it has not changed.
const shouldContinue = (state: typeof StateAnnotation.State) => {
  const { messages } = state;
  const lastMessage =
    messages[messages.length - 1] as OpenAI.ChatCompletionAssistantMessageParam;
  if (lastMessage?.tool_calls !== undefined && lastMessage?.tool_calls.length > 0) {
    return "tools";
  }
  return "__end__";
}

const graph = new StateGraph(StateAnnotation)
  .addNode("model", callModel)
  .addNode("tools", callTools)
  .addEdge("__start__", "model")
  .addConditionalEdges("model", shouldContinue, {
    tools: "tools",
    __end__: "__end__",
  })
  .addEdge("tools", "model")
  .compile();

```

```
import * as tslab from "tslab";

const representation = graph.getGraph();
const image = await representation.drawMermaidPng();
const arrayBuffer = await image.arrayBuffer();

await tslab.display.png(new Uint8Array(arrayBuffer));

```

![](data:image/png;base64...)

## Streaming tokens[¶](#streaming-tokens "Permanent link")

And now we can use the [`.streamEvents`](https://js.langchain.com/docs/how_to/streaming#using-stream-events) method to get the streamed tokens and tool calls from the OpenAI model:

```
const eventStream = await graph.streamEvents(
  { messages: [{ role: "user", content: "what's in the bedroom?" }] },
  { version: "v2" },
);

for await (const { event, name, data } of eventStream) {
  if (event === "on_custom_event") {
    console.log(name, data);
  }
}

```

```
streamed_tool_call_chunk {
  index: 0,
  id: 'call_v99reml4gZvvUypPgOpLgxM2',
  type: 'function',
  function: { name: 'get_items', arguments: '' }
}
streamed_tool_call_chunk { index: 0, function: { arguments: '{"' } }
streamed_tool_call_chunk { index: 0, function: { arguments: 'place' } }
streamed_tool_call_chunk { index: 0, function: { arguments: '":"' } }
streamed_tool_call_chunk { index: 0, function: { arguments: 'bed' } }
streamed_tool_call_chunk { index: 0, function: { arguments: 'room' } }
streamed_tool_call_chunk { index: 0, function: { arguments: '"}' } }
streamed_token { content: 'In' }
streamed_token { content: ' the' }
streamed_token { content: ' bedroom' }
streamed_token { content: ',' }
streamed_token { content: ' you' }
streamed_token { content: ' can' }
streamed_token { content: ' find' }
streamed_token { content: ' socks' }
streamed_token { content: ',' }
streamed_token { content: ' shoes' }
streamed_token { content: ',' }
streamed_token { content: ' and' }
streamed_token { content: ' dust' }
streamed_token { content: ' b' }
streamed_token { content: 'unnies' }
streamed_token { content: '.' }

```

And if you've set up LangSmith tracing, you'll also see [a trace like this one](https://smith.langchain.com/public/ddb1af36-ebe5-4ba6-9a57-87a296dc801f/r).

Was this page helpful?

Thanks for your feedback!

Thanks for your feedback! Please help us improve this page by adding to the discussion below.

Back to top

[Previous

How to stream LLM tokens from your graph](../stream-tokens/)
[Next

How to stream custom data](../streaming-content/)

Copyright © 2025 LangChain, Inc | [Consent Preferences](#__consent)

Made with
[Material for MkDocs Insiders](https://squidfunk.github.io/mkdocs-material/)

#### Cookie consent

We use cookies to recognize your repeated visits and preferences, as well as to measure the effectiveness of our documentation and whether users find what they're searching for. **Clicking "Accept" makes our documentation better. Thank you!** ❤️

* Google Analytics
* GitHub

Accept
Reject