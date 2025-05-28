/*
 * NOTE: This file is no longer used in the current architecture.
 * 
 * Previously, this file defined AG Grid components for LangGraph's generative UI system,
 * where the server would "beam" pre-rendered UI components to the client using typedUi().
 * 
 * We've now switched to a traditional client-side rendering approach where:
 * - The server sends only data/state updates via LangGraph streams
 * - The client (AgentGrid.tsx) renders the AG Grid directly using that data
 * 
 * This provides better performance, simpler debugging, and more control over the UI.
 * The AG Grid setup code has been moved to frontend/components/AgentGrid.tsx
 */

// Original generative UI code (kept for reference):
import React from "react";
import { AgGridReact } from "ag-grid-react";
import { useStreamContext } from "@langchain/langgraph-sdk/react-ui";
import type { Entity } from "./list_gen_agent_js/graph";
import type { QualificationItem } from "./entity_qualification_agent_js/graph";

import {
  ModuleRegistry,
  AllCommunityModule,
  ColDef,
  themeAlpine,
  colorSchemeDark,
} from "ag-grid-community";
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
    const { meta } =
      useStreamContext<
        Record<string, unknown>,
        { MetaType: StreamContextMeta }
      >() || {};
    // Build the appropriate AG Grid theme object. We start with `themeAlpine`
    // and, if the UI is in dark mode, apply the built-in `colorSchemeDark` part.
    const gridTheme =
      meta && meta.theme === "dark"
        ? themeAlpine.withPart(colorSchemeDark)
        : themeAlpine;

    type RowItem = {
      index: number;
      name: string;
      url: string;
      qualified: boolean | null;
      reasoning: string;
    };

    const rowData: RowItem[] = entities.map((e) => {
      const qual =
        qualificationSummary.find((q) => q.index === e.index) ||
        ({} as Partial<QualificationItem>);
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
        sort: "asc",
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
            return 1; // A comes after B
          }
          return 0; // A and B are of equal priority for sorting
        },
      },
      { 
        field: "reasoning", 
        headerName: "Reasoning", 
        flex: 3, 
        wrapText: true,
        cellRenderer: (params: { data: RowItem }) => {
          // Show "pending research" in italics if entity hasn't been qualified yet
          if (params.data.qualified === null) {
            return <span style={{ fontStyle: 'italic' }}>Pending research...</span>;
          }
          return params.data.reasoning;
        }
      },
    ];

    return (
      <div className="flex-1 w-full">
        <AgGridReact
          theme={gridTheme}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={{ flex: 1, sortable: true, filter: true }}
          domLayout="autoHeight"
        />
      </div>
    );
  },
};
