[ Skip to content](#how-to-do-a-self-hosted-deployment-of-langgraph) 

**Help us build the JS tools that power AI apps at companies like Replit, Uber, LinkedIn, GitLab, and more. [Join our team!](https://jobs.ashbyhq.com/langchain/05efa205-8560-43fd-bfcc-3f7697561cfb?utm%5Fsource=https%3A%2F%2Flangchain-ai.github.io%2Flanggraphjs%2F&utm%5Fcampaign=langgraphjs%5Fdocs)** 

[ ![logo](../../static/wordmark_dark.svg) ![logo](../../static/wordmark_light.svg) ](../..) 

 How to do a Self-hosted deployment of LangGraph 

[ ](javascript:void%280%29 "Share") 

 Initializing search

[  GitHub ](https://github.com/langchain-ai/langgraphjs "Go to repository") 

* [ LangGraph](../..)
* [ Agents](../../agents/overview/)
* [ API reference](../../reference/)
* [ Versions](../../versions/)

[ ![logo](../../static/wordmark_dark.svg) ![logo](../../static/wordmark_light.svg) ](../..) 

[  GitHub ](https://github.com/langchain-ai/langgraphjs "Go to repository") 

* [  LangGraph ](../..)  
 LangGraph  
   * Get started  
    Get started  
         * [  Learn the basics ](../../tutorials/quickstart/)  
         * [  Deployment ](../../tutorials/deployment/)  
   * Guides  
    Guides  
         * [  How-to Guides ](../)  
          How-to Guides  
                  * [  Installation ](../../how-tos#installation)  
                  * [  LangGraph ](../../how-tos#langgraph)  
                  * LangGraph Platform  
                   LangGraph Platform  
                              * [  LangGraph Platform ](../../how-tos#langgraph-platform)  
                              * [  Application Structure ](../../how-tos#application-structure)  
                              * Deployment  
                               Deployment  
                                             * [  Deployment ](../../how-tos#deployment)  
                                             * [  How to Deploy to Cloud SaaS ](../../cloud/deployment/cloud/)  
                                             * How to do a Self-hosted deployment of LangGraph [  How to do a Self-hosted deployment of LangGraph ](./)  
                                              Table of contents  
                                                               * [  How it works ](#how-it-works)  
                                                               * [  Environment Variables ](#environment-variables)  
                                                               * [  Build the Docker Image ](#build-the-docker-image)  
                                                               * [  Running the application locally ](#running-the-application-locally)  
                                                                                    * [  Using Docker ](#using-docker)  
                                                                                    * [  Using Docker Compose ](#using-docker-compose)  
                                             * [  How to interact with the deployment using RemoteGraph ](../use-remote-graph/)  
                              * [  Authentication & Access Control ](../../how-tos#authentication-access-control)  
                              * [  Assistants ](../../how-tos#assistants)  
                              * [  Threads ](../../how-tos#threads)  
                              * [  Runs ](../../how-tos#runs)  
                              * [  Streaming ](../../how-tos#streaming%5F1)  
                              * [  Frontend & Generative UI ](../../how-tos#frontend-generative-ui)  
                              * [  Human-in-the-loop ](../../how-tos#human-in-the-loop%5F1)  
                              * [  Double-texting ](../../how-tos#double-texting)  
                              * [  Webhooks ](../../cloud/how-tos/webhooks/)  
                              * [  Cron Jobs ](../../cloud/how-tos/cron%5Fjobs/)  
                              * [  Modifying the API ](../../how-tos#modifying-the-api)  
                              * [  LangGraph Studio ](../../how-tos#langgraph-studio)  
         * [  Concepts ](../../concepts/)  
         * [  Tutorials ](../../tutorials/)  
   * Resources  
    Resources  
         * [  Adopters ](../../adopters/)  
         * [  LLMS-txt ](../../llms-txt-overview/)  
         * [  FAQ ](../../concepts/faq/)  
         * [  Troubleshooting ](../../troubleshooting/errors/)  
         * [  LangGraph Academy Course ](https://academy.langchain.com/courses/intro-to-langgraph)
* [  Agents ](../../agents/overview/)
* [  API reference ](../../reference/)
* [  Versions ](../../versions/)

 Table of contents 
* [  How it works ](#how-it-works)
* [  Environment Variables ](#environment-variables)
* [  Build the Docker Image ](#build-the-docker-image)
* [  Running the application locally ](#running-the-application-locally)  
   * [  Using Docker ](#using-docker)  
   * [  Using Docker Compose ](#using-docker-compose)

1. [  LangGraph ](../..)
2. [  Guides ](../)
3. [  How-to Guides ](../)
4. [  LangGraph Platform ](../../how-tos#langgraph-platform)
5. [  Deployment ](../../how-tos#deployment)

# How to do a Self-hosted deployment of LangGraph[¶](#how-to-do-a-self-hosted-deployment-of-langgraph "Permanent link")

Prerequisites

* [Application Structure](../../concepts/application%5Fstructure/)
* [Deployment Options](../../concepts/deployment%5Foptions/)

This how-to guide will walk you through how to create a docker image from an existing LangGraph application, so you can deploy it on your own infrastructure.

## How it works[¶](#how-it-works "Permanent link")

With the self-hosted deployment option, you are responsible for managing the infrastructure, including setting up and maintaining necessary databases, Redis instances, and other services.

You will need to do the following:

1. Deploy Redis and Postgres instances on your own infrastructure.
2. Build a docker image with the [LangGraph Sever](../../concepts/langgraph%5Fserver/) using the [LangGraph CLI](../../concepts/langgraph%5Fcli/).
3. Deploy a web server that will run the docker image and pass in the necessary environment variables.

## Environment Variables[¶](#environment-variables "Permanent link")

You will eventually need to pass in the following environment variables to the LangGraph Deploy server:

* `REDIS_URI`: Connection details to a Redis instance. Redis will be used as a pub-sub broker to enable streaming real time output from background runs.
* `DATABASE_URI`: Postgres connection details. Postgres will be used to store assistants, threads, runs, persist thread state and long term memory, and to manage the state of the background task queue with 'exactly once' semantics.
* `LANGSMITH_API_KEY`: (If using \[Self-Hosted Lite\]) LangSmith API key. This will be used to authenticate ONCE at server start up.
* `LANGGRAPH_CLOUD_LICENSE_KEY`: (If using Self-Hosted Enterprise) LangGraph Platform license key. This will be used to authenticate ONCE at server start up.

## Build the Docker Image[¶](#build-the-docker-image "Permanent link")

Please read the [Application Structure](../../concepts/application%5Fstructure/) guide to understand how to structure your LangGraph application.

If the application is structured correctly, you can build a docker image with the LangGraph Deploy server.

To build the docker image, you first need to install the CLI:

`[](#%5F%5Fcodelineno-0-1)pip install -U langgraph-cli
`

You can then use:

`[](#%5F%5Fcodelineno-1-1)langgraph build -t my-image
`

This will build a docker image with the LangGraph Deploy server. The `-t my-image` is used to tag the image with a name.

When running this server, you need to pass three environment variables:

## Running the application locally[¶](#running-the-application-locally "Permanent link")

### Using Docker[¶](#using-docker "Permanent link")

`[](#%5F%5Fcodelineno-2-1)docker run \
[](#%5F%5Fcodelineno-2-2)    -e REDIS_URI="foo" \
[](#%5F%5Fcodelineno-2-3)    -e DATABASE_URI="bar" \
[](#%5F%5Fcodelineno-2-4)    -e LANGSMITH_API_KEY="baz" \
[](#%5F%5Fcodelineno-2-5)    my-image
`

If you want to run this quickly without setting up a separate Redis and Postgres instance, you can use this docker compose file.

Note

* You need to replace `my-image` with the name of the image you built in the previous step (from `langgraph build`). and you should provide appropriate values for `REDIS_URI`, `DATABASE_URI`, and `LANGSMITH_API_KEY`.
* If your application requires additional environment variables, you can pass them in a similar way.
* If using Self-Hosted Enterprise, you must provide `LANGGRAPH_CLOUD_LICENSE_KEY` as an additional environment variable.

### Using Docker Compose[¶](#using-docker-compose "Permanent link")

`[](#%5F%5Fcodelineno-3-1)volumes:
[](#%5F%5Fcodelineno-3-2)    langgraph-data:
[](#%5F%5Fcodelineno-3-3)        driver: local
[](#%5F%5Fcodelineno-3-4)services:
[](#%5F%5Fcodelineno-3-5)    langgraph-redis:
[](#%5F%5Fcodelineno-3-6)        image: redis:6
[](#%5F%5Fcodelineno-3-7)        healthcheck:
[](#%5F%5Fcodelineno-3-8)            test: redis-cli ping
[](#%5F%5Fcodelineno-3-9)            interval: 5s
[](#%5F%5Fcodelineno-3-10)            timeout: 1s
[](#%5F%5Fcodelineno-3-11)            retries: 5
[](#%5F%5Fcodelineno-3-12)    langgraph-postgres:
[](#%5F%5Fcodelineno-3-13)        image: postgres:16
[](#%5F%5Fcodelineno-3-14)        ports:
[](#%5F%5Fcodelineno-3-15)            - "5433:5432"
[](#%5F%5Fcodelineno-3-16)        environment:
[](#%5F%5Fcodelineno-3-17)            POSTGRES_DB: postgres
[](#%5F%5Fcodelineno-3-18)            POSTGRES_USER: postgres
[](#%5F%5Fcodelineno-3-19)            POSTGRES_PASSWORD: postgres
[](#%5F%5Fcodelineno-3-20)        volumes:
[](#%5F%5Fcodelineno-3-21)            - langgraph-data:/var/lib/postgresql/data
[](#%5F%5Fcodelineno-3-22)        healthcheck:
[](#%5F%5Fcodelineno-3-23)            test: pg_isready -U postgres
[](#%5F%5Fcodelineno-3-24)            start_period: 10s
[](#%5F%5Fcodelineno-3-25)            timeout: 1s
[](#%5F%5Fcodelineno-3-26)            retries: 5
[](#%5F%5Fcodelineno-3-27)            interval: 5s
[](#%5F%5Fcodelineno-3-28)    langgraph-api:
[](#%5F%5Fcodelineno-3-29)        image: ${IMAGE_NAME}
[](#%5F%5Fcodelineno-3-30)        ports:
[](#%5F%5Fcodelineno-3-31)            - "8123:8000"
[](#%5F%5Fcodelineno-3-32)        depends_on:
[](#%5F%5Fcodelineno-3-33)            langgraph-redis:
[](#%5F%5Fcodelineno-3-34)                condition: service_healthy
[](#%5F%5Fcodelineno-3-35)            langgraph-postgres:
[](#%5F%5Fcodelineno-3-36)                condition: service_healthy
[](#%5F%5Fcodelineno-3-37)        env_file:
[](#%5F%5Fcodelineno-3-38)            - .env
[](#%5F%5Fcodelineno-3-39)        environment:
[](#%5F%5Fcodelineno-3-40)            REDIS_URI: redis://langgraph-redis:6379
[](#%5F%5Fcodelineno-3-41)            LANGSMITH_API_KEY: ${LANGSMITH_API_KEY}
[](#%5F%5Fcodelineno-3-42)            POSTGRES_URI: postgres://postgres:postgres@langgraph-postgres:5432/postgres?sslmode=disable
`

You can then run `docker compose up` with this Docker compose file in the same folder.

This will spin up LangGraph Deploy on port `8123` (if you want to change this, you can change this by changing the ports in the `langgraph-api` volume).

You can test that the application is up by checking:

`[](#%5F%5Fcodelineno-4-1)curl --request GET --url 0.0.0.0:8123/ok
`

Assuming everything is running correctly, you should see a response like: 

`[](#%5F%5Fcodelineno-5-1){"ok":true}
`

 Was this page helpful? 

 Thanks for your feedback!

 Thanks for your feedback! Please help us improve this page by adding to the discussion below.

 Back to top 

[  Previous  How to Deploy to Cloud SaaS ](../../cloud/deployment/cloud/) [  Next  How to interact with the deployment using RemoteGraph ](../use-remote-graph/) 

 Copyright © 2025 LangChain, Inc | [Consent Preferences](#%5F%5Fconsent) 

 Made with[ Material for MkDocs Insiders](https://squidfunk.github.io/mkdocs-material/) 

[ ](https://langchain-ai.github.io/langgraph/ "langchain-ai.github.io") [ ](https://github.com/langchain-ai/langgraphjs "github.com") [ ](https://twitter.com/LangChainAI "twitter.com") 

#### Cookie consent

We use cookies to recognize your repeated visits and preferences, as well as to measure the effectiveness of our documentation and whether users find what they're searching for. **Clicking "Accept" makes our documentation better. Thank you!** ❤️

* Google Analytics
* GitHub

Accept Reject 