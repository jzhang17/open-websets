Products

Docs

Search

* [Demos](/example/)
* [Theme Builder](/theme-builder/)
* [Docs](/react-data-grid/getting-started/)
* [API](/react-data-grid/reference/)
* [Community](/community/)
* [Pricing](/license-pricing/)
* [GitHub](https://github.com/ag-grid/ag-grid)
* Dark Mode

* [AG Charts](https://www.ag-grid.com/charts)
* [Demos](/example/)
* [Theme Builder](/theme-builder/)
* [Docs](/react-data-grid/getting-started/)
* [API](/react-data-grid/reference/)
* [Community](/community/)
* [Pricing](/license-pricing/)
* [GitHub](https://github.com/ag-grid/ag-grid)
* Dark Mode

[AG Grid: Reference](/react-data-grid/reference/)

---

##### Grid

[Overview](/react-data-grid/grid-interface/)[Options Reference](/react-data-grid/grid-options/)[Events Reference](/react-data-grid/grid-events/)[API Reference](/react-data-grid/grid-api/)[Grid State](/react-data-grid/grid-state/)[Grid Lifecycle](/react-data-grid/grid-lifecycle/)[Grid Context](/react-data-grid/context/)[Custom Components](/react-data-grid/components/)

---

##### Column

[Overview](/react-data-grid/column-interface/)[Options Reference](/react-data-grid/column-properties/)[Column Reference](/react-data-grid/column-object/)[Column Group Reference](/react-data-grid/column-object-group/)[Events Reference](/react-data-grid/column-events/)

---

##### Row

[Overview](/react-data-grid/row-interface/)[Row Reference](/react-data-grid/row-object/)[Events Reference](/react-data-grid/row-events/)

---

##### Typescript

[Generics](/react-data-grid/typescript-generics/)

# React Data GridGrid Overview

![react logo](/_astro/react.CtDRhtxt.svg)

This section provides key information for configuring and interacting with a grid.

## Grid Options [Copy Link](#grid-options)

The grid is configure via props on the `AgGridReact` component. Props consist of simple types, arrays, complex objects and callback functions.

```
<AgGridReact
    // Simple attributes
    rowGroupPanelShow="always"
    // Component state
    columnDefs={columnDefs}
    // Callback
    getRowHeight={getRowHeight}
    // Event handlers
    onCellClicked={onCellClicked}
/>

```

When setting properties, it's best to treat non-simple types as immutable objects (e.g. by using `useState` or `useMemo`). See [React Best Practices](/react-data-grid/react-hooks/).

### Updating Grid Options [Copy Link](#updating-grid-options)

It is a common requirement to update a grid option after the grid has been created. For example, you may want to change `rowHeight` via an application toggle.

Simply update your state and the grid will respond to the new value. In this example all the rows will be redrawn with the new height.

```
const [rowHeight, setRowHeight] = useState(25);

// Callback to update the rowHeight
const updateHeight = () => setRowHeight(50);

<AgGridReact
    rowHeight={rowHeight}
/>

```

We recommend updating options via `AgGridReact` props but it is also possible to updated a property via `api.setGridOption` or `api.updateGridOptions`.

```
// update the rowHeight
api.setGridOption('rowHeight', 50);

```

### Initial Grid Options [Copy Link](#initial-grid-options)

A small number of Grid Options do **not** support updating their value. Their value is only read during the initial setup of the grid. These options are marked as `Initial` on the [Options Reference](/react-data-grid/grid-options/). For these properties the grid must be destroyed and re-created for the new value to take effect.

Not all Grid Options support updates. These are marked as Initial.

For a full list of options see: [Options Reference](/react-data-grid/grid-options/).

### Global Grid Options [Copy Link](#global-grid-options)

Global Grid Options can be used to share configuration across all grids in an application. Global grid options are provided by passing the global options to `provideGlobalGridOptions`. Each grid will inherit the global options with local options taking precedence if both define the same property.

```
import { provideGlobalGridOptions } from 'ag-grid-community';

// provide localeText to all grids via global options
provideGlobalGridOptions({
    localeText: userLocaleText,
});

```

The `provideGlobalGridOptions` function takes an optional second parameter (`deep` / `shallow`) to control the behaviour when object configurations exists on both global and local grid options. With `shallow` an object property on the local grid options will completely replace the global object property. With `deep` the global object properties are merged with the local object properties. Default is `shallow`.

## Grid Events [Copy Link](#grid-events)

As a user interacts with the grid events will be fired to enable your application to respond to specific actions.

To listen to an event pass a callback to the `AgGridReact` component for the given event. All events start with the prefix `on`, i.e the `cellClicked` event has the prop name `onCellClicked`. We recommend the use of `useCallback` to avoid wasted renders: see [React Best Practices](/react-data-grid/react-hooks/).

```
const onCellClicked = useCallback((params: CellClickedEvent) => {
  console.log('Cell was clicked')
}, []);

<AgGridReact onCellClicked={onCellClicked}> </AgGridReact>

```

TypeScript users can take advantage of the events' interfaces. Construct the interface name by suffixing the event name with `Event`. For example, the `cellClicked` event uses the interface `CellClickedEvent`. All events support [TypeScript Generics](/react-data-grid/typescript-generics/).

For a full list of events see: [Grid Events](/react-data-grid/grid-events/).

## Grid API [Copy Link](#grid-api)

The api of the grid can be accessed via a ref passed to the `AgGridReact` component.

```
// Create a gridRef
const gridRef = useRef();

const onClick = useCallback(() => {
    // Use the gridRef to access the api
    gridRef.current?.api.deselectAll();
}, []);

<AgGridReact ref={gridRef}  />

```

The gridRef.current value will not be defined until after the AgGridReact component has been initialised. If you want to access the api as soon as it's available (ie do initialisation work), consider listening to the `gridReady` event.

The `api` is also provided on the params for all grid events and callbacks.

```
// access api directly within event handler
onGridReady = useCallback((event: GridReadyEvent) => {
    event.api.resetColumnState();
},[]);

<AgGridReact onGridReady={onGridReady} />

```

For a full list of api methods see: [Grid API](/react-data-grid/grid-api/).

## Grid State [Copy Link](#grid-state)

As a user interacts with the grid they may change state such as filtering, sorting and column order. This state is independent of the configuration and to provide save and restore capabilities the grid enables applications to save / restore this state.

For a full list of the state properties see: [Grid State](/react-data-grid/grid-state/).

## Grid Lifecycle [Copy Link](#grid-lifecycle)

When working with AG Grid it is a common requirement to perform actions when the grid is first initialised, when data is first rendered and when the grid is about to be destroyed.

For full details about how to interact with the grid at these key moments see: [Grid Lifecycle](/react-data-grid/grid-lifecycle/).

* [Grid Overview](#top)
* [Grid Options](#grid-options)
* [Updating Grid Options](#updating-grid-options)
* [Initial Grid Options](#initial-grid-options)
* [Global Grid Options](#global-grid-options)
* [Grid Events](#grid-events)
* [Grid API](#grid-api)
* [Grid State](#grid-state)
* [Grid Lifecycle](#grid-lifecycle)

© AG Grid Ltd. 2015-2025

AG Grid Ltd registered in the United Kingdom. Company No. 07318192.

## Documentation

* [Getting Started](/documentation)
* [Changelog](/changelog)
* [Pipeline](/pipeline)
* [Documentation Archive](/documentation-archive)

## Support & Community

* [Stack Overflow](https://stackoverflow.com/questions/tagged/ag-grid)
* [License & Pricing](/license-pricing)
* [Support via Zendesk](https://ag-grid.zendesk.com/)

## The Company

* [AG Charts](https://www.ag-grid.com/charts/)
* [About](/about)
* [Blog](https://blog.ag-grid.com/?_ga=2.213149716.106872681.1607518091-965402545.1605286673)
* [Privacy Policy](/privacy)
* [Cookies Policy](/cookies)
* [Sitemap](/sitemap)

## Follow

* [GitHub](https://github.com/ag-grid/ag-grid)
* [X](https://twitter.com/ag_grid)
* [YouTube](https://youtube.com/c/ag-grid)
* [LinkedIn](https://www.linkedin.com/company/ag-grid)