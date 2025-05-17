[Exa home page![light logo](https://mintlify.s3.us-west-1.amazonaws.com/exa-52/logo/light.png)![dark logo](https://mintlify.s3.us-west-1.amazonaws.com/exa-52/logo/dark.png)](/)

Search or ask...

* [Exa Search](https://exa.ai/search)
* [Log In](https://dashboard.exa.ai/login)
* [API Dashboard](https://dashboard.exa.ai/login?redirect=/)
* [API Dashboard](https://dashboard.exa.ai/login?redirect=/)

Search...

Navigation

RAG Quick Start Guide

RAG with LlamaIndex

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

# RAG with LlamaIndex

A quick-start guide on how to add Exa retrieval to a LlamaIndex Agent Application.

---

LlamaIndex is a framework for building LLM applications powered by structured data. In this guide, we’ll use Exa’s LlamaIndex integration to:

1. Specify Exa’s Search and Retrieve Highlight Tool as a LlamaIndex retriever
2. Set up an OpenAI Agent that uses this tool in its response generation

---

## 

[​](#get-started)

Get Started

1

Pre-requisites and installation

Install the llama-index, llama-index core, llama-index-tools-exa libraries. OpenAI dependencies are within the core library, so we don’t need to specify that.

Python

```Python
pip install llama-index llama-index-core llama-index-tools-exa

```

Also ensure API keys are initialized properly. The following code uses the `EXA_API_KEY` as the relevant environment variable name.

[Get your Exa API key](https://dashboard.exa.ai/api-keys)

2

Instantiate Exa tool

Import the relevant Exa integration library and instantiate LlamaIndex’s `ExaToolSpec`.

Python

```Python
from llama_index.tools.exa import ExaToolSpec
import os

exa_tool = ExaToolSpec(
    api_key=os.environ["EXA_API_KEY"],
)

```

3

Choose the Exa method to use

For this example, we are only interested in passing the [search\_and\_retrieve\_highlights](search) method to our agent, so we specify this using the `.to_tool_list`LlamaIndex method. We also pass `current_date`, a simple utility so our agent knows the current date.

Python

```Python
print('Tools that are provide by Exa LlamdaIndex integration:')
print('\n'.join(map(str, (exa_tool.spec_functions))))

search_and_retrieve_highlights_tool = exa_tool.to_tool_list(
    spec_functions=["search_and_retrieve_highlights", "current_date"]
)

```

4

Set up an OpenAI Agent and make Exa-powered requests

Set up the [OpenAIAgent](https://docs.llamaindex.ai/en/stable/examples/agent/Chatbot%5FSEC/), passing the filtered down toolset from above.

Python

```Python
from llama_index.agent.openai import OpenAIAgent

agent = OpenAIAgent.from_tools(
    search_and_retrieve_highlights_tool,
    verbose=True,
)

```

We can then use the chat method to interact with the agent.

Python

```Python
agent.chat(
    "Can you summarize the news from the last month related to the US stock market?"
)

```

5

Sample outputs

Output 1: Verbose output of agent operation

Stdout

```js
Added user message to memory: Can you summarize the news from the last month related to the US stock market?
=== Calling Function ===
Calling function: current_date with args: {}
Got output: 2024-05-09
========================

=== Calling Function ===
Calling function: search_and_retrieve_highlights with args: {"query":"US stock market news","num_results":5,"start_published_date":"2024-04-09","end_published_date":"2024-05-09"}
[Exa Tool] Autoprompt: Here is the latest news on the US stock market:
Got output: [Document(id_='26e0ccec-3b57-4785-ba20-fe0478051db3', embedding=None, metadata={}, excluded_embed_metadata_keys=[], excluded_llm_metadata_keys=[], relationships={}, text='Companies have repurchased more than $383 billion in shares over the past 13 weeks, according to Deutsche Bank research reported by Yahoo. This marks a 30% increase from the same period last year and is the highest level since June 2018. The Dow rose 75 points, or 0.2%, to 38,958 near midday. The S&P 500 dipped 0.1%, and the Nasdaq dropped 0.2%. AMC Entertainment and Robinhood will release their quarterly reports after markets close.', start_char_idx=None, end_char_idx=None, text_template='{metadata_str}\n\n{content}', metadata_template='{key}: {value}', metadata_seperator='\n'), Document(id_='5ffa10c4-700a-4c08-84f5-cdfe69189547', embedding=None, metadata={}, excluded_embed_metadata_keys=[], excluded_llm_metadata_keys=[], relationships={}, text='The California-based company reported a net loss of $270.6 million, or 43 cents per share, for the current period. This is compared to a loss of $268.3 million, or 44 cents per share, in the same period last year. Wall Street’s analysts predicted a per-share loss of 53 cents. Revenue increased by 22.3% to $801.3 million, falling short of the expectation of $918.8 million. Its bookings rose by 19% to $923.8 million, just missing expectations of $930.4 million.', start_char_idx=None, end_char_idx=None, text_template='{metadata_str}\n\n{content}', metadata_template='{key}: {value}', metadata_seperator='\n'), Document(id_='1bca8b42-4322-46ac-b423-fc9b076baf25', embedding=None, metadata={}, excluded_embed_metadata_keys=[], excluded_llm_metadata_keys=[], relationships={}, text="The Dow and other indexes opened higher on Thursday as the latest jobs report suggests the Federal Reserve may lower interest rates this year. Why McDonald's and Starbucks stocks should be avoided according to one analyst Off English Weekly jobless claims have risen to 231,000, up by 22,000 from the previous week. , this marks the highest level since August. This has raised hopes among investors that the central bank may reduce interest rates at some point this year. Meanwhile, , while the Swedish Riksbank and is expected to do so again this year.", start_char_idx=None, end_char_idx=None, text_template='{metadata_str}\n\n{content}', metadata_template='{key}: {value}', metadata_seperator='\n'), Document(id_='12cf1913-b637-4351-96fa-dd0a4e1dc6bd', embedding=None, metadata={}, excluded_embed_metadata_keys=[], excluded_llm_metadata_keys=[], relationships={}, text='Following the news, the stock declined 9.5% in mid-morning trading. Bitcoin jumps to $64,000 rebounded to morning The latest surge in Bitcoin price comes amid the resurgence of. Grayscale’s Bitcoin ETF has finally seen inflows. According to data compiled by , , which is the biggest Bitcoin ETF in terms of assets, received $63 million from investors on Friday. This marks the end of daily outflows that had been occurring for almost four months since its conversion to a spot ETF structure in January.', start_char_idx=None, end_char_idx=None, text_template='{metadata_str}\n\n{content}', metadata_template='{key}: {value}', metadata_seperator='\n'), Document(id_='fbd457e6-188f-464d-83f3-99303e2f2fc2', embedding=None, metadata={}, excluded_embed_metadata_keys=[], excluded_llm_metadata_keys=[], relationships={}, text='Its debt due 2025 is trading at 73 cents on the dollar, and its 2026 debt is at 55 cents. Following the news, the stock declined 9.7% by the end of the day. On the other hand, Spirit Airlines’ rivals soar on Monday. American Airlines, Southwest Airlines, and United Airlines were among the top-performing stocks, up 5.7%, 4.8%, and 4.4%, respectively. Stocks of Paramount soar amid acquisition discussions Shares of Paramount Global went up 3% by the end of the day amid ongoing discussions about who will acquire the streaming and entertainment company.', start_char_idx=None, end_char_idx=None, text_template='{metadata_str}\n\n{content}', metadata_template='{key}: {value}', metadata_seperator='\n')]
========================

```

Output 2: Agent response

Stdout

```js
AgentChatResponse(response="Here are some highlights related to the US stock market news from the last month:\n\n1. Companies have repurchased more than $383 billion in shares over the past 13 weeks, marking a 30% increase from the same period last year. This is the highest level since June 2018. The Dow rose 75 points, the S&P 500 dipped 0.1%, and the Nasdaq dropped 0.2%. AMC Entertainment and Robinhood will release their quarterly reports after markets close.\n\n2. A California-based company reported a net loss of $270.6 million, or 43 cents per share, for the current period. Revenue increased by 22.3% to $801.3 million, falling short of expectations. Bookings rose by 19% to $923.8 million, just missing expectations.\n\n3. The Dow and other indexes opened higher as the latest jobs report suggests the Federal Reserve may lower interest rates this year. Weekly jobless claims have risen to 231,000, the highest level since August, raising hopes among investors for a potential interest rate reduction.\n\n4. Following the news, a stock declined 9.5% in mid-morning trading. Bitcoin price surged to $64,000 amid the resurgence of Grayscale’s Bitcoin ETF seeing inflows after daily outflows for almost four months.\n\n5. Debt due in 2025 is trading at 73 cents on the dollar, and 2026 debt is at 55 cents. Following the news, a stock declined 9.7% by the end of the day. Spirit Airlines’ rivals, including American Airlines, Southwest Airlines, and United Airlines, saw their stocks soar. Paramount Global's shares went up 3% amid acquisition discussions.\n\nThese are some of the key highlights from the US stock market news in the last month.", sources=[ToolOutput(content='2024-05-09', tool_name='current_date', raw_input={'args': (), 'kwargs': {}}, raw_output=datetime.date(2024, 5, 9), is_error=False), ToolOutput(content='[Document(id_=\'26e0ccec-3b57-4785-ba20-fe0478051db3\', embedding=None, metadata={}, excluded_embed_metadata_keys=[], excluded_llm_metadata_keys=[], relationships={}, text=\'Companies have repurchased more than $383 billion in shares over the past 13 weeks, according to Deutsche Bank research reported by Yahoo. This marks a 30% increase from the same period last year and is the highest level since June 2018. The Dow rose 75 points, or 0.2%, to 38,958 near midday. The S&P 500 dipped 0.1%, and the Nasdaq dropped 0.2%. AMC Entertainment and Robinhood will release their quarterly reports after markets close.\', start_char_idx=None, end_char_idx=None, text_template=\'{metadata_str}\\n\\n{content}\', metadata_template=\'{key}: {value}\', metadata_seperator=\'\\n\'), Document(id_=\'5ffa10c4-700a-4c08-84f5-cdfe69189547\', embedding=None, metadata={}, excluded_embed_metadata_keys=[], excluded_llm_metadata_keys=[], relationships={}, text=\'The California-based company reported a net loss of $270.6 million, or 43 cents per share, for the current period. This is compared to a loss of $268.3 million, or 44 cents per share, in the same period last year. Wall Street’s analysts predicted a per-share loss of 53 cents. Revenue increased by 22.3% to $801.3 million, falling short of the expectation of $918.8 million. Its bookings rose by 19% to $923.8 million, just missing expectations of $930.4 million.\', start_char_idx=None, end_char_idx=None, text_template=\'{metadata_str}\\n\\n{content}\', metadata_template=\'{key}: {value}\', metadata_seperator=\'\\n\'), Document(id_=\'1bca8b42-4322-46ac-b423-fc9b076baf25\', embedding=None, metadata={}, excluded_embed_metadata_keys=[], excluded_llm_metadata_keys=[], relationships={}, text="The Dow and other indexes opened higher on Thursday as the latest jobs report suggests the Federal Reserve may lower interest rates this year. Why McDonald\'s and Starbucks stocks should be avoided according to one analyst Off English Weekly jobless claims have risen to 231,000, up by 22,000 from the previous week. , this marks the highest level since August. This has raised hopes among investors that the central bank may reduce interest rates at some point this year. Meanwhile, , while the Swedish Riksbank and is expected to do so again this year.", start_char_idx=None, end_char_idx=None, text_template=\'{metadata_str}\\n\\n{content}\', metadata_template=\'{key}: {value}\', metadata_seperator=\'\\n\'), Document(id_=\'12cf1913-b637-4351-96fa-dd0a4e1dc6bd\', embedding=None, metadata={}, excluded_embed_metadata_keys=[], excluded_llm_metadata_keys=[], relationships={}, text=\'Following the news, the stock declined 9.5% in mid-morning trading. Bitcoin jumps to $64,000 rebounded to morning The latest surge in Bitcoin price comes amid the resurgence of. Grayscale’s Bitcoin ETF has finally seen inflows. According to data compiled by , , which is the biggest Bitcoin ETF in terms of assets, received $63 million from investors on Friday. This marks the end of daily outflows that had been occurring for almost four months since its conversion to a spot ETF structure in January.\', start_char_idx=None, end_char_idx=None, text_template=\'{metadata_str}\\n\\n{content}\', metadata_template=\'{key}: {value}\', metadata_seperator=\'\\n\'), Document(id_=\'fbd457e6-188f-464d-83f3-99303e2f2fc2\', embedding=None, metadata={}, excluded_embed_metadata_keys=[], excluded_llm_metadata_keys=[], relationships={}, text=\'Its debt due 2025 is trading at 73 cents on the dollar, and its 2026 debt is at 55 cents. Following the news, the stock declined 9.7% by the end of the day. On the other hand, Spirit Airlines’ rivals soar on Monday. American Airlines, Southwest Airlines, and United Airlines were among the top-performing stocks, up 5.7%, 4.8%, and 4.4%, respectively. Stocks of Paramount soar amid acquisition discussions Shares of Paramount Global went up 3% by the end of the day amid ongoing discussions about who will acquire the streaming and entertainment company.\', start_char_idx=None, end_char_idx=None, text_template=\'{metadata_str}\\n\\n{content}\', metadata_template=\'{key}: {value}\', metadata_seperator=\'\\n\')]', tool_name='search_and_retrieve_highlights', raw_input={'args': (), 'kwargs': {'query': 'US stock market news', 'num_results': 5, 'start_published_date': '2024-04-09', 'end_published_date': '2024-05-09'}}, raw_output=[Document(id_='26e0ccec-3b57-4785-ba20-fe0478051db3', embedding=None, metadata={}, excluded_embed_metadata_keys=[], excluded_llm_metadata_keys=[], relationships={}, text='Companies have repurchased more than $383 billion in shares over the past 13 weeks, according to Deutsche Bank research reported by Yahoo. This marks a 30% increase from the same period last year and is the highest level since June 2018. The Dow rose 75 points, or 0.2%, to 38,958 near midday. The S&P 500 dipped 0.1%, and the Nasdaq dropped 0.2%. AMC Entertainment and Robinhood will release their quarterly reports after markets close.', start_char_idx=None, end_char_idx=None, text_template='{metadata_str}\n\n{content}', metadata_template='{key}: {value}', metadata_seperator='\n'), Document(id_='5ffa10c4-700a-4c08-84f5-cdfe69189547', embedding=None, metadata={}, excluded_embed_metadata_keys=[], excluded_llm_metadata_keys=[], relationships={}, text='The California-based company reported a net loss of $270.6 million, or 43 cents per share, for the current period. This is compared to a loss of $268.3 million, or 44 cents per share, in the same period last year. Wall Street’s analysts predicted a per-share loss of 53 cents. Revenue increased by 22.3% to $801.3 million, falling short of the expectation of $918.8 million. Its bookings rose by 19% to $923.8 million, just missing expectations of $930.4 million.', start_char_idx=None, end_char_idx=None, text_template='{metadata_str}\n\n{content}', metadata_template='{key}: {value}', metadata_seperator='\n'), Document(id_='1bca8b42-4322-46ac-b423-fc9b076baf25', embedding=None, metadata={}, excluded_embed_metadata_keys=[], excluded_llm_metadata_keys=[], relationships={}, text="The Dow and other indexes opened higher on Thursday as the latest jobs report suggests the Federal Reserve may lower interest rates this year. Why McDonald's and Starbucks stocks should be avoided according to one analyst Off English Weekly jobless claims have risen to 231,000, up by 22,000 from the previous week. , this marks the highest level since August. This has raised hopes among investors that the central bank may reduce interest rates at some point this year. Meanwhile, , while the Swedish Riksbank and is expected to do so again this year.", start_char_idx=None, end_char_idx=None, text_template='{metadata_str}\n\n{content}', metadata_template='{key}: {value}', metadata_seperator='\n'), Document(id_='12cf1913-b637-4351-96fa-dd0a4e1dc6bd', embedding=None, metadata={}, excluded_embed_metadata_keys=[], excluded_llm_metadata_keys=[], relationships={}, text='Following the news, the stock declined 9.5% in mid-morning trading. Bitcoin jumps to $64,000 rebounded to morning The latest surge in Bitcoin price comes amid the resurgence of. Grayscale’s Bitcoin ETF has finally seen inflows. According to data compiled by , , which is the biggest Bitcoin ETF in terms of assets, received $63 million from investors on Friday. This marks the end of daily outflows that had been occurring for almost four months since its conversion to a spot ETF structure in January.', start_char_idx=None, end_char_idx=None, text_template='{metadata_str}\n\n{content}', metadata_template='{key}: {value}', metadata_seperator='\n'), Document(id_='fbd457e6-188f-464d-83f3-99303e2f2fc2', embedding=None, metadata={}, excluded_embed_metadata_keys=[], excluded_llm_metadata_keys=[], relationships={}, text='Its debt due 2025 is trading at 73 cents on the dollar, and its 2026 debt is at 55 cents. Following the news, the stock declined 9.7% by the end of the day. On the other hand, Spirit Airlines’ rivals soar on Monday. American Airlines, Southwest Airlines, and United Airlines were among the top-performing stocks, up 5.7%, 4.8%, and 4.4%, respectively. Stocks of Paramount soar amid acquisition discussions Shares of Paramount Global went up 3% by the end of the day amid ongoing discussions about who will acquire the streaming and entertainment company.', start_char_idx=None, end_char_idx=None, text_template='{metadata_str}\n\n{content}', metadata_template='{key}: {value}', metadata_seperator='\n')], is_error=False)], source_nodes=[], is_dummy_stream=False)

```

As you can see, the output generation is enriched with the context of our Exa Search query result!

[CrewAI agents with Exa](/reference/crewai)[Tool calling with GPT](/reference/tool-calling-with-gpt4o)

[x](https://twitter.com/exaailabs)[discord](https://discord.com/invite/HCShtBqbfV)

[Powered by Mintlify](https://mintlify.com/preview-request?utm%5Fcampaign=poweredBy&utm%5Fmedium=referral&utm%5Fsource=docs.exa.ai)

On this page

* [Get Started](#get-started)