[Back to documentation](/langgraphjs/)

* Preparing search index...
* The search index is not available

[API Reference](/)

* [API Reference](../index.html)
* [checkpoint](../modules/checkpoint.html)
* [BaseStore](checkpoint.BaseStore.html)

# Class BaseStore`Abstract`

Abstract base class for persistent key-value stores.

Stores enable persistence and memory that can be shared across threads,
scoped to user IDs, assistant IDs, or other arbitrary namespaces.

Features:

* Hierarchical namespaces for organization
* Key-value storage with metadata
* Vector similarity search (if configured)
* Filtering and pagination

#### Hierarchy ([view full](../hierarchy.html#checkpoint.BaseStore))

* BaseStore
  + [AsyncBatchedStore](checkpoint.AsyncBatchedStore.html)
  + [InMemoryStore](checkpoint.InMemoryStore.html)

* Defined in libs/checkpoint/dist/store/base.d.ts:277

##### Index

### Constructors

[constructor](checkpoint.BaseStore.html#constructor)

### Methods

[batch](checkpoint.BaseStore.html#batch)
[delete](checkpoint.BaseStore.html#delete)
[get](checkpoint.BaseStore.html#get)
[listNamespaces](checkpoint.BaseStore.html#listNamespaces)
[put](checkpoint.BaseStore.html#put)
[search](checkpoint.BaseStore.html#search)
[start](checkpoint.BaseStore.html#start)
[stop](checkpoint.BaseStore.html#stop)

## Constructors

### constructor

* new BaseStore(): [BaseStore](checkpoint.BaseStore.html)
* #### Returns [BaseStore](checkpoint.BaseStore.html)

## Methods

### `Abstract` batch

* batch<[Op](checkpoint.BaseStore.html#batch.batch-1.Op)>(operations): Promise<[OperationResults](../types/checkpoint.OperationResults.html)<[Op](checkpoint.BaseStore.html#batch.batch-1.Op)>>
* Execute multiple operations in a single batch.
  This is more efficient than executing operations individually.

  #### Type Parameters

  + Op extends [Operation](../types/checkpoint.Operation.html)[]

  #### Parameters

  + operations: [Op](checkpoint.BaseStore.html#batch.batch-1.Op)

    Array of operations to execute

  #### Returns Promise<[OperationResults](../types/checkpoint.OperationResults.html)<[Op](checkpoint.BaseStore.html#batch.batch-1.Op)>>

  Promise resolving to results matching the operations

  + Defined in libs/checkpoint/dist/store/base.d.ts:285

### delete

* delete(namespace, key): Promise<void>
* Delete an item from the store.

  #### Parameters

  + namespace: string[]

    Hierarchical path for the item
  + key: string

    Unique identifier within the namespace

  #### Returns Promise<void>

  + Defined in libs/checkpoint/dist/store/base.d.ts:352

### get

* get(namespace, key): Promise<null | [Item](../interfaces/checkpoint.Item.html)>
* Retrieve a single item by its namespace and key.

  #### Parameters

  + namespace: string[]

    Hierarchical path for the item
  + key: string

    Unique identifier within the namespace

  #### Returns Promise<null | [Item](../interfaces/checkpoint.Item.html)>

  Promise resolving to the item or null if not found

  + Defined in libs/checkpoint/dist/store/base.d.ts:293

### listNamespaces

* listNamespaces(options?): Promise<string[][]>
* List and filter namespaces in the store.
  Used to explore data organization and navigate the namespace hierarchy.

  #### Parameters

  + `Optional` options: {
        limit?: number;
        maxDepth?: number;
        offset?: number;
        prefix?: string[];
        suffix?: string[];
    }

    Options for listing namespaces

    - ##### `Optional` limit?: number
    - ##### `Optional` maxDepth?: number
    - ##### `Optional` offset?: number
    - ##### `Optional` prefix?: string[]
    - ##### `Optional` suffix?: string[]

  #### Returns Promise<string[][]>

  Promise resolving to list of namespace paths

  #### Example

  ```
  // List all namespaces under "documents"
  await store.listNamespaces({
    prefix: ["documents"],
    maxDepth: 2
  });

  // List namespaces ending with "v1"
  await store.listNamespaces({
    suffix: ["v1"],
    limit: 50
  });
  Copy
  ```

  + Defined in libs/checkpoint/dist/store/base.d.ts:373

### put

* put(namespace, key, value, index?): Promise<void>
* Store or update an item.

  #### Parameters

  + namespace: string[]

    Hierarchical path for the item
  + key: string

    Unique identifier within the namespace
  + value: Record<string, any>

    Object containing the item's data
  + `Optional` index: false | string[]

    Optional indexing configuration

  #### Returns Promise<void>

  #### Example

  ```
  // Simple storage
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
  Copy
  ```

  + Defined in libs/checkpoint/dist/store/base.d.ts:345

### search

* search(namespacePrefix, options?): Promise<[SearchItem](../interfaces/checkpoint.SearchItem.html)[]>
* Search for items within a namespace prefix.
  Supports both metadata filtering and vector similarity search.

  #### Parameters

  + namespacePrefix: string[]

    Hierarchical path prefix to search within
  + `Optional` options: {
        filter?: Record<string, any>;
        limit?: number;
        offset?: number;
        query?: string;
    }

    Search options for filtering and pagination

    - ##### `Optional` filter?: Record<string, any>
    - ##### `Optional` limit?: number
    - ##### `Optional` offset?: number
    - ##### `Optional` query?: string

  #### Returns Promise<[SearchItem](../interfaces/checkpoint.SearchItem.html)[]>

  Promise resolving to list of matching items with relevance scores

  #### Example

  ```
  // Search with filters
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
  Copy
  ```

  + Defined in libs/checkpoint/dist/store/base.d.ts:316

### start

* start(): void
* Start the store. Override if initialization is needed.

  #### Returns void

  + Defined in libs/checkpoint/dist/store/base.d.ts:383

### stop

* stop(): void
* Stop the store. Override if cleanup is needed.

  #### Returns void

  + Defined in libs/checkpoint/dist/store/base.d.ts:387

### Settings

#### Member Visibility

* Protected
* Inherited
* External

#### Theme

OSLightDark

### On This Page

[constructor](#constructor)[batch](#batch)[delete](#delete)[get](#get)[listNamespaces](#listNamespaces)[put](#put)[search](#search)[start](#start)[stop](#stop)

[API Reference](../index.html)

* Loading...

Generated using [TypeDoc](https://typedoc.org/)