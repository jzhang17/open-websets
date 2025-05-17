FAQs - Exa

[Exa home page![light logo](https://mintlify.s3.us-west-1.amazonaws.com/exa-52/logo/light.png)![dark logo](https://mintlify.s3.us-west-1.amazonaws.com/exa-52/logo/dark.png)](/)

Search or ask...

* [Exa Search](https://exa.ai/search)
* [Log In](https://dashboard.exa.ai/login)
* [API Dashboard](https://dashboard.exa.ai/login?redirect=/)
* [API Dashboard](https://dashboard.exa.ai/login?redirect=/)

Search...

Navigation

Concepts

FAQs

[Documentation](/reference/getting-started)[Examples](/examples/exa-mcp)[Integrations](/integrations/lang-chain-docs)[SDKs](/sdks/python-sdk-specification)[Websets](/websets/overview)[Changelog](/changelog/auto-search-as-default)

- [Discord](https://discord.com/invite/HCShtBqbfV)
- [Blog](https://exa.ai/blog)

##### Getting Started

* [Overview](/reference/getting-started)
* [Quickstart](/reference/quickstart)

##### API Reference

* [POST

  Search](/reference/search)
* [POST

  Get contents](/reference/get-contents)
* [POST

  Find similar links](/reference/find-similar-links)
* [POST

  Answer](/reference/answer)
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
* [Enterprise Documentation & Security](/reference/security)

Concepts

# FAQs

What is Exa?

Exa is a new search engine offering both proprietary neural search and industry-standard keyword search. It excels in finding precise web content, retrieving clean/rich web content, and can even identify similar pages based on input URLs. These technologies make Exa ideal for enhancing RAG pipelines, automating research, and creating niche datasets.

What's different about Exa's Neural Search?

Exa uses a transformer-based model to understand your query and return the most relevant links. Exa has embedded large portions of the web, allowing you to make extremely specific and complex queries, and get only the highest quality results.

How is Neural Search different from Google?

Google search is mostly keyword-based, matching query words to webpage words. For example, a Google search for “companies working on AI for finance” typically returns links like “Top 10 companies developing AI for financial services”. In contrast, Exa’s neural search understands meaning, returning actual company URLs. Additionally, Exa’s results are not influenced by SEO, unlike Google/other engines, which can be affected by optimized content. This allows Exa to provide more precise and relevant results based on the query’s intent rather than by keywords alone.

How is Exa different from LLMs?

Exa is a new search engine built from the ground up. LLMs are models built to predict the next piece of text. Exa predicts specific links on the web given their relevance to a query. LLMs have intelligence, and are getting smarter over time as new models are trained. Exa connects these intelligences to the web.

How can Exa be used in an LLM?

Exa enhances LLMs by supplying high-quality, relevant web content, minimizing hallucination and outdated responses. An LLM can take a user’s query, use Exa to find pertinent web content, and generate answers based on reliable, up-to-date information.

How does Exa compare to other search APIs?

Exa.ai offers unique capabilities:

* Neural Search Technology: Uses transformers for semantic understanding, handling complex queries based on meaning.
* Natural Language Queries: Processes and understands natural language queries for more accurate results.
* Instant Content Retrieval: Instantly returns clean and parsed content for any page in its index.
* Large-scale Searches: Capable of returning thousands of results for automatic processing, ideal for batch use cases.
* Content Highlights: Extracts relevant excerpts or highlights from retrieved content for targeted information.
* Optimized for AI Applications: Specifically designed for enhancing AI models, chatbots, and research automation.
* Auto search: Automatically selects the best search type (neural or keyword) based on the query for optimal results.

How can Exa be used in an LLM?

Exa enhances LLMs by supplying high-quality, relevant web content, minimizing hallucination and outdated responses. An LLM can take a user’s query, use Exa to find pertinent web content, and generate answers based on reliable, up-to-date information.

How often is the index updated?

We update our index every two minutes, and are constantly adding batches of new links. We target the highest quality web pages. Our clients oftentimes request specific domains to be more deeply covered - if there is a use-case we can unlock by additional domain coverage in our index, please contact us.

What's our roadmap?

* The ability to create arbitrary custom datasets by powerfully searching over our index
* Support arbitrary non-neural filters
* Build a (much) larger index
* Solve search. No, really.

How does similarity search work?

When you search using a URL, Exa crawls the URL, parses the main content from the HTML, and searches the index with that parsed content.

The model chooses webpages which it predicts are talked about in similar ways to the prompt URL. That means the model considers a range of factors about the page, including the text style, the domain, and the main ideas inside the text.

Similarity search is natural extension for a neural search engine like Exa, and something that’s difficult with keyword search engines like google

What security measures does Exa take?

We have robust policies and everything we do is either in standard cloud services, or built in house (e.g., we have our own vector database that we serve in house, our own GPU cluster, our own query model and our own SERP solution). In addition to this, we can offer unique security arrangements like zero data retention as part of a custom enterprise agreement just chat to us!

[Exa's Capabilities Explained](/reference/exas-capabilities-explained)[Crawling Subpages with Exa](/reference/crawling-subpages-with-exa)

[x](https://twitter.com/exaailabs)[discord](https://discord.com/invite/HCShtBqbfV)

[Powered by Mintlify](https://mintlify.com/preview-request?utm_campaign=poweredBy&utm_medium=referral&utm_source=docs.exa.ai)