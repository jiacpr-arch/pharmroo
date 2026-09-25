"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Loader2, MessageCircle, Shield } from "lucide-react";

interface ChatRow {
  id: string;
  channel_user_id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
  lead_id: string | null;
  lead_email: string | null;
  lead_stage: string | null;
}

const stageLabels: Record<string, string> = {
  new: "ใหม่",
  interested: "สนใจ",
  trial_granted: "ได้สิทธิ์ทดลอง",
  registered: "สมัครแล้ว",
};

export default function AdminChatbotPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [rows, setRows] = useState<ChatRow[]>([]);
  const [loading, setLoading] = useState(true);

  const user = session?.user as { role?: string } | undefined;
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (!isAdmin) return;
    fetch("/api/admin/chatbot")
      .then((r) => r.json())
      .then((data) => {
        setRows(data);
        setLoading(false);
      });
  }, [isAdmin]);

  const conversations = useMemo(() => {
    const byUser = new Map<string, ChatRow[]>();
    for (const row of rows) {
      const list = byUser.get(row.channel_user_id) ?? [];
      list.push(row);
      byUser.set(row.channel_user_id, list);
    }
    return Array.from(byUser.entries()).map(([channelUserId, messages]) => ({
      channelUserId,
      messages: messages.slice().reverse(), // oldest first within a conversation
      lastAt: messages[0]?.created_at,
      leadEmail: messages.find((m) => m.lead_email)?.lead_email ?? null,
      leadStage: messages.find((m) => m.lead_stage)?.lead_stage ?? "new",
    }));
  }, [rows]);

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-brand" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h1 className="text-2xl font-bold">ไม่มีสิทธิ์เข้าถึง</h1>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center gap-2">
        <MessageCircle className="h-6 w-6 text-brand" />
        <h1 className="text-2xl font-bold">แชท LINE Chatbot</h1>
        <Badge variant="secondary">{conversations.length} บทสนทนา</Badge>
      </div>

      {conversations.length === 0 && (
        <p className="text-muted-foreground">ยังไม่มีบทสนทนา</p>
      )}

      <div className="space-y-4">
        {conversations.map((conv) => (
          <Card key={conv.channelUserId}>
            <CardHeader className="flex flex-row items-center justify-between gap-2">
              <div className="text-sm font-mono text-muted-foreground truncate">
                {conv.channelUserId}
              </div>
              <div className="flex items-center gap-2">
                {conv.leadEmail && <Badge variant="outline">{conv.leadEmail}</Badge>}
                <Badge>{stageLabels[conv.leadStage ?? "new"] ?? conv.leadStage}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {conv.messages.map((m) => (
                <div
                  key={m.id}
                  className={`rounded-lg px-3 py-2 text-sm max-w-[85%] ${
                    m.role === "user"
                      ? "bg-muted ml-0"
                      : "bg-brand/10 ml-auto text-right"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.content}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{m.created_at}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
