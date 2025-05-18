"use client";

// import { useState } from "react"; // No longer needed here
import { MessageInput } from "@/components/ui/message-input";
import { MessageList } from "@/components/ui/message-list";
import { SidebarToggle } from "@/components/ui/sidebar-toggle";
import { useState } from "react"; // Keep for messages and input state

// Define the Message interface, matching the one from shadcn-chatbot-kit
interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt?: Date;
  attachments?: File[];
}

interface ChatSidebarProps {
  uuid: string;
  isOpen: boolean;
  toggleSidebar: () => void; // No longer optional
}

export function ChatSidebar({ uuid, isOpen, toggleSidebar }: ChatSidebarProps) {
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", role: "assistant", content: "Hello! How can I help you today?" },
    { id: "2", role: "user", content: "I need information about this UUID." },
    { id: "3", role: "assistant", content: `Certainly! The UUID is ${uuid}.` },
  ]);
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLTextAreaElement> | string
  ) => {
    if (typeof e === "string") {
      setInput(e);
    } else {
      setInput(e.target.value);
    }
  };

  const handleSubmit = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: String(Date.now()),
      role: "user",
      content: input,
      createdAt: new Date(),
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");
    setIsGenerating(true);

    // Simulate assistant response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: String(Date.now() + 1),
        role: "assistant",
        content: `Received your message about: \"${userMessage.content.substring(
          0,
          30
        )}...\"`,
        createdAt: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, assistantMessage]);
      setIsGenerating(false);
    }, 1000);
  };

  return (
    <>
      <aside
        className={`fixed top-0 right-0 flex flex-col bg-sidebar h-screen transition-all duration-300 ease-in-out overflow-hidden z-30 text-sidebar-foreground ${
          isOpen ? "w-96 p-4 border-l border-sidebar-border" : "w-0 p-0 border-transparent"
        }`}
      >
        {/* Content is now always mounted but display is controlled, to avoid remounting issues */}
        <div className={`${isOpen ? 'flex' : 'hidden'} flex-col flex-grow min-h-0`}>
          <div className="border-b border-sidebar-border flex justify-between items-center pb-4 mb-4"> 
            <h2 className="text-lg font-semibold">Chat</h2>
            {/* This toggle is for collapsing the sidebar when it's open */}
            <SidebarToggle
              isOpen={isOpen}
              toggle={toggleSidebar}
            />
          </div>
          <div className="flex-grow overflow-y-auto min-h-0"> 
            <MessageList messages={messages} isTyping={isGenerating} />
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
                placeholder="Type your message..."
              />
            </form>
          </div>
        </div>
      </aside>

      {/* The toggle button for when the sidebar is closed is now handled in UuidPage and passed to AppHeader */}
      {/* {!isOpen && (
        <SidebarToggle
          isOpen={isOpen}
          toggle={toggleSidebar}
          className="fixed top-4 right-4 z-50"
        />
      )} */}
    </>
  );
} 