[Exa home page![light logo](https://mintlify.s3.us-west-1.amazonaws.com/exa-52/logo/light.png)![dark logo](https://mintlify.s3.us-west-1.amazonaws.com/exa-52/logo/dark.png)](/)

Search or ask...

* [Exa Search](https://exa.ai/search)
* [Log In](https://dashboard.exa.ai/login)
* [API Dashboard](https://dashboard.exa.ai/login?redirect=/)
* [API Dashboard](https://dashboard.exa.ai/login?redirect=/)

Search...

Navigation

RAG Quick Start Guide

OpenAI Exa Wrapper

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

# OpenAI Exa Wrapper

Enhance your OpenAI chat completetions with a simple Exa wrapper that handles search, chunking and prompting.

---

Exa is designed from the ground up to enable seamless, accurate, and performant RAG (Retrieval-Augmented Generation). Exa provides factual, up to date information needed to ground LLM generations.

But good RAG requires more than just great search. The client needs to decide _when_ to use RAG, with _what_ queries. They need to handle chunking, prompting, and chaining LLM calls. We provide the Exa OpenAI wrapper that, **with one line of code**, does all that and turns any OpenAI chat completion into an Exa-powered RAG system.

---

## 

[​](#get-started)

Get Started

First, create an account and grab a free API key.

[Get your Exa API key](https://dashboard.exa.ai/api-keys) 

1

Install the Exa and OpenAI python libraries

Shell

```Shell
pip install openai exa_py

```

2

Instantiate Clients

Import and instantiate the Exa and OpenAI clients.

 Make sure to obtain your API keys from OpenAI and Exa and replace `OPENAI_API_KEY` and `EXA_API_KEY` with your actual keys.

Python

```Python
from openai import OpenAI
openai = OpenAI(api_key='OPENAI_API_KEY')

from exa_py import Exa
exa = Exa('EXA_API_KEY')

```

3

Wrap the OpenAI client

The `Exa.wrap` method takes your existing OpenAI client and wraps it with Exa-powered RAG capabilities.

Python

```Python
exa_openai = exa.wrap(openai)

```

4

Call the wrapped client

The wrapped client works exactly like the native OpenAI client, except that it automatically improves your completions with relevant search results.

 The Exa OpenAI wrapper supports any model that [supports function calling](https://platform.openai.com/docs/guides/function-calling). 

Python

```Python
completion = exa_openai.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "What is the latest climate tech news?"}]
)

print(completion.choices[0].message.content)

```

5

Example output

Stdout

```Stdout
Here are some of the latest climate tech news articles:

1. **Title:** [The world’s on the verge of a carbon storage boom](https://www.technologyreview.com/2024/06/12/1093477/the-worlds-on-the-verge-of-a-carbon-storage-boom/)
    - **Summary:** Companies are planning to drill boreholes to inject carbon dioxide deep underground for storage, marking a significant trend in carbon capture projects driven by subsidies and climate targets.

2. **Title:** [Ground Floor Green: Early Stage Climate VC](https://techcrunch.com/video/ground-floor-green-early-stage-climate-vc/)
    - **Summary:** Climate tech investment is on the rise, with a focus on smarter investments in early-stage companies. The challenge lies in balancing hope and hype in selecting winners.

3. **Title:** [Climate tech startups raised nearly $40 billion in funding last year. Check out 5 of the best pitch decks that caught the eyes of investors.](https://www.businessinsider.com/5-climate-tech-pitch-decks-investors-2022-6)
    - **Summary:** Climate tech startups raised nearly $40 billion in funding in 2021, with a focus on areas like carbon accounting and market plays. The top areas for emissions reduction received only a fraction of overall investment, indicating untapped potential.

```

6

End-to-end code example

Below is a code block that puts together all of the above. You can copy it into any Python script or Jupyter notebook to test out a complete RAG example.

Python

```Python
from openai import OpenAI
openai = OpenAI(api_key='OPENAI_API_KEY')

from exa_py import Exa
exa = Exa('EXA_API_KEY')

exa_openai = exa.wrap(openai)

messages = [{"role": "user", "content": "How can I optimally integrate rag into my app"}]

# exa_openai.chat.completions.create("gpt-4-turbo", messages)
completion = exa_openai.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": "What is the latest climate tech news?"}]
    )

print(completion.choices[0].message.content)

```

7

Example with multiple questions

Here is a slightly more advanced example that shows how to use the wrapper to answer multiple questions.

Python

```Python
exa_openai = exa.wrap(openai)

questions = [
    "How did bats evolve their wings?",
    "How did Rome defend Italy from Hannibal?",
]

for question in questions:
    completion = exa_openai.chat.completions.create( # calling the wrapper
        model="gpt-4o",
        messages=[{"role": "user", "content": question}]
    )

    print(f"Question: {question}\nAnswer: {completion.choices[0].message.content}")

```

## 

[​](#further-configuration-options-and-advanced-usage)

Further configuration options and advanced usage

While the default settings work well for most use cases, the Exa OpenAI wrapper’s `chat.completions.create()` method allows you to fine-tune the following parameters.

## 

[​](#option-to-include-exa-results)

Option to include Exa results

`use_exa` specifies whether to include Exa results for a given request:

* `auto` Exa will intelligently determine whether to include results
* `required` Exa results will always be included
* `none` Exa results will never be included

Python

```Python
completion = exa_openai.chat.completions.create(
    model="gpt-4o",
    messages=messages,
    use_exa="required"
)

```

## 

[​](#number-of-results)

Number of results

`num_results` specifies how many search results Exa should retrieve (defaults to 3 results).

Python

```Python
exa_openai.chat.completions.create(
    model="gpt-4o",
    messages=messages,
    num_results=1
)

```

## 

[​](#maximum-result-length)

Maximum result length

`result_max_len` specifies the maximum length of each Exa result (defaults to 2048 characters).

 This is measured in characters, not tokens. 

Python

```Python
exa_openai.chat.completions.create(
    model="gpt-4o",
    messages=messages,
    result_max_len=1024
)

```

## 

[​](#search-parameters)

Search parameters

The Exa OpenAI wrapper supports any parameters that the `exa.search()` function accepts. You can find a list of all the parameters [here](search).

Python

```Python
exa_openai.chat.completions.create(
    model="gpt-4o",
    messages=messages,
    include_domains=["arxiv.org"],
    category="research paper",
    start_published_date="2019-01-01"
)

```

[RAG with LangChain](/reference/langchain)[CrewAI agents with Exa](/reference/crewai)

[x](https://twitter.com/exaailabs)[discord](https://discord.com/invite/HCShtBqbfV)

[Powered by Mintlify](https://mintlify.com/preview-request?utm%5Fcampaign=poweredBy&utm%5Fmedium=referral&utm%5Fsource=docs.exa.ai)

On this page

* [Get Started](#get-started)
* [Further configuration options and advanced usage](#further-configuration-options-and-advanced-usage)
* [Option to include Exa results](#option-to-include-exa-results)
* [Number of results](#number-of-results)
* [Maximum result length](#maximum-result-length)
* [Search parameters](#search-parameters)