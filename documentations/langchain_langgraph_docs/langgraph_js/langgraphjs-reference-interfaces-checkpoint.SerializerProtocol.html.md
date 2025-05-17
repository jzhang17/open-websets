[Back to documentation](/langgraphjs/)

* Preparing search index...
* The search index is not available

[API Reference](/)

* [API Reference](../index.html)
* [checkpoint](../modules/checkpoint.html)
* [SerializerProtocol](checkpoint.SerializerProtocol.html)

# Interface SerializerProtocol

interface SerializerProtocol {
    [dumpsTyped](checkpoint.SerializerProtocol.html#dumpsTyped.dumpsTyped-1)(data): [string, Uint8Array];
    [loadsTyped](checkpoint.SerializerProtocol.html#loadsTyped.loadsTyped-1)(type, data): any;
}

* Defined in libs/checkpoint/dist/serde/base.d.ts:1

##### Index

### Methods

[dumpsTyped](checkpoint.SerializerProtocol.html#dumpsTyped)
[loadsTyped](checkpoint.SerializerProtocol.html#loadsTyped)

## Methods

### dumpsTyped

* dumpsTyped(data): [string, Uint8Array]
* #### Parameters

  + data: any

  #### Returns [string, Uint8Array]

  + Defined in libs/checkpoint/dist/serde/base.d.ts:2

### loadsTyped

* loadsTyped(type, data): any
* #### Parameters

  + type: string
  + data: string | Uint8Array

  #### Returns any

  + Defined in libs/checkpoint/dist/serde/base.d.ts:3

### Settings

#### Member Visibility

* Protected
* Inherited
* External

#### Theme

OSLightDark

### On This Page

[dumpsTyped](#dumpsTyped)[loadsTyped](#loadsTyped)

[API Reference](../index.html)

* Loading...

Generated using [TypeDoc](https://typedoc.org/)