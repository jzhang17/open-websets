[Skip to content](#how-to-use-langgraphjs-in-web-environments)

**Help us build the JS tools that power AI apps at companies like Replit, Uber, LinkedIn, GitLab, and more. [Join our team!](https://jobs.ashbyhq.com/langchain/05efa205-8560-43fd-bfcc-3f7697561cfb?utm_source=https%3A%2F%2Flangchain-ai.github.io%2Flanggraphjs%2F&utm_campaign=langgraphjs_docs)**

[![logo](../../static/wordmark_dark.svg)
![logo](../../static/wordmark_light.svg)](../..)

How to use LangGraph.js in web environments

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
      * Installation

        Installation
        + [Installation](../../how-tos#installation)
        + [How to install and manage dependencies](../manage-ecosystem-dependencies/)
        + How to use LangGraph.js in web environments

          [How to use LangGraph.js in web environments](./)

          Table of contents
          - [Passing config](#passing-config)
          - [Next steps](#next-steps)
      * [LangGraph](../../how-tos#langgraph)
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

* [Passing config](#passing-config)
* [Next steps](#next-steps)

1. [LangGraph](../..)
2. [Guides](../)
3. [How-to Guides](../)
4. [Installation](../../how-tos#installation)

# How to use LangGraph.js in web environments[¶](#how-to-use-langgraphjs-in-web-environments "Permanent link")

LangGraph.js uses the [`async_hooks`](https://nodejs.org/api/async_hooks.html)
API to more conveniently allow for tracing and callback propagation within
nodes. This API is supported in many environments, such as
[Node.js](https://nodejs.org/api/async_hooks.html),
[Deno](https://deno.land/std%400.177.0/node/internal/async_hooks.ts),
[Cloudflare Workers](https://developers.cloudflare.com/workers/runtime-apis/nodejs/asynclocalstorage/),
and the
[Edge runtime](https://vercel.com/docs/functions/runtimes/edge-runtime#compatible-node.js-modules),
but not all, such as within web browsers.

To allow usage of LangGraph.js in environments that do not have the
`async_hooks` API available, we've added a separate `@langchain/langgraph/web`
entrypoint. This entrypoint exports everything that the primary
`@langchain/langgraph` exports, but will not initialize or even import
`async_hooks`. Here's a simple example:

```
// Import from "@langchain/langgraph/web"
import {
  END,
  START,
  StateGraph,
  Annotation,
} from "@langchain/langgraph/web";
import { BaseMessage, HumanMessage } from "@langchain/core/messages";

const GraphState = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (x, y) => x.concat(y),
  }),
});

const nodeFn = async (_state: typeof GraphState.State) => {
  return { messages: [new HumanMessage("Hello from the browser!")] };
};

// Define a new graph
const workflow = new StateGraph(GraphState)
  .addNode("node", nodeFn)
  .addEdge(START, "node")
  .addEdge("node", END);

const app = workflow.compile({});

// Use the Runnable
const finalState = await app.invoke(
  { messages: [] },
);

console.log(finalState.messages[finalState.messages.length - 1].content);

```

```
Hello from the browser!

```

Other entrypoints, such as `@langchain/langgraph/prebuilt`, can be used in
either environment.

Caution

If you are using LangGraph.js on the frontend, make sure you are not exposing any private keys!
For chat models, this means you need to use something like [WebLLM](https://js.langchain.com/docs/integrations/chat/web_llm)
that can run client-side without authentication.

## Passing config[¶](#passing-config "Permanent link")

The lack of `async_hooks` support in web browsers means that if you are calling
a [`Runnable`](https://js.langchain.com/docs/concepts/runnables/) within a
node (for example, when calling a chat model), you need to manually pass a
`config` object through to properly support tracing,
[`.streamEvents()`](https://js.langchain.com/docs/how_to/streaming#using-stream-events)
to stream intermediate steps, and other callback related functionality. This
config object will passed in as the second argument of each node, and should be
used as the second parameter of any `Runnable` method.

To illustrate this, let's set up our graph again as before, but with a
`Runnable` within our node. First, we'll avoid passing `config` through into the
nested function, then try to use `.streamEvents()` to see the intermediate
results of the nested function:

```
// Import from "@langchain/langgraph/web"
import {
  END,
  START,
  StateGraph,
  Annotation,
} from "@langchain/langgraph/web";
import { BaseMessage } from "@langchain/core/messages";
import { RunnableLambda } from "@langchain/core/runnables";
import { type StreamEvent } from "@langchain/core/tracers/log_stream";

const GraphState2 = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (x, y) => x.concat(y),
  }),
});

const nodeFn2 = async (_state: typeof GraphState2.State) => {
  // Note that we do not pass any `config` through here
  const nestedFn = RunnableLambda.from(async (input: string) => {
    return new HumanMessage(`Hello from ${input}!`);
  }).withConfig({ runName: "nested" });
  const responseMessage = await nestedFn.invoke("a nested function");
  return { messages: [responseMessage] };
};

// Define a new graph
const workflow2 = new StateGraph(GraphState2)
  .addNode("node", nodeFn2)
  .addEdge(START, "node")
  .addEdge("node", END);

const app2 = workflow2.compile({});

// Stream intermediate steps from the graph
const eventStream2 = app2.streamEvents(
  { messages: [] },
  { version: "v2" },
  { includeNames: ["nested"] },
);

const events2: StreamEvent[] = [];
for await (const event of eventStream2) {
  console.log(event);
  events2.push(event);
}

console.log(`Received ${events2.length} events from the nested function`);

```

```
Received 0 events from the nested function

```

We can see that we get no events.

Next, let's try redeclaring the graph with a node that passes config through
correctly:

```
// Import from "@langchain/langgraph/web"
import {
  END,
  START,
  StateGraph,
  Annotation,
} from "@langchain/langgraph/web";
import { BaseMessage } from "@langchain/core/messages";
import { type RunnableConfig, RunnableLambda } from "@langchain/core/runnables";
import { type StreamEvent } from "@langchain/core/tracers/log_stream";

const GraphState3 = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (x, y) => x.concat(y),
  }),
});

// Note the second argument here.
const nodeFn3 = async (_state: typeof GraphState3.State, config?: RunnableConfig) => {
  // If you need to nest deeper, remember to pass `_config` when invoking
  const nestedFn = RunnableLambda.from(
    async (input: string, _config?: RunnableConfig) => {
      return new HumanMessage(`Hello from ${input}!`);
    },
  ).withConfig({ runName: "nested" });
  const responseMessage = await nestedFn.invoke("a nested function", config);
  return { messages: [responseMessage] };
};

// Define a new graph
const workflow3 = new StateGraph(GraphState3)
  .addNode("node", nodeFn3)
  .addEdge(START, "node")
  .addEdge("node", END);

const app3 = workflow3.compile({});

// Stream intermediate steps from the graph
const eventStream3 = app3.streamEvents(
  { messages: [] },
  { version: "v2" },
  { includeNames: ["nested"] },
);

const events3: StreamEvent[] = [];
for await (const event of eventStream3) {
  console.log(event);
  events3.push(event);
}

console.log(`Received ${events3.length} events from the nested function`);

```

```
{
  event: "on_chain_start",
  data: { input: { messages: [] } },
  name: "nested",
  tags: [],
  run_id: "22747451-a2fa-447b-b62f-9da19a539b2f",
  metadata: {
    langgraph_step: 1,
    langgraph_node: "node",
    langgraph_triggers: [ "start:node" ],
    langgraph_task_idx: 0,
    __pregel_resuming: false,
    checkpoint_id: "1ef62793-f065-6840-fffe-cdfb4cbb1248",
    checkpoint_ns: "node"
  }
}
{
  event: "on_chain_end",
  data: {
    output: HumanMessage {
      "content": "Hello from a nested function!",
      "additional_kwargs": {},
      "response_metadata": {}
    }
  },
  run_id: "22747451-a2fa-447b-b62f-9da19a539b2f",
  name: "nested",
  tags: [],
  metadata: {
    langgraph_step: 1,
    langgraph_node: "node",
    langgraph_triggers: [ "start:node" ],
    langgraph_task_idx: 0,
    __pregel_resuming: false,
    checkpoint_id: "1ef62793-f065-6840-fffe-cdfb4cbb1248",
    checkpoint_ns: "node"
  }
}
Received 2 events from the nested function

```

You can see that we get events from the nested function as expected.

## Next steps[¶](#next-steps "Permanent link")

You've now learned about some special considerations around using LangGraph.js
in web environments.

Next, check out
[some how-to guides on core functionality](/langgraphjs/how-tos/#core).

Was this page helpful?

Thanks for your feedback!

Thanks for your feedback! Please help us improve this page by adding to the discussion below.

Back to top

[Previous

How to install and manage dependencies](../manage-ecosystem-dependencies/)
[Next

How to create map-reduce branches for parallel execution](../map-reduce/)

Copyright © 2025 LangChain, Inc | [Consent Preferences](#__consent)

Made with
[Material for MkDocs Insiders](https://squidfunk.github.io/mkdocs-material/)

#### Cookie consent

We use cookies to recognize your repeated visits and preferences, as well as to measure the effectiveness of our documentation and whether users find what they're searching for. **Clicking "Accept" makes our documentation better. Thank you!** ❤️

* Google Analytics
* GitHub

Accept
Reject