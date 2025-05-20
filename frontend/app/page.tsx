"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Building2, BookOpen, Newspaper } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { useAgentRun } from "@/hooks/use-agent-run";

export default function Home() {
  const router = useRouter();

  const [currentThreadId, setCurrentThreadId] = useState<string | null>(null);
  const [currentQueryForSubmit, setCurrentQueryForSubmit] = useState<string | null>(null);
  const [sentQueries, setSentQueries] = useState<Record<string, boolean>>({});

  const assistantId = "agent";

  const {
    messages: agentMessages,
    isLoading: agentIsLoading,
    send: sendToAgent,
    error: agentError,
  } = useAgentRun({
    threadId: currentThreadId,
    assistantId,
    initialInput: undefined,
  });

  useEffect(() => {
    if (agentMessages.length > 0) {
      console.log("Agent messages:", agentMessages);
    }
  }, [agentMessages]);

  useEffect(() => {
    if (agentError) {
      console.error("Agent run error:", agentError);
    }
  }, [agentError]);

  useEffect(() => {
    if (currentThreadId && currentQueryForSubmit && sendToAgent && !sentQueries[currentThreadId] && !agentIsLoading) {
      console.log(`Sending query for thread ${currentThreadId}: ${currentQueryForSubmit}`);
      sendToAgent(currentQueryForSubmit);
      setSentQueries(prev => ({ ...prev, [currentThreadId]: true }));
    }
  }, [currentThreadId, currentQueryForSubmit, sendToAgent, sentQueries, agentIsLoading]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const queryValue = formData.get("query") as string;

    if (!queryValue || !queryValue.trim()) {
      return;
    }

    if (agentIsLoading) {
      return;
    }

    const newUuid = crypto.randomUUID();
    setCurrentQueryForSubmit(queryValue);
    setCurrentThreadId(newUuid);
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <div className="w-full">
        <AppHeader />
      </div>
      <div className="flex items-center justify-center flex-1 w-full px-4 -mt-40">
        <div className="text-center max-w-lg w-full">
          <h1 className="text-2xl font-bold tracking-tight">
            Find your (almost) perfect list
          </h1>

          <Tabs defaultValue="people" className="w-full mt-4">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="people">
                <Users />
                People
              </TabsTrigger>
              <TabsTrigger value="companies">
                <Building2 />
                Companies
              </TabsTrigger>
              <TabsTrigger value="research">
                <BookOpen />
                Papers
              </TabsTrigger>
              <TabsTrigger value="articles">
                <Newspaper />
                Articles
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <form
            onSubmit={handleSubmit}
            className="mt-4 flex flex-col items-center space-y-4"
          >
            <Input
              name="query"
              placeholder="Describe what you're looking for..."
              className="w-full text-lg bg-background border-input"
              multiline={true}
              disabled={agentIsLoading}
              isLoading={agentIsLoading}
            />
          </form>
        </div>
      </div>
    </div>
  );
}
