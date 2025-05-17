[Exa home page![light logo](https://mintlify.s3.us-west-1.amazonaws.com/exa-52/logo/light.png)![dark logo](https://mintlify.s3.us-west-1.amazonaws.com/exa-52/logo/dark.png)](/)

Search or ask...

* [Exa Search](https://exa.ai/search)
* [Log In](https://dashboard.exa.ai/login)
* [API Dashboard](https://dashboard.exa.ai/login?redirect=/)
* [API Dashboard](https://dashboard.exa.ai/login?redirect=/)

Search...

Navigation

RAG Quick Start Guide

OpenAI Chat Completions

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

# OpenAI Chat Completions

Use Exa’s /chat/completions endpoint as a drop-in replacement for your OpenAI chat completions code. This will send queries to Exa’s `/answer` endpoint

---

 See the full /answer endpoint reference [here](/reference/answer). 

  
## 

[​](#get-started)

Get Started

[Get your Exa API key](https://dashboard.exa.ai/api-keys) 

* Python
* JavaScript
* Curl

1

An example of your existing openai chat completions code

python

```python
from openai import OpenAI

client = OpenAI(api_key="YOUR_OPENAI_API_KEY")

completion = client.chat.completions.create(
  model="gpt-4o-mini",
  messages= [
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "What are the latest developments in quantum computing?"}
  ]
)

print(completion.choices[0].message.content)  # print the response content

```

2

Replace the base URL with api.exa.ai

 Exa will parse through your messages and send only the last message to the `/answer` endpoint.

python

```python
from openai import OpenAI

client = OpenAI(
  base_url="https://api.exa.ai", # use exa as the base url
  api_key="YOUR_EXA_API_KEY", # update your api key
)

completion = client.chat.completions.create(
  model="exa", # or exa-pro
  messages = [
  {"role": "system", "content": "You are a helpful assistant."},
  {"role": "user", "content": "What are the latest developments in quantum computing?"}
],

# use extra_body to pass extra parameters to the /answer endpoint
  extra_body={
    "text": True # include full text from sources
  }
)

print(completion.choices[0].message.content)  # print the response content
print(completion.choices[0].message.citations)  # print the citations

```

1

An example of your existing openai chat completions code

python

```python
from openai import OpenAI

client = OpenAI(api_key="YOUR_OPENAI_API_KEY")

completion = client.chat.completions.create(
  model="gpt-4o-mini",
  messages= [
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "What are the latest developments in quantum computing?"}
  ]
)

print(completion.choices[0].message.content)  # print the response content

```

2

Replace the base URL with api.exa.ai

 Exa will parse through your messages and send only the last message to the `/answer` endpoint.

python

```python
from openai import OpenAI

client = OpenAI(
  base_url="https://api.exa.ai", # use exa as the base url
  api_key="YOUR_EXA_API_KEY", # update your api key
)

completion = client.chat.completions.create(
  model="exa", # or exa-pro
  messages = [
  {"role": "system", "content": "You are a helpful assistant."},
  {"role": "user", "content": "What are the latest developments in quantum computing?"}
],

# use extra_body to pass extra parameters to the /answer endpoint
  extra_body={
    "text": True # include full text from sources
  }
)

print(completion.choices[0].message.content)  # print the response content
print(completion.choices[0].message.citations)  # print the citations

```

1

An example of your existing openai chat completions code

javascript

```javascript
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: "YOUR_OPENAI_API_KEY",
  });

async function main() {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {"role": "system", "content": "You are a helpful assistant."},
      {"role": "user", "content": "What are the latest developments in quantum computing?"}
    ],
    store: true,
    stream: true,
  });

  for await (const chunk of completion) {
    console.log(chunk.choices[0].delta.content);
  }
}

main();

```

2

Replace the base URL with api.exa.ai

 Exa will parse through your messages and send only the last message to the `/answer` endpoint.

javascript

```javascript
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://api.exa.ai", // use exa as the base url
  apiKey: "YOUR_EXA_API_KEY", // update your api key
});

async function main() {
  const completion = await openai.chat.completions.create({
    model: "exa", // or exa-pro
    messages: [
      {"role": "system", "content": "You are a helpful assistant."},
      {"role": "user", "content": "What are the latest developments in quantum computing?"}
    ],
    store: true,
    stream: true,
    extra_body: {
      "text": true // include full text from sources
    }
  });

  for await (const chunk of completion) {
    console.log(chunk.choices[0].delta.content);
  }
}

main();

```

1

An example of your existing openai chat completions code

bash

```bash
curl https://api.openai.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "gpt-4o-mini",
    "messages": [
      {
        "role": "system",
        "content": "You are a helpful assistant."
      },
      {
        "role": "user",
        "content": "What are the latest developments in quantum computing?"
      }
    ],
    "stream": true
  }'

```

2

Replace the base URL with api.exa.ai

 Exa will parse through your messages and send only the last message to the `/answer` endpoint.

bash

```bash
curl https://api.exa.ai/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $YOUR_EXA_API_KEY" \
  -d '{
    "model": "exa", 
    "messages": [
      {
        "role": "system",
        "content": "You are a helpful assistant."
      },
      {
        "role": "user",
        "content": "What are the latest developments in quantum computing?"
      }
    ],
    "extra_body": {
      "text": true
    }
  }'

```

[Tool calling with Claude](/reference/tool-calling-with-claude)[OpenAI Responses API](/reference/openai-responses-api-with-exa)

[x](https://twitter.com/exaailabs)[discord](https://discord.com/invite/HCShtBqbfV)

[Powered by Mintlify](https://mintlify.com/preview-request?utm%5Fcampaign=poweredBy&utm%5Fmedium=referral&utm%5Fsource=docs.exa.ai)

On this page

* [Get Started](#get-started)