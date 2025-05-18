"use client";

import { use } from "react";
import { ChatSidebar } from "@/components/ChatSidebar"; // Import the new component

export default function UuidPage({
  params,
}: {
  params: Promise<{ uuid: string }>; 
}) {
  const resolvedParams = use(params); 
  const { uuid } = resolvedParams;

  return (
    <div className="flex h-screen">
      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-10 bg-white">
        <div className="shadow-lg rounded-lg p-6 sm:p-10 max-w-md w-full">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6">
            Item Details
          </h1>
          <div className="space-y-4 text-left">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-500">
                ID (UUID):
              </span>
              <code className="p-2 text-sm bg-gray-100 text-gray-700 rounded-md break-all">
                {uuid}
              </code>
            </div>
          </div>
          <div className="mt-8 text-sm text-gray-500">
            <p>
              This page displays the generated UUID. Further actions or
              navigation can be implemented here based on your application&apos;s
              logic.
            </p>
          </div>
        </div>
      </main>

      {/* Sidebar (now a separate component) */}
      <ChatSidebar uuid={uuid} />
    </div>
  );
} 