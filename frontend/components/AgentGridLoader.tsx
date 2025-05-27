"use client";

import dynamic from "next/dynamic";
import type { AgentGridProps } from "./AgentGrid";

// Dynamically import the AgentGrid component
const AgentGrid = dynamic<AgentGridProps>(
  () => import("./AgentGrid").then((mod) => mod.default),
  { ssr: false, loading: () => <div>Loading grid...</div> }
);

export default function AgentGridLoader({ threadId }: AgentGridProps) {
  return <AgentGrid threadId={threadId} />;
} 