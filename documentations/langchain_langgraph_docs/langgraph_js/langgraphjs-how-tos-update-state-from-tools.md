[Skip to content](#how-to-update-graph-state-from-tools)

**Help us build the JS tools that power AI apps at companies like Replit, Uber, LinkedIn, GitLab, and more. [Join our team!](https://jobs.ashbyhq.com/langchain/05efa205-8560-43fd-bfcc-3f7697561cfb?utm_source=https%3A%2F%2Flangchain-ai.github.io%2Flanggraphjs%2F&utm_campaign=langgraphjs_docs)**

[![logo](../../static/wordmark_dark.svg)
![logo](../../static/wordmark_light.svg)](../..)

How to update graph state from tools

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
        + [Streaming](../../how-tos#streaming)
        + Tool calling

          Tool calling
          - [Tool calling](../../how-tos#tool-calling)
          - [How to call tools using ToolNode](../tool-calling/)
          - [How to force an agent to call a tool](../force-calling-a-tool-first/)
          - [How to handle tool calling errors](../tool-calling-errors/)
          - [How to pass runtime values to tools](../pass-run-time-values-to-tools/)
          - How to update graph state from tools

            [How to update graph state from tools](./)

            Table of contents
            * [Setup](#setup)
            * [Define tool](#define-tool)
            * [Define prompt](#define-prompt)
            * [Define graph](#define-graph)
            * [Use it!](#use-it)
            * [Custom components](#custom-components)
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
* [Define tool](#define-tool)
* [Define prompt](#define-prompt)
* [Define graph](#define-graph)
* [Use it!](#use-it)
* [Custom components](#custom-components)

1. [LangGraph](../..)
2. [Guides](../)
3. [How-to Guides](../)
4. [LangGraph](../../how-tos#langgraph)
5. [Tool calling](../../how-tos#tool-calling)

# How to update graph state from tools[¶](#how-to-update-graph-state-from-tools "Permanent link")

Prerequisites

This guide assumes familiarity with the following:

* [Command](https://langchain-ai.github.io/langgraphjs/concepts/low_level/#command)

A common use case is updating graph state from inside a tool. For example, in a customer support application you might want to look up customer account number or ID in the beginning of the conversation. To update the graph state from the tool, you can return a [`Command`](https://langchain-ai.github.io/langgraphjs/concepts/low_level/#command) object from the tool:

```
import { tool } from "@langchain/core/tools";

const lookupUserInfo = tool(async (input, config) => {
  const userInfo = getUserInfo(config);
  return new Command({
    // update state keys
    update: {
      user_info: userInfo,
      messages: [
        new ToolMessage({
          content: "Successfully looked up user information",
          tool_call_id: config.toolCall.id,
        }),
      ],
    },
  });
}, {
  name: "lookup_user_info",
  description: "Use this to look up user information to better assist them with their questions.",
  schema: z.object(...)
});

```

Important

If you want to use tools that return `Command` instances and update graph state, you can either use prebuilt [`createReactAgent`](https://langchain-ai.github.io/langgraphjs/reference/functions/langgraph_prebuilt.createReactAgent.html) / [`ToolNode`](https://langchain-ai.github.io/langgraphjs/reference/classes/langgraph_prebuilt.ToolNode.html) components, or implement your own tool-executing node that identifies `Command` objects returned by your tools and returns a mixed array of traditional state updates and `Commands`.

See [this section](#custom-components) for an example.

This guide shows how you can do this using LangGraph's prebuilt components ([`createReactAgent`](https://langchain-ai.github.io/langgraphjs/reference/functions/langgraph_prebuilt.createReactAgent.html) and [`ToolNode`](https://langchain-ai.github.io/langgraphjs/reference/classes/langgraph_prebuilt.ToolNode.html)).

Compatibility

This guide requires `@langchain/langgraph>=0.2.33` and `@langchain/core@0.3.23`. For help upgrading, see [this guide](/langgraphjs/how-tos/manage-ecosystem-dependencies/).

## Setup[¶](#setup "Permanent link")

Install the following to run this guide:

```
npm install @langchain/langgraph @langchain/openai @langchain/core

```

Next, configure your environment to connect to your model provider.

```
export OPENAI_API_KEY=your-api-key

```

Set up [LangSmith](https://smith.langchain.com) for LangGraph development

Sign up for LangSmith to quickly spot issues and improve the performance of your LangGraph projects. LangSmith lets you use trace data to debug, test, and monitor your LLM apps built with LangGraph — read more about how to get started [here](https://docs.smith.langchain.com).

Let's create a simple ReAct style agent that can look up user information and personalize the response based on the user info.

## Define tool[¶](#define-tool "Permanent link")

First, let's define the tool that we'll be using to look up user information. We'll use a naive implementation that simply looks user information up using a dictionary:

```
const USER_ID_TO_USER_INFO = {
  abc123: {
    user_id: "abc123",
    name: "Bob Dylan",
    location: "New York, NY",
  },
  zyx987: {
    user_id: "zyx987",
    name: "Taylor Swift",
    location: "Beverly Hills, CA",
  },
};

```

```
import { Annotation, Command, MessagesAnnotation } from "@langchain/langgraph";
import { tool } from "@langchain/core/tools";

import { z } from "zod";

const StateAnnotation = Annotation.Root({
  ...MessagesAnnotation.spec,
  // user provided
  lastName: Annotation<string>,
  // updated by the tool
  userInfo: Annotation<Record<string, any>>,
});

const lookupUserInfo = tool(async (_, config) => {
  const userId = config.configurable?.user_id;
  if (userId === undefined) {
    throw new Error("Please provide a user id in config.configurable");
  }
  if (USER_ID_TO_USER_INFO[userId] === undefined) {
    throw new Error(`User "${userId}" not found`);
  }
  // Populated when a tool is called with a tool call from a model as input
  const toolCallId = config.toolCall.id;
  return new Command({
    update: {
      // update the state keys
      userInfo: USER_ID_TO_USER_INFO[userId],
      // update the message history
      messages: [
        {
          role: "tool",
          content: "Successfully looked up user information",
          tool_call_id: toolCallId,
        },
      ],
    },
  })
}, {
  name: "lookup_user_info",
  description: "Always use this to look up information about the user to better assist them with their questions.",
  schema: z.object({}),
});

```

## Define prompt[¶](#define-prompt "Permanent link")

Let's now add personalization: we'll respond differently to the user based on the state values AFTER the state has been updated from the tool. To achieve this, let's define a function that will dynamically construct the system prompt based on the graph state. It will be called ever time the LLM is called and the function output will be passed to the LLM:

```
const stateModifier = (state: typeof StateAnnotation.State) => {
  const userInfo = state.userInfo;
  if (userInfo == null) {
    return state.messages;
  }
  const systemMessage = `User name is ${userInfo.name}. User lives in ${userInfo.location}`;
  return [{
    role: "system",
    content: systemMessage,
  }, ...state.messages];
};

```

## Define graph[¶](#define-graph "Permanent link")

Finally, let's combine this into a single graph using the prebuilt `createReactAgent` and the components we declared earlier:

```
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";

const model = new ChatOpenAI({
  model: "gpt-4o",
});

const agent = createReactAgent({
  llm: model,
  tools: [lookupUserInfo],
  stateSchema: StateAnnotation,
  stateModifier: stateModifier,
})

```

## Use it![¶](#use-it "Permanent link")

Let's now try running our agent. We'll need to provide user ID in the config so that our tool knows what information to look up:

```
const stream = await agent.stream({
  messages: [{
    role: "user",
    content: "hi, what should i do this weekend?",
  }],

}, {
  // provide user ID in the config
  configurable: { user_id: "abc123" }
});

for await (const chunk of stream) {
  console.log(chunk);
}

```

```
{
  agent: {
    messages: [
      AIMessage {
        "id": "chatcmpl-AdmOZdrZy3aUgNimCIjq8ZW5js6ln",
        "content": "",
        "additional_kwargs": {
          "tool_calls": [
            {
              "id": "call_kLXWJYbabxWpj7vykXD6ZMx0",
              "type": "function",
              "function": "[Object]"
            }
          ]
        },
        "response_metadata": {
          "tokenUsage": {
            "promptTokens": 59,
            "completionTokens": 11,
            "totalTokens": 70
          },
          "finish_reason": "tool_calls",
          "usage": {
            "prompt_tokens": 59,
            "completion_tokens": 11,
            "total_tokens": 70,
            "prompt_tokens_details": {
              "cached_tokens": 0,
              "audio_tokens": 0
            },
            "completion_tokens_details": {
              "reasoning_tokens": 0,
              "audio_tokens": 0,
              "accepted_prediction_tokens": 0,
              "rejected_prediction_tokens": 0
            }
          },
          "system_fingerprint": "fp_f785eb5f47"
        },
        "tool_calls": [
          {
            "name": "lookup_user_info",
            "args": {},
            "type": "tool_call",
            "id": "call_kLXWJYbabxWpj7vykXD6ZMx0"
          }
        ],
        "invalid_tool_calls": [],
        "usage_metadata": {
          "output_tokens": 11,
          "input_tokens": 59,
          "total_tokens": 70,
          "input_token_details": {
            "audio": 0,
            "cache_read": 0
          },
          "output_token_details": {
            "audio": 0,
            "reasoning": 0
          }
        }
      }
    ]
  }
}
{
  tools: {
    userInfo: { user_id: 'abc123', name: 'Bob Dylan', location: 'New York, NY' },
    messages: [ [Object] ]
  }
}
{
  agent: {
    messages: [
      AIMessage {
        "id": "chatcmpl-AdmOZJ0gSQ7VVCUfcadhOeqq4HxWa",
        "content": "Hi Bob! Since you're in New York, NY, there are plenty of exciting things you can do this weekend. Here are a few suggestions:\n\n1. **Visit Central Park**: Enjoy a leisurely walk, rent a bike, or have a picnic. The park is beautiful in the fall.\n\n2. **Explore Museums**: Check out The Met, MoMA, or The American Museum of Natural History if you're interested in art or history.\n\n3. **Broadway Show**: Catch a Broadway show or a musical for an entertaining evening.\n\n4. **Visit Times Square**: Experience the vibrant lights and energy of Times Square. There are plenty of shops and restaurants to explore.\n\n5. **Brooklyn Bridge Walk**: Walk across the iconic Brooklyn Bridge and enjoy stunning views of Manhattan and Brooklyn.\n\n6. **Cultural Festivals or Events**: Check local listings for any cultural festivals or events happening in the city this weekend.\n\nIf you have specific interests, let me know, and I can suggest something more tailored to your preferences!",
        "additional_kwargs": {},
        "response_metadata": {
          "tokenUsage": {
            "promptTokens": 98,
            "completionTokens": 209,
            "totalTokens": 307
          },
          "finish_reason": "stop",
          "usage": {
            "prompt_tokens": 98,
            "completion_tokens": 209,
            "total_tokens": 307,
            "prompt_tokens_details": {
              "cached_tokens": 0,
              "audio_tokens": 0
            },
            "completion_tokens_details": {
              "reasoning_tokens": 0,
              "audio_tokens": 0,
              "accepted_prediction_tokens": 0,
              "rejected_prediction_tokens": 0
            }
          },
          "system_fingerprint": "fp_cc5cf1c6e3"
        },
        "tool_calls": [],
        "invalid_tool_calls": [],
        "usage_metadata": {
          "output_tokens": 209,
          "input_tokens": 98,
          "total_tokens": 307,
          "input_token_details": {
            "audio": 0,
            "cache_read": 0
          },
          "output_token_details": {
            "audio": 0,
            "reasoning": 0
          }
        }
      }
    ]
  }
}

```

We can see that the model correctly recommended some New York activities for Bob Dylan! Let's try getting recommendations for Taylor Swift:

```
const taylorStream = await agent.stream({
  messages: [{
    role: "user",
    content: "hi, what should i do this weekend?",
  }],

}, {
  // provide user ID in the config
  configurable: { user_id: "zyx987" }
});

for await (const chunk of taylorStream) {
  console.log(chunk);
}

```

```
{
  agent: {
    messages: [
      AIMessage {
        "id": "chatcmpl-AdmQGANyXPTAkMnQ86hGWB5XY5hGL",
        "content": "",
        "additional_kwargs": {
          "tool_calls": [
            {
              "id": "call_IvyfreezvohjGgUx9DrwfS5O",
              "type": "function",
              "function": "[Object]"
            }
          ]
        },
        "response_metadata": {
          "tokenUsage": {
            "promptTokens": 59,
            "completionTokens": 11,
            "totalTokens": 70
          },
          "finish_reason": "tool_calls",
          "usage": {
            "prompt_tokens": 59,
            "completion_tokens": 11,
            "total_tokens": 70,
            "prompt_tokens_details": {
              "cached_tokens": 0,
              "audio_tokens": 0
            },
            "completion_tokens_details": {
              "reasoning_tokens": 0,
              "audio_tokens": 0,
              "accepted_prediction_tokens": 0,
              "rejected_prediction_tokens": 0
            }
          },
          "system_fingerprint": "fp_cc5cf1c6e3"
        },
        "tool_calls": [
          {
            "name": "lookup_user_info",
            "args": {},
            "type": "tool_call",
            "id": "call_IvyfreezvohjGgUx9DrwfS5O"
          }
        ],
        "invalid_tool_calls": [],
        "usage_metadata": {
          "output_tokens": 11,
          "input_tokens": 59,
          "total_tokens": 70,
          "input_token_details": {
            "audio": 0,
            "cache_read": 0
          },
          "output_token_details": {
            "audio": 0,
            "reasoning": 0
          }
        }
      }
    ]
  }
}
{
  tools: {
    userInfo: {
      user_id: 'zyx987',
      name: 'Taylor Swift',
      location: 'Beverly Hills, CA'
    },
    messages: [ [Object] ]
  }
}
{
  agent: {
    messages: [
      AIMessage {
        "id": "chatcmpl-AdmQHMYj613jksQJruNMVP6DfAagd",
        "content": "This weekend, there are plenty of exciting things you can do around Beverly Hills, CA. Here are some options:\n\n1. **Explore Rodeo Drive**: Enjoy high-end shopping and dining experiences in this iconic shopping district.\n   \n2. **Visit a Museum**: Check out The Getty Center or Los Angeles County Museum of Art (LACMA) for a dose of culture and art.\n\n3. **Hiking**: Take a scenic hike in the nearby Santa Monica Mountains or Griffith Park for beautiful views of the city.\n\n4. **Spa Day**: Treat yourself to a relaxing spa day at one of Beverly Hills' luxurious spas.\n\n5. **Restaurant Tour**: Dine at some of Beverly Hills' finest restaurants, such as Spago or The Penthouse.\n\n6. **Take a Scenic Drive**: Drive along Mulholland Drive for stunning views of Los Angeles and the surrounding areas.\n\n7. **Catch a Show**: See if there are any live performances or concerts happening at The Hollywood Bowl or other nearby venues.\n\nEnjoy your weekend!",
        "additional_kwargs": {},
        "response_metadata": {
          "tokenUsage": {
            "promptTokens": 98,
            "completionTokens": 214,
            "totalTokens": 312
          },
          "finish_reason": "stop",
          "usage": {
            "prompt_tokens": 98,
            "completion_tokens": 214,
            "total_tokens": 312,
            "prompt_tokens_details": {
              "cached_tokens": 0,
              "audio_tokens": 0
            },
            "completion_tokens_details": {
              "reasoning_tokens": 0,
              "audio_tokens": 0,
              "accepted_prediction_tokens": 0,
              "rejected_prediction_tokens": 0
            }
          },
          "system_fingerprint": "fp_9d50cd990b"
        },
        "tool_calls": [],
        "invalid_tool_calls": [],
        "usage_metadata": {
          "output_tokens": 214,
          "input_tokens": 98,
          "total_tokens": 312,
          "input_token_details": {
            "audio": 0,
            "cache_read": 0
          },
          "output_token_details": {
            "audio": 0,
            "reasoning": 0
          }
        }
      }
    ]
  }
}

```

## Custom components[¶](#custom-components "Permanent link")

If you do not wish to use prebuilt components, you will need to have special logic in your custom tool executor to handle commands. Here's an example:

```
import {
  MessagesAnnotation,
  isCommand,
  Command,
  StateGraph,
} from "@langchain/langgraph";
import { tool } from "@langchain/core/tools";
import { isAIMessage } from "@langchain/core/messages";

import { z } from "zod";

const myTool = tool(async () => {
  return new Command({
    update: {
      messages: [
        {
          role: "assistant",
          content: "hi there!",
          name: "Greeter",
        }
      ],
    },
  });
}, {
  name: "greeting",
  description: "Updates the current state with a greeting",
  schema: z.object({}),
});

const toolExecutor = async (state: typeof MessagesAnnotation.State) => {
  const message = state.messages.at(-1);
  if (!isAIMessage(message) || message.tool_calls === undefined || message.tool_calls.length === 0) {
    throw new Error("Most recent message must be an AIMessage with a tool call.")
  }
  const outputs = await Promise.all(
    message.tool_calls.map(async (toolCall) => {
      // Using a single tool for simplicity, would need to select tools by toolCall.name
      // in practice.
      const toolResult = await myTool.invoke(toolCall);
      return toolResult;
    })
  );
  // Handle mixed Command and non-Command outputs
  const combinedOutputs = outputs.map((output) => {
    if (isCommand(output)) {
      return output;
    }
    // Tool invocation result is a ToolMessage, return a normal state update
    return { messages: [output] };
  });
  // Return an array of values instead of an object
  return combinedOutputs;
};

// Simple one node graph
const customGraph = new StateGraph(MessagesAnnotation)
  .addNode("runTools", toolExecutor)
  .addEdge("__start__", "runTools")
  .compile();

await customGraph.invoke({
  messages: [{
    role: "user",
    content: "how are you?",
  }, {
    role: "assistant",
    content: "Let me call the greeting tool and find out!",
    tool_calls: [{
      id: "123",
      args: {},
      name: "greeting",
    }],
  }],
});

```

```
{
  messages: [
    HumanMessage {
      "id": "801308df-c702-49f4-99c1-da4116f6bbc8",
      "content": "how are you?",
      "additional_kwargs": {},
      "response_metadata": {}
    },
    AIMessage {
      "id": "8ea07329-a73a-4de4-a4d4-4453fbef32e0",
      "content": "Let me call the greeting tool and find out!",
      "additional_kwargs": {},
      "response_metadata": {},
      "tool_calls": [
        {
          "id": "123",
          "args": {},
          "name": "greeting"
        }
      ],
      "invalid_tool_calls": []
    },
    AIMessage {
      "id": "4ecba93a-77c0-44a6-8dc9-8b27d9615c15",
      "content": "hi there!",
      "name": "Greeter",
      "additional_kwargs": {},
      "response_metadata": {},
      "tool_calls": [],
      "invalid_tool_calls": []
    }
  ]
}

```

```

```

Was this page helpful?

Thanks for your feedback!

Thanks for your feedback! Please help us improve this page by adding to the discussion below.

Back to top

[Previous

How to pass runtime values to tools](../pass-run-time-values-to-tools/)
[Next

How to add and use subgraphs](../subgraph/)

Copyright © 2025 LangChain, Inc | [Consent Preferences](#__consent)

Made with
[Material for MkDocs Insiders](https://squidfunk.github.io/mkdocs-material/)

#### Cookie consent

We use cookies to recognize your repeated visits and preferences, as well as to measure the effectiveness of our documentation and whether users find what they're searching for. **Clicking "Accept" makes our documentation better. Thank you!** ❤️

* Google Analytics
* GitHub

Accept
Reject