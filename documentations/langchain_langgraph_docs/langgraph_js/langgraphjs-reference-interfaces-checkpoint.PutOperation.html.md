[Back to documentation](/langgraphjs/)

* Preparing search index...
* The search index is not available
[API Reference](/)

* [API Reference](../index.html)
* [checkpoint](../modules/checkpoint.html)
* [PutOperation](checkpoint.PutOperation.html)

# Interface PutOperation

Operation to store, update, or delete an item.

interface PutOperation {   
[index](checkpoint.PutOperation.html#index)?: false | string\[\];   
[key](checkpoint.PutOperation.html#key): string;   
[namespace](checkpoint.PutOperation.html#namespace): string\[\];   
[value](checkpoint.PutOperation.html#value): null | Record<string, any\>;   
}

* Defined in libs/checkpoint/dist/store/base.d.ts:140

#####  Index

### Properties

[index?](checkpoint.PutOperation.html#index) [key](checkpoint.PutOperation.html#key) [namespace](checkpoint.PutOperation.html#namespace) [value](checkpoint.PutOperation.html#value) 

## Properties

### `Optional` index

index?: false | string\[\]

Controls how the item's fields are indexed for search operations.

* undefined: Uses store's default indexing configuration
* false: Disables indexing for this item
* string\[\]: List of field paths to index

Path syntax supports:

* Nested fields: "metadata.title"
* Array access: "chapters\[\*\].content" (each indexed separately)
* Specific indices: "authors\[0\].name"

#### Example

`// Index specific fields  
index: ["metadata.title", "chapters[*].content"]  
  
// Disable indexing  
index: false
`Copy

* Defined in libs/checkpoint/dist/store/base.d.ts:197

### key

key: string

Unique identifier for the document within its namespace. Together with namespace forms the complete path to the item.

Example: If namespace is \["documents", "user123"\] and key is "report1", the full path would effectively be "documents/user123/report1"

* Defined in libs/checkpoint/dist/store/base.d.ts:164

### namespace

namespace: string\[\]

Hierarchical path for the item. Acts as a folder-like structure to organize items. Each element represents one level in the hierarchy.

#### Example

`// Root level documents  
namespace: ["documents"]  
  
// User-specific documents  
namespace: ["documents", "user123"]  
  
// Nested cache structure  
namespace: ["cache", "docs", "v1"]
`Copy

* Defined in libs/checkpoint/dist/store/base.d.ts:156

### value

value: null | Record<string, any\>

Data to be stored, or null to delete the item. Must be a JSON-serializable object with string keys. Setting to null signals that the item should be deleted.

#### Example

`{  
     *   field1: "string value",  
     *   field2: 123,  
     *   nested: { can: "contain", any: "serializable data" }  
     * }
`Copy

* Defined in libs/checkpoint/dist/store/base.d.ts:177

### Settings

#### Member Visibility

* Protected
* Inherited
* External

#### Theme

OSLightDark

### On This Page

[index](#index)[key](#key)[namespace](#namespace)[value](#value)

[API Reference](../index.html)
* Loading...

Generated using [TypeDoc](https://typedoc.org/)