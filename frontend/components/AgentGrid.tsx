"use client";
import React, { useMemo, useEffect } from "react";
import { useAgentRun } from "../hooks/use-agent-run";
import { LoadExternalComponent } from "@langchain/langgraph-sdk/react-ui";
import { useTheme } from "next-themes";

export interface AgentGridProps {
  threadId: string;
}

export default function AgentGrid({ threadId }: AgentGridProps) {
  const { ui, isLoading, error, stream } = useAgentRun({ threadId });
  const { resolvedTheme } = useTheme();

  console.log(`[AgentGrid] Rendering with useAgentRun. UI prop length: ${ui?.length}. isLoading: ${isLoading}. Error: ${error}`);
  // console.log("[AgentGrid] Full UI prop from useAgentRun:", JSON.stringify(ui));

  // Wait until the component is mounted on the client to avoid SSR/CSR
  // mismatches (e.g. when the server renders with an unknown theme).
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const gridMessages = useMemo(() => {
    return (ui || []).filter((msg: any) => msg.name === "agGridTable" && msg.props?.entities);
  }, [ui]);

  const lastGridMessage = useMemo(() => {
    return gridMessages.length > 0 ? gridMessages[gridMessages.length - 1] : null;
  }, [gridMessages]);

  useEffect(() => {
    console.log("[AgentGrid useEffect] ui prop changed (from useAgentRun):", JSON.stringify(ui));
    console.log("[AgentGrid useEffect] lastGridMessage changed (from useAgentRun):", JSON.stringify(lastGridMessage));
  }, [ui, lastGridMessage]);

  return (
    <>
      {/* Render only after mount to ensure we have the correct theme */}
      {mounted && lastGridMessage && (
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
            meta={{ theme: resolvedTheme === "dark" ? "dark" : "light" }}
          />
        </div>
      )}
      
      {/* Debug info - remove this once streaming works */}
      {mounted && (
        <div className="text-xs text-gray-500 mt-2">
          UI Messages: {ui.length} | Grid Message: {lastGridMessage ? "Found" : "None"}
        </div>
      )}
    </>
  );
} 