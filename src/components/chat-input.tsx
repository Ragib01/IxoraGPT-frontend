"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowUp, Paperclip, Plus, Square } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
    value: string;
    onChange: (value: string) => void;
    onSend: (message: string) => void;
    isLoading?: boolean;
}

export function ChatInput({ value, onChange, onSend, isLoading }: ChatInputProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleSend = () => {
        if (value.trim() && !isLoading) {
            onSend(value);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
        }
    }, [value]);

    return (
        <div className="w-full max-w-3xl mx-auto px-4 pb-6 pt-2">
            <div className="relative flex items-end w-full bg-gray-800/50 border border-gray-700 rounded-3xl p-2 pl-4 focus-within:border-gray-500 transition-colors">
                <button className="p-2 text-gray-400 hover:text-gray-200 transition-colors">
                    <Plus size={20} />
                </button>

                <textarea
                    ref={textareaRef}
                    rows={1}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Message IxoraGPT..."
                    className="flex-1 bg-transparent border-none focus:ring-0 resize-none py-3 px-2 text-sm text-gray-200 max-h-[200px] outline-none"
                />

                <div className="flex items-center gap-1 pr-1 pb-1">
                    <button className="p-2 text-gray-400 hover:text-gray-200 transition-colors">
                        <Paperclip size={18} />
                    </button>
                    <button
                        onClick={handleSend}
                        disabled={!value.trim() && !isLoading}
                        className={cn(
                            "p-2 rounded-xl transition-all flex items-center justify-center",
                            (value.trim() || isLoading)
                                ? (isLoading ? "bg-white text-red-500" : "bg-white text-black hover:bg-gray-200")
                                : "bg-gray-700 text-gray-400 cursor-not-allowed"
                        )}
                    >
                        {isLoading ? (
                            <Square size={14} className="fill-current" />
                        ) : (
                            <ArrowUp size={20} />
                        )}
                    </button>
                </div>
            </div>
            <div className="mt-2 text-[11px] text-gray-500 text-center">
                IxoraGPT can make mistakes. Check important info.
            </div>
        </div>
    );
}
