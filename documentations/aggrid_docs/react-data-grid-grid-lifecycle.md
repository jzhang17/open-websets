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

# React Data GridGrid Lifecycle

![react logo](/_astro/react.CtDRhtxt.svg)

This section covers some common lifecycle events that are raised after grid initialisation, data updates, and before the grid is destroyed.

The events on this page are listed in the order they are raised.

## Grid Ready [Copy Link](#grid-ready)

The `gridReady` event fires upon grid initialisation but the grid may not be fully rendered.

**Common Uses**

* Customising Grid via API calls.
* Event listener setup.
* Grid-dependent setup code.

In this example, `gridReady` applies user pinning preferences before rendering data.

## First Data Rendered [Copy Link](#first-data-rendered)

The `firstDataRendered` event fires the first time data is rendered into the grid. It will only be fired once unlike `rowDataUpdated` which is fired on every data change.

## Row Data Updated [Copy Link](#row-data-updated)

The `rowDataUpdated` event fires every time the grid's data changes, by [Updating Row Data](/react-data-grid/data-update-row-data/) or by applying [Transaction Updates](/react-data-grid/data-update-transactions/). In the [Server Side Row Model](/react-data-grid/server-side-model/), use the [Model Updated Event](/react-data-grid/grid-events/#reference-miscellaneous-modelUpdated) instead.

In this example the time at which `firstDataRendered` and `rowDataUpdated` are fired is recorded above the grid. Note that `firstDataRendered` is only set on the initial load of the grid and is not updated when reloading data.

## Grid Pre-Destroyed [Copy Link](#grid-pre-destroyed)

The `gridPreDestroyed` event fires just before the grid is destroyed and is removed from the DOM.

**Common Uses**

* Clean up resources.
* Save grid state.
* Disconnect other libraries.

In this example, `gridPreDestroyed` saves column widths before grid destruction.

* [Grid Lifecycle](#top)
* [Grid Ready](#grid-ready)
* [First Data Rendered](#first-data-rendered)
* [Row Data Updated](#row-data-updated)
* [Grid Pre-Destroyed](#grid-pre-destroyed)

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