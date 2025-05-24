"use client";

import { useState, ReactNode } from "react";
import { AppHeader } from "@/components/AppHeader";
import { ChatSidebar } from "@/components/ChatSidebar";
import { SidebarToggle } from "@/components/ui/sidebar-toggle";

interface ClientPageLayoutProps {
  children: ReactNode;
}

export function ClientPageLayout({ children }: ClientPageLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div
      className="flex flex-col h-screen bg-background text-foreground"
      style={{
        height: "100svh",
        minHeight: "100vh",
      }}
    >
      <div
        className={`fixed top-0 left-0 z-40 h-16 transition-all duration-300 ease-in-out bg-background ${
          isSidebarOpen ? "hidden md:block" : ""
        }`}
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
          className={`flex-1 flex flex-col items-center justify-center bg-background overflow-y-auto transition-all duration-300 ease-in-out ${
            isSidebarOpen ? "mr-[24rem]" : "mr-0"
          }`}
        >
          {children}
        </main>
      </div>

      <ChatSidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />
    </div>
  );
}
