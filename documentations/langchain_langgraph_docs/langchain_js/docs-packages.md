[Skip to main content](#__docusaurus_skipToContent_fallback)

**Help us build the JS tools that power AI apps at companies like Replit, Uber, LinkedIn, GitLab, and more. [Join our team!](https://jobs.ashbyhq.com/langchain/05efa205-8560-43fd-bfcc-3f7697561cfb?utm_source=https%3A%2F%2Fjs.langchain.com%2F&utm_campaign=langchainjs_docs)**

[![🦜️🔗 Langchain](/img/brand/wordmark.png)![🦜️🔗 Langchain](/img/brand/wordmark-dark.png)](/)[Integrations](/docs/integrations/platforms/)[API Reference](https://v03.api.js.langchain.com)

More

* [People](/docs/people/)
* [Community](/docs/community)
* [Error reference](/docs/troubleshooting/errors)
* [External guides](/docs/additional_resources/tutorials)
* [Contributing](/docs/contributing)

v0.3

* [v0.3](/docs/introduction)
* [v0.2](https://js.langchain.com/v0.2/docs/introduction)
* [v0.1](https://js.langchain.com/v0.1/docs/get_started/introduction)

🦜🔗

* [LangSmith](https://smith.langchain.com)
* [LangSmith Docs](https://docs.smith.langchain.com)
* [LangChain Hub](https://smith.langchain.com/hub)
* [LangServe](https://github.com/langchain-ai/langserve)
* [Python Docs](https://python.langchain.com/)

[Chat](https://chatjs.langchain.com)

Search

On this page

# 📕 Package Versioning

As of now, LangChain has an ad hoc release process: releases are cut with high frequency by
a maintainer and published to [PyPI](https://pypi.org/).
The different packages are versioned slightly differently.

## `@langchain/core`[​](#langchaincore "Direct link to langchaincore")

`@langchain/core` is currently on version `0.1.x`.

As `@langchain/core` contains the base abstractions and runtime for the whole LangChain ecosystem, we will communicate any breaking changes with advance notice and version bumps. The exception for this is anything marked with the `beta` decorator (you can see this in the API reference and will see warnings when using such functionality). The reason for beta features is that given the rate of change of the field, being able to move quickly is still a priority.

Minor version increases will occur for:

* Breaking changes for any public interfaces marked as `beta`.

Patch version increases will occur for:

* Bug fixes
* New features
* Any changes to private interfaces
* Any changes to `beta` features

## `langchain`[​](#langchain "Direct link to langchain")

`langchain` is currently on version `0.1.x`

Minor version increases will occur for:

* Breaking changes for any public interfaces NOT marked as `beta`.

Patch version increases will occur for:

* Bug fixes
* New features
* Any changes to private interfaces
* Any changes to `beta` features

We are working on the `langchain` v0.2 release, which will have some breaking changes to legacy Chains and Agents.
Additionally, we will remove `@langchain/community` as a dependency and stop re-exporting integrations that have been moved to `@langchain/community`.

## `@langchain/community`[​](#langchaincommunity "Direct link to langchaincommunity")

`@langchain/community` is currently on version `0.0.x`

All changes will be accompanied by a patch version increase.

## Partner Packages[​](#partner-packages "Direct link to Partner Packages")

Partner packages are versioned independently.

---

#### Was this page helpful?

#### You can also leave detailed feedback [on GitHub](https://github.com/langchain-ai/langchainjs/issues/new?assignees=&labels=03+-+Documentation&projects=&template=documentation.yml&title=DOC%3A+%3CPlease+write+a+comprehensive+title+after+the+%27DOC%3A+%27+prefix%3E).

* [`@langchain/core`](#langchaincore)
* [`langchain`](#langchain)
* [`@langchain/community`](#langchaincommunity)
* [Partner Packages](#partner-packages)

Community

* [Twitter](https://twitter.com/LangChainAI)

GitHub

* [Python](https://github.com/langchain-ai/langchain)
* [JS/TS](https://github.com/langchain-ai/langchainjs)

More

* [Homepage](https://langchain.com)
* [Blog](https://blog.langchain.dev)

Copyright © 2025 LangChain, Inc.