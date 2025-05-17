[Back to documentation](/langgraphjs/)

* Preparing search index...
* The search index is not available

[API Reference](/)

* [API Reference](../index.html)
* [langgraph](langgraph.html)
* [Annotation](langgraph.Annotation.html)

# Namespace Annotation

Helper that instantiates channels within a StateGraph state.

Can be used as a field in an [Annotation.Root](../functions/langgraph.Annotation.Root.html) wrapper in one of two ways:

1. **Directly**: Creates a channel that stores the most recent value returned from a node.
2. **With a reducer**: Creates a channel that applies the reducer on a node's return value.

#### Example

```
import { StateGraph, Annotation } from "@langchain/langgraph";

// Define a state with a single string key named "currentOutput"
const SimpleAnnotation = Annotation.Root({
  currentOutput: Annotation<string>,
});

const graphBuilder = new StateGraph(SimpleAnnotation);

// A node in the graph that returns an object with a "currentOutput" key
// replaces the value in the state. You can get the state type as shown below:
const myNode = (state: typeof SimpleAnnotation.State) => {
  return {
    currentOutput: "some_new_value",
  };
}

const graph = graphBuilder
  .addNode("myNode", myNode)
  ...
  .compile();
Copy
```

#### Example

```
import { type BaseMessage, AIMessage } from "@langchain/core/messages";
import { StateGraph, Annotation } from "@langchain/langgraph";

// Define a state with a single key named "messages" that will
// combine a returned BaseMessage or arrays of BaseMessages
const AnnotationWithReducer = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    // Different types are allowed for updates
    reducer: (left: BaseMessage[], right: BaseMessage | BaseMessage[]) => {
      if (Array.isArray(right)) {
        return left.concat(right);
      }
      return left.concat([right]);
    },
    default: () => [],
  }),
});

const graphBuilder = new StateGraph(AnnotationWithReducer);

// A node in the graph that returns an object with a "messages" key
// will update the state by combining the existing value with the returned one.
const myNode = (state: typeof AnnotationWithReducer.State) => {
  return {
    messages: [new AIMessage("Some new response")],
  };
};

const graph = graphBuilder
  .addNode("myNode", myNode)
  ...
  .compile();
Copy
```

* Defined in libs/langgraph/dist/graph/annotation.d.ts:116

### Index

### Functions

[Root](../functions/langgraph.Annotation.Root.html)

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