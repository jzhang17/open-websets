[Back to documentation](/langgraphjs/)

* Preparing search index...
* The search index is not available

[API Reference](/)

* [API Reference](../index.html)
* [checkpoint](../modules/checkpoint.html)
* [MemoryStore](checkpoint.MemoryStore.html)

# Class MemoryStore

#### Deprecated

Alias for InMemoryStore

#### Hierarchy ([view full](../hierarchy.html#checkpoint.MemoryStore))

* [InMemoryStore](checkpoint.InMemoryStore.html)
  + MemoryStore

* Defined in libs/checkpoint/dist/store/memory.d.ts:57

##### Index

### Constructors

[constructor](checkpoint.MemoryStore.html#constructor)

### Accessors

[indexConfig](checkpoint.MemoryStore.html#indexConfig)

### Methods

[batch](checkpoint.MemoryStore.html#batch)
[delete](checkpoint.MemoryStore.html#delete)
[get](checkpoint.MemoryStore.html#get)
[listNamespaces](checkpoint.MemoryStore.html#listNamespaces)
[put](checkpoint.MemoryStore.html#put)
[search](checkpoint.MemoryStore.html#search)
[start](checkpoint.MemoryStore.html#start)
[stop](checkpoint.MemoryStore.html#stop)

## Constructors

### constructor

* new MemoryStore(options?): [MemoryStore](checkpoint.MemoryStore.html)
* #### Parameters

  + `Optional` options: {
        index?: [IndexConfig](../interfaces/checkpoint.IndexConfig.html);
    }
    - ##### `Optional` index?: [IndexConfig](../interfaces/checkpoint.IndexConfig.html)

  #### Returns [MemoryStore](checkpoint.MemoryStore.html)

  Inherited from [InMemoryStore](checkpoint.InMemoryStore.html).[constructor](checkpoint.InMemoryStore.html#constructor)

  + Defined in libs/checkpoint/dist/store/memory.d.ts:39

## Accessors

### indexConfig

* get indexConfig(): undefined | [IndexConfig](../interfaces/checkpoint.IndexConfig.html)
* #### Returns undefined | [IndexConfig](../interfaces/checkpoint.IndexConfig.html)

  Inherited from InMemoryStore.indexConfig

  + Defined in libs/checkpoint/dist/store/memory.d.ts:54

## Methods

### batch

* batch<[Op](checkpoint.MemoryStore.html#batch.batch-1.Op)>(operations): Promise<[OperationResults](../types/checkpoint.OperationResults.html)<[Op](checkpoint.InMemoryStore.html#batch.batch-1.Op)>>
* Execute multiple operations in a single batch.
  This is more efficient than executing operations individually.

  #### Type Parameters

  + Op extends readonly [Operation](../types/checkpoint.Operation.html)[]

  #### Parameters

  + operations: [Op](checkpoint.InMemoryStore.html#batch.batch-1.Op)

    Array of operations to execute

  #### Returns Promise<[OperationResults](../types/checkpoint.OperationResults.html)<[Op](checkpoint.InMemoryStore.html#batch.batch-1.Op)>>

  Promise resolving to results matching the operations

  Inherited from [InMemoryStore](checkpoint.InMemoryStore.html).[batch](checkpoint.InMemoryStore.html#batch)

  + Defined in libs/checkpoint/dist/store/memory.d.ts:42

### delete

* delete(namespace, key): Promise<void>
* Delete an item from the store.

  #### Parameters

  + namespace: string[]

    Hierarchical path for the item
  + key: string

    Unique identifier within the namespace

  #### Returns Promise<void>

  Inherited from [InMemoryStore](checkpoint.InMemoryStore.html).[delete](checkpoint.InMemoryStore.html#delete)

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

  Inherited from [InMemoryStore](checkpoint.InMemoryStore.html).[get](checkpoint.InMemoryStore.html#get)

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

  Inherited from [InMemoryStore](checkpoint.InMemoryStore.html).[listNamespaces](checkpoint.InMemoryStore.html#listNamespaces)

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

  Inherited from [InMemoryStore](checkpoint.InMemoryStore.html).[put](checkpoint.InMemoryStore.html#put)

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

  Inherited from [InMemoryStore](checkpoint.InMemoryStore.html).[search](checkpoint.InMemoryStore.html#search)

  + Defined in libs/checkpoint/dist/store/base.d.ts:316

### start

* start(): void
* Start the store. Override if initialization is needed.

  #### Returns void

  Inherited from [InMemoryStore](checkpoint.InMemoryStore.html).[start](checkpoint.InMemoryStore.html#start)

  + Defined in libs/checkpoint/dist/store/base.d.ts:383

### stop

* stop(): void
* Stop the store. Override if cleanup is needed.

  #### Returns void

  Inherited from [InMemoryStore](checkpoint.InMemoryStore.html).[stop](checkpoint.InMemoryStore.html#stop)

  + Defined in libs/checkpoint/dist/store/base.d.ts:387

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