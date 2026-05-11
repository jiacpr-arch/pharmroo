import { db } from "@/lib/db";
import { leads, redeemCodes } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import LeadPipelineClient from "./LeadPipelineClient";

export const dynamic = "force-dynamic";

export default async function AdminLeadsPage() {
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== "admin") {
    redirect("/");
  }

  const allLeads = await db
    .select()
    .from(leads)
    .orderBy(desc(leads.created_at))
    .limit(200);

  const codes = await db
    .select()
    .from(redeemCodes)
    .where(eq(redeemCodes.redeemed_at, null as unknown as string));

  const codesByLead: Record<string, string> = {};
  for (const c of codes) {
    if (c.lead_id) codesByLead[c.lead_id] = c.code;
  }

  return <LeadPipelineClient leads={allLeads} codesByLead={codesByLead} />;
}
