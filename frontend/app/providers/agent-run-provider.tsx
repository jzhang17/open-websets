"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import type { Message as LangGraphMessage } from "@langchain/langgraph-sdk";
import { useLangGraphStreamAndSend, processStreamError } from "@/hooks/use-agent-run";

interface AgentRunCtx {
  threadId: string | null;
  messages: LangGraphMessage[];
  isLoading: boolean;
  error: Error | null;
  send: (content: string) => void;
  stop: () => void;
  setThreadId: (id: string | null) => void;
}

const AgentRunContext = createContext<AgentRunCtx | undefined>(undefined);

export function AgentRunProvider({ children }: { children: React.ReactNode }) {
  const params = useParams() as { uuid?: string };
  const slug = params?.uuid;
  const [threadId, setThreadId] = useState<string | null>(slug ?? null);

  useEffect(() => {
    if (slug !== undefined) {
      setThreadId(slug ?? null);
    } else {
      setThreadId(null);
    }
  }, [slug]);

  const { messages, isLoading, error, send, stop } = useLangGraphStreamAndSend({
    threadId,
    onThreadId: setThreadId,
  });

  const value: AgentRunCtx = {
    threadId,
    messages,
    isLoading,
    error: processStreamError(error),
    send,
    stop,
    setThreadId,
  };

  return <AgentRunContext.Provider value={value}>{children}</AgentRunContext.Provider>;
}

export function useAgentRunCtx() {
  const ctx = useContext(AgentRunContext);
  if (!ctx) {
    throw new Error("useAgentRunCtx must be inside AgentRunProvider");
  }
  return ctx;
}

