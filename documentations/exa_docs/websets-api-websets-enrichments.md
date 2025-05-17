[Exa home page![light logo](https://mintlify.s3.us-west-1.amazonaws.com/exa-52/logo/light.png)![dark logo](https://mintlify.s3.us-west-1.amazonaws.com/exa-52/logo/dark.png)](/)

Search or ask...

* [Exa Search](https://exa.ai/search)
* [Log In](https://dashboard.exa.ai/login)
* [API Dashboard](https://dashboard.exa.ai/login?redirect=/)
* [API Dashboard](https://dashboard.exa.ai/login?redirect=/)

Search...

Navigation

Enrichments

Create an Enrichment

[Documentation](/reference/getting-started)[Examples](/examples/exa-mcp)[Integrations](/integrations/lang-chain-docs)[SDKs](/sdks/python-sdk-specification)[Websets](/websets/overview)[Changelog](/changelog/auto-search-as-default)

* [Discord](https://discord.com/invite/HCShtBqbfV)
* [Blog](https://exa.ai/blog)

##### Getting Started

* [Overview](/websets/overview)
* [FAQ](/websets/faq)

##### Dashboard

* [Get started](/websets/dashboard/get-started)
* [Example queries](/websets/dashboard/websets-example-queries)
* Videos

##### API

* [Overview](/websets/api/overview)
* [Get started](/websets/api/get-started)
* [How It Works](/websets/api/how-it-works)
* Core  
   * Websets  
   * Items  
   * Searches  
   * Enrichments  
         * [POSTCreate an Enrichment](/websets/api/websets/enrichments/create-an-enrichment)  
         * [GETGet an Enrichment](/websets/api/websets/enrichments/get-an-enrichment)  
         * [DELDelete an Enrichment](/websets/api/websets/enrichments/delete-an-enrichment)  
         * [POSTCancel a running Enrichment](/websets/api/websets/enrichments/cancel-a-running-enrichment)
* Webhooks
* Events

Enrichments

# Create an Enrichment

Create an Enrichment for a Webset.

POST

/

v0

/

websets

/

{webset}

/

enrichments

Try it

cURL

Python

JavaScript

```
curl --request POST \
  --url https://api.exa.ai/websets/v0/websets/{webset}/enrichments \
  --header 'Content-Type: application/json' \
  --header 'x-api-key: <api-key>' \
  --data '{
  "description": "<string>",
  "format": "text",
  "options": [
    {
      "label": "<string>"
    }
  ],
  "metadata": {}
}'
```

200

```
{
  "id": "<string>",
  "object": "webset_enrichment",
  "status": "pending",
  "websetId": "<string>",
  "title": "<string>",
  "description": "<string>",
  "format": "text",
  "options": [
    {
      "label": "<string>"
    }
  ],
  "instructions": "<string>",
  "metadata": {},
  "createdAt": "2023-11-07T05:31:56Z",
  "updatedAt": "2023-11-07T05:31:56Z"
}
```

#### Authorizations

[​](#authorization-x-api-key)

x-api-key

string

header

required

Your Exa API key

#### Path Parameters

[​](#parameter-webset)

webset

string

required

The id or externalId of the Webset

#### Body

application/json

#### Response

200 - application/json

Enrichment created

The response is of type `object`.

[Cancel a running Search](/websets/api/websets/searches/cancel-a-running-search)[Get an Enrichment](/websets/api/websets/enrichments/get-an-enrichment)

[x](https://twitter.com/exaailabs)[discord](https://discord.com/invite/HCShtBqbfV)

[Powered by Mintlify](https://mintlify.com/preview-request?utm%5Fcampaign=poweredBy&utm%5Fmedium=referral&utm%5Fsource=docs.exa.ai)

cURL

Python

JavaScript

```
curl --request POST \
  --url https://api.exa.ai/websets/v0/websets/{webset}/enrichments \
  --header 'Content-Type: application/json' \
  --header 'x-api-key: <api-key>' \
  --data '{
  "description": "<string>",
  "format": "text",
  "options": [
    {
      "label": "<string>"
    }
  ],
  "metadata": {}
}'
```

200

```
{
  "id": "<string>",
  "object": "webset_enrichment",
  "status": "pending",
  "websetId": "<string>",
  "title": "<string>",
  "description": "<string>",
  "format": "text",
  "options": [
    {
      "label": "<string>"
    }
  ],
  "instructions": "<string>",
  "metadata": {},
  "createdAt": "2023-11-07T05:31:56Z",
  "updatedAt": "2023-11-07T05:31:56Z"
}
```