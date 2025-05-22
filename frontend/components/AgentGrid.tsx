"use client";
import React from "react";
import { useAgentRun } from "../hooks/use-agent-run";
import { LoadExternalComponent } from "@langchain/langgraph-sdk/react-ui";

export interface AgentGridProps {
  threadId: string;
}

export default function AgentGrid({ threadId }: AgentGridProps) {
  const { ui, send, stop, stream } = useAgentRun({ threadId });

  return (
    <>
      {ui.map((msg) => (
        <LoadExternalComponent
          key={msg.id}
          stream={stream as any}
          message={msg}
          fallback={<div>Loading grid...</div>}
        />
      ))}
    </>
  );
} 