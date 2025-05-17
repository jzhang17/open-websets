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

# React Data GridTypeScript Generics

![react logo](/_astro/react.CtDRhtxt.svg)React

AG Grid supports TypeScript [Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html) for row data, cell values and grid context. This leads to greatly improved developer experience via code completion and compile time validation of row data and cell value properties.

##  Row Data: <TData> [Copy Link](#row-data-tdata) 

Provide a TypeScript interface for row data to the grid to enable auto-completion and type-checking whenever properties are accessed from a row `data` variable. There are multiple ways to configure the generic interface: via the `GridOptions<TData>` interface, via other individual interfaces and finally via framework components.

In the examples below we will use the `ICar` interface to represent row data.

```
// Row Data interface
interface ICar {
    make: string;
    model: string;
    price: number;
}

```

###  Configure via Component [Copy Link](#configure-via-component) 

The `<AgGridReact>` component accepts a generic parameter as `<AgGridReact<ICar>>`.

```
<AgGridReact<ICar>
    ref={gridRef}
    rowData={rowData}
    onRowSelected={onRowSelected}
/>

```

This ensures all the props defined on `<AgGridReact>` conform to the `ICar` interface. These props can be defined with types like this.

```
const gridRef = useRef<AgGridReact<ICar>>(null);

const [rowData, setRowData] = useState<ICar[]>([ ... ]);

const onRowSelected = useCallback((event: RowSelectedEvent<ICar>) => { ... }, [])

```

###  Configure via GridOptions [Copy Link](#configure-via-gridoptions) 

Set the row data type on the grid options interface via `GridOptions<ICar>`. The `ICar` interface will then be used throughout the grid options whenever row data is present. This is true for: properties, callbacks, events and the gridApi.

```
// Pass ICar to GridOptions as a generic
const gridOptions: GridOptions<ICar> = {
    // rowData is typed as ICar[]
    rowData: [ { make: 'Ford', model: 'Galaxy', price: 20000 } ],

    // Callback with params type: GetRowIdParams<ICar>
    getRowId: (params) => {
        // params.data : ICar
        return params.data.make + params.data.model;
    },

    // Event with type: RowSelectedEvent<ICar>
    onRowSelected: (event) => {
        // event.data: ICar | undefined
        if (event.data) {
            const price = event.data.price;
        }
    }
}

// Grid Api methods use ICar interface
function onSelection() {
    // api.getSelectedRows() : ICar[]
    const cars: ICar[] = api!.getSelectedRows();  
}

```

You do not need to explicitly type callbacks and events that are defined as part of `GridOptions`. TypeScript will correctly pass the generic type down the interface hierarchy.

###  Configure via Interfaces [Copy Link](#configure-via-interfaces) 

Each interface that accepts a generic type of `TData` can also be configured individually. For example, an event handler function can accept the generic parameter on the event `RowSelectedEvent`.

```
function onRowSelected(event: RowSelectedEvent<ICar>) {
    if (event.data) {
        // event.data: ICar | undefined
        const price = event.data.price;
    }
}

```

###  Type: TData | undefined [Copy Link](#type-tdata--undefined) 

For a number of events and callbacks, when a generic interface is provided, the `data` property is typed as `TData | undefined` instead of `any`. The undefined is required because it is possible for the `data` property to be undefined under certain grid configurations.

A good example of this is [Row Grouping](/react-data-grid/grouping/). The `onRowSelected` event is fired for both leaf and group rows. Data is only present on leaf nodes and so the event should be written to handle cases when `data` is undefined for groups.

```
function onRowSelected(event: RowSelectedEvent<ICar>) {
    // event.data is typed as ICar | undefined
    if (event.data) {
        // Leaf row with data
        const price = event.data.price;
    } else {
        // This is a group row
    }
}

```

##  Cell Value: <TValue> [Copy Link](#cell-value-tvalue) 

When working with cell values it is possible to provide a generic interface for the `value` property. While this will often be a primitive type, such as `string` or `number`, it can also be a complex type. Using a generic for the cell value will enable auto-completion and type-checking.

