[Exa home page![light logo](https://mintlify.s3.us-west-1.amazonaws.com/exa-52/logo/light.png)![dark logo](https://mintlify.s3.us-west-1.amazonaws.com/exa-52/logo/dark.png)](/)

Search or ask...

* [Exa Search](https://exa.ai/search)
* [Log In](https://dashboard.exa.ai/login)
* [API Dashboard](https://dashboard.exa.ai/login?redirect=/)
* [API Dashboard](https://dashboard.exa.ai/login?redirect=/)

Search...

Navigation

RAG Quick Start Guide

RAG with LangChain

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

# RAG with LangChain

How to use Exa’s integration with LangChain to perform RAG.

---

LangChain is a framework for building applications that combine LLMs with data, APIs and other tools. In this guide, we’ll go over how to use Exa’s LangChain integration to perform RAG with the following steps:

1. Set up Exa’s LangChain integration and use Exa to retrieve relevant content
2. Connect this content to a toolchain that uses OpenAI’s LLM for generation

 See a YouTube tutorial of a very similar setup by the LangChain team [here](https://www.youtube.com/watch?v=dA1cHGACXCo). 

 See the full reference from LangChain [here](https://python.langchain.com/docs/integrations/providers/exa%5Fsearch/). 

---

## 

[​](#get-started)

Get Started

1

Pre-requisites and installation

Install the core OpenAI and Exa LangChain libraries

Bash

```Bash
pip install langchain-openai langchain-exa

```

 Ensure API keys are initialized properly. For LangChain libraries, the environment variable names are `OPENAI_API_KEY` and `EXA_API_KEY` for OpenAI and Exa keys respectively. 

[Get your Exa API key](https://dashboard.exa.ai/api-keys)

2

Use Exa Search to power a LangChain Tool

Set up a Retriever tool using `ExaSearchRetriever`. This is a retriever that connects to Exa Search to find relevant documents via semantic search. First import the relevant libraries and instantiate the ExaSearchRetriever.

Python

```Python
# load the environment variables
import os
from dotenv import load_dotenv
load_dotenv()
from langchain_exa import ExaSearchRetriever
from langchain_core.prompts import PromptTemplate
from langchain_core.runnables import RunnableLambda

# Define our retriever to use Exa Search, grabbing 3 results and parsing highlights from each result
retriever = ExaSearchRetriever(api_key=os.getenv("EXA_API_KEY"), k=3, highlights=True)

```

3

Create a prompt template (optional)

We use a LangChain [PromptTemplate](https://python.langchain.com/v0.1/docs/modules/model%5Fio/prompts/quick%5Fstart/#prompttemplate) to define a template of placeholder to parse out URLs and Highlights from the Exa retriever.

Python

```Python
# Define a document prompt template using XML-like stags
document_prompt = PromptTemplate.from_template("""
<source>
    <url>{url}</url>
    <highlights>{highlights}</highlights>
</source>
""")

```

4

Parse the URL and content from Exa results

We use a [Runnable Lambda](https://api.python.langchain.com/en/latest/runnables/langchain%5Fcore.runnables.base.RunnableLambda.html) to parse out the URL and Highlights attributes from the Exa Search results then pass this to the prompt template above

Python

```Python
# Create a Runnable Lambda that parses highlights and URL attributes from the retriever and passes to our document prompt from above
document_chain = RunnableLambda(
    lambda document: {
        "highlights": document.metadata["highlights"],
        "url": document.metadata["url"]
    }
) | document_prompt

```

5

Join Exa results and content for retrieval

Complete the retrieval chain by stitching together the Exa retriever, the parser and a short lambda function - this is crucial for passing the result as a single string as context for the LLM in the next step.

Python

```Python
# Define the retrieval chain - Exa search results => grab attributes and parse into XML => join into a single string to feed as context in next steps
retrieval_chain = retriever | document_chain.map() | (lambda docs: "\n".join([i.text for i in docs]))

```

6

Set up the rest of the toolchain including OpenAI for generation

In this step, we define the system prompt with Query and Context template inputs to be grabbed from the user and Exa Search respectively. First, once again import the relevant libraries and components from LangChains libraries

Python

```Python
from langchain_core.runnables import RunnablePassthrough, RunnableParallel
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI
from langchain_core.output_parsers import StrOutputParser

```

Then we define a generation prompt - the prompt template that is used with context from Exa to perform RAG.

Python

```Python
# Define core prompt template
generation_prompt = ChatPromptTemplate.from_messages([
    ("system", "You are an expert research assistant. You use xml-formatted context to research people's questions."),
    ("human", """
Please answer the following query based on the provided context. Please cite your sources at the end of your response.:

Query: {query}
---
<context>
{context}
</context>
""")
])

```

We set the generation [LLM to OpenAI](https://python.langchain.com/v0.1/docs/integrations/chat/openai/), then connect everything with a [RunnableParallel](https://python.langchain.com/v0.1/docs/expression%5Flanguage/primitives/parallel/) parallel connection. The generation prompt, containing the query and context, is then passed to the LLM and [parsed for better output representation](https://api.python.langchain.com/en/latest/output%5Fparsers/langchain%5Fcore.output%5Fparsers.string.StrOutputParser.html).

Python

```Python
# Use OpenAI for generation
llm = ChatOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Simple string parsing for trhe output
output_parser = StrOutputParser()

# Connect the chain, including parallel connection for query from user and context from Exa retriever chain in step 2.
chain = RunnableParallel({
    "query": RunnablePassthrough(),
    "context": retrieval_chain,
}) | generation_prompt | llm | output_parser

```

7

Running the full RAG toolchain

Let’s [invoke](https://python.langchain.com/v0.1/docs/expression%5Flanguage/interface/#invoke) the chain:

Python

```Python
result = chain.invoke("Latest research on climate change innovation")

print(result)

```

And have a look at the output (newlines parsed):

Stdout

```Stdout
'Based on the provided context, the latest research on climate change innovation reveals several important findings:
1. Innovation in response to climate change: A study examined how innovation responds to climate change by analyzing a panel dataset of 70 countries. The study found that the number of climate-change-related innovations is positively correlated with increasing levels of carbon dioxide emissions from gas and liquid fuels, mainly from natural gases and petroleum. However, it is negatively correlated with increases in carbon dioxide emissions from solid fuel consumption, mainly from coal, and other greenhouse gas emissions. The research also highlighted that government investment does not always influence decisions to develop and patent climate technologies. This study contributes to the environmental innovation literature by providing insights on how innovation reacts to changes in major climate change factors.
2. Climate tech funding and attention: During the period of 2010-2022, outside of the US, China, EU, and India, only 8% of total climate venture capital activity came from the rest of the world. This concentration of funding and attention in specific regions may be hindering the reach of climate tech solutions to low-income communities and developing countries, which are already feeling the effects of climate change but lack the necessary resources to address them effectively.
3. Research funding allocation: A study from the University of Sussex Business School analyzed research funding for climate and energy research from 1990 to 2020. The research found that 36% of funding was allocated to climate adaptation, while 28% went to studying how to clean up the energy system. Other significant shares of funding were allocated to transport and mobility (13%), geoengineering (12%), and industrial decarbonization (11%). The majority of the funding went to researchers in wealthy, Western countries, which may not be the most vulnerable to the immediate impacts of climate change.
Sources:
1. Study on innovation response to climate change: https://www.sciencedirect.com/science/article/pii/S0040162516302542
2. Climate tech funding and attention: https://www.sbs.ox.ac.uk/oxford-answers/climate-tech-opportunity-save-planet
3. Research funding allocation for climate and energy research: https://www.protocol.com/bulletins/climate-research-funding-adaptation'

```

8

Optionally, stream the output of the chain

Optionally, you may

Python

```Python
for chunk in chain.stream("Latest research on climate change innovation"):
  print(chunk, end="|", flush=True)

# Or asynchronously
async def run_async():
  async for chunk in chain.astream("Latest research on climate change innovation"):
    print(chunk, end="|", flush=True)

import asyncio
asyncio.run(run_async())

```

Outputs, in a stream - [click here](https://python.langchain.com/v0.1/docs/expression%5Flanguage/streaming/) to learn more about the .stream method and other options, including handling of chunks and how to think about further parsing outputs:

Streamed text output

```Streamed
`|Based| on| the| provided| context|,| the| latest| research| on| climate| change| innovation| indicates| several| key| insights|:

|1|.| The| concentration| of| funding| and| attention| in| countries| like| the| US|,| China|,| EU|,| and| India| has| led| to| a| lack| of| climate| tech| ecosystem| development| in| other| parts| of| the| world|.| This| has| resulted| in| low|-income| communities| and| developing| countries| being| under|-equipped| to| address| the| effects| of| climate| change|.
|(Source|:| Oxford| Answers| -| https|://|www|.s|bs|.|ox|.ac|.uk|/|ox|ford|-|answers|/cl|imate|-tech|-op|portunity|-save|-|planet|)

|2|.| A| study| conducted| using| econ|ometric| methods| on| a| panel| dataset| of| |70| countries| found| that| the| number| of| climate|-change|-related| innovations| is| positively| responding| to| increasing| levels| of| carbon| dioxide| emissions| from| gas| and| liquid| fuels|,| but| negatively| to| increases| in| carbon| dioxide| emissions| from| solid| fuel| consumption| and| other| greenhouse| gas| emissions|.| Government| investment| does| not| always| influence| decisions| to| develop| and| patent| climate| technologies|.
|(Source|:| Science|Direct| -| https|://|www|.s|ci|enced|irect|.com|/sc|ience|/article|/pi|i|/S|004|016|251|630|254|2|)

|3|.| Additionally|,| insights| into| climate| change| technology| transfer| and| policy| implications| can| be| found| in| the| environmental|-in|novation| literature|,| contributing| to| a| better| understanding| of| how| innovation| reacts| to| changes| in| major| climate| change| factors|.
|(Source|:| Nature| -| https|://|www|.n|ature|.com|/articles|/n|climate|230|5|)

|These| sources| provide| valuable| information| on| the| current| state| of| climate| change| innovation| research| and| its| implications| for| addressing| the| global| challenge| of| climate| change|.|||Based| on| the| provided| context|,| here| are| the| responses| to| the| query|:

|1|.| Elon| Musk| is| known| for| being| the| richest| person| in| the| world| and| having| some| unusual| and| expensive| hobbies|.| One| of| his| hobbies| involves| pretending| to| acquire| public| companies|,| which| he| seems| to| find| fun|.| This| behavior| has| been| highlighted| in| the| article| mentioned| in| the| source|:| "|Programming| note|:| U|gh|,| here| we| are| again|,| huh|?| Oh| Elon| I| think| it| is| helpful| to| start| with| the| big| picture|."| (|Source|:| Bloomberg| Opinion|)

|2|.| Charles| E|.| No|ad| was| known| for| his| remarkable| abilities|,| such| as| being| able| to| discern| whether| a| period| at| the| end| of| a| sentence| was| in| it|al|ics| or| not|.| He| was| a| valuable| support| to| Christopher| Tolkien| and| contributed| an| essay| titled| "|On| the| Construction| of| the| Sil|mar|illion|,"| which| speculated| on| what| J|.R|.R|.| Tolkien| would| have| included| in| The| Sil|mar|illion| had| he| finished| it|.| This| information| is| detailed| in| the| source|:| "|He| could| quite| literally| tell| whether| a| period| (|the| full| stop| at| the| end| of| a| sentence|)| was| in| it|al|ics| or| not|."| (|Source|:| Kal|im|ac| Blog|)

|3|.| The| challenges| and| limitations| of| automated| technology|,| specifically| in| the| context| of| taxi| services|,| are| highlighted| in| the| source|:| "|There|'s| just| a| level| of| necessary| flexibility| given| the| reality| of| our| built| environment| that| the| robot| brains| aren|'t| going| to| manage|."| The| source| discusses| an| incident| where| a| robot| taxi|,| named| Brown|ie|,| did| not| respond| to| a| wave| to| pick| up| passengers|,| leading| them| to| walk| along| an| active| traffic| lane| to| reach| it|.| (|Source|:| Es|chat|on| Blog|)

|Sources|:
|1|.| Bloomberg| Opinion| -| https|://|www|.b|loomberg|.com|/op|inion|/articles|/|202|2|-|07|-|09|/|elon|-s|-out|
|2|.| Kal|im|ac| Blog| -| https|://|kal|im|ac|.blogspot|.com|/|202|3|/|07|/|char|les|-e|-no|ad|.html|
|3|.| Es|chat|on| Blog| -| https|://|www|.es|chat|on|blog|.com|/|202|2|/|07|/pay|-me|-for|-my|-gen|ius|.html||

```

As you can see, the output generation is enriched with the context of our Exa Search query result!

[RAG with Exa and OpenAI](/reference/rag-quickstart)[OpenAI Exa Wrapper](/reference/openai)

[x](https://twitter.com/exaailabs)[discord](https://discord.com/invite/HCShtBqbfV)

[Powered by Mintlify](https://mintlify.com/preview-request?utm%5Fcampaign=poweredBy&utm%5Fmedium=referral&utm%5Fsource=docs.exa.ai)

On this page

* [Get Started](#get-started)