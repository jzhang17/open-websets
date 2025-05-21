"use client";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import React from "react";

// Create a single QueryClient instance
// It's important to create new QueryClient() instance in a client component or
// ensure it's only instantiated once on the client.
// For simplicity here, we create it directly in the client component.
// For SSR scenarios with Next.js App router, if you need to share client across requests
// or prefetch data on server, a more advanced setup might be needed,
// but for client-side rendering and basic usage, this is fine.
const queryClient = new QueryClient();

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
} 