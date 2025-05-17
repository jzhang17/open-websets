[Exa home page![light logo](https://mintlify.s3.us-west-1.amazonaws.com/exa-52/logo/light.png)![dark logo](https://mintlify.s3.us-west-1.amazonaws.com/exa-52/logo/dark.png)](/)

Search or ask...

* [Exa Search](https://exa.ai/search)
* [Log In](https://dashboard.exa.ai/login)
* [API Dashboard](https://dashboard.exa.ai/login?redirect=/)
* [API Dashboard](https://dashboard.exa.ai/login?redirect=/)

Search...

Navigation

Live Demos

Hallucination Detector

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

Live Demos

# Hallucination Detector

A live demo that detects hallucinations in content using Exa’s search.

[\> try the app](https://demo.exa.ai/hallucination-detector)

---

We built a live hallucination detector that uses Exa to verify LLM-generated content. When you input text, the app breaks it into individual claims, searches for evidence to verify each one, and returns relevant sources with a verification confidence score.

A claim is a single, verifiable statement that can be proven true or false - like “The Eiffel Tower is in Paris” or “It was built in 1822.”

[![Screenshot%202024-11-19%20at%203.19.48%E2%80%AFPM](https://mintlify.s3.us-west-1.amazonaws.com/exa-52/images/Screenshot%202024-11-19%20at%203.19.48%E2%80%AFPM.png)Click here to try it out.](https://demo.exa.ai/hallucination-detector) 

This document explains the functions behind the three steps of the fact-checker:

1. The LLM extracts verifiable claims from your text
2. Exa searches for relevant sources for each claim
3. The LLM evaluates each claim against its sources, returning whether or not its true, along with a confidence score.

See the full [step-by-step guide](/examples/identifying-hallucinations-with-exa) and [github repo](https://github.com/exa-labs/exa-hallucination-detector) if you’d like to recreate. 

---

## 

[​](#function-breakdown)

Function breakdown

1

Extracting claims

The `extract_claims` function uses an LLM (Anthropic’s, in this case) to identify distinct, verifiable statements from your inputted text, returning these claims as a JSON array of strings.

For simpilicity, we did not include a try/catch block in the code below. However, if you are building your own hallucination detector, you should include one that catches any errors in the LLM parsing and uses a regex method that treats each sentence (text between capital letter and end punctuation) as a claim.

Python

```python
def extract_claims(text: str) -> List[str]:
    """Extract factual claims from the text using an LLM."""
    system_message = SystemMessage(content="""
        You are an expert at extracting claims from text.
        Your task is to identify and list all claims present, true or false,
        in the given text. Each claim should be a single, verifiable statement.
        Present the claims as a JSON array of strings.
    """)
    
    human_message = HumanMessage(content=f"Extract factual claims from this text: {text}")
    response = llm.invoke([system_message, human_message])
    
    claims = json.loads(response.content)
    return claims

```

2

Searching for evidence

The `exa_search` function uses Exa search to find evidence for each extracted claim. For every claim, it retrieves the 5 most relevant sources, formats them with their URLs and content (`text`), passing them to the next function for verification.

Python

```python
def exa_search(query: str) -> List[str]:
    """Retrieve relevant documents using Exa's semantic search."""
    search = ExaSearchRetriever(k=5, text=True)
    
    document_prompt = PromptTemplate.from_template("""
        <source>
            <url>{url}</url>
            <text>{text}</text>
        </source>
    """)
    
    parse_info = RunnableLambda(
        lambda document: {
            "url": document.metadata["url"],
            "text": document.page_content or "No text available",
        }
    )
    
    document_chain = (parse_info | document_prompt)
    search_chain = search | document_chain.map()
    documents = search_chain.invoke(query)
    
    return [str(doc) for doc in documents]

```

3

Verifying claims

The `verify_claim` function checks each claim against the sources from `exa_search`. It uses an LLM to determine if the sources support or refute the claim and returns a decision with a confidence score. If no sources are found, it returns “insufficient information”.

Python

```python
def verify_claim(claim: str, sources: List[str]) -> Dict[str, Any]:
    """Verify a single claim using combined Exa search sources."""
    if not sources:
        return {
            "claim": claim,
            "assessment": "Insufficient information",
            "confidence_score": 0.5,
            "supporting_sources": [],
            "refuting_sources": []
        }
    
    combined_sources = "\n\n".join(sources)
    
    system_message = SystemMessage(content="""
        You are an expert fact-checker.
        Given a claim and sources, determine whether the claim is supported,
        refuted, or lacks sufficient evidence.
        Provide your answer as a JSON object with assessment and confidence score.
    """)
    
    human_message = HumanMessage(content=f'Claim: "{claim}"\nSources:\n{combined_sources}')
    response = llm.invoke([system_message, human_message])
    
    return json.loads(response.content)

```

Using LLMs to extract claims and verify them against Exa search sources is a simple way to detect hallucinations in content. If you’d like to recreate it, the full documentation for the script is [here](/examples/identifying-hallucinations-with-exa) and the github repo is [here](https://github.com/exa-labs/exa-hallucination-detector).

[Exa MCP](/examples/exa-mcp)[Writing Assistant](/examples/demo-exa-powered-writing-assistant)

[x](https://twitter.com/exaailabs)[discord](https://discord.com/invite/HCShtBqbfV)

[Powered by Mintlify](https://mintlify.com/preview-request?utm%5Fcampaign=poweredBy&utm%5Fmedium=referral&utm%5Fsource=docs.exa.ai)

On this page

* [Function breakdown](#function-breakdown)