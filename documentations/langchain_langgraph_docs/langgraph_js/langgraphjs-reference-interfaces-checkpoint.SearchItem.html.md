[Back to documentation](/langgraphjs/)

* Preparing search index...
* The search index is not available
[API Reference](/)

* [API Reference](../index.html)
* [checkpoint](../modules/checkpoint.html)
* [SearchItem](checkpoint.SearchItem.html)

# Interface SearchItem

Represents a search result item with relevance score. Extends the base Item interface with an optional similarity score.

interface SearchItem {   
[createdAt](checkpoint.SearchItem.html#createdAt): Date;   
[key](checkpoint.SearchItem.html#key): string;   
[namespace](checkpoint.SearchItem.html#namespace): string\[\];   
[score](checkpoint.SearchItem.html#score)?: number;   
[updatedAt](checkpoint.SearchItem.html#updatedAt): Date;   
[value](checkpoint.SearchItem.html#value): Record<string, any\>;   
}

#### Hierarchy ([view full](../hierarchy.html#checkpoint.SearchItem))

* [Item](checkpoint.Item.html)  
   * SearchItem

* Defined in libs/checkpoint/dist/store/base.d.ts:39

#####  Index

### Properties

[createdAt](checkpoint.SearchItem.html#createdAt) [key](checkpoint.SearchItem.html#key) [namespace](checkpoint.SearchItem.html#namespace) [score?](checkpoint.SearchItem.html#score) [updatedAt](checkpoint.SearchItem.html#updatedAt) [value](checkpoint.SearchItem.html#value) 

## Properties

### createdAt

createdAt: Date

Timestamp of item creation.

Inherited from [Item](checkpoint.Item.html).[createdAt](checkpoint.Item.html#createdAt)

* Defined in libs/checkpoint/dist/store/base.d.ts:29

### key

key: string

Unique identifier within the namespace.

Inherited from [Item](checkpoint.Item.html).[key](checkpoint.Item.html#key)

* Defined in libs/checkpoint/dist/store/base.d.ts:19

### namespace

namespace: string\[\]

Hierarchical path defining the collection in which this document resides. Represented as an array of strings, allowing for nested categorization. For example: \["documents", "user123"\]

Inherited from [Item](checkpoint.Item.html).[namespace](checkpoint.Item.html#namespace)

* Defined in libs/checkpoint/dist/store/base.d.ts:25

### `Optional` score

score?: number

Relevance/similarity score if from a ranked operation. Higher scores indicate better matches.

This is typically a cosine similarity score between -1 and 1, where 1 indicates identical vectors and -1 indicates opposite vectors.

* Defined in libs/checkpoint/dist/store/base.d.ts:47

### updatedAt

updatedAt: Date

Timestamp of last update.

Inherited from [Item](checkpoint.Item.html).[updatedAt](checkpoint.Item.html#updatedAt)

* Defined in libs/checkpoint/dist/store/base.d.ts:33

### value

value: Record<string, any\>

The stored data as an object. Keys are filterable.

Inherited from [Item](checkpoint.Item.html).[value](checkpoint.Item.html#value)

* Defined in libs/checkpoint/dist/store/base.d.ts:15

### Settings

#### Member Visibility

* Protected
* Inherited
* External

#### Theme

OSLightDark

### On This Page

[createdAt](#createdAt)[key](#key)[namespace](#namespace)[score](#score)[updatedAt](#updatedAt)[value](#value)

[API Reference](../index.html)
* Loading...

Generated using [TypeDoc](https://typedoc.org/)