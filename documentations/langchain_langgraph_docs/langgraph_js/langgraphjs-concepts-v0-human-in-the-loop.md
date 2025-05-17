[ Skip to content](#human-in-the-loop) 

**Help us build the JS tools that power AI apps at companies like Replit, Uber, LinkedIn, GitLab, and more. [Join our team!](https://jobs.ashbyhq.com/langchain/05efa205-8560-43fd-bfcc-3f7697561cfb?utm%5Fsource=https%3A%2F%2Flangchain-ai.github.io%2Flanggraphjs%2F&utm%5Fcampaign=langgraphjs%5Fdocs)** 

[ ![logo](../../static/wordmark_dark.svg) ![logo](../../static/wordmark_light.svg) ](../..) 

 Human-in-the-loop 

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
* [  Agents ](../../agents/overview/)
* [  API reference ](../../reference/)
* [  Versions ](../../versions/)

 Table of contents 
* [  Persistence ](#persistence)  
   * [  Breakpoints ](#breakpoints)  
   * [  Dynamic Breakpoints ](#dynamic-breakpoints)
* [  Interaction Patterns ](#interaction-patterns)  
   * [  Approval ](#approval)  
   * [  Editing ](#editing)  
   * [  Input ](#input)
* [  Use-cases ](#use-cases)  
   * [  Reviewing Tool Calls ](#reviewing-tool-calls)  
   * [  Time Travel ](#time-travel)  
         * [  Replaying ](#replaying)  
         * [  Forking ](#forking)

# Human-in-the-loop[¶](#human-in-the-loop "Permanent link")

Human-in-the-loop (or "on-the-loop") enhances agent capabilities through several common user interaction patterns.

Common interaction patterns include:

(1) `Approval` \- We can interrupt our agent, surface the current state to a user, and allow the user to accept an action. 

(2) `Editing` \- We can interrupt our agent, surface the current state to a user, and allow the user to edit the agent state. 

(3) `Input` \- We can explicitly create a graph node to collect human input and pass that input directly to the agent state.

Use-cases for these interaction patterns include:

(1) `Reviewing tool calls` \- We can interrupt an agent to review and edit the results of tool calls.

(2) `Time Travel` \- We can manually re-play and / or fork past actions of an agent.

## Persistence[¶](#persistence "Permanent link")

All of these interaction patterns are enabled by LangGraph's built-in [persistence](/langgraphjs/concepts/persistence) layer, which will write a checkpoint of the graph state at each step. Persistence allows the graph to stop so that a human can review and / or edit the current state of the graph and then resume with the human's input.

### Breakpoints[¶](#breakpoints "Permanent link")

Adding a [breakpoint](/langgraphjs/concepts/low%5Flevel#breakpoints) at a specific location in the graph flow is one way to enable human-in-the-loop. In this case, the developer knows _where_ in the workflow human input is needed and simply places a breakpoint prior to or following that particular graph node.

Here, we compile our graph with a checkpointer and a breakpoint at the node we want to interrupt before, `step_for_human_in_the_loop`. We then perform one of the above interaction patterns, which will create a new checkpoint if a human edits the graph state. The new checkpoint is saved to the thread and we can resume the graph execution from there by passing in `null` as the input.

`[](#%5F%5Fcodelineno-0-1)// Compile our graph with a checkpointer and a breakpoint before "step_for_human_in_the_loop"
[](#%5F%5Fcodelineno-0-2)const graph = builder.compile({ checkpointer, interruptBefore: ["step_for_human_in_the_loop"] });
[](#%5F%5Fcodelineno-0-3)
[](#%5F%5Fcodelineno-0-4)// Run the graph up to the breakpoint
[](#%5F%5Fcodelineno-0-5)const threadConfig = { configurable: { thread_id: "1" }, streamMode: "values" as const };
[](#%5F%5Fcodelineno-0-6)for await (const event of await graph.stream(inputs, threadConfig)) {
[](#%5F%5Fcodelineno-0-7)    console.log(event);
[](#%5F%5Fcodelineno-0-8)}
[](#%5F%5Fcodelineno-0-9)
[](#%5F%5Fcodelineno-0-10)// Perform some action that requires human in the loop
[](#%5F%5Fcodelineno-0-11)
[](#%5F%5Fcodelineno-0-12)// Continue the graph execution from the current checkpoint 
[](#%5F%5Fcodelineno-0-13)for await (const event of await graph.stream(null, threadConfig)) {
[](#%5F%5Fcodelineno-0-14)    console.log(event);
[](#%5F%5Fcodelineno-0-15)}
`

### Dynamic Breakpoints[¶](#dynamic-breakpoints "Permanent link")

Alternatively, the developer can define some _condition_ that must be met for a breakpoint to be triggered. This concept of [dynamic breakpoints](/langgraphjs/concepts/low%5Flevel#dynamic-breakpoints) is useful when the developer wants to halt the graph under _a particular condition_. This uses a [NodeInterrupt](/langgraphjs/reference/classes/langgraph.NodeInterrupt.html), which is a special type of error that can be raised from within a node based upon some condition. As an example, we can define a dynamic breakpoint that triggers when the `input` is longer than 5 characters.

`` [](#%5F%5Fcodelineno-1-1)function myNode(state: typeof GraphAnnotation.State): typeof GraphAnnotation.State {
[](#%5F%5Fcodelineno-1-2)    if (state.input.length > 5) {
[](#%5F%5Fcodelineno-1-3)        throw new NodeInterrupt(`Received input that is longer than 5 characters: ${state['input']}`);
[](#%5F%5Fcodelineno-1-4)    }
[](#%5F%5Fcodelineno-1-5)    return state;
[](#%5F%5Fcodelineno-1-6)}
 ``

Let's assume we run the graph with an input that triggers the dynamic breakpoint and then attempt to resume the graph execution simply by passing in `null` for the input. 

`[](#%5F%5Fcodelineno-2-1)// Attempt to continue the graph execution with no change to state after we hit the dynamic breakpoint 
[](#%5F%5Fcodelineno-2-2)for await (const event of await graph.stream(null, threadConfig)) {
[](#%5F%5Fcodelineno-2-3)    console.log(event);
[](#%5F%5Fcodelineno-2-4)}
`

The graph will _interrupt_ again because this node will be _re-run_ with the same graph state. We need to change the graph state such that the condition that triggers the dynamic breakpoint is no longer met. So, we can simply edit the graph state to an input that meets the condition of our dynamic breakpoint (< 5 characters) and re-run the node.

`[](#%5F%5Fcodelineno-3-1)// Update the state to pass the dynamic breakpoint
[](#%5F%5Fcodelineno-3-2)await graph.updateState(threadConfig, { input: "foo" });
[](#%5F%5Fcodelineno-3-3)for await (const event of await graph.stream(null, threadConfig)) {
[](#%5F%5Fcodelineno-3-4)    console.log(event);
[](#%5F%5Fcodelineno-3-5)}
`

Alternatively, what if we want to keep our current input and skip the node (`myNode`) that performs the check? To do this, we can simply perform the graph update with `"myNode"` as the third positional argument, and pass in `null` for the values. This will make no update to the graph state, but run the update as `myNode`, effectively skipping the node and bypassing the dynamic breakpoint.

`` [](#%5F%5Fcodelineno-4-1)// This update will skip the node `myNode` altogether
[](#%5F%5Fcodelineno-4-2)await graph.updateState(threadConfig, null, "myNode");
[](#%5F%5Fcodelineno-4-3)for await (const event of await graph.stream(null, threadConfig)) {
[](#%5F%5Fcodelineno-4-4)    console.log(event);
[](#%5F%5Fcodelineno-4-5)}
 ``

See [our guide](/langgraphjs/how-tos/dynamic%5Fbreakpoints) for a detailed how-to on doing this!

## Interaction Patterns[¶](#interaction-patterns "Permanent link")

### Approval[¶](#approval "Permanent link")

![](../img/human_in_the_loop/approval.png)

Sometimes we want to approve certain steps in our agent's execution. 

We can interrupt our agent at a [breakpoint](/langgraphjs/concepts/low%5Flevel#breakpoints) prior to the step that we want to approve.

This is generally recommended for sensitive actions (e.g., using external APIs or writing to a database).

With persistence, we can surface the current agent state as well as the next step to a user for review and approval. 

If approved, the graph resumes execution from the last saved checkpoint, which is saved to the thread:

`[](#%5F%5Fcodelineno-5-1)// Compile our graph with a checkpointer and a breakpoint before the step to approve
[](#%5F%5Fcodelineno-5-2)const graph = builder.compile({ checkpointer, interruptBefore: ["node_2"] });
[](#%5F%5Fcodelineno-5-3)
[](#%5F%5Fcodelineno-5-4)// Run the graph up to the breakpoint
[](#%5F%5Fcodelineno-5-5)for await (const event of await graph.stream(inputs, threadConfig)) {
[](#%5F%5Fcodelineno-5-6)    console.log(event);
[](#%5F%5Fcodelineno-5-7)}
[](#%5F%5Fcodelineno-5-8)
[](#%5F%5Fcodelineno-5-9)// ... Get human approval ...
[](#%5F%5Fcodelineno-5-10)
[](#%5F%5Fcodelineno-5-11)// If approved, continue the graph execution from the last saved checkpoint
[](#%5F%5Fcodelineno-5-12)for await (const event of await graph.stream(null, threadConfig)) {
[](#%5F%5Fcodelineno-5-13)    console.log(event);
[](#%5F%5Fcodelineno-5-14)}
`

See [our guide](/langgraphjs/how-tos/breakpoints) for a detailed how-to on doing this!

### Editing[¶](#editing "Permanent link")

![](../img/human_in_the_loop/edit_graph_state.png)

Sometimes we want to review and edit the agent's state. 

As with approval, we can interrupt our agent at a [breakpoint](/langgraphjs/concepts/low%5Flevel#breakpoints) prior to the step we want to check. 

We can surface the current state to a user and allow the user to edit the agent state.

This can, for example, be used to correct the agent if it made a mistake (e.g., see the section on tool calling below).

We can edit the graph state by forking the current checkpoint, which is saved to the thread.

We can then proceed with the graph from our forked checkpoint as done before. 

`[](#%5F%5Fcodelineno-6-1)// Compile our graph with a checkpointer and a breakpoint before the step to review
[](#%5F%5Fcodelineno-6-2)const graph = builder.compile({ checkpointer, interruptBefore: ["node_2"] });
[](#%5F%5Fcodelineno-6-3)
[](#%5F%5Fcodelineno-6-4)// Run the graph up to the breakpoint
[](#%5F%5Fcodelineno-6-5)for await (const event of await graph.stream(inputs, threadConfig)) {
[](#%5F%5Fcodelineno-6-6)    console.log(event);
[](#%5F%5Fcodelineno-6-7)}
[](#%5F%5Fcodelineno-6-8)
[](#%5F%5Fcodelineno-6-9)// Review the state, decide to edit it, and create a forked checkpoint with the new state
[](#%5F%5Fcodelineno-6-10)await graph.updateState(threadConfig, { state: "new state" });
[](#%5F%5Fcodelineno-6-11)
[](#%5F%5Fcodelineno-6-12)// Continue the graph execution from the forked checkpoint
[](#%5F%5Fcodelineno-6-13)for await (const event of await graph.stream(null, threadConfig)) {
[](#%5F%5Fcodelineno-6-14)    console.log(event);
[](#%5F%5Fcodelineno-6-15)}
`

See [this guide](/langgraphjs/how-tos/edit-graph-state) for a detailed how-to on doing this!

### Input[¶](#input "Permanent link")

![](../img/human_in_the_loop/wait_for_input.png)

Sometimes we want to explicitly get human input at a particular step in the graph. 

We can create a graph node designated for this (e.g., `human_input` in our example diagram).

As with approval and editing, we can interrupt our agent at a [breakpoint](/langgraphjs/concepts/low%5Flevel#breakpoints) prior to this node.

We can then perform a state update that includes the human input, just as we did with editing state.

But, we add one thing: 

We can use `"human_input"` as the node with the state update to specify that the state update _should be treated as a node_.

This is subtle, but important: 

With editing, the user makes a decision about whether or not to edit the graph state.

With input, we explicitly define a node in our graph for collecting human input!

The state update with the human input then runs _as this node_.

`[](#%5F%5Fcodelineno-7-1)// Compile our graph with a checkpointer and a breakpoint before the step to collect human input
[](#%5F%5Fcodelineno-7-2)const graph = builder.compile({ checkpointer, interruptBefore: ["human_input"] });
[](#%5F%5Fcodelineno-7-3)
[](#%5F%5Fcodelineno-7-4)// Run the graph up to the breakpoint
[](#%5F%5Fcodelineno-7-5)for await (const event of await graph.stream(inputs, threadConfig)) {
[](#%5F%5Fcodelineno-7-6)    console.log(event);
[](#%5F%5Fcodelineno-7-7)}
[](#%5F%5Fcodelineno-7-8)
[](#%5F%5Fcodelineno-7-9)// Update the state with the user input as if it was the human_input node
[](#%5F%5Fcodelineno-7-10)await graph.updateState(threadConfig, { user_input: userInput }, "human_input");
[](#%5F%5Fcodelineno-7-11)
[](#%5F%5Fcodelineno-7-12)// Continue the graph execution from the checkpoint created by the human_input node
[](#%5F%5Fcodelineno-7-13)for await (const event of await graph.stream(null, threadConfig)) {
[](#%5F%5Fcodelineno-7-14)    console.log(event);
[](#%5F%5Fcodelineno-7-15)}
`

See [this guide](/langgraphjs/how-tos/wait-user-input) for a detailed how-to on doing this!

## Use-cases[¶](#use-cases "Permanent link")

### Reviewing Tool Calls[¶](#reviewing-tool-calls "Permanent link")

Some user interaction patterns combine the above ideas.

For example, many agents use [tool calling](https://js.langchain.com/docs/modules/agents/tools/) to make decisions. 

Tool calling presents a challenge because the agent must get two things right: 

(1) The name of the tool to call 

(2) The arguments to pass to the tool

Even if the tool call is correct, we may also want to apply discretion: 

(3) The tool call may be a sensitive operation that we want to approve 

With these points in mind, we can combine the above ideas to create a human-in-the-loop review of a tool call.

`[](#%5F%5Fcodelineno-8-1)// Compile our graph with a checkpointer and a breakpoint before the step to review the tool call from the LLM 
[](#%5F%5Fcodelineno-8-2)const graph = builder.compile({ checkpointer, interruptBefore: ["human_review"] });
[](#%5F%5Fcodelineno-8-3)
[](#%5F%5Fcodelineno-8-4)// Run the graph up to the breakpoint
[](#%5F%5Fcodelineno-8-5)for await (const event of await graph.stream(inputs, threadConfig)) {
[](#%5F%5Fcodelineno-8-6)    console.log(event);
[](#%5F%5Fcodelineno-8-7)}
[](#%5F%5Fcodelineno-8-8)
[](#%5F%5Fcodelineno-8-9)// Review the tool call and update it, if needed, as the human_review node
[](#%5F%5Fcodelineno-8-10)await graph.updateState(threadConfig, { tool_call: "updated tool call" }, "human_review");
[](#%5F%5Fcodelineno-8-11)
[](#%5F%5Fcodelineno-8-12)// Otherwise, approve the tool call and proceed with the graph execution with no edits 
[](#%5F%5Fcodelineno-8-13)
[](#%5F%5Fcodelineno-8-14)// Continue the graph execution from either: 
[](#%5F%5Fcodelineno-8-15)// (1) the forked checkpoint created by human_review or 
[](#%5F%5Fcodelineno-8-16)// (2) the checkpoint saved when the tool call was originally made (no edits in human_review)
[](#%5F%5Fcodelineno-8-17)for await (const event of await graph.stream(null, threadConfig)) {
[](#%5F%5Fcodelineno-8-18)    console.log(event);
[](#%5F%5Fcodelineno-8-19)}
`

See [this guide](/langgraphjs/how-tos/review-tool-calls) for a detailed how-to on doing this!

### Time Travel[¶](#time-travel "Permanent link")

When working with agents, we often want to closely examine their decision making process: 

(1) Even when they arrive at a desired final result, the reasoning that led to that result is often important to examine.

(2) When agents make mistakes, it is often valuable to understand why.

(3) In either of the above cases, it is useful to manually explore alternative decision making paths.

Collectively, we call these debugging concepts `time-travel` and they are composed of `replaying` and `forking`.

#### Replaying[¶](#replaying "Permanent link")

![](../img/human_in_the_loop/replay.png)

Sometimes we want to simply replay past actions of an agent. 

Above, we showed the case of executing an agent from the current state (or checkpoint) of the graph.

We do this by simply passing in `null` for the input with a `threadConfig`.

`[](#%5F%5Fcodelineno-9-1)const threadConfig = { configurable: { thread_id: "1" } };
[](#%5F%5Fcodelineno-9-2)for await (const event of await graph.stream(null, threadConfig)) {
[](#%5F%5Fcodelineno-9-3)    console.log(event);
[](#%5F%5Fcodelineno-9-4)}
`

Now, we can modify this to replay past actions from a _specific_ checkpoint by passing in the checkpoint ID.

To get a specific checkpoint ID, we can easily get all of the checkpoints in the thread and filter to the one we want.

`[](#%5F%5Fcodelineno-10-1)const allCheckpoints = [];
[](#%5F%5Fcodelineno-10-2)for await (const state of app.getStateHistory(threadConfig)) {
[](#%5F%5Fcodelineno-10-3)    allCheckpoints.push(state);
[](#%5F%5Fcodelineno-10-4)}
`

Each checkpoint has a unique ID, which we can use to replay from a specific checkpoint.

Assume from reviewing the checkpoints that we want to replay from one, `xxx`.

We just pass in the checkpoint ID when we run the graph.

`[](#%5F%5Fcodelineno-11-1)const config = { configurable: { thread_id: '1', checkpoint_id: 'xxx' }, streamMode: "values" as const };
[](#%5F%5Fcodelineno-11-2)for await (const event of await graph.stream(null, config)) {
[](#%5F%5Fcodelineno-11-3)    console.log(event);
[](#%5F%5Fcodelineno-11-4)}
`

Importantly, the graph knows which checkpoints have been previously executed. 

So, it will re-play any previously executed nodes rather than re-executing them.

See [this additional conceptual guide](https://langchain-ai.github.io/langgraph/concepts/persistence/#replay) for related context on replaying.

See [this guide](/langgraphjs/how-tos/time-travel) for a detailed how-to on doing time-travel!

#### Forking[¶](#forking "Permanent link")

![](../img/human_in_the_loop/forking.png)

Sometimes we want to fork past actions of an agent, and explore different paths through the graph.

`Editing`, as discussed above, is _exactly_ how we do this for the _current_ state of the graph! 

But, what if we want to fork _past_ states of the graph?

For example, let's say we want to edit a particular checkpoint, `xxx`.

We pass this `checkpoint_id` when we update the state of the graph.

`[](#%5F%5Fcodelineno-12-1)const config = { configurable: { thread_id: "1", checkpoint_id: "xxx" } };
[](#%5F%5Fcodelineno-12-2)await graph.updateState(config, { state: "updated state" });
`

This creates a new forked checkpoint, `xxx-fork`, which we can then run the graph from.

`[](#%5F%5Fcodelineno-13-1)const config = { configurable: { thread_id: '1', checkpoint_id: 'xxx-fork' }, streamMode: "values" as const };
[](#%5F%5Fcodelineno-13-2)for await (const event of await graph.stream(null, config)) {
[](#%5F%5Fcodelineno-13-3)    console.log(event);
[](#%5F%5Fcodelineno-13-4)}
`

See [this additional conceptual guide](/langgraphjs/concepts/persistence/#update-state) for related context on forking.

See [this guide](/langgraphjs/how-tos/time-travel) for a detailed how-to on doing time-travel!

 Was this page helpful? 

 Thanks for your feedback!

 Thanks for your feedback! Please help us improve this page by adding to the discussion below.

 Back to top 

 Copyright © 2025 LangChain, Inc | [Consent Preferences](#%5F%5Fconsent) 

 Made with[ Material for MkDocs Insiders](https://squidfunk.github.io/mkdocs-material/) 

[ ](https://langchain-ai.github.io/langgraph/ "langchain-ai.github.io") [ ](https://github.com/langchain-ai/langgraphjs "github.com") [ ](https://twitter.com/LangChainAI "twitter.com") 

#### Cookie consent

We use cookies to recognize your repeated visits and preferences, as well as to measure the effectiveness of our documentation and whether users find what they're searching for. **Clicking "Accept" makes our documentation better. Thank you!** ❤️

* Google Analytics
* GitHub

Accept Reject 