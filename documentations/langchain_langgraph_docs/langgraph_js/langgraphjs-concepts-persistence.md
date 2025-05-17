[ Skip to content](#persistence) 

**Help us build the JS tools that power AI apps at companies like Replit, Uber, LinkedIn, GitLab, and more. [Join our team!](https://jobs.ashbyhq.com/langchain/05efa205-8560-43fd-bfcc-3f7697561cfb?utm%5Fsource=https%3A%2F%2Flangchain-ai.github.io%2Flanggraphjs%2F&utm%5Fcampaign=langgraphjs%5Fdocs)** 

[ ![logo](../../static/wordmark_dark.svg) ![logo](../../static/wordmark_light.svg) ](../..) 

 Persistence 

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
                              * Persistence [  Persistence ](./)  
                               Table of contents  
                                             * [  Threads ](#threads)  
                                             * [  Checkpoints ](#checkpoints)  
                                                               * [  Get state ](#get-state)  
                                                               * [  Get state history ](#get-state-history)  
                                                               * [  Replay ](#replay)  
                                                               * [  Update state ](#update-state)  
                                                                                    * [  config ](#config)  
                                                                                    * [  values ](#values)  
                                                                                    * [  As Node ](#as-node)  
                                             * [  Memory Store ](#memory-store)  
                                             * [  Checkpointer libraries ](#checkpointer-libraries)  
                                                               * [  Checkpointer interface ](#checkpointer-interface)  
                                                               * [  Serializer ](#serializer)  
                                             * [  Capabilities ](#capabilities)  
                                                               * [  Human-in-the-loop ](#human-in-the-loop)  
                                                               * [  Memory ](#memory)  
                                                               * [  Time Travel ](#time-travel)  
                                                               * [  Fault-tolerance ](#fault-tolerance)  
                                                                                    * [  Pending writes ](#pending-writes)  
                              * [  Memory ](../memory/)  
                              * [  Streaming ](../streaming/)  
                              * [  Functional API ](../functional%5Fapi/)  
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
* [  Threads ](#threads)
* [  Checkpoints ](#checkpoints)  
   * [  Get state ](#get-state)  
   * [  Get state history ](#get-state-history)  
   * [  Replay ](#replay)  
   * [  Update state ](#update-state)  
         * [  config ](#config)  
         * [  values ](#values)  
         * [  As Node ](#as-node)
* [  Memory Store ](#memory-store)
* [  Checkpointer libraries ](#checkpointer-libraries)  
   * [  Checkpointer interface ](#checkpointer-interface)  
   * [  Serializer ](#serializer)
* [  Capabilities ](#capabilities)  
   * [  Human-in-the-loop ](#human-in-the-loop)  
   * [  Memory ](#memory)  
   * [  Time Travel ](#time-travel)  
   * [  Fault-tolerance ](#fault-tolerance)  
         * [  Pending writes ](#pending-writes)

1. [  LangGraph ](../..)
2. [  Guides ](../../how-tos/)
3. [  Concepts ](../)
4. [  LangGraph ](../../concepts#langgraph)

# Persistence[¶](#persistence "Permanent link")

LangGraph has a built-in persistence layer, implemented through checkpointers. When you compile graph with a checkpointer, the checkpointer saves a `checkpoint` of the graph state at every super-step. Those checkpoints are saved to a `thread`, which can be accessed after graph execution. Because `threads` allow access to graph's state after execution, several powerful capabilities including human-in-the-loop, memory, time travel, and fault-tolerance are all possible. See [this how-to guide](/langgraphjs/how-tos/persistence) for an end-to-end example on how to add and use checkpointers with your graph. Below, we'll discuss each of these concepts in more detail. 

![Checkpoints](../img/persistence/checkpoints.jpg)

## Threads[¶](#threads "Permanent link")

A thread is a unique ID or [thread identifier](#threads) assigned to each checkpoint saved by a checkpointer. When invoking graph with a checkpointer, you **must** specify a `thread_id` as part of the `configurable` portion of the config:

`[](#%5F%5Fcodelineno-0-1){"configurable": {"thread_id": "1"}}
`

## Checkpoints[¶](#checkpoints "Permanent link")

Checkpoint is a snapshot of the graph state saved at each super-step and is represented by `StateSnapshot` object with the following key properties:

* `config`: Config associated with this checkpoint.
* `metadata`: Metadata associated with this checkpoint.
* `values`: Values of the state channels at this point in time.
* `next` A tuple of the node names to execute next in the graph.
* `tasks`: A tuple of `PregelTask` objects that contain information about next tasks to be executed. If the step was previously attempted, it will include error information. If a graph was interrupted [dynamically](/langgraphjs/how-tos/dynamic%5Fbreakpoints) from within a node, tasks will contain additional data associated with interrupts.

Let's see what checkpoints are saved when a simple graph is invoked as follows:

`[](#%5F%5Fcodelineno-1-1)import { StateGraph, START, END, MemorySaver, Annotation } from "@langchain/langgraph";
[](#%5F%5Fcodelineno-1-2)
[](#%5F%5Fcodelineno-1-3)const GraphAnnotation = Annotation.Root({
[](#%5F%5Fcodelineno-1-4)  foo: Annotation<string>
[](#%5F%5Fcodelineno-1-5)  bar: Annotation<string[]>({
[](#%5F%5Fcodelineno-1-6)    reducer: (a, b) => [...a, ...b],
[](#%5F%5Fcodelineno-1-7)    default: () => [],
[](#%5F%5Fcodelineno-1-8)  })
[](#%5F%5Fcodelineno-1-9)});
[](#%5F%5Fcodelineno-1-10)
[](#%5F%5Fcodelineno-1-11)function nodeA(state: typeof GraphAnnotation.State) {
[](#%5F%5Fcodelineno-1-12)  return { foo: "a", bar: ["a"] };
[](#%5F%5Fcodelineno-1-13)}
[](#%5F%5Fcodelineno-1-14)
[](#%5F%5Fcodelineno-1-15)function nodeB(state: typeof GraphAnnotation.State) {
[](#%5F%5Fcodelineno-1-16)  return { foo: "b", bar: ["b"] };
[](#%5F%5Fcodelineno-1-17)}
[](#%5F%5Fcodelineno-1-18)
[](#%5F%5Fcodelineno-1-19)const workflow = new StateGraph(GraphAnnotation);
[](#%5F%5Fcodelineno-1-20)  .addNode("nodeA", nodeA)
[](#%5F%5Fcodelineno-1-21)  .addNode("nodeB", nodeB)
[](#%5F%5Fcodelineno-1-22)  .addEdge(START, "nodeA")
[](#%5F%5Fcodelineno-1-23)  .addEdge("nodeA", "nodeB")
[](#%5F%5Fcodelineno-1-24)  .addEdge("nodeB", END);
[](#%5F%5Fcodelineno-1-25)
[](#%5F%5Fcodelineno-1-26)const checkpointer = new MemorySaver();
[](#%5F%5Fcodelineno-1-27)const graph = workflow.compile({ checkpointer });
[](#%5F%5Fcodelineno-1-28)
[](#%5F%5Fcodelineno-1-29)const config = { configurable: { thread_id: "1" } };
[](#%5F%5Fcodelineno-1-30)await graph.invoke({ foo: "" }, config);
`

After we run the graph, we expect to see exactly 4 checkpoints:

* empty checkpoint with `START` as the next node to be executed
* checkpoint with the user input `{foo: '', bar: []}` and `nodeA` as the next node to be executed
* checkpoint with the outputs of `nodeA` `{foo: 'a', bar: ['a']}` and `nodeB` as the next node to be executed
* checkpoint with the outputs of `nodeB` `{foo: 'b', bar: ['a', 'b']}` and no next nodes to be executed

Note that we `bar` channel values contain outputs from both nodes as we have a reducer for `bar` channel.

### Get state[¶](#get-state "Permanent link")

When interacting with the saved graph state, you **must** specify a [thread identifier](#threads). You can view the _latest_ state of the graph by calling `await graph.getState(config)`. This will return a `StateSnapshot` object that corresponds to the latest checkpoint associated with the thread ID provided in the config or a checkpoint associated with a checkpoint ID for the thread, if provided.

`[](#%5F%5Fcodelineno-2-1)// Get the latest state snapshot
[](#%5F%5Fcodelineno-2-2)const config = { configurable: { thread_id: "1" } };
[](#%5F%5Fcodelineno-2-3)const state = await graph.getState(config);
[](#%5F%5Fcodelineno-2-4)
[](#%5F%5Fcodelineno-2-5)// Get a state snapshot for a specific checkpoint_id
[](#%5F%5Fcodelineno-2-6)const configWithCheckpoint = { configurable: { thread_id: "1", checkpoint_id: "1ef663ba-28fe-6528-8002-5a559208592c" } };
[](#%5F%5Fcodelineno-2-7)const stateWithCheckpoint = await graph.getState(configWithCheckpoint);
`

In our example, the output of `getState` will look like this:

`[](#%5F%5Fcodelineno-3-1){
[](#%5F%5Fcodelineno-3-2)  values: { foo: 'b', bar: ['a', 'b'] },
[](#%5F%5Fcodelineno-3-3)  next: [],
[](#%5F%5Fcodelineno-3-4)  config: { configurable: { thread_id: '1', checkpoint_ns: '', checkpoint_id: '1ef663ba-28fe-6528-8002-5a559208592c' } },
[](#%5F%5Fcodelineno-3-5)  metadata: { source: 'loop', writes: { nodeB: { foo: 'b', bar: ['b'] } }, step: 2 },
[](#%5F%5Fcodelineno-3-6)  created_at: '2024-08-29T19:19:38.821749+00:00',
[](#%5F%5Fcodelineno-3-7)  parent_config: { configurable: { thread_id: '1', checkpoint_ns: '', checkpoint_id: '1ef663ba-28f9-6ec4-8001-31981c2c39f8' } },
[](#%5F%5Fcodelineno-3-8)  tasks: []
[](#%5F%5Fcodelineno-3-9)}
`

### Get state history[¶](#get-state-history "Permanent link")

You can get the full history of the graph execution for a given thread by calling `await graph.getStateHistory(config)`. This will return a list of `StateSnapshot` objects associated with the thread ID provided in the config. Importantly, the checkpoints will be ordered chronologically with the most recent checkpoint / `StateSnapshot` being the first in the list.

`[](#%5F%5Fcodelineno-4-1)const config = { configurable: { thread_id: "1" } };
[](#%5F%5Fcodelineno-4-2)const history = await graph.getStateHistory(config);
`

In our example, the output of `getStateHistory` will look like this:

`[](#%5F%5Fcodelineno-5-1)[
[](#%5F%5Fcodelineno-5-2)  {
[](#%5F%5Fcodelineno-5-3)    values: { foo: 'b', bar: ['a', 'b'] },
[](#%5F%5Fcodelineno-5-4)    next: [],
[](#%5F%5Fcodelineno-5-5)    config: { configurable: { thread_id: '1', checkpoint_ns: '', checkpoint_id: '1ef663ba-28fe-6528-8002-5a559208592c' } },
[](#%5F%5Fcodelineno-5-6)    metadata: { source: 'loop', writes: { nodeB: { foo: 'b', bar: ['b'] } }, step: 2 },
[](#%5F%5Fcodelineno-5-7)    created_at: '2024-08-29T19:19:38.821749+00:00',
[](#%5F%5Fcodelineno-5-8)    parent_config: { configurable: { thread_id: '1', checkpoint_ns: '', checkpoint_id: '1ef663ba-28f9-6ec4-8001-31981c2c39f8' } },
[](#%5F%5Fcodelineno-5-9)    tasks: [],
[](#%5F%5Fcodelineno-5-10)  },
[](#%5F%5Fcodelineno-5-11)  {
[](#%5F%5Fcodelineno-5-12)    values: { foo: 'a', bar: ['a'] },
[](#%5F%5Fcodelineno-5-13)    next: ['nodeB'],
[](#%5F%5Fcodelineno-5-14)    config: { configurable: { thread_id: '1', checkpoint_ns: '', checkpoint_id: '1ef663ba-28f9-6ec4-8001-31981c2c39f8' } },
[](#%5F%5Fcodelineno-5-15)    metadata: { source: 'loop', writes: { nodeA: { foo: 'a', bar: ['a'] } }, step: 1 },
[](#%5F%5Fcodelineno-5-16)    created_at: '2024-08-29T19:19:38.819946+00:00',
[](#%5F%5Fcodelineno-5-17)    parent_config: { configurable: { thread_id: '1', checkpoint_ns: '', checkpoint_id: '1ef663ba-28f4-6b4a-8000-ca575a13d36a' } },
[](#%5F%5Fcodelineno-5-18)    tasks: [{ id: '6fb7314f-f114-5413-a1f3-d37dfe98ff44', name: 'nodeB', error: null, interrupts: [] }],
[](#%5F%5Fcodelineno-5-19)  },
[](#%5F%5Fcodelineno-5-20)  // ... (other checkpoints)
[](#%5F%5Fcodelineno-5-21)]
`

![State](../img/persistence/get_state.jpg)

### Replay[¶](#replay "Permanent link")

It's also possible to play-back a prior graph execution. If we `invoking` a graph with a `thread_id` and a `checkpoint_id`, then we will _re-play_ the graph from a checkpoint that corresponds to the `checkpoint_id`.

* `thread_id` is simply the ID of a thread. This is always required.
* `checkpoint_id` This identifier refers to a specific checkpoint within a thread.

You must pass these when invoking the graph as part of the `configurable` portion of the config:

`[](#%5F%5Fcodelineno-6-1)// { configurable: { thread_id: "1" } }  // valid config
[](#%5F%5Fcodelineno-6-2)// { configurable: { thread_id: "1", checkpoint_id: "0c62ca34-ac19-445d-bbb0-5b4984975b2a" } }  // also valid config
[](#%5F%5Fcodelineno-6-3)
[](#%5F%5Fcodelineno-6-4)const config = { configurable: { thread_id: "1" } };
[](#%5F%5Fcodelineno-6-5)await graph.invoke(inputs, config);
`

Importantly, LangGraph knows whether a particular checkpoint has been executed previously. If it has, LangGraph simply _re-plays_ that particular step in the graph and does not re-execute the step. See this [how to guide on time-travel to learn more about replaying](/langgraphjs/how-tos/time-travel).

![Replay](../img/persistence/re_play.jpg)

### Update state[¶](#update-state "Permanent link")

In addition to re-playing the graph from specific `checkpoints`, we can also _edit_ the graph state. We do this using `graph.updateState()`. This method three different arguments:

#### `config`[¶](#config "Permanent link")

The config should contain `thread_id` specifying which thread to update. When only the `thread_id` is passed, we update (or fork) the current state. Optionally, if we include `checkpoint_id` field, then we fork that selected checkpoint.

#### `values`[¶](#values "Permanent link")

These are the values that will be used to update the state. Note that this update is treated exactly as any update from a node is treated. This means that these values will be passed to the [reducer](/langgraphjs/concepts/low%5Flevel#reducers) functions, if they are defined for some of the channels in the graph state. This means that `updateState` does NOT automatically overwrite the channel values for every channel, but only for the channels without reducers. Let's walk through an example.

Let's assume you have defined the state of your graph with the following schema (see full example above):

`[](#%5F%5Fcodelineno-7-1)import { Annotation } from "@langchain/langgraph";
[](#%5F%5Fcodelineno-7-2)
[](#%5F%5Fcodelineno-7-3)const GraphAnnotation = Annotation.Root({
[](#%5F%5Fcodelineno-7-4)  foo: Annotation<string>
[](#%5F%5Fcodelineno-7-5)  bar: Annotation<string[]>({
[](#%5F%5Fcodelineno-7-6)    reducer: (a, b) => [...a, ...b],
[](#%5F%5Fcodelineno-7-7)    default: () => [],
[](#%5F%5Fcodelineno-7-8)  })
[](#%5F%5Fcodelineno-7-9)});
`

Let's now assume the current state of the graph is

`[](#%5F%5Fcodelineno-8-1){ foo: "1", bar: ["a"] }
`

If you update the state as below:

`[](#%5F%5Fcodelineno-9-1)await graph.updateState(config, { foo: "2", bar: ["b"] });
`

Then the new state of the graph will be:

`[](#%5F%5Fcodelineno-10-1){ foo: "2", bar: ["a", "b"] }
`

The `foo` key (channel) is completely changed (because there is no reducer specified for that channel, so `updateState` overwrites it). However, there is a reducer specified for the `bar` key, and so it appends `"b"` to the state of `bar`.

#### As Node[¶](#as-node "Permanent link")

The final argument you can optionally specify when calling `updateState` is the third positional `asNode` argument. If you provided it, the update will be applied as if it came from node `asNode`. If `asNode` is not provided, it will be set to the last node that updated the state, if not ambiguous. The reason this matters is that the next steps to execute depend on the last node to have given an update, so this can be used to control which node executes next. See this [how to guide on time-travel to learn more about forking state](/langgraphjs/how-tos/time-travel).

![Update](../img/persistence/checkpoints_full_story.jpg)

## Memory Store[¶](#memory-store "Permanent link")

![Update](../img/persistence/shared_state.png)

A [state schema](../low%5Flevel/#state) specifies a set of keys that are populated as a graph is executed. As discussed above, state can be written by a checkpointer to a thread at each graph step, enabling state persistence.

But, what if we want to retain some information _across threads_? Consider the case of a chatbot where we want to retain specific information about the user across _all_ chat conversations (e.g., threads) with that user!

With checkpointers alone, we cannot share information across threads. This motivates the need for the `Store` interface. As an illustration, we can define an `InMemoryStore` to store information about a user across threads. First, let's showcase this in isolation without using LangGraph.

`[](#%5F%5Fcodelineno-11-1)import { InMemoryStore } from "@langchain/langgraph";
[](#%5F%5Fcodelineno-11-2)
[](#%5F%5Fcodelineno-11-3)const inMemoryStore = new InMemoryStore();
`

Memories are namespaced by a `tuple`, which in this specific example will be `[<user_id>, "memories"]`. The namespace can be any length and represent anything, does not have be user specific.

`[](#%5F%5Fcodelineno-12-1)const userId = "1";
[](#%5F%5Fcodelineno-12-2)const namespaceForMemory = [userId, "memories"];
`

We use the `store.put` method to save memories to our namespace in the store. When we do this, we specify the namespace, as defined above, and a key-value pair for the memory: the key is simply a unique identifier for the memory (`memoryId`) and the value (an object) is the memory itself.

`[](#%5F%5Fcodelineno-13-1)import { v4 as uuid4 } from 'uuid';
[](#%5F%5Fcodelineno-13-2)
[](#%5F%5Fcodelineno-13-3)const memoryId = uuid4();
[](#%5F%5Fcodelineno-13-4)const memory = { food_preference: "I like pizza" };
[](#%5F%5Fcodelineno-13-5)await inMemoryStore.put(namespaceForMemory, memoryId, memory);
`

We can read out memories in our namespace using `store.search`, which will return all memories for a given user as a list. The most recent memory is the last in the list.

`[](#%5F%5Fcodelineno-14-1)const memories = await inMemoryStore.search(namespaceForMemory);
[](#%5F%5Fcodelineno-14-2)console.log(memories.at(-1));
[](#%5F%5Fcodelineno-14-3)
[](#%5F%5Fcodelineno-14-4)/*
[](#%5F%5Fcodelineno-14-5)  {
[](#%5F%5Fcodelineno-14-6)    'value': {'food_preference': 'I like pizza'},
[](#%5F%5Fcodelineno-14-7)    'key': '07e0caf4-1631-47b7-b15f-65515d4c1843',
[](#%5F%5Fcodelineno-14-8)    'namespace': ['1', 'memories'],
[](#%5F%5Fcodelineno-14-9)    'created_at': '2024-10-02T17:22:31.590602+00:00',
[](#%5F%5Fcodelineno-14-10)    'updated_at': '2024-10-02T17:22:31.590605+00:00'
[](#%5F%5Fcodelineno-14-11)  }
[](#%5F%5Fcodelineno-14-12)*/
`

The attributes a retrieved memory has are:

* `value`: The value (itself a dictionary) of this memory
* `key`: The UUID for this memory in this namespace
* `namespace`: A list of strings, the namespace of this memory type
* `created_at`: Timestamp for when this memory was created
* `updated_at`: Timestamp for when this memory was updated

With this all in place, we use the `inMemoryStore` in LangGraph. The `inMemoryStore` works hand-in-hand with the checkpointer: the checkpointer saves state to threads, as discussed above, and the the `inMemoryStore` allows us to store arbitrary information for access _across_ threads. We compile the graph with both the checkpointer and the `inMemoryStore` as follows. 

`[](#%5F%5Fcodelineno-15-1)import { MemorySaver } from "@langchain/langgraph";
[](#%5F%5Fcodelineno-15-2)
[](#%5F%5Fcodelineno-15-3)// We need this because we want to enable threads (conversations)
[](#%5F%5Fcodelineno-15-4)const checkpointer = new MemorySaver();
[](#%5F%5Fcodelineno-15-5)
[](#%5F%5Fcodelineno-15-6)// ... Define the graph ...
[](#%5F%5Fcodelineno-15-7)
[](#%5F%5Fcodelineno-15-8)// Compile the graph with the checkpointer and store
[](#%5F%5Fcodelineno-15-9)const graph = builder.compile({
[](#%5F%5Fcodelineno-15-10)  checkpointer,
[](#%5F%5Fcodelineno-15-11)  store: inMemoryStore
[](#%5F%5Fcodelineno-15-12)});
`

We invoke the graph with a `thread_id`, as before, and also with a `user_id`, which we'll use to namespace our memories to this particular user as we showed above.

`[](#%5F%5Fcodelineno-16-1)// Invoke the graph
[](#%5F%5Fcodelineno-16-2)const user_id = "1";
[](#%5F%5Fcodelineno-16-3)const config = { configurable: { thread_id: "1", user_id } };
[](#%5F%5Fcodelineno-16-4)
[](#%5F%5Fcodelineno-16-5)// First let's just say hi to the AI
[](#%5F%5Fcodelineno-16-6)const stream = await graph.stream(
[](#%5F%5Fcodelineno-16-7)  { messages: [{ role: "user", content: "hi" }] },
[](#%5F%5Fcodelineno-16-8)  { ...config, streamMode: "updates" },
[](#%5F%5Fcodelineno-16-9));
[](#%5F%5Fcodelineno-16-10)
[](#%5F%5Fcodelineno-16-11)for await (const update of stream) {
[](#%5F%5Fcodelineno-16-12)  console.log(update);
[](#%5F%5Fcodelineno-16-13)}
`

We can access the `inMemoryStore` and the `user_id` in _any node_ by passing `config: LangGraphRunnableConfig` as a node argument. Then, just as we saw above, simply use the `put` method to save memories to the store.

`[](#%5F%5Fcodelineno-17-1)import {
[](#%5F%5Fcodelineno-17-2)  type LangGraphRunnableConfig,
[](#%5F%5Fcodelineno-17-3)  MessagesAnnotation,
[](#%5F%5Fcodelineno-17-4)} from "@langchain/langgraph";
[](#%5F%5Fcodelineno-17-5)
[](#%5F%5Fcodelineno-17-6)const updateMemory = async (
[](#%5F%5Fcodelineno-17-7)  state: typeof MessagesAnnotation.State,
[](#%5F%5Fcodelineno-17-8)  config: LangGraphRunnableConfig
[](#%5F%5Fcodelineno-17-9)) => {
[](#%5F%5Fcodelineno-17-10)  // Get the store instance from the config
[](#%5F%5Fcodelineno-17-11)  const store = config.store;
[](#%5F%5Fcodelineno-17-12)
[](#%5F%5Fcodelineno-17-13)  // Get the user id from the config
[](#%5F%5Fcodelineno-17-14)  const userId = config.configurable.user_id;
[](#%5F%5Fcodelineno-17-15)
[](#%5F%5Fcodelineno-17-16)  // Namespace the memory
[](#%5F%5Fcodelineno-17-17)  const namespace = [userId, "memories"];
[](#%5F%5Fcodelineno-17-18)
[](#%5F%5Fcodelineno-17-19)  // ... Analyze conversation and create a new memory
[](#%5F%5Fcodelineno-17-20)
[](#%5F%5Fcodelineno-17-21)  // Create a new memory ID
[](#%5F%5Fcodelineno-17-22)  const memoryId = uuid4();
[](#%5F%5Fcodelineno-17-23)
[](#%5F%5Fcodelineno-17-24)  // We create a new memory
[](#%5F%5Fcodelineno-17-25)  await store.put(namespace, memoryId, { memory });
[](#%5F%5Fcodelineno-17-26)};
`

As we showed above, we can also access the store in any node and use `search` to get memories. Recall the the memories are returned as a list of objects that can be converted to a dictionary.

`[](#%5F%5Fcodelineno-18-1)const memories = inMemoryStore.search(namespaceForMemory);
[](#%5F%5Fcodelineno-18-2)console.log(memories.at(-1));
[](#%5F%5Fcodelineno-18-3)
[](#%5F%5Fcodelineno-18-4)/*
[](#%5F%5Fcodelineno-18-5)  {
[](#%5F%5Fcodelineno-18-6)    'value': {'food_preference': 'I like pizza'},
[](#%5F%5Fcodelineno-18-7)    'key': '07e0caf4-1631-47b7-b15f-65515d4c1843',
[](#%5F%5Fcodelineno-18-8)    'namespace': ['1', 'memories'],
[](#%5F%5Fcodelineno-18-9)    'created_at': '2024-10-02T17:22:31.590602+00:00',
[](#%5F%5Fcodelineno-18-10)    'updated_at': '2024-10-02T17:22:31.590605+00:00'
[](#%5F%5Fcodelineno-18-11)  }
[](#%5F%5Fcodelineno-18-12)*/
`

We can access the memories and use them in our model call.

`[](#%5F%5Fcodelineno-19-1)const callModel = async (
[](#%5F%5Fcodelineno-19-2)  state: typeof StateAnnotation.State,
[](#%5F%5Fcodelineno-19-3)  config: LangGraphRunnableConfig
[](#%5F%5Fcodelineno-19-4)) => {
[](#%5F%5Fcodelineno-19-5)  const store = config.store;
[](#%5F%5Fcodelineno-19-6)
[](#%5F%5Fcodelineno-19-7)  // Get the user id from the config
[](#%5F%5Fcodelineno-19-8)  const userId = config.configurable.user_id;
[](#%5F%5Fcodelineno-19-9)
[](#%5F%5Fcodelineno-19-10)  // Get the memories for the user from the store
[](#%5F%5Fcodelineno-19-11)  const memories = await store.search([userId, "memories"]);
[](#%5F%5Fcodelineno-19-12)  const info = memories.map((memory) => {
[](#%5F%5Fcodelineno-19-13)    return JSON.stringify(memory.value);
[](#%5F%5Fcodelineno-19-14)  }).join("\n");
[](#%5F%5Fcodelineno-19-15)
[](#%5F%5Fcodelineno-19-16)  // ... Use memories in the model call
[](#%5F%5Fcodelineno-19-17)}
`

If we create a new thread, we can still access the same memories so long as the `user_id` is the same. 

`[](#%5F%5Fcodelineno-20-1)// Invoke the graph
[](#%5F%5Fcodelineno-20-2)const config = { configurable: { thread_id: "2", user_id: "1" } };
[](#%5F%5Fcodelineno-20-3)
[](#%5F%5Fcodelineno-20-4)// Let's say hi again
[](#%5F%5Fcodelineno-20-5)const stream = await graph.stream(
[](#%5F%5Fcodelineno-20-6)  { messages: [{ role: "user", content: "hi, tell me about my memories" }] },
[](#%5F%5Fcodelineno-20-7)  { ...config, streamMode: "updates" },
[](#%5F%5Fcodelineno-20-8));
[](#%5F%5Fcodelineno-20-9)
[](#%5F%5Fcodelineno-20-10)for await (const update of stream) {
[](#%5F%5Fcodelineno-20-11)  console.log(update);
[](#%5F%5Fcodelineno-20-12)}
`

When we use the LangGraph API, either locally (e.g., in LangGraph Studio) or with LangGraph Cloud, the memory store is available to use by default and does not need to be specified during graph compilation.

## Checkpointer libraries[¶](#checkpointer-libraries "Permanent link")

Under the hood, checkpointing is powered by checkpointer objects that conform to [BaseCheckpointSaver](/langgraphjs/reference/classes/checkpoint.BaseCheckpointSaver.html) interface. LangGraph provides several checkpointer implementations, all implemented via standalone, installable libraries:

* `@langchain/langgraph-checkpoint`: The base interface for checkpointer savers ([BaseCheckpointSaver](/langgraphjs/reference/classes/checkpoint.BaseCheckpointSaver.html)) and serialization/deserialization interface ([SerializerProtocol](/langgraphjs/reference/interfaces/checkpoint.SerializerProtocol.html)). Includes in-memory checkpointer implementation ([MemorySaver](/langgraphjs/reference/classes/checkpoint.MemorySaver.html)) for experimentation. LangGraph comes with `@langchain/langgraph-checkpoint` included.
* `@langchain/langgraph-checkpoint-sqlite`: An implementation of LangGraph checkpointer that uses SQLite database ([SqliteSaver](/langgraphjs/reference/classes/checkpoint%5Fsqlite.SqliteSaver.html)). Ideal for experimentation and local workflows. Needs to be installed separately.
* `@langchain/langgraph-checkpoint-postgres`: An advanced checkpointer that uses a Postgres database ([PostgresSaver](/langgraphjs/reference/classes/checkpoint%5Fpostgres.PostgresSaver.html)), used in LangGraph Cloud. Ideal for using in production. Needs to be installed separately.

### Checkpointer interface[¶](#checkpointer-interface "Permanent link")

Each checkpointer conforms to [BaseCheckpointSaver](/langgraphjs/reference/classes/checkpoint.BaseCheckpointSaver.html) interface and implements the following methods:

* `.put` \- Store a checkpoint with its configuration and metadata.
* `.putWrites` \- Store intermediate writes linked to a checkpoint (i.e. [pending writes](#pending-writes)).
* `.getTuple` \- Fetch a checkpoint tuple using for a given configuration (`thread_id` and `checkpoint_id`). This is used to populate `StateSnapshot` in `graph.getState()`.
* `.list` \- List checkpoints that match a given configuration and filter criteria. This is used to populate state history in `graph.getStateHistory()`

### Serializer[¶](#serializer "Permanent link")

When checkpointers save the graph state, they need to serialize the channel values in the state. This is done using serializer objects. `@langchain/langgraph-checkpoint` defines a [protocol](/langgraphjs/reference/interfaces/checkpoint.SerializerProtocol.html) for implementing serializers and a default implementation that handles a wide variety of types, including LangChain and LangGraph primitives, datetimes, enums and more.

## Capabilities[¶](#capabilities "Permanent link")

### Human-in-the-loop[¶](#human-in-the-loop "Permanent link")

First, checkpointers facilitate [human-in-the-loop workflows](/langgraphjs/concepts/agentic%5Fconcepts#human-in-the-loop) workflows by allowing humans to inspect, interrupt, and approve graph steps. Checkpointers are needed for these workflows as the human has to be able to view the state of a graph at any point in time, and the graph has to be to resume execution after the human has made any updates to the state. See [these how-to guides](/langgraphjs/how-tos/breakpoints) for concrete examples.

### Memory[¶](#memory "Permanent link")

Second, checkpointers allow for ["memory"](/langgraphjs/concepts/agentic%5Fconcepts#memory) between interactions. In the case of repeated human interactions (like conversations) any follow up messages can be sent to that thread, which will retain its memory of previous ones. See [this how-to guide](/langgraphjs/how-tos/manage-conversation-history) for an end-to-end example on how to add and manage conversation memory using checkpointers.

### Time Travel[¶](#time-travel "Permanent link")

Third, checkpointers allow for ["time travel"](/langgraphjs/how-tos/time-travel), allowing users to replay prior graph executions to review and / or debug specific graph steps. In addition, checkpointers make it possible to fork the graph state at arbitrary checkpoints to explore alternative trajectories.

### Fault-tolerance[¶](#fault-tolerance "Permanent link")

Lastly, checkpointing also provides fault-tolerance and error recovery: if one or more nodes fail at a given superstep, you can restart your graph from the last successful step. Additionally, when a graph node fails mid-execution at a given superstep, LangGraph stores pending checkpoint writes from any other nodes that completed successfully at that superstep, so that whenever we resume graph execution from that superstep we don't re-run the successful nodes.

#### Pending writes[¶](#pending-writes "Permanent link")

Additionally, when a graph node fails mid-execution at a given superstep, LangGraph stores pending checkpoint writes from any other nodes that completed successfully at that superstep, so that whenever we resume graph execution from that superstep we don't re-run the successful nodes.

 Was this page helpful? 

 Thanks for your feedback!

 Thanks for your feedback! Please help us improve this page by adding to the discussion below.

 Back to top 

[  Previous  Human-in-the-loop ](../human%5Fin%5Fthe%5Floop/) [  Next  Memory ](../memory/) 

 Copyright © 2025 LangChain, Inc | [Consent Preferences](#%5F%5Fconsent) 

 Made with[ Material for MkDocs Insiders](https://squidfunk.github.io/mkdocs-material/) 

[ ](https://langchain-ai.github.io/langgraph/ "langchain-ai.github.io") [ ](https://github.com/langchain-ai/langgraphjs "github.com") [ ](https://twitter.com/LangChainAI "twitter.com") 

#### Cookie consent

We use cookies to recognize your repeated visits and preferences, as well as to measure the effectiveness of our documentation and whether users find what they're searching for. **Clicking "Accept" makes our documentation better. Thank you!** ❤️

* Google Analytics
* GitHub

Accept Reject 