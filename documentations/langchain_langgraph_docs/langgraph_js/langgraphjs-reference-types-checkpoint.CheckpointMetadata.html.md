[Back to documentation](/langgraphjs/)

* Preparing search index...
* The search index is not available

[API Reference](/)

* [API Reference](../index.html)
* [checkpoint](../modules/checkpoint.html)
* [CheckpointMetadata](checkpoint.CheckpointMetadata.html)

# Type alias CheckpointMetadata<ExtraProperties>

CheckpointMetadata<[ExtraProperties](checkpoint.CheckpointMetadata.html#ExtraProperties)>: {
    parents: Record<string, string>;
    source: "input" | "loop" | "update" | "fork";
    step: number;
    writes: Record<string, unknown> | null;
} & [ExtraProperties](checkpoint.CheckpointMetadata.html#ExtraProperties)

Additional details about the checkpoint, including the source, step, writes, and parents.

#### Type Parameters

* ExtraProperties extends object = object

  Optional additional properties to include in the metadata.

#### Type declaration

* ##### parents: Record<string, string>

  The IDs of the parent checkpoints.
  Mapping from checkpoint namespace to checkpoint ID.
* ##### source: "input" | "loop" | "update" | "fork"

  The source of the checkpoint.

  + "input": The checkpoint was created from an input to invoke/stream/batch.
  + "loop": The checkpoint was created from inside the pregel loop.
  + "update": The checkpoint was created from a manual state update.
  + "fork": The checkpoint was created as a copy of another checkpoint.
* ##### step: number

  The step number of the checkpoint.
  -1 for the first "input" checkpoint.
  0 for the first "loop" checkpoint.
  ... for the nth checkpoint afterwards.
* ##### writes: Record<string, unknown> | null

  The writes that were made between the previous checkpoint and this one.
  Mapping from node name to writes emitted by that node.

* Defined in libs/checkpoint/dist/types.d.ts:13

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