[Skip to content](#api-reference)

**Help us build the JS tools that power AI apps at companies like Replit, Uber, LinkedIn, GitLab, and more. [Join our team!](https://jobs.ashbyhq.com/langchain/05efa205-8560-43fd-bfcc-3f7697561cfb?utm_source=https%3A%2F%2Flangchain-ai.github.io%2Flanggraphjs%2F&utm_campaign=langgraphjs_docs)**

[![logo](../../../../static/wordmark_dark.svg)
![logo](../../../../static/wordmark_light.svg)](../../../..)

Server API

Initializing search

[GitHub](https://github.com/langchain-ai/langgraphjs "Go to repository")

* [LangGraph](../../../..)
* [Agents](../../../../agents/overview/)
* [API reference](../../../../reference/)
* [Versions](../../../../versions/)

[![logo](../../../../static/wordmark_dark.svg)
![logo](../../../../static/wordmark_light.svg)](../../../..)

[GitHub](https://github.com/langchain-ai/langgraphjs "Go to repository")

* [LangGraph](../../../..)
* [Agents](../../../../agents/overview/)
* [API reference](../../../../reference/)

  API reference
  + LangGraph Platform

    LangGraph Platform
    - Server API

      [Server API](./)

      Table of contents
      * [Authentication](#authentication)
    - [CLI](../../cli/)
    - [SDK (Python)](../../sdk/python_sdk_ref/)
    - [SDK (JS/TS)](../../sdk/js_ts_sdk_ref.md)
    - [RemoteGraph](../../../../reference/remote_graph.md)
    - [Environment variables](../../env_var/)
* [Versions](../../../../versions/)

Table of contents

* [Authentication](#authentication)

1. [API reference](../../../../reference/)
2. [LangGraph Platform](./)

# API Reference[¶](#api-reference "Permanent link")

The LangGraph Platform API reference is available with each deployment at the `/docs` URL path (e.g. `http://localhost:8124/docs`).

Click [here](/langgraph/cloud/reference/api/api_ref.html) to view the API reference.

## Authentication[¶](#authentication "Permanent link")

For deployments to LangGraph Platform, authentication is required. Pass the `X-Api-Key` header with each request to the LangGraph Platform API. The value of the header should be set to a valid LangSmith API key for the organization where the API is deployed.

Example `curl` command:

```
curl --request POST \
  --url http://localhost:8124/assistants/search \
  --header 'Content-Type: application/json' \
  --header 'X-Api-Key: LANGSMITH_API_KEY' \
  --data '{
  "metadata": {},
  "limit": 10,
  "offset": 0
}'

```

Was this page helpful?

Thanks for your feedback!

Thanks for your feedback! Please help us improve this page by adding to the discussion below.

Back to top

[Previous

None](../../../../reference/)
[Next

CLI](../../cli/)

Copyright © 2025 LangChain, Inc | [Consent Preferences](#__consent)

Made with
[Material for MkDocs Insiders](https://squidfunk.github.io/mkdocs-material/)

#### Cookie consent

We use cookies to recognize your repeated visits and preferences, as well as to measure the effectiveness of our documentation and whether users find what they're searching for. **Clicking "Accept" makes our documentation better. Thank you!** ❤️

* Google Analytics
* GitHub

Accept
Reject