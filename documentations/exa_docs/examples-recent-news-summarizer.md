[Exa home page![light logo](https://mintlify.s3.us-west-1.amazonaws.com/exa-52/logo/light.png)![dark logo](https://mintlify.s3.us-west-1.amazonaws.com/exa-52/logo/dark.png)](/)

Search or ask...

* [Exa Search](https://exa.ai/search)
* [Log In](https://dashboard.exa.ai/login)
* [API Dashboard](https://dashboard.exa.ai/login?redirect=/)
* [API Dashboard](https://dashboard.exa.ai/login?redirect=/)

Search...

Navigation

Tutorials

Building a News Summarizer

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

# Building a News Summarizer

Learn how to build an AI-powered news summarizer that searches and summarizes recent articles using Exa and GPT.

---

In this example, we will build an LLM-based news summarizer with the Exa API to keep us up-to-date with the latest news on a given topic. We’ll do this in three steps:

1. Generate search queries for Exa using an LLM
2. Retrieve relevant URLs and their contents using Exa
3. Summarize webpage contents using GPT-3.5 Turbo

This is a form of Retrieval Augmented Generation (RAG), combining Exa’s search capabilities with GPT’s summarization abilities.

The Jupyter notebook for this tutorial is available on [Colab](https://colab.research.google.com/drive/1uZ0kxFCWmCqozl3ArTJohNpRbeEYlwlT?usp=sharing) for easy experimentation. You can also [check it out on Github](https://github.com/exa-labs/exa-py/tree/master/examples/newssummarizer/summarizer.ipynb), including a [plain Python version](https://github.com/exa-labs/exa-py/tree/master/examples/newssummarizer/summarizer.py) if you want to skip to the complete product.

---

## 

[​](#get-started)

Get Started

1

Pre-requisites and installation

Install the required packages:

```python
pip install exa_py openai

```

 You’ll need both an Exa API key and an OpenAI API key to run this example. You can get your OpenAI API key [here](https://platform.openai.com/api-keys).

[Get your Exa API key](https://dashboard.exa.ai/api-keys)

Set up your API keys:

```python
from google.colab import userdata # comment this out if you're not using Colab

EXA_API_KEY = userdata.get('EXA_API_KEY') # replace with your Exa API key
OPENAI_API_KEY = userdata.get('OPENAI_API_KEY') # replace with your OpenAI API key

```

2

Initialize the clients

Import and set up both the OpenAI and Exa clients:

```python
import openai
from exa_py import Exa

openai.api_key = OPENAI_API_KEY
exa = Exa(EXA_API_KEY)

```

3

Generate a search query

First, we’ll use GPT to generate an optimized search query based on the user’s question:

```python
SYSTEM_MESSAGE = "You are a helpful assistant that generates search queries based on user questions. Only generate one search query."
USER_QUESTION = "What's the recent news in physics this week?"

completion = openai.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[
        {"role": "system", "content": SYSTEM_MESSAGE},
        {"role": "user", "content": USER_QUESTION},
    ],
)

search_query = completion.choices[0].message.content

print("Search query:")
print(search_query)

```

4

Search for recent articles

Now we’ll use Exa to search for recent articles, filtering by publication date:

```python
from datetime import datetime, timedelta

one_week_ago = (datetime.now() - timedelta(days=7))
date_cutoff = one_week_ago.strftime("%Y-%m-%d")

search_response = exa.search_and_contents(
    search_query, start_published_date=date_cutoff
)

urls = [result.url for result in search_response.results]
print("URLs:")
for url in urls:
    print(url)

```

We use `start_published_date` to filter for recent content.

5

Get article contents

Exa’s `search_and_contents` already retrieved the article contents for us, so we can access them directly:

```python
results = search_response.results
result_item = results[0]
print(f"{len(results)} items total, printing the first one:")
print(result_item.text)

```

Unlike traditional search engines that only return URLs, Exa gives us direct access to the webpage contents, eliminating the need for web scraping.

6

Generate a summary

Finally, we’ll use GPT to create a concise summary of the article:

```python
import textwrap

SYSTEM_MESSAGE = "You are a helpful assistant that briefly summarizes the content of a webpage. Summarize the users input."

completion = openai.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[
        {"role": "system", "content": SYSTEM_MESSAGE},
        {"role": "user", "content": result_item.text},
    ],
)

summary = completion.choices[0].message.content

print(f"Summary for {urls[0]}:")
print(result_item.title)
print(textwrap.fill(summary, 80))

```

And we’re done! We’ve built an app that translates a question into a search query, uses Exa to search for useful links and their contents, and summarizes the content to effortlessly answer questions about the latest news.

**Through Exa, we have given our LLM access to the entire Internet.** The possibilities are endless.

[Hacker News Clone](/examples/live-demo-hacker-news-clone)[Building a Hallucination Checker](/examples/identifying-hallucinations-with-exa)

[x](https://twitter.com/exaailabs)[discord](https://discord.com/invite/HCShtBqbfV)

[Powered by Mintlify](https://mintlify.com/preview-request?utm%5Fcampaign=poweredBy&utm%5Fmedium=referral&utm%5Fsource=docs.exa.ai)

On this page

* [Get Started](#get-started)