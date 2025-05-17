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

# React Data GridContext

![react logo](/_astro/react.CtDRhtxt.svg)

This sections covers how shared contextual information can be passed around the grid.

## Overview [Copy Link](#overview)

The context object is passed to all callbacks and events used in the grid. The purpose of the context object is to allow the client application to pass details to custom callbacks such as the [Cell Renderers](/react-data-grid/component-cell-renderer/) and [Cell Editors](/react-data-grid/cell-editing/).

|  |
| --- |
| context[Copy Link](#reference-miscellaneous-context)  any  [Initial](/react-data-grid/grid-interface/#initial-grid-options)  Provides a context object that is provided to different callbacks the grid uses. Used for passing additional information to the callbacks used by your application. |

To update the context call `api.setGridOption` with the new context. Alternatively, if you maintain a reference to the context object it's values can be mutated directly.

## Context Object Example [Copy Link](#context-object-example)

The example below demonstrates how the context object can be used. Note the following:

* Selecting the reporting currency from the dropdown places it in the context object.
* When the reporting currency is changed the cell renderer uses the currency supplied in the context object to calculate the value using: `params.context.reportingCurrency`.
* The price column header is updated to show the selected currency using a header value getter using `ctx.reportingCurrency`.

## Context & Expressions Example [Copy Link](#context--expressions-example)

Below shows a complex example making use of value getters (using expressions) and class rules (again using expressions). The grid shows 'actual vs budget data and yearly total' for widget sales split by city and country.

* The **Location** column is showing the aggregation groups, grouping by city and country.
* The **Monthly Data** columns are affected by the context. Depending on the selected period, the data displayed is either actual (`x_act`) or budgeted (`x_bud`) data for the month (eg. `jan_act` when Jan is green, or `jan_bud` when Jan is red). Similarly, the background color is also changed using class rules dependent on the selected period.
* **sum(YTD)** is the total of the 'actual' figures, i.e. adding up all the green. This also changes as the period is changed.

Notice that the example (including calculating the expression on the fly, the grid only calculates what's needed to be displayed) runs very fast (once the data is loaded) despite having over 6,000 rows.

This example is best viewed by opening it in a new tab.

* [Context](#top)
* [Overview](#overview)
* [Context Object Example](#context-object-example)
* [Context & Expressions Example](#context--expressions-example)

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