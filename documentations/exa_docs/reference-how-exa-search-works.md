[Exa home page![light logo](https://mintlify.s3.us-west-1.amazonaws.com/exa-52/logo/light.png)![dark logo](https://mintlify.s3.us-west-1.amazonaws.com/exa-52/logo/dark.png)](/)

Search or ask...

* [Exa Search](https://exa.ai/search)
* [Log In](https://dashboard.exa.ai/login)
* [API Dashboard](https://dashboard.exa.ai/login?redirect=/)
* [API Dashboard](https://dashboard.exa.ai/login?redirect=/)

Search...

Navigation

Concepts

How Exa Search Works

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

Concepts

# How Exa Search Works

Exa is a novel search engine that utilizes the latest advancements in AI language processing to return the best possible results.

---

## 

[​](#introducing-neural-searches-via-%E2%80%98next-link-prediction%E2%80%99)

Introducing neural searches via ‘next-link prediction’

At Exa, we’ve built our very own index of high quality web content, and have trained a model to query this index powered by the same embeddings-based technology that makes modern LLMs so powerful.

By using embeddings, we move beyond keyword searches to use ‘next-link prediction’, understanding the semantic content of queries and indexed documents. This method predicts which web links are most relevant based on the semantic meaning, not just direct word matches.

By doing this, our model anticipates the most relevant links by understanding complex queries, including indirect or thematic relationships. This approach is especially effective for exploratory searches, where precise terms may be unknown, or where queries demand many, often semantically dense, layered filters.

## 

[​](#combining-neural-and-keyword-the-best-of-both-worlds-through-exa-auto-search)

Combining neural and keyword - the best of both worlds through Exa Auto search

Sometimes keyword search is the best way to query the web - for instance, you may have a specific word or piece of jargon that you want to match explicitly with results (often the case with proper nouns like place-names). In these cases, semantic searches are not the most useful.

To ensure our engine is comprehensive, we have built keyword search in parallel to our novel neural search capability. This means Exa is an ‘all-in-one’ search solution, no matter what your query needs are.

Lastly, we surface both query archetypes through ‘Auto search’, to give users the best of both worlds - we have built a small categorization model that understands your query, our search infrastructure and therefore routes your particular query to the best matched search type.

See here for the way we set Auto search in a simple Python example. Type has options `neural`, `keyword` or `auto`.

At one point, Exa auto Auto search was named Magic Search - this has been changed

Python

```Python
result = exa.search_and_contents(
  "hottest AI startups",
  type="auto",
)

```

[OpenAI Responses API](/reference/openai-responses-api-with-exa)[The Exa Index](/reference/the-exa-index)

[x](https://twitter.com/exaailabs)[discord](https://discord.com/invite/HCShtBqbfV)

[Powered by Mintlify](https://mintlify.com/preview-request?utm%5Fcampaign=poweredBy&utm%5Fmedium=referral&utm%5Fsource=docs.exa.ai)

On this page

* [Introducing neural searches via ‘next-link prediction’](#introducing-neural-searches-via-%E2%80%98next-link-prediction%E2%80%99)
* [Combining neural and keyword - the best of both worlds through Exa Auto search](#combining-neural-and-keyword-the-best-of-both-worlds-through-exa-auto-search)