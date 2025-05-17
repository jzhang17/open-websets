[Back to documentation](/langgraphjs/)

* Preparing search index...
* The search index is not available

[API Reference](/)

* [API Reference](../index.html)
* [langgraph](../modules/langgraph.html)
* [interrupt](langgraph.interrupt-1.html)

# Function interrupt

* interrupt<[I](langgraph.interrupt-1.html#interrupt.I), [R](langgraph.interrupt-1.html#interrupt.R)>(value): [R](langgraph.interrupt-1.html#interrupt.R)
* Interrupts the execution of a graph node.
  This function can be used to pause execution of a node, and return the value of the `resume`
  input when the graph is re-invoked using `Command`.
  Multiple interrupts can be called within a single node, and each will be handled sequentially.

  When an interrupt is called:

  1. If there's a `resume` value available (from a previous `Command`), it returns that value.
  2. Otherwise, it throws a `GraphInterrupt` with the provided value
  3. The graph can be resumed by passing a `Command` with a `resume` value

  Because the `interrupt` function propagates by throwing a special `GraphInterrupt` error,
  you should avoid using `try/catch` blocks around the `interrupt` function,
  or if you do, ensure that the `GraphInterrupt` error is thrown again within your `catch` block.

  #### Type Parameters

  + I = unknown
  + R = any

  #### Parameters

  + value: [I](langgraph.interrupt-1.html#interrupt.I)

    The value to include in the interrupt. This will be available in task.interrupts[].value

  #### Returns [R](langgraph.interrupt-1.html#interrupt.R)

  The `resume` value provided when the graph is re-invoked with a Command

  #### Example

  ```
  // Define a node that uses multiple interrupts
  const nodeWithInterrupts = () => {
    // First interrupt - will pause execution and include {value: 1} in task values
    const answer1 = interrupt({ value: 1 });

    // Second interrupt - only called after first interrupt is resumed
    const answer2 = interrupt({ value: 2 });

    // Use the resume values
    return { myKey: answer1 + " " + answer2 };
  };

  // Resume the graph after first interrupt
  await graph.stream(new Command({ resume: "answer 1" }));

  // Resume the graph after second interrupt
  await graph.stream(new Command({ resume: "answer 2" }));
  // Final result: { myKey: "answer 1 answer 2" }
  Copy
  ```

  #### Throws

  If called outside the context of a graph

  #### Throws

  When no resume value is available

  + Defined in libs/langgraph/dist/interrupt.d.ts:44

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