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

# React Data GridColumn Options Reference

![react logo](/_astro/react.CtDRhtxt.svg)

Configuration for columns `ColDef<TData, TValue>` and column groups `ColGroupDef<TData>`.

## Columns

|  |
| --- |
| field[Copy Link](#reference-columns-field)  ColDefField  The field of the row object to get the cell's data from. Deep references into a row object is supported via dot notation, i.e `'address.firstLine'`.  [Accessing Row Data Values](/react-data-grid/value-getters/#field) |
| colId[Copy Link](#reference-columns-colId)  string  The unique ID to give the column. This is optional. If missing, the ID will default to the field. If both field and colId are missing, a unique ID will be generated. This ID is used to identify the column in the API for sorting, filtering etc. |
| type[Copy Link](#reference-columns-type)  string | string[]  A comma separated string or array of strings containing `ColumnType` keys which can be used as a template for a column. This helps to reduce duplication of properties when you have a lot of common column properties.  [Column Types](/react-data-grid/column-definitions/#default-column-definitions) |
| cellDataType[Copy Link](#reference-columns-cellDataType)  boolean | string  default: true  The data type of the cell values for this column. Can either infer the data type from the row data (`true` - the default behaviour), define a specific data type (`string`), or have no data type (`false`). If setting a specific data type (`string` value), this can either be one of the pre-defined data types `'text'`, `'number'`, `'boolean'`, `'date'`, `'dateString'` or `'object'`, or a custom data type that has been defined in the `dataTypeDefinitions` grid option. Data type inference only works for the Client-Side Row Model, and requires non-null data. It will also not work if the `valueGetter`, `valueParser` or `refData` properties are defined, or if this column is a sparkline.  [Cell Data Types](/react-data-grid/cell-data-types/) |
| valueGetter[Copy Link](#reference-columns-valueGetter)  string | ValueGetterFunc  Function or [expression](/react-data-grid/cell-expressions/#column-definition-expressions). Gets the value from your data for display.  [Value Getters](/react-data-grid/value-getters/) |
| valueFormatter[Copy Link](#reference-columns-valueFormatter)  string | ValueFormatterFunc  A function or expression to format a value, should return a string.  [Value Formatters](/react-data-grid/value-formatters/) |
| refData[Copy Link](#reference-columns-refData)  { [key: string]: string }  Provided a reference data map to be used to map column values to their respective value from the map.  [Using the 'refData' Property](/react-data-grid/reference-data/#using-the-refdata-property) |
| keyCreator[Copy Link](#reference-columns-keyCreator)  Function  Function to return a string key for a value. This string is used for grouping, Set filtering, and searching within cell editor dropdowns. When filtering and searching the string is exposed to the user, so make sure to return a human-readable value. |
| equals[Copy Link](#reference-columns-equals)  Function  Custom comparator for values, used by renderer to know if values have changed. Cells whose values have not changed don't get refreshed. By default the grid uses `===` which should work for most use cases.  [Change Detection Comparing Values](/react-data-grid/change-detection/#comparing-values) |
| toolPanelClass[Copy Link](#reference-columns-toolPanelClass)  ToolPanelClass  CSS class to use for the tool panel cell. Can be a string, array of strings, or function.  [ColumnsToolPanelModule](/react-data-grid/modules/) |
| suppressColumnsToolPanel[Copy Link](#reference-columns-suppressColumnsToolPanel)  boolean  default: false  Set to `true` if you do not want this column or group to appear in the Columns Tool Panel.  [ColumnsToolPanelModule](/react-data-grid/modules/) |
| columnGroupShow[Copy Link](#reference-columns-columnGroupShow)  ColumnGroupShowType  Whether to only show the column when the group is open / closed. If not set the column is always displayed as part of the group. |
| icons[Copy Link](#reference-columns-icons)  { [key: string]: ((...args: any[]) => any) | string }  [Initial](/react-data-grid/column-interface/#initial-column-options)  Icons to use inside the column instead of the grid's default icons. Leave undefined to use defaults.  [Custom Icons](/react-data-grid/custom-icons/#set-the-icons-through-gridoptions-javascript) |
| suppressNavigable[Copy Link](#reference-columns-suppressNavigable)  boolean | SuppressNavigableCallback  default: false  Set to `true` if this column is not navigable (i.e. cannot be tabbed into), otherwise `false`. Can also be a callback function to have different rows navigable. |
| suppressKeyboardEvent[Copy Link](#reference-columns-suppressKeyboardEvent)  Function  default: false  Allows the user to suppress certain keyboard events in the grid cell.  [Suppress Keyboard Events](/react-data-grid/keyboard-navigation/#suppresskeyboardevent) |
| suppressPaste[Copy Link](#reference-columns-suppressPaste)  boolean | SuppressPasteCallback  Pasting is on by default as long as cells are editable (non-editable cells cannot be modified, even with a paste operation). Set to `true` turn paste operations off. |
| suppressFillHandle[Copy Link](#reference-columns-suppressFillHandle)  boolean  Set to true to prevent the fillHandle from being rendered in any cell that belongs to this column  [Suppressing the Fill Handle](/react-data-grid/cell-selection-fill-handle/#suppressing-the-fill-handle) |
| contextMenuItems[Copy Link](#reference-columns-contextMenuItems)  (DefaultMenuItem | MenuItemDef)[] | GetContextMenuItems  Customise the list of menu items available in the context menu.  [Configuring the Context Menu](/react-data-grid/context-menu/#configuring-the-context-menu) [ContextMenuModule](/react-data-grid/modules/) |
| context[Copy Link](#reference-columns-context)  any  Context property that can be used to associate arbitrary application data with this column definition. |

## Columns: Accessibility

|  |
| --- |
| cellAriaRole[Copy Link](#reference-accessibility-cellAriaRole)  string  default: 'gridcell'  Used for screen reader announcements - the role property of the cells that belong to this column. |

## Columns: Aggregation

(Enterprise only) See [Aggregation](/react-data-grid/aggregation-columns/)

|  |
| --- |
| aggFunc[Copy Link](#reference-aggregation-aggFunc)  [string | IAggFunc | null](/react-data-grid/aggregation-custom-functions/)  Name of function to use for aggregation. In-built options are: `sum`, `min`, `max`, `count`, `avg`, `first`, `last`. Also accepts a custom aggregation name or an aggregation function.  [Enabling Aggregation](/react-data-grid/aggregation-columns/#enabling-aggregation) [RowGroupingModule](/react-data-grid/modules/)+3  Available in any of[RowGroupingModule](/react-data-grid/modules/)[PivotModule](/react-data-grid/modules/)[TreeDataModule](/react-data-grid/modules/)[ServerSideRowModelModule](/react-data-grid/modules/) |
| initialAggFunc[Copy Link](#reference-aggregation-initialAggFunc)  [string | IAggFunc](/react-data-grid/aggregation-custom-functions/)  [Initial](/react-data-grid/column-interface/#initial-column-options)  Same as `aggFunc`, except only applied when creating a new column. Not applied when updating column definitions.  [RowGroupingModule](/react-data-grid/modules/)+3  Available in any of[RowGroupingModule](/react-data-grid/modules/)[PivotModule](/react-data-grid/modules/)[TreeDataModule](/react-data-grid/modules/)[ServerSideRowModelModule](/react-data-grid/modules/) |
| enableValue[Copy Link](#reference-aggregation-enableValue)  boolean  default: false  Set to `true` if you want to be able to aggregate by this column via the GUI. This will not block the API or properties being used to achieve aggregation.  [Configuring via the UI](/react-data-grid/aggregation-columns/#configuring-via-the-ui) [RowGroupingModule](/react-data-grid/modules/)+3  Available in any of[RowGroupingModule](/react-data-grid/modules/)[PivotModule](/react-data-grid/modules/)[TreeDataModule](/react-data-grid/modules/)[ServerSideRowModelModule](/react-data-grid/modules/) |
| allowedAggFuncs[Copy Link](#reference-aggregation-allowedAggFuncs)  string[]  Aggregation functions allowed on this column e.g. `['sum', 'avg']`. If missing, all installed functions are allowed. This will only restrict what the GUI allows a user to select, it does not impact when you set a function via the API.  [Allowed Functions](/react-data-grid/aggregation-columns/#allowed-functions) [RowGroupingModule](/react-data-grid/modules/)+3  Available in any of[RowGroupingModule](/react-data-grid/modules/)[PivotModule](/react-data-grid/modules/)[TreeDataModule](/react-data-grid/modules/)[ServerSideRowModelModule](/react-data-grid/modules/) |
| defaultAggFunc[Copy Link](#reference-aggregation-defaultAggFunc)  string  default: 'sum'  The name of the aggregation function to use for this column when it is enabled via the GUI. Note that this does not immediately apply the aggregation function like `aggFunc`  [Default Function](/react-data-grid/aggregation-columns/#default-function) [RowGroupingModule](/react-data-grid/modules/)+3  Available in any of[RowGroupingModule](/react-data-grid/modules/)[PivotModule](/react-data-grid/modules/)[TreeDataModule](/react-data-grid/modules/)[ServerSideRowModelModule](/react-data-grid/modules/) |

## Columns: Display

|  |
| --- |
| hide[Copy Link](#reference-display-hide)  boolean  default: false  Set to `true` for this column to be hidden. |
| initialHide[Copy Link](#reference-display-initialHide)  boolean  [Initial](/react-data-grid/column-interface/#initial-column-options)  Same as `hide`, except only applied when creating a new column. Not applied when updating column definitions. |
| lockVisible[Copy Link](#reference-display-lockVisible)  boolean  default: false  Set to `true` to block making column visible / hidden via the UI (API will still work). |
| lockPosition[Copy Link](#reference-display-lockPosition)  boolean | 'left' | 'right'  Lock a column to position to `'left'` or`'right'` to always have this column displayed in that position. `true` is treated as `'left'` |
| suppressMovable[Copy Link](#reference-display-suppressMovable)  boolean  default: false  Set to `true` if you do not want this column to be movable via dragging. |
| useValueFormatterForExport[Copy Link](#reference-display-useValueFormatterForExport)  boolean  default: true  By default, values are formatted using the column's `valueFormatter` when exporting data from the grid. This applies to CSV and Excel export, as well as clipboard operations and the fill handle. Set to `false` to prevent values from being formatted for these operations. Regardless of this option, if custom handling is provided for the export operation, the value formatter will not be used.  [Using Value Formatters with Other Grid Features](/react-data-grid/value-formatters/#formatting-for-export) |

## Columns: Editing

See [Cell Editing](/react-data-grid/cell-editing/) for more information.

|  |
| --- |
| editable[Copy Link](#reference-editing-editable)  boolean | EditableCallback  default: false  Set to `true` if this column is editable, otherwise `false`. Can also be a function to have different rows editable. |
| valueSetter[Copy Link](#reference-editing-valueSetter)  string | ValueSetterFunc  Function or [expression](/react-data-grid/cell-expressions/#column-definition-expressions). Custom function to modify your data based off the new value for saving. Return `true` if the data changed.  [Saving Values](/react-data-grid/value-setters/) |
| valueParser[Copy Link](#reference-editing-valueParser)  string | ValueParserFunc  Function or [expression](/react-data-grid/cell-expressions/#column-definition-expressions). Parses the value for saving.  [Parsing Values](/react-data-grid/value-parsers/) |
| cellEditor[Copy Link](#reference-editing-cellEditor)  any  Provide your own cell editor component for this column's cells.  [Cell Editors](/react-data-grid/cell-editors/) |
| cellEditorParams[Copy Link](#reference-editing-cellEditorParams)  any  Params to be passed to the `cellEditor` component. |
| cellEditorSelector[Copy Link](#reference-editing-cellEditorSelector)  CellEditorSelectorFunc  Callback to select which cell editor to be used for a given row within the same column.  [Many Editors One Column](/react-data-grid/cell-editors/#dynamic-selection) |
| cellEditorPopup[Copy Link](#reference-editing-cellEditorPopup)  boolean  Set to `true`, to have the cell editor appear in a popup. |
| cellEditorPopupPosition[Copy Link](#reference-editing-cellEditorPopupPosition)  'over' | 'under'  default: 'over'  Set the position for the popup cell editor. Possible values are- `over` Popup will be positioned over the cell - `under` Popup will be positioned below the cell leaving the cell value visible. |
| singleClickEdit[Copy Link](#reference-editing-singleClickEdit)  boolean  default: false  Set to `true` to have cells under this column enter edit mode after single click. |
| useValueParserForImport[Copy Link](#reference-editing-useValueParserForImport)  boolean  default: true  By default, values are parsed using the column's `valueParser` when importing data to the grid. This applies to clipboard operations and the fill handle. Set to `false` to prevent values from being parsed for these operations. Regardless of this option, if custom handling is provided for the import operation, the value parser will not be used.  [Using Value Parsers with Other Grid Features](/react-data-grid/value-parsers/#use-value-parser-for-import) |

## Columns: Events

|  |
| --- |
| onCellValueChanged[Copy Link](#reference-events-onCellValueChanged)  NewValueParams  Callback for after the value of a cell has changed, either due to editing or the application calling `api.setValue()`. |
| onCellClicked[Copy Link](#reference-events-onCellClicked)  CellClickedEvent  Callback called when a cell is clicked. |
| onCellDoubleClicked[Copy Link](#reference-events-onCellDoubleClicked)  CellDoubleClickedEvent  Callback called when a cell is double clicked. |
| onCellContextMenu[Copy Link](#reference-events-onCellContextMenu)  CellContextMenuEvent  Callback called when a cell is right clicked. |

## Columns: Filter

See [Filtering](/react-data-grid/filtering-overview/) for more information.

|  |
| --- |
| filter[Copy Link](#reference-filtering-filter)  any  Filter component to use for this column.  Set to `true` to use the default filter.  Set to the name of a [Provided Filter](/react-data-grid/filtering/#column-filter-types) or set to a `IFilterComp`.  [Column Filters](/react-data-grid/filtering/) |
| filterParams[Copy Link](#reference-filtering-filterParams)  any  Params to be passed to the filter component specified in `filter`.  [Filter Parameters](/react-data-grid/filtering/) |
| filterValueGetter[Copy Link](#reference-filtering-filterValueGetter)  string | ValueGetterFunc  Function or [expression](/react-data-grid/cell-expressions/#column-definition-expressions). Gets the value for filtering purposes. |
| getQuickFilterText[Copy Link](#reference-filtering-getQuickFilterText)  Function  A function to tell the grid what Quick Filter text to use for this column if you don't want to use the default (which is calling `toString` on the value).  [Overriding the Quick Filter Value](/react-data-grid/filter-quick/#overriding-the-quick-filter-value) [QuickFilterModule](/react-data-grid/modules/) |
| floatingFilter[Copy Link](#reference-filtering-floatingFilter)  boolean  default: false  Whether to display a floating filter for this column.  [Floating Filter](/react-data-grid/floating-filters/) |
| floatingFilterComponent[Copy Link](#reference-filtering-floatingFilterComponent)  any  The custom component to be used for rendering the floating filter. If none is specified the default AG Grid is used.  [Floating Filter Component](/react-data-grid/component-floating-filter/) |
| floatingFilterComponentParams[Copy Link](#reference-filtering-floatingFilterComponentParams)  any  Params to be passed to `floatingFilterComponent`.  [Floating Filter Parameters](/react-data-grid/component-floating-filter/#example-custom-floating-filter) |
| suppressFiltersToolPanel[Copy Link](#reference-filtering-suppressFiltersToolPanel)  boolean  default: false  Set to `true` if you do not want this column (filter) or group (filter group) to appear in the Filters Tool Panel.  [ColumnsToolPanelModule](/react-data-grid/modules/) |
| dateComponent[Copy Link](#reference-filtering-dateComponent)  any  Custom date selection component to be used in Date Filters and Date Floating Filters for this column.  [Custom Selection Component](/react-data-grid/filter-date/#custom-selection-component) |
| dateComponentParams[Copy Link](#reference-filtering-dateComponentParams)  any  The parameters to be passed to the `dateComponent`.  [Custom Selection Component](/react-data-grid/filter-date/#custom-selection-component) |

## Columns: Find

|  |
| --- |
| getFindText[Copy Link](#reference-find-getFindText)  GetFindTextFunc  When using Find with custom cell renderers, this allows providing a custom value to search within. E.g. if the cell renderer is displaying text that is different from the cell formatted value. Returning `null` means Find will not search within the cell.  [Using Find with Cell Components](/react-data-grid/find/#using-find-with-cell-components) [FindModule](/react-data-grid/modules/) |

## Columns: Header

See [Column Headers](/react-data-grid/column-headers/) for more information.

|  |
| --- |
| headerName[Copy Link](#reference-header-headerName)  string  The name to render in the column header. If not specified and field is specified, the field name will be used as the header name. |
| headerValueGetter[Copy Link](#reference-header-headerValueGetter)  string | HeaderValueGetterFunc  Function or [expression](/react-data-grid/cell-expressions/#column-definition-expressions). Gets the value for display in the header. |
| headerTooltip[Copy Link](#reference-header-headerTooltip)  string  Tooltip for the column header  [TooltipModule](/react-data-grid/modules/) |
| headerStyle[Copy Link](#reference-header-headerStyle)  HeaderStyle | HeaderStyleFunc  An object of CSS values / or function returning an object of CSS values for a particular header. |
| headerClass[Copy Link](#reference-header-headerClass)  HeaderClass  CSS class to use for the header cell. Can be a string, array of strings, or function. |
| headerComponent[Copy Link](#reference-header-headerComponent)  any  The custom header group component to be used for rendering the component header. If none specified the default AG Grid is used.  [Header Component](/react-data-grid/column-headers/) |
| headerComponentParams[Copy Link](#reference-header-headerComponentParams)  any  The parameters to be passed to the `headerComponent`. |
| wrapHeaderText[Copy Link](#reference-header-wrapHeaderText)  boolean  If enabled then column header names that are too long for the column width will wrap onto the next line. Default `false` |
| autoHeaderHeight[Copy Link](#reference-header-autoHeaderHeight)  boolean  default: false  If enabled then the column header row will automatically adjust height to accommodate the size of the header cell. This can be useful when using your own `headerComponent` or long header names in conjunction with `wrapHeaderText`.  [Auto Header Height](/react-data-grid/column-headers/) |
| menuTabs[Copy Link](#reference-header-menuTabs)  ColumnMenuTab[]  Set to an array containing zero, one or many of the following options: `'filterMenuTab' | 'generalMenuTab' | 'columnsMenuTab'`. This is used to figure out which menu tabs are present and in which order the tabs are shown.  [Legacy Tabbed Column Menu](/react-data-grid/column-menu/#legacy-tabbed-column-menu) |
| columnChooserParams[Copy Link](#reference-header-columnChooserParams)  ColumnChooserParams  Params used to change the behaviour and appearance of the Column Chooser/Columns Menu tab.  [Customising the Column Chooser](/react-data-grid/column-menu/#customising-the-column-chooser) [ColumnMenuModule](/react-data-grid/modules/) |
| mainMenuItems[Copy Link](#reference-header-mainMenuItems)  (DefaultMenuItem | MenuItemDef)[] | GetMainMenuItems  Customise the list of menu items available in the column menu.  [Customising the Menu Items](/react-data-grid/column-menu/#customising-the-menu-items) [ColumnMenuModule](/react-data-grid/modules/) |
| suppressHeaderMenuButton[Copy Link](#reference-header-suppressHeaderMenuButton)  boolean  default: false  Set to `true` if no menu button should be shown for this column header.  [Customising the Column Menu](/react-data-grid/column-menu/#customising-the-column-menu) |
| suppressHeaderFilterButton[Copy Link](#reference-header-suppressHeaderFilterButton)  boolean  default: false  Set to `true` to not display the filter button in the column header. Doesn't apply when `columnMenu = 'legacy'`.  [Customising the Column Menu](/react-data-grid/column-menu/#customising-the-column-menu) |
| suppressHeaderContextMenu[Copy Link](#reference-header-suppressHeaderContextMenu)  boolean  default: false  Set to `true` to not display the column menu when the column header is right-clicked. Doesn't apply when `columnMenu = 'legacy'`.  [Customising the Column Menu](/react-data-grid/column-menu/#customising-the-column-menu) |
| suppressHeaderKeyboardEvent[Copy Link](#reference-header-suppressHeaderKeyboardEvent)  Function  Suppress the grid taking action for the relevant keyboard event when a header is focused.  [Suppress Keyboard Events](/react-data-grid/keyboard-navigation/#suppressheaderkeyboardevent) |
| suppressFloatingFilterButton[Copy Link](#reference-header-suppressFloatingFilterButton)  boolean  If `true`, the button in the floating filter that opens the parent filter in a popup will not be displayed. Only applies if `floatingFilter = true`.  [Floating Filters](/react-data-grid/floating-filters/) |

## Columns: Integrated Charts

(Enterprise only) See [Integrated Charts](/react-data-grid/integrated-charts/)

|  |
| --- |
| chartDataType[Copy Link](#reference-charts-chartDataType)  'category' | 'series' | 'time' | 'excluded'  Defines the chart data type that should be used for a column.  [IntegratedChartsModule](/react-data-grid/modules/) |

## Columns: Pinned

See [Column Pinning](/react-data-grid/column-pinning/) for more information.

|  |
| --- |
| pinned[Copy Link](#reference-pinned-pinned)  boolean | 'left' | 'right' | null  Pin a column to one side: `right` or `left`. A value of `true` is converted to `'left'`. |
| initialPinned[Copy Link](#reference-pinned-initialPinned)  boolean | 'left' | 'right'  [Initial](/react-data-grid/column-interface/#initial-column-options)  Same as `pinned`, except only applied when creating a new column. Not applied when updating column definitions. |
| lockPinned[Copy Link](#reference-pinned-lockPinned)  boolean  default: false  Set to true to block the user pinning the column, the column can only be pinned via definitions or API. |

## Columns: Pivoting

(Enterprise only) See [Pivoting](/react-data-grid/pivoting/)

|  |
| --- |
| pivot[Copy Link](#reference-pivoting-pivot)  boolean  Set to true to pivot by this column.  [Enabling Pivoting](/react-data-grid/aggregation-columns/#default-function) [PivotModule](/react-data-grid/modules/) |
| initialPivot[Copy Link](#reference-pivoting-initialPivot)  boolean  [Initial](/react-data-grid/column-interface/#initial-column-options)  Same as `pivot`, except only applied when creating a new column. Not applied when updating column definitions.  [PivotModule](/react-data-grid/modules/) |
| pivotIndex[Copy Link](#reference-pivoting-pivotIndex)  number | null  Set this in columns you want to pivot by. If only pivoting by one column, set this to any number (e.g. `0`). If pivoting by multiple columns, set this to where you want this column to be in the order of pivots (e.g. `0` for first, `1` for second, and so on).  [PivotModule](/react-data-grid/modules/) |
| initialPivotIndex[Copy Link](#reference-pivoting-initialPivotIndex)  number  [Initial](/react-data-grid/column-interface/#initial-column-options)  Same as `pivotIndex`, except only applied when creating a new column. Not applied when updating column definitions.  [PivotModule](/react-data-grid/modules/) |
| enablePivot[Copy Link](#reference-pivoting-enablePivot)  boolean  default: false  Set to `true` if you want to be able to pivot by this column via the GUI. This will not block the API or properties being used to achieve pivot.  [Configuring via the UI](/react-data-grid/pivoting/#configuring-via-the-ui) [PivotModule](/react-data-grid/modules/) |
| pivotComparator[Copy Link](#reference-pivoting-pivotComparator)  Function  [Initial](/react-data-grid/column-interface/#initial-column-options)  Only for CSRM, see [SSRM Pivoting](https://www.ag-grid.com/javascript-data-grid/server-side-model-pivoting/). Comparator to use when ordering the pivot columns, when this column is used to pivot on. The values will always be strings, as the pivot service uses strings as keys for the pivot groups.  [Ordering Pivot Result Groups](/react-data-grid/pivoting-column-groups/#ordering-groups) [PivotModule](/react-data-grid/modules/) |

## Columns: Rendering and Styling

|  |
| --- |
| cellStyle[Copy Link](#reference-styling-cellStyle)  CellStyle | CellStyleFunc  An object of CSS values / or function returning an object of CSS values for a particular cell.  [Cell Style](/react-data-grid/cell-styles/#cell-style) [CellStyleModule](/react-data-grid/modules/) |
| cellClass[Copy Link](#reference-styling-cellClass)  string | string[] | CellClassFunc  Class to use for the cell. Can be string, array of strings, or function that returns a string or array of strings.  [Cell Class](/react-data-grid/cell-styles/#cell-class) [CellStyleModule](/react-data-grid/modules/) |
| cellClassRules[Copy Link](#reference-styling-cellClassRules)  CellClassRules  Rules which can be applied to include certain CSS classes.  [Cell Class Rules](/react-data-grid/cell-styles/#cell-class-rules) [CellStyleModule](/react-data-grid/modules/) |
| cellRenderer[Copy Link](#reference-styling-cellRenderer)  any  Provide your own cell Renderer component for this column's cells.  [Cell Renderer](/react-data-grid/component-cell-renderer/) |
| cellRendererParams[Copy Link](#reference-styling-cellRendererParams)  any  Params to be passed to the `cellRenderer` component.  [Cell Renderer Params](/react-data-grid/component-cell-renderer/#custom-props) |
| cellRendererSelector[Copy Link](#reference-styling-cellRendererSelector)  CellRendererSelectorFunc  Callback to select which cell renderer to be used for a given row within the same column.  [Many Renderers One Column](/react-data-grid/component-cell-renderer/#dynamic-component-selection) |
| loadingCellRenderer[Copy Link](#reference-styling-loadingCellRenderer)  any  Provide your own cell loading Renderer component for this column's cells when using SSRM.  [SSRM Cell Loading](/react-data-grid/component-loading-cell-renderer/#skeleton-loading) |
| loadingCellRendererParams[Copy Link](#reference-styling-loadingCellRendererParams)  any  Params to be passed to the `loadingCellRenderer` component.  [SSRM Cell Loading](/react-data-grid/component-loading-cell-renderer/#skeleton-loading) |
| loadingCellRendererSelector[Copy Link](#reference-styling-loadingCellRendererSelector)  CellRendererSelectorFunc  Callback to select which loading renderer to be used for a given row within the same column.  [SSRM Cell Loading](/react-data-grid/component-loading-cell-renderer/#skeleton-loading) |
| autoHeight[Copy Link](#reference-styling-autoHeight)  boolean  default: false  Set to `true` to have the grid calculate the height of a row based on contents of this column.  [RowAutoHeightModule](/react-data-grid/modules/) |
| wrapText[Copy Link](#reference-styling-wrapText)  boolean  default: false  Set to `true` to have the text wrap inside the cell - typically used with `autoHeight`. |
| enableCellChangeFlash[Copy Link](#reference-styling-enableCellChangeFlash)  boolean  default: false  Set to `true` to flash a cell when it's refreshed.  [HighlightChangesModule](/react-data-grid/modules/) |

## Columns: Row Dragging

See [Row Dragging](/react-data-grid/row-dragging/) for more information.

|  |
| --- |
| rowDrag[Copy Link](#reference-row dragging-rowDrag)  boolean | RowDragCallback  default: false  `boolean` or `Function`. Set to `true` (or return `true` from function) to allow row dragging.  [RowDragModule](/react-data-grid/modules/) |
| rowDragText[Copy Link](#reference-row dragging-rowDragText)  Function  A callback that should return a string to be displayed by the `rowDragComp` while dragging a row. If this callback is not set, the `rowDragText` callback in the `gridOptions` will be used and if there is no callback in the `gridOptions` the current cell value will be used.  [RowDragModule](/react-data-grid/modules/) |
| dndSource[Copy Link](#reference-row dragging-dndSource)  boolean | DndSourceCallback  default: false  `boolean` or `Function`. Set to `true` (or return `true` from function) to allow dragging for native drag and drop.  [DragAndDropModule](/react-data-grid/modules/) |
| dndSourceOnRowDrag[Copy Link](#reference-row dragging-dndSourceOnRowDrag)  Function  Function to allow custom drag functionality for native drag and drop.  [DragAndDropModule](/react-data-grid/modules/) |

## Columns: Row Grouping

(Enterprise only) See [Row Grouping](/react-data-grid/grouping/)

|  |
| --- |
| rowGroup[Copy Link](#reference-grouping-rowGroup)  boolean  default: false  Set to `true` to row group by this column.  [RowGroupingModule](/react-data-grid/modules/) |
| initialRowGroup[Copy Link](#reference-grouping-initialRowGroup)  boolean  [Initial](/react-data-grid/column-interface/#initial-column-options)  Same as `rowGroup`, except only applied when creating a new column. Not applied when updating column definitions.  [RowGroupingModule](/react-data-grid/modules/) |
| rowGroupIndex[Copy Link](#reference-grouping-rowGroupIndex)  number | null  Set this in columns you want to group by. If only grouping by one column, set this to any number (e.g. `0`). If grouping by multiple columns, set this to where you want this column to be in the group (e.g. `0` for first, `1` for second, and so on).  [RowGroupingModule](/react-data-grid/modules/) |
| initialRowGroupIndex[Copy Link](#reference-grouping-initialRowGroupIndex)  number  [Initial](/react-data-grid/column-interface/#initial-column-options)  Same as `rowGroupIndex`, except only applied when creating a new column. Not applied when updating column definitions.  [RowGroupingModule](/react-data-grid/modules/) |
| enableRowGroup[Copy Link](#reference-grouping-enableRowGroup)  boolean  default: false  Set to `true` if you want to be able to row group by this column via the GUI. This will not block the API or properties being used to achieve row grouping.  [RowGroupingModule](/react-data-grid/modules/) |
| showRowGroup[Copy Link](#reference-grouping-showRowGroup)  string | boolean  [Initial](/react-data-grid/column-interface/#initial-column-options)  Set to true to have the grid place the values for the group into the cell, or put the name of a grouped column to just show that group.  [Custom Group Columns](/react-data-grid/grouping-custom-group-columns/) [RowGroupingModule](/react-data-grid/modules/) |

## Columns: Sort

See [Row Sorting](/react-data-grid/row-sorting/) for more information.

|  |
| --- |
| sortable[Copy Link](#reference-sort-sortable)  boolean  default: true  Set to `false` to disable sorting which is enabled by default. |
| sort[Copy Link](#reference-sort-sort)  SortDirection  If sorting by default, set it here. Set to `asc` or `desc`. |
| initialSort[Copy Link](#reference-sort-initialSort)  SortDirection  [Initial](/react-data-grid/column-interface/#initial-column-options)  Same as `sort`, except only applied when creating a new column. Not applied when updating column definitions. |
| sortIndex[Copy Link](#reference-sort-sortIndex)  number | null  If sorting more than one column by default, specifies order in which the sorting should be applied. |
| initialSortIndex[Copy Link](#reference-sort-initialSortIndex)  number  [Initial](/react-data-grid/column-interface/#initial-column-options)  Same as `sortIndex`, except only applied when creating a new column. Not applied when updating column definitions. |
| sortingOrder[Copy Link](#reference-sort-sortingOrder)  SortDirection[]  Array defining the order in which sorting occurs (if sorting is enabled). An array with any of the following in any order `['asc','desc',null]` |
| comparator[Copy Link](#reference-sort-comparator)  Function  Override the default sorting order by providing a custom sort comparator.- `valueA`, `valueB` are the values to compare. - `nodeA`, `nodeB` are the corresponding RowNodes. Useful if additional details are required by the sort. - `isDescending` - `true` if sort direction is `desc`. Not to be used for inverting the return value as the grid already applies `asc` or `desc` ordering. Return:- `0` valueA is the same as valueB - `> 0` Sort valueA after valueB - `< 0` Sort valueA before valueB |
| unSortIcon[Copy Link](#reference-sort-unSortIcon)  boolean  default: false  Set to `true` if you want the unsorted icon to be shown when no sort is applied to this column. |

## Columns: Spanning

See [Column](/react-data-grid/column-spanning/) / [Row](/react-data-grid/row-spanning/) Spanning

|  |
| --- |
| colSpan[Copy Link](#reference-spanning-colSpan)  Function  By default, each cell will take up the width of one column. You can change this behaviour to allow cells to span multiple columns. |
| spanRows[Copy Link](#reference-spanning-spanRows)  boolean | ((params: SpanRowsParams) => boolean)  Set to `true` to automatically merge cells in this column with equal values. Provide a callback to specify custom merging logic.  [Row Spanning](/react-data-grid/row-spanning/) [CellSpanModule](/react-data-grid/modules/) |

## Columns: Tooltips

|  |
| --- |
| tooltipField[Copy Link](#reference-tooltips-tooltipField)  ColDefField  The field of the tooltip to apply to the cell.  [TooltipModule](/react-data-grid/modules/) |
| tooltipValueGetter[Copy Link](#reference-tooltips-tooltipValueGetter)  Function  Callback that should return the string to use for a tooltip, `tooltipField` takes precedence if set. If using a custom `tooltipComponent` you may return any custom value to be passed to your tooltip component.  [Tooltip Component](/react-data-grid/tooltips/) [TooltipModule](/react-data-grid/modules/) |
| tooltipComponent[Copy Link](#reference-tooltips-tooltipComponent)  any  Provide your own tooltip component for the column.  [Tooltip Component](/react-data-grid/tooltips/) [TooltipModule](/react-data-grid/modules/) |
| tooltipComponentParams[Copy Link](#reference-tooltips-tooltipComponentParams)  any  The params used to configure `tooltipComponent`.  [TooltipModule](/react-data-grid/modules/) |

## Columns: Width

See [Column Sizing](/react-data-grid/column-sizing/) for more information.

|  |
| --- |
| width[Copy Link](#reference-width-width)  number  Initial width in pixels for the cell. If no width or flex properties set, cell width will default to 200 pixels. |
| initialWidth[Copy Link](#reference-width-initialWidth)  number  [Initial](/react-data-grid/column-interface/#initial-column-options)  Same as `width`, except only applied when creating a new column. Not applied when updating column definitions. |
| minWidth[Copy Link](#reference-width-minWidth)  number  Minimum width in pixels for the cell. |
| maxWidth[Copy Link](#reference-width-maxWidth)  number  Maximum width in pixels for the cell. |
| flex[Copy Link](#reference-width-flex)  number  Equivalent to `flex-grow` in CSS. When `flex` is set on one or more columns, any `width` value is ignored and instead the remaining free space in the grid is divided among flex columns in proportion to their flex value, so a column with `flex: 2` will be twice the size as one with `flex: 1`.  [Column Flex](/react-data-grid/column-sizing/#column-flex) |
| initialFlex[Copy Link](#reference-width-initialFlex)  number  [Initial](/react-data-grid/column-interface/#initial-column-options)  Same as `flex`, except only applied when creating a new column. Not applied when updating column definitions. |
| resizable[Copy Link](#reference-width-resizable)  boolean  default: true  Set to `false` to disable resizing which is enabled by default. |
| suppressSizeToFit[Copy Link](#reference-width-suppressSizeToFit)  boolean  default: false  Set to `true` if you want this column's width to be fixed during 'size to fit' operations. |
| suppressAutoSize[Copy Link](#reference-width-suppressAutoSize)  boolean  default: false  Set to `true` if you do not want this column to be auto-resizable by double clicking it's edge. |

## Groups

For column groups, the property `children` is mandatory. When the grid sees `children` it knows it's a column group.

See [Column Groups](/react-data-grid/column-groups/) for more information.

|  |
| --- |
| children required[Copy Link](#reference-columnGroups-children)  [(ColDef | ColGroupDef)[]](/react-data-grid/column-properties/#reference-columnGroups)  A list containing a mix of columns and column groups. |
| groupId[Copy Link](#reference-columnGroups-groupId)  string  The unique ID to give the column. This is optional. If missing, a unique ID will be generated. This ID is used to identify the column group in the API. |
| marryChildren[Copy Link](#reference-columnGroups-marryChildren)  boolean  default: false  Set to `true` to keep columns in this group beside each other in the grid. Moving the columns outside of the group (and hence breaking the group) is not allowed. |
| openByDefault[Copy Link](#reference-columnGroups-openByDefault)  boolean  default: false  Set to `true` if this group should be opened by default. |
| columnGroupShow[Copy Link](#reference-columnGroups-columnGroupShow)  ColumnGroupShowType  Whether to only show the column when the group is open / closed. If not set the column is always displayed as part of the group. |
| toolPanelClass[Copy Link](#reference-columnGroups-toolPanelClass)  ToolPanelClass  CSS class to use for the tool panel cell. Can be a string, array of strings, or function.  [ColumnsToolPanelModule](/react-data-grid/modules/) |
| suppressColumnsToolPanel[Copy Link](#reference-columnGroups-suppressColumnsToolPanel)  boolean  default: false  Set to `true` if you do not want this column or group to appear in the Columns Tool Panel.  [ColumnsToolPanelModule](/react-data-grid/modules/) |
| suppressFiltersToolPanel[Copy Link](#reference-columnGroups-suppressFiltersToolPanel)  boolean  default: false  Set to `true` if you do not want this column (filter) or group (filter group) to appear in the Filters Tool Panel.  [ColumnsToolPanelModule](/react-data-grid/modules/) |
| tooltipComponent[Copy Link](#reference-columnGroups-tooltipComponent)  any  Provide your own tooltip component for the column group.  [Tooltip Component](/react-data-grid/tooltips/) [TooltipModule](/react-data-grid/modules/) |
| tooltipComponentParams[Copy Link](#reference-columnGroups-tooltipComponentParams)  any  The params used to configure `tooltipComponent`.  [TooltipModule](/react-data-grid/modules/) |
| context[Copy Link](#reference-columnGroups-context)  any  Context property that can be used to associate arbitrary application data with this column definition. |

## Groups: Header

See [Column Headers](/react-data-grid/column-headers/) for more information.

|  |
| --- |
| headerName[Copy Link](#reference-groupsHeader-headerName)  string  The name to render in the column header. If not specified and field is specified, the field name will be used as the header name. |
| headerClass[Copy Link](#reference-groupsHeader-headerClass)  HeaderClass  CSS class to use for the header cell. Can be a string, array of strings, or function. |
| headerTooltip[Copy Link](#reference-groupsHeader-headerTooltip)  string  Tooltip for the column header  [TooltipModule](/react-data-grid/modules/) |
| autoHeaderHeight[Copy Link](#reference-groupsHeader-autoHeaderHeight)  boolean  default: false  If enabled then the column header row will automatically adjust height to accommodate the size of the header cell. This can be useful when using your own `headerComponent` or long header names in conjunction with `wrapHeaderText`.  [Auto Header Height](/react-data-grid/column-groups/) |
| headerGroupComponent[Copy Link](#reference-groupsHeader-headerGroupComponent)  any  The custom header group component to be used for rendering the component header. If none specified the default AG Grid is used.  [Header Group Component](/react-data-grid/column-headers/) |
| headerGroupComponentParams[Copy Link](#reference-groupsHeader-headerGroupComponentParams)  any  The params used to configure the `headerGroupComponent`. |
| suppressSpanHeaderHeight[Copy Link](#reference-groupsHeader-suppressSpanHeaderHeight)  boolean  default: false  Set to `true` if you don't want the column header for this column to span the whole height of the header container. |
| suppressStickyLabel[Copy Link](#reference-groupsHeader-suppressStickyLabel)  boolean  default: false  If `true` the label of the Column Group will not scroll alongside the grid to always remain visible. |

* [Column Options Reference](#top)
* [Columns](#reference-columns)
* [Columns: Accessibility](#reference-accessibility)
* [Columns: Aggregation](#reference-aggregation)
* [Columns: Display](#reference-display)
* [Columns: Editing](#reference-editing)
* [Columns: Events](#reference-events)
* [Columns: Filter](#reference-filtering)
* [Columns: Find](#reference-find)
* [Columns: Header](#reference-header)
* [Columns: Integrated Charts](#reference-charts)
* [Columns: Pinned](#reference-pinned)
* [Columns: Pivoting](#reference-pivoting)
* [Columns: Rendering and Styling](#reference-styling)
* [Columns: Row Dragging](#reference-row dragging)
* [Columns: Row Grouping](#reference-grouping)
* [Columns: Sort](#reference-sort)
* [Columns: Spanning](#reference-spanning)
* [Columns: Tooltips](#reference-tooltips)
* [Columns: Width](#reference-width)
* [Groups](#reference-columnGroups)
* [Groups: Header](#reference-groupsHeader)

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