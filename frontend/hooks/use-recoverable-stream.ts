import { useEffect, useMemo, useRef } from "react";
import { useStream, type UseStreamOptions, type UseStream } from "@langchain/langgraph-sdk/react";
import { Client } from "@langchain/langgraph-sdk";

export function useRecoverableStream<StateType extends Record<string, unknown> = Record<string, unknown>, Bag extends { [key: string]: unknown } = { }>(
  options: UseStreamOptions<StateType, Bag>,
): UseStream<StateType, Bag> {
  const runInfo = useRef<{ runId?: string }>({});
  const streamRef = useRef<UseStream<StateType, Bag> | null>(null);
  const client = useMemo(() => new Client({ apiUrl: options.apiUrl }), [options.apiUrl]);

  async function reconnect() {
    const runId = runInfo.current.runId;
    const threadId = options.threadId;
    if (!threadId || !runId || !streamRef.current) return;
    try {
      const snap = await client.threads.getState(threadId);
      (streamRef.current as any).mutate?.(() => snap.values as Partial<StateType>);
      for await (const ev of client.runs.joinStream(threadId, runId)) {
        (streamRef.current as any).updateFromEvent?.(ev as any);
      }
    } catch (err) {
      console.error(err);
    }
  }

  const stream = useStream<StateType, Bag>({
    ...options,
    onMetadataEvent: (data) => {
      runInfo.current.runId = (data as any).run_id;
      if (options.threadId && typeof window !== "undefined") {
        try {
          sessionStorage.setItem(`runId:${options.threadId}`, runInfo.current.runId!);
        } catch {
          // ignore storage errors
        }
      }
      options.onMetadataEvent?.(data);
    },
    onError: (err) => {
      reconnect();
      options.onError?.(err);
    },
  });

  streamRef.current = stream;

  useEffect(() => {
    const threadId = options.threadId;
    if (!threadId || typeof window === "undefined") return;
    const storedRunId = sessionStorage.getItem(`runId:${threadId}`);
    if (storedRunId) {
      runInfo.current.runId = storedRunId;
      reconnect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.threadId]);

  return stream;
}
