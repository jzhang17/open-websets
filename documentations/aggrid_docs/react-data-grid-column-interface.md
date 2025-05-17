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

# React Data GridColumn Overview

![react logo](/_astro/react.CtDRhtxt.svg)

Columns are the key configuration point for controlling how data is displayed and interacted with inside the grid.

## Column Options [Copy Link](#column-options)

Column Options, also known as column definitions, implement the `ColDef<TData, TValue>` or `ColGroupDef<TData>` interfaces and control all aspects of how a column behaves in the grid.

See [Column Options](/react-data-grid/column-properties/) for a complete list of configuration options.

### Initial Column Options [Copy Link](#initial-column-options)

A small number of Column Options do **not** support updating their value. Their value is only read during the initial creation of the column. These options are marked as `Initial` on the [Options Reference](/react-data-grid/column-properties/). See [Changing Column State](/react-data-grid/column-updating-definitions/#changing-column-state) for more information.

Not all Column Options support updates. These are marked as Initial.

## Column [Copy Link](#column)

Each column in the grid is represented by a `Column` instance, which has a reference to the underlying column definition. The `Column` has attributes, methods and events for interacting with the specific column e.g. `column.isVisible()`.

See [Column](/react-data-grid/column-object/) for a complete list of attributes / methods associated with columns.

## Column Group [Copy Link](#column-group)

If using column groups then each group is represented by a `ColumnGroup` or `ProvidedColumnGroup` instance. Both have methods for interacting with the column group e.g. `column.isExpanded()`.

There are many overlapping methods between `ColumnGroup` and `ProvidedColumnGroup` as they are similar objects. The key difference is that `ColumnGroups` align with the columns that are visible in the grid whereas `ProvidedColumnGroups` align with the columns that are provided to the grid. For example, a group could be split apart by moving a column and this would result in a new `ColumnGroup` but the `ProvidedColumnGroup` would remain the same.

See [Column Group](/react-data-grid/column-object-group/) for a complete list of methods associated with column groups.

## Column Events [Copy Link](#column-events)

Columns fire events as they are updated which makes it possible to trigger logic in your application.

Most users will not need to use Column Events but they are made available for advanced use cases. Please consider the guidance below.

### Column Event Guidance [Copy Link](#column-event-guidance)

All events fired by the column are synchronous (events are normally asynchronous). The grid is also listening for these events internally. This means that when you receive an event, the grid may still have some work to do (e.g. if sort has changed, the grid UI may still have to do the sorting).

It is recommended to **not** call any grid API functions while receiving events from the `column`. Instead, it is best to put your logic into a timeout and call the grid in another VM tick.

When adding event listeners to a column, they will stay with the column until the column is destroyed. Columns are destroyed when you add new columns to the grid. Column objects are NOT destroyed when the columns is removed from the DOM (e.g. column virtualisation removes the column due to horizontal scrolling, or the column is made invisible via the API).

If you add listeners to columns in custom header components, be sure to remove the listener when the header component is destroyed.

```
// add visibility listener to 'country' column
const listener = event => console.log('Column visibility changed', event);

const column = api.getColumn('country');
column.addEventListener('visibleChanged', listener);

// sometime later, remove the listener
column.removeEventListener('visibleChanged', listener);

```

* [Column Overview](#top)
* [Column Options](#column-options)
* [Initial Column Options](#initial-column-options)
* [Column](#column)
* [Column Group](#column-group)
* [Column Events](#column-events)
* [Column Event Guidance](#column-event-guidance)

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