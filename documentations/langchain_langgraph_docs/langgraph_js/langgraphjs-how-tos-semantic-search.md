[ Skip to content](#how-to-add-semantic-search-to-your-agents-memory) 

**Help us build the JS tools that power AI apps at companies like Replit, Uber, LinkedIn, GitLab, and more. [Join our team!](https://jobs.ashbyhq.com/langchain/05efa205-8560-43fd-bfcc-3f7697561cfb?utm%5Fsource=https%3A%2F%2Flangchain-ai.github.io%2Flanggraphjs%2F&utm%5Fcampaign=langgraphjs%5Fdocs)** 

[ ![logo](../../static/wordmark_dark.svg) ![logo](../../static/wordmark_light.svg) ](../..) 

 How to add semantic search to your agent's memory 

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
         * [  How-to Guides ](../)  
          How-to Guides  
                  * [  Installation ](../../how-tos#installation)  
                  * LangGraph  
                   LangGraph  
                              * [  LangGraph ](../../how-tos#langgraph)  
                              * [  Controllability ](../../how-tos#controllability)  
                              * [  Persistence ](../../how-tos#persistence)  
                              * Memory  
                               Memory  
                                             * [  Memory ](../../how-tos#memory)  
                                             * [  How to manage conversation history ](../manage-conversation-history/)  
                                             * [  How to delete messages ](../delete-messages/)  
                                             * [  How to add summary of the conversation history ](../add-summary-conversation-history/)  
                                             * How to add semantic search to your agent's memory [  How to add semantic search to your agent's memory ](./)  
                                              Table of contents  
                                                               * [  Dependencies and environment setup ](#dependencies-and-environment-setup)  
                                                               * [  Initializing a memory store with semantic search ](#initializing-a-memory-store-with-semantic-search)  
                                                               * [  The anatomy of a memory ](#the-anatomy-of-a-memory)  
                                                               * [  Simple memory retrieval ](#simple-memory-retrieval)  
                                                               * [  Searching memories with natural language ](#searching-memories-with-natural-language)  
                                                               * [  Simple Example: Long-term semantic memory in a ReAct agent ](#simple-example-long-term-semantic-memory-in-a-react-agent)  
                                                                                    * [  Simple memory storage tool ](#simple-memory-storage-tool)  
                                                                                    * [  Simple semantic recall mechanism ](#simple-semantic-recall-mechanism)  
                                                                                    * [  Putting it all together ](#putting-it-all-together)  
                                                                                    * [  Using our sample agent ](#using-our-sample-agent)  
                                                                                                            * [  Storing new memories ](#storing-new-memories)  
                                                               * [  Advanced Usage ](#advanced-usage)  
                                                                                    * [  Multi-vector indexing ](#multi-vector-indexing)  
                                                                                    * [  Override fields at storage time ](#override-fields-at-storage-time)  
                              * [  Human-in-the-loop ](../../how-tos#human-in-the-loop)  
                              * [  Streaming ](../../how-tos#streaming)  
                              * [  Tool calling ](../../how-tos#tool-calling)  
                              * [  Subgraphs ](../../how-tos#subgraphs)  
                              * [  Multi-agent ](../multi-agent-network/)  
                              * [  State Management ](../../how-tos#state-management)  
                              * [  Other ](../../how-tos#other)  
                              * [  Prebuilt ReAct Agent ](../../how-tos#prebuilt-react-agent)  
                  * [  LangGraph Platform ](../../how-tos#langgraph-platform)  
         * [  Concepts ](../../concepts/)  
         * [  Tutorials ](../../tutorials/)  
   * Resources  
    Resources  
         * [  Adopters ](../../adopters/)  
         * [  LLMS-txt ](../../llms-txt-overview/)  
         * [  FAQ ](../../concepts/faq/)  
         * [  Troubleshooting ](../../troubleshooting/errors/)  
         * [  LangGraph Academy Course ](https://academy.langchain.com/courses/intro-to-langgraph)
* [  Agents ](../../agents/overview/)
* [  API reference ](../../reference/)
* [  Versions ](../../versions/)

 Table of contents 
* [  Dependencies and environment setup ](#dependencies-and-environment-setup)
* [  Initializing a memory store with semantic search ](#initializing-a-memory-store-with-semantic-search)
* [  The anatomy of a memory ](#the-anatomy-of-a-memory)
* [  Simple memory retrieval ](#simple-memory-retrieval)
* [  Searching memories with natural language ](#searching-memories-with-natural-language)
* [  Simple Example: Long-term semantic memory in a ReAct agent ](#simple-example-long-term-semantic-memory-in-a-react-agent)  
   * [  Simple memory storage tool ](#simple-memory-storage-tool)  
   * [  Simple semantic recall mechanism ](#simple-semantic-recall-mechanism)  
   * [  Putting it all together ](#putting-it-all-together)  
   * [  Using our sample agent ](#using-our-sample-agent)  
         * [  Storing new memories ](#storing-new-memories)
* [  Advanced Usage ](#advanced-usage)  
   * [  Multi-vector indexing ](#multi-vector-indexing)  
   * [  Override fields at storage time ](#override-fields-at-storage-time)

1. [  LangGraph ](../..)
2. [  Guides ](../)
3. [  How-to Guides ](../)
4. [  LangGraph ](../../how-tos#langgraph)
5. [  Memory ](../../how-tos#memory)

# How to add semantic search to your agent's memory[¶](#how-to-add-semantic-search-to-your-agents-memory "Permanent link")

This guide shows how to enable semantic search in your agent's memory store. This lets your agent search for items in the long-term memory store by semantic similarity.

## Dependencies and environment setup[¶](#dependencies-and-environment-setup "Permanent link")

First, install this guide's required dependencies.

`[](#%5F%5Fcodelineno-0-1)npm install \
[](#%5F%5Fcodelineno-0-2)  @langchain/langgraph \
[](#%5F%5Fcodelineno-0-3)  @langchain/openai \
[](#%5F%5Fcodelineno-0-4)  @langchain/core \
[](#%5F%5Fcodelineno-0-5)  uuid \
[](#%5F%5Fcodelineno-0-6)  zod
`

Next, we need to set API keys for OpenAI (the LLM we will use)

`[](#%5F%5Fcodelineno-1-1)export OPENAI_API_KEY=your-api-key
`

Optionally, we can set API key for [LangSmith tracing](https://smith.langchain.com/), which will give us best-in-class observability.

`[](#%5F%5Fcodelineno-2-1)export LANGCHAIN_TRACING_V2="true"
[](#%5F%5Fcodelineno-2-2)export LANGCHAIN_CALLBACKS_BACKGROUND="true"
[](#%5F%5Fcodelineno-2-3)export LANGCHAIN_API_KEY=your-api-key
`

## Initializing a memory store with semantic search[¶](#initializing-a-memory-store-with-semantic-search "Permanent link")

Here we create our memory store with an [index configuration](https://langchain-ai.github.io/langgraphjs/reference/interfaces/checkpoint.IndexConfig.html).

By default, stores are configured without semantic/vector search. You can opt in to indexing items when creating the store by providing an [IndexConfig](https://langchain-ai.github.io/langgraphjs/reference/interfaces/checkpoint.IndexConfig.html) to the store's constructor.

If your store class does not implement this interface, or if you do not pass in an index configuration, semantic search is disabled, and all `index` arguments passed to `put` will have no effect.

Now, let's create that store!

`[](#%5F%5Fcodelineno-3-1)import { OpenAIEmbeddings } from "@langchain/openai";
[](#%5F%5Fcodelineno-3-2)import { InMemoryStore } from "@langchain/langgraph";
[](#%5F%5Fcodelineno-3-3)
[](#%5F%5Fcodelineno-3-4)const embeddings = new OpenAIEmbeddings({
[](#%5F%5Fcodelineno-3-5)  model: "text-embedding-3-small",
[](#%5F%5Fcodelineno-3-6)});
[](#%5F%5Fcodelineno-3-7)
[](#%5F%5Fcodelineno-3-8)const store = new InMemoryStore({
[](#%5F%5Fcodelineno-3-9)  index: {
[](#%5F%5Fcodelineno-3-10)    embeddings,
[](#%5F%5Fcodelineno-3-11)    dims: 1536,
[](#%5F%5Fcodelineno-3-12)  }
[](#%5F%5Fcodelineno-3-13)});
`

## The anatomy of a memory[¶](#the-anatomy-of-a-memory "Permanent link")

Before we get into semantic search, let's look at how memories are structured, and how to store them:

`[](#%5F%5Fcodelineno-4-1)let namespace = ["user_123", "memories"]
[](#%5F%5Fcodelineno-4-2)let memoryKey = "favorite_food"
[](#%5F%5Fcodelineno-4-3)let memoryValue = {"text": "I love pizza"}
[](#%5F%5Fcodelineno-4-4)
[](#%5F%5Fcodelineno-4-5)await store.put(namespace, memoryKey, memoryValue)
`

As you can see, memories are composed of a namespace, a key, and a value.

**Namespaces** are multi-dimensional values (arrays of strings) that allow you to segment memory according to the needs of your application. In this case, we're segmenting memories by user by using a User ID (`"user_123"`) as the first dimension of our namespace array.

**Keys** are arbitrary strings that identify the memory within the namespace. If you write to the same key in the same namespace multiple times, you'll overwrite the memory that was stored under that key.

**Values** are objects that represent the actual memory being stored. These can be any object, so long as its serializable. You can structure these objects according to the needs of your application.

## Simple memory retrieval[¶](#simple-memory-retrieval "Permanent link")

Let's add some more memories to our store and then fetch one of them by it's key to check that it stored properly.

`[](#%5F%5Fcodelineno-5-1)await store.put(
[](#%5F%5Fcodelineno-5-2)  ["user_123", "memories"],
[](#%5F%5Fcodelineno-5-3)  "italian_food",
[](#%5F%5Fcodelineno-5-4)  {"text": "I prefer Italian food"}
[](#%5F%5Fcodelineno-5-5))
[](#%5F%5Fcodelineno-5-6)await store.put(
[](#%5F%5Fcodelineno-5-7)  ["user_123", "memories"],
[](#%5F%5Fcodelineno-5-8)  "spicy_food",
[](#%5F%5Fcodelineno-5-9)  {"text": "I don't like spicy food"}
[](#%5F%5Fcodelineno-5-10))
[](#%5F%5Fcodelineno-5-11)await store.put(
[](#%5F%5Fcodelineno-5-12)  ["user_123", "memories"],
[](#%5F%5Fcodelineno-5-13)  "occupation",
[](#%5F%5Fcodelineno-5-14)  {"text": "I am an airline pilot"}
[](#%5F%5Fcodelineno-5-15))
[](#%5F%5Fcodelineno-5-16)
[](#%5F%5Fcodelineno-5-17)// That occupation is too lofty - let's overwrite
[](#%5F%5Fcodelineno-5-18)// it with something more... down-to-earth
[](#%5F%5Fcodelineno-5-19)await store.put(
[](#%5F%5Fcodelineno-5-20)  ["user_123", "memories"],
[](#%5F%5Fcodelineno-5-21)  "occupation",
[](#%5F%5Fcodelineno-5-22)  {"text": "I am a tunnel engineer"}
[](#%5F%5Fcodelineno-5-23))
[](#%5F%5Fcodelineno-5-24)
[](#%5F%5Fcodelineno-5-25)// now let's check that our occupation memory was overwritten
[](#%5F%5Fcodelineno-5-26)const occupation = await store.get(["user_123", "memories"], "occupation")
[](#%5F%5Fcodelineno-5-27)console.log(occupation.value.text)
`

`[](#%5F%5Fcodelineno-6-1)I am a tunnel engineer
`

## Searching memories with natural language[¶](#searching-memories-with-natural-language "Permanent link")

Now that we've seen how to store and retrieve memories by namespace and key, let's look at how memories are retrieved using semantic search.

Imagine that we had a big pile of memories that we wanted to search, and we didn't know the key that corresponds to the memory that we want to retrieve. Semantic search allows us to search our memory store without keys, by performing a natural language query using text embeddings. We demonstrate this in the following example:

`` [](#%5F%5Fcodelineno-7-1)const memories = await store.search(["user_123", "memories"], {
[](#%5F%5Fcodelineno-7-2)  query: "What is my occupation?",
[](#%5F%5Fcodelineno-7-3)  limit: 3,
[](#%5F%5Fcodelineno-7-4)});
[](#%5F%5Fcodelineno-7-5)
[](#%5F%5Fcodelineno-7-6)for (const memory of memories) {
[](#%5F%5Fcodelineno-7-7)  console.log(`Memory: ${memory.value.text} (similarity: ${memory.score})`);
[](#%5F%5Fcodelineno-7-8)}
 ``

`[](#%5F%5Fcodelineno-8-1)Memory: I am a tunnel engineer (similarity: 0.3070681445327329)
[](#%5F%5Fcodelineno-8-2)Memory: I prefer Italian food (similarity: 0.1435366180543232)
[](#%5F%5Fcodelineno-8-3)Memory: I love pizza (similarity: 0.10650935500808985)
`

## Simple Example: Long-term semantic memory in a ReAct agent[¶](#simple-example-long-term-semantic-memory-in-a-react-agent "Permanent link")

Let's look at a simple example of providing an agent with long-term memory.

Long-term memory can be thought of in two phases: storage, and recall.

In the example below we handle storage by giving the agent a tool that it can use to create new memories.

To handle recall we'll add a prompt step that queries the memory store using the text from the user's chat message. We'll then inject the results of that query into the system message.

### Simple memory storage tool[¶](#simple-memory-storage-tool "Permanent link")

Let's start off by creating a tool that lets the LLM store new memories:

`[](#%5F%5Fcodelineno-9-1)import { tool } from "@langchain/core/tools";
[](#%5F%5Fcodelineno-9-2)import { LangGraphRunnableConfig } from "@langchain/langgraph";
[](#%5F%5Fcodelineno-9-3)
[](#%5F%5Fcodelineno-9-4)import { z } from "zod";
[](#%5F%5Fcodelineno-9-5)import { v4 as uuidv4 } from "uuid";
[](#%5F%5Fcodelineno-9-6)
[](#%5F%5Fcodelineno-9-7)const upsertMemoryTool = tool(async (
[](#%5F%5Fcodelineno-9-8)  { content },
[](#%5F%5Fcodelineno-9-9)  config: LangGraphRunnableConfig
[](#%5F%5Fcodelineno-9-10)): Promise<string> => {
[](#%5F%5Fcodelineno-9-11)  const store = config.store as InMemoryStore;
[](#%5F%5Fcodelineno-9-12)  if (!store) {
[](#%5F%5Fcodelineno-9-13)    throw new Error("No store provided to tool.");
[](#%5F%5Fcodelineno-9-14)  }
[](#%5F%5Fcodelineno-9-15)  await store.put(
[](#%5F%5Fcodelineno-9-16)    ["user_123", "memories"],
[](#%5F%5Fcodelineno-9-17)    uuidv4(), // give each memory its own unique ID
[](#%5F%5Fcodelineno-9-18)    { text: content }
[](#%5F%5Fcodelineno-9-19)  );
[](#%5F%5Fcodelineno-9-20)  return "Stored memory.";
[](#%5F%5Fcodelineno-9-21)}, {
[](#%5F%5Fcodelineno-9-22)  name: "upsert_memory",
[](#%5F%5Fcodelineno-9-23)  schema: z.object({
[](#%5F%5Fcodelineno-9-24)    content: z.string().describe("The content of the memory to store."),
[](#%5F%5Fcodelineno-9-25)  }),
[](#%5F%5Fcodelineno-9-26)  description: "Upsert long-term memories.",
[](#%5F%5Fcodelineno-9-27)});
`

In the tool above, we use a UUID as the key so that the memory store can accumulate memories endlessly without worrying about key conflicts. We do this instead of accumulating memories into a single object or array because the memory store indexes items by key. Giving each memory its own key in the store allows each memory to be assigned its own unique embedding vector that can be matched to the search query.

### Simple semantic recall mechanism[¶](#simple-semantic-recall-mechanism "Permanent link")

Now that we have a tool for storing memories, let's create a prompt function that we can use with `createReactAgent` to handle the recall mechanism.

Note that if we weren't using `createReactAgent` here, you could use this same function as the first node in your graph and it would work just as well.

`` [](#%5F%5Fcodelineno-10-1)import { MessagesAnnotation } from "@langchain/langgraph";
[](#%5F%5Fcodelineno-10-2)
[](#%5F%5Fcodelineno-10-3)const addMemories = async (
[](#%5F%5Fcodelineno-10-4)  state: typeof MessagesAnnotation.State,
[](#%5F%5Fcodelineno-10-5)  config: LangGraphRunnableConfig
[](#%5F%5Fcodelineno-10-6)) => {
[](#%5F%5Fcodelineno-10-7)  const store = config.store as InMemoryStore;
[](#%5F%5Fcodelineno-10-8)
[](#%5F%5Fcodelineno-10-9)  if (!store) {
[](#%5F%5Fcodelineno-10-10)    throw new Error("No store provided to state modifier.");
[](#%5F%5Fcodelineno-10-11)  }
[](#%5F%5Fcodelineno-10-12)
[](#%5F%5Fcodelineno-10-13)  // Search based on user's last message
[](#%5F%5Fcodelineno-10-14)  const items = await store.search(
[](#%5F%5Fcodelineno-10-15)    ["user_123", "memories"], 
[](#%5F%5Fcodelineno-10-16)    { 
[](#%5F%5Fcodelineno-10-17)      // Assume it's not a complex message
[](#%5F%5Fcodelineno-10-18)      query: state.messages[state.messages.length - 1].content as string,
[](#%5F%5Fcodelineno-10-19)      limit: 4 
[](#%5F%5Fcodelineno-10-20)    }
[](#%5F%5Fcodelineno-10-21)  );
[](#%5F%5Fcodelineno-10-22)
[](#%5F%5Fcodelineno-10-23)
[](#%5F%5Fcodelineno-10-24)  const memories = items.length 
[](#%5F%5Fcodelineno-10-25)    ? `## Memories of user\n${
[](#%5F%5Fcodelineno-10-26)      items.map(item => `${item.value.text} (similarity: ${item.score})`).join("\n")
[](#%5F%5Fcodelineno-10-27)    }`
[](#%5F%5Fcodelineno-10-28)    : "";
[](#%5F%5Fcodelineno-10-29)
[](#%5F%5Fcodelineno-10-30)  // Add retrieved memories to system message
[](#%5F%5Fcodelineno-10-31)  return [
[](#%5F%5Fcodelineno-10-32)    { role: "system", content: `You are a helpful assistant.\n${memories}` },
[](#%5F%5Fcodelineno-10-33)    ...state.messages
[](#%5F%5Fcodelineno-10-34)  ];
[](#%5F%5Fcodelineno-10-35)};
 ``

### Putting it all together[¶](#putting-it-all-together "Permanent link")

Finally, let's put it all together into an agent, using `createReactAgent`. Notice that we're not adding a checkpointer here. The examples below will not be reusing message history. All details not contained in the input messages will be coming from the recall mechanism defined above.

`[](#%5F%5Fcodelineno-11-1)import { ChatOpenAI } from "@langchain/openai";
[](#%5F%5Fcodelineno-11-2)import { createReactAgent } from "@langchain/langgraph/prebuilt";
[](#%5F%5Fcodelineno-11-3)
[](#%5F%5Fcodelineno-11-4)const agent = createReactAgent({
[](#%5F%5Fcodelineno-11-5)  llm: new ChatOpenAI({ model: "gpt-4o-mini" }),
[](#%5F%5Fcodelineno-11-6)  tools: [upsertMemoryTool],
[](#%5F%5Fcodelineno-11-7)  prompt: addMemories,
[](#%5F%5Fcodelineno-11-8)  store: store
[](#%5F%5Fcodelineno-11-9)});
`

### Using our sample agent[¶](#using-our-sample-agent "Permanent link")

Now that we've got everything put together, let's test it out!

First, let's define a helper function that we can use to print messages in the conversation.

`` [](#%5F%5Fcodelineno-12-1)import {
[](#%5F%5Fcodelineno-12-2)  BaseMessage,
[](#%5F%5Fcodelineno-12-3)  isSystemMessage,
[](#%5F%5Fcodelineno-12-4)  isAIMessage,
[](#%5F%5Fcodelineno-12-5)  isHumanMessage,
[](#%5F%5Fcodelineno-12-6)  isToolMessage,
[](#%5F%5Fcodelineno-12-7)  AIMessage,
[](#%5F%5Fcodelineno-12-8)  HumanMessage,
[](#%5F%5Fcodelineno-12-9)  ToolMessage,
[](#%5F%5Fcodelineno-12-10)  SystemMessage,
[](#%5F%5Fcodelineno-12-11)} from "@langchain/core/messages";
[](#%5F%5Fcodelineno-12-12)
[](#%5F%5Fcodelineno-12-13)function printMessages(messages: BaseMessage[]) {
[](#%5F%5Fcodelineno-12-14)  for (const message of messages) {
[](#%5F%5Fcodelineno-12-15)    if (isSystemMessage(message)) {
[](#%5F%5Fcodelineno-12-16)      const systemMessage = message as SystemMessage;
[](#%5F%5Fcodelineno-12-17)      console.log(`System: ${systemMessage.content}`);
[](#%5F%5Fcodelineno-12-18)    } else if (isHumanMessage(message)) {
[](#%5F%5Fcodelineno-12-19)      const humanMessage = message as HumanMessage;
[](#%5F%5Fcodelineno-12-20)      console.log(`User: ${humanMessage.content}`);
[](#%5F%5Fcodelineno-12-21)    } else if (isAIMessage(message)) {
[](#%5F%5Fcodelineno-12-22)      const aiMessage = message as AIMessage;
[](#%5F%5Fcodelineno-12-23)      if (aiMessage.content) {
[](#%5F%5Fcodelineno-12-24)        console.log(`Assistant: ${aiMessage.content}`);
[](#%5F%5Fcodelineno-12-25)      }
[](#%5F%5Fcodelineno-12-26)      if (aiMessage.tool_calls) {
[](#%5F%5Fcodelineno-12-27)        for (const toolCall of aiMessage.tool_calls) {
[](#%5F%5Fcodelineno-12-28)          console.log(`\t${toolCall.name}(${JSON.stringify(toolCall.args)})`);
[](#%5F%5Fcodelineno-12-29)        }
[](#%5F%5Fcodelineno-12-30)      }
[](#%5F%5Fcodelineno-12-31)    } else if (isToolMessage(message)) {
[](#%5F%5Fcodelineno-12-32)      const toolMessage = message as ToolMessage;
[](#%5F%5Fcodelineno-12-33)      console.log(
[](#%5F%5Fcodelineno-12-34)        `\t\t${toolMessage.name} -> ${JSON.stringify(toolMessage.content)}`
[](#%5F%5Fcodelineno-12-35)      );
[](#%5F%5Fcodelineno-12-36)    }
[](#%5F%5Fcodelineno-12-37)  }
[](#%5F%5Fcodelineno-12-38)}
 ``

Now if we run the agent and print the message, we can see that the agent remembers the food preferences that we added to the store at the very beginning of this demo!

`[](#%5F%5Fcodelineno-13-1)let result = await agent.invoke({
[](#%5F%5Fcodelineno-13-2)  messages: [
[](#%5F%5Fcodelineno-13-3)    {
[](#%5F%5Fcodelineno-13-4)      role: "user",
[](#%5F%5Fcodelineno-13-5)      content: "I'm hungry. What should I eat?",
[](#%5F%5Fcodelineno-13-6)    },
[](#%5F%5Fcodelineno-13-7)  ],
[](#%5F%5Fcodelineno-13-8)});
[](#%5F%5Fcodelineno-13-9)
[](#%5F%5Fcodelineno-13-10)printMessages(result.messages);
`

`[](#%5F%5Fcodelineno-14-1)User: I'm hungry. What should I eat?
[](#%5F%5Fcodelineno-14-2)Assistant: Since you prefer Italian food and love pizza, how about ordering a pizza? You could choose a classic Margherita or customize it with your favorite toppings, making sure to keep it non-spicy. Enjoy your meal!
`

#### Storing new memories[¶](#storing-new-memories "Permanent link")

Now that we know that the recall mechanism works, let's see if we can get our example agent to store a new memory:

`[](#%5F%5Fcodelineno-15-1)result = await agent.invoke({
[](#%5F%5Fcodelineno-15-2)  messages: [
[](#%5F%5Fcodelineno-15-3)    {
[](#%5F%5Fcodelineno-15-4)      role: "user",
[](#%5F%5Fcodelineno-15-5)      content: "Please remember that every Thursday is trash day.",
[](#%5F%5Fcodelineno-15-6)    },
[](#%5F%5Fcodelineno-15-7)  ],
[](#%5F%5Fcodelineno-15-8)});
[](#%5F%5Fcodelineno-15-9)
[](#%5F%5Fcodelineno-15-10)printMessages(result.messages);
`

`[](#%5F%5Fcodelineno-16-1)User: Please remember that every Thursday is trash day.
[](#%5F%5Fcodelineno-16-2)    upsert_memory({"content":"Every Thursday is trash day."})
[](#%5F%5Fcodelineno-16-3)        upsert_memory -> "Stored memory."
[](#%5F%5Fcodelineno-16-4)Assistant: I've remembered that every Thursday is trash day!
`

And now that it has stored it, let's see if it remembers. 

Remember - there's no checkpointer here. Every time we invoke the agent it's an entirely new conversation.

`[](#%5F%5Fcodelineno-17-1)result = await agent.invoke({
[](#%5F%5Fcodelineno-17-2)  messages: [
[](#%5F%5Fcodelineno-17-3)    {
[](#%5F%5Fcodelineno-17-4)      role: "user",
[](#%5F%5Fcodelineno-17-5)      content: "When am I supposed to take out the garbage?",
[](#%5F%5Fcodelineno-17-6)    },
[](#%5F%5Fcodelineno-17-7)  ],
[](#%5F%5Fcodelineno-17-8)});
[](#%5F%5Fcodelineno-17-9)
[](#%5F%5Fcodelineno-17-10)printMessages(result.messages);
`

`[](#%5F%5Fcodelineno-18-1)User: When am I supposed to take out the garbage?
[](#%5F%5Fcodelineno-18-2)Assistant: You take out the garbage every Thursday, as it's trash day for you.
`

## Advanced Usage[¶](#advanced-usage "Permanent link")

The example above is quite simple, but hopefully it helps you to imagine how you might interweave storage and recall mechanisms into your agents. In the sections below we touch on a few more topics that might help you as you get into more advanced use cases.

### Multi-vector indexing[¶](#multi-vector-indexing "Permanent link")

You can store and search different aspects of memories separately to improve recall or to omit certain fields from the semantic indexing process.

`` [](#%5F%5Fcodelineno-19-1)import { InMemoryStore } from "@langchain/langgraph";
[](#%5F%5Fcodelineno-19-2)
[](#%5F%5Fcodelineno-19-3)// Configure store to embed both memory content and emotional context
[](#%5F%5Fcodelineno-19-4)const multiVectorStore = new InMemoryStore({
[](#%5F%5Fcodelineno-19-5)  index: {
[](#%5F%5Fcodelineno-19-6)    embeddings: embeddings,
[](#%5F%5Fcodelineno-19-7)    dims: 1536,
[](#%5F%5Fcodelineno-19-8)    fields: ["memory", "emotional_context"],
[](#%5F%5Fcodelineno-19-9)  },
[](#%5F%5Fcodelineno-19-10)});
[](#%5F%5Fcodelineno-19-11)
[](#%5F%5Fcodelineno-19-12)// Store memories with different content/emotion pairs
[](#%5F%5Fcodelineno-19-13)await multiVectorStore.put(["user_123", "memories"], "mem1", {
[](#%5F%5Fcodelineno-19-14)  memory: "Had pizza with friends at Mario's",
[](#%5F%5Fcodelineno-19-15)  emotional_context: "felt happy and connected",
[](#%5F%5Fcodelineno-19-16)  this_isnt_indexed: "I prefer ravioli though",
[](#%5F%5Fcodelineno-19-17)});
[](#%5F%5Fcodelineno-19-18)await multiVectorStore.put(["user_123", "memories"], "mem2", {
[](#%5F%5Fcodelineno-19-19)  memory: "Ate alone at home",
[](#%5F%5Fcodelineno-19-20)  emotional_context: "felt a bit lonely",
[](#%5F%5Fcodelineno-19-21)  this_isnt_indexed: "I like pie",
[](#%5F%5Fcodelineno-19-22)});
[](#%5F%5Fcodelineno-19-23)
[](#%5F%5Fcodelineno-19-24)// Search focusing on emotional state - matches mem2
[](#%5F%5Fcodelineno-19-25)const results = await multiVectorStore.search(["user_123", "memories"], {
[](#%5F%5Fcodelineno-19-26)  query: "times they felt isolated",
[](#%5F%5Fcodelineno-19-27)  limit: 1,
[](#%5F%5Fcodelineno-19-28)});
[](#%5F%5Fcodelineno-19-29)
[](#%5F%5Fcodelineno-19-30)console.log("Expect mem 2");
[](#%5F%5Fcodelineno-19-31)
[](#%5F%5Fcodelineno-19-32)for (const r of results) {
[](#%5F%5Fcodelineno-19-33)  console.log(`Item: ${r.key}; Score(${r.score})`);
[](#%5F%5Fcodelineno-19-34)  console.log(`Memory: ${r.value.memory}`);
[](#%5F%5Fcodelineno-19-35)  console.log(`Emotion: ${r.value.emotional_context}`);
[](#%5F%5Fcodelineno-19-36)}
 ``

`[](#%5F%5Fcodelineno-20-1)Expect mem 2
[](#%5F%5Fcodelineno-20-2)Item: mem2; Score(0.58961641225287)
[](#%5F%5Fcodelineno-20-3)Memory: Ate alone at home
[](#%5F%5Fcodelineno-20-4)Emotion: felt a bit lonely
`

### Override fields at storage time[¶](#override-fields-at-storage-time "Permanent link")

You can override which fields to embed when storing a specific memory using `put(..., { index: [...fields] })`, regardless of the store's default configuration.

`` [](#%5F%5Fcodelineno-21-1)import { InMemoryStore } from "@langchain/langgraph";
[](#%5F%5Fcodelineno-21-2)
[](#%5F%5Fcodelineno-21-3)const overrideStore = new InMemoryStore({
[](#%5F%5Fcodelineno-21-4)  index: {
[](#%5F%5Fcodelineno-21-5)    embeddings: embeddings,
[](#%5F%5Fcodelineno-21-6)    dims: 1536,
[](#%5F%5Fcodelineno-21-7)    // Default to embed memory field
[](#%5F%5Fcodelineno-21-8)    fields: ["memory"],
[](#%5F%5Fcodelineno-21-9)  }
[](#%5F%5Fcodelineno-21-10)});
[](#%5F%5Fcodelineno-21-11)
[](#%5F%5Fcodelineno-21-12)// Store one memory with default indexing
[](#%5F%5Fcodelineno-21-13)await overrideStore.put(["user_123", "memories"], "mem1", {
[](#%5F%5Fcodelineno-21-14)  memory: "I love spicy food",
[](#%5F%5Fcodelineno-21-15)  context: "At a Thai restaurant",
[](#%5F%5Fcodelineno-21-16)});
[](#%5F%5Fcodelineno-21-17)
[](#%5F%5Fcodelineno-21-18)// Store another memory, overriding which fields to embed
[](#%5F%5Fcodelineno-21-19)await overrideStore.put(["user_123", "memories"], "mem2", {
[](#%5F%5Fcodelineno-21-20)  memory: "I love spicy food",
[](#%5F%5Fcodelineno-21-21)  context: "At a Thai restaurant",
[](#%5F%5Fcodelineno-21-22)  // Override: only embed the context
[](#%5F%5Fcodelineno-21-23)  index: ["context"]
[](#%5F%5Fcodelineno-21-24)});
[](#%5F%5Fcodelineno-21-25)
[](#%5F%5Fcodelineno-21-26)// Search about food - matches mem1 (using default field)
[](#%5F%5Fcodelineno-21-27)console.log("Expect mem1");
[](#%5F%5Fcodelineno-21-28)const results2 = await overrideStore.search(["user_123", "memories"], {
[](#%5F%5Fcodelineno-21-29)  query: "what food do they like",
[](#%5F%5Fcodelineno-21-30)  limit: 1,
[](#%5F%5Fcodelineno-21-31)});
[](#%5F%5Fcodelineno-21-32)
[](#%5F%5Fcodelineno-21-33)for (const r of results2) {
[](#%5F%5Fcodelineno-21-34)  console.log(`Item: ${r.key}; Score(${r.score})`);
[](#%5F%5Fcodelineno-21-35)  console.log(`Memory: ${r.value.memory}`);
[](#%5F%5Fcodelineno-21-36)}
[](#%5F%5Fcodelineno-21-37)
[](#%5F%5Fcodelineno-21-38)// Search about restaurant atmosphere - matches mem2 (using overridden field)
[](#%5F%5Fcodelineno-21-39)console.log("Expect mem2");
[](#%5F%5Fcodelineno-21-40)const results3 = await overrideStore.search(["user_123", "memories"], {
[](#%5F%5Fcodelineno-21-41)  query: "restaurant environment",
[](#%5F%5Fcodelineno-21-42)  limit: 1,
[](#%5F%5Fcodelineno-21-43)});
[](#%5F%5Fcodelineno-21-44)
[](#%5F%5Fcodelineno-21-45)for (const r of results3) {
[](#%5F%5Fcodelineno-21-46)  console.log(`Item: ${r.key}; Score(${r.score})`);
[](#%5F%5Fcodelineno-21-47)  console.log(`Memory: ${r.value.memory}`);
[](#%5F%5Fcodelineno-21-48)}
 ``

`[](#%5F%5Fcodelineno-22-1)Expect mem1
[](#%5F%5Fcodelineno-22-2)Item: mem1; Score(0.3375009515587189)
[](#%5F%5Fcodelineno-22-3)Memory: I love spicy food
[](#%5F%5Fcodelineno-22-4)Expect mem2
[](#%5F%5Fcodelineno-22-5)Item: mem2; Score(0.1920732213417712)
[](#%5F%5Fcodelineno-22-6)Memory: I love spicy food
`

 Was this page helpful? 

 Thanks for your feedback!

 Thanks for your feedback! Please help us improve this page by adding to the discussion below.

 Back to top 

[  Previous  How to add summary of the conversation history ](../add-summary-conversation-history/) [  Next  How to add breakpoints ](../breakpoints/) 

 Copyright © 2025 LangChain, Inc | [Consent Preferences](#%5F%5Fconsent) 

 Made with[ Material for MkDocs Insiders](https://squidfunk.github.io/mkdocs-material/) 

[ ](https://langchain-ai.github.io/langgraph/ "langchain-ai.github.io") [ ](https://github.com/langchain-ai/langgraphjs "github.com") [ ](https://twitter.com/LangChainAI "twitter.com") 

#### Cookie consent

We use cookies to recognize your repeated visits and preferences, as well as to measure the effectiveness of our documentation and whether users find what they're searching for. **Clicking "Accept" makes our documentation better. Thank you!** ❤️

* Google Analytics
* GitHub

Accept Reject 