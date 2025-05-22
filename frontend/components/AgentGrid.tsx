"use client";
import React from "react";
import { useAgentRun } from "../hooks/use-agent-run";
import { LoadExternalComponent } from "@langchain/langgraph-sdk/react-ui";
import { useTheme } from "next-themes";

export interface AgentGridProps {
  threadId: string;
}

export default function AgentGrid({ threadId }: AgentGridProps) {
  const { ui, send, stop, stream } = useAgentRun({ threadId });
  const { theme, resolvedTheme } = useTheme();

  // Wait until the component is mounted on the client to avoid SSR/CSR
  // mismatches (e.g. when the server renders with an unknown theme).
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  // Find the last message that is an agGridTable
  const lastGridMessage = ui
    .slice()
    .reverse()
    .find((msg) => msg.name === "agGridTable");

  return (
    <>
      {/* Render only after mount to ensure we have the correct theme */}
      {mounted && lastGridMessage && (
        <div className="w-full h-full">
          <LoadExternalComponent
            // Re-mount the component whenever the theme changes so that meta
            // (and thus the AG Grid theme) is updated correctly.
            key={`${lastGridMessage.id}-${resolvedTheme}`}
            stream={stream as any}
            message={lastGridMessage}
            fallback={<div>Loading grid...</div>}
            meta={{ theme: resolvedTheme === "dark" ? "dark" : "light" }}
          />
        </div>
      )}
    </>
  );
} 