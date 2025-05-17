[ Skip to content](#memory) 

**Help us build the JS tools that power AI apps at companies like Replit, Uber, LinkedIn, GitLab, and more. [Join our team!](https://jobs.ashbyhq.com/langchain/05efa205-8560-43fd-bfcc-3f7697561cfb?utm%5Fsource=https%3A%2F%2Flangchain-ai.github.io%2Flanggraphjs%2F&utm%5Fcampaign=langgraphjs%5Fdocs)** 

[ ![logo](../../static/wordmark_dark.svg) ![logo](../../static/wordmark_light.svg) ](../..) 

 Memory 

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
                              * Memory [  Memory ](./)  
                               Table of contents  
                                             * [  What is Memory? ](#what-is-memory)  
                                             * [  Short-term memory ](#short-term-memory)  
                                                               * [  Managing long conversation history ](#managing-long-conversation-history)  
                                                               * [  Editing message lists ](#editing-message-lists)  
                                                               * [  Summarizing past conversations ](#summarizing-past-conversations)  
                                                               * [  Knowing when to remove messages ](#knowing-when-to-remove-messages)  
                                             * [  Long-term memory ](#long-term-memory)  
                                                               * [  Writing memories ](#writing-memories)  
                                                                                    * [  Writing memories in the hot path ](#writing-memories-in-the-hot-path)  
                                                                                    * [  Writing memories in the background ](#writing-memories-in-the-background)  
                                                               * [  Managing memories ](#managing-memories)  
                                                                                    * [  Manage individual profiles ](#manage-individual-profiles)  
                                                                                    * [  Manage a collection of memories ](#manage-a-collection-of-memories)  
                                                               * [  Representing memories ](#representing-memories)  
                                                                                    * [  Update own instructions ](#update-own-instructions)  
                                                                                    * [  Few-shot examples ](#few-shot-examples)  
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
* [  What is Memory? ](#what-is-memory)
* [  Short-term memory ](#short-term-memory)  
   * [  Managing long conversation history ](#managing-long-conversation-history)  
   * [  Editing message lists ](#editing-message-lists)  
   * [  Summarizing past conversations ](#summarizing-past-conversations)  
   * [  Knowing when to remove messages ](#knowing-when-to-remove-messages)
* [  Long-term memory ](#long-term-memory)  
   * [  Writing memories ](#writing-memories)  
         * [  Writing memories in the hot path ](#writing-memories-in-the-hot-path)  
         * [  Writing memories in the background ](#writing-memories-in-the-background)  
   * [  Managing memories ](#managing-memories)  
         * [  Manage individual profiles ](#manage-individual-profiles)  
         * [  Manage a collection of memories ](#manage-a-collection-of-memories)  
   * [  Representing memories ](#representing-memories)  
         * [  Update own instructions ](#update-own-instructions)  
         * [  Few-shot examples ](#few-shot-examples)

1. [  LangGraph ](../..)
2. [  Guides ](../../how-tos/)
3. [  Concepts ](../)
4. [  LangGraph ](../../concepts#langgraph)

# Memory[¶](#memory "Permanent link")

## What is Memory?[¶](#what-is-memory "Permanent link")

Memory in AI applications refers to the ability to process, store, and effectively recall information from past interactions. With memory, your agents can learn from feedback and adapt to users' preferences. This guide is divided into two sections based on the scope of memory recall: short-term memory and long-term memory.

**Short-term memory**, or [thread](../persistence/#threads)\-scoped memory, can be recalled at any time **from within** a single conversational thread with a user. LangGraph manages short-term memory as a part of your agent's [state](../low%5Flevel/#state). State is persisted to a database using a [checkpointer](../persistence/#checkpoints) so the thread can be resumed at any time. Short-term memory updates when the graph is invoked or a step is completed, and the State is read at the start of each step.

**Long-term memory** is shared **across** conversational threads. It can be recalled _at any time_ and **in any thread**. Memories are scoped to any custom namespace, not just within a single thread ID. LangGraph provides [stores](../persistence/#memory-store) ([reference doc](https://langchain-ai.github.io/langgraphjs/reference/classes/checkpoint.BaseStore.html)) to let you save and recall long-term memories.

Both are important to understand and implement for your application.

![](../img/memory/short-vs-long.png)

## Short-term memory[¶](#short-term-memory "Permanent link")

Short-term memory lets your application remember previous interactions within a single [thread](../persistence/#threads) or conversation. A [thread](../persistence/#threads) organizes multiple interactions in a session, similar to the way email groups messages in a single conversation.

LangGraph manages short-term memory as part of the agent's state, persisted via thread-scoped checkpoints. This state can normally include the conversation history along with other stateful data, such as uploaded files, retrieved documents, or generated artifacts. By storing these in the graph's state, the bot can access the full context for a given conversation while maintaining separation between different threads.

Since conversation history is the most common form of representing short-term memory, in the next section, we will cover techniques for managing conversation history when the list of messages becomes **long**. If you want to stick to the high-level concepts, continue on to the [long-term memory](#long-term-memory) section.

### Managing long conversation history[¶](#managing-long-conversation-history "Permanent link")

Long conversations pose a challenge to today's LLMs. The full history may not even fit inside an LLM's context window, resulting in an irrecoverable error. Even _if_ your LLM technically supports the full context length, most LLMs still perform poorly over long contexts. They get "distracted" by stale or off-topic content, all while suffering from slower response times and higher costs.

Managing short-term memory is an exercise of balancing [precision & recall](https://en.wikipedia.org/wiki/Precision%5Fand%5Frecall#:~:text=Precision%20can%20be%20seen%20as,irrelevant%20ones%20are%20also%20returned) with your application's other performance requirements (latency & cost). As always, it's important to think critically about how you represent information for your LLM and to look at your data. We cover a few common techniques for managing message lists below and hope to provide sufficient context for you to pick the best tradeoffs for your application:

* [Editing message lists](#editing-message-lists): How to think about trimming and filtering a list of messages before passing to language model.
* [Summarizing past conversations](#summarizing-past-conversations): A common technique to use when you don't just want to filter the list of messages.

### Editing message lists[¶](#editing-message-lists "Permanent link")

Chat models accept context using [messages](https://js.langchain.com/docs/concepts/#messages), which include developer provided instructions (a system message) and user inputs (human messages). In chat applications, messages alternate between human inputs and model responses, resulting in a list of messages that grows longer over time. Because context windows are limited and token-rich message lists can be costly, many applications can benefit from using techniques to manually remove or forget stale information.

![](../img/memory/filter.png)

The most direct approach is to remove old messages from a list (similar to a [least-recently used cache](https://en.wikipedia.org/wiki/Page%5Freplacement%5Falgorithm#Least%5Frecently%5Fused)).

The typical technique for deleting content from a list in LangGraph is to return an update from a node telling the system to delete some portion of the list. You get to define what this update looks like, but a common approach would be to let you return an object or dictionary specifying which values to retain.

`[](#%5F%5Fcodelineno-0-1)import { Annotation } from "@langchain/langgraph";
[](#%5F%5Fcodelineno-0-2)
[](#%5F%5Fcodelineno-0-3)const StateAnnotation = Annotation.Root({
[](#%5F%5Fcodelineno-0-4)  myList: Annotation<any[]>({
[](#%5F%5Fcodelineno-0-5)    reducer: (
[](#%5F%5Fcodelineno-0-6)      existing: string[],
[](#%5F%5Fcodelineno-0-7)      updates: string[] | { type: string; from: number; to?: number }
[](#%5F%5Fcodelineno-0-8)    ) => {
[](#%5F%5Fcodelineno-0-9)      if (Array.isArray(updates)) {
[](#%5F%5Fcodelineno-0-10)        // Normal case, add to the history
[](#%5F%5Fcodelineno-0-11)        return [...existing, ...updates];
[](#%5F%5Fcodelineno-0-12)      } else if (typeof updates === "object" && updates.type === "keep") {
[](#%5F%5Fcodelineno-0-13)        // You get to decide what this looks like.
[](#%5F%5Fcodelineno-0-14)        // For example, you could simplify and just accept a string "DELETE"
[](#%5F%5Fcodelineno-0-15)        // and clear the entire list.
[](#%5F%5Fcodelineno-0-16)        return existing.slice(updates.from, updates.to);
[](#%5F%5Fcodelineno-0-17)      }
[](#%5F%5Fcodelineno-0-18)      // etc. We define how to interpret updates
[](#%5F%5Fcodelineno-0-19)      return existing;
[](#%5F%5Fcodelineno-0-20)    },
[](#%5F%5Fcodelineno-0-21)    default: () => [],
[](#%5F%5Fcodelineno-0-22)  }),
[](#%5F%5Fcodelineno-0-23)});
[](#%5F%5Fcodelineno-0-24)
[](#%5F%5Fcodelineno-0-25)type State = typeof StateAnnotation.State;
[](#%5F%5Fcodelineno-0-26)
[](#%5F%5Fcodelineno-0-27)function myNode(state: State) {
[](#%5F%5Fcodelineno-0-28)  return {
[](#%5F%5Fcodelineno-0-29)    // We return an update for the field "myList" saying to
[](#%5F%5Fcodelineno-0-30)    // keep only values from index -5 to the end (deleting the rest)
[](#%5F%5Fcodelineno-0-31)    myList: { type: "keep", from: -5, to: undefined },
[](#%5F%5Fcodelineno-0-32)  };
[](#%5F%5Fcodelineno-0-33)}
`

LangGraph will call the "[reducer](../low%5Flevel/#reducers)" function any time an update is returned under the key "myList". Within that function, we define what types of updates to accept. Typically, messages will be added to the existing list (the conversation will grow); however, we've also added support to accept a dictionary that lets you "keep" certain parts of the state. This lets you programmatically drop old message context.

Another common approach is to let you return a list of "remove" objects that specify the IDs of all messages to delete. If you're using the LangChain messages and the [messagesStateReducer](https://langchain-ai.github.io/langgraphjs/reference/functions/langgraph.messagesStateReducer.html) reducer (or [MessagesAnnotation](https://langchain-ai.github.io/langgraphjs/reference/variables/langgraph.MessagesAnnotation.html), which uses the same underlying functionality) in LangGraph, you can do this using a `RemoveMessage`.

`` [](#%5F%5Fcodelineno-1-1)import { RemoveMessage, AIMessage } from "@langchain/core/messages";
[](#%5F%5Fcodelineno-1-2)import { MessagesAnnotation } from "@langchain/langgraph";
[](#%5F%5Fcodelineno-1-3)
[](#%5F%5Fcodelineno-1-4)type State = typeof MessagesAnnotation.State;
[](#%5F%5Fcodelineno-1-5)
[](#%5F%5Fcodelineno-1-6)function myNode1(state: State) {
[](#%5F%5Fcodelineno-1-7)  // Add an AI message to the `messages` list in the state
[](#%5F%5Fcodelineno-1-8)  return { messages: [new AIMessage({ content: "Hi" })] };
[](#%5F%5Fcodelineno-1-9)}
[](#%5F%5Fcodelineno-1-10)
[](#%5F%5Fcodelineno-1-11)function myNode2(state: State) {
[](#%5F%5Fcodelineno-1-12)  // Delete all but the last 2 messages from the `messages` list in the state
[](#%5F%5Fcodelineno-1-13)  const deleteMessages = state.messages
[](#%5F%5Fcodelineno-1-14)    .slice(0, -2)
[](#%5F%5Fcodelineno-1-15)    .map((m) => new RemoveMessage({ id: m.id }));
[](#%5F%5Fcodelineno-1-16)  return { messages: deleteMessages };
[](#%5F%5Fcodelineno-1-17)}
 ``

In the example above, the `MessagesAnnotation` allows us to append new messages to the `messages` state key as shown in `myNode1`. When it sees a `RemoveMessage`, it will delete the message with that ID from the list (and the RemoveMessage will then be discarded). For more information on LangChain-specific message handling, check out [this how-to on using RemoveMessage](https://langchain-ai.github.io/langgraphjs/how-tos/memory/delete-messages/).

See this how-to [guide](https://langchain-ai.github.io/langgraphjs/how-tos/manage-conversation-history/)for example usage.

### Summarizing past conversations[¶](#summarizing-past-conversations "Permanent link")

The problem with trimming or removing messages, as shown above, is that we may lose information from culling of the message queue. Because of this, some applications benefit from a more sophisticated approach of summarizing the message history using a chat model.

![](../img/memory/summary.png)

Simple prompting and orchestration logic can be used to achieve this. As an example, in LangGraph we can extend the [MessagesAnnotation](https://langchain-ai.github.io/langgraphjs/reference/variables/langgraph.MessagesAnnotation.html) to include a `summary` key.

`[](#%5F%5Fcodelineno-2-1)import { MessagesAnnotation, Annotation } from "@langchain/langgraph";
[](#%5F%5Fcodelineno-2-2)
[](#%5F%5Fcodelineno-2-3)const MyGraphAnnotation = Annotation.Root({
[](#%5F%5Fcodelineno-2-4)  ...MessagesAnnotation.spec,
[](#%5F%5Fcodelineno-2-5)  summary: Annotation<string>,
[](#%5F%5Fcodelineno-2-6)});
`

Then, we can generate a summary of the chat history, using any existing summary as context for the next summary. This `summarizeConversation` node can be called after some number of messages have accumulated in the `messages` state key.

`` [](#%5F%5Fcodelineno-3-1)import { ChatOpenAI } from "@langchain/openai";
[](#%5F%5Fcodelineno-3-2)import { HumanMessage, RemoveMessage } from "@langchain/core/messages";
[](#%5F%5Fcodelineno-3-3)
[](#%5F%5Fcodelineno-3-4)type State = typeof MyGraphAnnotation.State;
[](#%5F%5Fcodelineno-3-5)
[](#%5F%5Fcodelineno-3-6)async function summarizeConversation(state: State) {
[](#%5F%5Fcodelineno-3-7)  // First, we get any existing summary
[](#%5F%5Fcodelineno-3-8)  const summary = state.summary || "";
[](#%5F%5Fcodelineno-3-9)
[](#%5F%5Fcodelineno-3-10)  // Create our summarization prompt
[](#%5F%5Fcodelineno-3-11)  let summaryMessage: string;
[](#%5F%5Fcodelineno-3-12)  if (summary) {
[](#%5F%5Fcodelineno-3-13)    // A summary already exists
[](#%5F%5Fcodelineno-3-14)    summaryMessage =
[](#%5F%5Fcodelineno-3-15)      `This is a summary of the conversation to date: ${summary}\n\n` +
[](#%5F%5Fcodelineno-3-16)      "Extend the summary by taking into account the new messages above:";
[](#%5F%5Fcodelineno-3-17)  } else {
[](#%5F%5Fcodelineno-3-18)    summaryMessage = "Create a summary of the conversation above:";
[](#%5F%5Fcodelineno-3-19)  }
[](#%5F%5Fcodelineno-3-20)
[](#%5F%5Fcodelineno-3-21)  // Add prompt to our history
[](#%5F%5Fcodelineno-3-22)  const messages = [
[](#%5F%5Fcodelineno-3-23)    ...state.messages,
[](#%5F%5Fcodelineno-3-24)    new HumanMessage({ content: summaryMessage }),
[](#%5F%5Fcodelineno-3-25)  ];
[](#%5F%5Fcodelineno-3-26)
[](#%5F%5Fcodelineno-3-27)  // Assuming you have a ChatOpenAI model instance
[](#%5F%5Fcodelineno-3-28)  const model = new ChatOpenAI();
[](#%5F%5Fcodelineno-3-29)  const response = await model.invoke(messages);
[](#%5F%5Fcodelineno-3-30)
[](#%5F%5Fcodelineno-3-31)  // Delete all but the 2 most recent messages
[](#%5F%5Fcodelineno-3-32)  const deleteMessages = state.messages
[](#%5F%5Fcodelineno-3-33)    .slice(0, -2)
[](#%5F%5Fcodelineno-3-34)    .map((m) => new RemoveMessage({ id: m.id }));
[](#%5F%5Fcodelineno-3-35)
[](#%5F%5Fcodelineno-3-36)  return {
[](#%5F%5Fcodelineno-3-37)    summary: response.content,
[](#%5F%5Fcodelineno-3-38)    messages: deleteMessages,
[](#%5F%5Fcodelineno-3-39)  };
[](#%5F%5Fcodelineno-3-40)}
 ``

See this how-to [here](https://langchain-ai.github.io/langgraphjs/how-tos/memory/add-summary-conversation-history/) for example usage.

### Knowing **when** to remove messages[¶](#knowing-when-to-remove-messages "Permanent link")

Most LLMs have a maximum supported context window (denominated in tokens). A simple way to decide when to truncate messages is to count the tokens in the message history and truncate whenever it approaches that limit. Naive truncation is straightforward to implement on your own, though there are a few "gotchas". Some model APIs further restrict the sequence of message types (must start with human message, cannot have consecutive messages of the same type, etc.). If you're using LangChain, you can use the [trimMessages](https://js.langchain.com/docs/how%5Fto/trim%5Fmessages/#trimming-based-on-token-count) utility and specify the number of tokens to keep from the list, as well as the `strategy` (e.g., keep the last `maxTokens`) to use for handling the boundary.

Below is an example.

`[](#%5F%5Fcodelineno-4-1)import { trimMessages } from "@langchain/core/messages";
[](#%5F%5Fcodelineno-4-2)import { ChatOpenAI } from "@langchain/openai";
[](#%5F%5Fcodelineno-4-3)
[](#%5F%5Fcodelineno-4-4)trimMessages(messages, {
[](#%5F%5Fcodelineno-4-5)  // Keep the last <= n_count tokens of the messages.
[](#%5F%5Fcodelineno-4-6)  strategy: "last",
[](#%5F%5Fcodelineno-4-7)  // Remember to adjust based on your model
[](#%5F%5Fcodelineno-4-8)  // or else pass a custom token_encoder
[](#%5F%5Fcodelineno-4-9)  tokenCounter: new ChatOpenAI({ modelName: "gpt-4" }),
[](#%5F%5Fcodelineno-4-10)  // Remember to adjust based on the desired conversation
[](#%5F%5Fcodelineno-4-11)  // length
[](#%5F%5Fcodelineno-4-12)  maxTokens: 45,
[](#%5F%5Fcodelineno-4-13)  // Most chat models expect that chat history starts with either:
[](#%5F%5Fcodelineno-4-14)  // (1) a HumanMessage or
[](#%5F%5Fcodelineno-4-15)  // (2) a SystemMessage followed by a HumanMessage
[](#%5F%5Fcodelineno-4-16)  startOn: "human",
[](#%5F%5Fcodelineno-4-17)  // Most chat models expect that chat history ends with either:
[](#%5F%5Fcodelineno-4-18)  // (1) a HumanMessage or
[](#%5F%5Fcodelineno-4-19)  // (2) a ToolMessage
[](#%5F%5Fcodelineno-4-20)  endOn: ["human", "tool"],
[](#%5F%5Fcodelineno-4-21)  // Usually, we want to keep the SystemMessage
[](#%5F%5Fcodelineno-4-22)  // if it's present in the original history.
[](#%5F%5Fcodelineno-4-23)  // The SystemMessage has special instructions for the model.
[](#%5F%5Fcodelineno-4-24)  includeSystem: true,
[](#%5F%5Fcodelineno-4-25)});
`

## Long-term memory[¶](#long-term-memory "Permanent link")

Long-term memory in LangGraph allows systems to retain information across different conversations or sessions. Unlike short-term memory, which is thread-scoped, long-term memory is saved within custom "namespaces."

LangGraph stores long-term memories as JSON documents in a [store](../persistence/#memory-store) ([reference doc](https://langchain-ai.github.io/langgraphjs/reference/classes/checkpoint.BaseStore.html)). Each memory is organized under a custom `namespace` (similar to a folder) and a distinct `key` (like a filename). Namespaces often include user or org IDs or other labels that makes it easier to organize information. This structure enables hierarchical organization of memories. Cross-namespace searching is then supported through content filters. See the example below for an example.

`[](#%5F%5Fcodelineno-5-1)import { InMemoryStore } from "@langchain/langgraph";
[](#%5F%5Fcodelineno-5-2)
[](#%5F%5Fcodelineno-5-3)// InMemoryStore saves data to an in-memory dictionary. Use a DB-backed store in production use.
[](#%5F%5Fcodelineno-5-4)const store = new InMemoryStore();
[](#%5F%5Fcodelineno-5-5)const userId = "my-user";
[](#%5F%5Fcodelineno-5-6)const applicationContext = "chitchat";
[](#%5F%5Fcodelineno-5-7)const namespace = [userId, applicationContext];
[](#%5F%5Fcodelineno-5-8)await store.put(namespace, "a-memory", {
[](#%5F%5Fcodelineno-5-9)  rules: [
[](#%5F%5Fcodelineno-5-10)    "User likes short, direct language",
[](#%5F%5Fcodelineno-5-11)    "User only speaks English & TypeScript",
[](#%5F%5Fcodelineno-5-12)  ],
[](#%5F%5Fcodelineno-5-13)  "my-key": "my-value",
[](#%5F%5Fcodelineno-5-14)});
[](#%5F%5Fcodelineno-5-15)// get the "memory" by ID
[](#%5F%5Fcodelineno-5-16)const item = await store.get(namespace, "a-memory");
[](#%5F%5Fcodelineno-5-17)// list "memories" within this namespace, filtering on content equivalence
[](#%5F%5Fcodelineno-5-18)const items = await store.search(namespace, {
[](#%5F%5Fcodelineno-5-19)  filter: { "my-key": "my-value" },
[](#%5F%5Fcodelineno-5-20)});
`

When adding long-term memory to your agent, it's important to think about how to **write memories**, how to **store and manage memory updates**, and how to **recall & represent memories** for the LLM in your application. These questions are all interdependent: how you want to recall & format memories for the LLM dictates what you should store and how to manage it. Furthermore, each technique has tradeoffs. The right approach for you largely depends on your application's needs. LangGraph aims to give you the low-level primitives to directly control the long-term memory of your application, based on memory [Store](../persistence/#memory-store)'s.

Long-term memory is far from a solved problem. While it is hard to provide generic advice, we have provided a few reliable patterns below for your consideration as you implement long-term memory.

**Do you want to write memories "on the hot path" or "in the background"**

Memory can be updated either as part of your primary application logic (e.g. "on the hot path" of the application) or as a background task (as a separate function that generates memories based on the primary application's state). We document some tradeoffs for each approach in [the writing memories section below](#writing-memories).

**Do you want to manage memories as a single profile or as a collection of documents?**

We provide two main approaches to managing long-term memory: a single, continuously updated document (referred to as a "profile" or "schema") or a collection of documents. Each method offers its own benefits, depending on the type of information you need to store and how you intend to access it.

Managing memories as a single, continuously updated "profile" or "schema" is useful when there is well-scoped, specific information you want to remember about a user, organization, or other entity (including the agent itself). You can define the schema of the profile ahead of time, and then use an LLM to update this based on interactions. Querying the "memory" is easy since it's a simple GET operation on a JSON document. We explain this in more detail in [remember a profile](#manage-individual-profiles). This technique can provide higher precision (on known information use cases) at the expense of lower recall (since you have to anticipate and model your domain, and updates to the doc tend to delete or rewrite away old information at a greater frequency).

Managing long-term memory as a collection of documents, on the other hand, lets you store an unbounded amount of information. This technique is useful when you want to repeatedly extract & remember items over a long time horizon but can be more complicated to query and manage over time. Similar to the "profile" memory, you still define schema(s) for each memory. Rather than overwriting a single document, you instead will insert new ones (and potentially update or re-contextualize existing ones in the process). We explain this approach in more detail in ["managing a collection of memories"](#manage-a-collection-of-memories).

**Do you want to present memories to your agent as updated instructions or as few-shot examples?**

Memories are typically provided to the LLM as a part of the system prompt. Some common ways to "frame" memories for the LLM include providing raw information as "memories from previous interactions with user A", as system instructions or rules, or as few-shot examples.

Framing memories as "learning rules or instructions" typically means dedicating a portion of the system prompt to instructions the LLM can manage itself. After each conversation, you can prompt the LLM to evaluate its performance and update the instructions to better handle this type of task in the future. We explain this approach in more detail in [this section](#update-own-instructions).

Storing memories as few-shot examples lets you store and manage instructions as cause and effect. Each memory stores an input or context and expected response. Including a reasoning trajectory (a chain-of-thought) can also help provide sufficient context so that the memory is less likely to be mis-used in the future. We elaborate on this concept more in [this section](#few-shot-examples).

We will expand on techniques for writing, managing, and recalling & formatting memories in the following section.

### Writing memories[¶](#writing-memories "Permanent link")

Humans form long-term memories when we sleep, but when and how should our agents create new memories? The two most common ways we see agents write memories are "on the hot path" and "in the background".

#### Writing memories in the hot path[¶](#writing-memories-in-the-hot-path "Permanent link")

This involves creating memories while the application is running. To provide a popular production example, ChatGPT manages memories using a "save\_memories" tool to upsert memories as content strings. It decides whether (and how) to use this tool every time it receives a user message and multi-tasks memory management with the rest of the user instructions.

This has a few benefits. First of all, it happens "in real time". If the user starts a new thread right away that memory will be present. The user also transparently sees when memories are stored, since the bot has to explicitly decide to store information and can relate that to the user.

This also has several downsides. It complicates the decisions the agent must make (what to commit to memory). This complication can degrade its tool-calling performance and reduce task completion rates. It will slow down the final response since it needs to decide what to commit to memory. It also typically leads to fewer things being saved to memory (since the assistant is multi-tasking), which will cause **lower recall** in later conversations.

#### Writing memories in the background[¶](#writing-memories-in-the-background "Permanent link")

This involves updating memory as a conceptually separate task, typically as a completely separate graph or function. Since it happens in the background, it incurs no latency. It also splits up the application logic from the memory logic, making it more modular and easy to manage. It also lets you separate the timing of memory creation, letting you avoid redundant work. Your agent can focus on accomplishing its immediate task without having to consciously think about what it needs to remember.

This approach is not without its downsides, however. You have to think about how often to write memories. If it doesn't run in realtime, the user's interactions on other threads won't benefit from the new context. You also have to think about when to trigger this job. We typically recommend scheduling memories after some point of time, cancelling and re-scheduling for the future if new events occur on a given thread. Other popular choices are to form memories on some cron schedule or to let the user or application logic manually trigger memory formation.

### Managing memories[¶](#managing-memories "Permanent link")

Once you've sorted out memory scheduling, it's important to think about **how to update memory with new information**.

There are two main approaches: you can either continuously update a single document (memory profile) or insert new documents each time you receive new information.

We will outline some tradeoffs between these two approaches below, understanding that most people will find it most appropriate to combine approaches and to settle somewhere in the middle.

#### Manage individual profiles[¶](#manage-individual-profiles "Permanent link")

A profile is generally just a JSON document with various key-value pairs you've selected to represent your domain. When remembering a profile, you will want to make sure that you are **updating** the profile each time. As a result, you will want to pass in the previous profile and ask the LLM to generate a new profile (or some JSON patch to apply to the old profile).

The larger the document, the more error-prone this can become. If your document becomes **too** large, you may want to consider splitting up the profiles into separate sections. You will likely need to use generation with retries and/or **strict** decoding when generating documents to ensure the memory schemas remains valid.

#### Manage a collection of memories[¶](#manage-a-collection-of-memories "Permanent link")

Saving memories as a collection of documents simplifies some things. Each individual memory can be more narrowly scoped and easier to generate. It also means you're less likely to **lose** information over time, since it's easier for an LLM to generate _new_ objects for new information than it is for it to reconcile that new information with information in a dense profile. This tends to lead to higher recall downstream.

This approach shifts some complexity to how you prompt the LLM to apply memory updates. You now have to enable the LLM to _delete_ or _update_ existing items in the list. This can be tricky to prompt the LLM to do. Some LLMs may default to over-inserting; others may default to over-updating. Tuning the behavior here is best done through evals, something you can do with a tool like [LangSmith](https://docs.smith.langchain.com/tutorials/Developers/evaluation).

This also shifts complexity to memory **search** (recall). You have to think about what relevant items to use. Right now we support filtering by metadata. We will be adding semantic search shortly.

Finally, this shifts some complexity to how you represent the memories for the LLM (and by extension, the schemas you use to save each memories). It's very easy to write memories that can easily be mistaken out-of-context. It's important to prompt the LLM to include all necessary contextual information in the given memory so that when you use it in later conversations it doesn't mistakenly mis-apply that information.

### Representing memories[¶](#representing-memories "Permanent link")

Once you have saved memories, the way you then retrieve and present the memory content for the LLM can play a large role in how well your LLM incorporates that information in its responses. The following sections present a couple of common approaches. Note that these sections also will largely inform how you write and manage memories. Everything in memory is connected!

#### Update own instructions[¶](#update-own-instructions "Permanent link")

While instructions are often static text written by the developer, many AI applications benefit from letting the users personalize the rules and instructions the agent should follow whenever it interacts with that user. This ideally can be inferred by its interactions with the user (so the user doesn't have to explicitly change settings in your app). In this sense, instructions are a form of long-form memory!

One way to apply this is using "reflection" or "Meta-prompting" steps. Prompt the LLM with the current instruction set (from the system prompt) and a conversation with the user, and instruct the LLM to refine its instructions. This approach allows the system to dynamically update and improve its own behavior, potentially leading to better performance on various tasks. This is particularly useful for tasks where the instructions are challenging to specify a priori.

Meta-prompting uses past information to refine prompts. For instance, a [Tweet generator](https://www.youtube.com/watch?v=Vn8A3BxfplE) employs meta-prompting to enhance its paper summarization prompt for Twitter. You could implement this using LangGraph's memory store to save updated instructions in a shared namespace. In this case, we will namespace the memories as "agent\_instructions" and key the memory based on the agent.

`[](#%5F%5Fcodelineno-6-1)import { BaseStore } from "@langchain/langgraph/store";
[](#%5F%5Fcodelineno-6-2)import { State } from "@langchain/langgraph";
[](#%5F%5Fcodelineno-6-3)import { ChatOpenAI } from "@langchain/openai";
[](#%5F%5Fcodelineno-6-4)
[](#%5F%5Fcodelineno-6-5)// Node that *uses* the instructions
[](#%5F%5Fcodelineno-6-6)const callModel = async (state: State, store: BaseStore) => {
[](#%5F%5Fcodelineno-6-7)  const namespace = ["agent_instructions"];
[](#%5F%5Fcodelineno-6-8)  const instructions = await store.get(namespace, "agent_a");
[](#%5F%5Fcodelineno-6-9)  // Application logic
[](#%5F%5Fcodelineno-6-10)  const prompt = promptTemplate.format({
[](#%5F%5Fcodelineno-6-11)    instructions: instructions[0].value.instructions,
[](#%5F%5Fcodelineno-6-12)  });
[](#%5F%5Fcodelineno-6-13)  // ... rest of the logic
[](#%5F%5Fcodelineno-6-14)};
[](#%5F%5Fcodelineno-6-15)
[](#%5F%5Fcodelineno-6-16)// Node that updates instructions
[](#%5F%5Fcodelineno-6-17)const updateInstructions = async (state: State, store: BaseStore) => {
[](#%5F%5Fcodelineno-6-18)  const namespace = ["instructions"];
[](#%5F%5Fcodelineno-6-19)  const currentInstructions = await store.search(namespace);
[](#%5F%5Fcodelineno-6-20)  // Memory logic
[](#%5F%5Fcodelineno-6-21)  const prompt = promptTemplate.format({
[](#%5F%5Fcodelineno-6-22)    instructions: currentInstructions[0].value.instructions,
[](#%5F%5Fcodelineno-6-23)    conversation: state.messages,
[](#%5F%5Fcodelineno-6-24)  });
[](#%5F%5Fcodelineno-6-25)  const llm = new ChatOpenAI();
[](#%5F%5Fcodelineno-6-26)  const output = await llm.invoke(prompt);
[](#%5F%5Fcodelineno-6-27)  const newInstructions = output.content; // Assuming the LLM returns the new instructions
[](#%5F%5Fcodelineno-6-28)  await store.put(["agent_instructions"], "agent_a", {
[](#%5F%5Fcodelineno-6-29)    instructions: newInstructions,
[](#%5F%5Fcodelineno-6-30)  });
[](#%5F%5Fcodelineno-6-31)  // ... rest of the logic
[](#%5F%5Fcodelineno-6-32)};
`

#### Few-shot examples[¶](#few-shot-examples "Permanent link")

Sometimes it's easier to "show" than "tell." LLMs learn well from examples. Few-shot learning lets you ["program"](https://x.com/karpathy/status/1627366413840322562) your LLM by updating the prompt with input-output examples to illustrate the intended behavior. While various [best-practices](https://js.langchain.com/docs/concepts/#1-generating-examples) can be used to generate few-shot examples, often the challenge lies in selecting the most relevant examples based on user input.

Note that the memory store is just one way to store data as few-shot examples. If you want to have more developer involvement, or tie few-shots more closely to your evaluation harness, you can also use a [LangSmith Dataset](https://docs.smith.langchain.com/how%5Fto%5Fguides/datasets) to store your data. Then dynamic few-shot example selectors can be used out-of-the box to achieve this same goal. LangSmith will index the dataset for you and enable retrieval of few shot examples that are most relevant to the user input based upon keyword similarity ([using a BM25-like algorithm](https://docs.smith.langchain.com/how%5Fto%5Fguides/datasets/index%5Fdatasets%5Ffor%5Fdynamic%5Ffew%5Fshot%5Fexample%5Fselection) for keyword based similarity).

See this how-to [video](https://www.youtube.com/watch?v=37VaU7e7t5o) for example usage of dynamic few-shot example selection in LangSmith. Also, see this [blog post](https://blog.langchain.dev/few-shot-prompting-to-improve-tool-calling-performance/) showcasing few-shot prompting to improve tool calling performance and this [blog post](https://blog.langchain.dev/aligning-llm-as-a-judge-with-human-preferences/) using few-shot example to align an LLMs to human preferences.

 Was this page helpful? 

 Thanks for your feedback!

 Thanks for your feedback! Please help us improve this page by adding to the discussion below.

 Back to top 

[  Previous  Persistence ](../persistence/) [  Next  Streaming ](../streaming/) 

 Copyright © 2025 LangChain, Inc | [Consent Preferences](#%5F%5Fconsent) 

 Made with[ Material for MkDocs Insiders](https://squidfunk.github.io/mkdocs-material/) 

[ ](https://langchain-ai.github.io/langgraph/ "langchain-ai.github.io") [ ](https://github.com/langchain-ai/langgraphjs "github.com") [ ](https://twitter.com/LangChainAI "twitter.com") 

#### Cookie consent

We use cookies to recognize your repeated visits and preferences, as well as to measure the effectiveness of our documentation and whether users find what they're searching for. **Clicking "Accept" makes our documentation better. Thank you!** ❤️

* Google Analytics
* GitHub

Accept Reject 