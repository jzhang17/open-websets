import { useStream, type UseStreamOptions } from "@langchain/langgraph-sdk/react";
import { uiMessageReducer } from "@langchain/langgraph-sdk/react-ui";
import type { Message as LangGraphMessage } from "@langchain/langgraph-sdk";
import { useEffect, useRef, useCallback, useMemo, useState } from "react";
import { useQuery, useQueryClient, type QueryKey, type UseQueryOptions, type UseQueryResult } from '@tanstack/react-query';

// Define the structure of the state your LangGraph agent expects and returns.
// Based on your graph.ts, parentMessages is an array of BaseMessage.
// The Message type from langgraph-sdk should be compatible.
export interface AgentState {
  parentMessages: LangGraphMessage[];
  ui?: any[];
  [key: string]: unknown; // Index signature to satisfy Record<string, unknown>
  // Add other state keys from your ParentAppStateAnnotation if needed for optimistic updates or direct display
  // For example:
  // entities?: any[];
  // qualificationCriteria?: string;
}

// Define the structure of the input/update object for the submit function.
// This should align with how you want to update the agent's state.
export interface AgentUpdate {
  parentMessages: LangGraphMessage[] | LangGraphMessage; // Can be a single message or an array
  ui?: any[] | any;
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
    apiUrl = `${window.location.origin}/api/langgraph`;
  }

  // Track UI state separately since streamHook.values doesn't update properly
  const [currentUIState, setCurrentUIState] = useState<any[]>([]);

  const streamHookResult = useStream<AgentState, { UpdateType: AgentUpdate }>({
    apiUrl,
    assistantId: "agent",
    threadId: threadId ?? undefined,
    messagesKey: "parentMessages",
    // Add custom stream mode to receive UI events
    streamMode: ["updates", "custom"],
    onThreadId,
    onCustomEvent: (event, options) => {
      // Properly handle UI message events
      options.mutate(prev => {
        const prevUiRef = prev?.ui;
        const currentUI = (prev?.ui as any[]) ?? [];
        
        const updatedUI = uiMessageReducer(currentUI, event as any);
        
        const newState = {
          ...prev,
          ui: updatedUI,
        };
        
        // Also update our separate UI state that we'll actually use
        setCurrentUIState(updatedUI);
        
        return newState;
      });
    },
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
    ui: currentUIState, // Use our separate UI state instead of stateValues
    isLoading,
    error,
    send,
    stop,
    stream: streamHookResult,
  };
}

// Type for the data stored in React Query
interface AgentQueryData {
  messages: LangGraphMessage[];
  ui: any[];
  isLoading: boolean;
  error: Error | null;
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

// New useAgentRun hook wrapped with React Query
export function useAgentRun(props: UseAgentRunProps) {
  const { threadId, initialInput, onThreadId } = props;
  const queryClient = useQueryClient();

  // Define a stable query key based on threadId
  const queryKey = useMemo<QueryKey>(() => ['agentRun', threadId], [threadId]);

  // Use the renamed hook to manage the actual stream and interactions.
  // Its state will be synced to React Query's cache.
  const {
    messages: streamMessages,
    ui: streamUI,
    isLoading: streamIsLoading,
    error: streamError,
    send: streamSend,
    stop: streamStop,
    stream: streamHook,
  } = useLangGraphStreamAndSend({ threadId, initialInput, onThreadId });

  // Keep React Query's cache in sync with the *entire* LangGraph state object.
  // We key the effect off `streamHook.values` (which `useStream` guarantees is a new
  // reference whenever any part of the state changes). This guarantees that
  // React Query receives updates even if nested arrays are mutated in-place by
  // the sdk (which would otherwise keep their reference stable).
  useEffect(() => {
    const currentStreamState = (streamHook.values ?? {}) as AgentState;

    const newDataToCache: AgentQueryData = {
      messages: (currentStreamState.parentMessages ?? []) as LangGraphMessage[],
      ui: currentStreamState.ui ?? [],
      isLoading: streamIsLoading,
      error: processStreamError(streamError),
    };
    queryClient.setQueryData<AgentQueryData>(queryKey, newDataToCache);

  }, [streamHook.values, streamIsLoading, streamError, queryClient, queryKey]);

  // Use useQuery to read the synchronized state from the cache.
  const { data, isLoading, error } = useQuery<AgentQueryData, Error, AgentQueryData, QueryKey>({
    queryKey,
    // queryFn will be called by React Query if data is stale or not in cache.
    // It should reflect the latest state from the stream when called.
    queryFn: async (): Promise<AgentQueryData> => {
      const currentStreamState = (streamHook.values ?? {}) as AgentState;
      return {
        messages: (currentStreamState.parentMessages ?? []) as LangGraphMessage[],
        ui: currentStreamState.ui ?? [], // Get UI from the stream for queryFn
        isLoading: streamIsLoading,
        error: processStreamError(streamError),
      };
    },
    enabled: true,
    staleTime: Infinity, 
    gcTime: Infinity, 
    refetchOnWindowFocus: false,
    refetchOnMount: false, 
    refetchOnReconnect: false,
    // initialData is for the very first render before any stream activity or if cache is empty.
    initialData: (): AgentQueryData => {
        const initialStreamState = (streamHook.values ?? {}) as AgentState;
        return {
            messages: (initialStreamState.parentMessages ?? []) as LangGraphMessage[],
            ui: initialStreamState.ui ?? [], // Get UI from the stream for initialData
            isLoading: streamIsLoading, // initial loading state
            error: processStreamError(streamError), // initial error state
        };
    },
  });

  // Return the state from React Query and the interaction methods from the stream hook.
  return {
    messages: data?.messages ?? [], // data can be undefined initially if initialData isn't processed yet
    ui: data?.ui ?? [],             // data can be undefined initially
    isLoading: isLoading,
    error: error,
    send: streamSend,
    stop: streamStop,
    stream: streamHook,
  };
}

// Example of a more specific Message type if you need it:
// export type AppMessage = LangGraphMessage;
// Or extend it:
// export interface AppMessage extends LangGraphMessage {
//   customProperty?: string;
// }
