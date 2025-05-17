[Back to documentation](/langgraphjs/)

* Preparing search index...
* The search index is not available
[API Reference](/)

* [API Reference](../index.html)
* [checkpoint](../modules/checkpoint.html)
* [IndexConfig](checkpoint.IndexConfig.html)

# Interface IndexConfig

Configuration for indexing documents for semantic search in the store.

This configures how documents are embedded and indexed for vector similarity search.

interface IndexConfig {   
[dims](checkpoint.IndexConfig.html#dims): number;   
[embeddings](checkpoint.IndexConfig.html#embeddings): Embeddings;   
[fields](checkpoint.IndexConfig.html#fields)?: string\[\];   
}

* Defined in libs/checkpoint/dist/store/base.d.ts:223

#####  Index

### Properties

[dims](checkpoint.IndexConfig.html#dims) [embeddings](checkpoint.IndexConfig.html#embeddings) [fields?](checkpoint.IndexConfig.html#fields) 

## Properties

### dims

dims: number

Number of dimensions in the embedding vectors.

Common embedding model dimensions:

* OpenAI text-embedding-3-large: 256, 1024, or 3072
* OpenAI text-embedding-3-small: 512 or 1536
* OpenAI text-embedding-ada-002: 1536
* Cohere embed-english-v3.0: 1024
* Cohere embed-english-light-v3.0: 384
* Cohere embed-multilingual-v3.0: 1024
* Cohere embed-multilingual-light-v3.0: 384

* Defined in libs/checkpoint/dist/store/base.d.ts:236

### embeddings

embeddings: Embeddings

The embeddings model to use for generating vectors. This should be a LangChain Embeddings implementation.

* Defined in libs/checkpoint/dist/store/base.d.ts:241

### `Optional` fields

fields?: string\[\]

Fields to extract text from for embedding generation.

Path syntax supports:

* Simple field access: "field"
* Nested fields: "metadata.title"
* Array indexing:  
   * All elements: "chapters\[\*\].content"  
   * Specific index: "authors\[0\].name"  
   * Last element: "array\[-1\]"

#### Default

`["$"] Embeds the entire document as one vector
`Copy

* Defined in libs/checkpoint/dist/store/base.d.ts:255

### Settings

#### Member Visibility

* Protected
* Inherited
* External

#### Theme

OSLightDark

### On This Page

[dims](#dims)[embeddings](#embeddings)[fields](#fields)

[API Reference](../index.html)
* Loading...

Generated using [TypeDoc](https://typedoc.org/)