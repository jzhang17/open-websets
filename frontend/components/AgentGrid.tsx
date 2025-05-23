"use client";
import React, { useMemo, useEffect, useState, useCallback } from "react";
import { useAgentRunCtx } from "@/app/providers/agent-run-provider";
import { LoadExternalComponent } from "@langchain/langgraph-sdk/react-ui";
import { useTheme } from "next-themes";
import { AgentGridLoading } from "@/components/AgentGridLoading";

export interface AgentGridProps {
  threadId: string;
}

function AgentGridComponent({}: AgentGridProps) {
  // Consume the stream and UI from the AgentRunProvider context so that
  // this component stays in sync with the rest of the app.
  const { ui, isLoading, error, stream } = useAgentRunCtx();
  const { resolvedTheme } = useTheme();

  // Wait until the component is mounted on the client to avoid SSR/CSR
  // mismatches (e.g. when the server renders with an unknown theme).
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const gridMessages = useMemo(() => {
    if (!ui || ui.length === 0) return [];
    return ui.filter((msg: any) => msg.name === "agGridTable" && msg.props?.entities);
  }, [ui]);

  const lastGridMessage = useMemo(() => {
    return gridMessages.length > 0 ? gridMessages[gridMessages.length - 1] : null;
  }, [gridMessages]);

  // Only log when there are actual changes, not on every render
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[AgentGrid] UI updated: ${ui?.length || 0} items, grid messages: ${gridMessages.length}, loading: ${isLoading}`);
    }
  }, [ui?.length, gridMessages.length, isLoading]);

  const themeMetadata = useMemo(() => ({
    theme: resolvedTheme === "dark" ? "dark" : "light"
  }), [resolvedTheme]);

  if (!mounted) {
    return null;
  }

  if (!lastGridMessage) {
    return <AgentGridLoading />;
  }

  return (
    <div className="w-full h-full">
      <LoadExternalComponent
        /*
         * Use a stable key so the component stays mounted while new grid
         * updates stream in. We only remount when the user toggles the
         * colour-scheme because AG Grid needs a fresh theme.
         */
        key={`agGrid-${resolvedTheme}`}
        stream={stream as any}
        message={lastGridMessage}
        fallback={<div>Loading grid...</div>}
        meta={themeMetadata}
      />
    </div>
  );
}

// Memoize the component to prevent unnecessary re-renders when props haven't changed
const AgentGrid = React.memo(AgentGridComponent);

export default AgentGrid; 