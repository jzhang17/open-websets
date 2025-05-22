import React from "react";
import { AgGridReact } from "ag-grid-react";
import { themeAlpine } from "ag-grid-community";
import { useStreamContext } from "@langchain/langgraph-sdk/react-ui";
import type { Entity } from "./list_gen_agent_js/graph";
import type { QualificationItem } from "./entity_qualification_agent_js/graph";

import { ModuleRegistry, AllCommunityModule, ColDef } from "ag-grid-community";
// Register all community modules
ModuleRegistry.registerModules([AllCommunityModule]);

interface AgGridTableProps {
  entities?: Entity[];
  qualificationSummary?: QualificationItem[];
}

// Defines the AG Grid table component for generative UI
export default {
  agGridTable: (props: AgGridTableProps) => {
    const { entities = [], qualificationSummary = [] } = props;
    // Access stream context if needed
    const { meta } = useStreamContext?.() || {};

    type RowItem = {
      index: number;
      name: string;
      url: string;
      qualified: boolean | null;
      reasoning: string;
    };

    const rowData: RowItem[] = entities.map((e) => {
      const qual = qualificationSummary.find((q) => q.index === e.index) || ({} as Partial<QualificationItem>);
      return {
        index: e.index,
        name: e.name,
        url: e.url,
        qualified: qual.qualified ?? null,
        reasoning: qual.reasoning || "",
      };
    });

    const columnDefs: ColDef<RowItem>[] = [
      { field: "index", headerName: "Index", sortable: true, hide: true },
      { field: "name", headerName: "Name", sortable: true, flex: 1 },
      {
        field: "url",
        headerName: "URL",
        sortable: true,
        flex: 2,
        cellRenderer: (params: { value: string }) => (
          <a href={params.value} target="_blank" rel="noopener noreferrer">
            {params.value}
          </a>
        ),
      },
      {
        field: "qualified",
        headerName: "Match",
        sortable: true,
        flex: 1,
        comparator: (valueA: boolean | null, valueB: boolean | null) => {
          if (valueA === valueB) return 0;
          if (valueA === true) return -1;
          if (valueB === true) return 1;
          if (valueA === false) return -1; // false before null
          if (valueB === false) return 1; // null after false
          return 0;
        },
      },
      { field: "reasoning", headerName: "Reasoning", flex: 3, wrapText: true },
    ];

    return (
      <div className="flex-1 w-full">
        <AgGridReact
          theme={themeAlpine}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={{ flex: 1, sortable: true, filter: true }}
          domLayout="autoHeight"
        />
      </div>
    );
  },
}; 