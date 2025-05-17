Hacker News Clone - Exa

[Exa home page![light logo](https://mintlify.s3.us-west-1.amazonaws.com/exa-52/logo/light.png)![dark logo](https://mintlify.s3.us-west-1.amazonaws.com/exa-52/logo/dark.png)](/)

Search or ask...

* [Exa Search](https://exa.ai/search)
* [Log In](https://dashboard.exa.ai/login)
* [API Dashboard](https://dashboard.exa.ai/login?redirect=/)
* [API Dashboard](https://dashboard.exa.ai/login?redirect=/)

Search...

Navigation

Tutorials

Hacker News Clone

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

# Hacker News Clone

Make your very own Hacker News powered by Exa

[Click here to try Exa-powered Hacker News for Anything.](https://hackernews-by-exa.replit.app/)

## [​](#what-this-doc-covers%3A) What this doc covers:

* How to create a personalized Hacker News clone using Exa’s API.
* Steps to set up and run your own news site with custom prompts.
* Customization options for the site’s content, appearance, and deployment.

*Estimated time to complete: 20 minutes*

Built by Silicon Valley legend Paul Graham in 2007, [Hacker News](https://news.ycombinator.com/) is a popular website where users post interesting tech-adjacent content. The most interesting content often comes from small blogs and personal sites. However, these gems can be really hard to find.

Thankfully, Exa’s search models are good at finding interesting sites from all corners of the web, no matter how big or small. Exa searches the web semantically, enabling you to find information based on meaning rather than SEO. We can use Exa to find super interesting tech articles without specific keywords, topics, or blogs in mind.

In this tutorial, we’ll use Exa’s API to create a clone of Hacker News. Here’s our [live example](https://hackernews-by-exa.replit.app/).

You’ll get to create your own personalized version about anything, not just tech. For instance, you could make Business News, a site that displays relevant corporate updates. Your website will automatically update to get the newest content on whatever topic you choose.

## [​](#getting-started) Getting Started

First, grab a free Exa API key by signing up [here](https://exa.ai/). You get 1000 free queries a month.

Next, fork (clone) our [template](https://replit.com/%40olafblitz/exa-hackernews-demo-nodejs?v=1) on Replit.

Once you’ve forked the template, go to the lower left corner of the screen and scroll through the options until you see “Secrets” (where you manage environment variables like API keys).

Add your Exa API key as a secret named “EXA\_API\_KEY” (original, we know).

After you’ve added your API key, click the green Run button in the top center of the window.

After a few seconds, a Webview window will pop up with your website. You’ll see a website that vaguely resembles Hacker News. It’s a basic Express.js app with some CSS styling.

## [​](#how-exa-works) How Exa works

In the index.js file (should be open by default), scroll to **line 19**. This is the brains of the site. It’s where we call the Exa API with a custom prompt to get back Hacker News-style content.

```
const response = await fetch('https://api.exa.ai/search', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    // Add your API key named "EXA_API_KEY" to Repl.it Secrets
    'x-api-key': process.env.EXA_API_KEY,
  },
  body: JSON.stringify({
    // change this prompt!
    query: 'here is a really interesting techy article:',
    // specify the maximum number of results to retrieve (10 is the limit for free API users)
    numResults: 10,
    // Set the start date for the article search
    startPublishedDate: startPublishedDate,
    // Set the end date for the article search
    endPublishedDate: endPublishedDate,
  }),
});

```

The prompt is set to “here is a really interesting tech article:”. This is because of how Exa works behind the scenes. Exa uses embeddings to help predict which links would naturally follow a query. For example, on the Internet, you’ll frequently see people recommend great content like this: “this tutorial really helped me understand linked lists: linkedlisttutorial.com”. When you prompt Exa, you pretend to be someone recommending what you’re looking for. In this case, our prompt nudges Exa to find links that someone would share when discussing a “really interesting tech article”.

Check out the [results](https://exa.ai/search?q=here%20is%20a%20really%20interesting%20tech%20article%3A&filters=%7B%22numResults%22%3A30%2C%22useAutoprompt%22%3Afalse%2C%22domainFilterType%22%3A%22include%22%7D) Exa returns for our prompt. Aren’t they nice?

More example prompts to help you get a sense of prompting with Exa:

* [this gadget saves me so much time:](https://exa.ai/search?c=all&q=this%20gadget%20saves%20me%20so%20much%20time%3A&filters=%7B%22domainFilterType%22%3A%22include%22%2C%22timeFilterOption%22%3A%22any%5Ftime%22%2C%22activeTabFilter%22%3A%22all%22%7D)
* [i loved my wedding dress from this boutique:](https://exa.ai/search?c=all&q=i%20loved%20my%20wedding%20dress%20from%20this%20boutique%3A&filters=%7B%22domainFilterType%22%3A%22include%22%2C%22timeFilterOption%22%3A%22any%5Ftime%22%2C%22activeTabFilter%22%3A%22all%22%7D)
* [this video helped me understand attention mechanisms:](https://exa.ai/search?c=all&q=this%20video%20helped%20me%20understand%20attention%20mechanisms%3A&filters=%7B%22domainFilterType%22%3A%22include%22%2C%22timeFilterOption%22%3A%22any%5Ftime%22%2C%22activeTabFilter%22%3A%22all%22%7D)

More examples in the Exa [docs](/reference/the-metaphor-index).

At this point, please craft your own Exa prompt for your Hacker News site. It can be about anything you find interesting.

Example ideas:

* [this is a really exciting machine learning paper:](https://exa.ai/search?c=all&q=this%20is%20a%20really%20exciting%20machine%20learning%20paper%3A&filters=%7B%22domainFilterType%22%3A%22include%22%2C%22timeFilterOption%22%3A%22past%5Fday%22%2C%22activeTabFilter%22%3A%22all%22%7D)
* [here’s a delicious new recipe:](https://exa.ai/search?c=all&q=here%27s%20a%20delicious%20new%20recipe%3A&filters=%7B%22domainFilterType%22%3A%22include%22%2C%22timeFilterOption%22%3A%22any%5Ftime%22%2C%22activeTabFilter%22%3A%22all%22%7D)
* [this company just got acquired:](https://exa.ai/search?c=all&q=this%20company%20just%20got%20acquired%3A&filters=%7B%22domainFilterType%22%3A%22include%22%2C%22timeFilterOption%22%3A%22past%5Fday%22%2C%22activeTabFilter%22%3A%22all%22%7D)
* [here’s how the basketball game went:](https://exa.ai/search?c=all&q=here%27s%20how%20the%20basketball%20game%20went%3A&filters=%7B%22domainFilterType%22%3A%22include%22%2C%22timeFilterOption%22%3A%22past%5Fday%22%2C%22activeTabFilter%22%3A%22all%22%7D)

Once you have your prompt, replace the old one (line 28 of index.js). Hit the Stop button (where the Run button was) and hit Run again to restart your site with the new prompt.

Feel free to keep tweaking your prompt until you get results you like.

## [​](#customize-your-site) Customize your site

Now, other things you can modify in the site template include the time window to search over, the number of results to return, the text on the site (title, description, footer), and styling (colors, fonts, etc.).

By default, the site asks the Exa API to get the ten most relevant results from the last 24 hours every time you visit the site. On the free plan, you can only get up to ten results, so you’ll have to sign up for an Exa plan to increase this. You *can* tweak the time window though. Lines 12 to 17 in index.js is where we set the time window. You can adjust this as you like to get results from the last week, month, year, etc. Note that you don’t have to search starting from the current date. You can search between any arbitrary dates, like October 31, 2015 and January 1, 2018.

To adjust the site title and other text, go to line 51 in index.js where the dynamic HTML starts. You can Ctrl-F “change” to find all the places where you can edit the text.

If orange isn’t your vibe, go to the styles.css. To get there, go to the left side panel on Replit and click on the “public” folder.

To keep your site running all the time, you’ll need to deploy it on Replit using Deployments. Click Deploy in the top right corner and select Autoscale. You can leave the default settings and click Deploy. This does cost money though. Alternatively you can deploy the site on your own. It’s only two files (index.js and public/styles.css).

Well, there you have it! You just made your very own Hacker News-style site using the Exa API. Share it on X and [tag us](https://x.com/ExaAILabs) for a retweet!

[Live demo twitterx post retrieval](/examples/live-demo-twitterx-post-retrieval)[Building a News Summarizer](/examples/recent-news-summarizer)

[x](https://twitter.com/exaailabs)[discord](https://discord.com/invite/HCShtBqbfV)

[Powered by Mintlify](https://mintlify.com/preview-request?utm_campaign=poweredBy&utm_medium=referral&utm_source=docs.exa.ai)

On this page

* [What this doc covers:](#what-this-doc-covers%3A)
* [Getting Started](#getting-started)
* [How Exa works](#how-exa-works)
* [Customize your site](#customize-your-site)