"use client";

import { useState, useMemo } from "react";
import { Sidebar } from "@/components/sidebar";
import { MessageList, Message } from "@/components/message-list";
import { ChatInput } from "@/components/chat-input";
import { streamChat } from "@/lib/api";

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const sessionId = useMemo(() => `session-${Math.random().toString(36).substring(2, 9)}`, []);

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    // Clear input immediately
    setInputValue("");

    // Add user message
    const userMessage: Message = { role: "user", content };
    setMessages((prev) => [...prev, userMessage]);

    setIsLoading(true);

    // Initial assistant message state
    const assistantMessage: Message = {
      role: "assistant",
      content: "",
      thinking: "Preparing...",
      isThinking: true,
      reasoningSteps: []
    };

    setMessages((prev) => [...prev, assistantMessage]);

    try {
      for await (const event of streamChat(content, sessionId)) {
        setMessages((prev) => {
          const newMessages = [...prev];
          const lastIndex = newMessages.length - 1;
          const lastMsg = { ...newMessages[lastIndex] };

          switch (event.type) {
            case "thinking":
              lastMsg.thinking = event.message;
              lastMsg.isThinking = true;
              break;
            case "agent_step":
              const agentSteps = [...(lastMsg.agentSteps || [])];
              const currentStepIndex = agentSteps.findIndex(s => s.agent === event.agent && s.status === "in_progress");

              if (event.status === "completed") {
                if (currentStepIndex > -1) {
                  agentSteps[currentStepIndex] = {
                    agent: event.agent!,
                    step: event.step!,
                    status: "completed",
                    response: event.response
                  };
                } else {
                  agentSteps.push({
                    agent: event.agent!,
                    step: event.step!,
                    status: "completed",
                    response: event.response
                  });
                }
                lastMsg.isThinking = false;
                lastMsg.thinking = undefined;
              } else {
                // in_progress
                if (currentStepIndex === -1) {
                  agentSteps.push({
                    agent: event.agent!,
                    step: event.step!,
                    status: "in_progress"
                  });
                }
                lastMsg.isThinking = true;
                lastMsg.thinking = `${event.agent}: ${event.step}...`;
              }
              lastMsg.agentSteps = agentSteps;
              break;
            case "reasoning":
              if (event.step) {
                lastMsg.reasoningSteps = [...(lastMsg.reasoningSteps || []), event.step];
              }
              break;
            case "content":
              lastMsg.isThinking = false;
              lastMsg.content += event.chunk;
              break;
            case "metadata":
              // Handle metadata if needed
              break;
            case "done":
              lastMsg.isThinking = false;
              lastMsg.thinking = undefined;
              break;
            case "error":
              lastMsg.content += `\n\n[Error: ${event.message}]`;
              lastMsg.isThinking = false;
              break;
          }

          newMessages[lastIndex] = lastMsg;
          return newMessages;
        });
      }
    } catch (error) {
      console.error("Streaming error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Sidebar />
      <main className="flex-1 flex flex-col h-full bg-background relative overflow-hidden">
        {/* Header - shown on mobile if sidebar is hidden */}
        <div className="md:hidden flex items-center justify-center h-14 border-b border-gray-800">
          <span className="font-semibold text-sm">IxoraGPT</span>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-hidden flex flex-col pt-4 md:pt-0">
          <MessageList
            messages={messages}
            onSelectPrompt={(prompt) => setInputValue(prompt)}
          />
        </div>

        {/* Input Area */}
        <div className="w-full">
          <ChatInput
            value={inputValue}
            onChange={setInputValue}
            onSend={handleSendMessage}
            isLoading={isLoading}
          />
        </div>
      </main>
    </>
  );
}
