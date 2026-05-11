import { db } from "@/lib/db";
import { chatMessages } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import ChatbotViewerClient from "./ChatbotViewerClient";

export const dynamic = "force-dynamic";

export default async function AdminChatbotPage() {
  const session = await auth();
  if (session?.user?.role !== "admin") redirect("/");

  const messages = await db
    .select()
    .from(chatMessages)
    .orderBy(desc(chatMessages.created_at))
    .limit(500);

  return <ChatbotViewerClient messages={messages} />;
}
