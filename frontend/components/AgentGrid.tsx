"use client";
import React, { useMemo, useEffect, useState } from "react";
import { useAgentRunCtx } from "@/app/providers/agent-run-provider";
import { useTheme } from "next-themes";
import { AgentGridLoading } from "@/components/AgentGridLoading";
import { AgGridReact } from "ag-grid-react";
import {
  ModuleRegistry,
  AllCommunityModule,
  ColDef,
  CellStyle,
  themeAlpine,
  colorSchemeDark,
} from "ag-grid-community";

// Register all community modules
ModuleRegistry.registerModules([AllCommunityModule]);

export interface AgentGridProps {
  threadId: string;
}

type Entity = {
  index: number;
  name: string;
  url: string;
};

type QualificationItem = {
  index: number;
  qualified: boolean | null;
  reasoning: string;
};

type RowItem = {
  index: number;
  name: string;
  url: string;
  qualified: boolean | null;
  reasoning: string;
};

function AgentGridComponent({}: AgentGridProps) {
  const { stream } = useAgentRunCtx();
  const { resolvedTheme } = useTheme();

  // Wait until the component is mounted on the client to avoid SSR/CSR
  // mismatches (e.g. when the server renders with an unknown theme).
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // Extract entities and qualification summary from stream state
  const stateValues = stream?.values || {};
  const entities: Entity[] = stateValues.entities || [];
  const qualificationSummary: QualificationItem[] = stateValues.qualificationSummary || [];

  // Build the appropriate AG Grid theme object
  const gridTheme = useMemo(() => {
    return resolvedTheme === "dark"
      ? themeAlpine.withPart(colorSchemeDark)
      : themeAlpine;
  }, [resolvedTheme]);

  // Build row data for AG Grid
  const rowData: RowItem[] = useMemo(() => {
    return entities.map((e) => {
      const qual: Partial<QualificationItem> = qualificationSummary.find((q) => q.index === e.index) || {};
      return {
        index: e.index,
        name: e.name,
        url: e.url,
        qualified: qual.qualified ?? null,
        reasoning: qual.reasoning || "",
      };
    });
  }, [entities, qualificationSummary]);

  // Define column definitions
  const columnDefs: ColDef<RowItem>[] = useMemo(() => [
    { field: "index", headerName: "Index", sortable: true, hide: true },
    {
      field: "name",
      headerName: "Name",
      sortable: true,
      flex: 1,
      wrapText: true,
      cellStyle: { lineHeight: "1.5", padding: "4px 12px" } as CellStyle,
    },
    {
      field: "url",
      headerName: "URL",
      sortable: true,
      flex: 2,
      cellStyle: { lineHeight: "1.5", padding: "4px 12px" } as CellStyle,
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
      cellStyle: {
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "4px 12px",
      } as CellStyle,
      cellRenderer: (params: { value: boolean | null }) => (
        <input
          type="checkbox"
          checked={params.value === true}
          readOnly
          style={{ alignSelf: "flex-start", marginTop: "2px", padding: "4px" }}
        />
      ),
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
      autoHeight: true,
      cellStyle: { lineHeight: "1.5", padding: "4px 12px" } as CellStyle,
      cellRenderer: (params: { data: RowItem }) => {
        // Show "pending research" in italics if entity hasn't been qualified yet
        if (params.data.qualified === null) {
          return <span style={{ fontStyle: 'italic' }}>Pending research...</span>;
        }
        return params.data.reasoning;
      }
    },
  ], []);

  if (!mounted) {
    return null;
  }

  if (entities.length === 0) {
    return (
      <div className="w-full h-full">
        <AgentGridLoading />
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <div className="flex-1 w-full">
        <AgGridReact
          theme={gridTheme}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={{ flex: 1, sortable: true, filter: true, cellStyle: { padding: "4px 12px" } as CellStyle }}
          domLayout="autoHeight"
        />
      </div>
    </div>
  );
}

// Memoize the component to prevent unnecessary re-renders when props haven't changed
const AgentGrid = React.memo(AgentGridComponent);

export default AgentGrid; 
