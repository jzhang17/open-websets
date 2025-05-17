Contents retrieval with Exa API - Exa

[Exa home page![light logo](https://mintlify.s3.us-west-1.amazonaws.com/exa-52/logo/light.png)![dark logo](https://mintlify.s3.us-west-1.amazonaws.com/exa-52/logo/dark.png)](/)

Search or ask...

* [Exa Search](https://exa.ai/search)
* [Log In](https://dashboard.exa.ai/login)
* [API Dashboard](https://dashboard.exa.ai/login?redirect=/)
* [API Dashboard](https://dashboard.exa.ai/login?redirect=/)

Search...

Navigation

Concepts

Contents retrieval with Exa API

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

# Contents retrieval with Exa API

---

When using the Exa API, you can request different types of content to be returned for each search result. The three content return types are:

## [​](#text-text%3Dtrue-%3A) Text (text=True):

Returns the full text content of the result, such as the main body of an article or webpage. This is extractive content directly taken from the source.

## [​](#highlights-highlights%3Dtrue-%3A) Highlights (highlights=True):

Delivers key excerpts from the text that are most relevant to your search query, emphasizing important information within the content. This is also extractive content from the source.

## [​](#summary-summary%3Dtrue-%3A) Summary (summary=True):

Provides a concise summary generated from the text, tailored to a specific query you provide. This is abstractive content created by processing the source text using Gemini Flash.

### [​](#structured-summaries) Structured Summaries

You can also request structured summaries by providing a JSON schema:

```
{
  "summary": {
    "query": "Provide company information",
    "schema": {
      "$schema": "http://json-schema.org/draft-07/schema#",
      "title": "Company Information",
      "type": "object",
      "properties": {
        "name": { "type": "string", "description": "The name of the company" },
        "industry": { "type": "string", "description": "The industry the company operates in" },
        "foundedYear": { "type": "number", "description": "The year the company was founded" }
      },
      "required": ["name", "industry"]
    }
  }
}

```

The API will return the summary as a JSON string that matches your schema structure, which you can parse to access the structured data.

By specifying these options in your API call, you can control the depth and focus of the information returned, making your search results more actionable and relevant.

To see the full configurability of the contents returns, [check out our Dashboard](https://dashboard.exa.ai/) and sample queries.

## [​](#images-and-favicons) Images and favicons

When making API requests, Exa can return:

* Image URLs from the source content (you can specify how many images you want returned)
* Website favicons associated with each search result (when available)

[The Exa Index](/reference/the-exa-index)[Exa's Capabilities Explained](/reference/exas-capabilities-explained)

[x](https://twitter.com/exaailabs)[discord](https://discord.com/invite/HCShtBqbfV)

[Powered by Mintlify](https://mintlify.com/preview-request?utm_campaign=poweredBy&utm_medium=referral&utm_source=docs.exa.ai)

On this page

* [Text (text=True):](#text-text%3Dtrue-%3A)
* [Highlights (highlights=True):](#highlights-highlights%3Dtrue-%3A)
* [Summary (summary=True):](#summary-summary%3Dtrue-%3A)
* [Structured Summaries](#structured-summaries)
* [Images and favicons](#images-and-favicons)