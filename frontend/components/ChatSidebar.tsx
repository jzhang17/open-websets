"use client";

import { useState } from "react";
import { MessageInput } from "@/components/ui/message-input";
import { MessageList } from "@/components/ui/message-list";
import { SidebarToggle } from "@/components/ui/sidebar-toggle";

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
}

export function ChatSidebar({ uuid }: ChatSidebarProps) {
  const [isOpen, setIsOpen] = useState(true); // Sidebar is open by default
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", role: "assistant", content: "Hello! How can I help you today?" },
    { id: "2", role: "user", content: "I need information about this UUID." },
    { id: "3", role: "assistant", content: `Certainly! The UUID is ${uuid}.` },
  ]);
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

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
        className={`flex flex-col bg-gray-50 h-screen transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? "w-96 p-4 border-l" : "w-0 p-0 border-transparent" // Animate width, padding, and border visibility
        }`}
      >
        {/* Content is now always mounted but display is controlled, to avoid remounting issues */}
        <div className={`${isOpen ? 'flex' : 'hidden'} flex-col flex-grow min-h-0`}>
          <div className="border-b flex justify-between items-center pb-4 mb-4"> {/* Adjusted padding */}
            <h2 className="text-xl font-semibold">Chat</h2>
            <SidebarToggle
              isOpen={isOpen}
              toggle={toggleSidebar}
            />
          </div>
          <div className="flex-grow overflow-y-auto min-h-0"> {/* Added min-h-0 */}
            <MessageList messages={messages} isTyping={isGenerating} />
          </div>
          <div className="border-t pt-4 mt-4"> {/* Adjusted padding */}
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

      {/* Replaced old fixed button with SidebarToggle, shown when sidebar is closed */}
      {!isOpen && (
        <SidebarToggle
          isOpen={isOpen}
          toggle={toggleSidebar}
          className="fixed top-4 right-4 z-50"
        />
      )}
    </>
  );
} 