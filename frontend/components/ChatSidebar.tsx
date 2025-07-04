"use client";
import { MessageInput } from "@/components/ui/message-input";
import { MessageList } from "@/components/ui/message-list";
import { SidebarToggle } from "@/components/ui/sidebar-toggle";
import { useState } from "react"; // Keep for input state
import { useAgentRunCtx } from "@/app/providers/agent-run-provider";

interface ChatSidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export function ChatSidebar({
  isOpen,
  toggleSidebar,
}: ChatSidebarProps) {
  const {
    messages: agentMessages,
    isLoading: isGenerating,
    send: sendToAgent,
    stop: stopAgent,
  } = useAgentRunCtx();
  const [input, setInput] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLTextAreaElement> | string,
  ) => {
    if (typeof e === "string") {
      setInput(e);
    } else {
      setInput(e.target.value);
    }
  };

  const handleSubmit = async () => {
    if (!input.trim() || isGenerating) return;
    sendToAgent(input);
    setInput("");
  };

  return (
    <>
      <aside
        className={`fixed top-0 right-0 flex flex-col bg-sidebar h-screen transition-all duration-300 ease-in-out overflow-hidden z-30 text-sidebar-foreground ${
          isOpen
            ? "w-96 p-4 border-l border-sidebar-border"
            : "w-0 p-0 border-transparent"
        }`}
      >
        {/* Content is now always mounted but display is controlled, to avoid remounting issues */}
        <div
          className={`${isOpen ? "flex" : "hidden"} flex-col flex-grow min-h-0`}
        >
          <div className="border-b border-sidebar-border flex justify-between items-center pb-4 mb-4">
            <h2 className="text-lg font-semibold">Chat</h2>
            {/* This toggle is for collapsing the sidebar when it's open */}
            <SidebarToggle isOpen={isOpen} toggle={toggleSidebar} />
          </div>
          <div className="flex-grow overflow-y-auto min-h-0">
            <MessageList
              messages={agentMessages
                .filter((msg) => msg.type !== "tool") // Filter out tool messages
                .map((msg) => ({
                  id: msg.id!,
                  role: msg.type === "human" ? "user" : "assistant",
                  content: msg.content as unknown as string,
                }))}
              isTyping={isGenerating}
            />
          </div>
          <div className="border-t border-sidebar-border pt-4 mt-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              <MessageInput
                value={input}
                onChange={handleInputChange}
                isGenerating={isGenerating}
                stop={stopAgent}
                placeholder="Type your message..."
              />
            </form>
          </div>
        </div>
      </aside>

      {/* Sidebar toggle when closed is handled in UuidPage */}
    </>
  );
}
