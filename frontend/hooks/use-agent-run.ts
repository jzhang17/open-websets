import { useStream, type UseStreamOptions } from "@langchain/langgraph-sdk/react";
import type { Message as LangGraphMessage } from "@langchain/langgraph-sdk";
import { useEffect, useRef, useCallback, useMemo, useState } from "react";
import { useQuery, useQueryClient, type QueryKey, type UseQueryOptions, type UseQueryResult } from '@tanstack/react-query';

// Define the structure of the state your LangGraph agent expects and returns.
// Based on your graph.ts, parentMessages is an array of BaseMessage.
// The Message type from langgraph-sdk should be compatible.
export interface AgentState {
  parentMessages: LangGraphMessage[];
  entities?: Array<{
    index: number;
    name: string;
    url: string;
  }>;
  qualificationSummary?: Array<{
    index: number;
    qualified: boolean | null;
    reasoning: string;
  }>;
  qualificationCriteria?: string;
  entityTypes?: string[];
  entitiesToQualify?: Array<{
    index: number;
    name: string;
    url: string;
  }>;
  processedEntityCount?: number;
  finishedBatches?: number;
  listGenMessages?: LangGraphMessage[];
  qualMessages?: LangGraphMessage[];
  [key: string]: unknown; // Index signature to satisfy Record<string, unknown>
}

// Define the structure of the input/update object for the submit function.
// This should align with how you want to update the agent's state.
export interface AgentUpdate {
  parentMessages: LangGraphMessage[] | LangGraphMessage; // Can be a single message or an array
  subgraph?: boolean; // Control whether to run as a subgraph
}

export interface UseAgentRunProps {
  threadId: string | null;
  initialInput?: string; // The initial message content to send
  onThreadId?: (threadId: string) => void; // Callback when a new threadId is returned
}

// Renamed original hook: This hook directly manages the LangGraph stream.
export function useLangGraphStreamAndSend({
  threadId,
  initialInput,
  onThreadId,
}: UseAgentRunProps) {
  // Construct the full API URL for client-side execution
  let apiUrl = "/api/langgraph";
  if (typeof window !== "undefined") {
    if (process.env.NODE_ENV === 'development') {
      apiUrl = "http://localhost:2024";
    } else {
      apiUrl = `${window.location.origin}/api/langgraph`;
    }
  }

  const streamHookResult = useStream<AgentState, { UpdateType: AgentUpdate }>({
    apiUrl,
    assistantId: "agent",
    threadId: threadId ?? undefined,
    messagesKey: "parentMessages",
    // Stream messages for LLM tokens & custom events for lightweight updates
    streamMode: ["messages", "custom"],
    // Merge lightweight custom events (grid updates) into local state
    onCustomEvent: (data: any, { mutate }) => {
      if (!data || typeof data !== "object" || data.type !== "gridUpdate") {
        return;
      }

      mutate((prev: AgentState | undefined): Partial<AgentState> => {
        const newState: Partial<AgentState> = { ...prev };

        if (Array.isArray(data.entities)) {
          newState.entities = data.entities;
        }

        if (Array.isArray(data.qualificationSummary)) {
          const prevSummary = prev?.qualificationSummary ?? [];
          newState.qualificationSummary = [...prevSummary, ...data.qualificationSummary];
        }

        return newState;
      });
    },
    recursionLimit: 50,
    reconnect: true,
    reconnectDelay: 1000,
    onThreadId,
  } as UseStreamOptions<AgentState, { UpdateType: AgentUpdate }>);

  const { submit, messages, isLoading, error, stop, values: stateValues } = streamHookResult;
  const initialInputSentRef = useRef(false);

  useEffect(() => {
    if (
      initialInput &&
      submit &&
      !isLoading &&
      !initialInputSentRef.current
    ) {
      const newHumanMessage: LangGraphMessage = { type: "human", content: initialInput, id: crypto.randomUUID() };
      submit(
        {
          parentMessages: [newHumanMessage],
          subgraph: false,
        },
        {
          optimisticValues: (prev: Readonly<AgentState> | undefined): Partial<AgentState> => {
            const prevMessages = prev?.parentMessages ?? [];
            return { ...prev, parentMessages: [...prevMessages, newHumanMessage] };
          },
        },
      );
      initialInputSentRef.current = true;
    }
  }, [initialInput, submit, isLoading]);

  // Wrapper for submit to ensure it conforms to a simpler input structure if needed by components
  const send = useCallback((content: string) => {
    const newMessage: LangGraphMessage = { type: "human", content, id: crypto.randomUUID() };
    submit(
      { parentMessages: [newMessage] },
      {
        optimisticValues: (prev: Readonly<AgentState> | undefined): Partial<AgentState> => {
          const prevMessages = prev?.parentMessages ?? [];
          return { ...prev, parentMessages: [...prevMessages, newMessage] };
        },
      },
    );
  }, [submit]);

  return {
    messages: messages ?? [],
    isLoading,
    error,
    send,
    stop,
    stream: streamHookResult,
  };
}