###  Configure via ColDef [Copy Link](#configure-via-coldef) 

Set the cell value type directly on the column definition interface via `ColDef<TData, TValue>` (e.g. `ColDef<ICar, number>`). This will be passed through to all properties in the column definition that use the cell value type.

###  Configure via Interfaces [Copy Link](#configure-via-interfaces-1) 

Each interface that accepts a generic type of `TValue` can also be configured individually. Here is an example of a `valueFormatter` for the price column. The `params.value` property is correctly typed as a `number` due to typing the params argument as `ValueFormatterParams<ICar, number>`.

```
const colDefs: ColDef<ICar>[] = [
    {
        field: 'price',
        valueFormatter: (params: ValueFormatterParams<ICar, number>) => {
            // params.value : number
            return "£" + params.value;
        }
    }
];

```

The `TValue` generic type is also supported for cell renderers / editors by `ICellRendererParams<TData, TValue>` and `ICellEditorParams<TData, TValue>` respectively.

###  Typed: TValue | null | undefined [Copy Link](#typed-tvalue--null--undefined) 

For a number of events and callbacks when a generic interface is provided, the `value` property is typed as `TValue | null | undefined` instead of `any`. This is because it is possible for the `value` property to be `undefined` under certain grid configurations, and it can be `null` when cell editing is enabled and the value has been deleted.

##  Context: <TContext> [Copy Link](#context-tcontext) 

The grid options property `context` can be used to provided additional information to grid callbacks and event handlers implemented by your application. See [Context](/react-data-grid/context/) for more details. The `params.context` property can be typed via the `TContext` generic parameter.

###  Configure via Interfaces [Copy Link](#configure-via-interfaces-2) 

The generic parameter `TContext` needs to be explicitly provided to each interface where it is used. For example, an event handler function can accept the generic parameter on the event `RowSelectedEvent<TData, TContext>`.

```
// Define the interface for your context
interface IDiscountRate {
    discount: number;
}

// Set the context property on gridOptions using `as` to apply the type
const gridOptions: GridOptions<ICar> {
    context: {
        discount: 0.9
    } as IDiscountRate;
}

// Provide to the interface to the TContext generic parameter to type the params.context property
function onRowSelected(event: RowSelectedEvent<ICar, IDiscountRate>) {
    if (event.data) {
        // event.context.discount is typed as number
        const price = event.data.price * event.context.discount;
    }
}

```

##  Generic Type Example [Copy Link](#generic-type-example) 

Inspect the code in the following example or open in Plunker to experiment with generic typing yourself.

* `rowData` is typed using the `ICar` interface via `TData`.
* `valueFormatter` types the `value` property as `number` via `TValue`.
* `onRowSelected` event handler uses the `IDiscountRate` interface via `TContext`.

Also note that the `Log Selected Cars` button will log the selected cars to the developer console.

##  Fallback Default [Copy Link](#fallback-default) 

If generic interfaces are not provided then the grid will use the default type of `any`. This means that generics in AG Grid are completely optional. GridOptions is defined as `GridOptions<TData = any>`, so if a generic parameter is not provided then `any` is used in its place for row data properties.

Likewise for cell values, if a generic parameter is not provided, `any` is used for the value property. For example, cell renderer params are defined as `ICellRendererParams<TData = any, TValue = any>`.

* [TypeScript Generics](#top)
* [Row Data: <TData>](#row-data-tdata)
* [Configure via Component](#configure-via-component)
* [Configure via GridOptions](#configure-via-gridoptions)
* [Configure via Interfaces](#configure-via-interfaces)
* [Type: TData | undefined](#type-tdata--undefined)
* [Cell Value: <TValue>](#cell-value-tvalue)
* [Configure via ColDef](#configure-via-coldef)
* [Configure via Interfaces](#configure-via-interfaces-1)
* [Typed: TValue | null | undefined](#typed-tvalue--null--undefined)
* [Context: <TContext>](#context-tcontext)
* [Configure via Interfaces](#configure-via-interfaces-2)
* [Generic Type Example](#generic-type-example)
* [Fallback Default](#fallback-default)

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