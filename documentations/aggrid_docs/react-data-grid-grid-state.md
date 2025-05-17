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

# React Data GridGrid State

![react logo](/_astro/react.CtDRhtxt.svg)React

This section covers saving and restoring the grid state, such as the filter model, selected rows, etc.

##  Saving and Restoring State [Copy Link](#saving-and-restoring-state) 

The following buttons log saving and restoring state to the developer console.

The initial state is provided via the grid option `initialState`. It is only read once when the grid is created.

```
const initialState = {
    filter: {
        filterModel: { 
            year: {
                filterType: 'set',
                values: ['2012'],
            }
        }
    },
    columnVisibility: {
        hiddenColIds: ['athlete'],
    },
    rowGroup: {
        groupColIds: ['athlete'],
    }
};

<AgGridReact initialState={initialState} />
```

The current grid state can be retrieved by listening to the state updated event, which is fired with the latest state when it changes, or via `api.getState()`.

The state is also passed in the [Grid Pre-Destroyed Event](/react-data-grid/grid-lifecycle/#grid-pre-destroyed), which can be used to get the state when the grid is destroyed.

| gridPreDestroyed[Copy Link](#reference-miscellaneous-gridPreDestroyed)GridPreDestroyedEventInvoked immediately before the grid is destroyed. This is useful for cleanup logic that needs to run before the grid is torn down. |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| stateUpdated[Copy Link](#reference-miscellaneous-stateUpdated)StateUpdatedEventGrid state has been updated.                                                                                                                   |

##  State Contents [Copy Link](#state-contents) 

The following is captured in the grid state:

* [Aggregation Functions](/react-data-grid/aggregation/) (column state)
* [Opened Column Groups](/react-data-grid/column-groups/)
* [Column Order](/react-data-grid/column-moving/) (column state)
* [Pinned Columns](/react-data-grid/column-pinning/) (column state)
* [Column Sizes](/react-data-grid/column-sizing/) (column state)
* [Hidden Columns](/react-data-grid/column-properties/#reference-display-hide) (column state)
* [Column Filter Model](/react-data-grid/filtering/)
* [Advanced Filter Model](/react-data-grid/filter-advanced/#filter-model--api)
* [Focused Cell](/react-data-grid/keyboard-navigation/) ([Client-Side Row Model](/react-data-grid/row-models/) only)
* [Current Page](/react-data-grid/row-pagination/)
* [Pivot Mode and Columns](/react-data-grid/pivoting/) (column state)
* [Cell Selection](/react-data-grid/cell-selection/)
* [Row Group Columns](/react-data-grid/grouping/) (column state)
* [Expanded Row Groups](/react-data-grid/grouping-opening-groups/)
* [Row Selection](/react-data-grid/row-selection/) (retrievable for all row models, but can only be set for [Client-Side Row Model](/react-data-grid/row-models/) and [Server-Side Row Model](/react-data-grid/row-models/))
* [Pinned Rows](/react-data-grid/row-pinning/)
* [Side Bar](/react-data-grid/side-bar/)
* [Sort](/react-data-grid/row-sorting/) (column state)

When restoring the current page using the [Server Side Row Model](/react-data-grid/server-side-model/) or [Infinite Row Model](/react-data-grid/infinite-scrolling/), additional configuration is required:

* For the Server Side Row Model - set the `serverSideInitialRowCount` property to a value which includes the rows to be shown.
* For the Infinite Row Model - set the `infiniteInitialRowCount` property to a value which includes the rows to be shown.

All state properties are optional, so a property can be excluded if you do not want to restore it.

If applying some but not all of the column state properties, then `initialState.partialColumnState` must be set to `true`.

The state also contains the grid version number. When applying state with older version numbers, any old state properties will be automatically migrated to the current format.

The grid state is designed to be serialisable, so any functions will be stripped out. For example, aggregation functions should be [Registered as Custom Functions](/react-data-grid/aggregation-custom-functions/#registering-custom-functions) to work with state rather than being set as [Directly Applied Functions](/react-data-grid/aggregation-custom-functions/#directly-applied-functions).

Properties available on the `GridState` interface.

| version[Copy Link](#reference-GridState-version)string Grid version number                                                                                                                                                                                   |                                                                                                                                   |                                                                                                                                                           |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| aggregation[Copy Link](#reference-GridState-aggregation)AggregationState Includes aggregation functions (column state)                                                                                                                                       |                                                                                                                                   |                                                                                                                                                           |
| columnGroup[Copy Link](#reference-GridState-columnGroup)ColumnGroupState Includes opened groups                                                                                                                                                              |                                                                                                                                   |                                                                                                                                                           |
| columnOrder[Copy Link](#reference-GridState-columnOrder)ColumnOrderState Includes column ordering (column state)                                                                                                                                             |                                                                                                                                   |                                                                                                                                                           |
| columnPinning[Copy Link](#reference-GridState-columnPinning)ColumnPinningState Includes left/right pinned columns (column state)                                                                                                                             |                                                                                                                                   |                                                                                                                                                           |
| columnSizing[Copy Link](#reference-GridState-columnSizing)ColumnSizingState Includes column width/flex (column state)                                                                                                                                        |                                                                                                                                   |                                                                                                                                                           |
| columnVisibility[Copy Link](#reference-GridState-columnVisibility)ColumnVisibilityState Includes hidden columns (column state)                                                                                                                               |                                                                                                                                   |                                                                                                                                                           |
| filter[Copy Link](#reference-GridState-filter)FilterState Includes Column Filters and Advanced Filter                                                                                                                                                        |                                                                                                                                   |                                                                                                                                                           |
| focusedCell[Copy Link](#reference-GridState-focusedCell)FocusedCellState Includes currently focused cell. Works for Client-Side Row Model only                                                                                                               |                                                                                                                                   |                                                                                                                                                           |
| pagination[Copy Link](#reference-GridState-pagination)PaginationState Includes current page                                                                                                                                                                  |                                                                                                                                   |                                                                                                                                                           |
| rowPinning[Copy Link](#reference-GridState-rowPinning)RowPinningState Includes currently manually pinned rows                                                                                                                                                |                                                                                                                                   |                                                                                                                                                           |
| pivot[Copy Link](#reference-GridState-pivot)PivotState Includes current pivot mode and pivot columns (column state)                                                                                                                                          |                                                                                                                                   |                                                                                                                                                           |
| cellSelection[Copy Link](#reference-GridState-cellSelection)CellSelectionState Includes currently selected cell ranges                                                                                                                                       |                                                                                                                                   |                                                                                                                                                           |
| rowGroup[Copy Link](#reference-GridState-rowGroup)RowGroupState Includes current row group columns (column state)                                                                                                                                            |                                                                                                                                   |                                                                                                                                                           |
| rowGroupExpansion[Copy Link](#reference-GridState-rowGroupExpansion)RowGroupExpansionState Includes currently expanded group rows                                                                                                                            |                                                                                                                                   |                                                                                                                                                           |
| rowSelection[Copy Link](#reference-GridState-rowSelection)string\[\] \| ServerSideRowSelectionState                                                                                                                                                          | ServerSideRowGroupSelectionState Includes currently selected rows. For Server-Side Row Model, will be ServerSideRowSelectionState | ServerSideRowGroupSelectionState, for other row models, will be an array of row IDs. Can only be set for Client-Side Row Model and Server-Side Row Model. |
| scroll[Copy Link](#reference-GridState-scroll)ScrollState Includes current scroll position. Works for Client-Side Row Model only                                                                                                                             |                                                                                                                                   |                                                                                                                                                           |
| sideBar[Copy Link](#reference-GridState-sideBar)SideBarState Includes current Side Bar positioning and opened tool panel                                                                                                                                     |                                                                                                                                   |                                                                                                                                                           |
| sort[Copy Link](#reference-GridState-sort)SortState Includes current sort columns and direction (column state)                                                                                                                                               |                                                                                                                                   |                                                                                                                                                           |
| partialColumnState[Copy Link](#reference-GridState-partialColumnState)boolean When providing a partial initialState with some but not all column state properties, set this to true. Not required if passing the whole state object retrieved from the grid. |                                                                                                                                   |                                                                                                                                                           |

##  Converting Column State to Grid State [Copy Link](#converting-column-state-to-grid-state) 

State retrieved via the [Column State](/react-data-grid/column-state/) APIs can be converted into grid state via the helper functions `convertColumnState` and `convertColumnGroupState`.

```
const state = {
    ...convertColumnState(columnState),
    ...convertColumnGroupState(columnGroupState)
};

```

* [Grid State](#top)
* [Saving and Restoring State](#saving-and-restoring-state)
* [State Contents](#state-contents)
* [Converting Column State to Grid State](#converting-column-state-to-grid-state)

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