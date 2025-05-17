Recruiting Agent - Exa

[Exa home page![light logo](https://mintlify.s3.us-west-1.amazonaws.com/exa-52/logo/light.png)![dark logo](https://mintlify.s3.us-west-1.amazonaws.com/exa-52/logo/dark.png)](/)

Search or ask...

* [Exa Search](https://exa.ai/search)
* [Log In](https://dashboard.exa.ai/login)
* [API Dashboard](https://dashboard.exa.ai/login?redirect=/)
* [API Dashboard](https://dashboard.exa.ai/login?redirect=/)

Search...

Navigation

Tutorials

Recruiting Agent

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

# Recruiting Agent

---

## [​](#what-this-doc-covers) What this doc covers

1. Using Exa search with includeDomain to only retrieve search results from a specified domain
2. Using Exa keyword search to find specific people by name
3. Using excludeDomain to ignore certain low-signal domains
4. Using Exa link similarity search to find similar websites

---

## [​](#introduction) Introduction

In this tutorial, we use Exa to **automate** the process of **discovering**, **researching**, and **evaluating** exceptional candidates. If you just want to see the code, check out the [Colab notebook](https://colab.research.google.com/drive/1a-7niLbCtIEjZnPz-qXPS3XwckPgIMrV?usp=sharing).

Here’s what we’re going to do:

1. Candidate research: Identify potential candidates and use Exa to find additional details, such as personal websites, LinkedIn profiles, and their research topics.
2. Candidate evaluation: Evaluate candidates using an LLM to score their fit to our hiring criteria.
3. Finding more candidates: Discover more candidates similar to our top picks.

This project requires an [Exa API key](https://dashboard.exa.ai/api-keys) and an [OpenAI API key](https://platform.openai.com/api-keys). Get 1000 Exa searches per month free just for [signing up](https://dashboard.exa.ai/overview)!

Python

```
# install dependencies
!pip install exa_py openai matplotlib tqdm

import pandas as pd
from exa_py import Exa
import openai

EXA_API_KEY = ''
OPENAI_API_KEY = ''

exa = Exa(api_key = EXA_API_KEY)
openai.api_key = OPENAI_API_KEY

```

## [​](#initial-candidates) Initial Candidates

Suppose I’m building Simile, an AI startup for web retrieval.

My hiring criteria is:

* AI experience
* interest in retrieval, databases, and knowledge
* available to work now or soon

We start with 13 example PhD students recommended by friends. All I have is their name and email.

Python

```
# Usually you would upload a csv of students
# df = pd.read_csv('./students.csv')

# TODO: add your own candidates
sample_data = {
    "Name": [
        "Kristy Choi", "Jiaming Song", "Brice Huang", "Andi Peng",
        "Athiya Deviyani", "Hao Zhu", "Zana Bucinca", "Usha Bhalla",
        "Kia Rahmani", "Jingyan Wang", "Jun-Kun Wang", "Sanmi Koyejo",
        "Erik Jenner"
    ],
    "Email": [
        "[[email protected]](/cdn-cgi/l/email-protection)", "[[email protected]](/cdn-cgi/l/email-protection)",
        "[[email protected]](/cdn-cgi/l/email-protection)", "[[email protected]](/cdn-cgi/l/email-protection)",
        "[[email protected]](/cdn-cgi/l/email-protection)", "[[email protected]](/cdn-cgi/l/email-protection)",
        "[[email protected]](/cdn-cgi/l/email-protection)", "[[email protected]](/cdn-cgi/l/email-protection)",
        "[[email protected]](/cdn-cgi/l/email-protection)", "[[email protected]](/cdn-cgi/l/email-protection)",
        "[[email protected]](/cdn-cgi/l/email-protection)", "[[email protected]](/cdn-cgi/l/email-protection)",
        "[[email protected]](/cdn-cgi/l/email-protection)"
    ]
}

# Creating the DataFrame
students_df = pd.DataFrame(sample_data)
students_df

```

## [​](#information-enrichment) Information Enrichment

Now, let’s add more information about the candidates: current school, LinkedIn, and personal website.

First, we’ll define a helper function to call OpenAI — we’ll use this for many of our later functions.

Python

```
def get_openai_response(input_text):
    # if contents is empty
    if not input_text:
        return ""
    completion = openai.chat.completions.create(
            model="gpt-3.5-turbo-0125",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": input_text},
            ],
            temperature=0
        )
    return completion.choices[0].message.content

```

We’ll ask GPT to extract the candidate’s school from their email address.

Python

```
def extract_school_from_email(email):
  content =  f"I'm going to give you a student's email. I want you to figure out what school they go to. For example, if the email is [[email protected]](/cdn-cgi/l/email-protection) you should return 'CMU' and nothing else. Only return the name of the school. Here is their email: {email}"
  return get_openai_response(content)

# Example
extract_school_from_email('[[email protected]](/cdn-cgi/l/email-protection)')

```

Now that we have their school, let’s use Exa to find their LinkedIn and personal website too.

Here, we’re passing in `type="keyword"` to do an Exa keyword search because we want our results to have the exact name in the result. We also specify `include_domains=['linkedin.com']` to restrict the results to LinkedIn profiles.

Python

```
def get_linkedin_from_name(name, school = ''):
    query = f"{name} {school}"

    keyword_search = exa.search(query, num_results=1, type="keyword", include_domains=['linkedin.com'])

    if keyword_search.results:
        result = keyword_search.results[0]
        return result.url
    print(f"No LinkedIn found for: {name}")
    return None

print("LinkedIn:", get_linkedin_from_name('Sarah Chieng', 'MIT'))

```

To now find the candidate’s personal website, we can use the same Exa query, but we want to also scrape the website’s contents. To do this, we use `search_and_contents`.

We can also exclude some misleading websites with `exclude_domains=['linkedin.com', 'github.com', 'twitter.com']`. Whatever’s left has a good chance of being their personal site!

Python

```
#given a name, returns their personal website if we can find it
def exa_search_personal_website(name, school = ''):
    query = f"{name} {school}"
    keyword_search = exa.search_and_contents(query, type="keyword", text={"include_html_tags": False}, num_results=1, exclude_domains=['linkedin.com', 'github.com', 'twitter.com'])
    if keyword_search.results:
        result = keyword_search.results[0]
        return result.url, result.text
    print(f"No personal website found for: {name}")
    return (None, None)

#example
personal_website_url, personal_website_text = exa_search_personal_website('Aryaman Arora', 'Stanford')
personal_website_url

```

Now that I have personal websites of each candidate, we can use Exa and GPT-4 to answer questions like:

* what are they doing now? Or what class year are they?
* where did they do their undergrad?
* what topics do they research?
* are they an AI researcher?

Once we have all of the page’s contents, let’s start asking some questions:

Python

```
def extract_undergrad_from_contents(contents):
    contents = f"""I'm going to give you some information I found online about a person. Based on the provided information, determine where they went to college for undergrad.
    Some examples are \"MIT\" or \"Harvard.\" You should answer only in the example format, or return \"not sure\" if you're not sure. Do not return any other text. Here is the information I have scraped: {contents}."""
    return get_openai_response(contents)

def extract_current_role_from_contents(contents):
    contents = f"""I'm going to give you some information I found online about a person. Based on the provided information, determine where they are currently working or if they are still a student, what their current year of study is.
    Some examples are \"OpenAI\" or \"first year PHD.\" You should answer only in the example format, or return \"not sure\" if you're not sure. Do not return any other text. Here is the information I have scraped: {contents}."""
    return get_openai_response(contents)

def extract_research_topics_from_contents(contents):
    contents = f"""I'm going to give you some information I found online about a person. Based on the provided information, determine what fields they research.
    Some examples are \"RAG, retrieval, and databases\" or \"Diffusion models.\" You should answer only in the example format, or return \"not sure\" if you're not sure. Do not return any other text. Here is the information I have scraped: {contents}."""
    return get_openai_response(contents)

def extract_is_ai_from_contents(contents):
    contents = f"""I'm going to give you some information I found online about a person. Based on the provided information, determine whether they are a AI researcher.
    You should only return \"yes\" or \"no\", or return \"not sure\" if you're not sure. Do not return any other text. Here is the information I have scraped: {contents}."""
    return get_openai_response(contents)

#Example
personal_website_url, personal_website_text = exa_search_personal_website('Aryaman Arora', 'Stanford') # Note: this is a random person I found online using an Exa search

undergrad = extract_undergrad_from_contents(personal_website_text)
current = extract_current_role_from_contents(personal_website_text)
topics = extract_research_topics_from_contents(personal_website_text)
ai = extract_is_ai_from_contents(personal_website_text)

# Printing the information using f-string formatting
print(f"Personal Site: {personal_website_url}")
print(f"Undergrad: {undergrad}")
print(f"Current: {current}")
print(f"Topics: {topics}")
print(f"AI: {ai}")

```

## [​](#candidate-evaluation) Candidate Evaluation

Next, we use GPT-4 to score candidates 1-10 based on fit. This way, we can use Exa to find more folks similar to our top-rated candidates.

Python

```
# TODO: change these to fit your own criteria

def calculate_score(info, undergrad, year, researchTopics, AI):
    contents = f"""I'm going to provide some information about an individual, and I want you to rate on a scale of 1 to 10 how good of a hiring candidate they are. I am hiring for AI researchers.
    A 10 is someone who went to an incredible college, is graduating soon (final year PhD ideally) or is already graduated, is definitely an AI researcher, has a lot of experience and seems really smart, and a nice bonus is if their research is related to retrieval, search, databases. Only return an integer from 0 to 10. Do not return anything else. This candidate did undergrad at {undergrad} and their current role is {year}. Are they an AI researcher? {AI}. They do research in {researchTopics}. Here are some other things I know about them: {info}"""
    try:
        return int(get_openai_response(contents))
    except:
        return None

```

Finally, let’s enrich our dataframe of people. We define a function `enrich_row` that uses all the functions we defined to learn more about a candidate,and sort by score to get the most promising candidates.

Python

```
# Set up progress bar
from tqdm.auto import tqdm
tqdm.pandas()

def enrich_row(row):
    row['School'] = extract_school_from_email(row['Email'])
    linkedIn_info = get_linkedin_from_name(row['Name'], row['School'])
    if linkedIn_info:
        row['LinkedIn'] = linkedIn_info
    website_url, website_info = exa_search_personal_website(row['Name'], row['School'])
    row['ExaWebsite'] = website_url
    row['ContentInfo'] = website_info
    row['Undergrad'] = extract_undergrad_from_contents(row['ContentInfo'])
    row['Role'] = extract_current_role_from_contents(row['ContentInfo'])
    row['ResearchTopics'] = extract_research_topics_from_contents(row['ContentInfo'])
    row['AI'] = extract_is_ai_from_contents(row['ContentInfo'])
    row['Score'] = calculate_score(row['ContentInfo'], row['Undergrad'], row['Role'], row['ResearchTopics'], row['AI'])
    return row

enriched_df = students_df.progress_apply(enrich_row, axis=1)
sorted_df = enriched_df.sort_values(by='Score', ascending=False).reset_index(drop=True)
sorted_df

```

## [​](#finding-more-candidates) Finding more candidates

Now that we know how to research candidates, let’s find some more! We’ll take each of the top candidates (score 7-10), and use Exa to find similar profiles.

Exa’s `find_similar`,allows us to search a URL and find semantically similar URLs. For example, I could search ‘hinge.co’ and it’ll return the homepages of similar dating apps. In this case, we’ll pass in the homepages of our top candidates to find similar profiles.

Python

```
# given a homepage, get homepages of similar candidates

def get_more_candidates(homepageURL):
  new_homepages = []
  if not homepageURL:
    return None
  similarity_search = exa.find_similar_and_contents(homepageURL, num_results=3, text={"include_html_tags": False}, exclude_domains=['linkedin.com', 'github.com', 'twitter.com'])

  #return a list of emails
  for res in similarity_search.results:
    new_homepages.append((res.url, res.text))
  return new_homepages

# we can already get things like role and education, but we need to get the name and email this time
def get_name_from_contents(contents):
    content = f"""I'm going to give you some information I found online about a person. Based on the provided information, figure out their full name.
    Some examples are \"Sarah Chieng\" or \"Will Bryk.\" You should answer only in the example format, or return \"not sure\" if you're not sure. Do not return any other text. Here is the information I have scraped: {contents}."""
    return get_openai_response(content)

def get_email_from_contents(contents):
    content = f"""I'm going to give you some information I found online about a person. Based on the provided information, figure out their email.
    Some examples are \"[[email protected]](/cdn-cgi/l/email-protection)\" or \"[[email protected]](/cdn-cgi/l/email-protection).\" You should answer only in the example format, or return \"not sure\" if you're not sure. Do not return any other text. Here is the information I have scraped: {contents}."""
    return get_openai_response(content)

# Example
example_homepage = ('https://winniexu.ca/')
additional_homepages = get_more_candidates(example_homepage)
new_candidate_url, new_candidate_content = additional_homepages[0]
name = get_name_from_contents(new_candidate_content)
email = get_email_from_contents(new_candidate_content)

print(f"Additional Homepages:{additional_homepages}")
print(f"Name:{name}")
print(f"Email: {email}")

```

Final stretch — let’s put it all together. Let’s find and add our new candidates to our original dataframe.

Python

```
def new_candidates_df(df):
    # get the websites of our top candidates
    top_candidates_df = df[df['Score'] > 7]
    websites_list = top_candidates_df['ExaWebsite'].tolist()

    # use those top candidates to find new candidates
    new_candidates = set()
    for url in websites_list:
      new_candidates.update(get_more_candidates(url))

    #for each new candidate, get their information and add them to the dataframe
    names = []
    emails = []
    urls = []
    for url, content in tqdm(new_candidates):
      names.append(get_name_from_contents(content))
      emails.append(get_email_from_contents(content))
      urls.append(url)

    new_df = pd.DataFrame({
        'Name': names,
        'Email': emails,
        'ExaWebsite': urls,
    })

    return new_df

new_df = new_candidates_df(sorted_df)
new_df

```

Alrighty, that’s it! We’ve just built an automated way of finding, researching, and evaluating candidates. You can use this for recruiting, or tailor this to find customers, companies, etc.

And the best part is that every time you use Exa to find new candidates, you can do more `find_similar(new_candidate_homepage)` searches with the new candidates as well — helping you build an infinite list!

Hope this tutorial was helpful and don’t forget, you can get started with [Exa for free](https://dashboard.exa.ai/overview) :)

[Exa Researcher - Python](/examples/exa-researcher-python)[Phrase Filters: Niche Company Finder](/examples/niche-company-finder-with-phrase-filters)

[x](https://twitter.com/exaailabs)[discord](https://discord.com/invite/HCShtBqbfV)

[Powered by Mintlify](https://mintlify.com/preview-request?utm_campaign=poweredBy&utm_medium=referral&utm_source=docs.exa.ai)

On this page

* [What this doc covers](#what-this-doc-covers)
* [Introduction](#introduction)
* [Initial Candidates](#initial-candidates)
* [Information Enrichment](#information-enrichment)
* [Candidate Evaluation](#candidate-evaluation)
* [Finding more candidates](#finding-more-candidates)