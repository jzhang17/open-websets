[Back to documentation](/langgraphjs/)

* Preparing search index...
* The search index is not available

[API Reference](/)

* [API Reference](../index.html)
* [checkpoint](../modules/checkpoint.html)
* [ReadonlyCheckpoint](checkpoint.ReadonlyCheckpoint.html)

# Interface ReadonlyCheckpoint

interface ReadonlyCheckpoint {
    [channel\_values](checkpoint.ReadonlyCheckpoint.html#channel_values): Readonly<Record<string, unknown>>;
    [channel\_versions](checkpoint.ReadonlyCheckpoint.html#channel_versions): Readonly<Record<string, ChannelVersion>>;
    [id](checkpoint.ReadonlyCheckpoint.html#id): string;
    [pending\_sends](checkpoint.ReadonlyCheckpoint.html#pending_sends): [SendProtocol](checkpoint.SendProtocol.html)[];
    [ts](checkpoint.ReadonlyCheckpoint.html#ts): string;
    [v](checkpoint.ReadonlyCheckpoint.html#v): number;
    [versions\_seen](checkpoint.ReadonlyCheckpoint.html#versions_seen): Readonly<Record<string, Readonly<Record<string, ChannelVersion>>>>;
}

#### Hierarchy

* Readonly<[Checkpoint](checkpoint.Checkpoint.html)>
  + ReadonlyCheckpoint

* Defined in libs/checkpoint/dist/base.d.ts:38

##### Index

### Properties

[channel\_values](checkpoint.ReadonlyCheckpoint.html#channel_values)
[channel\_versions](checkpoint.ReadonlyCheckpoint.html#channel_versions)
[id](checkpoint.ReadonlyCheckpoint.html#id)
[pending\_sends](checkpoint.ReadonlyCheckpoint.html#pending_sends)
[ts](checkpoint.ReadonlyCheckpoint.html#ts)
[v](checkpoint.ReadonlyCheckpoint.html#v)
[versions\_seen](checkpoint.ReadonlyCheckpoint.html#versions_seen)

## Properties

### `Readonly` channel\_values

channel\_values: Readonly<Record<string, unknown>>

Overrides Readonly.channel\_values

* Defined in libs/checkpoint/dist/base.d.ts:39

### `Readonly` channel\_versions

channel\_versions: Readonly<Record<string, ChannelVersion>>

Overrides Readonly.channel\_versions

* Defined in libs/checkpoint/dist/base.d.ts:40

### `Readonly` id

id: string

Checkpoint ID {uuid6}

Inherited from Readonly.id

* Defined in libs/checkpoint/dist/base.d.ts:15

### `Readonly` pending\_sends

pending\_sends: [SendProtocol](checkpoint.SendProtocol.html)[]

List of packets sent to nodes but not yet processed.
Cleared by the next checkpoint.

Inherited from Readonly.pending\_sends

* Defined in libs/checkpoint/dist/base.d.ts:36

### `Readonly` ts

ts: string

Timestamp {new Date().toISOString()}

Inherited from Readonly.ts

* Defined in libs/checkpoint/dist/base.d.ts:19

### `Readonly` v

v: number

The version of the checkpoint format. Currently 1

Inherited from Readonly.v

* Defined in libs/checkpoint/dist/base.d.ts:11

### `Readonly` versions\_seen

versions\_seen: Readonly<Record<string, Readonly<Record<string, ChannelVersion>>>>

Overrides Readonly.versions\_seen

* Defined in libs/checkpoint/dist/base.d.ts:41

### Settings

#### Member Visibility

* Protected
* Inherited
* External

#### Theme

OSLightDark

### On This Page

[channel\_values](#channel_values)[channel\_versions](#channel_versions)[id](#id)[pending\_sends](#pending_sends)[ts](#ts)[v](#v)[versions\_seen](#versions_seen)

[API Reference](../index.html)

* Loading...

Generated using [TypeDoc](https://typedoc.org/)