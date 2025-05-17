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

# React Data GridRow Overview

![react logo](/_astro/react.CtDRhtxt.svg)React

Every row displayed in the grid is represented by a Row Node which exposes stateful attributes and methods for directly interacting with the row.

##  Row Node [Copy Link](#row-node) 

Row Nodes implement the `IRowNode<TData>` interface and in most cases wrap individual data items as supplied to the grid. Row nodes also contain runtime information about the row such as its current rowIndex. The Row Node contains attributes, methods and emits events. Additional attributes are used if the Row Node is a group.

See [Row Reference](/react-data-grid/row-object/) for a complete list of attributes / methods associated with rows.

##  Row Events [Copy Link](#row-events) 

Row Nodes fire events as they are updated which makes it possible to trigger logic in your application.

Most users will not need to use Row Events but they are made available for advanced use cases. Please consider the guidance below.

###  Row Event Guidance [Copy Link](#row-event-guidance) 

All events fired by the `rowNode` are synchronous (events are normally asynchronous). The grid is also listening for these events internally. This means that when you receive an event, the grid may still have some work to do (e.g. if `rowTop` changed, the grid UI may still have to update to reflect this change).

It is recommended to **not** call any grid API functions while receiving events from the `rowNode`. Instead, it is best to put your logic into a timeout and call the grid in another VM tick.

###  Row Event Listener Lifecycle [Copy Link](#row-event-listener-lifecycle) 

When adding event listeners to a row, they will stay with the row until the row is destroyed. This means if the row is taken out of memory (pagination or virtual paging) then the listener will be removed. Likewise, if you set new data into the grid, all listeners on the old data will be removed.

Be careful when adding listeners to `rowNodes` in cell renderers that you remove the listener when the rendered row is destroyed due to row virtualisation. You can cater for this as follows:

```
init(params: ICellRendererParams) {
    // add listener
    var selectionChangedCallback = () => {
        // some logic on selection changed here
        console.log('node selected = ' + params.node.isSelected());
    };

    params.node.addEventListener('rowSelected', selectionChangedCallback);

    // remove listener on destroy
    params.api.addRenderedRowListener('virtualRowRemoved', params.rowIndex, () => {
        params.node.removeEventListener('rowSelected', selectionChangedCallback);
    })
}

```

See [Row Events](/react-data-grid/row-events/) for a complete list of row events.

* [Row Overview](#top)
* [Row Node](#row-node)
* [Row Events](#row-events)
* [Row Event Guidance](#row-event-guidance)
* [Row Event Listener Lifecycle](#row-event-listener-lifecycle)

© AG Grid Ltd. 2015-2025

AG Grid Ltd registered in the United Kingdom. Company No. 07318192.

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
* [Blog](https://blog.ag-grid.com/?%5Fga=2.213149716.106872681.1607518091-965402545.1605286673)
* [Privacy Policy](/privacy)
* [Cookies Policy](/cookies)
* [Sitemap](/sitemap)

## Follow

* [GitHub](https://github.com/ag-grid/ag-grid)
* [X](https://twitter.com/ag%5Fgrid)
* [YouTube](https://youtube.com/c/ag-grid)
* [LinkedIn](https://www.linkedin.com/company/ag-grid)