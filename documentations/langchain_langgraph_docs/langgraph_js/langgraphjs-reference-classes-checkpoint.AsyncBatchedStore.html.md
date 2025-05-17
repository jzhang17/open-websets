[Back to documentation](/langgraphjs/)

* Preparing search index...
* The search index is not available

[API Reference](/)

* [API Reference](../index.html)
* [checkpoint](../modules/checkpoint.html)
* [AsyncBatchedStore](checkpoint.AsyncBatchedStore.html)

# Class AsyncBatchedStore

Abstract base class for persistent key-value stores.

Stores enable persistence and memory that can be shared across threads,
scoped to user IDs, assistant IDs, or other arbitrary namespaces.

Features:

* Hierarchical namespaces for organization
* Key-value storage with metadata
* Vector similarity search (if configured)
* Filtering and pagination

#### Hierarchy ([view full](../hierarchy.html#checkpoint.AsyncBatchedStore))

* [BaseStore](checkpoint.BaseStore.html)
  + AsyncBatchedStore

* Defined in libs/checkpoint/dist/store/batch.d.ts:2

##### Index

### Constructors

[constructor](checkpoint.AsyncBatchedStore.html#constructor)

### Properties

[lg\_name](checkpoint.AsyncBatchedStore.html#lg_name)
[store](checkpoint.AsyncBatchedStore.html#store)

### Accessors

[isRunning](checkpoint.AsyncBatchedStore.html#isRunning)

### Methods

[delete](checkpoint.AsyncBatchedStore.html#delete)
[get](checkpoint.AsyncBatchedStore.html#get)
[listNamespaces](checkpoint.AsyncBatchedStore.html#listNamespaces)
[put](checkpoint.AsyncBatchedStore.html#put)
[search](checkpoint.AsyncBatchedStore.html#search)
[start](checkpoint.AsyncBatchedStore.html#start)
[stop](checkpoint.AsyncBatchedStore.html#stop)
[toJSON](checkpoint.AsyncBatchedStore.html#toJSON)

## Constructors

### constructor

* new AsyncBatchedStore(store): [AsyncBatchedStore](checkpoint.AsyncBatchedStore.html)
* #### Parameters

  + store: [BaseStore](checkpoint.BaseStore.html)

  #### Returns [AsyncBatchedStore](checkpoint.AsyncBatchedStore.html)

  Overrides [BaseStore](checkpoint.BaseStore.html).[constructor](checkpoint.BaseStore.html#constructor)

  + Defined in libs/checkpoint/dist/store/batch.d.ts:9

## Properties

### lg\_name

lg\_name: string

* Defined in libs/checkpoint/dist/store/batch.d.ts:3

### `Protected` store

store: [BaseStore](checkpoint.BaseStore.html)

* Defined in libs/checkpoint/dist/store/batch.d.ts:4

## Accessors

### isRunning

* get isRunning(): boolean
* #### Returns boolean

  + Defined in libs/checkpoint/dist/store/batch.d.ts:10

## Methods

### delete

* delete(namespace, key): Promise<void>
* Delete an item from the store.

  #### Parameters

  + namespace: string[]

    Hierarchical path for the item
  + key: string

    Unique identifier within the namespace

  #### Returns Promise<void>

  Overrides [BaseStore](checkpoint.BaseStore.html).[delete](checkpoint.BaseStore.html#delete)

  + Defined in libs/checkpoint/dist/store/batch.d.ts:26

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

  Overrides [BaseStore](checkpoint.BaseStore.html).[get](checkpoint.BaseStore.html#get)

  + Defined in libs/checkpoint/dist/store/batch.d.ts:18

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

  Inherited from [BaseStore](checkpoint.BaseStore.html).[listNamespaces](checkpoint.BaseStore.html#listNamespaces)

  + Defined in libs/checkpoint/dist/store/base.d.ts:373

### put

* put(namespace, key, value): Promise<void>
* Store or update an item.

  #### Parameters

  + namespace: string[]

    Hierarchical path for the item
  + key: string

    Unique identifier within the namespace
  + value: Record<string, any>

    Object containing the item's data

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

  Overrides [BaseStore](checkpoint.BaseStore.html).[put](checkpoint.BaseStore.html#put)

  + Defined in libs/checkpoint/dist/store/batch.d.ts:25

### search

* search(namespacePrefix, options?): Promise<[Item](../interfaces/checkpoint.Item.html)[]>
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

  #### Returns Promise<[Item](../interfaces/checkpoint.Item.html)[]>

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

  Overrides [BaseStore](checkpoint.BaseStore.html).[search](checkpoint.BaseStore.html#search)

  + Defined in libs/checkpoint/dist/store/batch.d.ts:19

### start

* start(): void
* Start the store. Override if initialization is needed.

  #### Returns void

  Overrides [BaseStore](checkpoint.BaseStore.html).[start](checkpoint.BaseStore.html#start)

  + Defined in libs/checkpoint/dist/store/batch.d.ts:27

### stop

* stop(): Promise<void>
* Stop the store. Override if cleanup is needed.

  #### Returns Promise<void>

  Overrides [BaseStore](checkpoint.BaseStore.html).[stop](checkpoint.BaseStore.html#stop)

  + Defined in libs/checkpoint/dist/store/batch.d.ts:28

### toJSON

* toJSON(): {
      nextKey: number;
      queue: Map<number, {
          operation: [Operation](../types/checkpoint.Operation.html);
          reject: ((reason?) => void);
          resolve: ((value) => void);
      }>;
      running: boolean;
      store: string;
  }
* #### Returns {     nextKey: number;     queue: Map<number, {         operation: [Operation](../types/checkpoint.Operation.html);         reject: ((reason?) => void);         resolve: ((value) => void);     }>;     running: boolean;     store: string; }

  + ##### nextKey: number
  + ##### queue: Map<number, {     operation: [Operation](../types/checkpoint.Operation.html);     reject: ((reason?) => void);     resolve: ((value) => void); }>
  + ##### running: boolean
  + ##### store: string
  + Defined in libs/checkpoint/dist/store/batch.d.ts:31

### Settings

#### Member Visibility

* Protected
* Inherited
* External

#### Theme

OSLightDark

### On This Page

[constructor](#constructor)[lg\_name](#lg_name)[store](#store)[isRunning](#isRunning)[delete](#delete)[get](#get)[listNamespaces](#listNamespaces)[put](#put)[search](#search)[start](#start)[stop](#stop)[toJSON](#toJSON)

[API Reference](../index.html)

* Loading...

Generated using [TypeDoc](https://typedoc.org/)