Building a Hallucination Checker - Exa

[Exa home page![light logo](https://mintlify.s3.us-west-1.amazonaws.com/exa-52/logo/light.png)![dark logo](https://mintlify.s3.us-west-1.amazonaws.com/exa-52/logo/dark.png)](/)

Search or ask...

* [Exa Search](https://exa.ai/search)
* [Log In](https://dashboard.exa.ai/login)
* [API Dashboard](https://dashboard.exa.ai/login?redirect=/)
* [API Dashboard](https://dashboard.exa.ai/login?redirect=/)

Search...

Navigation

Tutorials

Building a Hallucination Checker

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

Tutorials

# Building a Hallucination Checker

Learn how to build an AI-powered system that identifies and verifies claims using Exa and LangGraph.

---

We’ll build a hallucination detection system using Exa’s search capabilities to verify AI-generated claims. The system works in three steps:

1. Extract claims from text
2. Search for evidence using Exa
3. Verify claims against evidence

This combines RAG with LangGraph to fact-check AI outputs and reduce hallucinations by grounding claims in real-world data.

---

## [​](#get-started) Get Started

1

Pre-requisites and installation

Install the required packages:

```
pip install langchain-core langgraph langchain-exa langchain-anthropic pydantic

```

You’ll need both an Exa API key and an Anthropic API key to run this example. You can get your Anthropic API key [here](https://console.anthropic.com/).

[## Get your Exa API key](https://dashboard.exa.ai/api-keys)

Set up your API keys:

Python

```
import os
import re
import json
from typing import Dict, Any, List, Annotated
from pydantic import BaseModel
from langchain_core.tools import StructuredTool
from langgraph.graph import StateGraph, END
from langgraph.graph.message import add_messages
from langchain_core.messages import HumanMessage, SystemMessage, AIMessage
from langchain_exa import ExaSearchRetriever
from langchain_core.runnables import RunnableLambda
from langchain_core.prompts import PromptTemplate
from langchain_anthropic import ChatAnthropic

# Check for API keys
assert os.getenv("EXA_API_KEY"), "Please set the EXA_API_KEY environment variable"
assert os.getenv("ANTHROPIC_API_KEY"), "Please set the ANTHROPIC_API_KEY environment variable"

# Set up the LLM (ChatAnthropic)
llm = ChatAnthropic(model="claude-3-5-sonnet-20240620", temperature=0)

```

2

Create the claim extractor

First, we’ll create functions to extract factual claims from the text:

Python

```
def extract_claims_regex(text: str) -> List[str]:
    """Fallback function to extract claims using regex."""
    pattern = r'([A-Z][^.!?]*?[.!?])'
    matches = re.findall(pattern, text)
    return [match.strip()+'.' for match in matches]

def extract_claims(text: str) -> List[str]:
    """Extract factual claims from the text using an LLM."""
    system_message = SystemMessage(content="""
    You are an expert at extracting claims from text.
    Your task is to identify and list all claims present, true or false,
    in the given text. Each claim should be a single, verifiable statement.
    Consider various forms of claims, including assertions, statistics, and
    quotes. Do not skip any claims, even if they seem obvious. Do not include in the list 'The text contains a claim that needs to be checked for hallucinations' - this is not a claim.
    Present the claims as a JSON array of strings, and do not include any additional text.
    """)

    human_message = HumanMessage(content=f"Extract factual claims from this text: {text}")
    response = llm.invoke([system_message, human_message])

    try:
        claims = json.loads(response.content)
        if not isinstance(claims, list):
            raise ValueError("Response is not a list")
    except (json.JSONDecodeError, ValueError):
        # Fallback to regex extraction if LLM response is not valid JSON
        claims = extract_claims_regex(text)

    return claims

```

We include a regex-based fallback method in case the LLM response isn’t properly formatted. This ensures our system remains robust even if the LLM output is unexpected.

3

Set up Exa search

Create a function to search for evidence using Exa:

Python

```
def exa_search(query: str) -> List[str]:
    """Function to retrieve usable documents for AI assistant."""
    search = ExaSearchRetriever(k=5, text=True)

    print("Query: ", query)

    document_prompt = PromptTemplate.from_template(
        """
        <source>
            <url>{url}</url>
            <text>{text}</text>
        </source>
        """
    )

    parse_info = RunnableLambda(
        lambda document: {
            "url": document.metadata["url"],
            "text": document.page_content or "No text available",
        }
    )

    document_chain = (parse_info | document_prompt)
    search_chain = search | document_chain.map()
    documents = search_chain.invoke(query+".\n Here is a web page to help verify this claim:")

    print("Documents: ", documents)

    return [str(doc) for doc in documents]

```

We format each source with its URL and content for easy reference in the verification step. The print statements help with debugging and understanding the search process.

4

Create the claim verifier

Build a function to analyze the evidence and assess each claim:

Python

```
def verify_claim(claim: str, sources: List[str]) -> Dict[str, Any]:
    """Verify a single claim using combined Exa search sources."""
    if not sources:
        # If no sources are returned, default to insufficient information
        return {
            "claim": claim,
            "assessment": "Insufficient information",
            "confidence_score": 0.5,
            "supporting_sources": [],
            "refuting_sources": []
        }

    # Combine the sources into one text
    combined_sources = "\n\n".join(sources)

    system_message = SystemMessage(content="""
    You are an expert fact-checker.
    Given a claim and a set of sources, determine whether the claim is supported, refuted, or if there is insufficient information in the sources to make a determination.
    For your analysis, consider all the sources collectively.
    Provide your answer as a JSON object with the following structure:
    {
        "claim": "...",
        "assessment": "supported" or "refuted" or "Insufficient information",
        "confidence_score": a number between 0 and 1 (1 means fully confident the claim is true, 0 means fully confident the claim is false),
        "supporting_sources": [list of sources that support the claim],
        "refuting_sources": [list of sources that refute the claim]
    }
    Do not include any additional text.
    """)

    human_message = HumanMessage(content=f"""
    Claim: "{claim}"

    Sources:
    {combined_sources}

    Based on the above sources, assess the claim.
    """)

    response = llm.invoke([system_message, human_message])

    try:
        result = json.loads(response.content)
        if not isinstance(result, dict):
            raise ValueError("Response is not a JSON object")
    except (json.JSONDecodeError, ValueError):
        # If parsing fails, default to insufficient information
        result = {
            "claim": claim,
            "assessment": "Insufficient information",
            "confidence_score": 0.5,
            "supporting_sources": [],
            "refuting_sources": []
        }

    return result

```

The verifier includes robust error handling and defaults to “Insufficient information” if there are issues with the LLM response or source processing.

5

Create the workflow

Set up the LangGraph workflow to orchestrate the process:

Python

```
def hallucination_check(text: str) -> Dict[str, Any]:
    """Check a given text for hallucinations using Exa search."""
    claims = extract_claims(text)
    claim_verifications = []

    for claim in claims:
        sources = exa_search(claim)
        verification_result = verify_claim(claim, sources)
        claim_verifications.append(verification_result)

    return {
        "claims": claim_verifications
    }

def hallucination_check_tool(text: str) -> Dict[str, Any]:
    """Assess the given text for hallucinations using Exa search."""
    return hallucination_check(text)

structured_tool = StructuredTool.from_function(
    func=hallucination_check_tool,
    name="hallucination_check",
    description="Assess the given text for hallucinations using Exa search."
)

class State(BaseModel):
    messages: Annotated[List, add_messages]
    analysis_result: Dict[str, Any] = {}

def call_model(state: State):
    # Simulate the assistant calling the tool
    return {"messages": state.messages + [AIMessage(content="Use hallucination_check tool", additional_kwargs={"tool_calls": [{"type": "function", "function": {"name": "hallucination_check"}}]})]}

def run_tool(state: State):
    text_to_check = next((m.content for m in reversed(state.messages) if isinstance(m, HumanMessage)), "")
    tool_output = structured_tool.invoke(text_to_check)
    return {"messages": state.messages + [AIMessage(content=str(tool_output))], "analysis_result": tool_output}

def use_analysis(state: State) -> str:
    return "tools"

workflow = StateGraph(State)
workflow.add_node("agent", call_model)
workflow.add_node("tools", run_tool)
workflow.add_node("process_result", lambda x: x)
workflow.set_entry_point("agent")
workflow.add_conditional_edges("agent", use_analysis, {
    "tools": "tools"
})
workflow.add_edge("tools", "process_result")
workflow.add_edge("process_result", END)

graph = workflow.compile()

```

6

Test the system

Let’s try it with a sample text about the Eiffel Tower:

Python

```
initial_state = State(messages=[
    SystemMessage(content="You are a helpful assistant."),
    HumanMessage(content="Check this text for hallucinations: The Eiffel Tower, an iconic iron lattice structure located in Paris, was originally constructed as a giant sundial in 1822.")
])

final_state = graph.invoke(initial_state)

```

Sample output:

```
Workflow executed successfully
Final state:
Messages:
SystemMessage: You are a helpful assistant....
HumanMessage: Check this text for hallucinations: The Eiffel Tower, an iconic iron lattice structure located in Pa...
AIMessage: Use hallucination_check tool...
AIMessage: {'claims': [{'claim': 'The Eiffel Tower is an iconic iron lattice structure', 'assessment': 'support...

Analysis Result:
Claim: The Eiffel Tower is an iconic iron lattice structure
Assessment: supported
Confidence Score: 1
Supporting Sources:
- https://www.toureiffel.paris/en/news/130-years/what-eiffel-tower-made...
- https://thechalkface.net/resources/melting_the_eiffel_tower.pdf...
- https://datagenetics.com/blog/april22016/index.html...
- https://engineering.purdue.edu/MSE/aboutus/gotmaterials/Buildings/patel.html...
- https://www.toureiffel.paris/en/news/130-years/how-long-can-tower-last...
Refuting Sources:

Claim: The Eiffel Tower is located in Paris
Assessment: supported
Confidence Score: 1
Supporting Sources:
- https://hoaxes.org/weblog/comments/is_the_eiffel_tower_copyrighted...
- https://www.toureiffel.paris/en...
- http://www.eiffeltowerguide.com/...
- https://www.toureiffel.paris/en/the-monument...
Refuting Sources:

Claim: The Eiffel Tower was originally constructed as a giant sundial
Assessment: refuted
Confidence Score: 0.05
Supporting Sources:
Refuting Sources:
- https://www.whycenter.com/why-was-the-eiffel-tower-built/...
- https://www.sciencekids.co.nz/sciencefacts/engineering/eiffeltower.html...
- https://corrosion-doctors.org/Landmarks/eiffel-history.htm...

Claim: The Eiffel Tower was constructed in 1822
Assessment: refuted
Confidence Score: 0
Supporting Sources:
Refuting Sources:
- https://www.eiffeltowerfacts.org/eiffel-tower-history/...
- https://www.whycenter.com/why-was-the-eiffel-tower-built/...
- https://www.sciencekids.co.nz/sciencefacts/engineering/eiffeltower.html...

```

Through this combination of Exa’s search capabilities and LangGraph’s workflow management, we’ve created a powerful system for identifying and verifying claims in any text. The system successfully identified both true claims (structure and location) and false claims (construction date and purpose) about the Eiffel Tower.

[Building a News Summarizer](/examples/recent-news-summarizer)[RAG Q&A](/examples/exa-rag)

[x](https://twitter.com/exaailabs)[discord](https://discord.com/invite/HCShtBqbfV)

[Powered by Mintlify](https://mintlify.com/preview-request?utm_campaign=poweredBy&utm_medium=referral&utm_source=docs.exa.ai)

On this page

* [Get Started](#get-started)