// Helper function to process stream error into a consistent Error | null type
export const processStreamError = (error: unknown): Error | null => {
  if (!error) return null;
  if (error instanceof Error) return error;
  // Attempt to create an Error from common error-like object structures
  if (typeof error === 'object' && error !== null) {
    if ('message' in error && typeof (error as { message: unknown }).message === 'string') {
      return new Error((error as { message: string }).message);
    }
    return new Error(JSON.stringify(error)); // Fallback for other objects
  }
  if (typeof error === 'string') return new Error(error);
  return new Error('An unknown error occurred');
};

// Simplified useAgentRun hook that directly returns the stream hook
export function useAgentRun(props: UseAgentRunProps) {
  // For now, just directly return the stream hook to test if React Query was the issue
  const streamHook = useLangGraphStreamAndSend(props);
  
  return {
    messages: streamHook.messages,
    isLoading: streamHook.isLoading,
    error: processStreamError(streamHook.error),
    send: streamHook.send,
    stop: streamHook.stop,
    stream: streamHook.stream,
  };
}

// Legacy React Query version (commented out for now)
/*
// Type for the data stored in React Query
interface AgentQueryData {
  messages: LangGraphMessage[];
  ui: any[];
  isLoading: boolean;
  error: Error | null;
}

// New useAgentRun hook wrapped with React Query
export function useAgentRunWithReactQuery(props: UseAgentRunProps) {
  const { threadId, initialInput, onThreadId } = props;
  const queryClient = useQueryClient();

  // Define a stable query key based on threadId
  const queryKey = useMemo<QueryKey>(() => ['agentRun', threadId], [threadId]);

  // Use the stream hook directly and manage state reactivity through React state
  const streamHook = useLangGraphStreamAndSend({ threadId, initialInput, onThreadId });
  
  // Track stream values changes to trigger React re-renders
  const [streamValuesHash, setStreamValuesHash] = useState(0);
  
  // Update hash when stream values change to force React Query update
  useEffect(() => {
    // Create a simple hash of the stream values to detect changes
    const currentState = streamHook.stream.values;
    const newHash = JSON.stringify(currentState).length + (currentState?.ui?.length ?? 0);
    setStreamValuesHash(newHash);
  }, [streamHook.stream.values]);

  // Keep React Query's cache in sync with the stream state
  useEffect(() => {
    const currentStreamState = (streamHook.stream.values ?? {}) as AgentState;

    const newDataToCache: AgentQueryData = {
      messages: (currentStreamState.parentMessages ?? []) as LangGraphMessage[],
      ui: currentStreamState.ui ?? [],
      isLoading: streamHook.isLoading,
      error: processStreamError(streamHook.error),
    };
    
    queryClient.setQueryData<AgentQueryData>(queryKey, newDataToCache);

  }, [streamValuesHash, streamHook.isLoading, streamHook.error, queryClient, queryKey, streamHook.stream.values]);

  // Use useQuery to read the synchronized state from the cache.
  const { data } = useQuery<AgentQueryData, Error, AgentQueryData, QueryKey>({
    queryKey,
    queryFn: async (): Promise<AgentQueryData> => {
      const currentStreamState = (streamHook.stream.values ?? {}) as AgentState;
      return {
        messages: (currentStreamState.parentMessages ?? []) as LangGraphMessage[],
        ui: currentStreamState.ui ?? [],
        isLoading: streamHook.isLoading,
        error: processStreamError(streamHook.error),
      };
    },
    enabled: true,
    staleTime: 0, // Always consider stale to ensure reactivity
    gcTime: Infinity, 
    refetchOnWindowFocus: false,
    refetchOnMount: false, 
    refetchOnReconnect: false,
    initialData: (): AgentQueryData => {
        const initialStreamState = (streamHook.stream.values ?? {}) as AgentState;
        return {
            messages: (initialStreamState.parentMessages ?? []) as LangGraphMessage[],
            ui: initialStreamState.ui ?? [],
            isLoading: streamHook.isLoading,
            error: processStreamError(streamHook.error),
        };
    },
  });

  // Return the state from React Query and the interaction methods from the stream hook.
  return {
    messages: data?.messages ?? [],
    ui: data?.ui ?? [],
    isLoading: data?.isLoading ?? streamHook.isLoading,
    error: data?.error ?? processStreamError(streamHook.error),
    send: streamHook.send,
    stop: streamHook.stop,
    stream: streamHook.stream,
  };
}
*/

// Example of a more specific Message type if you need it:
// export type AppMessage = LangGraphMessage;
// Or extend it:
// export interface AppMessage extends LangGraphMessage {
//   customProperty?: string;
// }
