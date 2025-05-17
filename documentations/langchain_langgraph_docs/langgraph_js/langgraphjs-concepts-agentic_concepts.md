[ Skip to content](#agent-architectures) 

**Help us build the JS tools that power AI apps at companies like Replit, Uber, LinkedIn, GitLab, and more. [Join our team!](https://jobs.ashbyhq.com/langchain/05efa205-8560-43fd-bfcc-3f7697561cfb?utm%5Fsource=https%3A%2F%2Flangchain-ai.github.io%2Flanggraphjs%2F&utm%5Fcampaign=langgraphjs%5Fdocs)** 

[ ![logo](../../static/wordmark_dark.svg) ![logo](../../static/wordmark_light.svg) ](../..) 

 Agent architectures 

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
                              * Agent architectures [  Agent architectures ](./)  
                               Table of contents  
                                             * [  Router ](#router)  
                                                               * [  Structured Output ](#structured-output)  
                                             * [  Tool calling agent ](#tool-calling-agent)  
                                                               * [  Tool calling ](#tool-calling)  
                                                               * [  Memory ](#memory)  
                                                               * [  Planning ](#planning)  
                                                               * [  ReAct implementation ](#react-implementation)  
                                             * [  Custom agent architectures ](#custom-agent-architectures)  
                                                               * [  Human-in-the-loop ](#human-in-the-loop)  
                                                               * [  Parallelization ](#parallelization)  
                                                               * [  Subgraphs ](#subgraphs)  
                                                               * [  Reflection ](#reflection)  
                              * [  Multi-agent Systems ](../multi%5Fagent/)  
                              * [  Human-in-the-loop ](../human%5Fin%5Fthe%5Floop/)  
                              * [  Persistence ](../persistence/)  
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
* [  Router ](#router)  
   * [  Structured Output ](#structured-output)
* [  Tool calling agent ](#tool-calling-agent)  
   * [  Tool calling ](#tool-calling)  
   * [  Memory ](#memory)  
   * [  Planning ](#planning)  
   * [  ReAct implementation ](#react-implementation)
* [  Custom agent architectures ](#custom-agent-architectures)  
   * [  Human-in-the-loop ](#human-in-the-loop)  
   * [  Parallelization ](#parallelization)  
   * [  Subgraphs ](#subgraphs)  
   * [  Reflection ](#reflection)

1. [  LangGraph ](../..)
2. [  Guides ](../../how-tos/)
3. [  Concepts ](../)
4. [  LangGraph ](../../concepts#langgraph)

# Agent architectures[¶](#agent-architectures "Permanent link")

Many LLM applications implement a particular control flow of steps before and / or after LLM calls. As an example, [RAG](https://github.com/langchain-ai/rag-from-scratch) performs retrieval of relevant documents to a question, and passes those documents to an LLM in order to ground the model's response.

Instead of hard-coding a fixed control flow, we sometimes want LLM systems that can pick its own control flow to solve more complex problems! This is one definition of an [agent](https://blog.langchain.dev/what-is-an-agent/): _an agent is a system that uses an LLM to decide the control flow of an application._ There are many ways that an LLM can control application:

* An LLM can route between two potential paths
* An LLM can decide which of many tools to call
* An LLM can decide whether the generated answer is sufficient or more work is needed

As a result, there are many different types of [agent architectures](https://blog.langchain.dev/what-is-a-cognitive-architecture/), which given an LLM varying levels of control.

![Agent Types](../img/agent_types.png)

## Router[¶](#router "Permanent link")

A router allows an LLM to select a single step from a specified set of options. This is an agent architecture that exhibits a relatively limited level of control because the LLM usually governs a single decision and can return a narrow set of outputs. Routers typically employ a few different concepts to achieve this.

### Structured Output[¶](#structured-output "Permanent link")

Structured outputs with LLMs work by providing a specific format or schema that the LLM should follow in its response. This is similar to tool calling, but more general. While tool calling typically involves selecting and using predefined functions, structured outputs can be used for any type of formatted response. Common methods to achieve structured outputs include:

1. Prompt engineering: Instructing the LLM to respond in a specific format.
2. Output parsers: Using post-processing to extract structured data from LLM responses.
3. Tool calling: Leveraging built-in tool calling capabilities of some LLMs to generate structured outputs.

Structured outputs are crucial for routing as they ensure the LLM's decision can be reliably interpreted and acted upon by the system. Learn more about [structured outputs in this how-to guide](https://js.langchain.com/docs/how%5Fto/structured%5Foutput/).

## Tool calling agent[¶](#tool-calling-agent "Permanent link")

While a router allows an LLM to make a single decision, more complex agent architectures expand the LLM's control in two key ways:

1. Multi-step decision making: The LLM can control a sequence of decisions rather than just one.
2. Tool access: The LLM can choose from and use a variety of tools to accomplish tasks.

[ReAct](https://arxiv.org/abs/2210.03629) is a popular general purpose agent architecture that combines these expansions, integrating three core concepts.

1. `Tool calling`: Allowing the LLM to select and use various tools as needed.
2. `Memory`: Enabling the agent to retain and use information from previous steps.
3. `Planning`: Empowering the LLM to create and follow multi-step plans to achieve goals.

This architecture allows for more complex and flexible agent behaviors, going beyond simple routing to enable dynamic problem-solving across multiple steps. You can use it with [createReactAgent](/langgraphjs/reference/functions/langgraph%5Fprebuilt.createReactAgent.html).

### Tool calling[¶](#tool-calling "Permanent link")

Tools are useful whenever you want an agent to interact with external systems. External systems (e.g., APIs) often require a particular input schema or payload, rather than natural language. When we bind an API, for example, as a tool we given the model awareness of the required input schema. The model will choose to call a tool based upon the natural language input from the user and it will return an output that adheres to the tool's schema.

[Many LLM providers support tool calling](https://js.langchain.com/docs/integrations/chat/) and [tool calling interface](https://blog.langchain.dev/improving-core-tool-interfaces-and-docs-in-langchain/) in LangChain is simple: you can define a tool schema, and pass it into `ChatModel.bindTools([tool])`.

![Tools](../img/tool_call.png)

### Memory[¶](#memory "Permanent link")

Memory is crucial for agents, enabling them to retain and utilize information across multiple steps of problem-solving. It operates on different scales:

1. Short-term memory: Allows the agent to access information acquired during earlier steps in a sequence.
2. Long-term memory: Enables the agent to recall information from previous interactions, such as past messages in a conversation.

LangGraph provides full control over memory implementation:

* [State](../low%5Flevel/#state): User-defined schema specifying the exact structure of memory to retain.
* [Checkpointers](../persistence/): Mechanism to store state at every step across different interactions.

This flexible approach allows you to tailor the memory system to your specific agent architecture needs. For a practical guide on adding memory to your graph, see [this tutorial](/langgraphjs/how-tos/persistence).

Effective memory management enhances an agent's ability to maintain context, learn from past experiences, and make more informed decisions over time.

### Planning[¶](#planning "Permanent link")

In the ReAct architecture, an LLM is called repeatedly in a while-loop. At each step the agent decides which tools to call, and what the inputs to those tools should be. Those tools are then executed, and the outputs are fed back into the LLM as observations. The while-loop terminates when the agent decides it is not worth calling any more tools.

### ReAct implementation[¶](#react-implementation "Permanent link")

There are several differences between this paper and the pre-built [createReactAgent](/langgraphjs/reference/functions/langgraph%5Fprebuilt.createReactAgent.html) implementation:

* First, we use [tool-calling](#tool-calling) to have LLMs call tools, whereas the paper used prompting + parsing of raw output. This is because tool calling did not exist when the paper was written, but is generally better and more reliable.
* Second, we use messages to prompt the LLM, whereas the paper used string formatting. This is because at the time of writing, LLMs didn't even expose a message-based interface, whereas now that's the only interface they expose.
* Third, the paper required all inputs to the tools to be a single string. This was largely due to LLMs not being super capable at the time, and only really being able to generate a single input. Our implementation allows for using tools that require multiple inputs.
* Fourth, the paper only looks at calling a single tool at the time, largely due to limitations in LLMs performance at the time. Our implementation allows for calling multiple tools at a time.
* Finally, the paper asked the LLM to explicitly generate a "Thought" step before deciding which tools to call. This is the "Reasoning" part of "ReAct". Our implementation does not do this by default, largely because LLMs have gotten much better and that is not as necessary. Of course, if you wish to prompt it do so, you certainly can.

## Custom agent architectures[¶](#custom-agent-architectures "Permanent link")

While routers and tool-calling agents (like ReAct) are common, [customizing agent architectures](https://blog.langchain.dev/why-you-should-outsource-your-agentic-infrastructure-but-own-your-cognitive-architecture/) often leads to better performance for specific tasks. LangGraph offers several powerful features for building tailored agent systems:

### Human-in-the-loop[¶](#human-in-the-loop "Permanent link")

Human involvement can significantly enhance agent reliability, especially for sensitive tasks. This can involve:

* Approving specific actions
* Providing feedback to update the agent's state
* Offering guidance in complex decision-making processes

Human-in-the-loop patterns are crucial when full automation isn't feasible or desirable. Learn more in our [human-in-the-loop guide](../human%5Fin%5Fthe%5Floop/).

### Parallelization[¶](#parallelization "Permanent link")

Parallel processing is vital for efficient multi-agent systems and complex tasks. LangGraph supports parallelization through its [Send](../low%5Flevel/#send) API, enabling:

* Concurrent processing of multiple states
* Implementation of map-reduce-like operations
* Efficient handling of independent subtasks

For practical implementation, see our [map-reduce tutorial](/langgraphjs/how-tos/map-reduce/).

### Subgraphs[¶](#subgraphs "Permanent link")

[Subgraphs](../low%5Flevel/#subgraphs) are essential for managing complex agent architectures, particularly in [multi-agent systems](../multi%5Fagent/). They allow:

* Isolated state management for individual agents
* Hierarchical organization of agent teams
* Controlled communication between agents and the main system

Subgraphs communicate with the parent graph through overlapping keys in the state schema. This enables flexible, modular agent design. For implementation details, refer to our [subgraph how-to guide](../../how-tos/subgraph/).

### Reflection[¶](#reflection "Permanent link")

Reflection mechanisms can significantly improve agent reliability by:

1. Evaluating task completion and correctness
2. Providing feedback for iterative improvement
3. Enabling self-correction and learning

While often LLM-based, reflection can also use deterministic methods. For instance, in coding tasks, compilation errors can serve as feedback. This approach is demonstrated in [this video using LangGraph for self-corrective code generation](https://www.youtube.com/watch?v=MvNdgmM7uyc).

By leveraging these features, LangGraph enables the creation of sophisticated, task-specific agent architectures that can handle complex workflows, collaborate effectively, and continuously improve their performance.

 Was this page helpful? 

 Thanks for your feedback!

 Thanks for your feedback! Please help us improve this page by adding to the discussion below.

 Back to top 

[  Previous  LangGraph Glossary ](../low%5Flevel/) [  Next  Multi-agent Systems ](../multi%5Fagent/) 

 Copyright © 2025 LangChain, Inc | [Consent Preferences](#%5F%5Fconsent) 

 Made with[ Material for MkDocs Insiders](https://squidfunk.github.io/mkdocs-material/) 

[ ](https://langchain-ai.github.io/langgraph/ "langchain-ai.github.io") [ ](https://github.com/langchain-ai/langgraphjs "github.com") [ ](https://twitter.com/LangChainAI "twitter.com") 

#### Cookie consent

We use cookies to recognize your repeated visits and preferences, as well as to measure the effectiveness of our documentation and whether users find what they're searching for. **Clicking "Accept" makes our documentation better. Thank you!** ❤️

* Google Analytics
* GitHub

Accept Reject 