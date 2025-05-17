[Exa home page![light logo](https://mintlify.s3.us-west-1.amazonaws.com/exa-52/logo/light.png)![dark logo](https://mintlify.s3.us-west-1.amazonaws.com/exa-52/logo/dark.png)](/)

Search or ask...

* [Exa Search](https://exa.ai/search)
* [Log In](https://dashboard.exa.ai/login)
* [API Dashboard](https://dashboard.exa.ai/login?redirect=/)
* [API Dashboard](https://dashboard.exa.ai/login?redirect=/)

Search...

Navigation

Tutorials

Build a Retrieval Agent with LangGraph

[Documentation](/reference/getting-started)[Examples](/examples/exa-mcp)[Integrations](/integrations/lang-chain-docs)[SDKs](/sdks/python-sdk-specification)[Websets](/websets/overview)[Changelog](/changelog/auto-search-as-default)

* [Discord](https://discord.com/invite/HCShtBqbfV)
* [Blog](https://exa.ai/blog)

##### Live Demos

* [Exa MCP](/examples/exa-mcp)
* [Hallucination Detector](/examples/demo-hallucination-detector)
* [Writing Assistant](/examples/demo-exa-powered-writing-assistant)
* [Chat app](https://chat.exa.ai/)
* [Company researcher](https://companyresearcher.exa.ai/)
* [Demo twitter wrapped](/examples/demo-twitter-wrapped)

##### Tutorials

* [Live demo twitterx post retrieval](/examples/live-demo-twitterx-post-retrieval)
* [Hacker News Clone](/examples/live-demo-hacker-news-clone)
* [Building a News Summarizer](/examples/recent-news-summarizer)
* [Building a Hallucination Checker](/examples/identifying-hallucinations-with-exa)
* [RAG Q&A](/examples/exa-rag)
* [Company Analyst](/examples/company-analyst)
* [Exa Researcher - JavaScript](/examples/exa-researcher)
* [Exa Researcher - Python](/examples/exa-researcher-python)
* [Recruiting Agent](/examples/exa-recruiting-agent)
* [Phrase Filters: Niche Company Finder](/examples/niche-company-finder-with-phrase-filters)
* [Job Search with Exa](/examples/job-search-with-exa)
* [Build a Retrieval Agent with LangGraph](/examples/getting-started-with-rag-in-langgraph)
* [Structured Outputs with Instructor](/examples/getting-started-with-exa-in-instructor)

Tutorials

# Build a Retrieval Agent with LangGraph

---

## 

[​](#what-this-doc-covers)

What this doc covers

* Brief intro to LangGraph
* How to set up an agent in LangGraph with Exa search as a tool

---

## 

[​](#guide)

Guide

This guide will show you how you can define and use Exa search within the LangGraph framework. This framework provides a straightforward way for you to define an AI agent and for it to retrieve high-quality, semantically matched content via Exa search.

## 

[​](#brief-intro-to-langgraph)

Brief Intro to LangGraph

Before we dive into our implementation, a quick primer on the LangGraph framework.

LangGraph is a powerful tool for building complex LLM-based agents. It allows for cyclical workflows, gives you granular control, and offers built-in persistence. This means you can create reliable agents with intricate logic, pause and resume execution, and even incorporate human oversight.

Read more about [LangGraph here](https://langchain-ai.github.io/langgraph/)

## 

[​](#our-research-assistant-workflow)

Our Research Assistant Workflow

For our AI-powered research assistant, we’re leveraging LangGraph’s capabilities to create a workflow that combines an AI model (Claude) with a web search retrieval tool powered by Exa’s API, to fetch, find and analyze any documents (in this case research on climate tech). Here’s a visual representation of our workflow:

This diagram illustrates how our workflow takes advantage of LangGraph’s cycle support, allowing the agent to repeatedly use tools and make decisions until it has gathered sufficient information to provide a final response.

## 

[​](#let%E2%80%99s-break-down-what%E2%80%99s-happening-in-this-simple-workflow%3A)

Let’s break down what’s happening in this simple workflow:

1. We start at the Entry Point with a user query (e.g., “Latest research papers on climate technology”).
2. The Agent (our AI model) receives the query and decides what to do next.
3. If the Agent needs more information, it uses the Web Search Retriever Tool to search for relevant documents.
4. The Web Search Retriever Tool fetches information using Exa’s semantic search capabilities.
5. The Agent receives the fetched information and analyzes it.
6. This process repeats until the Agent has enough information to provide a final response.

In the following sections, we’ll explore the code implementation in detail, showing how we leverage LangGraph’s features to create this advanced research assistant.

## 

[​](#1-prerequisites-and-installation)

1\. Prerequisites and Installation

Before starting, ensure you have the required packages installed:

```shell
pip install langchain-anthropic langchain-exa langgraph

```

Make sure to set up your API keys. For LangChain libraries, the environment variables should be named `ANTHROPIC_API_KEY` and `EXA_API_KEY` for Anthropic and Exa keys respectively.

[Get your Exa API key](https://dashboard.exa.ai/api-keys) 

```bash
export ANTHROPIC_API_KEY=<your-api-key>

export EXA_API_KEY=<your-api-key>

```

## 

[​](#2-set-up-exa-search-as-a-langchain-tool)

2\. Set Up Exa Search as a LangChain Tool

After setting env variables, we can start configuring a search tool using `ExaSearchRetriever`. This tool ([read more here](https://api.python.langchain.com/en/latest/retrievers/langchain%5Fexa.retrievers.ExaSearchRetriever.html)) will help retrieve relevant documents based on a query.

First we need to import the required libraries:

```python
from typing import List
from langchain_exa import ExaSearchRetriever
from langchain_core.prompts import PromptTemplate
from langchain_core.runnables import RunnableLambda
from langchain_core.tools import tool

```

After we have imported the necessary libraries, we need to define and register a tool so that the agent know what tools it can use.

We use LangGraph `tool` decorator which you can read more about [here](https://python.langchain.com/v0.1/docs/modules/tools/custom%5Ftools/#tool-decorator). The decorator uses the function name as the tool name. The docstring provides the agent with a tool description.

The `retriever` is where we initialize the Exa search retriever and configure it with parameters such as `highlights=True`. You can read more about all the available parameters [here](https://docs.exa.ai/reference/python-sdk-specification#input-parameters-1).

```python
@tool
def retrieve_web_content(query: str) -> List[str]:
    """Function to retrieve usable documents for AI assistant"""
    # Initialize the Exa Search retriever
    retriever = ExaSearchRetriever(k=3, highlights=True, exa_api_key=EXA_API_KEY)

    # Define how to extract relevant metadata from the search results
    document_prompt = PromptTemplate.from_template(
        """
    <source>
        <url>{url}</url>
        <highlights>{highlights}</highlights>
    </source>
    """
    )

    # Create a chain to process the retrieved documents
    document_chain = (
        RunnableLambda(
            lambda document: {
                "highlights": document.metadata.get("highlights", "No highlights"),
                "url": document.metadata["url"],
            }
        )
        | document_prompt
    )

    # Execute the retrieval and processing chain
    retrieval_chain = retriever | document_chain.map()

    # Retrieve and return the documents
    documents = retrieval_chain.invoke(query)
    return documents

```

Here, `ExaSearchRetriever` is set to fetch 3 documents.

Then we use LangChain’s `PromptTemplate` to structure the results from Exa in a more AI friendly way. Creating and using this template is optional, but recommended. Read more about PromptTemplate ([here](https://python.langchain.com/v0.1/docs/modules/model%5Fio/prompts/quick%5Fstart/#).

We also use a RunnableLambda to extract necessary metadata (like URL and highlights) from the search results and format it using the prompt template.

After all of this we start the retrieval and processing chain and store the results in the `documents` variable which is returned.

## 

[​](#3-creating-a-toolchain-with-langgraph)

3\. Creating a Toolchain with LangGraph

Now let’s set up the complete toolchain using LangGraph.

```python
from typing import Literal
from langchain_anthropic import ChatAnthropic
from langchain_core.messages import HumanMessage
from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph import END, MessagesState, StateGraph
from langgraph.prebuilt import ToolNode

# Define and bind the AI model
model = ChatAnthropic(model="claude-3-5-sonnet-20240620", temperature=0, api_key=ANTHROPIC_API_KEY).bind_tools([retrieve_web_content])

```

Here, ChatAnthropic is set up with our Exa search tool, ready to generate responses based on the context provided.

## 

[​](#define-workflow-functions)

Define Workflow Functions

Create functions to manage the workflow:

```python
# Determine whether to continue or end
def should_continue(state: MessagesState) -> Literal["tools", END]:
    messages = state["messages"]
    last_message = messages[-1]
    return "tools" if last_message.tool_calls else END

# Function to generate model responses
def call_model(state: MessagesState):
    messages = state["messages"]
    response = model.invoke(messages)
    return {"messages": [response]}

```

## 

[​](#build-the-workflow-graph)

Build the Workflow Graph

```python
# Define the workflow graph
workflow = StateGraph(MessagesState)
workflow.add_node("agent", call_model)
workflow.add_node("tools", ToolNode([retrieve_web_content]))
workflow.set_entry_point("agent")
workflow.add_conditional_edges("agent", should_continue)
workflow.add_edge("tools", "agent")

# Initialize memory
checkpointer = MemorySaver()

# Compile the workflow into a runnable
app = workflow.compile(checkpointer=checkpointer)

```

This sets up a state machine that switches between generating responses and retrieving documents, with memory to maintain context (this is a key advantage of LangGraph).

## 

[​](#4-running-your-workflow)

4\. Running Your Workflow

We are approaching the finish line of our Exa-powered search agent.

## 

[​](#invoke-and-run)

Invoke and run

```python
final_state = app.invoke(
    {"messages": [HumanMessage(content="Latest research papers on climate technology")]},
    config={"configurable": {"thread_id": 44}},
)
print(final_state["messages"][-1].content)

```

Text output

```c
Thank you for your patience. I've retrieved some information about the latest research papers on climate technology. Let me summarize the key findings for you:

1. Research and Development Investment Strategy for Paris Climate Agreement:
   - Source: Nature Communications (2023)
   - URL: https://www.nature.com/articles/s41467-023-38620-4.pdf
   - Key points:
     - The study focuses on research and development (R&D) investment strategies to achieve the goals of the Paris Climate Agreement.
     - It highlights that some low-carbon options are still not available at large scale or are too costly.
     - The research emphasizes the importance of government decisions in incentivizing R&D for climate technologies.
     - Current assessments of climate neutrality often don't include research-driven innovation, which this paper addresses.

2. Impact of Green Innovation on Emissions:
   - Source: SSRN (Social Science Research Network)
   - URL: https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4212567
   - Key points:
     - This study examines the effect of green innovation on direct and indirect emissions across various sectors worldwide.
     - Surprisingly, it finds that green innovation does not significantly affect emissions in the short term (one year after filing a green patent) or medium term (three to five years after filing).
     - The research touches on concepts like the path dependence of innovation and the Jevons paradox in relation to green technology.

3. Comprehensive Study on Green Technology:
   - Source: Taylor & Francis Online
   - URL: https://www.tandfonline.com/doi/pdf/10.1080/1331677X.2023.2178017
   - Key points:
     - This paper provides a comprehensive review of literature on green technology.
     - It includes sections on research methods, measurement of variables, and data analysis techniques related to green technology.
     - The study offers policy recommendations and discusses limitations in the field of green technology research.

These papers represent some of the latest research in climate technology, covering topics from R&D investment strategies to the actual impact of green innovations on emissions. They highlight the complexity of the field, showing that while there's significant focus on developing new technologies, the real-world impact of these innovations may be more nuanced than expected.

Would you like more information on any specific aspect of these studies or climate technology in general?

```

## 

[​](#5-optional%3A-streaming-the-output)

(5\. Optional: Streaming the output)

```python
for chunk in app.stream({"messages": [HumanMessage(content="Latest research papers on climate technology")]}, config={"configurable": {"thread_id": 42}}):
    print(chunk, end="|", flush=True)

```

Or asynchronously:

```python
async def async_streamer():
  async for chunk in app.astream({"messages": [HumanMessage(content="Latest research papers on climate technology")]}, config={"configurable": {"thread_id": 42}}):
    print(chunk, end="|", flush=True)

async_streamer()

```

That’s it! You have now created a super powered search agent with the help of LangGraph and Exa. Modify the code to fit your needs and you can create an Exa powered agent for any task you can think of.

## 

[​](#full-code)

Full Code

```python
from typing import List, Literal

from langchain_anthropic import ChatAnthropic
from langchain_core.messages import HumanMessage
from langchain_core.prompts import PromptTemplate
from langchain_core.runnables import RunnableLambda
from langchain_core.tools import tool
from langchain_exa import ExaSearchRetriever
from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph import END, MessagesState, StateGraph
from langgraph.prebuilt import ToolNode


@tool
def retrieve_web_content(query: str) -> List[str]:
    """Function to retrieve usable documents for AI assistant"""
    # Initialize the Exa Search retriever
    retriever = ExaSearchRetriever(k=3, highlights=True)

    # Define how to extract relevant metadata from the search results
    document_prompt = PromptTemplate.from_template(
        """
    <source>
        <url>{url}</url>
        <highlights>{highlights}</highlights>
    </source>
    """
    )

    # Create a chain to process the retrieved documents
    document_chain = (
        RunnableLambda(
            lambda document: {
                "highlights": document.metadata.get("highlights", "No highlights"),
                "url": document.metadata["url"],
            }
        )
        | document_prompt
    )

    # Execute the retrieval and processing chain
    retrieval_chain = retriever | document_chain.map()

    # Retrieve and return the documents
    documents = retrieval_chain.invoke(query)
    return documents


# Define and bind the AI model
model = ChatAnthropic(model="claude-3-5-sonnet-20240620", temperature=0).bind_tools(
    [retrieve_web_content]
)


# Determine whether to continue or end
def should_continue(state: MessagesState) -> Literal["tools", END]:
    messages = state["messages"]
    last_message = messages[-1]
    return "tools" if last_message.tool_calls else END


# Function to generate model responses
def call_model(state: MessagesState):
    messages = state["messages"]
    response = model.invoke(messages)
    return {"messages": [response]}


# Define the workflow graph
workflow = StateGraph(MessagesState)
workflow.add_node("agent", call_model)
workflow.add_node("tools", ToolNode([retrieve_web_content]))
workflow.set_entry_point("agent")
workflow.add_conditional_edges("agent", should_continue)
workflow.add_edge("tools", "agent")

# Initialize memory
checkpointer = MemorySaver()

# Compile the workflow into a runnable
app = workflow.compile(checkpointer=checkpointer)

final_state = app.invoke(
    {
        "messages": [
            HumanMessage(content="Latest research papers on climate technology")
        ]
    },
    config={"configurable": {"thread_id": 44}},
)
print(final_state["messages"][-1].content)

```

Full code in Google Colab [here](https://docs.exa.ai/reference/getting-started-with-rag-in-langgraph)

[Job Search with Exa](/examples/job-search-with-exa)[Structured Outputs with Instructor](/examples/getting-started-with-exa-in-instructor)

[x](https://twitter.com/exaailabs)[discord](https://discord.com/invite/HCShtBqbfV)

[Powered by Mintlify](https://mintlify.com/preview-request?utm%5Fcampaign=poweredBy&utm%5Fmedium=referral&utm%5Fsource=docs.exa.ai)

On this page

* [What this doc covers](#what-this-doc-covers)
* [Guide](#guide)
* [Brief Intro to LangGraph](#brief-intro-to-langgraph)
* [Our Research Assistant Workflow](#our-research-assistant-workflow)
* [Let’s break down what’s happening in this simple workflow:](#let%E2%80%99s-break-down-what%E2%80%99s-happening-in-this-simple-workflow%3A)
* [1\. Prerequisites and Installation](#1-prerequisites-and-installation)
* [2\. Set Up Exa Search as a LangChain Tool](#2-set-up-exa-search-as-a-langchain-tool)
* [3\. Creating a Toolchain with LangGraph](#3-creating-a-toolchain-with-langgraph)
* [Define Workflow Functions](#define-workflow-functions)
* [Build the Workflow Graph](#build-the-workflow-graph)
* [4\. Running Your Workflow](#4-running-your-workflow)
* [Invoke and run](#invoke-and-run)
* [(5\. Optional: Streaming the output)](#5-optional%3A-streaming-the-output)
* [Full Code](#full-code)