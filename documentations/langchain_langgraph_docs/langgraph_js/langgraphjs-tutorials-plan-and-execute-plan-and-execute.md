[Skip to content](#plan-and-execute)

**Help us build the JS tools that power AI apps at companies like Replit, Uber, LinkedIn, GitLab, and more. [Join our team!](https://jobs.ashbyhq.com/langchain/05efa205-8560-43fd-bfcc-3f7697561cfb?utm_source=https%3A%2F%2Flangchain-ai.github.io%2Flanggraphjs%2F&utm_campaign=langgraphjs_docs)**

[![logo](../../../static/wordmark_dark.svg)
![logo](../../../static/wordmark_light.svg)](../../..)

Plan-and-Execute

Initializing search

[GitHub](https://github.com/langchain-ai/langgraphjs "Go to repository")

* [LangGraph](../../..)
* [Agents](../../../agents/overview/)
* [API reference](../../../reference/)
* [Versions](../../../versions/)

[![logo](../../../static/wordmark_dark.svg)
![logo](../../../static/wordmark_light.svg)](../../..)

[GitHub](https://github.com/langchain-ai/langgraphjs "Go to repository")

* [LangGraph](../../..)

  LangGraph
  + Get started

    Get started
    - [Learn the basics](../../quickstart/)
    - [Deployment](../../deployment/)
  + Guides

    Guides
    - [How-to Guides](../../../how-tos/)
    - [Concepts](../../../concepts/)
    - [Tutorials](../../)

      Tutorials
      * [Quick Start](../../../tutorials#quick-start)
      * [Chatbots](../../chatbots/customer_support_small_model/)
      * [RAG](../../../tutorials#rag)
      * Agent Architectures

        Agent Architectures
        + [Agent Architectures](../../../tutorials#agent-architectures)
        + [Multi-Agent Systems](../../../tutorials#multi-agent-systems)
        + Planning Agents

          Planning Agents
          - [Planning Agents](../../../tutorials#planning-agents)
          - Plan-and-Execute

            [Plan-and-Execute](./)

            Table of contents
            * [Setup](#setup)
            * [Define the State](#define-the-state)
            * [Define Tools](#define-tools)
            * [Define our Execution Agent](#define-our-execution-agent)
            * [Planning Step](#planning-step)
            * [Re-Plan Step](#re-plan-step)
            * [Create the Graph](#create-the-graph)

              + [See the LangSmith trace here.](#see-the-langsmith-trace-here)
        + [Reflection & Critique](../../../tutorials#reflection-critique)
      * [Evaluation & Analysis](../../../tutorials#evaluation)
  + Resources

    Resources
    - [Adopters](../../../adopters/)
    - [LLMS-txt](../../../llms-txt-overview/)
    - [FAQ](../../../concepts/faq/)
    - [Troubleshooting](../../../troubleshooting/errors/)
    - [LangGraph Academy Course](https://academy.langchain.com/courses/intro-to-langgraph)
* [Agents](../../../agents/overview/)
* [API reference](../../../reference/)
* [Versions](../../../versions/)

Table of contents

* [Setup](#setup)
* [Define the State](#define-the-state)
* [Define Tools](#define-tools)
* [Define our Execution Agent](#define-our-execution-agent)
* [Planning Step](#planning-step)
* [Re-Plan Step](#re-plan-step)
* [Create the Graph](#create-the-graph)

  + [See the LangSmith trace here.](#see-the-langsmith-trace-here)

1. [LangGraph](../../..)
2. [Guides](../../../how-tos/)
3. [Tutorials](../../)
4. [Agent Architectures](../../../tutorials#agent-architectures)
5. [Planning Agents](../../../tutorials#planning-agents)

# Plan-and-Execute[¶](#plan-and-execute "Permanent link")

This notebook shows how to create a "plan-and-execute" style agent. This is
heavily inspired by the [Plan-and-Solve](https://arxiv.org/abs/2305.04091) paper
as well as the [Baby-AGI](https://github.com/yoheinakajima/babyagi) project.

The core idea is to first come up with a multi-step plan, and then go through
that plan one item at a time. After accomplishing a particular task, you can
then revisit the plan and modify as appropriate.

This compares to a typical [ReAct](https://arxiv.org/abs/2210.03629) style agent
where you think one step at a time. The advantages of this "plan-and-execute"
style agent are:

1. Explicit long term planning (which even really strong LLMs can struggle with)
2. Ability to use smaller/weaker models for the execution step, only using
   larger/better models for the planning step

## Setup[¶](#setup "Permanent link")

First, we need to install the packages required.

```
npm install @langchain/langgraph @langchain/openai langchain @langchain/core

```

Next, we need to set API keys for OpenAI (the LLM we will use) and Tavily (the
search tool we will use)

```
// process.env.OPENAI_API_KEY = "YOUR_API_KEY"
// process.env.TAVILY_API_KEY = "YOUR_API_KEY"

```

Optionally, we can set API key for LangSmith tracing, which will give us
best-in-class observability.

```
// process.env.LANGCHAIN_TRACING_V2 = "true"
// process.env.LANGCHAIN_API_KEY = "YOUR_API_KEY"
// process.env.LANGCHAIN_PROJECT = "YOUR_PROJECT_NAME"

```

## Define the State[¶](#define-the-state "Permanent link")

Let's start by defining the state to track for this agent.

First, we will need to track the current plan. Let's represent that as a list of
strings.

Next, we should track previously executed steps. Let's represent that as a list
of tuples (these tuples will contain the step and then the result)

Finally, we need to have some state to represent the final response as well as
the original input.

```
import { Annotation } from "@langchain/langgraph";

const PlanExecuteState = Annotation.Root({
  input: Annotation<string>({
    reducer: (x, y) => y ?? x ?? "",
  }),
  plan: Annotation<string[]>({
    reducer: (x, y) => y ?? x ?? [],
  }),
  pastSteps: Annotation<[string, string][]>({
    reducer: (x, y) => x.concat(y),
  }),
  response: Annotation<string>({
    reducer: (x, y) => y ?? x,
  }),
})

```

## Define Tools[¶](#define-tools "Permanent link")

We will first define the tools we want to use. For this simple example, we will
use a built-in search tool via Tavily. However, it is really easy to create your
own tools - see documentation
[here](https://js.langchain.com/docs/modules/agents/tools/dynamic) on how to do
that.

```
import { TavilySearchResults } from "@langchain/community/tools/tavily_search";

const tools = [new TavilySearchResults({ maxResults: 3 })];

```

## Define our Execution Agent[¶](#define-our-execution-agent "Permanent link")

Now we will create the execution agent we want to use to execute tasks. Note
that for this example, we will be using the same execution agent for each task,
but this doesn't HAVE to be the case.

```
import { ChatOpenAI } from "@langchain/openai";
import { createReactAgent } from "@langchain/langgraph/prebuilt";

const agentExecutor = createReactAgent({
  llm: new ChatOpenAI({ model: "gpt-4o" }),
  tools: tools,
});

```

```
import { HumanMessage } from "@langchain/core/messages";

await agentExecutor.invoke({
  messages: [new HumanMessage("who is the winner of the us open")],
});

```

```
{
  messages: [
    HumanMessage {
      "content": "who is the winner of the us open",
      "additional_kwargs": {},
      "response_metadata": {}
    },
    AIMessage {
      "content": "",
      "additional_kwargs": {
        "tool_calls": [
          {
            "id": "call_c2N7Z1RX31qKJaSlpOJ0K7Wm",
            "type": "function",
            "function": "[Object]"
          }
        ]
      },
      "response_metadata": {
        "tokenUsage": {
          "completionTokens": 25,
          "promptTokens": 80,
          "totalTokens": 105
        },
        "finish_reason": "tool_calls"
      },
      "tool_calls": [
        {
          "name": "tavily_search_results_json",
          "args": {
            "input": "winner of the US Open 2023"
          },
          "type": "tool_call",
          "id": "call_c2N7Z1RX31qKJaSlpOJ0K7Wm"
        }
      ],
      "invalid_tool_calls": []
    },
    ToolMessage {
      "content": "[{\"title\":\"How Wyndham Clark won the 2023 U.S. Open over Rory McIlroy, Scottie ...\",\"url\":\"https://www.nytimes.com/athletic/live-blogs/us-open-leaderboard-live-scores-results-tee-times/mhPUFgLsyFfM/\",\"content\":\"Wyndham Clark is your 2023 U.S. Open champion. Wyndham Clark has won his first major championship, besting some of the best players in the world on Sunday at Los Angeles Country Club to claim the ...\",\"score\":0.9981324,\"raw_content\":null},{\"title\":\"Championship Point | Coco Gauff Wins Women's Singles Title | 2023 US Open\",\"url\":\"https://www.youtube.com/watch?v=rZ0XQWWFIAo\",\"content\":\"The moment Coco Gauff beat Aryna Sabalenka in the final of the 2023 US Open.Don't miss a moment of the US Open! Subscribe now: https://bit.ly/2Pdr81iThe 2023...\",\"score\":0.997459,\"raw_content\":null},{\"title\":\"2023 U.S. Open leaderboard: Wyndham Clark breaks through edging Rory ...\",\"url\":\"https://www.cbssports.com/golf/news/2023-u-s-open-leaderboard-wyndham-clark-breaks-through-edging-rory-mcilroy-for-first-major-championship/live/\",\"content\":\"College Pick'em\\nA Daily SportsLine Betting Podcast\\nNFL Playoff Time!\\n2023 U.S. Open leaderboard: Wyndham Clark breaks through edging Rory McIlroy for first major championship\\nClark beat one of the game's best clinching his second PGA Tour victory, both in the last six weeks\\nWith Rickie Fowler, Rory McIlroy and Scottie Scheffler atop the 2023 U.S. Open leaderboard, it appeared as if Los Angeles Country Club was set to crown a shining star as its national champion. After making birdie on No. 1 to momentarily pull even with the leaders, McIlroy was unable to take advantage of the short par-4 6th before leaving one on the table on the par-5 8th when his birdie putt from less than four feet failed to even touch the hole.\\n The shot on 14 was kind of the shot of the week for me -- to make a birdie there and grind it on the way in. The Champion Golfer of the Year now goes to defend the Claret Jug at Hoylake where he will relish the opportunity to put his creativity and imagination on display again.\\n Instead, the City of Angels saw a breakout performance from perhaps one of the game's rising stars as 29-year-old Wyndham Clark (-10) outlasted the veteran McIlroy (-9) to capture his first major championship and clinch his second professional victory.\\n\",\"score\":0.99586606,\"raw_content\":null}]",
      "name": "tavily_search_results_json",
      "additional_kwargs": {},
      "response_metadata": {},
      "tool_call_id": "call_c2N7Z1RX31qKJaSlpOJ0K7Wm"
    },
    AIMessage {
      "content": "The winners of the 2023 US Open are:\n\n- **Men's Singles**: Wyndham Clark, who won his first major championship.\n- **Women's Singles**: Coco Gauff, who defeated Aryna Sabalenka in the final.",
      "additional_kwargs": {},
      "response_metadata": {
        "tokenUsage": {
          "completionTokens": 50,
          "promptTokens": 717,
          "totalTokens": 767
        },
        "finish_reason": "stop"
      },
      "tool_calls": [],
      "invalid_tool_calls": []
    }
  ]
}

```

## Planning Step[¶](#planning-step "Permanent link")

Let's now think about creating the planning step. This will use function calling
to create a plan.

```
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

const plan = zodToJsonSchema(
  z.object({
    steps: z
      .array(z.string())
      .describe("different steps to follow, should be in sorted order"),
  }),
);
const planFunction = {
  name: "plan",
  description: "This tool is used to plan the steps to follow",
  parameters: plan,
};

const planTool = {
  type: "function",
  function: planFunction,
};

```

```
import { ChatPromptTemplate } from "@langchain/core/prompts";

const plannerPrompt = ChatPromptTemplate.fromTemplate(
  `For the given objective, come up with a simple step by step plan. \
This plan should involve individual tasks, that if executed correctly will yield the correct answer. Do not add any superfluous steps. \
The result of the final step should be the final answer. Make sure that each step has all the information needed - do not skip steps.

{objective}`,
);

const model = new ChatOpenAI({
  modelName: "gpt-4-0125-preview",
}).withStructuredOutput(planFunction);

const planner = plannerPrompt.pipe(model);

```

```
await planner.invoke({
  objective: "what is the hometown of the current Australia open winner?",
});

```

```
{
  steps: [
    [32m"Identify the current Australia Open winner."[39m,
    [32m"Research the hometown of the identified Australia Open winner."[39m,
    [32m"Report the hometown of the Australia Open winner."[39m
  ]
}

```

## Re-Plan Step[¶](#re-plan-step "Permanent link")

Now, let's create a step that re-does the plan based on the result of the
previous step.

```
import { JsonOutputToolsParser } from "@langchain/core/output_parsers/openai_tools";

const response = zodToJsonSchema(
  z.object({
    response: z.string().describe("Response to user."),
  }),
);

const responseTool = {
  type: "function",
  function: {
    name: "response",
    description: "Response to user.",
    parameters: response,
  },
};

const replannerPrompt = ChatPromptTemplate.fromTemplate(
  `For the given objective, come up with a simple step by step plan.
This plan should involve individual tasks, that if executed correctly will yield the correct answer. Do not add any superfluous steps.
The result of the final step should be the final answer. Make sure that each step has all the information needed - do not skip steps.

Your objective was this:
{input}

Your original plan was this:
{plan}

You have currently done the follow steps:
{pastSteps}

Update your plan accordingly. If no more steps are needed and you can return to the user, then respond with that and use the 'response' function.
Otherwise, fill out the plan.
Only add steps to the plan that still NEED to be done. Do not return previously done steps as part of the plan.`,
);

const parser = new JsonOutputToolsParser();
const replanner = replannerPrompt
  .pipe(
    new ChatOpenAI({ model: "gpt-4o" }).bindTools([
      planTool,
      responseTool,
    ]),
  )
  .pipe(parser);

```

## Create the Graph[¶](#create-the-graph "Permanent link")

We can now create the graph!

```
import { END, START, StateGraph } from "@langchain/langgraph";
import { RunnableConfig } from "@langchain/core/runnables";

async function executeStep(
  state: typeof PlanExecuteState.State,
  config?: RunnableConfig,
): Promise<Partial<typeof PlanExecuteState.State>> {
  const task = state.plan[0];
  const input = {
    messages: [new HumanMessage(task)],
  };
  const { messages } = await agentExecutor.invoke(input, config);

  return {
    pastSteps: [[task, messages[messages.length - 1].content.toString()]],
    plan: state.plan.slice(1),
  };
}

async function planStep(
  state: typeof PlanExecuteState.State,
): Promise<Partial<typeof PlanExecuteState.State>> {
  const plan = await planner.invoke({ objective: state.input });
  return { plan: plan.steps };
}

async function replanStep(
  state: typeof PlanExecuteState.State,
): Promise<Partial<typeof PlanExecuteState.State>> {
  const output = await replanner.invoke({
    input: state.input,
    plan: state.plan.join("\n"),
    pastSteps: state.pastSteps
      .map(([step, result]) => `${step}: ${result}`)
      .join("\n"),
  });
  const toolCall = output[0];

  if (toolCall.type == "response") {
    return { response: toolCall.args?.response };
  }

  return { plan: toolCall.args?.steps };
}

function shouldEnd(state: typeof PlanExecuteState.State) {
  return state.response ? "true" : "false";
}

const workflow = new StateGraph(PlanExecuteState)
  .addNode("planner", planStep)
  .addNode("agent", executeStep)
  .addNode("replan", replanStep)
  .addEdge(START, "planner")
  .addEdge("planner", "agent")
  .addEdge("agent", "replan")
  .addConditionalEdges("replan", shouldEnd, {
    true: END,
    false: "agent",
  });

// Finally, we compile it!
// This compiles it into a LangChain Runnable,
// meaning you can use it as you would any other runnable
const app = workflow.compile();

```

```
const config = { recursionLimit: 50 };
const inputs = {
  input: "what is the hometown of the 2024 Australian open winner?",
};

for await (const event of await app.stream(inputs, config)) {
  console.log(event);
}

```

```
{
  planner: {
    plan: [
      "Identify the winner of the 2024 Australian Open.",
      "Research the hometown of the identified winner."
    ]
  }
}
{
  agent: {
    plan: [ "Research the hometown of the identified winner." ],
    pastSteps: [
      [
        "Identify the winner of the 2024 Australian Open.",
        "The winner of the 2024 Australian Open men's singles title is Jannik Sinner of Italy. He achieved a "... 175 more characters
      ]
    ]
  }
}
{ replan: { plan: [ "Research the hometown of Jannik Sinner." ] } }
{
  agent: {
    plan: [],
    pastSteps: [
      [
        "Research the hometown of Jannik Sinner.",
        "Jannik Sinner's hometown is Sexten (also known as Sesto) in northern Italy. Located in the Dolomites"... 126 more characters
      ]
    ]
  }
}
{
  replan: {
    response: "The objective has been achieved. The hometown of the 2024 Australian Open winner, Jannik Sinner, is "... 47 more characters
  }
}

```

> #### See the LangSmith trace [here](https://smith.langchain.com/public/5bb4f582-d111-417d-ba91-29bcced272bb/r).[¶](#see-the-langsmith-trace-here "Permanent link")

Was this page helpful?

Thanks for your feedback!

Thanks for your feedback! Please help us improve this page by adding to the discussion below.

Back to top

[Previous

Hierarchical Agent Teams](../../multi_agent/hierarchical_agent_teams/)
[Next

Reflection](../../reflection/reflection/)

Copyright © 2025 LangChain, Inc | [Consent Preferences](#__consent)

Made with
[Material for MkDocs Insiders](https://squidfunk.github.io/mkdocs-material/)

#### Cookie consent

We use cookies to recognize your repeated visits and preferences, as well as to measure the effectiveness of our documentation and whether users find what they're searching for. **Clicking "Accept" makes our documentation better. Thank you!** ❤️

* Google Analytics
* GitHub

Accept
Reject