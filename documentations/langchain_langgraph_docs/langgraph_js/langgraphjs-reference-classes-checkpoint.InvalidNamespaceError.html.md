[Back to documentation](/langgraphjs/)

* Preparing search index...
* The search index is not available
[API Reference](/)

* [API Reference](../index.html)
* [checkpoint](../modules/checkpoint.html)
* [InvalidNamespaceError](checkpoint.InvalidNamespaceError.html)

# Class InvalidNamespaceError

Error thrown when an invalid namespace is provided.

#### Hierarchy

* Error  
   * InvalidNamespaceError

* Defined in libs/checkpoint/dist/store/base.d.ts:5

#####  Index

### Constructors

[constructor](checkpoint.InvalidNamespaceError.html#constructor) 

### Properties

[cause?](checkpoint.InvalidNamespaceError.html#cause) [message](checkpoint.InvalidNamespaceError.html#message) [name](checkpoint.InvalidNamespaceError.html#name) [stack?](checkpoint.InvalidNamespaceError.html#stack) [prepareStackTrace?](checkpoint.InvalidNamespaceError.html#prepareStackTrace) [stackTraceLimit](checkpoint.InvalidNamespaceError.html#stackTraceLimit) 

### Methods

[captureStackTrace](checkpoint.InvalidNamespaceError.html#captureStackTrace) 

## Constructors

### constructor

* new InvalidNamespaceError(message): [InvalidNamespaceError](checkpoint.InvalidNamespaceError.html)
* #### Parameters  
   * message: string  
#### Returns [InvalidNamespaceError](checkpoint.InvalidNamespaceError.html)  
Overrides Error.constructor  
   * Defined in libs/checkpoint/dist/store/base.d.ts:6

## Properties

### `Optional` cause

cause?: unknown

Inherited from Error.cause

* Defined in node\_modules/typescript/lib/lib.es2022.error.d.ts:26

### message

message: string

Inherited from Error.message

* Defined in node\_modules/typescript/lib/lib.es5.d.ts:1054

### name

name: string

Inherited from Error.name

* Defined in node\_modules/typescript/lib/lib.es5.d.ts:1053

### `Optional` stack

stack?: string

Inherited from Error.stack

* Defined in node\_modules/typescript/lib/lib.es5.d.ts:1055

### `Static` `Optional` prepareStackTrace

prepareStackTrace?: ((err, stackTraces) \=> any)

Optional override for formatting stack traces

#### Type declaration

* * (err, stackTraces): any  
   * #### Parameters  
         * err: Error  
         * stackTraces: CallSite\[\]  
   #### Returns any

#### See

<https://v8.dev/docs/stack-trace-api#customizing-stack-traces>

Inherited from Error.prepareStackTrace

* Defined in node\_modules/@types/node/globals.d.ts:28

### `Static` stackTraceLimit

stackTraceLimit: number

Inherited from Error.stackTraceLimit

* Defined in node\_modules/@types/node/globals.d.ts:30

## Methods

### `Static` captureStackTrace

* captureStackTrace(targetObject, constructorOpt?): void
* Create .stack property on a target object  
#### Parameters  
   * targetObject: object  
   * `Optional` constructorOpt: Function  
#### Returns void  
Inherited from Error.captureStackTrace  
   * Defined in node\_modules/@types/node/globals.d.ts:21

### Settings

#### Member Visibility

* Protected
* Inherited
* External

#### Theme

OSLightDark

### On This Page

[constructor](#constructor)[cause](#cause)[message](#message)[name](#name)[stack](#stack)[prepareStackTrace](#prepareStackTrace)[stackTraceLimit](#stackTraceLimit)[captureStackTrace](#captureStackTrace)

[API Reference](../index.html)
* Loading...

Generated using [TypeDoc](https://typedoc.org/)