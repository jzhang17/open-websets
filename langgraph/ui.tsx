import React from "react";
import { AgGridReact } from "ag-grid-react";
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

interface StreamContextMeta {
  theme?: "light" | "dark";
}

// Defines the AG Grid table component for generative UI
export default {
  agGridTable: (props: AgGridTableProps) => {
    const { entities = [], qualificationSummary = [] } = props;
    // Access stream context if needed
    const { meta } = useStreamContext<Record<string, unknown>, { MetaType: StreamContextMeta }>() || {};
    const currentTheme = meta?.theme === "dark" ? "ag-theme-alpine-dark" : "ag-theme-alpine";

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
          // Desired sort order: true, then false, then null.
          // Map values to numbers where a smaller number means higher sort priority.
          const mapToPriority = (val: boolean | null): number => {
            if (val === true) {
              return 0; // Highest priority
            }
            if (val === false) {
              return 1; // Middle priority
            }
            return 2; // Lowest priority (represents null)
          };

          const priorityA = mapToPriority(valueA);
          const priorityB = mapToPriority(valueB);

          if (priorityA < priorityB) {
            return -1; // A comes before B
          }
          if (priorityA > priorityB) {
            return 1;  // A comes after B
          }
          return 0; // A and B are of equal priority for sorting
        },
      },
      { field: "reasoning", headerName: "Reasoning", flex: 3, wrapText: true },
    ];

    return (
      <div className="flex-1 w-full">
        <AgGridReact
          className={currentTheme}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={{ flex: 1, sortable: true, filter: true }}
          domLayout="autoHeight"
        />
      </div>
    );
  },
}; 