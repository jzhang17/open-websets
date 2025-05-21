"use client";

import { useState, ReactNode, useEffect, useCallback } from "react";
import { AppHeader } from "@/components/AppHeader";
import { ChatSidebar } from "@/components/ChatSidebar";
import { SidebarToggle } from "@/components/ui/sidebar-toggle";
import { useRouter } from "next/navigation";

interface ClientPageLayoutProps {
  uuid: string;
  children: ReactNode;
}

export function ClientPageLayout({ uuid, children }: ClientPageLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentThreadId, setCurrentThreadId] = useState<string>(uuid);
  const router = useRouter();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    if (uuid !== currentThreadId) {
      setCurrentThreadId(uuid);
    }
  }, [uuid, currentThreadId]);

  const handleNewThreadId = useCallback((newThreadId: string) => {
    if (newThreadId && newThreadId !== currentThreadId) {
      setCurrentThreadId(newThreadId);
      router.replace(`/${newThreadId}`);
    }
  }, [currentThreadId, router]);

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <div
        className="fixed top-0 left-0 z-40 h-16 transition-all duration-300 ease-in-out bg-background"
        style={{
          width: isSidebarOpen ? "calc(100% - 24rem)" : "100%",
        }}
      >
        <AppHeader
          sidebarToggle={
            !isSidebarOpen ? (
              <SidebarToggle isOpen={isSidebarOpen} toggle={toggleSidebar} />
            ) : undefined
          }
        />
      </div>

      <div className="flex flex-1 pt-16">
        <main
          className={`flex-1 flex flex-col items-center justify-center p-4 sm:p-10 bg-background overflow-y-auto transition-all duration-300 ease-in-out ${
            isSidebarOpen ? "mr-[24rem]" : "mr-0"
          }`}
        >
          {children}
        </main>
      </div>

      <ChatSidebar
        uuid={currentThreadId}
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        onNewThreadIdGenerated={handleNewThreadId}
      />
    </div>
  );
}
