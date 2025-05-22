"use client";
import React from "react";
import { useAgentRun } from "../hooks/use-agent-run";
import { LoadExternalComponent } from "@langchain/langgraph-sdk/react-ui";

export interface AgentGridProps {
  threadId: string;
}

export default function AgentGrid({ threadId }: AgentGridProps) {
  const { ui, send, stop, stream } = useAgentRun({ threadId });

  // Find the last message that is an agGridTable
  const lastGridMessage = ui
    .slice()
    .reverse()
    .find((msg) => msg.name === "agGridTable");

  return (
    <>
      {lastGridMessage && (
        <div className="w-full h-full">
          <LoadExternalComponent
            key={lastGridMessage.id}
            stream={stream as any}
            message={lastGridMessage}
            fallback={<div>Loading grid...</div>}
          />
        </div>
      )}
    </>
  );
} 