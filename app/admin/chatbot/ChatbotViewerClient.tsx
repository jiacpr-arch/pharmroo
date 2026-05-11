"use client";

import { useState, useMemo } from "react";
import type { ChatMessage } from "@/lib/db/schema";

interface Props {
  messages: ChatMessage[];
}

type Conversation = {
  key: string;
  channel: string;
  channelUserId: string;
  messages: ChatMessage[];
  lastAt: string;
};

export default function ChatbotViewerClient({ messages }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [filterChannel, setFilterChannel] = useState<string>("all");

  const conversations = useMemo<Conversation[]>(() => {
    const map = new Map<string, ChatMessage[]>();
    for (const msg of messages) {
      const key = `${msg.channel}:${msg.channel_user_id}`;
      const existing = map.get(key) ?? [];
      map.set(key, [...existing, msg]);
    }
    return Array.from(map.entries())
      .map(([key, msgs]) => {
        const sorted = [...msgs].sort((a, b) => a.created_at.localeCompare(b.created_at));
        const [channel, ...rest] = key.split(":");
        return {
          key,
          channel,
          channelUserId: rest.join(":"),
          messages: sorted,
          lastAt: sorted[sorted.length - 1]?.created_at ?? "",
        };
      })
      .sort((a, b) => b.lastAt.localeCompare(a.lastAt));
  }, [messages]);

  const filtered = filterChannel === "all"
    ? conversations
    : conversations.filter((c) => c.channel === filterChannel);

  const activeConv = conversations.find((c) => c.key === selected);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-72 border-r border-gray-200 bg-white flex flex-col">
        <div className="p-4 border-b border-gray-100">
          <h1 className="font-bold text-gray-900">Chatbot Conversations</h1>
          <select
            value={filterChannel}
            onChange={(e) => setFilterChannel(e.target.value)}
            className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-1.5 text-sm"
          >
            <option value="all">ทุก channel</option>
            <option value="web">Web</option>
            <option value="line">LINE</option>
            <option value="facebook">Facebook</option>
          </select>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filtered.map((conv) => (
            <button
              key={conv.key}
              onClick={() => setSelected(conv.key)}
              className={`w-full text-left px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors ${selected === conv.key ? "bg-violet-50" : ""}`}
            >
              <div className="flex items-center gap-2">
                <span className="text-xs rounded-full px-2 py-0.5 bg-gray-100 text-gray-600">
                  {conv.channel}
                </span>
                <span className="text-xs text-gray-400 ml-auto">
                  {conv.lastAt.slice(0, 10)}
                </span>
              </div>
              <p className="mt-1 text-xs text-gray-600 truncate">
                {conv.channelUserId.slice(0, 20)}
              </p>
              <p className="text-xs text-gray-400">
                {conv.messages.length} messages
              </p>
            </button>
          ))}
          {filtered.length === 0 && (
            <p className="p-4 text-sm text-gray-400 text-center">ไม่พบ conversation</p>
          )}
        </div>
      </div>

      {/* Chat view */}
      <div className="flex-1 flex flex-col">
        {activeConv ? (
          <>
            <div className="p-4 border-b border-gray-200 bg-white">
              <p className="font-medium text-gray-900">{activeConv.channel} — {activeConv.channelUserId}</p>
              <p className="text-xs text-gray-400">{activeConv.messages.length} messages</p>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {activeConv.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm whitespace-pre-wrap ${
                      msg.role === "user"
                        ? "bg-violet-600 text-white rounded-tr-sm"
                        : "bg-white text-gray-700 shadow-sm rounded-tl-sm border border-gray-100"
                    }`}
                  >
                    {msg.content}
                    <p className={`text-xs mt-1 ${msg.role === "user" ? "text-violet-200" : "text-gray-400"}`}>
                      {msg.created_at.slice(11, 16)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            เลือก conversation เพื่อดูข้อความ
          </div>
        )}
      </div>
    </div>
  );
}
