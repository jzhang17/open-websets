import { useStream, type UseStreamOptions } from "@langchain/langgraph-sdk/react";
import type { Message as LangGraphMessage } from "@langchain/langgraph-sdk"; // Renaming to avoid conflict if you have a local Message type
import { useEffect, useRef, useCallback, useMemo } from "react";
import { useQuery, useQueryClient, type QueryKey, type UseQueryOptions, type UseQueryResult } from '@tanstack/react-query';

// Define the structure of the state your LangGraph agent expects and returns.
// Based on your graph.ts, parentMessages is an array of BaseMessage.
// The Message type from langgraph-sdk should be compatible.
export interface AgentState {
  parentMessages: LangGraphMessage[];
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
  // Add other keys if your agent can update them directly via input
}

export interface UseAgentRunProps {
  threadId: string | null;
  initialInput?: string; // The initial message content to send
  onThreadId?: (threadId: string) => void; // Callback when a new threadId is returned
}

// Renamed original hook: This hook directly manages the LangGraph stream.
function useLangGraphStreamAndSend({
  threadId,
  initialInput,
  onThreadId,
}: UseAgentRunProps) {
  // Construct the full API URL for client-side execution
  let apiUrl = "/api/langgraph";
  if (typeof window !== "undefined") {
    apiUrl = `${window.location.origin}/api/langgraph`;
  }

  const streamHookResult = useStream<AgentState, { UpdateType: AgentUpdate }>({
    apiUrl,
    assistantId: "agent", // assistantId is now hardcoded from here
    threadId: threadId ?? undefined, // useStream expects string | undefined
    messagesKey: "parentMessages", // Crucial: matches your graph's state key for messages
    streamMode: "updates", // Added streamMode
    onThreadId, // Propagate threadId callback to notify when new thread is created
  } as UseStreamOptions<AgentState, { UpdateType: AgentUpdate }>);

  const { submit, messages, isLoading, error, stop } = streamHookResult;
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
    messages: messages ?? [], // Ensure messages is always an array
    isLoading,
    error, // This is Error | undefined from useStream
    send, // Expose the wrapped submit function
    stop,
    // streamHook: streamHookResult, // can be exposed if needed for more advanced scenarios
  };
}

// Type for the data stored in React Query
interface AgentQueryData {
  messages: LangGraphMessage[];
  isLoading: boolean;
  error: Error | null;
}

// Helper function to process stream error into a consistent Error | null type
const processStreamError = (error: unknown): Error | null => {
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
    isLoading: streamIsLoading,
    error: streamError, // This is Error | undefined
    send: streamSend,
    stop: streamStop,
  } = useLangGraphStreamAndSend({ threadId, initialInput, onThreadId });

  // Effect to update React Query cache when the stream's state changes
  useEffect(() => {
    queryClient.setQueryData<AgentQueryData>(queryKey, {
      messages: streamMessages ?? [],
      isLoading: streamIsLoading,
      error: processStreamError(streamError),
    });
  }, [streamMessages, streamIsLoading, streamError, queryClient, queryKey]);

  // Use useQuery to read the synchronized state from the cache.
  const { data, isLoading, error } = useQuery<AgentQueryData, Error, AgentQueryData, QueryKey>({
    queryKey,
    queryFn: async (): Promise<AgentQueryData> => {
      // This queryFn reflects the current state from the underlying stream hook.
      // It's primarily for initial data population if not already in cache or for refetch scenarios.
      return {
        messages: streamMessages ?? [],
        isLoading: streamIsLoading,
        error: processStreamError(streamError),
      };
    },
    // Enable the query if threadId is present (string) or null (for new threads).
    // The underlying useLangGraphStreamAndSend handles null threadId by passing undefined to useStream.
    enabled: true,
    staleTime: Infinity, // Data is "live" from the stream, so never stale in React Query terms.
    gcTime: Infinity, // Keep data in cache as long as components might be interested.
    refetchOnWindowFocus: false,
    refetchOnMount: false, // Data is actively pushed; initialData or queryFn's first run handles mount.
    refetchOnReconnect: false,
    // initialData provides the very first state immediately, making `data` non-undefined from the start.
    initialData: (): AgentQueryData => ({
        messages: streamMessages ?? [],
        isLoading: streamIsLoading,
        error: processStreamError(streamError),
    }),
  });

  // Return the state from React Query and the interaction methods from the stream hook.
  // Since initialData is provided and returns AgentQueryData, `data` is AgentQueryData (not undefined).
  // `isLoading` and `error` are from React Query's own state.
  return {
    messages: data.messages, // data is AgentQueryData here
    isLoading: isLoading, // This is React Query's isLoading
    error: error, // This is React Query's error (Error | null)
    send: streamSend,
    stop: streamStop,
  };
}

// Example of a more specific Message type if you need it:
// export type AppMessage = LangGraphMessage;
// Or extend it:
// export interface AppMessage extends LangGraphMessage {
//   customProperty?: string;
// }
