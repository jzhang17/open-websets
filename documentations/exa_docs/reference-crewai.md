[Exa home page![light logo](https://mintlify.s3.us-west-1.amazonaws.com/exa-52/logo/light.png)![dark logo](https://mintlify.s3.us-west-1.amazonaws.com/exa-52/logo/dark.png)](/)

Search or ask...

* [Exa Search](https://exa.ai/search)
* [Log In](https://dashboard.exa.ai/login)
* [API Dashboard](https://dashboard.exa.ai/login?redirect=/)
* [API Dashboard](https://dashboard.exa.ai/login?redirect=/)

Search...

Navigation

RAG Quick Start Guide

CrewAI agents with Exa

[Documentation](/reference/getting-started)[Examples](/examples/exa-mcp)[Integrations](/integrations/lang-chain-docs)[SDKs](/sdks/python-sdk-specification)[Websets](/websets/overview)[Changelog](/changelog/auto-search-as-default)

* [Discord](https://discord.com/invite/HCShtBqbfV)
* [Blog](https://exa.ai/blog)

##### Getting Started

* [Overview](/reference/getting-started)
* [Quickstart](/reference/quickstart)

##### API Reference

* [POSTSearch](/reference/search)
* [POSTGet contents](/reference/get-contents)
* [POSTFind similar links](/reference/find-similar-links)
* [POSTAnswer](/reference/answer)
* [OpenAPI Specification](/reference/openapi-spec)

##### RAG Quick Start Guide

* [RAG with Exa and OpenAI](/reference/rag-quickstart)
* [RAG with LangChain](/reference/langchain)
* [OpenAI Exa Wrapper](/reference/openai)
* [CrewAI agents with Exa](/reference/crewai)
* [RAG with LlamaIndex](/reference/llamaindex)
* [Tool calling with GPT](/reference/tool-calling-with-gpt4o)
* [Tool calling with Claude](/reference/tool-calling-with-claude)
* [OpenAI Chat Completions](/reference/chat-completions)
* [OpenAI Responses API](/reference/openai-responses-api-with-exa)

##### Concepts

* [How Exa Search Works](/reference/how-exa-search-works)
* [The Exa Index](/reference/the-exa-index)
* [Contents retrieval with Exa API](/reference/contents-retrieval-with-exa-api)
* [Exa's Capabilities Explained](/reference/exas-capabilities-explained)
* [FAQs](/reference/faqs)
* [Crawling Subpages with Exa](/reference/crawling-subpages-with-exa)
* [Exa LiveCrawl](/reference/should-we-use-livecrawl)

##### Admin

* [Setting Up and Managing Your Team](/reference/setting-up-team)
* [Rate Limits](/reference/rate-limits)
* [Enterprise Documentation & Security ](/reference/security)

RAG Quick Start Guide

# CrewAI agents with Exa

Learn how to add Exa retrieval capabilities to your CrewAI agents.

---

[CrewAI](https://crewai.com/) is a framework for orchestrating AI agents that work together to accomplish complex tasks. In this guide, we’ll create a crew of two agents that generate a newsletter based on Exa’s search results. We’ll go over how to:

1. Create a custom Exa-powered CrewAI tool
2. Set up agents and assign them specific roles that use the Exa-powered search tool
3. Organize the agents into a crew that will write a newsletter

---

## 

[​](#get-started)

Get Started

1

Pre-requisites and installation

Install the crewAI core, crewAI tools and Exa Python SDK libraries.

Python

```Python
pip install crewai 'crewai[tools]' exa_py

```

2

Defining a custom Exa-based tool in crewAI

We set up a [custom tool](https://docs.crewai.com/concepts/tools) using the crewAI [@tool decorator ](https://docs.crewai.com/concepts/tools#utilizing-the-tool-decorator). Within the tool, we can initialize the Exa class from the [Exa Python SDK](https://github.com/exa-labs/exa-py), make a request, and return a parsed out result.

Python

```Python
from crewai_tools import tool
from exa_py import Exa
import os

exa_api_key = os.getenv("EXA_API_KEY")

@tool("Exa search and get contents")
def search_and_get_contents_tool(question: str) -> str:
    """Tool using Exa's Python SDK to run semantic search and return result highlights."""

    exa = Exa(exa_api_key)

    response = exa.search_and_contents(
        question,
        type="neural",
        num_results=3,
        highlights=True
    )

    parsedResult = ''.join([
      f'<Title id={idx}>{eachResult.title}</Title>
      f'<URL id={idx}>{eachResult.url}</URL>
      f'<Highlight id={idx}>{"".join(eachResult.highlights)}</Highlight>'
      for (idx, eachResult) in enumerate(response.results)
    ])

    return parsedResult

```

 Make sure your API keys are initialized properly. For this demonstration, the environment variable names are `OPENAI_API_KEY` and `EXA_API_KEY` for OpenAI and Exa keys respectively. 

[Get your Exa API key](https://dashboard.exa.ai/api-keys)

3

Setting up CrewAI agent

Import the relevant crewAI modules. Then, define `exa_tools` to reference the custom search method we defined above.

Python

```Python
from crewai import Task, Crew, Agent

exa_tools = search_and_get_contents_tool

```

We then set up[ two agents](https://docs.crewai.com/concepts/Agents/) and place them in a [crew together](https://docs.crewai.com/concepts/Crews/):

* One to research with Exa (providing the custom tool defined above)
* Another to write a newsletter as an output (using an LLM)

Python

```Python
# Creating a senior researcher agent with memory and verbose mode
researcher = Agent(
  role='Researcher',
  goal='Get the latest research on {topic}',
  verbose=True,
  memory=True,
  backstory=(
    "Driven by curiosity, you're at the forefront of"
    "innovation, eager to explore and share knowledge that could change"
    "the world."
  ),
  tools=[exa_tools],
  allow_delegation=False
)

article_writer = Agent(
  role='Researcher',
  goal='Write a great newsletter article on {topic}',
  verbose=True,
  memory=True,
  backstory=(
    "Driven by a love of writing and passion for"
    "innovation, you are eager to share knowledge with"
    "the world."
  ),
  tools=[exa_tools],
  allow_delegation=False
)

```

4

Defining tasks for the agents

Next, we’ll define [tasks](https://docs.crewai.com/concepts/Tasks/) for each agent and create the crew overall using all of the components we’ve set up above.

Python

```Python
`research_task = Task(
  description=(
    "Identify the latest research in {topic}."
    "Your final report should clearly articulate the key points,"
  ),
  expected_output='A comprehensive 3 paragraphs long report on the {topic}.',
  tools=[exa_tools],
  agent=researcher,
)

write_article = Task(
  description=(
    "Write a newsletter article on the latest research in {topic}."
    "Your article should be engaging, informative, and accurate."
    "The article should address the audience with a greeting to the newsletter audience \"Hi readers!\", plus a similar signoff"
  ),
  expected_output='A comprehensive 3 paragraphs long newsletter article on the {topic}.',
  agent=article_writer,
)

crew = Crew(
  agents=[researcher, article_writer],
  tasks=[research_task, write_article],
  memory=True,
  cache=True,
  max_rpm=100,
  share_crew=True
)

```

5

Kicking off the crew

Finally, we kick off the crew by providing a research topic as our input query.

Python

```Python
response = crew.kickoff(inputs={'topic': 'Latest AI research'})

print(response)

```

6

Output

As you can see, Exa’s search results enriched the output generation!

Stdout

```Stdout
`[... Prior output truncated ...]

> Finished chain.
Hi readers!

As we step into the promising arena of 2024, we bring you some of the most significant advancements in the field of AI research. The year witnessed a considerable focus on the development of AI agents and LLMs (Large Language Models). Adept, a frontrunner in the space, showcased an agent that can find apartments on Redfin, input information into Salesforce, and interact with Google Sheets using natural language. While there is no clear winner on the commercial front yet, this development promises a future where AI can perform tasks for us.

The year also saw a continued focus on LLMs, with efforts directed towards matching the text performance of GPT-4 with smaller models. An interesting outcome of these efforts was the Falcon 7B model, which matches the performance of the 8B PaLM model. This model, interestingly, uses 100% web data for pretraining. It's worth mentioning that LLMs were also used to generate imitation models, which mimic the style of upstream LLMs. One study found that these models are highly rated by crowd workers.

In the field of computer vision, there were numerous developments. One noteworthy mention is the ASSET paper that introduced an architecture capable of modifying an input high-resolution image according to a user's edits on its semantic segmentation map. This advancement points to the possibility of synthesizing interesting phenomena in scenes, which has the potential to revolutionize the way we interact with digital imagery.

As we continue to explore the ever-evolving landscape of AI, we hope to bring you more such exciting updates. Stay tuned and until next time, keep exploring!

Best,
[Your Name]

```

[OpenAI Exa Wrapper](/reference/openai)[RAG with LlamaIndex](/reference/llamaindex)

[x](https://twitter.com/exaailabs)[discord](https://discord.com/invite/HCShtBqbfV)

[Powered by Mintlify](https://mintlify.com/preview-request?utm%5Fcampaign=poweredBy&utm%5Fmedium=referral&utm%5Fsource=docs.exa.ai)

On this page

* [Get Started](#get-started)