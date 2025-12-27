"use client";

import { useState } from "react";
import { Plus, MessageSquare, User, Settings, LogOut, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatHistoryItem {
    id: string;
    title: string;
}

const mockHistory: ChatHistoryItem[] = [
    { id: "1", title: "Project Brainstorming" },
    { id: "2", title: "Refactoring React Components" },
    { id: "3", title: "Next.js 15 Features" },
    { id: "4", title: "Tailwind CSS v4 Tips" },
];

export function Sidebar() {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <>
            {/* Mobile Menu Toggle */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-md bg-sidebar text-sidebar-foreground border border-gray-700"
            >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Sidebar Container */}
            <aside
                className={cn(
                    "bg-sidebar text-sidebar-foreground w-[260px] h-full flex flex-col transition-all duration-300 ease-in-out absolute md:relative z-40 border-r border-gray-800",
                    !isOpen && "-translate-x-full md:translate-x-0 md:w-0 overflow-hidden"
                )}
            >
                <div className="flex flex-col h-full p-3">
                    {/* New Chat Button */}
                    <button className="flex items-center gap-3 px-3 py-3 w-full border border-gray-700 rounded-md hover:bg-gray-800 transition-colors text-sm font-medium mb-4">
                        <Plus size={16} />
                        <span>New Chat</span>
                    </button>

                    {/* History List */}
                    <div className="flex-1 overflow-y-auto space-y-1 -mx-1 px-1">
                        <div className="text-[11px] font-bold text-gray-500 px-3 py-2 uppercase tracking-wider">
                            Recent
                        </div>
                        {mockHistory.map((chat) => (
                            <button
                                key={chat.id}
                                className="flex items-center gap-3 px-3 py-3 w-full rounded-md hover:bg-gray-800 transition-colors text-sm text-gray-300 group"
                            >
                                <MessageSquare size={16} className="text-gray-500 shrink-0" />
                                <span className="truncate text-left">{chat.title}</span>
                            </button>
                        ))}
                    </div>

                    {/* Footer / User Section */}
                    <div className="mt-auto pt-2 border-t border-gray-800 space-y-1">
                        <button className="flex items-center gap-3 px-3 py-3 w-full rounded-md hover:bg-gray-800 transition-colors text-sm text-gray-300">
                            <User size={16} className="shrink-0" />
                            <span>Upgrade Plan</span>
                        </button>
                        <button className="flex items-center gap-3 px-3 py-3 w-full rounded-md hover:bg-gray-800 transition-colors text-sm text-gray-300">
                            <Settings size={16} className="shrink-0" />
                            <span>Settings</span>
                        </button>
                        <div className="pt-2">
                            <button className="flex items-center gap-3 px-3 py-4 w-full rounded-md hover:bg-gray-800 transition-colors text-sm font-medium group">
                                <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white text-[12px]">
                                    JD
                                </div>
                                <div className="flex-1 text-left truncate">
                                    <div className="truncate">John Doe</div>
                                </div>
                                <LogOut size={16} className="text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
