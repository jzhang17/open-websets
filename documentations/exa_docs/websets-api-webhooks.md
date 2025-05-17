Create a Webhook - Exa

[Exa home page![light logo](https://mintlify.s3.us-west-1.amazonaws.com/exa-52/logo/light.png)![dark logo](https://mintlify.s3.us-west-1.amazonaws.com/exa-52/logo/dark.png)](/)

Search or ask...

* [Exa Search](https://exa.ai/search)
* [Log In](https://dashboard.exa.ai/login)
* [API Dashboard](https://dashboard.exa.ai/login?redirect=/)
* [API Dashboard](https://dashboard.exa.ai/login?redirect=/)

Search...

Navigation

Webhooks

Create a Webhook

[Documentation](/reference/getting-started)[Examples](/examples/exa-mcp)[Integrations](/integrations/lang-chain-docs)[SDKs](/sdks/python-sdk-specification)[Websets](/websets/overview)[Changelog](/changelog/auto-search-as-default)

- [Discord](https://discord.com/invite/HCShtBqbfV)
- [Blog](https://exa.ai/blog)

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
* Webhooks

  + [POST

    Create a Webhook](/websets/api/webhooks/create-a-webhook)
  + [GET

    Get a Webhook](/websets/api/webhooks/get-a-webhook)
  + [PATCH

    Update a Webhook](/websets/api/webhooks/update-a-webhook)
  + [DEL

    Delete a Webhook](/websets/api/webhooks/delete-a-webhook)
  + [GET

    List webhooks](/websets/api/webhooks/list-webhooks)
  + [GET

    List webhook attempts](/websets/api/webhooks/attempts/list-webhook-attempts)
* Events

Webhooks

# Create a Webhook

POST

/

v0

/

webhooks

Try it

cURL

Python

JavaScript

```
curl --request POST \
  --url https://api.exa.ai/websets/v0/webhooks \
  --header 'Content-Type: application/json' \
  --header 'x-api-key: <api-key>' \
  --data '{
  "events": [
    "webset.created"
  ],
  "url": "<string>",
  "metadata": {}
}'
```

200

```
{
  "id": "<string>",
  "object": "webhook",
  "status": "active",
  "events": [
    "webset.created"
  ],
  "url": "<string>",
  "secret": "<string>",
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

#### Body

application/json

#### Response

200 - application/json

Webhook

The response is of type `object`.

[Cancel a running Enrichment](/websets/api/websets/enrichments/cancel-a-running-enrichment)[Get a Webhook](/websets/api/webhooks/get-a-webhook)

[x](https://twitter.com/exaailabs)[discord](https://discord.com/invite/HCShtBqbfV)

[Powered by Mintlify](https://mintlify.com/preview-request?utm_campaign=poweredBy&utm_medium=referral&utm_source=docs.exa.ai)

cURL

Python

JavaScript

```
curl --request POST \
  --url https://api.exa.ai/websets/v0/webhooks \
  --header 'Content-Type: application/json' \
  --header 'x-api-key: <api-key>' \
  --data '{
  "events": [
    "webset.created"
  ],
  "url": "<string>",
  "metadata": {}
}'
```

200

```
{
  "id": "<string>",
  "object": "webhook",
  "status": "active",
  "events": [
    "webset.created"
  ],
  "url": "<string>",
  "secret": "<string>",
  "metadata": {},
  "createdAt": "2023-11-07T05:31:56Z",
  "updatedAt": "2023-11-07T05:31:56Z"
}
```