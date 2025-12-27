"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { User, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export interface AgentStep {
    agent: string;
    step: string;
    status: "in_progress" | "completed";
    response?: string;
}

export interface Message {
    role: "user" | "assistant";
    content: string;
    thinking?: string;
    reasoningSteps?: string[];
    agentSteps?: AgentStep[];
    isThinking?: boolean;
}

interface MessageListProps {
    messages: Message[];
    onSelectPrompt?: (prompt: string) => void;
}

export function MessageList({ messages, onSelectPrompt }: MessageListProps) {
    if (messages.length === 0) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-4">
                <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                    <Sparkles size={24} className="text-accent" />
                </div>
                <h1 className="text-2xl font-semibold mb-8">What can I help with?</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl px-4">
                    {[
                        "Summarize the onboarding process",
                        "Summarize the steps for requesting hardware approval",
                        "How many steps require manager approval",
                        "Which documents should I review before submitting a request?"
                    ].map((prompt) => (
                        <button
                            key={prompt}
                            onClick={() => onSelectPrompt?.(prompt)}
                            className="p-4 border border-gray-700 rounded-2xl text-left hover:bg-gray-800 transition-colors text-sm text-gray-300"
                        >
                            {prompt}
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto w-full">
            <div className="max-w-3xl mx-auto py-8">
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={cn(
                            "group px-4 py-8 flex gap-4 md:gap-6",
                            message.role === "assistant" ? "bg-transparent" : "bg-transparent"
                        )}
                    >
                        <div className="shrink-0 pt-0.5">
                            {message.role === "assistant" ? (
                                <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white">
                                    <Sparkles size={16} />
                                </div>
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white">
                                    <User size={16} />
                                </div>
                            )}
                        </div>
                        <div className="flex-1 space-y-2 overflow-hidden">
                            <div className="font-bold text-sm">
                                {message.role === "assistant" ? "Assistant" : "You"}
                            </div>

                            {message.role === "assistant" && (message.thinking || message.isThinking) && !message.content && (
                                <div className="text-sm text-gray-400 italic flex items-center gap-2 animate-pulse mb-2">
                                    <Sparkles size={12} className="animate-spin" />
                                    {message.thinking || "Thinking..."}
                                </div>
                            )}

                            {message.role === "assistant" && ((message.reasoningSteps && message.reasoningSteps.length > 0) || (message.agentSteps && message.agentSteps.length > 0)) && (
                                <ReasoningSection steps={message.reasoningSteps} agentSteps={message.agentSteps} />
                            )}

                            <div className="prose prose-invert max-w-none text-gray-200 leading-relaxed whitespace-pre-wrap break-words">
                                {message.role === "assistant" ? (
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {message.content}
                                    </ReactMarkdown>
                                ) : (
                                    message.content
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function ReasoningSection({ steps, agentSteps }: { steps?: string[], agentSteps?: AgentStep[] }) {
    const [isExpanded, setIsExpanded] = useState(true);
    const totalSteps = (steps?.length || 0) + (agentSteps?.length || 0);

    return (
        <div className="bg-gray-800/30 rounded-lg border border-gray-700/50 mb-3 overflow-hidden">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between p-3 hover:bg-gray-700/20 transition-colors"
            >
                <div className="flex items-center gap-2">
                    <div className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Process Log</div>
                    <span className="text-[10px] bg-gray-700/50 px-1.5 rounded text-gray-400">{totalSteps} activities</span>
                </div>
                {isExpanded ? <ChevronUp size={14} className="text-gray-500" /> : <ChevronDown size={14} className="text-gray-500" />}
            </button>

            {isExpanded && (
                <div className="px-3 pb-3 pt-1 border-t border-gray-700/30">
                    <ul className="space-y-3">
                        {agentSteps?.map((step, i) => (
                            <li key={`agent-${i}`} className="text-xs space-y-1">
                                <div className="flex items-center gap-2">
                                    <span className={cn(
                                        "w-1.5 h-1.5 rounded-full shrink-0",
                                        step.status === "completed" ? "bg-green-500" : "bg-accent animate-pulse"
                                    )} />
                                    <span className="font-bold text-gray-400">[{step.agent}]</span>
                                    <span className="text-gray-200">{step.step}</span>
                                </div>
                                {step.response && (
                                    <div className="ml-3.5 pl-3 border-l border-gray-700 text-gray-400 italic py-0.5">
                                        {step.response}
                                    </div>
                                )}
                            </li>
                        ))}
                        {steps?.map((step, i) => (
                            <li key={`reasoning-${i}`} className="text-xs text-gray-300 flex gap-2 leading-relaxed">
                                <span className="text-accent mt-0.5 shrink-0">•</span>
                                <span>{step}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
