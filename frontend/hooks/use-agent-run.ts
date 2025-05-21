import { useStream, type UseStreamOptions } from "@langchain/langgraph-sdk/react";
import type { Message as LangGraphMessage, Checkpoint } from "@langchain/langgraph-sdk"; // Renaming to avoid conflict if you have a local Message type
import { useEffect, useRef } from "react";

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
}

export function useAgentRun({
  threadId,
  initialInput,
}: UseAgentRunProps) {
  const apiUrl = "/api/langgraph";

  if (!apiUrl) {
    throw new Error(
      "NEXT_PUBLIC_LANGGRAPH_API_URL is not set in environment variables.",
    );
  }

  // Type for the `configurable` property in submit options, if you were to use it.
  // type AgentConfigurable = Record<string, unknown>; 
  // Type for the `interrupt` value, if you were to use interrupts.
  // type AgentInterrupt = unknown;
  // Type for custom events, if you were to use them.
  // type AgentCustomEvent = unknown;

  const streamHookResult = useStream<AgentState, {
    UpdateType: AgentUpdate;
    // ConfigurableType: AgentConfigurable; // Example if needed
    // InterruptType: AgentInterrupt;       // Example if needed
    // CustomEventType: AgentCustomEvent;   // Example if needed
   }> ({
    apiUrl,
    assistantId: "agent", // assistantId is now hardcoded from here
    threadId: threadId ?? undefined, // useStream expects string | undefined
    messagesKey: "parentMessages", // Crucial: matches your graph's state key for messages
    streamMode: "values", // Added streamMode
  } as UseStreamOptions<AgentState, { UpdateType: AgentUpdate }>) ; // Cast to UseStreamOptions

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
  const send = (content: string) => {
    // Removed threadId check to allow sending initial message to create a new thread
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
  };

  return {
    messages: messages ?? [], // Ensure messages is always an array
    isLoading,
    error,
    send, // Expose the wrapped submit function
    stop,
    // activeThreadId: checkpoint?.thread_id, // Reverted: Removed activeThreadId
    // You can also expose the raw `submit` from useStream if more complex updates are needed:
    // rawSubmit: submit,
    // And other properties like `interrupt`, `getMessagesMetadata`, etc.
    // streamHook: streamHookResult, // to access all properties of useStream
  };
}

// Example of a more specific Message type if you need it:
// export type AppMessage = LangGraphMessage;
// Or extend it:
// export interface AppMessage extends LangGraphMessage {
//   customProperty?: string;
// }
