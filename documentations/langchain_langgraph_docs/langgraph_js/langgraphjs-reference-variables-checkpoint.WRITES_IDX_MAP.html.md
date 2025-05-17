[Back to documentation](/langgraphjs/)

* Preparing search index...
* The search index is not available

[API Reference](/)

* [API Reference](../index.html)
* [checkpoint](../modules/checkpoint.html)
* [WRITES\_IDX\_MAP](checkpoint.WRITES_IDX_MAP.html)

# Variable WRITES\_IDX\_MAP`Const`

WRITES\_IDX\_MAP: Record<string, number>

Mapping from error type to error index.
Regular writes just map to their index in the list of writes being saved.
Special writes (e.g. errors) map to negative indices, to avoid those writes from
conflicting with regular writes.
Each Checkpointer implementation should use this mapping in put\_writes.

* Defined in libs/checkpoint/dist/base.d.ts:88

### Settings

#### Member Visibility

* Protected
* Inherited
* External

#### Theme

OSLightDark

[API Reference](../index.html)

* Loading...

Generated using [TypeDoc](https://typedoc.org/)