[Back to documentation](/langgraphjs/)

* Preparing search index...
* The search index is not available

[API Reference](/)

* [API Reference](../index.html)
* [langgraph-swarm](../modules/langgraph_swarm.html)
* [SwarmState](langgraph_swarm.SwarmState.html)

# Variable SwarmState`Const`

SwarmState: [AnnotationRoot](../classes/langgraph.AnnotationRoot.html)<{
    activeAgent: {
        Root: (<S>(sd) => [AnnotationRoot](../classes/langgraph.AnnotationRoot.html)<S>);
        (): LastValue<string>;
        (annotation): [BinaryOperatorAggregate](../classes/langgraph.BinaryOperatorAggregate.html)<string, string>;
    };
    messages: [langgraph](../modules/langgraph.html);
}>

State schema for the multi-agent swarm.

#### Type declaration

* ##### activeAgent: {     Root: (<S>(sd) => [AnnotationRoot](../classes/langgraph.AnnotationRoot.html)<S>);     (): LastValue<string>;     (annotation): [BinaryOperatorAggregate](../classes/langgraph.BinaryOperatorAggregate.html)<string, string>; }

  + - (): LastValue<string>
    - #### Returns LastValue<string>
    - (annotation): [BinaryOperatorAggregate](../classes/langgraph.BinaryOperatorAggregate.html)<string, string>
    - #### Parameters

      * annotation: [SingleReducer](../types/langgraph.SingleReducer.html)<string, string>

      #### Returns [BinaryOperatorAggregate](../classes/langgraph.BinaryOperatorAggregate.html)<string, string>
  + ##### Root: (<S>(sd) => [AnnotationRoot](../classes/langgraph.AnnotationRoot.html)<S>)

    - * <S>(sd): [AnnotationRoot](../classes/langgraph.AnnotationRoot.html)<S>
      * #### Type Parameters

        + S extends [langgraph](../modules/langgraph.html)

        #### Parameters

        + sd: S

        #### Returns [AnnotationRoot](../classes/langgraph.AnnotationRoot.html)<S>
* ##### messages: [langgraph](../modules/langgraph.html)

* Defined in libs/langgraph-swarm/dist/swarm.d.ts:5

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