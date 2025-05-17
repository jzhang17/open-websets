[Exa home page![light logo](https://mintlify.s3.us-west-1.amazonaws.com/exa-52/logo/light.png)![dark logo](https://mintlify.s3.us-west-1.amazonaws.com/exa-52/logo/dark.png)](/)

Search or ask...

* [Exa Search](https://exa.ai/search)
* [Log In](https://dashboard.exa.ai/login)
* [API Dashboard](https://dashboard.exa.ai/login?redirect=/)
* [API Dashboard](https://dashboard.exa.ai/login?redirect=/)

Search...

Navigation

Tutorials

Company Analyst

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

Tutorials

# Company Analyst

Example project using the Exa Python SDK.

---

## 

[​](#what-this-doc-covers)

What this doc covers

1. Using Exa’s link similarity search to find related links
2. Using the keyword search setting with Exa search\_and\_contents

---

In this example, we’ll build a company analyst tool that researches companies relevant to what you’re interested in. If you just want to see the code, check out the [Colab notebook](https://colab.research.google.com/drive/1VROD6zsaDh%5FrSmogSpSn9FJCwmJO8TSi?here).

The code requires an [Exa API key](https://dashboard.exa.ai/api-keys) and an [OpenAI API key](https://platform.openai.com/api-keys). Get 1000 free Exa searches per month just for [signing up](https://dashboard.exa.ai/overview)!

## 

[​](#shortcomings-of-google)

Shortcomings of Google

Say we want to find companies similar to [Thrifthouse](https://thrift.house/), a platform for selling secondhand goods on college campuses. Unfortunately, googling “[companies similar to Thrifthouse](https://www.google.com/search?q=companies+similar+to+Thrifthouse)” doesn’t do a very good job. Traditional search engines rely heavily on keyword matching. In this case we get results about physical thrift stores. Hm, that’s not really what I want.

Let’s try again, this time searching based on a description of the company, like by googling “[community based resale apps](https://www.google.com/search?q=community+based+resale+apps).” But, this isn’t very helpful either and just returns premade SEO-optimized listicles…

What we really need is neural search.

## 

[​](#what-is-neural-search%3F)

What is neural search?

Exa is a fully neural search engine built using a foundational embeddings model trained for webpage retrieval. It’s capable of understanding entity types (company, blog post, Github repo), descriptors (funny, scholastic, authoritative), and any other semantic qualities inside of a query. Neural search can be far more useful than traditional keyword-based searches for these complex queries.

## 

[​](#finding-companies-with-exa-link-similarity-search)

Finding companies with Exa link similarity search

Let’s try Exa, using the Python SDK! We can use the`find_similar_and_contents` function to find similar links and get contents from each link. The input is simply a URL, <https://thrift.house> and we set `num_results=10`(this is customizable up to thousands of results in Exa).

By specifying `highlights={"num_sentences":2}` for each search result, Exa will also identify and return a two sentence excerpt from the content that’s relevant to our query. This will allow us to quickly understand each website that we find.

Python

```Python
!pip install exa_py

from exa_py import Exa
import os

EXA_API_KEY= os.environ.get("EXA_API_KEY")

exa = Exa(api_key=EXA_API_KEY)
input_url = "https://thrift.house"

search_response = exa.find_similar_and_contents(
        input_url,
        highlights={"num_sentences":2},
        num_results=10)

companies = search_response.results

print(companies[0])

```

This is an example of the full first result:

```
[Result(url='https://www.mystorestash.com/',
        id='lMTt0MBzc8ztb6Az3OGKPA',
        title='The Airbnb of Storage',
        score=0.758899450302124,
        published_date='2023-01-01',
        author=None,
        text=None,
        highlights=["I got my suitcase picked up right from my dorm and didn't have to worry for the whole summer.Angela Scaria /Still have questions?Where are my items stored?"],
        highlight_scores=[0.23423566609247845])]

```

And here are the 10 titles and URLs I got:

Python

```Python
# to just see the 10 titles and urls
urls = {}
for c in companies:
  print(c.title + ':' + c.url)

```

\- College Marketplace:https://www.rumieapp.com/

```rumie
The Airbnb of Storage:https://www.mystorestash.com/
Bunction.net:https://bunction.net/
Home - Community Gearbox:https://communitygearbox.com/
NOVA SHOPPING:https://www.novashoppingapp.com/
Re-Fridge: Buy, sell, or store your college fridge - Re-Fridge:https://www.refridge.com/
Jamble: Social Fashion Resale:https://www.jambleapp.com/
Branded Resale | Treet:https://www.treet.co/
Swapskis:https://www.swapskis.co/
Earn Money for Used Clothing:https://www.thredup.com/cleanout?redirectPath=%2Fcleanout%2Fsell

```

Looks pretty darn good! As a bonus specifically for companies data, specifying `category="company"` in the SDK will search across a curated, larger companies dataset - if you’re interested in this, let us know at [\[email protected\]](/cdn-cgi/l/email-protection#e28a878e8e8da2879a83cc838b)!

Now that we have 10 companies we want to dig into further, let’s do some research on each of these companies.

## 

[​](#finding-additional-info-for-each-company)

Finding additional info for each company

Now let’s get more information by finding additional webpages about each company. To do this, we’re going to do a keyword search of each company’s URL. We’re using keyword because we want to find webpages that exactly match the company we’re inputting. We can do this with the `search_and_contents` function, and specify `type="keyword"` and `num_results=5`. This will give me 5 websites about each company.

Python

```python
# doing an example with the first companies
c = companies[0]
all_contents = ""
search_response = exa.search_and_contents(
  c.url, # input the company's URL
  type="keyword",
  num_results=5
)
research_response = search_response.results
for r in research_response:
  all_contents += r.text

```

Here’s an example of the first result for the first company, Rumie App. You can see the first result is the actual link contents itself.

```
<div><div><div><div><p><a href="https://www.rumieapp.com/"></a></p></div><div><p>The <strong>key</strong> to <strong>your</strong> college experience. </p><p><br/>Access the largest college exclusive marketplace to buy, sell, and rent with other students.</p></div></div><div><h2>320,000+</h2><p>Users in Our Network</p></div><div><div><p><h2>Selling is just a away.</h2></p><p>Snap a pic, post a listing, and message buyers all from one intuitive app.</p><div><p></p><p>Quick setup and .edu verification</p></div><div><p></p><p>Sell locally or ship to other campuses</p></div><div><p></p><p>Trade with other students like you</p></div></div><div><p><h2>. From local businesses around your campus</h2></p><h4>Get access to student exclusive discounts</h4><p>rumie students get access to student exclusive discounts from local and national businesses around their campus.</p></div></div><div><p><h2>Rent dresses from   </h2></p><p>Wear a new dress every weekend! Just rent it directly from a student on your campus.</p><div><p></p><p>Make money off of the dresses you've already worn</p></div><div><p></p><p>rumie rental guarantee ensures your dress won't be damaged</p></div><div><p></p><p>Find a new dress every weekend and save money</p></div></div><div><p><h2>. The only place to buy student tickets at student prices</h2></p><h4>Buy or Sell students Football and Basketball tickets with your campus</h4><p>rumie students get access to the first-ever student ticket marketplace. No more getting scammed trying to buy tickets from strangers on the internet.</p></div><div><div><div><p></p><h4>Secure</h4><p>.edu authentication and buyer protection on purchases.</p></div><div><p></p><h4>Lightning-fast</h4><p>Post your first listing in under a minute.</p></div><div><p></p><h4>Verified Students</h4><p>Trade with other students, not strangers.</p></div><div><p></p><h4>Intuitive</h4><p>List an item in a few simple steps. Message sellers with ease.</p></div></div><p><a href="https://apps.apple.com/us/app/rumie-college-marketplace/id1602465206">Download the app now</a></p></div><div><p><h2>Trusted by students.</h2></p><div><div><p></p><p>Saves me money</p><p>Facebook Marketplace and Amazon are great but often times you have to drive a long way to meet up or pay for shipping. rumie let’s me know what is available at my school… literally at walking distance. </p></div><div><p></p><p>5 stars!</p><p>Having this app as a freshman is great! It makes buying and selling things so safe and easy! Much more efficient than other buy/sell platforms!</p></div><div><p></p><p>Amazing!</p><p>5 stars for being simple, organized, safe, and a great way to buy and sell in your college community.. much more effective than posting on Facebook or Instagram!</p></div><div><p></p><p>The BEST marketplace for college students!!!</p><p>Once rumie got to my campus, I was excited to see what is has to offer! Not only is it safe for students like me, but the app just has a great feel and is really easy to use. The ONLY place I’ll be buying and selling while I’m a student.</p></div></div></div><div><p><h2>Easier to than GroupMe or Instagram.</h2></p><p>Forget clothing instas, selling groupme's, and stress when buying and selling. Do it all from the rumie app.</p></div></div></div>

```

## 

[​](#creating-a-report-with-llms)

Creating a report with LLMs

Finally, let’s create a summarized report that lists our 10 companies and gives us an easily digestible summary of each company. We can input all of this web content into an LLM and have it generate a nice report!

python

```Python
import textwrap
import openai
import os

SYSTEM_MESSAGE = "You are a helpful assistant writing a research report about a company. Summarize the users input into multiple paragraphs. Be extremely concise, professional, and factual as possible. The first paragraph should be an introduction and summary of the company. The second paragraph should include pros and cons of the company. Things like what are they doing well, things they are doing poorly or struggling with. And ideally, suggestions to make the company better."
openai.api_key = os.environ.get("OPENAI_API_KEY")

completion = openai.chat.completions.create(
    model="gpt-4",
    messages=[
        {"role": "system", "content": SYSTEM_MESSAGE},
        {"role": "user", "content": all_contents},
    ],
)

summary = completion.choices[0].message.content

print(f"Summary for {c.url}:")
print(textwrap.fill(summary, 80))

```

```
Summary for https://www.rumieapp.com/:
Rumie is a college-exclusive marketplace app that allows students to buy, sell,
and rent items with other students. It has over 320,000 users in its network and
offers features such as quick setup, .edu verification, local and campus-wide
selling options, and exclusive discounts from local businesses. Students can
also rent dresses from other students, buy or sell student tickets at student
prices, and enjoy secure and intuitive transactions. The app has received
positive feedback from users for its convenience, safety, and effectiveness in
buying and selling within the college community.

Pros of Rumie include its focus on college students' needs, such as providing a
safe platform and exclusive deals for students. The app offers an intuitive and
fast setup process, making it easy for students to start buying and selling.
The option to trade with other students is also appreciated. Users find it convenient
that they can sell locally or ship items to other campuses. The app's rental
guarantee for dresses provides assurance to users that their dresses won't be
damaged. Overall, Rumie is highly regarded as a simple, organized, and safe
platform for college students to buy and sell within their community.
Suggestions to improve Rumie include expanding its reach to more colleges and
universities across the nation and eventually internationally. Enhancing
marketing efforts and fundraising can aid in raising awareness among college
students. Additionally, incorporating features such as improved search filters
and a rating/review system for buyers and sellers could enhance the user
experience. Continual updates and improvements to the app's interface and
functionality can also ensure that it remains user-friendly and efficient.

```

And we’re done! We’ve built an app that takes in a company webpage and uses Exa to

1. Discover similar startups
2. Find information about each of those startups
3. Gather useful content and summarize it with OpenAI

Hopefully you found this tutorial helpful and are ready to start building your very own company analyst! Whether you want to generate sales leads or research competitors to your own company, Exa’s got you covered.

[RAG Q&A](/examples/exa-rag)[Exa Researcher - JavaScript](/examples/exa-researcher)

[x](https://twitter.com/exaailabs)[discord](https://discord.com/invite/HCShtBqbfV)

[Powered by Mintlify](https://mintlify.com/preview-request?utm%5Fcampaign=poweredBy&utm%5Fmedium=referral&utm%5Fsource=docs.exa.ai)

On this page

* [What this doc covers](#what-this-doc-covers)
* [Shortcomings of Google](#shortcomings-of-google)
* [What is neural search?](#what-is-neural-search%3F)
* [Finding companies with Exa link similarity search](#finding-companies-with-exa-link-similarity-search)
* [Finding additional info for each company](#finding-additional-info-for-each-company)
* [Creating a report with LLMs](#creating-a-report-with-llms)