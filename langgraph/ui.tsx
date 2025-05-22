import React from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { useStreamContext } from "@langchain/langgraph-sdk/react-ui";
import type { Entity } from "./list_gen_agent_js/graph";
import type { QualificationItem } from "./entity_qualification_agent_js/graph";

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

    const rowData = entities.map((e) => {
      const qual = qualificationSummary.find((q) => q.index === e.index) || ({} as Partial<QualificationItem>);
      return {
        index: e.index,
        name: e.name,
        url: e.url,
        qualified: qual.qualified ?? null,
        reasoning: qual.reasoning || "",
      };
    });

    const columnDefs = [
      { field: "index", headerName: "Index", sortable: true },
      { field: "name", headerName: "Entity Name", sortable: true, flex: 1 },
      { field: "url", headerName: "URL", sortable: true, flex: 2 },
      { field: "qualified", headerName: "Qualified", sortable: true, flex: 1 },
      { field: "reasoning", headerName: "Reasoning", flex: 3, wrapText: true },
    ];

    return (
      <div className="ag-theme-alpine flex-1 w-full h-full">
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={{ flex: 1, sortable: true, filter: true }}
        />
      </div>
    );
  },
}; 