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

# React Data GridCustom Components

![react logo](/_astro/react.CtDRhtxt.svg)React

You can create your own Custom Components to customise the behaviour of the grid. For example you can customise how cells are rendered, how values are edited and also create your own filters.

[ ![React Custom Components thumbnail](https://img.youtube.com/vi/eglfpHRpcu0/0.jpg) ](https://www.youtube.com/watch?v=eglfpHRpcu0) 

The full list of component types you can provide in the grid are as follows:

* [Cell Component](/react-data-grid/component-cell-renderer/): To customise the contents of a cell.
* [Header Component](/react-data-grid/column-headers/#custom-component): To customise the header of a column.
* [Inner Header Component](/react-data-grid/column-headers/#inner-header-component): To customise the inner header of a column.
* [Header Group Component](/react-data-grid/column-groups/#custom-group-component): To customise the header of a column group.
* [Inner HeaderGroup Component](/react-data-grid/column-groups/#inner-header-group-component): To customise the inner header component of a column group.
* [Edit Component](/react-data-grid/cell-editors/): To customise the editing of a cell.
* [Filter Component](/react-data-grid/component-filter/): For custom column filter that appears inside the column menu.
* [Floating Filter](/react-data-grid/component-floating-filter/): For custom column floating filter that appears inside the column menu.
* [Date Component](/react-data-grid/filter-date/#custom-selection-component): To customise the date selection component in the date filter.
* [Menu Item Component](/react-data-grid/component-menu-item/): To customise the items within grid menus.
* [Loading Component](/react-data-grid/component-loading-cell-renderer/): To customise the loading cell row when using Server Side row model.
* [Overlay Component](/react-data-grid/overlays/): To customise loading and no rows overlay components.
* [Status Bar Component](/react-data-grid/status-bar/): For custom status bar components.
* [Tool Panel Component](/react-data-grid/component-tool-panel/): For custom tool panel components.
* [Tooltip Component](/react-data-grid/tooltips/): For custom cell tooltip components.

The remainder of this page gives information that is common across all the component types.

##  Registering Custom Components [Copy Link](#registering-custom-components) 

In previous versions of the grid, custom components were declared in an imperative way. See [Migrating to Use reactiveCustomComponents](/react-data-grid/upgrading-to-ag-grid-31-1/#migrating-custom-components-to-use-reactivecustomcomponents-option) for details on how to migrate to the current format.

There are two ways to register custom components:

* Direct reference.
* By name.

###  1\. By Direct Reference [Copy Link](#1-by-direct-reference) 

When registering a React Component by reference you simply pass the Component to the place you want it used (i.e. Cell Renderer, Filter etc).

In this example we're specifying that we want our React `CubeComponent` as a Cell Renderer in the `Cube` column:

```
//...other imports
import CubeComponent from './CubeComponent';

const GridExample = () => {
  // other properties & methods
  
    const columnDefs = useMemo( () => [{field: 'value', cellRenderer: CubeComponent}], []);

    return (
        <AgGridReact
            columnDefs={columnDefs}
            ...other properties            
        />
    );
};

```

The advantage of referencing Components directly is cleaner code, without the extra level of indirection added when referencing by name.

###  2\. By Name [Copy Link](#2-by-name) 

When registering a React component by name you need to first register the component within the grid `components` property, then reference the component by name where you want it used (i.e. as a Cell Renderer, Filter etc).

In this example we've registered our React `CubeComponent` and given it a name of `cubeComponent` (this can be any name you choose). We then specify that we want the previously registered `cubeComponent` to be used as a Cell Renderer in the `Cube` column:

```
//...other imports
import CubeComponent from './CubeComponent';

const GridExample = () => {
  // other properties & methods
  
  const components = useMemo(() => ({
      cubeComponent: CubeComponent    
  }), []);

  const columnDefs = useMemo(() => [{field: 'value', cellRenderer: 'cubeComponent'}], []);

  return (
        <AgGridReact
           components={components}
           columnDefs={columnDefs}
           ...other properties            
        />
  );
};

```

The advantage of referencing components by name is definitions (eg Column Definitions) can be composed of simple types (ie JSON), which is useful should you wish to persist Column Definitions.

A React Component in this context can be any valid React Component - A Class Based Component, a Hook or even an inline Functional Component. The same rules apply regardless of the type of component used.

Clicking on the `Push For Total` button will log results in the developer console.

##  Providing Additional Parameters [Copy Link](#providing-additional-parameters) 

Each Custom Component gets a set of parameters from the grid. For example, for Cell Component the grid provides, among other things, the value to be rendered. You can provide additional properties to the Custom Component (e.g. what currency symbol to use) by providing additional parameters specific to your application.

To provide additional parameters, use the property `[prop-name]Params`, e.g. `cellRendererParams`.

```
const [columnDefs, setColumnDefs] = useState([
    { 
        field: 'price',
        cellRenderer: PriceCellRenderer,
        cellRendererParams: {
            currency: 'EUR'
        }
    },
]);

<AgGridReact columnDefs={columnDefs} />
```

##  Mixing JavaScript and React [Copy Link](#mixing-javascript-and-react) 

When providing Custom Components you have a choice of the following:

1. Provide an AG Grid component as a React Component.
2. Provide an AG Grid component in JavaScript (JavaScript Class Components only, not JavaScript Functional Components).

The following code snippet shows how both JavaScript and React Components can be used at the same time:

```
//...other imports
import JavascriptComponent from './JavascriptComponent.js';
import ReactComponent from './ReactComponent';

const GridExample = () => {
  // JS and React components, only need register if looking up by name
  const components = useMemo(() => ({
      'javascriptComponent': JavascriptComponent,
      'reactComponent': ReactComponent    
  }), []);

  const columnDefs = useMemo( () => [
      {
          headerName: "JS Cell",
          field: "value",
          cellRenderer: 'javascriptComponent', // JS comp by Name
      },
      {
          headerName: "JS Cell",
          field: "value",
          cellRenderer: JavascriptComponent, // JS comp by Direct Reference
      },
      {
          headerName: "React Cell",
          field: "value",
          cellRenderer: 'reactComponent', // React comp by Name
      },
      {
          headerName: "React Cell",
          field: "value",
          cellRenderer: ReactComponent, // React comp by Direct Reference
      }
  ], []);

    return (
        <AgGridReact
            components={components}
            columnDefs={columnDefs}
            ...other properties
        />
    );
};

```

Change the documentation view to [JavaScript](/javascript-data-grid/components/) to see how to create a plain JavaScript component.

##  Higher Order Components [Copy Link](#higher-order-components) 

If you use `connect` to use Redux, or if you're using a Higher Order Component (HOC) to wrap the grid React component, you'll also need to ensure the grid can get access to the newly created component. To do this you need to ensure `forwardRef` is set:

```
export default connect((state) => {
    return {
        currencySymbol: state.currencySymbol,
        exchangeRate: state.exchangeRate
    }
}, null, null, { forwardRef: true } // must be supplied for react/redux when using AgGridReact
)(PriceRenderer);

```

##  Component Usage [Copy Link](#component-usage) 

The below table gives a summary of the components, where they are configured and using what attribute.

| Component                      | Where                                    | Attribute                                                |
| ------------------------------ | ---------------------------------------- | -------------------------------------------------------- |
| Cell Component                 | Column Definition                        | cellRenderercellRendererParamscellRendererSelector       |
| Editor Component               | Column Definition                        | cellEditorcellEditorParamscellEditorSelector             |
| Filter                         | Column Definition                        | filterfilterParams                                       |
| Floating Filter                | Column Definition                        | floatingFilterfloatingFilterParams                       |
| Date Component                 | Column Definition                        | dateComponentdateComponentParams                         |
| Header Component               | Column Definition                        | headerComponentheaderComponentParams                     |
| Inner Header Component         | Column Definition                        | innerHeaderComponentinnerHeaderComponentParams           |
| Header Group Component         | Column Definition                        | headerGroupComponentheaderGroupComponentParams           |
| Inner Header Group Component   | Column Definition                        | innerHeaderGroupComponentinnerHeaderGroupComponentParams |
| Tooltip Component              | Column Definition                        | tooltipComponenttooltipComponentParams                   |
| Group Row Cell Component       | Grid Option                              | groupRowRenderergroupRowRendererParams                   |
| Group Row Inner Cell Component | cellRendererParamsgroupRowRendererParams | innerRendererinnerRendererParams                         |
| Detail Cell Component          | Grid Option                              | detailCellRendererdetailCellRendererParams               |
| Full Width Cell Component      | Grid Option                              | fullWidthCellRendererfullWidthCellRendererParams         |
| Loading Cell Component         | Grid OptionColumn Definition             | loadingCellRendererloadingCellRendererParams             |
| Loading Overlay                | Grid Option                              | loadingOverlayComponentloadingOverlayComponentParams     |
| No Rows Overlay                | Grid Option                              | noRowsOverlayComponentnoRowsOverlayComponentParams       |
| Drag and Drop Image            | Grid Option                              | dragAndDropImageComponentdragAndDropImageComponentParams |
| Status Bar Component           | Grid Option -> Status Bar                | statusPanelstatusPanelParams                             |
| Tool Panel                     | Grid Option -> Side Bar                  | toolPaneltoolPanelParams                                 |
| Menu Item                      | Grid Option -> Menu                      | menuItemmenuItemParams                                   |

##  Grid Provided Components [Copy Link](#grid-provided-components) 

The grid comes with pre-registered components that can be used. Each component provided by the grid starts with the namespaces 'ag' to minimise naming conflicts with user provided components. The full list of grid provided components are in the table below.

| Drag And Drop      |                                                         |
| ------------------ | ------------------------------------------------------- |
| agDragAndDropImage | Default cover element when grid parts are being dragged |

| Date Inputs |                                    |
| ----------- | ---------------------------------- |
| agDateInput | Default date input used by filters |

| Column Headers      |                             |
| ------------------- | --------------------------- |
| agColumnHeader      | Default column header       |
| agColumnHeaderGroup | Default column group header |

| Column Filters          |                                                           |
| ----------------------- | --------------------------------------------------------- |
| agSetColumnFilter (e)   | Set filter (default when using AG Grid Enterprise)        |
| agTextColumnFilter      | Simple text filter (default when using AG Grid Community) |
| agNumberColumnFilter    | Number filter                                             |
| agDateColumnFilter      | Date filter                                               |
| agMultiColumnFilter (e) | Multi filter                                              |
| agGroupColumnFilter (e) | Group column filter                                       |

| Floating Filters                |                              |
| ------------------------------- | ---------------------------- |
| agSetColumnFloatingFilter (e)   | Floating set filter          |
| agTextColumnFloatingFilter      | Floating text filter         |
| agNumberColumnFloatingFilter    | Floating number filter       |
| agDateColumnFloatingFilter      | Floating date filter         |
| agMultiColumnFloatingFilter (e) | Floating multi filter        |
| agGroupColumnFloatingFilter (e) | Floating group column filter |

| Cell Components                 |                                                                |
| ------------------------------- | -------------------------------------------------------------- |
| agAnimateShowChangeCellRenderer | Cell Component that animates value changes                     |
| agAnimateSlideCellRenderer      | Cell Component that animates value changes                     |
| agGroupCellRenderer             | Cell Component for displaying group information                |
| agLoadingCellRenderer (e)       | Cell Component for loading row when using Enterprise row model |
| agSkeletonCellRenderer (e)      | Cell Component for displaying skeleton cells                   |
| agCheckboxCellRenderer          | Cell Component that displays a checkbox for boolean values     |

| Overlays         |                 |
| ---------------- | --------------- |
| agLoadingOverlay | Loading overlay |
| agNoRowsOverlay  | No rows overlay |

| Cell Editors               |                                        |
| -------------------------- | -------------------------------------- |
| agTextCellEditor           | Text cell editor                       |
| agSelectCellEditor         | Select cell editor                     |
| agRichSelectCellEditor (e) | Rich select editor                     |
| agLargeTextCellEditor      | Large text cell editor                 |
| agNumberCellEditor         | Number cell editor                     |
| agDateCellEditor           | Date cell editor                       |
| agDateStringCellEditor     | Date represented as string cell editor |
| agCheckboxCellEditor       | Checkbox cell editor                   |

| Master Detail            |                                       |
| ------------------------ | ------------------------------------- |
| agDetailCellRenderer (e) | Detail panel for master / detail grid |

| Column Menu / Context Menu |                                         |
| -------------------------- | --------------------------------------- |
| agMenuItem (e)             | Menu item within column or context menu |

##  Overriding Grid Components [Copy Link](#overriding-grid-components) 

It is also possible to override components. Where the grid uses a default value, this means the override component will be used instead. The default components, where overriding makes sense, are as follows:

* **agDragAndDropImage**: To change the default drag and drop image when dragging grid parts.
* **agDateInput**: To change the default date selection across all filters.
* **agColumnHeader**: To change the default column header across all columns.
* **agColumnGroupHeader**: To change the default column group header across all columns.
* **agLoadingCellRenderer**: To change the default loading cell renderer for Enterprise Row Model.
* **agSkeletonCellRenderer**: To change the default skeleton loading cell renderer for Enterprise Row Model.
* **agLoadingOverlay**: To change the default 'loading' overlay.
* **agNoRowsOverlay**: To change the default 'no rows' overlay.
* **agCellEditor**: To change the default cell editor.
* **agDetailCellRenderer**: To change the default detail panel for master / detail grids.
* **agMenuItem**: To change the default menu item for column and context menus.

To override the default component, register the custom component in the GridOptions `components` property under the above name.

```
const components = useMemo(() => (
    { agDateInput: CustomDateComponent,
        agColumnHeader: CustomHeaderComponent 
    }), []);

<AgGridReact
    components={components}
    ...other properties...
/>

```

* [Custom Components](#top)
* [Registering Custom Components](#registering-custom-components)
* [1\. By Direct Reference](#1-by-direct-reference)
* [2\. By Name](#2-by-name)
* [Providing Additional Parameters](#providing-additional-parameters)
* [Mixing JavaScript and React](#mixing-javascript-and-react)
* [Higher Order Components](#higher-order-components)
* [Component Usage](#component-usage)
* [Grid Provided Components](#grid-provided-components)
* [Overriding Grid Components](#overriding-grid-components)

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