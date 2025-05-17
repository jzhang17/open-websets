Structured Outputs with Instructor - Exa

[Exa home page![light logo](https://mintlify.s3.us-west-1.amazonaws.com/exa-52/logo/light.png)![dark logo](https://mintlify.s3.us-west-1.amazonaws.com/exa-52/logo/dark.png)](/)

Search or ask...

* [Exa Search](https://exa.ai/search)
* [Log In](https://dashboard.exa.ai/login)
* [API Dashboard](https://dashboard.exa.ai/login?redirect=/)
* [API Dashboard](https://dashboard.exa.ai/login?redirect=/)

Search...

Navigation

Tutorials

Structured Outputs with Instructor

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

# Structured Outputs with Instructor

Using Exa with instructor to generate structured outputs from web content.

## [​](#what-this-doc-covers) What this doc covers

* Setting up Exa to use [Instructor](https://python.useinstructor.com/) for structured output generation
* Practical examples of using Exa and Instructor together

## [​](#guide) Guide

## [​](#1-pre-requisites-and-installation) 1. Pre-requisites and installation

Install the required libraries:

Python

```
pip install exa_py instructor openai

```

Ensure API keys are initialized properly. The environment variable names are `EXA_API_KEY` and `OPENAI_API_KEY`.

[## Get your Exa API key](https://dashboard.exa.ai/api-keys)

## [​](#2-why-use-instructor%3F) 2. Why use Instructor?

Instructor is a Python library that allows you to generate structured outputs from a language model.

We could instruct the LLM to return a structured output, but the output will still be a string, which we need to convert to a dictionary. What if the dictionary is not structured as we want? What if the LLM forgot to add the last ”}” in the JSON? We would have to handle all of these errors manually.

We could use `{ "type": "json_object" }`  which will make the LLM return a JSON object. But for this, we would need to provide a JSON schema, which can get [large and complex](https://python.useinstructor.com/why/#pydantic-over-raw-schema).

Instead of doing this, we can use Instructor. Instructor is powered by [pydantic](https://docs.pydantic.dev/latest/), which means that it integrates with your IDE. We use pydantic’s `BaseModel` to define the output model:

## [​](#3-setup-and-basic-usage) 3. Setup and Basic Usage

Let’s set up Exa and Instructor:

Python

```
import os

import instructor
from exa_py import Exa
from openai import OpenAI
from pydantic import BaseModel

exa = Exa(os.environ["EXA_API_KEY"])
client = instructor.from_openai(OpenAI())

search_results = exa.search_and_contents(
    "Latest advancements in quantum computing",
    type="neural",
    text=True,
)
# Limit search_results to a maximum of 20,000 characters
search_results = search_results.results[:20000]

class QuantumComputingAdvancement(BaseModel):
    technology: str
    description: str
    potential_impact: str

    def __str__(self):
        return (
            f"Technology: {self.technology}\n"
            f"Description: {self.description}\n"
            f"Potential Impact: {self.potential_impact}"
        )

structured_output = client.chat.completions.create(
    model="gpt-3.5-turbo",
    response_model=QuantumComputingAdvancement,
    messages=[
        {
            "role": "user",
            "content": f"Based on the provided context, describe a recent advancement in quantum computing.\n\n{search_results}",
        }
    ],
)

print(structured_output)

```

Here we define a `QuantumComputingAdvancement` class that inherits from `BaseModel` from Pydantic. This class will be used by Instructor to validate the output from the LLM and for the LLM as a response model. We also implement the `__str__()` method for easy printing of the output. We then initialize `OpenAI()` and wrap instructor on top of it with `instructor.from_openai` to create a client that will return structured outputs. If the output is not structured as our class, Instructor makes the LLM retry until max\_retries is reached. You can read more about how Instructor retries [here](https://python.useinstructor.com/why/#retries).

This example demonstrates how to use Exa to search for content about quantum computing advancements and structure the output using Instructor.

## [​](#4-advanced-example%3A-analyzing-multiple-research-papers) 4. Advanced Example: Analyzing Multiple Research Papers

Let’s create a more complex example where we analyze multiple research papers on a specific topic and use pydantic’s own validation model to correct the structured data to show you how we can be *even* more fine-grained:

Python

```
import os
from typing import List

import instructor
from exa_py import Exa
from openai import OpenAI
from pydantic import BaseModel, field_validator

exa = Exa(os.environ["EXA_API_KEY"])
client = instructor.from_openai(OpenAI())

class ResearchPaper(BaseModel):
    title: str
    authors: List[str]
    key_findings: List[str]
    methodology: str

    @field_validator("title")
    @classmethod
    def validate_title(cls, v):
        if v.upper() != v:
            raise ValueError("Title must be in uppercase.")
        return v

    def __str__(self):
        return (
            f"Title: {self.title}\n"
            f"Authors: {', '.join(self.authors)}\n"
            f"Key Findings: {', '.join(self.key_findings)}\n"
            f"Methodology: {self.methodology}"
        )

class ResearchAnalysis(BaseModel):
    papers: List[ResearchPaper]
    common_themes: List[str]
    future_directions: str

    def __str__(self):
        return (
            f"Common Themes:\n- {', '.join(self.common_themes)}\n"
            f"Future Directions: {self.future_directions}\n"
            f"Analyzed Papers:\n" + "\n".join(str(paper) for paper in self.papers)
        )

# Search for recent AI ethics research papers
search_results = exa.search_and_contents(
    "Recent AI ethics research papers",
    type="neural",
    text=True,
    num_results=5,  # Limit to 5 papers for this example
)

# Combine all search results into one string
combined_results = "\n\n".join([result.text for result in search_results.results])
structured_output = client.chat.completions.create(
    model="gpt-3.5-turbo",
    response_model=ResearchAnalysis,
    max_retries=5,
    messages=[
        {
            "role": "user",
            "content": f"Analyze the following AI ethics research papers and provide a structured summary:\n\n{combined_results}",
        }
    ],
)

print(structured_output)

```

By using pydantic’s `field_validator`, we can create our own rules to validate each field to be exactly what we want, so that we can work with predictable data even though we are using an LLM. Additionally, implementing the `__str__()` method allows for more readable and convenient output formatting. Read more about different pydantic validators [here](https://docs.pydantic.dev/latest/concepts/validators/#field-validators). Because we don’t specify that the `Title` should be in uppercase in the prompt, this will result in *at least* two API calls. You should avoid using `field_validator`s as the *only* means to get the data in the right format; instead, you should include instructions in the prompt, such as specifying that the `Title` should be in uppercase/all-caps.

This advanced example demonstrates how to use Exa and Instructor to analyze multiple research papers, extract structured information, and provide a comprehensive summary of the findings.

## [​](#5-streaming-structured-outputs) 5. Streaming Structured Outputs

Instructor also supports streaming structured outputs, which is useful for getting partial results as they’re generated (this does not support validators due to the nature of streaming responses, you can read more about it [here](https://python.useinstructor.com/concepts/partial/)):

To make the output easier to see, we will use the [rich](https://pypi.org/project/rich/) Python package. It should already be installed, but if it isn’t, just run `pip install rich`.

Python

```
import os
from typing import List

import instructor
from exa_py import Exa
from openai import OpenAI
from pydantic import BaseModel
from rich.console import Console

exa = Exa(os.environ["EXA_API_KEY"])
client = instructor.from_openai(OpenAI())

class AIEthicsInsight(BaseModel):
    topic: str
    description: str
    ethical_implications: List[str]

    def __str__(self):
        return (
            f"Topic: {self.topic}\n"
            f"Description: {self.description}\n"
            f"Ethical Implications:\n- {', '.join(self.ethical_implications or [])}"
        )

# Search for recent AI ethics research papers
search_results = exa.search_and_contents(
    "Recent AI ethics research papers",
    type="neural",
    text=True,
    num_results=5,  # Limit to 5 papers for this example
)

# Combine all search results into one string
combined_results = "\n\n".join([result.text for result in search_results.results])

structured_output = client.chat.completions.create_partial(
    model="gpt-3.5-turbo",
    response_model=AIEthicsInsight,
    messages=[
        {
            "role": "user",
            "content": f"Provide insights on AI ethics based on the following research:\n\n{combined_results}",
        }
    ],
    stream=True,
)

console = Console()

for output in structured_output:
    obj = output.model_dump()
    console.clear()
    print(output)
    if (
        output.topic
        and output.description
        and output.ethical_implications is not None
        and len(output.ethical_implications) >= 4
    ):
        break

```

stream output

```
topic='AI Ethics in Mimetic Models' description='Exploring the ethical implications of AI that simulates the decisions and behavior of specific individuals, known as mimetic models, and the social impact of their availability in various domains such as game-playing, text generation, and artistic expression.' ethical_implications=['Deception Concerns: Mimetic models can potentially be used for deception, leading to misinformation and challenges in distinguishing between a real individual and a simulated model.', 'Normative Issues: Mimetic models raise normative concerns related to the interactions between the target individual, the model operator, and other entities that interact with the model, impacting transparency, authenticity, and ethical considerations in various scenarios.', 'Preparation and End-Use: Mimetic models can be used as preparation for real-life interactions or as an end in themselves, affecting interactions, personal relationships, labor dynamics, and audience engagement, leading to questions about consent, labor devaluation, and reputation consequences.', '']

Final Output:
Topic: AI Ethics in Mimetic Models
Description: Exploring the ethical implications of AI that simulates the decisions and behavior of specific individuals, known as mimetic models, and the social impact of their availability in various domains such as game-playing, text generation, and artistic expression.
Ethical Implications:
- Deception Concerns: Mimetic models can potentially be used for deception, leading to misinformation and challenges in distinguishing between a real individual and a simulated model.
- Normative Issues: Mimetic models raise normative concerns related to the interactions between the target individual, the model operator, and other entities that interact with the model, impacting transparency, authenticity, and ethical considerations in various scenarios.
- Preparation and End-Use: Mimetic models can be used as preparation for real-life interactions or as an end in themselves, affecting interactions, personal relationships, labor dynamics, and audience engagement, leading to questions about consent, labor devaluation, and reputation consequences.

```

This example shows how to stream partial results and break the loop when certain conditions are met.

## [​](#6-writing-results-to-csv) 6. Writing Results to CSV

After generating structured outputs, you might want to save the results for further analysis or record-keeping. Here’s how you can write the results to a CSV file:

Python

```
import csv
import os
from typing import List

import instructor
from exa_py import Exa
from openai import OpenAI
from pydantic import BaseModel

exa = Exa(os.environ["EXA_API_KEY"])
client = instructor.from_openai(OpenAI())

class AIEthicsInsight(BaseModel):
    topic: str
    description: str
    ethical_implications: List[str]

# Search for recent AI ethics research papers
search_results = exa.search_and_contents(
    "Recent AI ethics research papers",
    type="neural",
    text=True,
    num_results=5,  # Limit to 5 papers for this example
)

# Combine all search results into one string
combined_results = "\n\n".join([result.text for result in search_results.results])

def write_to_csv(insights: List[AIEthicsInsight], filename: str = "ai_ethics_insights.csv"):
    with open(filename, mode='w', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)
        writer.writerow(['Topic', 'Description', 'Ethical Implications'])

        for insight in insights:
            writer.writerow([
                insight.topic,
                insight.description,
                '; '.join(insight.ethical_implications)
            ])

    print(f"Results written to {filename}")

# Generate multiple insights
num_insights = 5
insights = []
for _ in range(num_insights):
    insight = client.chat.completions.create(
        model="gpt-3.5-turbo",
        response_model=AIEthicsInsight,
        messages=[
            {
                "role": "user",
                "content": f"Provide an insight on AI ethics based on the following research:\n\n{combined_results}",
            }
        ],
    )
    insights.append(insight)

# Write insights to CSV
write_to_csv(insights)

```

After running the code, you’ll have a CSV file named “ai\_ethics\_insights.csv”. Here’s an example of what the contents might look like:

```
Topic,Description,Ethical Implications
Algorithmic Bias,"This research challenges the assumption that algorithms can replace human decision-making and remain unbiased. It identifies three forms of outrage-intellectual, moral, and political-when reacting to algorithmic bias and suggests practical approaches like clarifying language around bias, developing new auditing methods, and building certain capabilities in AI systems.",Potential perpetuation of existing biases if not addressed; Necessity for transparency in AI system development; Impact on fairness and justice in societal decision-making processes; Importance of inclusive stakeholder engagement in AI design and implementation
Algorithmic Bias and Ethical Interview,"Artificial intelligence and machine learning are used to offload decision making from humans, with a misconception that machines can be unbiased. This paper critiques this assumption and discusses forms of outrage towards algorithmic biases, identifying three types: intellectual, moral, and political outrage. It suggests practical approaches such as clarifying language around bias, auditing methods, and building specific capabilities to address biases. The overall discussion urges for greater insight into conversations around algorithmic bias and its implications.","Algorithms can perpetuate and even amplify existing biases in data.; There can be a misleading assumption that machines are inherently fair and unbiased.; Algorithmic biases can trigger intellectual, moral, and political outrage, affecting societal trust in AI systems."
Algorithmic Bias and Human Decision Making,"This research delves into the misconceptions surrounding the belief that algorithms can replace human decision-making because they are inherently fair and unbiased. The study highlights the flaws in this rationale by showing that algorithms are not free from bias. It explores three types of outrage—intellectual, moral, and political—that arise when people confront algorithmic bias. The paper recommends addressing algorithmic bias through clearer language, better auditing methods, and enhanced system capabilities.","Algorithms can perpetuate and exacerbate existing biases rather than eliminate them.; The misconception that algorithms are unbiased may lead to a false sense of security in their use.; There is a need for the AI community to adopt clearer language and terms when discussing bias to prevent misunderstanding and misuse.; Enhancing auditing methods and system capabilities can help identify and address biases.; Decisions made through biased algorithms can have unjust outcomes, affecting public trust and leading to social and ethical implications."
Algorithmic Bias in AI,"Artificial intelligence and machine learning are increasingly used to offload decision making from people. In the past, one of the rationales for this replacement was that machines, unlike people, can be fair and unbiased. Evidence suggests otherwise, indicating that algorithms can be biased. The study investigates how bias is perceived in algorithmic decision-making, proposing clarity in the language around bias and suggesting new auditing methods for intelligent systems to address this concern.",Algorithms may inherit or exacerbate existing biases.; Misleading assumptions about AI's objectivity can lead to unfair outcomes.; Need for transparent language and robust auditing to mitigate bias.
Algorithmic Bias in AI Systems,"This research explores the misconception that algorithms can replace humans in decision-making without bias. It sheds light on the absurdity of assuming that algorithms are inherently unbiased and discusses emotional responses to algorithmic bias. The study suggests clarity in language about bias, new auditing methods, and capacity-building in AI systems to address bias concerns.",Misleading perception of unbiased AI leading to potential unfairness in decision-making.; Emotional and ethical concerns due to algorithmic bias perceived unfairness.; Need for consistent auditing methods to ensure fairness in AI systems.

```

Instructor has enabled the creation of structured data that can as such be stored in tabular format, e.g.in a CRM or similar.

By combining Exa’s powerful search capabilities with Instructor’s predictable output generation, you can extract and analyze information from web content efficiently and accurately.

[Build a Retrieval Agent with LangGraph](/examples/getting-started-with-rag-in-langgraph)

[x](https://twitter.com/exaailabs)[discord](https://discord.com/invite/HCShtBqbfV)

[Powered by Mintlify](https://mintlify.com/preview-request?utm_campaign=poweredBy&utm_medium=referral&utm_source=docs.exa.ai)

On this page

* [What this doc covers](#what-this-doc-covers)
* [Guide](#guide)
* [1. Pre-requisites and installation](#1-pre-requisites-and-installation)
* [2. Why use Instructor?](#2-why-use-instructor%3F)
* [3. Setup and Basic Usage](#3-setup-and-basic-usage)
* [4. Advanced Example: Analyzing Multiple Research Papers](#4-advanced-example%3A-analyzing-multiple-research-papers)
* [5. Streaming Structured Outputs](#5-streaming-structured-outputs)
* [6. Writing Results to CSV](#6-writing-results-to-csv)