import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { chatMessages, leads } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";

/**
 * Recent LINE chatbot conversations for the admin viewer — one row per
 * message, newest lead activity first, joined with the lead's stage/email
 * so the page can group by conversation.
 */
export async function GET() {
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rows = await db
    .select({
      id: chatMessages.id,
      channel_user_id: chatMessages.channel_user_id,
      role: chatMessages.role,
      content: chatMessages.content,
      created_at: chatMessages.created_at,
      lead_id: chatMessages.lead_id,
      lead_email: leads.email,
      lead_stage: leads.stage,
    })
    .from(chatMessages)
    .leftJoin(leads, eq(chatMessages.lead_id, leads.id))
    .orderBy(desc(chatMessages.created_at))
    .limit(500);

  return NextResponse.json(rows);
}
