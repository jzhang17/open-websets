[Exa home page![light logo](https://mintlify.s3.us-west-1.amazonaws.com/exa-52/logo/light.png)![dark logo](https://mintlify.s3.us-west-1.amazonaws.com/exa-52/logo/dark.png)](/)

Search or ask...

* [Exa Search](https://exa.ai/search)
* [Log In](https://dashboard.exa.ai/login)
* [API Dashboard](https://dashboard.exa.ai/login?redirect=/)
* [API Dashboard](https://dashboard.exa.ai/login?redirect=/)

Search...

Navigation

Concepts

Exa's Capabilities Explained

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

# Exa's Capabilities Explained

This page explains some of the available feature functionalities of Exa and some unique ways you might use Exa for your use-case

## 

[​](#search-types)

Search Types

## 

[​](#auto-search-prev-magic-search)

Auto search (prev. Magic Search)

| Where you would use it                                                                                                                                                                                                                              |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| When you want optimal results without manually choosing between neural and keyword search. When you might not know ahead of time what the best search type is. Note Auto search is the default search type - when unspecified, Auto search is used. |

Python

```Python
result = exa.search("hottest AI startups", type="auto")

```

## 

[​](#neural-search)

Neural Search

| Description                                                                                                             | Where you would use it                                                                                                                                           |
| ----------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Uses Exa’s embeddings-based index and query model to perform complex queries and provide semantically relevant results. | For exploratory searches or when looking for conceptually related content rather than exact keyword matches. To find hard to find, specific results from the web |

Python

```Python
result = exa.search("Here is a startup building innovative solutions for climate change:", type="neural")

```

## 

[​](#keyword-search)

Keyword Search

| Description                                                       | Where you would use it                                                                                                                                                                                                                                                                 |
| ----------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Traditional search method that matches specific words or phrases. | When doing simple, broad searches where the user can refine results manually. Good for general browsing and finding exact matches. Good for matching proper nouns or terms of art that are rarely used in other contexts. When neural search fails to return what you are looking for. |

Python

```Python

result = exa.search("Paris", type="keyword")

```

## 

[​](#phrase-filter-search)

Phrase Filter Search

| Description                                                            | Where you would use it                                                                                                                                                               |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Apply keyword filters atop of a neural search before returning results | When you want the power of Neural Search but also need to specify and filter on some key phrase. Often helpful when filtering on a piece of jargon where a specific match is crucial |

Python

```Python
result = exa.search(query, type='neural', includeText='Some_key_phrase_to_fiter_on')

```

[See a worked example here](/tutorials/phrase-filters-niche-company-finder)

## 

[​](#large-scale-searches)

Large-scale Searches

| Description                                                | Where you would use it                                                                                                            |
| ---------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Exa searches that return a large number of search results. | When desiring comprehensive, semantically relevant data for batch use cases, e.g., for enrichment of CRMs or full topic scraping. |

Python

```Python
result = exa.search("Companies selling sonar technology", num_results=1000)

```

Note high return results cost more and higher result caps (e.g., 1000 returns) are restricted to Enterprise/Custom plans only. [Get in touch ](https://cal.com/team/exa/exa-intro-chat?date=2024-11-14&month=2024-11)if you are interested in learning more.

---

## 

[​](#content-retrieval)

Content Retrieval

## 

[​](#contents-retrieval)

Contents Retrieval

| Description                                                                         | Where you would use it                                                                         |
| ----------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Instantly retrieves whole, cleaned and parsed webpage contents from search results. | When you need the full text of webpages for analysis, summarization, or other post-processing. |

Python

```Python
result = exa.search_and_contents("latest advancements in quantum computing", text=True)

```

## 

[​](#highlights-retrieval)

Highlights Retrieval

| Description                                                      | Where you would use it                                                                                                            |
| ---------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Extracts relevant excerpts or highlights from retrieved content. | When you want a quick or targeted outputs from the most relevant parts of a search entity without wanted to handle the full text. |

Python

```Python
result = exa.search_and_contents("AI ethics", highlights=True)

```

---

## 

[​](#prompt-engineering)

Prompt Engineering

Prompt engineering is crucial for getting the most out of Exa’s capabilities. The right prompt can dramatically improve the relevance and usefulness of your search results. This is especially important for neural search and advanced features like writing continuation.

## 

[​](#writing-continuation-queries)

Writing continuation queries

| Description                                                                                                                                                                                            | Where you would use it                                                                                                                                                                                                                                                                             |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Prompt crafted by post-pending ‘Here is a great resource to continue writing this piece of writing:’. Useful for research writing or any other citation-based text generation after passing to an LLM. | When you’re in the middle of writing a piece and need to find relevant sources to continue or expand your content. This is particularly useful for academic writing, content creation, or any scenario where you need to find information that logically follows from what you’ve already written. |

Python

```Python
current_text = """
The impact of climate change on global agriculture has been significant.
Rising temperatures and changing precipitation patterns have led to shifts
in crop yields and growing seasons. Some regions have experienced increased
drought stress, while
"""
continuation_query = current_text + " If you found the above interesting, here's another useful resource to read:"
result = exa.search(continuation_query, type="neural")

```

## 

[​](#long-queries)

Long queries

| Description                                                                             | Where you would use it                                                                                                                                                                                                                                   |
| --------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Utilizing Exa’s long query window to perform matches against semantically rich content. | When you need to find content that matches complex, detailed descriptions or when you want to find content similar to a large piece of text. This is particularly useful for finding niche content or when you’re looking for very specific information. |

Python

```Python
long_query = """
Abstract: In this study, we investigate the potential of quantum-enhanced machine learning algorithms
for drug discovery applications. We present a novel quantum-classical hybrid approach that leverages
quantum annealing for feature selection and a quantum-inspired tensor network for model training.
Our results demonstrate a 30% improvement in prediction accuracy for binding affinity in protein-ligand
interactions compared to classical machine learning methods. Furthermore, we show a significant
reduction in computational time for large-scale molecular dynamics simulations. These findings
suggest that quantum machine learning techniques could accelerate the drug discovery process
and potentially lead to more efficient identification of promising drug candidates.
"""
result = exa.search(long_query, type="neural")

```

[Contents retrieval with Exa API](/reference/contents-retrieval-with-exa-api)[FAQs](/reference/faqs)

[x](https://twitter.com/exaailabs)[discord](https://discord.com/invite/HCShtBqbfV)

[Powered by Mintlify](https://mintlify.com/preview-request?utm%5Fcampaign=poweredBy&utm%5Fmedium=referral&utm%5Fsource=docs.exa.ai)

On this page

* [Search Types](#search-types)
* [Auto search (prev. Magic Search)](#auto-search-prev-magic-search)
* [Neural Search](#neural-search)
* [Keyword Search](#keyword-search)
* [Phrase Filter Search](#phrase-filter-search)
* [Large-scale Searches](#large-scale-searches)
* [Content Retrieval](#content-retrieval)
* [Contents Retrieval](#contents-retrieval)
* [Highlights Retrieval](#highlights-retrieval)
* [Prompt Engineering](#prompt-engineering)
* [Writing continuation queries](#writing-continuation-queries)
* [Long queries](#long-queries)