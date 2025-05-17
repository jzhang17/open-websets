[ Skip to content](#langgraph-over-time) 

**Help us build the JS tools that power AI apps at companies like Replit, Uber, LinkedIn, GitLab, and more. [Join our team!](https://jobs.ashbyhq.com/langchain/05efa205-8560-43fd-bfcc-3f7697561cfb?utm%5Fsource=https%3A%2F%2Flangchain-ai.github.io%2Flanggraphjs%2F&utm%5Fcampaign=langgraphjs%5Fdocs)** 

[ ![logo](../static/wordmark_dark.svg) ![logo](../static/wordmark_light.svg) ](..) 

 LangGraph Over Time 

[ ](javascript:void%280%29 "Share") 

 Initializing search

[  GitHub ](https://github.com/langchain-ai/langgraphjs "Go to repository") 

* [ LangGraph](..)
* [ Agents](../agents/overview/)
* [ API reference](../reference/)
* [ Versions](./)

[ ![logo](../static/wordmark_dark.svg) ![logo](../static/wordmark_light.svg) ](..) 

[  GitHub ](https://github.com/langchain-ai/langgraphjs "Go to repository") 

* [  LangGraph ](..)
* [  Agents ](../agents/overview/)
* [  API reference ](../reference/)
* [  Versions ](./)  
 Versions

 Table of contents 
* [  Version History ](#version-history)  
   * [  v0.2.0 (Latest) ](#v020-latest)  
   * [  v0.1.0 ](#v010)
* [  Upgrading ](#upgrading)  
   * [  Upgrading to v0.2.0 ](#upgrading-to-v020)  
   * [  Upgrading to v0.1.0 ](#upgrading-to-v010)
* [  Deprecation Notices ](#deprecation-notices)  
   * [  MessageGraph ](#messagegraph)  
   * [  createFunctionCallingExecutor ](#createfunctioncallingexecutor)  
   * [  ToolExecutor ](#toolexecutor)
* [  Full changelog ](#full-changelog)

# LangGraph Over Time[¶](#langgraph-over-time "Permanent link")

As LangGraph.js continues to evolve and improve, breaking changes are sometimes necessary to enhance functionality, performance, or developer experience. This page serves as a guide to the version history of LangGraph.js, documenting significant changes and providing assistance for upgrading between versions.

## Version History[¶](#version-history "Permanent link")

### v0.2.0 (Latest)[¶](#v020-latest "Permanent link")

* (Breaking) [@langchain/core](https://www.npmjs.com/package/@langchain/core) is now a peer dependency and requires explicit installation.
* Added support for [dynamic breakpoints](/langgraphjs/how-tos/dynamic%5Fbreakpoints/).
* Added support for [separate input and output schema](/langgraphjs/how-tos/input%5Foutput%5Fschema/).
* Allow using an array to specify destination nodes from a conditional edge as shorthand for object.
* Numerous bugfixes.

### v0.1.0[¶](#v010 "Permanent link")

* (Breaking) Changed checkpoint representations to support namespacing for subgraphs and pending writes.
* (Breaking) `MessagesState` was changed to [MessagesAnnotation](/langgraphjs/reference/variables/langgraph.MessagesAnnotation.html).
* Added [Annotation](/langgraphjs/reference/modules/langgraph.Annotation.html), a more streamlined way to declare state. Removes the need for separate type and channel declarations.
* Split checkpointer implementations into different libraries for easier inheritance.
* Major internal architecture refactor to use more robust patterns.
* Deprecated `MessageGraph` in favor of [StateGraph](/langgraphjs/reference/classes/langgraph.StateGraph.html) \+ [MessagesAnnotation](/langgraphjs/reference/variables/langgraph.MessagesAnnotation.html).
* Numerous bugfixes.

## Upgrading[¶](#upgrading "Permanent link")

When upgrading LangGraph.js, please refer to the specific version sections below for detailed instructions on how to adapt your code to the latest changes.

### Upgrading to v0.2.0[¶](#upgrading-to-v020 "Permanent link")

* You will now need to install `@langchain/core` explicitly. See [this page](https://langchain-ai.github.io/langgraphjs/how-tos/manage-ecosystem-dependencies/) for more information.

### Upgrading to v0.1.0[¶](#upgrading-to-v010 "Permanent link")

* Old saved checkpoints will no longer be valid, and you will need to update to use a new prebuilt checkpointer.
* We recommend switching to the new `Annotation` syntax when declaring graph state.

## Deprecation Notices[¶](#deprecation-notices "Permanent link")

This section will list any deprecated features or APIs, along with their planned removal dates and recommended alternatives.

#### `MessageGraph`[¶](#messagegraph "Permanent link")

Use [MessagesAnnotation](/langgraphjs/reference/variables/langgraph.MessagesAnnotation.html) with [StateGraph](/langgraphjs/reference/classes/langgraph.StateGraph.html).

#### `createFunctionCallingExecutor`[¶](#createfunctioncallingexecutor "Permanent link")

Use [createReactAgent](/langgraphjs/reference/functions/langgraph%5Fprebuilt.createReactAgent.html) with a model that supports tool calling.

#### `ToolExecutor`[¶](#toolexecutor "Permanent link")

Use [ToolNode](/langgraphjs/reference/classes/langgraph%5Fprebuilt.ToolNode.html) instead.

## Full changelog[¶](#full-changelog "Permanent link")

For the most up-to-date information on LangGraph.js versions and changes, please refer to our [GitHub repository](https://github.com/langchain-ai/langgraphjs) and [release notes](https://github.com/langchain-ai/langgraphjs/releases).

 Was this page helpful? 

 Thanks for your feedback!

 Thanks for your feedback! Please help us improve this page by adding to the discussion below.

 Back to top 

[  Previous  Environment variables ](../cloud/reference/env%5Fvar/) 

 Copyright © 2025 LangChain, Inc | [Consent Preferences](#%5F%5Fconsent) 

 Made with[ Material for MkDocs Insiders](https://squidfunk.github.io/mkdocs-material/) 

[ ](https://langchain-ai.github.io/langgraph/ "langchain-ai.github.io") [ ](https://github.com/langchain-ai/langgraphjs "github.com") [ ](https://twitter.com/LangChainAI "twitter.com") 

#### Cookie consent

We use cookies to recognize your repeated visits and preferences, as well as to measure the effectiveness of our documentation and whether users find what they're searching for. **Clicking "Accept" makes our documentation better. Thank you!** ❤️

* Google Analytics
* GitHub

Accept Reject 