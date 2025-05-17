[ Skip to content](#how-to-stream-events-from-within-a-tool) 

**Help us build the JS tools that power AI apps at companies like Replit, Uber, LinkedIn, GitLab, and more. [Join our team!](https://jobs.ashbyhq.com/langchain/05efa205-8560-43fd-bfcc-3f7697561cfb?utm%5Fsource=https%3A%2F%2Flangchain-ai.github.io%2Flanggraphjs%2F&utm%5Fcampaign=langgraphjs%5Fdocs)** 

[ ![logo](../../static/wordmark_dark.svg) ![logo](../../static/wordmark_light.svg) ](../..) 

 How to stream events from within a tool 

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
                              * [  Memory ](../../how-tos#memory)  
                              * [  Human-in-the-loop ](../../how-tos#human-in-the-loop)  
                              * Streaming  
                               Streaming  
                                             * [  Streaming ](../../how-tos#streaming)  
                                             * [  How to stream full state of your graph ](../stream-values/)  
                                             * [  How to stream state updates of your graph ](../stream-updates/)  
                                             * [  How to stream LLM tokens from your graph ](../stream-tokens/)  
                                             * [  How to stream LLM tokens (without LangChain models) ](../streaming-tokens-without-langchain/)  
                                             * [  How to stream custom data ](../streaming-content/)  
                                             * [  How to configure multiple streaming modes at the same time ](../stream-multiple/)  
                                             * How to stream events from within a tool [  How to stream events from within a tool ](./)  
                                              Table of contents  
                                                               * [  Setup ](#setup)  
                                                               * [  Define graph and tools ](#define-graph-and-tools)  
                                                               * [  Stream events from the graph ](#stream-events-from-the-graph)  
                                             * [  How to stream from the final node ](../streaming-from-final-node/)  
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
* [  Define graph and tools ](#define-graph-and-tools)
* [  Stream events from the graph ](#stream-events-from-the-graph)

1. [  LangGraph ](../..)
2. [  Guides ](../)
3. [  How-to Guides ](../)
4. [  LangGraph ](../../how-tos#langgraph)
5. [  Streaming ](../../how-tos#streaming)

# How to stream events from within a tool[¶](#how-to-stream-events-from-within-a-tool "Permanent link")

If your LangGraph graph needs to use tools that call LLMs (or any other LangChain `Runnable` objects -- other graphs, LCEL chains, retrievers, etc.), you might want to stream events from the underlying `Runnable`. This guide shows how you can do that.

## Setup[¶](#setup "Permanent link")

`[](#%5F%5Fcodelineno-0-1)npm install @langchain/langgraph @langchain/anthropic @langchain/core zod
`

`[](#%5F%5Fcodelineno-1-1)process.env.ANTHROPIC_API_KEY = 'YOUR_API_KEY'
`

## Define graph and tools[¶](#define-graph-and-tools "Permanent link")

We'll use a prebuilt ReAct agent for this guide

`[](#%5F%5Fcodelineno-2-1)import { z } from "zod";
[](#%5F%5Fcodelineno-2-2)import { tool } from "@langchain/core/tools";
[](#%5F%5Fcodelineno-2-3)import { ChatPromptTemplate } from "@langchain/core/prompts";
[](#%5F%5Fcodelineno-2-4)import { ChatAnthropic } from "@langchain/anthropic";
[](#%5F%5Fcodelineno-2-5)
[](#%5F%5Fcodelineno-2-6)const model = new ChatAnthropic({
[](#%5F%5Fcodelineno-2-7)  model: "claude-3-5-sonnet-20240620",
[](#%5F%5Fcodelineno-2-8)  temperature: 0,
[](#%5F%5Fcodelineno-2-9)});
[](#%5F%5Fcodelineno-2-10)
[](#%5F%5Fcodelineno-2-11)const getItems = tool(
[](#%5F%5Fcodelineno-2-12)  async (input, config) => {
[](#%5F%5Fcodelineno-2-13)    const template = ChatPromptTemplate.fromMessages([
[](#%5F%5Fcodelineno-2-14)      [
[](#%5F%5Fcodelineno-2-15)        "human",
[](#%5F%5Fcodelineno-2-16)        "Can you tell me what kind of items i might find in the following place: '{place}'. " +
[](#%5F%5Fcodelineno-2-17)          "List at least 3 such items separating them by a comma. And include a brief description of each item..",
[](#%5F%5Fcodelineno-2-18)      ],
[](#%5F%5Fcodelineno-2-19)    ]);
[](#%5F%5Fcodelineno-2-20)
[](#%5F%5Fcodelineno-2-21)    const modelWithConfig = model.withConfig({
[](#%5F%5Fcodelineno-2-22)      runName: "Get Items LLM",
[](#%5F%5Fcodelineno-2-23)      tags: ["tool_llm"],
[](#%5F%5Fcodelineno-2-24)    });
[](#%5F%5Fcodelineno-2-25)
[](#%5F%5Fcodelineno-2-26)    const chain = template.pipe(modelWithConfig);
[](#%5F%5Fcodelineno-2-27)    const result = await chain.invoke(input, config);
[](#%5F%5Fcodelineno-2-28)    return result.content;
[](#%5F%5Fcodelineno-2-29)  },
[](#%5F%5Fcodelineno-2-30)  {
[](#%5F%5Fcodelineno-2-31)    name: "get_items",
[](#%5F%5Fcodelineno-2-32)    description: "Use this tool to look up which items are in the given place.",
[](#%5F%5Fcodelineno-2-33)    schema: z.object({
[](#%5F%5Fcodelineno-2-34)      place: z.string().describe("The place to look up items for. E.g 'shelf'"),
[](#%5F%5Fcodelineno-2-35)    }),
[](#%5F%5Fcodelineno-2-36)  }
[](#%5F%5Fcodelineno-2-37));
`

We're adding a custom tag (`tool_llm`) to our LLM runnable within the tool. This will allow us to filter events that we'll stream from the compiled graph (`agent`) Runnable below

`[](#%5F%5Fcodelineno-3-1)import { createReactAgent } from "@langchain/langgraph/prebuilt";
[](#%5F%5Fcodelineno-3-2)
[](#%5F%5Fcodelineno-3-3)const agent = createReactAgent({
[](#%5F%5Fcodelineno-3-4)  llm: model,
[](#%5F%5Fcodelineno-3-5)  tools: [getItems],
[](#%5F%5Fcodelineno-3-6)});
`

## Stream events from the graph[¶](#stream-events-from-the-graph "Permanent link")

`[](#%5F%5Fcodelineno-4-1)let finalEvent;
[](#%5F%5Fcodelineno-4-2)
[](#%5F%5Fcodelineno-4-3)for await (const event of agent.streamEvents(
[](#%5F%5Fcodelineno-4-4)  {
[](#%5F%5Fcodelineno-4-5)    messages: [
[](#%5F%5Fcodelineno-4-6)      [
[](#%5F%5Fcodelineno-4-7)        "human",
[](#%5F%5Fcodelineno-4-8)        "what items are on the shelf? You should call the get_items tool.",
[](#%5F%5Fcodelineno-4-9)      ],
[](#%5F%5Fcodelineno-4-10)    ],
[](#%5F%5Fcodelineno-4-11)  },
[](#%5F%5Fcodelineno-4-12)  {
[](#%5F%5Fcodelineno-4-13)    version: "v2",
[](#%5F%5Fcodelineno-4-14)  },
[](#%5F%5Fcodelineno-4-15)  {
[](#%5F%5Fcodelineno-4-16)    includeTags: ["tool_llm"],
[](#%5F%5Fcodelineno-4-17)  }
[](#%5F%5Fcodelineno-4-18))) {
[](#%5F%5Fcodelineno-4-19)  if ("chunk" in event.data) {
[](#%5F%5Fcodelineno-4-20)    console.dir({
[](#%5F%5Fcodelineno-4-21)      type: event.data.chunk._getType(),
[](#%5F%5Fcodelineno-4-22)      content: event.data.chunk.content,
[](#%5F%5Fcodelineno-4-23)    })
[](#%5F%5Fcodelineno-4-24)  }
[](#%5F%5Fcodelineno-4-25)  finalEvent = event;
[](#%5F%5Fcodelineno-4-26)}
`

`[](#%5F%5Fcodelineno-5-1){ type: 'ai', content: 'Here' }
[](#%5F%5Fcodelineno-5-2){ type: 'ai', content: ' are three items you might' }
[](#%5F%5Fcodelineno-5-3){ type: 'ai', content: ' find on a shelf,' }
[](#%5F%5Fcodelineno-5-4){ type: 'ai', content: ' along with brief' }
[](#%5F%5Fcodelineno-5-5){ type: 'ai', content: ' descriptions:\n\n1.' }
[](#%5F%5Fcodelineno-5-6){ type: 'ai', content: ' Books' }
[](#%5F%5Fcodelineno-5-7){ type: 'ai', content: ': Boun' }
[](#%5F%5Fcodelineno-5-8){ type: 'ai', content: 'd collections of printe' }
[](#%5F%5Fcodelineno-5-9){ type: 'ai', content: 'd pages' }
[](#%5F%5Fcodelineno-5-10){ type: 'ai', content: ' containing' }
[](#%5F%5Fcodelineno-5-11){ type: 'ai', content: ' various' }
[](#%5F%5Fcodelineno-5-12){ type: 'ai', content: ' forms' }
[](#%5F%5Fcodelineno-5-13){ type: 'ai', content: ' of literature, information' }
[](#%5F%5Fcodelineno-5-14){ type: 'ai', content: ', or reference' }
[](#%5F%5Fcodelineno-5-15){ type: 'ai', content: ' material.\n\n2.' }
[](#%5F%5Fcodelineno-5-16){ type: 'ai', content: ' Picture' }
[](#%5F%5Fcodelineno-5-17){ type: 'ai', content: ' frames: Decorative' }
[](#%5F%5Fcodelineno-5-18){ type: 'ai', content: ' borders' }
[](#%5F%5Fcodelineno-5-19){ type: 'ai', content: ' used to display an' }
[](#%5F%5Fcodelineno-5-20){ type: 'ai', content: 'd protect photographs, artwork' }
[](#%5F%5Fcodelineno-5-21){ type: 'ai', content: ', or other visual memor' }
[](#%5F%5Fcodelineno-5-22){ type: 'ai', content: 'abilia.\n\n3' }
[](#%5F%5Fcodelineno-5-23){ type: 'ai', content: '. Pot' }
[](#%5F%5Fcodelineno-5-24){ type: 'ai', content: 'ted plants: Small' }
[](#%5F%5Fcodelineno-5-25){ type: 'ai', content: ' indoor' }
[](#%5F%5Fcodelineno-5-26){ type: 'ai', content: ' plants in' }
[](#%5F%5Fcodelineno-5-27){ type: 'ai', content: ' containers, often used for' }
[](#%5F%5Fcodelineno-5-28){ type: 'ai', content: ' decoration or to add a' }
[](#%5F%5Fcodelineno-5-29){ type: 'ai', content: ' touch of nature to indoor' }
[](#%5F%5Fcodelineno-5-30){ type: 'ai', content: ' spaces.' }
`

Let's inspect the last event to get the final list of messages from the agent 

`[](#%5F%5Fcodelineno-6-1)const finalMessage = finalEvent?.data.output;
[](#%5F%5Fcodelineno-6-2)console.dir(
[](#%5F%5Fcodelineno-6-3)  {
[](#%5F%5Fcodelineno-6-4)    type: finalMessage._getType(),
[](#%5F%5Fcodelineno-6-5)    content: finalMessage.content,
[](#%5F%5Fcodelineno-6-6)    tool_calls: finalMessage.tool_calls,
[](#%5F%5Fcodelineno-6-7)  },
[](#%5F%5Fcodelineno-6-8)  { depth: null }
[](#%5F%5Fcodelineno-6-9));
`

`[](#%5F%5Fcodelineno-7-1){
[](#%5F%5Fcodelineno-7-2)  type: 'ai',
[](#%5F%5Fcodelineno-7-3)  content: 'Here are three items you might find on a shelf, along with brief descriptions:\n' +
[](#%5F%5Fcodelineno-7-4)    '\n' +
[](#%5F%5Fcodelineno-7-5)    '1. Books: Bound collections of printed pages containing various forms of literature, information, or reference material.\n' +
[](#%5F%5Fcodelineno-7-6)    '\n' +
[](#%5F%5Fcodelineno-7-7)    '2. Picture frames: Decorative borders used to display and protect photographs, artwork, or other visual memorabilia.\n' +
[](#%5F%5Fcodelineno-7-8)    '\n' +
[](#%5F%5Fcodelineno-7-9)    '3. Potted plants: Small indoor plants in containers, often used for decoration or to add a touch of nature to indoor spaces.',
[](#%5F%5Fcodelineno-7-10)  tool_calls: []
[](#%5F%5Fcodelineno-7-11)}
`

You can see that the content of the `ToolMessage` is the same as the output we streamed above 

 Was this page helpful? 

 Thanks for your feedback!

 Thanks for your feedback! Please help us improve this page by adding to the discussion below.

 Back to top 

[  Previous  How to configure multiple streaming modes at the same time ](../stream-multiple/) [  Next  How to stream from the final node ](../streaming-from-final-node/) 

 Copyright © 2025 LangChain, Inc | [Consent Preferences](#%5F%5Fconsent) 

 Made with[ Material for MkDocs Insiders](https://squidfunk.github.io/mkdocs-material/) 

[ ](https://langchain-ai.github.io/langgraph/ "langchain-ai.github.io") [ ](https://github.com/langchain-ai/langgraphjs "github.com") [ ](https://twitter.com/LangChainAI "twitter.com") 

#### Cookie consent

We use cookies to recognize your repeated visits and preferences, as well as to measure the effectiveness of our documentation and whether users find what they're searching for. **Clicking "Accept" makes our documentation better. Thank you!** ❤️

* Google Analytics
* GitHub

Accept Reject 