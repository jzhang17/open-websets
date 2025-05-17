[Exa home page![light logo](https://mintlify.s3.us-west-1.amazonaws.com/exa-52/logo/light.png)![dark logo](https://mintlify.s3.us-west-1.amazonaws.com/exa-52/logo/dark.png)](/)

Search or ask...

* [Exa Search](https://exa.ai/search)
* [Log In](https://dashboard.exa.ai/login)
* [API Dashboard](https://dashboard.exa.ai/login?redirect=/)
* [API Dashboard](https://dashboard.exa.ai/login?redirect=/)

Search...

Navigation

Items

Get an Item

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
         * [GETGet an Item](/websets/api/websets/items/get-an-item)  
         * [DELDelete an Item](/websets/api/websets/items/delete-an-item)  
         * [GETList all Items for a Webset](/websets/api/websets/items/list-all-items-for-a-webset)  
   * Searches  
   * Enrichments
* Webhooks
* Events

Items

# Get an Item

Returns a Webset Item.

GET

/

v0

/

websets

/

{webset}

/

items

/

{id}

Try it

cURL

Python

JavaScript

```
curl --request GET \
  --url https://api.exa.ai/websets/v0/websets/{webset}/items/{id} \
  --header 'x-api-key: <api-key>'
```

200

```
{
  "id": "<string>",
  "object": "webset_item",
  "source": "search",
  "sourceId": "<string>",
  "websetId": "<string>",
  "properties": {
    "type": "person",
    "url": "<string>",
    "description": "<string>",
    "person": {
      "name": "<string>",
      "location": "<string>",
      "position": "<string>",
      "pictureUrl": "<string>"
    }
  },
  "evaluations": [
    {
      "criterion": "<string>",
      "reasoning": "<string>",
      "satisfied": "yes",
      "references": []
    }
  ],
  "enrichments": [
    {
      "object": "enrichment_result",
      "format": "text",
      "result": [
        "<string>"
      ],
      "reasoning": "<string>",
      "references": [
        {
          "title": "<string>",
          "snippet": "<string>",
          "url": "<string>"
        }
      ],
      "enrichmentId": "<string>"
    }
  ],
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

[​](#parameter-id)

id

string

required

The id of the Webset item

#### Response

200 - application/json

Webset Item

The response is of type `object`.

[List all Websets](/websets/api/websets/list-all-websets)[Delete an Item](/websets/api/websets/items/delete-an-item)

[x](https://twitter.com/exaailabs)[discord](https://discord.com/invite/HCShtBqbfV)

[Powered by Mintlify](https://mintlify.com/preview-request?utm%5Fcampaign=poweredBy&utm%5Fmedium=referral&utm%5Fsource=docs.exa.ai)

cURL

Python

JavaScript

```
curl --request GET \
  --url https://api.exa.ai/websets/v0/websets/{webset}/items/{id} \
  --header 'x-api-key: <api-key>'
```

200

```
{
  "id": "<string>",
  "object": "webset_item",
  "source": "search",
  "sourceId": "<string>",
  "websetId": "<string>",
  "properties": {
    "type": "person",
    "url": "<string>",
    "description": "<string>",
    "person": {
      "name": "<string>",
      "location": "<string>",
      "position": "<string>",
      "pictureUrl": "<string>"
    }
  },
  "evaluations": [
    {
      "criterion": "<string>",
      "reasoning": "<string>",
      "satisfied": "yes",
      "references": []
    }
  ],
  "enrichments": [
    {
      "object": "enrichment_result",
      "format": "text",
      "result": [
        "<string>"
      ],
      "reasoning": "<string>",
      "references": [
        {
          "title": "<string>",
          "snippet": "<string>",
          "url": "<string>"
        }
      ],
      "enrichmentId": "<string>"
    }
  ],
  "createdAt": "2023-11-07T05:31:56Z",
  "updatedAt": "2023-11-07T05:31:56Z"
}
```