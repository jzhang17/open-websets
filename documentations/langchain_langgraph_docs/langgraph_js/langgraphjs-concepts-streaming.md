[Skip to content](#streaming)

**Help us build the JS tools that power AI apps at companies like Replit, Uber, LinkedIn, GitLab, and more. [Join our team!](https://jobs.ashbyhq.com/langchain/05efa205-8560-43fd-bfcc-3f7697561cfb?utm_source=https%3A%2F%2Flangchain-ai.github.io%2Flanggraphjs%2F&utm_campaign=langgraphjs_docs)**

[![logo](../../static/wordmark_dark.svg)
![logo](../../static/wordmark_light.svg)](../..)

Streaming

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
    - [How-to Guides](../../how-tos/)
    - [Concepts](../)

      Concepts
      * LangGraph

        LangGraph
        + [LangGraph](../../concepts#langgraph)
        + [Why LangGraph?](../high_level/)
        + [LangGraph Glossary](../low_level/)
        + [Agent architectures](../agentic_concepts/)
        + [Multi-agent Systems](../multi_agent/)
        + [Human-in-the-loop](../human_in_the_loop/)
        + [Persistence](../persistence/)
        + [Memory](../memory/)
        + Streaming

          [Streaming](./)

          Table of contents
          - [Streaming graph outputs (.stream)](#streaming-graph-outputs-stream)
          - [Streaming LLM tokens and events (.streamEvents)](#streaming-llm-tokens-and-events-streamevents)
        + [Functional API](../functional_api/)
      * [LangGraph Platform](../../concepts#langgraph-platform)
    - [Tutorials](../../tutorials/)
  + Resources

    Resources
    - [Adopters](../../adopters/)
    - [LLMS-txt](../../llms-txt-overview/)
    - [FAQ](../faq/)
    - [Troubleshooting](../../troubleshooting/errors/)
    - [LangGraph Academy Course](https://academy.langchain.com/courses/intro-to-langgraph)
* [Agents](../../agents/overview/)
* [API reference](../../reference/)
* [Versions](../../versions/)

Table of contents

* [Streaming graph outputs (.stream)](#streaming-graph-outputs-stream)
* [Streaming LLM tokens and events (.streamEvents)](#streaming-llm-tokens-and-events-streamevents)

1. [LangGraph](../..)
2. [Guides](../../how-tos/)
3. [Concepts](../)
4. [LangGraph](../../concepts#langgraph)

# Streaming[¶](#streaming "Permanent link")

LangGraph is built with first class support for streaming. There are several different ways to stream back outputs from a graph run

## Streaming graph outputs (`.stream`)[¶](#streaming-graph-outputs-stream "Permanent link")

`.stream` is an async method for streaming back outputs from a graph run.
There are several different modes you can specify when calling these methods (e.g. `await graph.stream(..., { ...config, streamMode: "values" })):

* [`"values"`](/langgraphjs/how-tos/stream-values): This streams the full value of the state after each step of the graph.
* [`"updates"`](/langgraphjs/how-tos/stream-updates): This streams the updates to the state after each step of the graph. If multiple updates are made in the same step (e.g. multiple nodes are run) then those updates are streamed separately.
* [`"custom"`](/langgraphjs/how-tos/streaming-content): This streams custom data from inside your graph nodes.
* [`"messages"`](/langgraphjs/how-tos/streaming-tokens): This streams LLM tokens and metadata for the graph node where LLM is invoked.
* `"debug"`: This streams as much information as possible throughout the execution of the graph.

The below visualization shows the difference between the `values` and `updates` modes:

![values vs updates](../img/streaming/values_vs_updates.png)

## Streaming LLM tokens and events (`.streamEvents`)[¶](#streaming-llm-tokens-and-events-streamevents "Permanent link")

In addition, you can use the [`streamEvents`](/langgraphjs/how-tos/streaming-events-from-within-tools) method to stream back events that happen *inside* nodes. This is useful for streaming tokens of LLM calls.

This is a standard method on all [LangChain objects](https://js.langchain.com/docs/concepts/#runnable-interface). This means that as the graph is executed, certain events are emitted along the way and can be seen if you run the graph using `.streamEvents`.

All events have (among other things) `event`, `name`, and `data` fields. What do these mean?

* `event`: This is the type of event that is being emitted. You can find a detailed table of all callback events and triggers [here](https://js.langchain.com/docs/concepts/#callback-events).
* `name`: This is the name of event.
* `data`: This is the data associated with the event.

What types of things cause events to be emitted?

* each node (runnable) emits `on_chain_start` when it starts execution, `on_chain_stream` during the node execution and `on_chain_end` when the node finishes. Node events will have the node name in the event's `name` field
* the graph will emit `on_chain_start` in the beginning of the graph execution, `on_chain_stream` after each node execution and `on_chain_end` when the graph finishes. Graph events will have the `LangGraph` in the event's `name` field
* Any writes to state channels (i.e. anytime you update the value of one of your state keys) will emit `on_chain_start` and `on_chain_end` events

Additionally, any events that are created inside your nodes (LLM events, tool events, manually emitted events, etc.) will also be visible in the output of `.streamEvents`.

To make this more concrete and to see what this looks like, let's see what events are returned when we run a simple graph:

```
import { ChatOpenAI } from "@langchain/openai";
import { StateGraph, MessagesAnnotation } from "langgraph";

const model = new ChatOpenAI({ model: "gpt-4-turbo-preview" });

function callModel(state: typeof MessagesAnnotation.State) {
  const response = model.invoke(state.messages);
  return { messages: response };
}

const workflow = new StateGraph(MessagesAnnotation)
  .addNode("callModel", callModel)
  .addEdge("start", "callModel")
  .addEdge("callModel", "end");
const app = workflow.compile();

const inputs = [{ role: "user", content: "hi!" }];

for await (const event of app.streamEvents(
  { messages: inputs },
  { version: "v2" }
)) {
  const kind = event.event;
  console.log(`${kind}: ${event.name}`);
}

```

```
on_chain_start: LangGraph
on_chain_start: __start__
on_chain_end: __start__
on_chain_start: callModel
on_chat_model_start: ChatOpenAI
on_chat_model_stream: ChatOpenAI
on_chat_model_stream: ChatOpenAI
on_chat_model_stream: ChatOpenAI
on_chat_model_stream: ChatOpenAI
on_chat_model_stream: ChatOpenAI
on_chat_model_stream: ChatOpenAI
on_chat_model_stream: ChatOpenAI
on_chat_model_stream: ChatOpenAI
on_chat_model_stream: ChatOpenAI
on_chat_model_stream: ChatOpenAI
on_chat_model_stream: ChatOpenAI
on_chat_model_end: ChatOpenAI
on_chain_start: ChannelWrite<callModel,messages>
on_chain_end: ChannelWrite<callModel,messages>
on_chain_stream: callModel
on_chain_end: callModel
on_chain_stream: LangGraph
on_chain_end: LangGraph

```

We start with the overall graph start (`on_chain_start: LangGraph`). We then write to the `__start__` node (this is special node to handle input).
We then start the `callModel` node (`on_chain_start: callModel`). We then start the chat model invocation (`on_chat_model_start: ChatOpenAI`),
stream back token by token (`on_chat_model_stream: ChatOpenAI`) and then finish the chat model (`on_chat_model_end: ChatOpenAI`). From there,
we write the results back to the channel (`ChannelWrite<callModel,messages>`) and then finish the `callModel` node and then the graph as a whole.

This should hopefully give you a good sense of what events are emitted in a simple graph. But what data do these events contain?
Each type of event contains data in a different format. Let's look at what `on_chat_model_stream` events look like. This is an important type of event
since it is needed for streaming tokens from an LLM response.

These events look like:

```
{'event': 'on_chat_model_stream',
 'name': 'ChatOpenAI',
 'run_id': '3fdbf494-acce-402e-9b50-4eab46403859',
 'tags': ['seq:step:1'],
 'metadata': {'langgraph_step': 1,
  'langgraph_node': 'callModel',
  'langgraph_triggers': ['start:callModel'],
  'langgraph_task_idx': 0,
  'checkpoint_id': '1ef657a0-0f9d-61b8-bffe-0c39e4f9ad6c',
  'checkpoint_ns': 'callModel',
  'ls_provider': 'openai',
  'ls_model_name': 'gpt-4o-mini',
  'ls_model_type': 'chat',
  'ls_temperature': 0.7},
 'data': {'chunk': AIMessageChunk({ content: 'Hello', id: 'run-3fdbf494-acce-402e-9b50-4eab46403859' })},
 'parent_ids': []}

```

We can see that we have the event type and name (which we knew from before).

We also have a bunch of stuff in metadata. Noticeably, `'langgraph_node': 'callModel',` is some really helpful information
which tells us which node this model was invoked inside of.

Finally, `data` is a really important field. This contains the actual data for this event! Which in this case
is an AIMessageChunk. This contains the `content` for the message, as well as an `id`.
This is the ID of the overall AIMessage (not just this chunk) and is super helpful - it helps
us track which chunks are part of the same message (so we can show them together in the UI).

This information contains all that is needed for creating a UI for streaming LLM tokens.

Was this page helpful?

Thanks for your feedback!

Thanks for your feedback! Please help us improve this page by adding to the discussion below.

Back to top

[Previous

Memory](../memory/)
[Next

Functional API](../functional_api/)

Copyright © 2025 LangChain, Inc | [Consent Preferences](#__consent)

Made with
[Material for MkDocs Insiders](https://squidfunk.github.io/mkdocs-material/)

#### Cookie consent

We use cookies to recognize your repeated visits and preferences, as well as to measure the effectiveness of our documentation and whether users find what they're searching for. **Clicking "Accept" makes our documentation better. Thank you!** ❤️

* Google Analytics
* GitHub

Accept
Reject