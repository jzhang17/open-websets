Exa Researcher - Python - Exa

[Exa home page![light logo](https://mintlify.s3.us-west-1.amazonaws.com/exa-52/logo/light.png)![dark logo](https://mintlify.s3.us-west-1.amazonaws.com/exa-52/logo/dark.png)](/)

Search or ask...

* [Exa Search](https://exa.ai/search)
* [Log In](https://dashboard.exa.ai/login)
* [API Dashboard](https://dashboard.exa.ai/login?redirect=/)
* [API Dashboard](https://dashboard.exa.ai/login?redirect=/)

Search...

Navigation

Tutorials

Exa Researcher - Python

[Documentation](/reference/getting-started)[Examples](/examples/exa-mcp)[Integrations](/integrations/lang-chain-docs)[SDKs](/sdks/python-sdk-specification)[Websets](/websets/overview)[Changelog](/changelog/auto-search-as-default)

- [Discord](https://discord.com/invite/HCShtBqbfV)
- [Blog](https://exa.ai/blog)

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

# Exa Researcher - Python

---

## [​](#what-this-doc-covers) What this doc covers

1. Using Exa’s Auto search to pick the best search setting for each query (keyword or neural)
2. Using search\_and\_contents() through Exa’s Python SDK

---

In this example, we will build Exa Researcher, a Python app that, given a research topic, automatically searches for relevant sources with Exa’s [auto search](../reference/exa-s-capabilities-explained) and synthesizes the information into a reliable research report.

To run this code, first we need a [Exa API key](https://dashboard.exa.ai/api-keys) and an [OpenAI API key](https://platform.openai.com/api-keys).

If you would like to se the full code for this tutorial as a Colab notebook, [click here](https://colab.research.google.com/drive/1Aj6bBptSHWxZO7GVG2RoWtQSEkpabuaF?usp=sharing)

## [​](#setup) Setup

Let’s import the Exa and OpenAI SDKs and set up our API keys to create client objects for each. We’ll use environment variables to securely store our API keys.

Python

```
import os
import exa_py
from openai import OpenAI

EXA_API_KEY = os.environ.get('EXA_API_KEY')
OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY')

exa = exa_py.Exa(EXA_API_KEY)
openai_client = OpenAI(api_key=OPENAI_API_KEY)

```

Since we’ll be making several calls to the OpenAI API to get a completion from GPT-3.5 Turbo, let’s make a simple utility function so we can pass in the system and user messages directly, and get the LLM’s response back as a string.

Python

```
def get_llm_response(system='You are a helpful assistant.', user='', temperature=1, model='gpt-3.5-turbo'):
    completion = openai_client.chat.completions.create(
        model=model,
        temperature=temperature,
        messages=[
            {'role': 'system', 'content': system},
            {'role': 'user', 'content': user},
        ]
    )
    return completion.choices[0].message.content

```

Okay, great! Now let’s start building Exa Researcher.

## [​](#exa-auto-search) Exa Auto search

The researcher should be able to automatically generate research reports for all kinds of different topics. Here’s two to start:

Python

```
SAMA_TOPIC = 'Sam Altman'
ART_TOPIC = 'renaissance art'

```

The first thing our researcher has to do is decide what kind of search to do for the given topic.

Exa offers two kinds of search: **neural** and **keyword** search. Here’s how we decide:

* Neural search is preferred when the query is broad and complex because it lets us retrieve high quality, semantically relevant data. Neural search is especially suitable when a topic is well-known and popularly discussed on the Internet, allowing the machine learning model to retrieve contents which are more likely recommended by real humans.
* Keyword search is useful when the topic is specific, local or obscure. If the query is a specific person’s name, and identifier, or acronym, such that relevant results will contain the query itself, keyword search may do well. And if the machine learning model doesn’t know about the topic, but relevant documents can be found by directly matching the search query, keyword search may be necessary.

Conveniently, Exa’s [auto search](../reference/exa-s-capabilities-explained) feature (on by default) will automatically decide whether to use `keyword` or `neural` search for each query. For example, if a query is a specific person’s name, Exa would decide to use keyword search.

Now, we’ll create a helper function to generate search queries for our topic.

Python

```
def generate_search_queries(topic, n):
    user_prompt = f"""I'm writing a research report on {topic} and need help coming up with diverse search queries.
Please generate a list of {n} search queries that would be useful for writing a research report on {topic}. These queries can be in various formats, from simple keywords to more complex phrases. Do not add any formatting or numbering to the queries."""

    completion = get_llm_response(
        system='The user will ask you to help generate some search queries. Respond with only the suggested queries in plain text with no extra formatting, each on its own line.',
        user=user_prompt,
        temperature=1
    )
    return [s.strip() for s in completion.split('\n') if s.strip()][:n]

```

Next, let’s write another function that actually calls the Exa API to perform searches using Auto search.

Python

```
def get_search_results(queries, links_per_query=2):
    results = []
    for query in queries:
        search_response = exa.search_and_contents(query,
            num_results=links_per_query
        )
        results.extend(search_response.results)
    return results

```

## [​](#writing-a-report-with-gpt-3-5-turbo) Writing a report with GPT-3.5 Turbo

The final step is to instruct the LLM to synthesize the content into a research report, including citations of the original links. We can do that by pairing the content and the URLs and writing them into the prompt.

Python

```
def synthesize_report(topic, search_contents, content_slice=750):
    input_data = '\n'.join([f"--START ITEM--\nURL: {item.url}\nCONTENT: {item.text[:content_slice]}\n--END ITEM--\n" for item in search_contents])
    return get_llm_response(
        system='You are a helpful research assistant. Write a report according to the user\'s instructions.',
        user=f'Input Data:\n{input_data}Write a two paragraph research report about {topic} based on the provided information. Include as many sources as possible. Provide citations in the text using footnote notation ([#]). First provide the report, followed by a single "References" section that lists all the URLs used, in the format [#] <url>.',
        # model='gpt-4'  # want a better report? use gpt-4 (but it costs more)
    )

```

## [​](#all-together-now) All Together Now

Now, let’s just wrap everything into one Researcher function that strings together all the functions we’ve written. Given a user’s research topic, the Researcher will generate search queries, feed those queries to Exa Auto search, and finally use an LLM to synthesize the retrieved information. Three simple steps!

Python

```
def researcher(topic):
    print(f'Starting research on topic: "{topic}"')

    search_queries = generate_search_queries(topic, 3)
    print("Generated search queries:", search_queries)

    search_results = get_search_results(search_queries)
    print(f"Found {len(search_results)} search results. Here's the first one:", search_results[0])

    print("Synthesizing report...")
    report = synthesize_report(topic, search_results)

    return report

```

In just a couple lines of code, we’ve used Exa to go from a research topic to a valuable essay with up-to-date sources.

Python

```
def run_examples():
    print("Researching Sam Altman:")
    sama_report = researcher(SAMA_TOPIC)
    print(sama_report)

    print("\n\nResearching Renaissance Art:")
    art_report = researcher(ART_TOPIC)
    print(art_report)

# To use the researcher on the examples, simply call the run_examples() function:
if __name__ == "__main__":
    run_examples()

# Or, to research a specific topic:
# print(researcher("llama antibodies"))

```

This Python implementation of Exa Researcher demonstrates how to leverage Exa’s Auto search feature and the OpenAI API to create an automated research tool. By combining Exa’s powerful search capabilities with GPT-3.5 Turbo’s language understanding and generation, we’ve created a system that can quickly gather and synthesize information on any given topic.

[Exa Researcher - JavaScript](/examples/exa-researcher)[Recruiting Agent](/examples/exa-recruiting-agent)

[x](https://twitter.com/exaailabs)[discord](https://discord.com/invite/HCShtBqbfV)

[Powered by Mintlify](https://mintlify.com/preview-request?utm_campaign=poweredBy&utm_medium=referral&utm_source=docs.exa.ai)

On this page

* [What this doc covers](#what-this-doc-covers)
* [Setup](#setup)
* [Exa Auto search](#exa-auto-search)
* [Writing a report with GPT-3.5 Turbo](#writing-a-report-with-gpt-3-5-turbo)
* [All Together Now](#all-together-now)