[Back to documentation](/langgraphjs/)

* Preparing search index...
* The search index is not available
[API Reference](/)

* [API Reference](../index.html)
* [checkpoint](../modules/checkpoint.html)
* [GetOperation](checkpoint.GetOperation.html)

# Interface GetOperation

Operation to retrieve an item by namespace and ID.

interface GetOperation {   
[key](checkpoint.GetOperation.html#key): string;   
[namespace](checkpoint.GetOperation.html#namespace): string\[\];   
}

* Defined in libs/checkpoint/dist/store/base.d.ts:52

#####  Index

### Properties

[key](checkpoint.GetOperation.html#key) [namespace](checkpoint.GetOperation.html#namespace) 

## Properties

### key

key: string

Unique identifier within the namespace. Together with namespace forms the complete path to the item.

#### Example

`key: "user123"  // For a user profile  
key: "doc456"   // For a document
`Copy

* Defined in libs/checkpoint/dist/store/base.d.ts:69

### namespace

namespace: string\[\]

Hierarchical path for the item.

#### Example

`// Get a user profile  
namespace: ["users", "profiles"]
`Copy

* Defined in libs/checkpoint/dist/store/base.d.ts:60

### Settings

#### Member Visibility

* Protected
* Inherited
* External

#### Theme

OSLightDark

### On This Page

[key](#key)[namespace](#namespace)

[API Reference](../index.html)
* Loading...

Generated using [TypeDoc](https://typedoc.org/)