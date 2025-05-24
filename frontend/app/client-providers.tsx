"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { AgentRunProvider } from "./providers/agent-run-provider";
import React, { useEffect } from "react";

// Single QueryClient instance for all client-side React Query usage
const queryClient = new QueryClient();

export function ClientProviders({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };
    setVH();
    window.addEventListener("resize", setVH);
    return () => window.removeEventListener("resize", setVH);
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <AgentRunProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider delayDuration={0}>
            {children}
            <Toaster />
          </TooltipProvider>
        </ThemeProvider>
      </AgentRunProvider>
    </QueryClientProvider>
  );
}
