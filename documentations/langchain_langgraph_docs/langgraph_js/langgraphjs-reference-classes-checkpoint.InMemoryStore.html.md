[Back to documentation](/langgraphjs/)

* Preparing search index...
* The search index is not available
[API Reference](/)

* [API Reference](../index.html)
* [checkpoint](../modules/checkpoint.html)
* [InMemoryStore](checkpoint.InMemoryStore.html)

# Class InMemoryStore

In-memory key-value store with optional vector search.

A lightweight store implementation using JavaScript Maps. Supports basic key-value operations and vector search when configured with embeddings.

#### Example

`// Basic key-value storage  
const store = new InMemoryStore();  
await store.put(["users", "123"], "prefs", { theme: "dark" });  
const item = await store.get(["users", "123"], "prefs");  
  
// Vector search with embeddings  
import { OpenAIEmbeddings } from "@langchain/openai";  
const store = new InMemoryStore({  
  index: {  
    dims: 1536,  
    embeddings: new OpenAIEmbeddings({ modelName: "text-embedding-3-small" }),  
  }  
});  
  
// Store documents  
await store.put(["docs"], "doc1", { text: "Python tutorial" });  
await store.put(["docs"], "doc2", { text: "TypeScript guide" });  
  
// Search by similarity  
const results = await store.search(["docs"], { query: "python programming" });
`Copy

#### Warning

This store keeps all data in memory. Data is lost when the process exits. For persistence, use a database-backed store.

#### Hierarchy ([view full](../hierarchy.html#checkpoint.InMemoryStore))

* [BaseStore](checkpoint.BaseStore.html)  
   * InMemoryStore  
         * [MemoryStore](checkpoint.MemoryStore.html)

* Defined in libs/checkpoint/dist/store/memory.d.ts:35

#####  Index

### Constructors

