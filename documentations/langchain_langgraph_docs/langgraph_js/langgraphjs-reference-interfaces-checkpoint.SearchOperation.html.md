[Back to documentation](/langgraphjs/)

* Preparing search index...
* The search index is not available

[API Reference](/)

* [API Reference](../index.html)
* [checkpoint](../modules/checkpoint.html)
* [SearchOperation](checkpoint.SearchOperation.html)

# Interface SearchOperation

Operation to search for items within a namespace prefix.

interface SearchOperation {
    [filter](checkpoint.SearchOperation.html#filter)?: Record<string, any>;
    [limit](checkpoint.SearchOperation.html#limit)?: number;
    [namespacePrefix](checkpoint.SearchOperation.html#namespacePrefix): string[];
    [offset](checkpoint.SearchOperation.html#offset)?: number;
    [query](checkpoint.SearchOperation.html#query)?: string;
}

* Defined in libs/checkpoint/dist/store/base.d.ts:74

##### Index

### Properties

[filter?](checkpoint.SearchOperation.html#filter)
[limit?](checkpoint.SearchOperation.html#limit)
[namespacePrefix](checkpoint.SearchOperation.html#namespacePrefix)
[offset?](checkpoint.SearchOperation.html#offset)
[query?](checkpoint.SearchOperation.html#query)

## Properties

### `Optional` filter

filter?: Record<string, any>

Key-value pairs to filter results based on exact matches or comparison operators.

Supports both exact matches and operator-based comparisons:

* $eq: Equal to (same as direct value comparison)
* $ne: Not equal to
* $gt: Greater than
* $gte: Greater than or equal to
* $lt: Less than
* $lte: Less than or equal to

#### Example

```
// Exact match
filter: { status: "active" }

// With operators
filter: { score: { $gt: 4.99 } }

// Multiple conditions
filter: {
  score: { $gte: 3.0 },
  color: "red"
}
Copy
```

* Defined in libs/checkpoint/dist/store/base.d.ts:111

### `Optional` limit

limit?: number

Maximum number of items to return.

#### Default

```
10
Copy
```

* Defined in libs/checkpoint/dist/store/base.d.ts:116

### namespacePrefix

namespacePrefix: string[]

Hierarchical path prefix to search within.
Only items under this prefix will be searched.

#### Example

```
// Search all user documents
namespacePrefix: ["users", "documents"]

// Search everything
namespacePrefix: []
Copy
```

* Defined in libs/checkpoint/dist/store/base.d.ts:86

### `Optional` offset

offset?: number

Number of items to skip before returning results.
Useful for pagination.

#### Default

```
0
Copy
```

* Defined in libs/checkpoint/dist/store/base.d.ts:122

### `Optional` query

query?: string

Natural language search query for semantic search.
When provided, results will be ranked by relevance to this query
using vector similarity search.

#### Example

```
// Find technical documentation about APIs
query: "technical documentation about REST APIs"

// Find recent ML papers
query: "machine learning papers from 2023"
Copy
```

* Defined in libs/checkpoint/dist/store/base.d.ts:135

### Settings

#### Member Visibility

* Protected
* Inherited
* External

#### Theme

OSLightDark

### On This Page

[filter](#filter)[limit](#limit)[namespacePrefix](#namespacePrefix)[offset](#offset)[query](#query)

[API Reference](../index.html)

* Loading...

Generated using [TypeDoc](https://typedoc.org/)