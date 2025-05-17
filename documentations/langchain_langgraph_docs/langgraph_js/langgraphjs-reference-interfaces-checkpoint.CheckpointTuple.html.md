[Back to documentation](/langgraphjs/)

* Preparing search index...
* The search index is not available
[API Reference](/)

* [API Reference](../index.html)
* [checkpoint](../modules/checkpoint.html)
* [CheckpointTuple](checkpoint.CheckpointTuple.html)

# Interface CheckpointTuple

interface CheckpointTuple {   
[checkpoint](checkpoint.CheckpointTuple.html#checkpoint): [Checkpoint](checkpoint.Checkpoint.html)<string, string\>;   
[config](checkpoint.CheckpointTuple.html#config): RunnableConfig<Record<string, any\>\>;   
[metadata](checkpoint.CheckpointTuple.html#metadata)?: [CheckpointMetadata](../types/checkpoint.CheckpointMetadata.html)<object\>;   
[parentConfig](checkpoint.CheckpointTuple.html#parentConfig)?: RunnableConfig<Record<string, any\>\>;   
[pendingWrites](checkpoint.CheckpointTuple.html#pendingWrites)?: \[string, string, unknown\]\[\];   
}

* Defined in libs/checkpoint/dist/base.d.ts:48

#####  Index

### Properties

[checkpoint](checkpoint.CheckpointTuple.html#checkpoint) [config](checkpoint.CheckpointTuple.html#config) [metadata?](checkpoint.CheckpointTuple.html#metadata) [parentConfig?](checkpoint.CheckpointTuple.html#parentConfig) [pendingWrites?](checkpoint.CheckpointTuple.html#pendingWrites) 

## Properties

### checkpoint

checkpoint: [Checkpoint](checkpoint.Checkpoint.html)<string, string\>

* Defined in libs/checkpoint/dist/base.d.ts:50

### config

config: RunnableConfig<Record<string, any\>\>

* Defined in libs/checkpoint/dist/base.d.ts:49

### `Optional` metadata

metadata?: [CheckpointMetadata](../types/checkpoint.CheckpointMetadata.html)<object\>

* Defined in libs/checkpoint/dist/base.d.ts:51

### `Optional` parentConfig

parentConfig?: RunnableConfig<Record<string, any\>\>

* Defined in libs/checkpoint/dist/base.d.ts:52

### `Optional` pendingWrites

pendingWrites?: \[string, string, unknown\]\[\]

* Defined in libs/checkpoint/dist/base.d.ts:53

### Settings

#### Member Visibility

* Protected
* Inherited
* External

#### Theme

OSLightDark

### On This Page

[checkpoint](#checkpoint)[config](#config)[metadata](#metadata)[parentConfig](#parentConfig)[pendingWrites](#pendingWrites)

[API Reference](../index.html)
* Loading...

Generated using [TypeDoc](https://typedoc.org/)