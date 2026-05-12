import { NextRequest, NextResponse } from "next/server";
import { streamChatbotReply } from "@/lib/chatbot";
import { handleBotIntent, handleEmailCapture } from "@/lib/bot-intent";
import { db } from "@/lib/db";
import { chatMessages } from "@/lib/db/schema";
import { eq, and, gte, sql } from "drizzle-orm";

export const runtime = "nodejs";
export const maxDuration = 60;

const RATE_LIMIT = 30;
const RATE_WINDOW_MS = 60 * 60 * 1000;

async function checkRateLimit(channelUserId: string): Promise<boolean> {
  const windowStart = new Date(Date.now() - RATE_WINDOW_MS)
    .toISOString()
    .replace("T", " ")
    .slice(0, 19);

  const count = await db
    .select({ count: sql<number>`count(*)` })
    .from(chatMessages)
    .where(
      and(
        eq(chatMessages.channel, "web"),
        eq(chatMessages.channel_user_id, channelUserId),
        eq(chatMessages.role, "user"),
        gte(chatMessages.created_at, windowStart)
      )
    )
    .then((r) => r[0]?.count ?? 0);

  return count < RATE_LIMIT;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      message: string;
      sessionId: string;
      userId?: string;
      leadId?: string;
    };

    const { message, sessionId, userId, leadId } = body;

    if (!message?.trim() || !sessionId) {
      return NextResponse.json({ error: "missing_params" }, { status: 400 });
    }

    if (!(await checkRateLimit(sessionId))) {
      return NextResponse.json({ error: "rate_limited" }, { status: 429 });
    }

    // Handle email capture
    if (leadId) {
      await handleEmailCapture(leadId, message).catch(() => {});
    }

    const stream = await streamChatbotReply(message, "web", sessionId, {
      userId,
      leadId,
    });

    // Collect full text for intent detection (tee the stream)
    let fullText = "";
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const responseStream = new ReadableStream<Uint8Array>({
      async start(controller) {
        const reader = stream.getReader();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          fullText += chunk;
          controller.enqueue(value);
        }

        // Detect intent after streaming finishes
        if (leadId && fullText.includes("[INTENT:trial]")) {
          handleBotIntent(leadId, "trial", "web").catch(() => {});
        }

        controller.close();
      },
    });

    return new Response(responseStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    console.error("[/api/chat]", err);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}
