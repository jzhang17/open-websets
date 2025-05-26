"use client";

import dynamic from "next/dynamic";
import type { AgentGridProps } from "./AgentGrid";

// Dynamically import the AgentGrid component with optimized loading
const AgentGrid = dynamic<AgentGridProps>(
  () => import("./AgentGrid").then((mod) => mod.default),
  { 
    ssr: false, 
    loading: () => (
      <div className="w-full h-full flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading grid...</div>
      </div>
    )
  }
);

export default function AgentGridLoader({ threadId }: AgentGridProps) {
  return <AgentGrid threadId={threadId} />;
} 