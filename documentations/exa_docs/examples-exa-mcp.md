Exa MCP - Exa

[Exa home page![light logo](https://mintlify.s3.us-west-1.amazonaws.com/exa-52/logo/light.png)![dark logo](https://mintlify.s3.us-west-1.amazonaws.com/exa-52/logo/dark.png)](/)

Search or ask...

* [Exa Search](https://exa.ai/search)
* [Log In](https://dashboard.exa.ai/login)
* [API Dashboard](https://dashboard.exa.ai/login?redirect=/)
* [API Dashboard](https://dashboard.exa.ai/login?redirect=/)

Search...

Navigation

Live Demos

Exa MCP

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

# Exa MCP

[Exa MCP Server](https://github.com/exa-labs/exa-mcp-server/) enables AI assistants like Claude to perform real-time web searches through the Exa Search API, allowing them to access up-to-date information from the internet in a safe and controlled way.

* Real-time web searches with optimized results
* Structured search responses (titles, URLs, content snippets)
* Support for specialized search types (web, academic, social media, etc.)

## [​](#available-tools) Available Tools

Exa MCP includes several specialized search tools:

| Tool | Description |
| --- | --- |
| `web_search` | General web search with optimized results and content extraction |
| `research_paper_search` | Specialized search focused on academic papers and research content |
| `twitter_search` | Finds tweets, profiles, and conversations on Twitter/X |
| `company_research` | Gathers detailed information about businesses by crawling company websites |
| `crawling` | Extracts content from specific URLs (articles, PDFs, web pages) |
| `competitor_finder` | Identifies competitors of a company by finding businesses with similar offerings |

## [​](#installation) Installation

### [​](#prerequisites) Prerequisites

* [Node.js](https://nodejs.org/) v18 or higher.
* [Claude Desktop](https://claude.ai/download) installed (optional). Exa MCP also works with other MCP-compatible clients like Cursor, Windsurf, and more).
* An [Exa API key](https://dashboard.exa.ai/api-keys).

### [​](#using-npx) Using NPX

The simplest way to install and run Exa MCP is via NPX:

```
# Install globally
npm install -g exa-mcp-server

# Or run directly with npx
npx exa-mcp-server

```

To specify which tools to enable:

```
# Enable only web search
npx exa-mcp-server --tools=web_search

# Enable multiple tools
npx exa-mcp-server --tools=web_search,research_paper_search,twitter_search

# List all available tools
npx exa-mcp-server --list-tools

```

## [​](#configuring-claude-desktop) Configuring Claude Desktop

To configure Claude Desktop to use Exa MCP:

1. **Enable Developer Mode in Claude Desktop**

   * Open Claude Desktop
   * Click on the top-left menu
   * Enable Developer Mode
2. **Open the Configuration File**

   * After enabling Developer Mode, go to Settings
   * Navigate to the Developer Option
   * Click “Edit Config” to open the configuration file

   Alternatively, you can open it directly:

   **macOS:**

   ```
   code ~/Library/Application\ Support/Claude/claude_desktop_config.json

   ```

   **Windows:**

   ```
   code %APPDATA%\Claude\claude_desktop_config.json

   ```
3. **Add Exa MCP Configuration**

   Add the following to your configuration:

   ```
   {
     "mcpServers": {
       "exa": {
         "command": "npx",
         "args": ["exa-mcp-server"],
         "env": {
           "EXA_API_KEY": "your-api-key-here"
         }
       }
     }
   }

   ```

   Replace `your-api-key-here` with your actual Exa API key. You can get your (Exa API here)[<https://dashboard.exa.ai/api-keys>].
4. **Enabling Specific Tools**

   To enable only specific tools:

   ```
   {
     "mcpServers": {
       "exa": {
         "command": "npx",
         "args": [
           "exa-mcp-server",
           "--tools=web_search,research_paper_search"
         ],
         "env": {
           "EXA_API_KEY": "your-api-key-here"
         }
       }
     }
   }

   ```
5. **Restart Claude Desktop**

   * Completely quit Claude Desktop (not just close the window)
   * Start Claude Desktop again
   * Look for the 🔌 icon to verify the Exa server is connected

## [​](#usage-examples) Usage Examples

Once configured, you can ask Claude to perform searches:

* “Search for recent developments in quantum computing”
* “Find and analyze recent research papers about climate change solutions”
* “Search Twitter for posts from @elonmusk about SpaceX”
* “Research the company exa.ai and find information about their pricing”
* “Extract the content from this research paper: <https://arxiv.org/pdf/1706.03762>”
* “Find competitors for a company that provides web search API services”

## [​](#troubleshooting) Troubleshooting

### [​](#common-issues) Common Issues

1. **Server Not Found**

   * Ensure the npm package is correctly installed
2. **API Key Issues**

   * Confirm your EXA\_API\_KEY is valid
   * Make sure there are no spaces or quotes around the API key
3. **Connection Problems**

   * Restart Claude Desktop completely

## [​](#additional-resources) Additional Resources

For more information, visit the [Exa MCP Server GitHub repository](https://github.com/exa-labs/exa-mcp-server/).

[Hallucination Detector](/examples/demo-hallucination-detector)

[x](https://twitter.com/exaailabs)[discord](https://discord.com/invite/HCShtBqbfV)

[Powered by Mintlify](https://mintlify.com/preview-request?utm_campaign=poweredBy&utm_medium=referral&utm_source=docs.exa.ai)

On this page

* [Available Tools](#available-tools)
* [Installation](#installation)
* [Prerequisites](#prerequisites)
* [Using NPX](#using-npx)
* [Configuring Claude Desktop](#configuring-claude-desktop)
* [Usage Examples](#usage-examples)
* [Troubleshooting](#troubleshooting)
* [Common Issues](#common-issues)
* [Additional Resources](#additional-resources)