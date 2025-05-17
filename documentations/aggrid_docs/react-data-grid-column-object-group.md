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

# React Data GridColumn Group Reference

![react logo](/_astro/react.CtDRhtxt.svg)

Attributes and methods available on the `ColumnGroup` and `ProvidedColumnGroup` instances.

## ColumnGroup

|  |
| --- |
| getColGroupDef[Copy Link](#reference-ColumnGroup-getColGroupDef)  Function  Returns the column group definition for this column. The column group definition will be the result of merging the application provided column group definition with any provided defaults (e.g. `defaultColGroupDef` grid option. |
| getGroupId[Copy Link](#reference-ColumnGroup-getGroupId)  Function  Returns the group column id. |
| getProvidedColumnGroup[Copy Link](#reference-ColumnGroup-getProvidedColumnGroup)  Function  Returns the provided column group |
| getChildren[Copy Link](#reference-ColumnGroup-getChildren)  Function  Returns the children of this group if they exist or `null` |
| getDisplayedChildren[Copy Link](#reference-ColumnGroup-getDisplayedChildren)  Function  Returns the displayed children of this group. |
| getLeafColumns[Copy Link](#reference-ColumnGroup-getLeafColumns)  Function  Returns the leaf columns of this group. |
| getDisplayedLeafColumns[Copy Link](#reference-ColumnGroup-getDisplayedLeafColumns)  Function  Returns the displayed leaf columns of this group. |
| isResizable[Copy Link](#reference-ColumnGroup-isResizable)  Function  Returns `true` if this group is resizable. |
| isExpandable[Copy Link](#reference-ColumnGroup-isExpandable)  Function  Returns `true` if this column group is expandable. |
| isExpanded[Copy Link](#reference-ColumnGroup-isExpanded)  Function  Returns `true` if this column group is expanded. |
| isPadding[Copy Link](#reference-ColumnGroup-isPadding)  Function  Returns `true` if this column group is a padding group that is used to correctly align column groups / children. |
| getPaddingLevel[Copy Link](#reference-ColumnGroup-getPaddingLevel)  Function  Returns the padding level of this padding group. |
| isColumn[Copy Link](#reference-ColumnGroup-isColumn)  false  isColumn is always `false`. Used to distinguish between columns and column groups. |

## ProvidedColumnGroup

|  |
| --- |
| getOriginalParent[Copy Link](#reference-ProvidedColumnGroup-getOriginalParent)  Function  Returns the parent column group, if this column is part of a column group. |
| getLevel[Copy Link](#reference-ProvidedColumnGroup-getLevel)  Function  Returns the level of this group. |
| isPadding[Copy Link](#reference-ProvidedColumnGroup-isPadding)  Function  Returns `true` if this column group is a padding group that is used to correctly align column groups / children. |
| isExpandable[Copy Link](#reference-ProvidedColumnGroup-isExpandable)  Function  Returns `true` if this column group is expandable. |
| isExpanded[Copy Link](#reference-ProvidedColumnGroup-isExpanded)  Function  Returns `true` if this column group is expanded. |
| getGroupId[Copy Link](#reference-ProvidedColumnGroup-getGroupId)  Function  Returns the group column id. |
| getChildren[Copy Link](#reference-ProvidedColumnGroup-getChildren)  Function  Returns the children of this group. |
| getColGroupDef[Copy Link](#reference-ProvidedColumnGroup-getColGroupDef)  Function  Returns the column group definition for this column. The column group definition will be the result of merging the application provided column group definition with any provided defaults (e.g. `defaultColGroupDef` grid option. |
| getLeafColumns[Copy Link](#reference-ProvidedColumnGroup-getLeafColumns)  Function  Returns the leaf columns of this group. |
| isColumn[Copy Link](#reference-ProvidedColumnGroup-isColumn)  false  isColumn is always `false`. Used to distinguish between columns and column groups. |

* [Column Group Reference](#top)
* [ColumnGroup](#reference-ColumnGroup)
* [ProvidedColumnGroup](#reference-ProvidedColumnGroup)

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