[constructor](checkpoint.InMemoryStore.html#constructor) 

### Accessors

[indexConfig](checkpoint.InMemoryStore.html#indexConfig) 

### Methods

[batch](checkpoint.InMemoryStore.html#batch) [delete](checkpoint.InMemoryStore.html#delete) [get](checkpoint.InMemoryStore.html#get) [listNamespaces](checkpoint.InMemoryStore.html#listNamespaces) [put](checkpoint.InMemoryStore.html#put) [search](checkpoint.InMemoryStore.html#search) [start](checkpoint.InMemoryStore.html#start) [stop](checkpoint.InMemoryStore.html#stop) 

## Constructors

### constructor

* new InMemoryStore(options?): [InMemoryStore](checkpoint.InMemoryStore.html)
* #### Parameters  
   * `Optional` options: {  
   index?: [IndexConfig](../interfaces/checkpoint.IndexConfig.html);  
   }  
         * ##### `Optional` index?: [IndexConfig](../interfaces/checkpoint.IndexConfig.html)  
#### Returns [InMemoryStore](checkpoint.InMemoryStore.html)  
Overrides [BaseStore](checkpoint.BaseStore.html).[constructor](checkpoint.BaseStore.html#constructor)  
   * Defined in libs/checkpoint/dist/store/memory.d.ts:39

## Accessors

### indexConfig

* get indexConfig(): undefined | [IndexConfig](../interfaces/checkpoint.IndexConfig.html)
* #### Returns undefined | [IndexConfig](../interfaces/checkpoint.IndexConfig.html)  
   * Defined in libs/checkpoint/dist/store/memory.d.ts:54

## Methods

### batch

* batch<[Op](checkpoint.InMemoryStore.html#batch.batch-1.Op)\>(operations): Promise<[OperationResults](../types/checkpoint.OperationResults.html)<[Op](checkpoint.InMemoryStore.html#batch.batch-1.Op)\>\>
* Execute multiple operations in a single batch. This is more efficient than executing operations individually.  
#### Type Parameters  
   * Op extends readonly [Operation](../types/checkpoint.Operation.html)\[\]  
#### Parameters  
   * operations: [Op](checkpoint.InMemoryStore.html#batch.batch-1.Op)  
   Array of operations to execute  
#### Returns Promise<[OperationResults](../types/checkpoint.OperationResults.html)<[Op](checkpoint.InMemoryStore.html#batch.batch-1.Op)\>\>  
Promise resolving to results matching the operations  
Overrides [BaseStore](checkpoint.BaseStore.html).[batch](checkpoint.BaseStore.html#batch)  
   * Defined in libs/checkpoint/dist/store/memory.d.ts:42

### delete

* delete(namespace, key): Promise<void\>
* Delete an item from the store.  
#### Parameters  
   * namespace: string\[\]  
   Hierarchical path for the item  
   * key: string  
   Unique identifier within the namespace  
#### Returns Promise<void\>  
Inherited from [BaseStore](checkpoint.BaseStore.html).[delete](checkpoint.BaseStore.html#delete)  
   * Defined in libs/checkpoint/dist/store/base.d.ts:352

### get

* get(namespace, key): Promise<null | [Item](../interfaces/checkpoint.Item.html)\>
* Retrieve a single item by its namespace and key.  
#### Parameters  
   * namespace: string\[\]  
   Hierarchical path for the item  
   * key: string  
   Unique identifier within the namespace  
#### Returns Promise<null | [Item](../interfaces/checkpoint.Item.html)\>  
Promise resolving to the item or null if not found  
Inherited from [BaseStore](checkpoint.BaseStore.html).[get](checkpoint.BaseStore.html#get)  
   * Defined in libs/checkpoint/dist/store/base.d.ts:293

### listNamespaces

* listNamespaces(options?): Promise<string\[\]\[\]\>
* List and filter namespaces in the store. Used to explore data organization and navigate the namespace hierarchy.  
#### Parameters  
   * `Optional` options: {  
   limit?: number;  
   maxDepth?: number;  
   offset?: number;  
   prefix?: string\[\];  
   suffix?: string\[\];  
   }  
   Options for listing namespaces  
         * ##### `Optional` limit?: number  
         * ##### `Optional` maxDepth?: number  
         * ##### `Optional` offset?: number  
         * ##### `Optional` prefix?: string\[\]  
         * ##### `Optional` suffix?: string\[\]  
#### Returns Promise<string\[\]\[\]\>  
Promise resolving to list of namespace paths  
#### Example  
`// List all namespaces under "documents"  
await store.listNamespaces({  
  prefix: ["documents"],  
  maxDepth: 2  
});  
    
// List namespaces ending with "v1"  
await store.listNamespaces({  
  suffix: ["v1"],  
  limit: 50  
});  
`Copy  
Inherited from [BaseStore](checkpoint.BaseStore.html).[listNamespaces](checkpoint.BaseStore.html#listNamespaces)  
   * Defined in libs/checkpoint/dist/store/base.d.ts:373

### put

* put(namespace, key, value, index?): Promise<void\>
* Store or update an item.  
#### Parameters  
   * namespace: string\[\]  
   Hierarchical path for the item  
   * key: string  
   Unique identifier within the namespace  
   * value: Record<string, any\>  
   Object containing the item's data  
   * `Optional` index: false | string\[\]  
   Optional indexing configuration  
#### Returns Promise<void\>  
#### Example  
`// Simple storage  
await store.put(["docs"], "report", { title: "Annual Report" });  
    
// With specific field indexing  
await store.put(  
  ["docs"],  
  "report",  
  {  
    title: "Q4 Report",  
    chapters: [{ content: "..." }, { content: "..." }]  
  },  
  ["title", "chapters[*].content"]  
);  
`Copy  
Inherited from [BaseStore](checkpoint.BaseStore.html).[put](checkpoint.BaseStore.html#put)  
   * Defined in libs/checkpoint/dist/store/base.d.ts:345

### search

* search(namespacePrefix, options?): Promise<[SearchItem](../interfaces/checkpoint.SearchItem.html)\[\]\>
* Search for items within a namespace prefix. Supports both metadata filtering and vector similarity search.  
#### Parameters  
   * namespacePrefix: string\[\]  
   Hierarchical path prefix to search within  
   * `Optional` options: {  
   filter?: Record<string, any\>;  
   limit?: number;  
   offset?: number;  
   query?: string;  
   }  
   Search options for filtering and pagination  
         * ##### `Optional` filter?: Record<string, any\>  
         * ##### `Optional` limit?: number  
         * ##### `Optional` offset?: number  
         * ##### `Optional` query?: string  
#### Returns Promise<[SearchItem](../interfaces/checkpoint.SearchItem.html)\[\]\>  
Promise resolving to list of matching items with relevance scores  
#### Example  
`// Search with filters  
await store.search(["documents"], {  
  filter: { type: "report", status: "active" },  
  limit: 5,  
  offset: 10  
});  
    
// Vector similarity search  
await store.search(["users", "content"], {  
  query: "technical documentation about APIs",  
  limit: 20  
});  
`Copy  
Inherited from [BaseStore](checkpoint.BaseStore.html).[search](checkpoint.BaseStore.html#search)  
   * Defined in libs/checkpoint/dist/store/base.d.ts:316

### start

* start(): void
* Start the store. Override if initialization is needed.  
#### Returns void  
Inherited from [BaseStore](checkpoint.BaseStore.html).[start](checkpoint.BaseStore.html#start)  
   * Defined in libs/checkpoint/dist/store/base.d.ts:383

### stop

* stop(): void
* Stop the store. Override if cleanup is needed.  
#### Returns void  
Inherited from [BaseStore](checkpoint.BaseStore.html).[stop](checkpoint.BaseStore.html#stop)  
   * Defined in libs/checkpoint/dist/store/base.d.ts:387

### Settings

#### Member Visibility

* Protected
* Inherited
* External

#### Theme

OSLightDark

### On This Page

[constructor](#constructor)[indexConfig](#indexConfig)[batch](#batch)[delete](#delete)[get](#get)[listNamespaces](#listNamespaces)[put](#put)[search](#search)[start](#start)[stop](#stop)

[API Reference](../index.html)
* Loading...

Generated using [TypeDoc](https://typedoc.org/)