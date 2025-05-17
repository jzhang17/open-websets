[ Skip to content](#functional-api) 

**Help us build the JS tools that power AI apps at companies like Replit, Uber, LinkedIn, GitLab, and more. [Join our team!](https://jobs.ashbyhq.com/langchain/05efa205-8560-43fd-bfcc-3f7697561cfb?utm%5Fsource=https%3A%2F%2Flangchain-ai.github.io%2Flanggraphjs%2F&utm%5Fcampaign=langgraphjs%5Fdocs)** 

[ ![logo](../../static/wordmark_dark.svg) ![logo](../../static/wordmark_light.svg) ](../..) 

 Functional API 

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
         * [  How-to Guides ](../../how-tos/)  
         * [  Concepts ](../)  
          Concepts  
                  * LangGraph  
                   LangGraph  
                              * [  LangGraph ](../../concepts#langgraph)  
                              * [  Why LangGraph? ](../high%5Flevel/)  
                              * [  LangGraph Glossary ](../low%5Flevel/)  
                              * [  Agent architectures ](../agentic%5Fconcepts/)  
                              * [  Multi-agent Systems ](../multi%5Fagent/)  
                              * [  Human-in-the-loop ](../human%5Fin%5Fthe%5Floop/)  
                              * [  Persistence ](../persistence/)  
                              * [  Memory ](../memory/)  
                              * [  Streaming ](../streaming/)  
                              * Functional API [  Functional API ](./)  
                               Table of contents  
                                             * [  Overview ](#overview)  
                                             * [  Example ](#example)  
                                             * [  Entrypoint ](#entrypoint)  
                                                               * [  Definition ](#definition)  
                                                               * [  Injectable Parameters ](#injectable-parameters)  
                                                               * [  Executing ](#executing)  
                                                               * [  Resuming ](#resuming)  
                                                               * [  State Management ](#state-management)  
                                                                                    * [  entrypoint.final ](#entrypointfinal)  
                                             * [  Task ](#task)  
                                                               * [  Definition ](#definition%5F1)  
                                                               * [  Execution ](#execution)  
                                                               * [  Retry Policy ](#retry-policy)  
                                             * [  When to use a task ](#when-to-use-a-task)  
                                             * [  Serialization ](#serialization)  
                                             * [  Determinism ](#determinism)  
                                             * [  Idempotency ](#idempotency)  
                                             * [  Functional API vs. Graph API ](#functional-api-vs-graph-api)  
                                             * [  Common Pitfalls ](#common-pitfalls)  
                                                               * [  Handling side effects ](#handling-side-effects)  
                                                               * [  Non-deterministic control flow ](#non-deterministic-control-flow)  
                                             * [  Patterns ](#patterns)  
                                                               * [  Parallel execution ](#parallel-execution)  
                                                               * [  Calling subgraphs ](#calling-subgraphs)  
                                                               * [  Calling other entrypoints ](#calling-other-entrypoints)  
                                                               * [  Streaming custom data ](#streaming-custom-data)  
                                                               * [  Resuming after an error ](#resuming-after-an-error)  
                                                               * [  Human-in-the-loop ](#human-in-the-loop)  
                                                               * [  Short-term memory ](#short-term-memory)  
                                                               * [  Long-term memory ](#long-term-memory)  
                                                               * [  Workflows ](#workflows)  
                                                               * [  Agents ](#agents)  
                  * [  LangGraph Platform ](../../concepts#langgraph-platform)  
         * [  Tutorials ](../../tutorials/)  
   * Resources  
    Resources  
         * [  Adopters ](../../adopters/)  
         * [  LLMS-txt ](../../llms-txt-overview/)  
         * [  FAQ ](../faq/)  
         * [  Troubleshooting ](../../troubleshooting/errors/)  
         * [  LangGraph Academy Course ](https://academy.langchain.com/courses/intro-to-langgraph)
* [  Agents ](../../agents/overview/)
* [  API reference ](../../reference/)
* [  Versions ](../../versions/)

 Table of contents 
* [  Overview ](#overview)
* [  Example ](#example)
* [  Entrypoint ](#entrypoint)  
   * [  Definition ](#definition)  
   * [  Injectable Parameters ](#injectable-parameters)  
   * [  Executing ](#executing)  
   * [  Resuming ](#resuming)  
   * [  State Management ](#state-management)  
         * [  entrypoint.final ](#entrypointfinal)
* [  Task ](#task)  
   * [  Definition ](#definition%5F1)  
   * [  Execution ](#execution)  
   * [  Retry Policy ](#retry-policy)
* [  When to use a task ](#when-to-use-a-task)
* [  Serialization ](#serialization)
* [  Determinism ](#determinism)
* [  Idempotency ](#idempotency)
* [  Functional API vs. Graph API ](#functional-api-vs-graph-api)
* [  Common Pitfalls ](#common-pitfalls)  
   * [  Handling side effects ](#handling-side-effects)  
   * [  Non-deterministic control flow ](#non-deterministic-control-flow)
* [  Patterns ](#patterns)  
   * [  Parallel execution ](#parallel-execution)  
   * [  Calling subgraphs ](#calling-subgraphs)  
   * [  Calling other entrypoints ](#calling-other-entrypoints)  
   * [  Streaming custom data ](#streaming-custom-data)  
   * [  Resuming after an error ](#resuming-after-an-error)  
   * [  Human-in-the-loop ](#human-in-the-loop)  
   * [  Short-term memory ](#short-term-memory)  
   * [  Long-term memory ](#long-term-memory)  
   * [  Workflows ](#workflows)  
   * [  Agents ](#agents)

1. [  LangGraph ](../..)
2. [  Guides ](../../how-tos/)
3. [  Concepts ](../)
4. [  LangGraph ](../../concepts#langgraph)

# Functional API[¶](#functional-api "Permanent link")

Note

The Functional API requires `@langchain/langgraph>=0.2.42`.

## Overview[¶](#overview "Permanent link")

The **Functional API** allows you to add LangGraph's key features -- [persistence](../persistence/), [memory](../memory/), [human-in-the-loop](../human%5Fin%5Fthe%5Floop/), and [streaming](../streaming/) — to your applications with minimal changes to your existing code.

It is designed to integrate these features into existing code that may use standard language primitives for branching and control flow, such as `if` statements, `for` loops, and function calls. Unlike many data orchestration frameworks that require restructuring code into an explicit pipeline or DAG, the Functional API allows you to incorporate these capabilities without enforcing a rigid execution model. 

The **Functional API** uses two key building blocks: 

* **`entrypoint`** – An **entrypoint** is a wrapper that takes a function as the starting point of a workflow. It encapsulates workflow logic and manages execution flow, including handling _long-running tasks_ and [interrupts](../human%5Fin%5Fthe%5Floop/).
* **`task`** – Represents a discrete unit of work, such as an API call or data processing step, that can be executed asynchronously within an entrypoint. Tasks return a future-like object that can be awaited or resolved synchronously.

This provides a minimal abstraction for building workflows with state management and streaming.

Tip

For users who prefer a more declarative approach, LangGraph's [Graph API](../low%5Flevel/) allows you to define workflows using a Graph paradigm. Both APIs share the same underlying runtime, so you can use them together in the same application. Please see the [Functional API vs. Graph API](#functional-api-vs-graph-api) section for a comparison of the two paradigms.

## Example[¶](#example "Permanent link")

Below we demonstrate a simple application that writes an essay and [interrupts](../human%5Fin%5Fthe%5Floop/) to request human review.

`` [](#%5F%5Fcodelineno-0-1)import { task, entrypoint, interrupt, MemorySaver } from "@langchain/langgraph";
[](#%5F%5Fcodelineno-0-2)
[](#%5F%5Fcodelineno-0-3)const writeEssay = task("write_essay", (topic: string): string => {
[](#%5F%5Fcodelineno-0-4)  // A placeholder for a long-running task.
[](#%5F%5Fcodelineno-0-5)  return `An essay about topic: ${topic}`;
[](#%5F%5Fcodelineno-0-6)});
[](#%5F%5Fcodelineno-0-7)
[](#%5F%5Fcodelineno-0-8)const workflow = entrypoint(
[](#%5F%5Fcodelineno-0-9)  { checkpointer: new MemorySaver(), name: "workflow" },
[](#%5F%5Fcodelineno-0-10)  async (topic: string) => {
[](#%5F%5Fcodelineno-0-11)    const essay = await writeEssay(topic);
[](#%5F%5Fcodelineno-0-12)    const isApproved = interrupt({
[](#%5F%5Fcodelineno-0-13)      // Any json-serializable payload provided to interrupt as argument.
[](#%5F%5Fcodelineno-0-14)      // It will be surfaced on the client side as an Interrupt when streaming data
[](#%5F%5Fcodelineno-0-15)      // from the workflow.
[](#%5F%5Fcodelineno-0-16)      essay, // The essay we want reviewed.
[](#%5F%5Fcodelineno-0-17)      // We can add any additional information that we need.
[](#%5F%5Fcodelineno-0-18)      // For example, introduce a key called "action" with some instructions.
[](#%5F%5Fcodelineno-0-19)      action: "Please approve/reject the essay",
[](#%5F%5Fcodelineno-0-20)    });
[](#%5F%5Fcodelineno-0-21)
[](#%5F%5Fcodelineno-0-22)    return {
[](#%5F%5Fcodelineno-0-23)      essay, // The essay that was generated
[](#%5F%5Fcodelineno-0-24)      isApproved, // Response from HIL
[](#%5F%5Fcodelineno-0-25)    };
[](#%5F%5Fcodelineno-0-26)  }
[](#%5F%5Fcodelineno-0-27));
 ``

Detailed Explanation 

This workflow will write an essay about the topic "cat" and then pause to get a review from a human. The workflow can be interrupted for an indefinite amount of time until a review is provided.

When the workflow is resumed, it executes from the very start, but because the result of the `writeEssay` task was already saved, the task result will be loaded from the checkpoint instead of being recomputed.

`` [](#%5F%5Fcodelineno-1-1)import { task, entrypoint, interrupt, MemorySaver, Command } from "@langchain/langgraph";
[](#%5F%5Fcodelineno-1-2)
[](#%5F%5Fcodelineno-1-3)const writeEssay = task("write_essay", (topic: string): string => {
[](#%5F%5Fcodelineno-1-4)  return `An essay about topic: ${topic}`;
[](#%5F%5Fcodelineno-1-5)});
[](#%5F%5Fcodelineno-1-6)
[](#%5F%5Fcodelineno-1-7)const workflow = entrypoint(
[](#%5F%5Fcodelineno-1-8)  { checkpointer: new MemorySaver(), name: "workflow" },
[](#%5F%5Fcodelineno-1-9)  async (topic: string) => {
[](#%5F%5Fcodelineno-1-10)    const essay = await writeEssay(topic);
[](#%5F%5Fcodelineno-1-11)    const isApproved = interrupt({
[](#%5F%5Fcodelineno-1-12)      essay, // The essay we want reviewed.
[](#%5F%5Fcodelineno-1-13)      action: "Please approve/reject the essay",
[](#%5F%5Fcodelineno-1-14)    });
[](#%5F%5Fcodelineno-1-15)
[](#%5F%5Fcodelineno-1-16)    return {
[](#%5F%5Fcodelineno-1-17)      essay,
[](#%5F%5Fcodelineno-1-18)      isApproved,
[](#%5F%5Fcodelineno-1-19)    };
[](#%5F%5Fcodelineno-1-20)  }
[](#%5F%5Fcodelineno-1-21));
[](#%5F%5Fcodelineno-1-22)
[](#%5F%5Fcodelineno-1-23)const threadId = crypto.randomUUID();
[](#%5F%5Fcodelineno-1-24)
[](#%5F%5Fcodelineno-1-25)const config = {
[](#%5F%5Fcodelineno-1-26)  configurable: {
[](#%5F%5Fcodelineno-1-27)    thread_id: threadId,
[](#%5F%5Fcodelineno-1-28)  },
[](#%5F%5Fcodelineno-1-29)};
[](#%5F%5Fcodelineno-1-30)
[](#%5F%5Fcodelineno-1-31)for await (const item of await workflow.stream("cat", config)) {
[](#%5F%5Fcodelineno-1-32)  console.log(item);
[](#%5F%5Fcodelineno-1-33)}
 ``

`[](#%5F%5Fcodelineno-2-1){ write_essay: 'An essay about topic: cat' }
[](#%5F%5Fcodelineno-2-2){ __interrupt__: [{
[](#%5F%5Fcodelineno-2-3)  value: { essay: 'An essay about topic: cat', action: 'Please approve/reject the essay' },
[](#%5F%5Fcodelineno-2-4)  resumable: true,
[](#%5F%5Fcodelineno-2-5)  ns: ['workflow:f7b8508b-21c0-8b4c-5958-4e8de74d2684'],
[](#%5F%5Fcodelineno-2-6)  when: 'during'
[](#%5F%5Fcodelineno-2-7)}] }
`

An essay has been written and is ready for review. Once the review is provided, we can resume the workflow:

`[](#%5F%5Fcodelineno-3-1)// Get review from a user (e.g., via a UI)
[](#%5F%5Fcodelineno-3-2)// In this case, we're using a bool, but this can be any json-serializable value.
[](#%5F%5Fcodelineno-3-3)const humanReview = true;
[](#%5F%5Fcodelineno-3-4)
[](#%5F%5Fcodelineno-3-5)for await (const item of await workflow.stream(new Command({ resume: humanReview }), config)) {
[](#%5F%5Fcodelineno-3-6)  console.log(item);
[](#%5F%5Fcodelineno-3-7)}
`

`[](#%5F%5Fcodelineno-4-1){ workflow: { essay: 'An essay about topic: cat', isApproved: true } }
`

The workflow has been completed and the review has been added to the essay.

## Entrypoint[¶](#entrypoint "Permanent link")

The [entrypoint](/langgraphjs/reference/functions/langgraph.entrypoint-1.html) function can be used to create a workflow from a function. It encapsulates workflow logic and manages execution flow, including handling _long-running tasks_ and [interrupts](../low%5Flevel/#interrupt).

### Definition[¶](#definition "Permanent link")

An **entrypoint** is defined by passing a function to the `entrypoint` function.

The function **must accept a single positional argument**, which serves as the workflow input. If you need to pass multiple pieces of data, use an object as the input type for the first argument.

You will often want to pass a **checkpointer** to the `entrypoint` function to enable persistence and use features like **human-in-the-loop**.

`[](#%5F%5Fcodelineno-5-1)import { entrypoint, MemorySaver } from "@langchain/langgraph";
[](#%5F%5Fcodelineno-5-2)
[](#%5F%5Fcodelineno-5-3)const checkpointer = new MemorySaver();
[](#%5F%5Fcodelineno-5-4)
[](#%5F%5Fcodelineno-5-5)const myWorkflow = entrypoint(
[](#%5F%5Fcodelineno-5-6)  { checkpointer, name: "myWorkflow" },
[](#%5F%5Fcodelineno-5-7)  async (someInput: Record<string, any>): Promise<number> => {
[](#%5F%5Fcodelineno-5-8)    // some logic that may involve long-running tasks like API calls,
[](#%5F%5Fcodelineno-5-9)    // and may be interrupted for human-in-the-loop.
[](#%5F%5Fcodelineno-5-10)    return result;
[](#%5F%5Fcodelineno-5-11)  }
[](#%5F%5Fcodelineno-5-12));
`

Serialization

The **inputs** and **outputs** of entrypoints must be JSON-serializable to support checkpointing. Please see the [serialization](#serialization) section for more details.

### Injectable Parameters[¶](#injectable-parameters "Permanent link")

When declaring an `entrypoint`, you can access additional parameters that will be injected automatically at run time by using the [getPreviousState](/langgraphjs/reference/functions/langgraph.getPreviousState.html) function and other utilities. These parameters include:

| Parameter              | Description                                                                                                                                                                                                                                                                                 |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **config**             | For accessing runtime configuration. Automatically populated as the second argument to the entrypoint function (but not task, since tasks can have a variable number of arguments). See [RunnableConfig](https://js.langchain.com/docs/concepts/runnables/#runnableconfig) for information. |
| **config.store**       | An instance of [BaseStore](/langgraphjs/reference/classes/checkpoint.BaseStore.html). Useful for [long-term memory](#long-term-memory).                                                                                                                                                     |
| **config.writer**      | A writer used for streaming back custom data. See the [guide on streaming custom data](../../how-tos/streaming-content/)                                                                                                                                                                    |
| **getPreviousState()** | Access the state associated with the previous checkpoint for the given thread using [getPreviousState](/langgraphjs/reference/functions/langgraph.getPreviousState.html). See [state management](#state-management).                                                                        |

Requesting Injectable Parameters 

`[](#%5F%5Fcodelineno-6-1)import {
[](#%5F%5Fcodelineno-6-2)  entrypoint,
[](#%5F%5Fcodelineno-6-3)  getPreviousState,
[](#%5F%5Fcodelineno-6-4)  BaseStore,
[](#%5F%5Fcodelineno-6-5)  InMemoryStore,
[](#%5F%5Fcodelineno-6-6)} from "@langchain/langgraph";
[](#%5F%5Fcodelineno-6-7)import { RunnableConfig } from "@langchain/core/runnables";
[](#%5F%5Fcodelineno-6-8)
[](#%5F%5Fcodelineno-6-9)const inMemoryStore = new InMemoryStore(...);  // An instance of InMemoryStore for long-term memory
[](#%5F%5Fcodelineno-6-10)
[](#%5F%5Fcodelineno-6-11)const myWorkflow = entrypoint(
[](#%5F%5Fcodelineno-6-12)  {
[](#%5F%5Fcodelineno-6-13)    checkpointer,  // Specify the checkpointer
[](#%5F%5Fcodelineno-6-14)    store: inMemoryStore,  // Specify the store
[](#%5F%5Fcodelineno-6-15)    name: "myWorkflow",
[](#%5F%5Fcodelineno-6-16)  },
[](#%5F%5Fcodelineno-6-17)  async (someInput: Record<string, any>) => {
[](#%5F%5Fcodelineno-6-18)    const previous = getPreviousState<any>(); // For short-term memory
[](#%5F%5Fcodelineno-6-19)    // Rest of workflow logic...
[](#%5F%5Fcodelineno-6-20)  }
[](#%5F%5Fcodelineno-6-21));
`

### Executing[¶](#executing "Permanent link")

Using the [entrypoint](#entrypoint) function will return an object that can be executed using the `invoke` and `stream` methods.

InvokeStream

`[](#%5F%5Fcodelineno-7-1)const config = {
[](#%5F%5Fcodelineno-7-2)  configurable: {
[](#%5F%5Fcodelineno-7-3)    thread_id: "some_thread_id",
[](#%5F%5Fcodelineno-7-4)  },
[](#%5F%5Fcodelineno-7-5)};
[](#%5F%5Fcodelineno-7-6)await myWorkflow.invoke(someInput, config);  // Wait for the result
`

`[](#%5F%5Fcodelineno-8-1)const config = {
[](#%5F%5Fcodelineno-8-2)  configurable: {
[](#%5F%5Fcodelineno-8-3)    thread_id: "some_thread_id",
[](#%5F%5Fcodelineno-8-4)  },
[](#%5F%5Fcodelineno-8-5)};
[](#%5F%5Fcodelineno-8-6)
[](#%5F%5Fcodelineno-8-7)for await (const chunk of await myWorkflow.stream(someInput, config)) {
[](#%5F%5Fcodelineno-8-8)  console.log(chunk);
[](#%5F%5Fcodelineno-8-9)}
`

### Resuming[¶](#resuming "Permanent link")

Resuming an execution after an [interrupt](/langgraphjs/reference/functions/langgraph.interrupt-1.html) can be done by passing a **resume** value to the [Command](/langgraphjs/reference/classes/langgraph.Command.html) primitive.

InvokeStream

`[](#%5F%5Fcodelineno-9-1)import { Command } from "@langchain/langgraph";
[](#%5F%5Fcodelineno-9-2)
[](#%5F%5Fcodelineno-9-3)const config = {
[](#%5F%5Fcodelineno-9-4)  configurable: {
[](#%5F%5Fcodelineno-9-5)    thread_id: "some_thread_id",
[](#%5F%5Fcodelineno-9-6)  },
[](#%5F%5Fcodelineno-9-7)};
[](#%5F%5Fcodelineno-9-8)
[](#%5F%5Fcodelineno-9-9)await myWorkflow.invoke(new Command({ resume: someResumeValue }), config);
`

`[](#%5F%5Fcodelineno-10-1)import { Command } from "@langchain/langgraph";
[](#%5F%5Fcodelineno-10-2)
[](#%5F%5Fcodelineno-10-3)const config = {
[](#%5F%5Fcodelineno-10-4)  configurable: {
[](#%5F%5Fcodelineno-10-5)    thread_id: "some_thread_id",
[](#%5F%5Fcodelineno-10-6)  },
[](#%5F%5Fcodelineno-10-7)};
[](#%5F%5Fcodelineno-10-8)
[](#%5F%5Fcodelineno-10-9)const stream = await myWorkflow.stream(
[](#%5F%5Fcodelineno-10-10)  new Command({ resume: someResumeValue }),
[](#%5F%5Fcodelineno-10-11)  config,
[](#%5F%5Fcodelineno-10-12));
[](#%5F%5Fcodelineno-10-13)
[](#%5F%5Fcodelineno-10-14)for await (const chunk of stream) {
[](#%5F%5Fcodelineno-10-15)  console.log(chunk);
[](#%5F%5Fcodelineno-10-16)}
`

**Resuming after transient error**

To resume after a transient error (such as a model provider outage), run the `entrypoint` with a `null` and the same **thread id** (config).

This assumes that the underlying **error** has been resolved and execution can proceed successfully.

InvokeStream

`[](#%5F%5Fcodelineno-11-1)const config = {
[](#%5F%5Fcodelineno-11-2)  configurable: {
[](#%5F%5Fcodelineno-11-3)    thread_id: "some_thread_id",
[](#%5F%5Fcodelineno-11-4)  },
[](#%5F%5Fcodelineno-11-5)};
[](#%5F%5Fcodelineno-11-6)
[](#%5F%5Fcodelineno-11-7)await myWorkflow.invoke(null, config);
`

`[](#%5F%5Fcodelineno-12-1)const config = {
[](#%5F%5Fcodelineno-12-2)  configurable: {
[](#%5F%5Fcodelineno-12-3)    thread_id: "some_thread_id",
[](#%5F%5Fcodelineno-12-4)  },
[](#%5F%5Fcodelineno-12-5)};
[](#%5F%5Fcodelineno-12-6)
[](#%5F%5Fcodelineno-12-7)for await (const chunk of await myWorkflow.stream(null, config)) {
[](#%5F%5Fcodelineno-12-8)  console.log(chunk);
[](#%5F%5Fcodelineno-12-9)}
`

### State Management[¶](#state-management "Permanent link")

When an `entrypoint` is defined with a `checkpointer`, it stores information between successive invocations on the same **thread id** in [checkpoints](../persistence/#checkpoints).

This allows accessing the state from the previous invocation using the [getPreviousState](/langgraphjs/reference/functions/langgraph.getPreviousState.html) function.

By default, the previous state is the return value of the previous invocation.

`[](#%5F%5Fcodelineno-13-1)const myWorkflow = entrypoint(
[](#%5F%5Fcodelineno-13-2)  { checkpointer, name: "myWorkflow" },
[](#%5F%5Fcodelineno-13-3)  async (number: number) => {
[](#%5F%5Fcodelineno-13-4)    const previous = getPreviousState<number>();
[](#%5F%5Fcodelineno-13-5)    return number + (previous ?? 0);
[](#%5F%5Fcodelineno-13-6)  }
[](#%5F%5Fcodelineno-13-7));
[](#%5F%5Fcodelineno-13-8)
[](#%5F%5Fcodelineno-13-9)const config = {
[](#%5F%5Fcodelineno-13-10)  configurable: {
[](#%5F%5Fcodelineno-13-11)    thread_id: "some_thread_id",
[](#%5F%5Fcodelineno-13-12)  },
[](#%5F%5Fcodelineno-13-13)};
[](#%5F%5Fcodelineno-13-14)
[](#%5F%5Fcodelineno-13-15)await myWorkflow.invoke(1, config); // 1 (previous was undefined)
[](#%5F%5Fcodelineno-13-16)await myWorkflow.invoke(2, config); // 3 (previous was 1 from the previous invocation)
`

#### `entrypoint.final`[¶](#entrypointfinal "Permanent link")

[entrypoint.final](/langgraphjs/reference/functions/langgraph.entrypoint.final.html) is a special primitive that can be returned from an entrypoint and allows **decoupling** the value that is **saved in the checkpoint** from the **return value of the entrypoint**.

The first value is the return value of the entrypoint, and the second value is the value that will be saved in the checkpoint.

`[](#%5F%5Fcodelineno-14-1)const myWorkflow = entrypoint(
[](#%5F%5Fcodelineno-14-2)  { checkpointer, name: "myWorkflow" },
[](#%5F%5Fcodelineno-14-3)  async (number: number) => {
[](#%5F%5Fcodelineno-14-4)    const previous = getPreviousState<number>();
[](#%5F%5Fcodelineno-14-5)    // This will return the previous value to the caller, saving
[](#%5F%5Fcodelineno-14-6)    // 2 * number to the checkpoint, which will be used in the next invocation
[](#%5F%5Fcodelineno-14-7)    // for the previous state
[](#%5F%5Fcodelineno-14-8)    return entrypoint.final({
[](#%5F%5Fcodelineno-14-9)      value: previous ?? 0,
[](#%5F%5Fcodelineno-14-10)      save: 2 * number,
[](#%5F%5Fcodelineno-14-11)    });
[](#%5F%5Fcodelineno-14-12)  }
[](#%5F%5Fcodelineno-14-13));
[](#%5F%5Fcodelineno-14-14)
[](#%5F%5Fcodelineno-14-15)const config = {
[](#%5F%5Fcodelineno-14-16)  configurable: {
[](#%5F%5Fcodelineno-14-17)    thread_id: "1",
[](#%5F%5Fcodelineno-14-18)  },
[](#%5F%5Fcodelineno-14-19)};
[](#%5F%5Fcodelineno-14-20)
[](#%5F%5Fcodelineno-14-21)await myWorkflow.invoke(3, config); // 0 (previous was undefined)
[](#%5F%5Fcodelineno-14-22)await myWorkflow.invoke(1, config); // 6 (previous was 3 * 2 from the previous invocation)
`

## Task[¶](#task "Permanent link")

A **task** represents a discrete unit of work, such as an API call or data processing step. It has three key characteristics:

* **Asynchronous Execution**: Tasks are designed to be executed asynchronously, allowing multiple operations to run concurrently without blocking.
* **Checkpointing**: Task results are saved to a checkpoint, enabling resumption of the workflow from the last saved state. (See [persistence](../persistence/) for more details).
* **Retries**: Tasks can be configured with a [retry policy](../low%5Flevel/#retry-policies) to handle transient errors.

### Definition[¶](#definition%5F1 "Permanent link")

Tasks are defined using the `task` function, which wraps a regular function.

`[](#%5F%5Fcodelineno-15-1)import { task } from "@langchain/langgraph";
[](#%5F%5Fcodelineno-15-2)
[](#%5F%5Fcodelineno-15-3)const slowComputation = task({"slowComputation", async (inputValue: any) => {
[](#%5F%5Fcodelineno-15-4)  // Simulate a long-running operation
[](#%5F%5Fcodelineno-15-5)  ...
[](#%5F%5Fcodelineno-15-6)  return result;
[](#%5F%5Fcodelineno-15-7)});
`

Serialization

The **outputs** of tasks **must** be JSON-serializable to support checkpointing.

### Execution[¶](#execution "Permanent link")

**Tasks** can only be called from within an **entrypoint**, another **task**, or a [state graph node](../low%5Flevel/#nodes).

Tasks _cannot_ be called directly from the main application code.

`[](#%5F%5Fcodelineno-16-1)const myWorkflow = entrypoint(
[](#%5F%5Fcodelineno-16-2)  { checkpointer, name: "myWorkflow" },
[](#%5F%5Fcodelineno-16-3)  async (someInput: number) => {
[](#%5F%5Fcodelineno-16-4)    return await slowComputation(someInput);
[](#%5F%5Fcodelineno-16-5)  }
[](#%5F%5Fcodelineno-16-6));
`

### Retry Policy[¶](#retry-policy "Permanent link")

You can specify a [retry policy](../low%5Flevel/#retry-policies) for a **task** by passing a `retry` parameter to the `task` function.

`[](#%5F%5Fcodelineno-17-1)const slowComputation = task(
[](#%5F%5Fcodelineno-17-2)  {
[](#%5F%5Fcodelineno-17-3)    name: "slowComputation",
[](#%5F%5Fcodelineno-17-4)    // only attempt to run this task once before giving up
[](#%5F%5Fcodelineno-17-5)    retry: { maxAttempts: 1 },
[](#%5F%5Fcodelineno-17-6)  },
[](#%5F%5Fcodelineno-17-7)  async (inputValue: any) => {
[](#%5F%5Fcodelineno-17-8)    // A long-running operation that may fail
[](#%5F%5Fcodelineno-17-9)    return result;
[](#%5F%5Fcodelineno-17-10)  }
[](#%5F%5Fcodelineno-17-11));
`

## When to use a task[¶](#when-to-use-a-task "Permanent link")

**Tasks** are useful in the following scenarios:

* **Checkpointing**: When you need to save the result of a long-running operation to a checkpoint, so you don't need to recompute it when resuming the workflow.
* **Human-in-the-loop**: If you're building a workflow that requires human intervention, you MUST use **tasks** to encapsulate any randomness (e.g., API calls) to ensure that the workflow can be resumed correctly. See the [determinism](#determinism) section for more details.
* **Parallel Execution**: For I/O-bound tasks, **tasks** enable parallel execution, allowing multiple operations to run concurrently without blocking (e.g., calling multiple APIs).
* **Observability**: Wrapping operations in **tasks** provides a way to track the progress of the workflow and monitor the execution of individual operations using [LangSmith](https://docs.smith.langchain.com/).
* **Retryable Work**: When work needs to be retried to handle failures or inconsistencies, **tasks** provide a way to encapsulate and manage the retry logic.

## Serialization[¶](#serialization "Permanent link")

There are two key aspects to serialization in LangGraph:

1. `entrypoint` inputs and outputs must be JSON-serializable.
2. `task` outputs must be JSON-serializable.

These requirements are necessary for enabling checkpointing and workflow resumption. Use JavaScript primitives like objects, arrays, strings, numbers, and booleans to ensure that your inputs and outputs are serializable.

Serialization ensures that workflow state, such as task results and intermediate values, can be reliably saved and restored. This is critical for enabling human-in-the-loop interactions, fault tolerance, and parallel execution.

Providing non-serializable inputs or outputs will result in a runtime error when a workflow is configured with a checkpointer.

## Determinism[¶](#determinism "Permanent link")

To utilize features like **human-in-the-loop**, any randomness should be encapsulated inside of **tasks**. This guarantees that when execution is halted (e.g., for human in the loop) and then resumed, it will follow the same _sequence of steps_, even if **task** results are non-deterministic.

LangGraph achieves this behavior by persisting **task** and [**subgraph**](../low%5Flevel/#subgraphs) results as they execute. A well-designed workflow ensures that resuming execution follows the _same sequence of steps_, allowing previously computed results to be retrieved correctly without having to re-execute them. This is particularly useful for long-running **tasks** or **tasks** with non-deterministic results, as it avoids repeating previously done work and allows resuming from essentially the same

While different runs of a workflow can produce different results, resuming a **specific** run should always follow the same sequence of recorded steps. This allows LangGraph to efficiently look up **task** and **subgraph** results that were executed prior to the graph being interrupted and avoid recomputing them.

## Idempotency[¶](#idempotency "Permanent link")

Idempotency ensures that running the same operation multiple times produces the same result. This helps prevent duplicate API calls and redundant processing if a step is rerun due to a failure. Always place API calls inside **tasks** functions for checkpointing, and design them to be idempotent in case of re-execution. Re-execution can occur if a **task** starts, but does not complete successfully. Then, if the workflow is resumed, the **task** will run again. Use idempotency keys or verify existing results to avoid duplication.

## Functional API vs. Graph API[¶](#functional-api-vs-graph-api "Permanent link")

The **Functional API** and the [Graph APIs (StateGraph)](../low%5Flevel/#stategraph) provide two different paradigms to create in LangGraph. Here are some key differences:

* **Control flow**: The Functional API does not require thinking about graph structure. You can use standard Python constructs to define workflows. This will usually trim the amount of code you need to write.
* **State management**: The **GraphAPI** requires declaring a [**State**](../low%5Flevel/#state) and may require defining [**reducers**](../low%5Flevel/#reducers) to manage updates to the graph state. `@entrypoint` and `@tasks` do not require explicit state management as their state is scoped to the function and is not shared across functions.
* **Checkpointing**: Both APIs generate and use checkpoints. In the **Graph API** a new checkpoint is generated after every [superstep](../low%5Flevel/). In the **Functional API**, when tasks are executed, their results are saved to an existing checkpoint associated with the given entrypoint instead of creating a new checkpoint.
* **Visualization**: The Graph API makes it easy to visualize the workflow as a graph which can be useful for debugging, understanding the workflow, and sharing with others. The Functional API does not support visualization as the graph is dynamically generated during runtime.

## Common Pitfalls[¶](#common-pitfalls "Permanent link")

### Handling side effects[¶](#handling-side-effects "Permanent link")

Encapsulate side effects (e.g., writing to a file, sending an email) in tasks to ensure they are not executed multiple times when resuming a workflow.

IncorrectCorrect

In this example, a side effect (writing to a file) is directly included in the workflow, so it will be executed a second time when resuming the workflow.

`[](#%5F%5Fcodelineno-18-1)const myWorkflow = entrypoint(
[](#%5F%5Fcodelineno-18-2)  { checkpointer, name: "myWorkflow" },
[](#%5F%5Fcodelineno-18-3)  async (inputs: Record<string, any>) => {
[](#%5F%5Fcodelineno-18-4)    // This code will be executed a second time when resuming the workflow.
[](#%5F%5Fcodelineno-18-5)    // Which is likely not what you want.
[](#%5F%5Fcodelineno-18-6)    await fs.writeFile("output.txt", "Side effect executed");
[](#%5F%5Fcodelineno-18-7)    const value = interrupt("question");
[](#%5F%5Fcodelineno-18-8)    return value;
[](#%5F%5Fcodelineno-18-9)  }
[](#%5F%5Fcodelineno-18-10));
`

In this example, the side effect is encapsulated in a task, ensuring consistent execution upon resumption.

`[](#%5F%5Fcodelineno-19-1)import { task } from "@langchain/langgraph";
[](#%5F%5Fcodelineno-19-2)
[](#%5F%5Fcodelineno-19-3)const writeToFile = task("writeToFile", async () => {
[](#%5F%5Fcodelineno-19-4)  await fs.writeFile("output.txt", "Side effect executed");
[](#%5F%5Fcodelineno-19-5)});
[](#%5F%5Fcodelineno-19-6)
[](#%5F%5Fcodelineno-19-7)const myWorkflow = entrypoint(
[](#%5F%5Fcodelineno-19-8)  { checkpointer, name: "myWorkflow" },
[](#%5F%5Fcodelineno-19-9)  async (inputs: Record<string, any>) => {
[](#%5F%5Fcodelineno-19-10)    // The side effect is now encapsulated in a task.
[](#%5F%5Fcodelineno-19-11)    await writeToFile();
[](#%5F%5Fcodelineno-19-12)    const value = interrupt("question");
[](#%5F%5Fcodelineno-19-13)    return value;
[](#%5F%5Fcodelineno-19-14)  }
[](#%5F%5Fcodelineno-19-15));
`

### Non-deterministic control flow[¶](#non-deterministic-control-flow "Permanent link")

Operations that might give different results each time (like getting current time or random numbers) should be encapsulated in tasks to ensure that on resume, the same result is returned.

* In a task: Get random number (5) → interrupt → resume → (returns 5 again) → ...
* Not in a task: Get random number (5) → interrupt → resume → get new random number (7) → ...

This is especially important when using **human-in-the-loop** workflows with multiple interrupts calls. LangGraph keeps a list of resume values for each task/entrypoint. When an interrupt is encountered, it's matched with the corresponding resume value. This matching is strictly **index-based**, so the order of the resume values should match the order of the interrupts.

If order of execution is not maintained when resuming, one `interrupt` call may be matched with the wrong `resume` value, leading to incorrect results.

Please read the section on [determinism](#determinism) for more details.

IncorrectCorrect

In this example, the workflow uses the current time to determine which task to execute. This is non-deterministic because the result of the workflow depends on the time at which it is executed.

`[](#%5F%5Fcodelineno-20-1)const myWorkflow = entrypoint(
[](#%5F%5Fcodelineno-20-2)  { checkpointer, name: "myWorkflow" },
[](#%5F%5Fcodelineno-20-3)  async (inputs: { t0: number }) => {
[](#%5F%5Fcodelineno-20-4)    const t1 = Date.now();
[](#%5F%5Fcodelineno-20-5)
[](#%5F%5Fcodelineno-20-6)    const deltaT = t1 - inputs.t0;
[](#%5F%5Fcodelineno-20-7)
[](#%5F%5Fcodelineno-20-8)    if (deltaT > 1000) {
[](#%5F%5Fcodelineno-20-9)      const result = await slowTask(1);
[](#%5F%5Fcodelineno-20-10)      const value = interrupt("question");
[](#%5F%5Fcodelineno-20-11)      return { result, value };
[](#%5F%5Fcodelineno-20-12)    } else {
[](#%5F%5Fcodelineno-20-13)      const result = await slowTask(2);
[](#%5F%5Fcodelineno-20-14)      const value = interrupt("question");
[](#%5F%5Fcodelineno-20-15)      return { result, value };
[](#%5F%5Fcodelineno-20-16)    }
[](#%5F%5Fcodelineno-20-17)  }
[](#%5F%5Fcodelineno-20-18));
`

In this example, the workflow uses the input `t0` to determine which task to execute. This is deterministic because the result of the workflow depends only on the input.

`[](#%5F%5Fcodelineno-21-1)import { task } from "@langchain/langgraph";
[](#%5F%5Fcodelineno-21-2)
[](#%5F%5Fcodelineno-21-3)const getTime = task("getTime", () => Date.now());
[](#%5F%5Fcodelineno-21-4)
[](#%5F%5Fcodelineno-21-5)const myWorkflow = entrypoint(
[](#%5F%5Fcodelineno-21-6)  { checkpointer, name: "myWorkflow" },
[](#%5F%5Fcodelineno-21-7)  async (inputs: { t0: number }) => {
[](#%5F%5Fcodelineno-21-8)    const t1 = await getTime();
[](#%5F%5Fcodelineno-21-9)
[](#%5F%5Fcodelineno-21-10)    const deltaT = t1 - inputs.t0;
[](#%5F%5Fcodelineno-21-11)
[](#%5F%5Fcodelineno-21-12)    if (deltaT > 1000) {
[](#%5F%5Fcodelineno-21-13)      const result = await slowTask(1);
[](#%5F%5Fcodelineno-21-14)      const value = interrupt("question");
[](#%5F%5Fcodelineno-21-15)      return { result, value };
[](#%5F%5Fcodelineno-21-16)    } else {
[](#%5F%5Fcodelineno-21-17)      const result = await slowTask(2);
[](#%5F%5Fcodelineno-21-18)      const value = interrupt("question");
[](#%5F%5Fcodelineno-21-19)      return { result, value };
[](#%5F%5Fcodelineno-21-20)    }
[](#%5F%5Fcodelineno-21-21)  }
[](#%5F%5Fcodelineno-21-22));
`

## Patterns[¶](#patterns "Permanent link")

Below are a few simple patterns that show examples of **how to** use the **Functional API**.

When defining an `entrypoint`, input is restricted to the first argument of the function. To pass multiple inputs, you can use an object.

`[](#%5F%5Fcodelineno-22-1)const myWorkflow = entrypoint(
[](#%5F%5Fcodelineno-22-2)  { checkpointer, name: "myWorkflow" },
[](#%5F%5Fcodelineno-22-3)  async (inputs: { value: number; anotherValue: number }) => {
[](#%5F%5Fcodelineno-22-4)    const value = inputs.value;
[](#%5F%5Fcodelineno-22-5)    const anotherValue = inputs.anotherValue;
[](#%5F%5Fcodelineno-22-6)    ...
[](#%5F%5Fcodelineno-22-7)  }
[](#%5F%5Fcodelineno-22-8));
[](#%5F%5Fcodelineno-22-9)
[](#%5F%5Fcodelineno-22-10)await myWorkflow.invoke([{ value: 1, anotherValue: 2 }]);
`

### Parallel execution[¶](#parallel-execution "Permanent link")

Tasks can be executed in parallel by invoking them concurrently and waiting for the results. This is useful for improving performance in IO bound tasks (e.g., calling APIs for LLMs).

`[](#%5F%5Fcodelineno-23-1)const addOne = task("addOne", (number: number) => number + 1);
[](#%5F%5Fcodelineno-23-2)
[](#%5F%5Fcodelineno-23-3)const graph = entrypoint(
[](#%5F%5Fcodelineno-23-4)  { checkpointer, name: "graph" },
[](#%5F%5Fcodelineno-23-5)  async (numbers: number[]) => {
[](#%5F%5Fcodelineno-23-6)    return await Promise.all(numbers.map(addOne));
[](#%5F%5Fcodelineno-23-7)  }
[](#%5F%5Fcodelineno-23-8));
`

### Calling subgraphs[¶](#calling-subgraphs "Permanent link")

The **Functional API** and the [**Graph API**](../low%5Flevel/) can be used together in the same application as they share the same underlying runtime.

`[](#%5F%5Fcodelineno-24-1)import { entrypoint, StateGraph } from "@langchain/langgraph";
[](#%5F%5Fcodelineno-24-2)
[](#%5F%5Fcodelineno-24-3)const builder = new StateGraph();
[](#%5F%5Fcodelineno-24-4)...
[](#%5F%5Fcodelineno-24-5)const someGraph = builder.compile();
[](#%5F%5Fcodelineno-24-6)
[](#%5F%5Fcodelineno-24-7)const someWorkflow = entrypoint(
[](#%5F%5Fcodelineno-24-8)  { name: "someWorkflow" },
[](#%5F%5Fcodelineno-24-9)  async (someInput: Record<string, any>) => {
[](#%5F%5Fcodelineno-24-10)    // Call a graph defined using the graph API
[](#%5F%5Fcodelineno-24-11)    const result1 = await someGraph.invoke(...);
[](#%5F%5Fcodelineno-24-12)    // Call another graph defined using the graph API
[](#%5F%5Fcodelineno-24-13)    const result2 = await anotherGraph.invoke(...);
[](#%5F%5Fcodelineno-24-14)    return {
[](#%5F%5Fcodelineno-24-15)      result1,
[](#%5F%5Fcodelineno-24-16)      result2,
[](#%5F%5Fcodelineno-24-17)    };
[](#%5F%5Fcodelineno-24-18)  }
[](#%5F%5Fcodelineno-24-19));
`

### Calling other entrypoints[¶](#calling-other-entrypoints "Permanent link")

You can call other **entrypoints** from within an **entrypoint** or a **task**.

`[](#%5F%5Fcodelineno-25-1)const someOtherWorkflow = entrypoint(
[](#%5F%5Fcodelineno-25-2)  { name: "someOtherWorkflow" }, // Will automatically use the checkpointer from the parent entrypoint
[](#%5F%5Fcodelineno-25-3)  async (inputs: { value: number }) => {
[](#%5F%5Fcodelineno-25-4)    return inputs.value;
[](#%5F%5Fcodelineno-25-5)  }
[](#%5F%5Fcodelineno-25-6));
[](#%5F%5Fcodelineno-25-7)
[](#%5F%5Fcodelineno-25-8)const myWorkflow = entrypoint(
[](#%5F%5Fcodelineno-25-9)  { checkpointer, name: "myWorkflow" },
[](#%5F%5Fcodelineno-25-10)  async (inputs: Record<string, any>) => {
[](#%5F%5Fcodelineno-25-11)    const value = await someOtherWorkflow.invoke([{ value: 1 }]);
[](#%5F%5Fcodelineno-25-12)    return value;
[](#%5F%5Fcodelineno-25-13)  }
[](#%5F%5Fcodelineno-25-14));
`

### Streaming custom data[¶](#streaming-custom-data "Permanent link")

You can stream custom data from an **entrypoint** by using the `write` method on `config`. This allows you to write custom data to the `custom` stream.

`` [](#%5F%5Fcodelineno-26-1)import {
[](#%5F%5Fcodelineno-26-2)  entrypoint,
[](#%5F%5Fcodelineno-26-3)  task,
[](#%5F%5Fcodelineno-26-4)  MemorySaver,
[](#%5F%5Fcodelineno-26-5)  LangGraphRunnableConfig,
[](#%5F%5Fcodelineno-26-6)} from "@langchain/langgraph";
[](#%5F%5Fcodelineno-26-7)
[](#%5F%5Fcodelineno-26-8)const addOne = task("addOne", (x: number) => x + 1);
[](#%5F%5Fcodelineno-26-9)
[](#%5F%5Fcodelineno-26-10)const addTwo = task("addTwo", (x: number) => x + 2);
[](#%5F%5Fcodelineno-26-11)
[](#%5F%5Fcodelineno-26-12)const checkpointer = new MemorySaver();
[](#%5F%5Fcodelineno-26-13)
[](#%5F%5Fcodelineno-26-14)const main = entrypoint(
[](#%5F%5Fcodelineno-26-15)  { checkpointer, name: "main" },
[](#%5F%5Fcodelineno-26-16)  async (inputs: { number: number }, config: LangGraphRunnableConfig) => {
[](#%5F%5Fcodelineno-26-17)    config.writer?.("hello"); // Write some data to the `custom` stream
[](#%5F%5Fcodelineno-26-18)    await addOne(inputs.number); // Will write data to the `updates` stream
[](#%5F%5Fcodelineno-26-19)    config.writer?.("world"); // Write some more data to the `custom` stream
[](#%5F%5Fcodelineno-26-20)    await addTwo(inputs.number); // Will write data to the `updates` stream
[](#%5F%5Fcodelineno-26-21)    return 5;
[](#%5F%5Fcodelineno-26-22)  }
[](#%5F%5Fcodelineno-26-23));
[](#%5F%5Fcodelineno-26-24)
[](#%5F%5Fcodelineno-26-25)const config = {
[](#%5F%5Fcodelineno-26-26)  configurable: {
[](#%5F%5Fcodelineno-26-27)    thread_id: "1",
[](#%5F%5Fcodelineno-26-28)  },
[](#%5F%5Fcodelineno-26-29)};
[](#%5F%5Fcodelineno-26-30)
[](#%5F%5Fcodelineno-26-31)const stream = await main.stream(
[](#%5F%5Fcodelineno-26-32)  { number: 1 },
[](#%5F%5Fcodelineno-26-33)  { streamMode: ["custom", "updates"], ...config }
[](#%5F%5Fcodelineno-26-34));
[](#%5F%5Fcodelineno-26-35)
[](#%5F%5Fcodelineno-26-36)for await (const chunk of stream) {
[](#%5F%5Fcodelineno-26-37)  console.log(chunk);
[](#%5F%5Fcodelineno-26-38)}
 ``

`[](#%5F%5Fcodelineno-27-1)["updates", { addOne: 2 }][("updates", { addTwo: 3 })][("custom", "hello")][
[](#%5F%5Fcodelineno-27-2)  ("custom", "world")
[](#%5F%5Fcodelineno-27-3)][("updates", { main: 5 })];
`

### Resuming after an error[¶](#resuming-after-an-error "Permanent link")

`` [](#%5F%5Fcodelineno-28-1)import { entrypoint, task, MemorySaver } from "@langchain/langgraph";
[](#%5F%5Fcodelineno-28-2)
[](#%5F%5Fcodelineno-28-3)// Global variable to track the number of attempts
[](#%5F%5Fcodelineno-28-4)let attempts = 0;
[](#%5F%5Fcodelineno-28-5)
[](#%5F%5Fcodelineno-28-6)const getInfo = task("getInfo", () => {
[](#%5F%5Fcodelineno-28-7)  /*
[](#%5F%5Fcodelineno-28-8)   * Simulates a task that fails once before succeeding.
[](#%5F%5Fcodelineno-28-9)   * Throws an error on the first attempt, then returns "OK" on subsequent tries.
[](#%5F%5Fcodelineno-28-10)   */
[](#%5F%5Fcodelineno-28-11)  attempts += 1;
[](#%5F%5Fcodelineno-28-12)
[](#%5F%5Fcodelineno-28-13)  if (attempts < 2) {
[](#%5F%5Fcodelineno-28-14)    throw new Error("Failure"); // Simulate a failure on the first attempt
[](#%5F%5Fcodelineno-28-15)  }
[](#%5F%5Fcodelineno-28-16)  return "OK";
[](#%5F%5Fcodelineno-28-17)});
[](#%5F%5Fcodelineno-28-18)
[](#%5F%5Fcodelineno-28-19)// Initialize an in-memory checkpointer for persistence
[](#%5F%5Fcodelineno-28-20)const checkpointer = new MemorySaver();
[](#%5F%5Fcodelineno-28-21)
[](#%5F%5Fcodelineno-28-22)const slowTask = task("slowTask", async () => {
[](#%5F%5Fcodelineno-28-23)  /*
[](#%5F%5Fcodelineno-28-24)   * Simulates a slow-running task by introducing a 1-second delay.
[](#%5F%5Fcodelineno-28-25)   */
[](#%5F%5Fcodelineno-28-26)  await new Promise((resolve) => setTimeout(resolve, 1000));
[](#%5F%5Fcodelineno-28-27)  return "Ran slow task.";
[](#%5F%5Fcodelineno-28-28)});
[](#%5F%5Fcodelineno-28-29)
[](#%5F%5Fcodelineno-28-30)const main = entrypoint(
[](#%5F%5Fcodelineno-28-31)  { checkpointer, name: "main" },
[](#%5F%5Fcodelineno-28-32)  async (inputs: Record<string, any>) => {
[](#%5F%5Fcodelineno-28-33)    /*
[](#%5F%5Fcodelineno-28-34)     * Main workflow function that runs the slowTask and getInfo tasks sequentially.
[](#%5F%5Fcodelineno-28-35)     *
[](#%5F%5Fcodelineno-28-36)     * Parameters:
[](#%5F%5Fcodelineno-28-37)     * - inputs: Record<string, any> containing workflow input values.
[](#%5F%5Fcodelineno-28-38)     *
[](#%5F%5Fcodelineno-28-39)     * The workflow first executes `slowTask` and then attempts to execute `getInfo`,
[](#%5F%5Fcodelineno-28-40)     * which will fail on the first invocation.
[](#%5F%5Fcodelineno-28-41)     */
[](#%5F%5Fcodelineno-28-42)    const slowTaskResult = await slowTask(); // Blocking call to slowTask
[](#%5F%5Fcodelineno-28-43)    await getInfo(); // Error will be thrown here on the first attempt
[](#%5F%5Fcodelineno-28-44)    return slowTaskResult;
[](#%5F%5Fcodelineno-28-45)  }
[](#%5F%5Fcodelineno-28-46));
[](#%5F%5Fcodelineno-28-47)
[](#%5F%5Fcodelineno-28-48)// Workflow execution configuration with a unique thread identifier
[](#%5F%5Fcodelineno-28-49)const config = {
[](#%5F%5Fcodelineno-28-50)  configurable: {
[](#%5F%5Fcodelineno-28-51)    thread_id: "1", // Unique identifier to track workflow execution
[](#%5F%5Fcodelineno-28-52)  },
[](#%5F%5Fcodelineno-28-53)};
[](#%5F%5Fcodelineno-28-54)
[](#%5F%5Fcodelineno-28-55)// This invocation will take ~1 second due to the slowTask execution
[](#%5F%5Fcodelineno-28-56)try {
[](#%5F%5Fcodelineno-28-57)  // First invocation will throw an error due to the `getInfo` task failing
[](#%5F%5Fcodelineno-28-58)  await main.invoke({ anyInput: "foobar" }, config);
[](#%5F%5Fcodelineno-28-59)} catch (err) {
[](#%5F%5Fcodelineno-28-60)  // Handle the failure gracefully
[](#%5F%5Fcodelineno-28-61)}
 ``

When we resume execution, we won't need to re-run the `slowTask` as its result is already saved in the checkpoint.

`[](#%5F%5Fcodelineno-29-1)await main.invoke(null, config);
`

`[](#%5F%5Fcodelineno-30-1)"Ran slow task.";
`

### Human-in-the-loop[¶](#human-in-the-loop "Permanent link")

The functional API supports [human-in-the-loop](../human%5Fin%5Fthe%5Floop/) workflows using the `interrupt` function and the `Command` primitive.

Please see the following examples for more details:

* [How to wait for user input (Functional API)](../../how-tos/wait-user-input-functional/): Shows how to implement a simple human-in-the-loop workflow using the functional API.
* [How to review tool calls (Functional API)](../../how-tos/review-tool-calls-functional/): Guide demonstrates how to implement human-in-the-loop workflows in a ReAct agent using the LangGraph Functional API.

### Short-term memory[¶](#short-term-memory "Permanent link")

[State management](#state-management) using the [getPreviousState](/langgraphjs/reference/functions/langgraph.getPreviousState.html) function and optionally using the `entrypoint.final` primitive can be used to implement [short term memory](../memory/).

Please see the following how-to guides for more details:

* [How to add thread-level persistence (functional API)](../../how-tos/persistence-functional/): Shows how to add thread-level persistence to a functional API workflow and implements a simple chatbot.

### Long-term memory[¶](#long-term-memory "Permanent link")

[long-term memory](../memory/#long-term-memory) allows storing information across different **thread ids**. This could be useful for learning information about a given user in one conversation and using it in another.

Please see the following how-to guides for more details:

* [How to add cross-thread persistence (functional API)](../../how-tos/cross-thread-persistence-functional/): Shows how to add cross-thread persistence to a functional API workflow and implements a simple chatbot.

### Workflows[¶](#workflows "Permanent link")

* [Workflows and agent](../../tutorials/workflows/) guide for more examples of how to build workflows using the Functional API.

### Agents[¶](#agents "Permanent link")

* [How to create a React agent from scratch (Functional API)](../../how-tos/react-agent-from-scratch-functional/): Shows how to create a simple React agent from scratch using the functional API.
* [How to build a multi-agent network](../../how-tos/multi-agent-network-functional/): Shows how to build a multi-agent network using the functional API.
* [How to add multi-turn conversation in a multi-agent application (functional API)](../../how-tos/multi-agent-multi-turn-convo-functional/): allow an end-user to engage in a multi-turn conversation with one or more agents.

 Was this page helpful? 

 Thanks for your feedback!

 Thanks for your feedback! Please help us improve this page by adding to the discussion below.

 Back to top 

[  Previous  Streaming ](../streaming/) [  Next  LangGraph Platform ](../langgraph%5Fplatform/) 

 Copyright © 2025 LangChain, Inc | [Consent Preferences](#%5F%5Fconsent) 

 Made with[ Material for MkDocs Insiders](https://squidfunk.github.io/mkdocs-material/) 

[ ](https://langchain-ai.github.io/langgraph/ "langchain-ai.github.io") [ ](https://github.com/langchain-ai/langgraphjs "github.com") [ ](https://twitter.com/LangChainAI "twitter.com") 

#### Cookie consent

We use cookies to recognize your repeated visits and preferences, as well as to measure the effectiveness of our documentation and whether users find what they're searching for. **Clicking "Accept" makes our documentation better. Thank you!** ❤️

* Google Analytics
* GitHub

Accept Reject 