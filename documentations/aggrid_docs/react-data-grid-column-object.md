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

# React Data GridColumn Reference

![react logo](/_astro/react.CtDRhtxt.svg)

Attributes and methods available on the `Column` instance.

## Clipboard

|  |
| --- |
| isSuppressPaste[Copy Link](#reference-clipboard-isSuppressPaste)  Function  Returns `true` if paste is suppress for this column and row node. |

## Column Groups

|  |
| --- |
| getParent[Copy Link](#reference-columnGroups-getParent)  Function  Returns the parent column group, if column grouping is active. |
| getOriginalParent[Copy Link](#reference-columnGroups-getOriginalParent)  Function  Returns the parent column group, if this column is part of a column group. |
| getColumnGroupShow[Copy Link](#reference-columnGroups-getColumnGroupShow)  Function  Returns whether this column should be shown when the group is open / closed or undefined if its always shown. |
| getColumnGroupPaddingInfo[Copy Link](#reference-columnGroups-getColumnGroupPaddingInfo)  Function  Returns column group padding info. |
| isEmptyGroup[Copy Link](#reference-columnGroups-isEmptyGroup)  Function  Returns `true` if this is an empty group. |

## Definitions

|  |
| --- |
| getColId[Copy Link](#reference-definitions-getColId)  Function  Returns the unique ID for the column. Equivalent: `getId`, `getUniqueId` |
| getColDef[Copy Link](#reference-definitions-getColDef)  Function  Returns the column definition for this column. The column definition will be the result of merging the application provided column definition with any provided defaults (e.g. `defaultColDef` grid option, or column types. Equivalent: `getDefinition` |
| getUserProvidedColDef[Copy Link](#reference-definitions-getUserProvidedColDef)  Function  Returns the column definition provided by the application. This may not be correct, as items can be superseded by default column options. However it's useful for comparison, eg to know which application column definition matches that column. |
| isColumn[Copy Link](#reference-definitions-isColumn)  true  isColumn is always `true`. Used to distinguish between columns and column groups. |

## Display

|  |
| --- |
| getLeft[Copy Link](#reference-display-getLeft)  Function  Returns the left position of the column. |
| isVisible[Copy Link](#reference-display-isVisible)  Function  Returns `true` if the column is visible. |

## Editing

|  |
| --- |
| isCellEditable[Copy Link](#reference-editing-isCellEditable)  Function  Returns `true` if the cell for this column is editable for the given `rowNode`, otherwise `false`. |
| isSuppressFillHandle[Copy Link](#reference-editing-isSuppressFillHandle)  Function  Returns `true` if the fill handle is suppressed. |

## Events

|  |
| --- |
| addEventListener[Copy Link](#reference-events-addEventListener)  Function  Add an event listener to the column. |
| removeEventListener[Copy Link](#reference-events-removeEventListener)  Function  Remove event listener from the column. |

## Filtering

|  |
| --- |
| isFilterAllowed[Copy Link](#reference-filtering-isFilterAllowed)  Function  Returns `true` if column filtering is allowed. |
| isFilterActive[Copy Link](#reference-filtering-isFilterActive)  Function  Returns `true` if filter is active on the column. |

## Keyboard

|  |
| --- |
| isSuppressNavigable[Copy Link](#reference-keyboard-isSuppressNavigable)  Function  Returns `true` if navigation is suppressed for the given column and rowNode. |

## Menu

|  |
| --- |
| isMenuVisible[Copy Link](#reference-menu-isMenuVisible)  Function  Returns `true` if a menu is visible for this column. |

## Moving

|  |
| --- |
| isMoving[Copy Link](#reference-moving-isMoving)  Function  Returns `true` while the column is being moved. |

## Pinning

|  |
| --- |
| getPinned[Copy Link](#reference-pinning-getPinned)  Function  Returns the pinned state of the column. |
| isPinned[Copy Link](#reference-pinning-isPinned)  Function  Returns `true` if this column is pinned either left of right. |
| isPinnedLeft[Copy Link](#reference-pinning-isPinnedLeft)  Function  Returns `true` if this column is pinned left. |
| isPinnedRight[Copy Link](#reference-pinning-isPinnedRight)  Function  Returns `true` if this column is pinned right. |
| isFirstRightPinned[Copy Link](#reference-pinning-isFirstRightPinned)  Function  Returns `true` if this column is the first right pinned column. |
| isLastLeftPinned[Copy Link](#reference-pinning-isLastLeftPinned)  Function  Returns `true` if this column is the last left pinned column. |

## Row Aggregation

|  |
| --- |
| isAllowValue[Copy Link](#reference-rowAggregation-isAllowValue)  Function  Returns `true` if this column can be used as a value column. |
| isValueActive[Copy Link](#reference-rowAggregation-isValueActive)  Function  Returns `true` if value (aggregation) is currently active for this column. |
| getAggFunc[Copy Link](#reference-rowAggregation-getAggFunc)  Function  If aggregation is set for the column, returns the aggregation function. |

## Row Dragging

|  |
| --- |
| isRowDrag[Copy Link](#reference-rowDragging-isRowDrag)  Function  Returns `true` if this column and row node can be dragged. |
| isDndSource[Copy Link](#reference-rowDragging-isDndSource)  Function  Returns `true` if this column and row node allows dragging for native drag and drop. |

## Row Grouping

|  |
| --- |
| isAllowRowGroup[Copy Link](#reference-rowGrouping-isAllowRowGroup)  Function  Returns `true` if this column can be used as a row group column. |
| isRowGroupActive[Copy Link](#reference-rowGrouping-isRowGroupActive)  Function  Returns `true` if row group is currently active for this column. |
| isRowGroupDisplayed[Copy Link](#reference-rowGrouping-isRowGroupDisplayed)  Function  Returns `true` if this column group is being used to display a row group value. |

## Row Pivoting

|  |
| --- |
| isAllowPivot[Copy Link](#reference-pivoting-isAllowPivot)  Function  Returns `true` if pivoting is allowed for this column |
| isPivotActive[Copy Link](#reference-pivoting-isPivotActive)  Function  Returns `true` if pivot is currently active for this column. |
| isPrimary[Copy Link](#reference-pivoting-isPrimary)  Function  Returns `true` if column is a primary column, `false` if secondary. Secondary columns are used for pivoting. |

## Selection

|  |
| --- |
| isCellCheckboxSelection[Copy Link](#reference-selection-isCellCheckboxSelection)  Function  Returns `true` if this column and row node has checkbox selection. |

## Sizing

|  |
| --- |
| getActualWidth[Copy Link](#reference-sizing-getActualWidth)  Function  Returns the current width of the column. If the column is resized, the actual width is the new size. |
| getMinWidth[Copy Link](#reference-sizing-getMinWidth)  Function  Returns the minWidth of the column or the default min width. |
| getMaxWidth[Copy Link](#reference-sizing-getMaxWidth)  Function  Returns the max width for the column. |
| getFlex[Copy Link](#reference-sizing-getFlex)  Function  Returns the `flex` value of the column or null if not set. |
| isResizable[Copy Link](#reference-sizing-isResizable)  Function  Returns `true` if this group is resizable. |
| isAutoHeight[Copy Link](#reference-sizing-isAutoHeight)  Function  Returns `true` if the column has autoHeight enabled. |
| isAutoHeaderHeight[Copy Link](#reference-sizing-isAutoHeaderHeight)  Function  Returns `true` if the column header has autoHeight enabled. |
| getAutoHeaderHeight[Copy Link](#reference-sizing-getAutoHeaderHeight)  Function  Returns the auto header height. |
| isSpanHeaderHeight[Copy Link](#reference-sizing-isSpanHeaderHeight)  Function  Returns `true` if this column spans the header height. |

## Sorting

|  |
| --- |
| getSort[Copy Link](#reference-sorting-getSort)  Function  If sorting is active, returns the sort direction e.g. `'asc'` or `'desc'`. |
| isSortable[Copy Link](#reference-sorting-isSortable)  Function  Returns `true` if sorting is enabled for this column via the `sortable` property. |
| getSortIndex[Copy Link](#reference-sorting-getSortIndex)  Function  Returns the sort index for this column. |

## Spanning

|  |
| --- |
| getColSpan[Copy Link](#reference-spanning-getColSpan)  Function  Returns the column span for this column and row node. |

## Tooltip

|  |
| --- |
| isTooltipEnabled[Copy Link](#reference-tooltip-isTooltipEnabled)  Function  Returns `true` if a tooltip is enabled for this column. |

* [Column Reference](#top)
* [Clipboard](#reference-clipboard)
* [Column Groups](#reference-columnGroups)
* [Definitions](#reference-definitions)
* [Display](#reference-display)
* [Editing](#reference-editing)
* [Events](#reference-events)
* [Filtering](#reference-filtering)
* [Keyboard](#reference-keyboard)
* [Menu](#reference-menu)
* [Moving](#reference-moving)
* [Pinning](#reference-pinning)
* [Row Aggregation](#reference-rowAggregation)
* [Row Dragging](#reference-rowDragging)
* [Row Grouping](#reference-rowGrouping)
* [Row Pivoting](#reference-pivoting)
* [Selection](#reference-selection)
* [Sizing](#reference-sizing)
* [Sorting](#reference-sorting)
* [Spanning](#reference-spanning)
* [Tooltip](#reference-tooltip)

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