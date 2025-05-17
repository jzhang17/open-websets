[ Skip to content](#how-to-add-summary-of-the-conversation-history) 

**Help us build the JS tools that power AI apps at companies like Replit, Uber, LinkedIn, GitLab, and more. [Join our team!](https://jobs.ashbyhq.com/langchain/05efa205-8560-43fd-bfcc-3f7697561cfb?utm%5Fsource=https%3A%2F%2Flangchain-ai.github.io%2Flanggraphjs%2F&utm%5Fcampaign=langgraphjs%5Fdocs)** 

[ ![logo](../../static/wordmark_dark.svg) ![logo](../../static/wordmark_light.svg) ](../..) 

 How to add summary of the conversation history 

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
                                             * How to add summary of the conversation history [  How to add summary of the conversation history ](./)  
                                              Table of contents  
                                                               * [  Setup ](#setup)  
                                                               * [  Build the chatbot ](#build-the-chatbot)  
                                                               * [  Using the graph ](#using-the-graph)  
                                             * [  How to add semantic search to your agent's memory ](../semantic-search/)  
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
* [  Setup ](#setup)
* [  Build the chatbot ](#build-the-chatbot)
* [  Using the graph ](#using-the-graph)

1. [  LangGraph ](../..)
2. [  Guides ](../)
3. [  How-to Guides ](../)
4. [  LangGraph ](../../how-tos#langgraph)
5. [  Memory ](../../how-tos#memory)

# How to add summary of the conversation history[¶](#how-to-add-summary-of-the-conversation-history "Permanent link")

One of the most common use cases for persistence is to use it to keep track of conversation history. This is great - it makes it easy to continue conversations. As conversations get longer and longer, however, this conversation history can build up and take up more and more of the context window. This can often be undesirable as it leads to more expensive and longer calls to the LLM, and potentially ones that error. One way to work around that is to create a summary of the conversation to date, and use that with the past N messages. This guide will go through an example of how to do that.

This will involve a few steps: - Check if the conversation is too long (can be done by checking number of messages or length of messages) - If yes, the create summary (will need a prompt for this) - Then remove all except the last N messages

A big part of this is deleting old messages. For an in depth guide on how to do that, see [this guide](../delete-messages)

## Setup[¶](#setup "Permanent link")

First, let's set up the packages we're going to want to use

`[](#%5F%5Fcodelineno-0-1)npm install @langchain/langgraph @langchain/anthropic @langchain/core uuid
`

Next, we need to set API keys for Anthropic (the LLM we will use)

`[](#%5F%5Fcodelineno-1-1)process.env.ANTHROPIC_API_KEY = 'YOUR_API_KEY'
`

Optionally, we can set API key for [LangSmith tracing](https://smith.langchain.com/), which will give us best-in-class observability.

`[](#%5F%5Fcodelineno-2-1)process.env.LANGCHAIN_TRACING_V2 = 'true'
[](#%5F%5Fcodelineno-2-2)process.env.LANGCHAIN_API_KEY = 'YOUR_API_KEY'
`

## Build the chatbot[¶](#build-the-chatbot "Permanent link")

Let's now build the chatbot.

`` [](#%5F%5Fcodelineno-3-1)import { ChatAnthropic } from "@langchain/anthropic";
[](#%5F%5Fcodelineno-3-2)import { SystemMessage, HumanMessage, AIMessage, RemoveMessage } from "@langchain/core/messages";
[](#%5F%5Fcodelineno-3-3)import { MemorySaver } from "@langchain/langgraph-checkpoint";
[](#%5F%5Fcodelineno-3-4)import { MessagesAnnotation, StateGraph, START, END, Annotation } from "@langchain/langgraph";
[](#%5F%5Fcodelineno-3-5)import { v4 as uuidv4 } from "uuid";
[](#%5F%5Fcodelineno-3-6)
[](#%5F%5Fcodelineno-3-7)const memory = new MemorySaver();
[](#%5F%5Fcodelineno-3-8)
[](#%5F%5Fcodelineno-3-9)// We will add a `summary` attribute (in addition to `messages` key,
[](#%5F%5Fcodelineno-3-10)// which MessagesAnnotation already has)
[](#%5F%5Fcodelineno-3-11)const GraphAnnotation = Annotation.Root({
[](#%5F%5Fcodelineno-3-12)  ...MessagesAnnotation.spec,
[](#%5F%5Fcodelineno-3-13)  summary: Annotation<string>({
[](#%5F%5Fcodelineno-3-14)    reducer: (_, action) => action,
[](#%5F%5Fcodelineno-3-15)    default: () => "",
[](#%5F%5Fcodelineno-3-16)  })
[](#%5F%5Fcodelineno-3-17)})
[](#%5F%5Fcodelineno-3-18)
[](#%5F%5Fcodelineno-3-19)// We will use this model for both the conversation and the summarization
[](#%5F%5Fcodelineno-3-20)const model = new ChatAnthropic({ model: "claude-3-haiku-20240307" });
[](#%5F%5Fcodelineno-3-21)
[](#%5F%5Fcodelineno-3-22)// Define the logic to call the model
[](#%5F%5Fcodelineno-3-23)async function callModel(state: typeof GraphAnnotation.State): Promise<Partial<typeof GraphAnnotation.State>> {
[](#%5F%5Fcodelineno-3-24)  // If a summary exists, we add this in as a system message
[](#%5F%5Fcodelineno-3-25)  const { summary } = state;
[](#%5F%5Fcodelineno-3-26)  let { messages } = state;
[](#%5F%5Fcodelineno-3-27)  if (summary) {
[](#%5F%5Fcodelineno-3-28)    const systemMessage = new SystemMessage({
[](#%5F%5Fcodelineno-3-29)      id: uuidv4(),
[](#%5F%5Fcodelineno-3-30)      content: `Summary of conversation earlier: ${summary}`
[](#%5F%5Fcodelineno-3-31)    });
[](#%5F%5Fcodelineno-3-32)    messages = [systemMessage, ...messages];
[](#%5F%5Fcodelineno-3-33)  }
[](#%5F%5Fcodelineno-3-34)  const response = await model.invoke(messages);
[](#%5F%5Fcodelineno-3-35)  // We return an object, because this will get added to the existing state
[](#%5F%5Fcodelineno-3-36)  return { messages: [response] };
[](#%5F%5Fcodelineno-3-37)}
[](#%5F%5Fcodelineno-3-38)
[](#%5F%5Fcodelineno-3-39)// We now define the logic for determining whether to end or summarize the conversation
[](#%5F%5Fcodelineno-3-40)function shouldContinue(state: typeof GraphAnnotation.State): "summarize_conversation" | typeof END {
[](#%5F%5Fcodelineno-3-41)  const messages = state.messages;
[](#%5F%5Fcodelineno-3-42)  // If there are more than six messages, then we summarize the conversation
[](#%5F%5Fcodelineno-3-43)  if (messages.length > 6) {
[](#%5F%5Fcodelineno-3-44)    return "summarize_conversation";
[](#%5F%5Fcodelineno-3-45)  }
[](#%5F%5Fcodelineno-3-46)  // Otherwise we can just end
[](#%5F%5Fcodelineno-3-47)  return END;
[](#%5F%5Fcodelineno-3-48)}
[](#%5F%5Fcodelineno-3-49)
[](#%5F%5Fcodelineno-3-50)async function summarizeConversation(state: typeof GraphAnnotation.State): Promise<Partial<typeof GraphAnnotation.State>> {
[](#%5F%5Fcodelineno-3-51)  // First, we summarize the conversation
[](#%5F%5Fcodelineno-3-52)  const { summary, messages } = state;
[](#%5F%5Fcodelineno-3-53)  let summaryMessage: string;
[](#%5F%5Fcodelineno-3-54)  if (summary) {
[](#%5F%5Fcodelineno-3-55)    // If a summary already exists, we use a different system prompt
[](#%5F%5Fcodelineno-3-56)    // to summarize it than if one didn't
[](#%5F%5Fcodelineno-3-57)    summaryMessage = `This is summary of the conversation to date: ${summary}\n\n` +
[](#%5F%5Fcodelineno-3-58)      "Extend the summary by taking into account the new messages above:";
[](#%5F%5Fcodelineno-3-59)  } else {
[](#%5F%5Fcodelineno-3-60)    summaryMessage = "Create a summary of the conversation above:";
[](#%5F%5Fcodelineno-3-61)  }
[](#%5F%5Fcodelineno-3-62)
[](#%5F%5Fcodelineno-3-63)  const allMessages = [...messages, new HumanMessage({
[](#%5F%5Fcodelineno-3-64)    id: uuidv4(),
[](#%5F%5Fcodelineno-3-65)    content: summaryMessage,
[](#%5F%5Fcodelineno-3-66)  })];
[](#%5F%5Fcodelineno-3-67)  const response = await model.invoke(allMessages);
[](#%5F%5Fcodelineno-3-68)  // We now need to delete messages that we no longer want to show up
[](#%5F%5Fcodelineno-3-69)  // I will delete all but the last two messages, but you can change this
[](#%5F%5Fcodelineno-3-70)  const deleteMessages = messages.slice(0, -2).map((m) => new RemoveMessage({ id: m.id }));
[](#%5F%5Fcodelineno-3-71)  if (typeof response.content !== "string") {
[](#%5F%5Fcodelineno-3-72)    throw new Error("Expected a string response from the model");
[](#%5F%5Fcodelineno-3-73)  }
[](#%5F%5Fcodelineno-3-74)  return { summary: response.content, messages: deleteMessages };
[](#%5F%5Fcodelineno-3-75)}
[](#%5F%5Fcodelineno-3-76)
[](#%5F%5Fcodelineno-3-77)// Define a new graph
[](#%5F%5Fcodelineno-3-78)const workflow = new StateGraph(GraphAnnotation)
[](#%5F%5Fcodelineno-3-79)  // Define the conversation node and the summarize node
[](#%5F%5Fcodelineno-3-80)  .addNode("conversation", callModel)
[](#%5F%5Fcodelineno-3-81)  .addNode("summarize_conversation", summarizeConversation)
[](#%5F%5Fcodelineno-3-82)  // Set the entrypoint as conversation
[](#%5F%5Fcodelineno-3-83)  .addEdge(START, "conversation")
[](#%5F%5Fcodelineno-3-84)  // We now add a conditional edge
[](#%5F%5Fcodelineno-3-85)  .addConditionalEdges(
[](#%5F%5Fcodelineno-3-86)    // First, we define the start node. We use `conversation`.
[](#%5F%5Fcodelineno-3-87)    // This means these are the edges taken after the `conversation` node is called.
[](#%5F%5Fcodelineno-3-88)    "conversation",
[](#%5F%5Fcodelineno-3-89)    // Next, we pass in the function that will determine which node is called next.
[](#%5F%5Fcodelineno-3-90)    shouldContinue
[](#%5F%5Fcodelineno-3-91)  )
[](#%5F%5Fcodelineno-3-92)  // We now add a normal edge from `summarize_conversation` to END.
[](#%5F%5Fcodelineno-3-93)  // This means that after `summarize_conversation` is called, we end.
[](#%5F%5Fcodelineno-3-94)  .addEdge("summarize_conversation", END);
[](#%5F%5Fcodelineno-3-95)
[](#%5F%5Fcodelineno-3-96)// Finally, we compile it!
[](#%5F%5Fcodelineno-3-97)const app = workflow.compile({ checkpointer: memory });
 ``

## Using the graph[¶](#using-the-graph "Permanent link")

`` [](#%5F%5Fcodelineno-4-1)const printUpdate = (update: Record<string, any>) => {
[](#%5F%5Fcodelineno-4-2)  Object.keys(update).forEach((key) => {
[](#%5F%5Fcodelineno-4-3)    const value = update[key];
[](#%5F%5Fcodelineno-4-4)
[](#%5F%5Fcodelineno-4-5)    if ("messages" in value && Array.isArray(value.messages)) {
[](#%5F%5Fcodelineno-4-6)      value.messages.forEach((msg) => {
[](#%5F%5Fcodelineno-4-7)        console.log(`\n================================ ${msg._getType()} Message =================================`)
[](#%5F%5Fcodelineno-4-8)        console.log(msg.content);
[](#%5F%5Fcodelineno-4-9)      })
[](#%5F%5Fcodelineno-4-10)    }
[](#%5F%5Fcodelineno-4-11)    if ("summary" in value && value.summary) {
[](#%5F%5Fcodelineno-4-12)      console.log(value.summary);
[](#%5F%5Fcodelineno-4-13)    }
[](#%5F%5Fcodelineno-4-14)  })
[](#%5F%5Fcodelineno-4-15)}
 ``

`[](#%5F%5Fcodelineno-5-1)import { HumanMessage } from "@langchain/core/messages";
[](#%5F%5Fcodelineno-5-2)
[](#%5F%5Fcodelineno-5-3)const config = { configurable: { thread_id: "4" }, streamMode: "updates" as const }
[](#%5F%5Fcodelineno-5-4)
[](#%5F%5Fcodelineno-5-5)const inputMessage = new HumanMessage("hi! I'm bob")
[](#%5F%5Fcodelineno-5-6)console.log(inputMessage.content)
[](#%5F%5Fcodelineno-5-7)for await (const event of await app.stream({ messages: [inputMessage] }, config)) {
[](#%5F%5Fcodelineno-5-8)  printUpdate(event)
[](#%5F%5Fcodelineno-5-9)}
[](#%5F%5Fcodelineno-5-10)
[](#%5F%5Fcodelineno-5-11)const inputMessage2 = new HumanMessage("What did I sat my name was?")
[](#%5F%5Fcodelineno-5-12)console.log(inputMessage2.content)
[](#%5F%5Fcodelineno-5-13)for await (const event of await app.stream({ messages: [inputMessage2] }, config)) {
[](#%5F%5Fcodelineno-5-14)  printUpdate(event)
[](#%5F%5Fcodelineno-5-15)}
[](#%5F%5Fcodelineno-5-16)
[](#%5F%5Fcodelineno-5-17)const inputMessage3 = new HumanMessage("i like the celtics!")
[](#%5F%5Fcodelineno-5-18)console.log(inputMessage3.content)
[](#%5F%5Fcodelineno-5-19)for await (const event of await app.stream({ messages: [inputMessage3] }, config)) {
[](#%5F%5Fcodelineno-5-20)  printUpdate(event)
[](#%5F%5Fcodelineno-5-21)}
`

`[](#%5F%5Fcodelineno-6-1)hi! I'm bob
[](#%5F%5Fcodelineno-6-2)
[](#%5F%5Fcodelineno-6-3)================================ ai Message =================================
[](#%5F%5Fcodelineno-6-4)Okay, got it. Hello Bob, it's nice to chat with you again. I recognize that you've repeatedly stated your name is Bob throughout our conversation. Please let me know if there is anything I can assist you with.
[](#%5F%5Fcodelineno-6-5)
[](#%5F%5Fcodelineno-6-6)================================ remove Message =================================
[](#%5F%5Fcodelineno-6-7)
[](#%5F%5Fcodelineno-6-8)
[](#%5F%5Fcodelineno-6-9)================================ remove Message =================================
[](#%5F%5Fcodelineno-6-10)
[](#%5F%5Fcodelineno-6-11)
[](#%5F%5Fcodelineno-6-12)================================ remove Message =================================
[](#%5F%5Fcodelineno-6-13)
[](#%5F%5Fcodelineno-6-14)
[](#%5F%5Fcodelineno-6-15)================================ ai Message =================================
[](#%5F%5Fcodelineno-6-16)In our conversation, you have stated multiple times that your name is Bob. For example, you said "I'm Bob", "hi! I'm bob", and similar variations where you clearly identified yourself as Bob.
[](#%5F%5Fcodelineno-6-17)i like the celtics!
[](#%5F%5Fcodelineno-6-18)
[](#%5F%5Fcodelineno-6-19)================================ ai Message =================================
[](#%5F%5Fcodelineno-6-20)Ah I see, you mentioned earlier that you like the Boston Celtics basketball team. That's great, the Celtics have a long and storied history in the NBA. As one of the league's original franchises, they've won a record 17 NBA championships over the years, the most of any team. Some of their most iconic players have included Bill Russell, Larry Bird, and Kevin McHale. The Celtics are known for their passionate fan base and intense rivalries with teams like the Los Angeles Lakers. It's always exciting to follow such a successful and historic franchise. I'm glad to hear you're a fan of the Celtics!
`

We can see that so far no summarization has happened - this is because there are only six messages in the list. 

`[](#%5F%5Fcodelineno-7-1)const values = (await app.getState(config)).values
[](#%5F%5Fcodelineno-7-2)console.log(values)
`

`` [](#%5F%5Fcodelineno-8-1){
[](#%5F%5Fcodelineno-8-2)  messages: [
[](#%5F%5Fcodelineno-8-3)    HumanMessage {
[](#%5F%5Fcodelineno-8-4)      "content": "hi! I'm bob",
[](#%5F%5Fcodelineno-8-5)      "additional_kwargs": {},
[](#%5F%5Fcodelineno-8-6)      "response_metadata": {}
[](#%5F%5Fcodelineno-8-7)    },
[](#%5F%5Fcodelineno-8-8)    AIMessage {
[](#%5F%5Fcodelineno-8-9)      "id": "msg_01G6WKqKHK8W371793Hm6eNM",
[](#%5F%5Fcodelineno-8-10)      "content": "Okay, got it. Hello Bob, it's nice to chat with you again. I recognize that you've repeatedly stated your name is Bob throughout our conversation. Please let me know if there is anything I can assist you with.",
[](#%5F%5Fcodelineno-8-11)      "additional_kwargs": {
[](#%5F%5Fcodelineno-8-12)        "id": "msg_01G6WKqKHK8W371793Hm6eNM",
[](#%5F%5Fcodelineno-8-13)        "type": "message",
[](#%5F%5Fcodelineno-8-14)        "role": "assistant",
[](#%5F%5Fcodelineno-8-15)        "model": "claude-3-haiku-20240307",
[](#%5F%5Fcodelineno-8-16)        "stop_reason": "end_turn",
[](#%5F%5Fcodelineno-8-17)        "stop_sequence": null,
[](#%5F%5Fcodelineno-8-18)        "usage": {
[](#%5F%5Fcodelineno-8-19)          "input_tokens": 579,
[](#%5F%5Fcodelineno-8-20)          "output_tokens": 50
[](#%5F%5Fcodelineno-8-21)        }
[](#%5F%5Fcodelineno-8-22)      },
[](#%5F%5Fcodelineno-8-23)      "response_metadata": {
[](#%5F%5Fcodelineno-8-24)        "id": "msg_01G6WKqKHK8W371793Hm6eNM",
[](#%5F%5Fcodelineno-8-25)        "model": "claude-3-haiku-20240307",
[](#%5F%5Fcodelineno-8-26)        "stop_reason": "end_turn",
[](#%5F%5Fcodelineno-8-27)        "stop_sequence": null,
[](#%5F%5Fcodelineno-8-28)        "usage": {
[](#%5F%5Fcodelineno-8-29)          "input_tokens": 579,
[](#%5F%5Fcodelineno-8-30)          "output_tokens": 50
[](#%5F%5Fcodelineno-8-31)        },
[](#%5F%5Fcodelineno-8-32)        "type": "message",
[](#%5F%5Fcodelineno-8-33)        "role": "assistant"
[](#%5F%5Fcodelineno-8-34)      },
[](#%5F%5Fcodelineno-8-35)      "tool_calls": [],
[](#%5F%5Fcodelineno-8-36)      "invalid_tool_calls": []
[](#%5F%5Fcodelineno-8-37)    },
[](#%5F%5Fcodelineno-8-38)    HumanMessage {
[](#%5F%5Fcodelineno-8-39)      "content": "What did I sat my name was?",
[](#%5F%5Fcodelineno-8-40)      "additional_kwargs": {},
[](#%5F%5Fcodelineno-8-41)      "response_metadata": {}
[](#%5F%5Fcodelineno-8-42)    },
[](#%5F%5Fcodelineno-8-43)    AIMessage {
[](#%5F%5Fcodelineno-8-44)      "id": "msg_0118BAsHL4Ew8N2926aYQaot",
[](#%5F%5Fcodelineno-8-45)      "content": "In our conversation, you have stated multiple times that your name is Bob. For example, you said \"I'm Bob\", \"hi! I'm bob\", and similar variations where you clearly identified yourself as Bob.",
[](#%5F%5Fcodelineno-8-46)      "additional_kwargs": {
[](#%5F%5Fcodelineno-8-47)        "id": "msg_0118BAsHL4Ew8N2926aYQaot",
[](#%5F%5Fcodelineno-8-48)        "type": "message",
[](#%5F%5Fcodelineno-8-49)        "role": "assistant",
[](#%5F%5Fcodelineno-8-50)        "model": "claude-3-haiku-20240307",
[](#%5F%5Fcodelineno-8-51)        "stop_reason": "end_turn",
[](#%5F%5Fcodelineno-8-52)        "stop_sequence": null,
[](#%5F%5Fcodelineno-8-53)        "usage": {
[](#%5F%5Fcodelineno-8-54)          "input_tokens": 310,
[](#%5F%5Fcodelineno-8-55)          "output_tokens": 46
[](#%5F%5Fcodelineno-8-56)        }
[](#%5F%5Fcodelineno-8-57)      },
[](#%5F%5Fcodelineno-8-58)      "response_metadata": {
[](#%5F%5Fcodelineno-8-59)        "id": "msg_0118BAsHL4Ew8N2926aYQaot",
[](#%5F%5Fcodelineno-8-60)        "model": "claude-3-haiku-20240307",
[](#%5F%5Fcodelineno-8-61)        "stop_reason": "end_turn",
[](#%5F%5Fcodelineno-8-62)        "stop_sequence": null,
[](#%5F%5Fcodelineno-8-63)        "usage": {
[](#%5F%5Fcodelineno-8-64)          "input_tokens": 310,
[](#%5F%5Fcodelineno-8-65)          "output_tokens": 46
[](#%5F%5Fcodelineno-8-66)        },
[](#%5F%5Fcodelineno-8-67)        "type": "message",
[](#%5F%5Fcodelineno-8-68)        "role": "assistant"
[](#%5F%5Fcodelineno-8-69)      },
[](#%5F%5Fcodelineno-8-70)      "tool_calls": [],
[](#%5F%5Fcodelineno-8-71)      "invalid_tool_calls": []
[](#%5F%5Fcodelineno-8-72)    },
[](#%5F%5Fcodelineno-8-73)    HumanMessage {
[](#%5F%5Fcodelineno-8-74)      "content": "i like the celtics!",
[](#%5F%5Fcodelineno-8-75)      "additional_kwargs": {},
[](#%5F%5Fcodelineno-8-76)      "response_metadata": {}
[](#%5F%5Fcodelineno-8-77)    },
[](#%5F%5Fcodelineno-8-78)    AIMessage {
[](#%5F%5Fcodelineno-8-79)      "id": "msg_01RVrMuSvr17kZdepJZb7rZM",
[](#%5F%5Fcodelineno-8-80)      "content": "Ah I see, you mentioned earlier that you like the Boston Celtics basketball team. That's great, the Celtics have a long and storied history in the NBA. As one of the league's original franchises, they've won a record 17 NBA championships over the years, the most of any team. Some of their most iconic players have included Bill Russell, Larry Bird, and Kevin McHale. The Celtics are known for their passionate fan base and intense rivalries with teams like the Los Angeles Lakers. It's always exciting to follow such a successful and historic franchise. I'm glad to hear you're a fan of the Celtics!",
[](#%5F%5Fcodelineno-8-81)      "additional_kwargs": {
[](#%5F%5Fcodelineno-8-82)        "id": "msg_01RVrMuSvr17kZdepJZb7rZM",
[](#%5F%5Fcodelineno-8-83)        "type": "message",
[](#%5F%5Fcodelineno-8-84)        "role": "assistant",
[](#%5F%5Fcodelineno-8-85)        "model": "claude-3-haiku-20240307",
[](#%5F%5Fcodelineno-8-86)        "stop_reason": "end_turn",
[](#%5F%5Fcodelineno-8-87)        "stop_sequence": null,
[](#%5F%5Fcodelineno-8-88)        "usage": {
[](#%5F%5Fcodelineno-8-89)          "input_tokens": 365,
[](#%5F%5Fcodelineno-8-90)          "output_tokens": 141
[](#%5F%5Fcodelineno-8-91)        }
[](#%5F%5Fcodelineno-8-92)      },
[](#%5F%5Fcodelineno-8-93)      "response_metadata": {
[](#%5F%5Fcodelineno-8-94)        "id": "msg_01RVrMuSvr17kZdepJZb7rZM",
[](#%5F%5Fcodelineno-8-95)        "model": "claude-3-haiku-20240307",
[](#%5F%5Fcodelineno-8-96)        "stop_reason": "end_turn",
[](#%5F%5Fcodelineno-8-97)        "stop_sequence": null,
[](#%5F%5Fcodelineno-8-98)        "usage": {
[](#%5F%5Fcodelineno-8-99)          "input_tokens": 365,
[](#%5F%5Fcodelineno-8-100)          "output_tokens": 141
[](#%5F%5Fcodelineno-8-101)        },
[](#%5F%5Fcodelineno-8-102)        "type": "message",
[](#%5F%5Fcodelineno-8-103)        "role": "assistant"
[](#%5F%5Fcodelineno-8-104)      },
[](#%5F%5Fcodelineno-8-105)      "tool_calls": [],
[](#%5F%5Fcodelineno-8-106)      "invalid_tool_calls": []
[](#%5F%5Fcodelineno-8-107)    }
[](#%5F%5Fcodelineno-8-108)  ],
[](#%5F%5Fcodelineno-8-109)  summary: 'Got it, let me extend the summary further:\n' +
[](#%5F%5Fcodelineno-8-110)    '\n' +
[](#%5F%5Fcodelineno-8-111)    `The conversation began with you introducing yourself as Bob, which I acknowledged and said I was happy to chat with you again. You then repeated "I'm Bob", and I confirmed I recognized your name.\n` +
[](#%5F%5Fcodelineno-8-112)    '\n' +
[](#%5F%5Fcodelineno-8-113)    "You next stated that you like the Boston Celtics basketball team, which prompted me to provide some background information about the team's history and success. \n" +
[](#%5F%5Fcodelineno-8-114)    '\n' +
[](#%5F%5Fcodelineno-8-115)    'You then summarized the conversation up to that point, which I expanded upon in detail, recapping the key points of our exchange so far.\n' +
[](#%5F%5Fcodelineno-8-116)    '\n' +
[](#%5F%5Fcodelineno-8-117)    `In the most recent messages, you greeted me again by saying "hi! I'm bob", which I recognized as you reiterating your name, consistent with how you had introduced yourself earlier.\n` +
[](#%5F%5Fcodelineno-8-118)    '\n' +
[](#%5F%5Fcodelineno-8-119)    `Now, in the latest message, you have simply stated "hi! I'm bob" once more. I continue to understand your name is Bob based on you stating that multiple times throughout our conversation.\n` +
[](#%5F%5Fcodelineno-8-120)    '\n' +
[](#%5F%5Fcodelineno-8-121)    "Please let me know if I'm still missing anything or if you have any other points you'd like me to add to the summary. I'm happy to keep building on it."
[](#%5F%5Fcodelineno-8-122)}
 ``

Now let's send another message in 

`[](#%5F%5Fcodelineno-9-1)const inputMessage4 = new HumanMessage("i like how much they win")
[](#%5F%5Fcodelineno-9-2)console.log(inputMessage4.content)
[](#%5F%5Fcodelineno-9-3)for await (const event of await app.stream({ messages: [inputMessage4] }, config)) {
[](#%5F%5Fcodelineno-9-4)  printUpdate(event)
[](#%5F%5Fcodelineno-9-5)}
`

`[](#%5F%5Fcodelineno-10-1)i like how much they win
[](#%5F%5Fcodelineno-10-2)
[](#%5F%5Fcodelineno-10-3)================================ ai Message =================================
[](#%5F%5Fcodelineno-10-4)I agree, the Celtics' impressive track record of wins and championships is a big part of what makes them such an iconic and beloved team. Their sustained success over decades is really remarkable. 
[](#%5F%5Fcodelineno-10-5)
[](#%5F%5Fcodelineno-10-6)Some key reasons why the Celtics have been so dominant:
[](#%5F%5Fcodelineno-10-7)
[](#%5F%5Fcodelineno-10-8)- Great coaching - They've had legendary coaches like Red Auerbach, Doc Rivers, and Brad Stevens who have led the team to titles.
[](#%5F%5Fcodelineno-10-9)
[](#%5F%5Fcodelineno-10-10)- Hall of Fame players - Superstars like Bill Russell, Larry Bird, Kevin Garnett, and Paul Pierce have powered the Celtics' championship runs.
[](#%5F%5Fcodelineno-10-11)
[](#%5F%5Fcodelineno-10-12)- Winning culture - The Celtics have built a winning mentality and tradition of excellence that gets passed down to each new generation of players.
[](#%5F%5Fcodelineno-10-13)
[](#%5F%5Fcodelineno-10-14)- Loyal fanbase - The passionate Celtics fans pack the stands and provide a strong home court advantage.
[](#%5F%5Fcodelineno-10-15)
[](#%5F%5Fcodelineno-10-16)The combination of top-tier talent, smart management, and devoted supporters has allowed the Celtics to reign as one of the NBA's premier franchises for generations. Their ability to consistently win at the highest level is truly impressive. I can understand why you as a fan really appreciate and enjoy that aspect of the team.
[](#%5F%5Fcodelineno-10-17)
[](#%5F%5Fcodelineno-10-18)================================ remove Message =================================
[](#%5F%5Fcodelineno-10-19)
[](#%5F%5Fcodelineno-10-20)
[](#%5F%5Fcodelineno-10-21)================================ remove Message =================================
[](#%5F%5Fcodelineno-10-22)
[](#%5F%5Fcodelineno-10-23)
[](#%5F%5Fcodelineno-10-24)================================ remove Message =================================
[](#%5F%5Fcodelineno-10-25)
[](#%5F%5Fcodelineno-10-26)
[](#%5F%5Fcodelineno-10-27)================================ remove Message =================================
[](#%5F%5Fcodelineno-10-28)
[](#%5F%5Fcodelineno-10-29)
[](#%5F%5Fcodelineno-10-30)================================ remove Message =================================
[](#%5F%5Fcodelineno-10-31)
[](#%5F%5Fcodelineno-10-32)
[](#%5F%5Fcodelineno-10-33)================================ remove Message =================================
[](#%5F%5Fcodelineno-10-34)
[](#%5F%5Fcodelineno-10-35)Okay, let me extend the summary further based on the latest messages:
[](#%5F%5Fcodelineno-10-36)
[](#%5F%5Fcodelineno-10-37)The conversation began with you introducing yourself as Bob, which I acknowledged. You then repeated "I'm Bob" a few times, and I confirmed I recognized your name.
[](#%5F%5Fcodelineno-10-38)
[](#%5F%5Fcodelineno-10-39)You then expressed that you like the Boston Celtics basketball team, which led me to provide some background information about the team's history and success. You agreed that you appreciate how much the Celtics win.
[](#%5F%5Fcodelineno-10-40)
[](#%5F%5Fcodelineno-10-41)In the most recent messages, you greeted me again by saying "hi! I'm bob", reiterating your name just as you had done earlier. I reiterated that I understand your name is Bob based on you stating that multiple times throughout our conversation.
[](#%5F%5Fcodelineno-10-42)
[](#%5F%5Fcodelineno-10-43)In your latest message, you simply stated "hi! I'm bob" once more, further confirming your name. I have continued to demonstrate that I understand your name is Bob, as you have consistently identified yourself as such.
[](#%5F%5Fcodelineno-10-44)
[](#%5F%5Fcodelineno-10-45)Please let me know if I'm still missing anything or if you have any other points you'd like me to add to this extended summary of our discussion so far. I'm happy to keep building on it.
`

If we check the state now, we can see that we have a summary of the conversation, as well as the last two messages 

`[](#%5F%5Fcodelineno-11-1)const values2 = (await app.getState(config)).values
[](#%5F%5Fcodelineno-11-2)console.log(values2)
`

`` [](#%5F%5Fcodelineno-12-1){
[](#%5F%5Fcodelineno-12-2)  messages: [
[](#%5F%5Fcodelineno-12-3)    HumanMessage {
[](#%5F%5Fcodelineno-12-4)      "content": "i like how much they win",
[](#%5F%5Fcodelineno-12-5)      "additional_kwargs": {},
[](#%5F%5Fcodelineno-12-6)      "response_metadata": {}
[](#%5F%5Fcodelineno-12-7)    },
[](#%5F%5Fcodelineno-12-8)    AIMessage {
[](#%5F%5Fcodelineno-12-9)      "id": "msg_01W8C1nXeydqM3E31uCCeJXt",
[](#%5F%5Fcodelineno-12-10)      "content": "I agree, the Celtics' impressive track record of wins and championships is a big part of what makes them such an iconic and beloved team. Their sustained success over decades is really remarkable. \n\nSome key reasons why the Celtics have been so dominant:\n\n- Great coaching - They've had legendary coaches like Red Auerbach, Doc Rivers, and Brad Stevens who have led the team to titles.\n\n- Hall of Fame players - Superstars like Bill Russell, Larry Bird, Kevin Garnett, and Paul Pierce have powered the Celtics' championship runs.\n\n- Winning culture - The Celtics have built a winning mentality and tradition of excellence that gets passed down to each new generation of players.\n\n- Loyal fanbase - The passionate Celtics fans pack the stands and provide a strong home court advantage.\n\nThe combination of top-tier talent, smart management, and devoted supporters has allowed the Celtics to reign as one of the NBA's premier franchises for generations. Their ability to consistently win at the highest level is truly impressive. I can understand why you as a fan really appreciate and enjoy that aspect of the team.",
[](#%5F%5Fcodelineno-12-11)      "additional_kwargs": {
[](#%5F%5Fcodelineno-12-12)        "id": "msg_01W8C1nXeydqM3E31uCCeJXt",
[](#%5F%5Fcodelineno-12-13)        "type": "message",
[](#%5F%5Fcodelineno-12-14)        "role": "assistant",
[](#%5F%5Fcodelineno-12-15)        "model": "claude-3-haiku-20240307",
[](#%5F%5Fcodelineno-12-16)        "stop_reason": "end_turn",
[](#%5F%5Fcodelineno-12-17)        "stop_sequence": null,
[](#%5F%5Fcodelineno-12-18)        "usage": {
[](#%5F%5Fcodelineno-12-19)          "input_tokens": 516,
[](#%5F%5Fcodelineno-12-20)          "output_tokens": 244
[](#%5F%5Fcodelineno-12-21)        }
[](#%5F%5Fcodelineno-12-22)      },
[](#%5F%5Fcodelineno-12-23)      "response_metadata": {
[](#%5F%5Fcodelineno-12-24)        "id": "msg_01W8C1nXeydqM3E31uCCeJXt",
[](#%5F%5Fcodelineno-12-25)        "model": "claude-3-haiku-20240307",
[](#%5F%5Fcodelineno-12-26)        "stop_reason": "end_turn",
[](#%5F%5Fcodelineno-12-27)        "stop_sequence": null,
[](#%5F%5Fcodelineno-12-28)        "usage": {
[](#%5F%5Fcodelineno-12-29)          "input_tokens": 516,
[](#%5F%5Fcodelineno-12-30)          "output_tokens": 244
[](#%5F%5Fcodelineno-12-31)        },
[](#%5F%5Fcodelineno-12-32)        "type": "message",
[](#%5F%5Fcodelineno-12-33)        "role": "assistant"
[](#%5F%5Fcodelineno-12-34)      },
[](#%5F%5Fcodelineno-12-35)      "tool_calls": [],
[](#%5F%5Fcodelineno-12-36)      "invalid_tool_calls": []
[](#%5F%5Fcodelineno-12-37)    }
[](#%5F%5Fcodelineno-12-38)  ],
[](#%5F%5Fcodelineno-12-39)  summary: 'Okay, let me extend the summary further based on the latest messages:\n' +
[](#%5F%5Fcodelineno-12-40)    '\n' +
[](#%5F%5Fcodelineno-12-41)    `The conversation began with you introducing yourself as Bob, which I acknowledged. You then repeated "I'm Bob" a few times, and I confirmed I recognized your name.\n` +
[](#%5F%5Fcodelineno-12-42)    '\n' +
[](#%5F%5Fcodelineno-12-43)    "You then expressed that you like the Boston Celtics basketball team, which led me to provide some background information about the team's history and success. You agreed that you appreciate how much the Celtics win.\n" +
[](#%5F%5Fcodelineno-12-44)    '\n' +
[](#%5F%5Fcodelineno-12-45)    `In the most recent messages, you greeted me again by saying "hi! I'm bob", reiterating your name just as you had done earlier. I reiterated that I understand your name is Bob based on you stating that multiple times throughout our conversation.\n` +
[](#%5F%5Fcodelineno-12-46)    '\n' +
[](#%5F%5Fcodelineno-12-47)    `In your latest message, you simply stated "hi! I'm bob" once more, further confirming your name. I have continued to demonstrate that I understand your name is Bob, as you have consistently identified yourself as such.\n` +
[](#%5F%5Fcodelineno-12-48)    '\n' +
[](#%5F%5Fcodelineno-12-49)    "Please let me know if I'm still missing anything or if you have any other points you'd like me to add to this extended summary of our discussion so far. I'm happy to keep building on it."
[](#%5F%5Fcodelineno-12-50)}
 ``

We can now resume having a conversation! Note that even though we only have the last two messages, we can still ask it questions about things mentioned earlier in the conversation (because we summarized those) 

`[](#%5F%5Fcodelineno-13-1)const inputMessage5 = new HumanMessage("what's my name?");
[](#%5F%5Fcodelineno-13-2)console.log(inputMessage5.content)
[](#%5F%5Fcodelineno-13-3)for await (const event of await app.stream({ messages: [inputMessage5] }, config)) {
[](#%5F%5Fcodelineno-13-4)  printUpdate(event)
[](#%5F%5Fcodelineno-13-5)}
`

`[](#%5F%5Fcodelineno-14-1)what's my name?
[](#%5F%5Fcodelineno-14-2)
[](#%5F%5Fcodelineno-14-3)================================ ai Message =================================
[](#%5F%5Fcodelineno-14-4)Your name is Bob. You have stated this multiple times throughout our conversation, repeatedly introducing yourself as "Bob" or "I'm Bob".
`

`[](#%5F%5Fcodelineno-15-1)const inputMessage6 = new HumanMessage("what NFL team do you think I like?");
[](#%5F%5Fcodelineno-15-2)console.log(inputMessage6.content)
[](#%5F%5Fcodelineno-15-3)for await (const event of await app.stream({ messages: [inputMessage6] }, config)) {
[](#%5F%5Fcodelineno-15-4)  printUpdate(event)
[](#%5F%5Fcodelineno-15-5)}
`

`[](#%5F%5Fcodelineno-16-1)what NFL team do you think I like?
[](#%5F%5Fcodelineno-16-2)
[](#%5F%5Fcodelineno-16-3)================================ ai Message =================================
[](#%5F%5Fcodelineno-16-4)I do not actually have any information about what NFL team you might like. In our conversation so far, you have only expressed that you are a fan of the Boston Celtics basketball team. You have not mentioned any preferences for NFL teams. Without you providing any additional details about your football team allegiances, I do not want to make an assumption about which NFL team you might be a fan of. Could you please let me know if there is an NFL team you particularly enjoy following?
`

`[](#%5F%5Fcodelineno-17-1)const inputMessage7 = new HumanMessage("i like the patriots!");
[](#%5F%5Fcodelineno-17-2)console.log(inputMessage7.content)
[](#%5F%5Fcodelineno-17-3)for await (const event of await app.stream({ messages: [inputMessage7] }, config)) {
[](#%5F%5Fcodelineno-17-4)  printUpdate(event)
[](#%5F%5Fcodelineno-17-5)}
`

`[](#%5F%5Fcodelineno-18-1)i like the patriots!
[](#%5F%5Fcodelineno-18-2)
[](#%5F%5Fcodelineno-18-3)================================ ai Message =================================
[](#%5F%5Fcodelineno-18-4)Okay, got it. Based on your latest message, I now understand that in addition to being a fan of the Boston Celtics basketball team, you also like the New England Patriots NFL team.
[](#%5F%5Fcodelineno-18-5)
[](#%5F%5Fcodelineno-18-6)That makes a lot of sense given that both the Celtics and Patriots are major sports franchises based in the Boston/New England region. It's common for fans to follow multiple professional teams from the same geographic area.
[](#%5F%5Fcodelineno-18-7)
[](#%5F%5Fcodelineno-18-8)I appreciate you sharing this additional information about your football team preferences. Knowing that you're a Patriots fan provides helpful context about your sports interests and loyalties. It's good for me to have that understanding as we continue our conversation.
[](#%5F%5Fcodelineno-18-9)
[](#%5F%5Fcodelineno-18-10)Please let me know if there's anything else you'd like to discuss related to the Patriots, the Celtics, or your overall sports fandom. I'm happy to chat more about those topics.
[](#%5F%5Fcodelineno-18-11)
[](#%5F%5Fcodelineno-18-12)================================ remove Message =================================
[](#%5F%5Fcodelineno-18-13)
[](#%5F%5Fcodelineno-18-14)
[](#%5F%5Fcodelineno-18-15)================================ remove Message =================================
[](#%5F%5Fcodelineno-18-16)
[](#%5F%5Fcodelineno-18-17)
[](#%5F%5Fcodelineno-18-18)================================ remove Message =================================
[](#%5F%5Fcodelineno-18-19)
[](#%5F%5Fcodelineno-18-20)
[](#%5F%5Fcodelineno-18-21)================================ remove Message =================================
[](#%5F%5Fcodelineno-18-22)
[](#%5F%5Fcodelineno-18-23)
[](#%5F%5Fcodelineno-18-24)================================ remove Message =================================
[](#%5F%5Fcodelineno-18-25)
[](#%5F%5Fcodelineno-18-26)
[](#%5F%5Fcodelineno-18-27)================================ remove Message =================================
[](#%5F%5Fcodelineno-18-28)
[](#%5F%5Fcodelineno-18-29)Okay, got it - let me extend the summary further based on the latest messages:
[](#%5F%5Fcodelineno-18-30)
[](#%5F%5Fcodelineno-18-31)The conversation began with you introducing yourself as Bob, which I acknowledged. You then repeated "I'm Bob" a few times, and I confirmed I recognized your name.
[](#%5F%5Fcodelineno-18-32)
[](#%5F%5Fcodelineno-18-33)You then expressed that you like the Boston Celtics basketball team, which led me to provide some background information about the team's history and success. You agreed that you appreciate how much the Celtics win.
[](#%5F%5Fcodelineno-18-34)
[](#%5F%5Fcodelineno-18-35)In the most recent messages, you greeted me again by saying "hi! I'm Bob", reiterating your name just as you had done earlier. I reiterated that I understand your name is Bob based on you stating that multiple times throughout our conversation.
[](#%5F%5Fcodelineno-18-36)
[](#%5F%5Fcodelineno-18-37)You then asked what NFL team I think you might like, and I acknowledged that I did not have enough information to make an assumption about your NFL team preferences. You then revealed that you are also a fan of the New England Patriots, which I said makes sense given the Celtics and Patriots are both major sports franchises in the Boston/New England region.
[](#%5F%5Fcodelineno-18-38)
[](#%5F%5Fcodelineno-18-39)In your latest message, you simply stated "hi! I'm Bob" once more, further confirming your name. I have continued to demonstrate that I understand your name is Bob, as you have consistently identified yourself as such.
[](#%5F%5Fcodelineno-18-40)
[](#%5F%5Fcodelineno-18-41)Please let me know if I'm still missing anything or if you have any other points you'd like me to add to this extended summary of our discussion so far. I'm happy to keep building on it.
`

 Was this page helpful? 

 Thanks for your feedback!

 Thanks for your feedback! Please help us improve this page by adding to the discussion below.

 Back to top 

[  Previous  How to delete messages ](../delete-messages/) [  Next  How to add semantic search to your agent's memory ](../semantic-search/) 

 Copyright © 2025 LangChain, Inc | [Consent Preferences](#%5F%5Fconsent) 

 Made with[ Material for MkDocs Insiders](https://squidfunk.github.io/mkdocs-material/) 

[ ](https://langchain-ai.github.io/langgraph/ "langchain-ai.github.io") [ ](https://github.com/langchain-ai/langgraphjs "github.com") [ ](https://twitter.com/LangChainAI "twitter.com") 

#### Cookie consent

We use cookies to recognize your repeated visits and preferences, as well as to measure the effectiveness of our documentation and whether users find what they're searching for. **Clicking "Accept" makes our documentation better. Thank you!** ❤️

* Google Analytics
* GitHub

Accept Reject 