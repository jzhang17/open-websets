Writing Assistant - Exa

[Exa home page![light logo](https://mintlify.s3.us-west-1.amazonaws.com/exa-52/logo/light.png)![dark logo](https://mintlify.s3.us-west-1.amazonaws.com/exa-52/logo/dark.png)](/)

Search or ask...

* [Exa Search](https://exa.ai/search)
* [Log In](https://dashboard.exa.ai/login)
* [API Dashboard](https://dashboard.exa.ai/login?redirect=/)
* [API Dashboard](https://dashboard.exa.ai/login?redirect=/)

Search...

Navigation

Live Demos

Writing Assistant

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

Live Demos

# Writing Assistant

[Click here to try the Exa-powered Writing Assistant](https://demo.exa.ai/writing)

[Click here to see the relevant GitHub repo and hosting instructions](https://github.com/exa-labs/exa-writing-assist)

## [​](#what-this-doc-covers) What this doc covers

* Live demo link for hands-on experience (above!)
* Overview of a real-time writing assistant using Exa and Claude
* Breakdown of Exa query prompt engineering and generative AI system prompt

## [​](#demo-overview) Demo overview

## [​](#high-level-overview) High-level overview

This demo showcases a real-time writing assistant that uses Exa’s search capabilities to provide relevant information and citations as a user writes. The system combines Exa’s neural search with Anthropic’s Claude AI model to generate contextually appropriate content and citations.

Conceptual block diagram of how the writing assistant works

## [​](#exa-prompting-and-query-style) Exa prompting and query style

The Exa search is performed using a unique query style that appends the user’s input with a prompt for continuation. Here’s the relevant code snippet:

JavaScript

```

let exaQuery = conversationState.length > 1000
    ? (conversationState.slice(-1000))+"\n\nIf you found the above interesting, here's another useful resource to read:"
    : conversationState+"\n\nIf you found the above interesting, here's another useful resource to read:"

let exaReturnedResults = await exa.searchAndContents(
    exaQuery,
    {
        type: "neural",
        numResults: 10,
        highlights: {
            numSentences: 1,
            highlightsPerUrl: 1
        }
    }
)

```

**Key aspects of this query style:**

* **Continuation prompt:** The crucial post-pend “A helpful source to read so you can continue writing the above:”
  + This prompt is designed to find sources that can logically continue the user’s writing when passed to an LLM to generate content.
  + It leverages Exa’s ability to understand context and find semantically relevant results.
  + By framing the query as a request for continuation, it aligns with how people naturally share helpful links.
* **Length limitation:** It caps the query at 1000 characters to maintain relevance and continue writing just based on the last section of the text.

Note this prompt is not a hard and fast rule for this use-case - we encourage experimentation with query styles to get the best results for your specific use case. For instance, you could further constrain down to just research papers.

## [​](#prompting-claude-with-exa-results) Prompting Claude with Exa results

The Claude AI model is prompted with a carefully crafted system message and passed the above formatted Exa results. Here is an example system prompt:

TypeScript

```
const systemPrompt = `You are an essay-completion bot that continues/completes a sentence given some input stub of an essay/prose. You only complete 1-2 SHORT sentence MAX. If you get an input of a half sentence or similar, DO NOT repeat any of the preceding text of the prose. THIS MEANS DO NOT INCLUDE THE STARTS OF INCOMPLETE SENTENCES IN YOUR RESPONSE. This is also the case when there is a spelling, punctuation, capitalization or other error in the starter stub - e.g.:

USER INPUT: pokemon is a
YOUR CORRECT OUTPUT: Japanese franchise created by Satoshi Tajiri.
NEVER/INCORRECT: Pokémon is a Japanese franchise created by Satoshi Tajiri.

USER INPUT: Once upon a time there
YOUR CORRECT OUTPUT: was a princess.
NEVER/INCORRECT: Once upon a time, there was a princess.

USER INPUT: Colonial england was a
YOUR CORRECT OUTPUT: time of great change and upheaval.
NEVER/INCORRECT: Colonial England was a time of great change and upheaval.

USER INPUT: The fog in san francisco
YOUR CORRECT OUTPUT: is a defining characteristic of the city's climate.
NEVER/INCORRECT: The fog in San Francisco is a defining characteristic of the city's climate.

USER INPUT: The fog in san francisco
YOUR CORRECT OUTPUT: is a defining characteristic of the city's climate.
NEVER/INCORRECT: The fog in San Francisco is a defining characteristic of the city's climate.

 Once you have made one citation, stop generating. BE PITHY. Where there is a full sentence fed in,
 you should continue on the next sentence as a generally good flowing essay would. You have a
 specialty in including content that is cited. Given the following two items, (1) citation context and
 (2) current essay writing, continue on the essay or prose inputting in-line citations in
 parentheses with the author's name, right after that followed by the relevant URL in square brackets.
 THEN put a parentheses around all of the above. If you cannot find an author (sometimes it is empty), use the generic name 'Source'.
 ample citation for you to follow the structure of: ((AUTHOR_X, 2021)[URL_X]).
 If there are more than 3 author names to include, use the first author name plus 'et al'`

```

This prompt ensures that:

* Claude will only do completions, not parrot back the user query like in a typical chat based scenario. Note the inclusion of multiple examples that demonstrate Claude should not reply back with the stub even if there are errors, like spelling or grammar, in the input text (which we found to be a common issue)
* We define the citation style and formatting. We also tell the bot went to collapse authors into ‘et al’ style citations, as some webpages have many authors

Once again, experimenting with this prompt is crucial to getting best results for your particular use case.

## [​](#conclusion) Conclusion

This demo illustrates the power of combining Exa’s advanced search capabilities with generative AI to create a writing assistant. By leveraging Exa’s neural search and content retrieval features, the system can provide relevant, up-to-date information to any AI model, resulting in contextually appropriate content generation with citations.

This approach showcases how Exa can be integrated into AI-powered applications to enhance user experiences and productivity.

[Click here to try the Exa-powered Writing Assistant](https://demo.exa.ai/writing)

[Hallucination Detector](/examples/demo-hallucination-detector)[Chat app](/examples/demo-chat)

[x](https://twitter.com/exaailabs)[discord](https://discord.com/invite/HCShtBqbfV)

[Powered by Mintlify](https://mintlify.com/preview-request?utm_campaign=poweredBy&utm_medium=referral&utm_source=docs.exa.ai)

On this page

* [What this doc covers](#what-this-doc-covers)
* [Demo overview](#demo-overview)
* [High-level overview](#high-level-overview)
* [Exa prompting and query style](#exa-prompting-and-query-style)
* [Prompting Claude with Exa results](#prompting-claude-with-exa-results)
* [Conclusion](#conclusion)