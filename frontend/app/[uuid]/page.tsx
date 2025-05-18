"use client";

import { use, useState } from "react";
import { ChatSidebar } from "@/components/ChatSidebar";
import { AppHeader } from "@/components/AppHeader";
import { SidebarToggle } from "@/components/ui/sidebar-toggle";

export default function UuidPage({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const resolvedParams = use(params);
  const { uuid } = resolvedParams;
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

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
              <SidebarToggle
                isOpen={isSidebarOpen}
                toggle={toggleSidebar}
              />
            ) : undefined
          }
        />
      </div>

      <div className="flex flex-1 pt-16">
        <main
          className={`flex-1 flex flex-col items-center justify-center p-4 sm:p-10 bg-background overflow-y-auto transition-all duration-300 ease-in-out ${isSidebarOpen ? 'mr-[24rem]' : 'mr-0'}`}
        >
          <div className="shadow-lg rounded-lg p-6 sm:p-10 max-w-md w-full bg-card text-card-foreground">
            <h1 className="text-3xl sm:text-4xl font-bold mb-6">
              Item Details
            </h1>
            <div className="space-y-4 text-left">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-muted-foreground">
                  ID (UUID):
                </span>
                <code className="p-2 text-sm bg-muted text-muted-foreground rounded-md break-all">
                  {uuid}
                </code>
              </div>
            </div>
            <div className="mt-8 text-sm text-muted-foreground">
              <p>
                This page displays the generated UUID. Further actions or
                navigation can be implemented here based on your application&apos;s
                logic.
              </p>
            </div>
          </div>
        </main>
      </div>

      <ChatSidebar uuid={uuid} isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
    </div>
  );
} 