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
  const { resolvedTheme } = useTheme();

  // Find the last message that is an agGridTable
  const lastGridMessage = ui
    .slice()
    .reverse()
    .find((msg) => msg.name === "agGridTable");

  // Get the current theme without using a conditional
  const currentTheme = resolvedTheme === "dark" ? "dark" : "light";

  return (
    <>
      {lastGridMessage && (
        <div className="w-full h-full">
          <LoadExternalComponent
            key={lastGridMessage.id}
            stream={stream as any}
            message={lastGridMessage}
            fallback={<div>Loading grid...</div>}
            meta={{ theme: currentTheme }}
          />
        </div>
      )}
    </>
  );
} 