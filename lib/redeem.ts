import { db } from "@/lib/db";
import { redeemCodes } from "@/lib/db/schema";

const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const CODE_LENGTH = 8;
const EXPIRY_DAYS = 7;

function generateCode(): string {
  let code = "PR-";
  for (let i = 0; i < CODE_LENGTH; i++) {
    code += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
  }
  return code;
}

export interface IssueRedeemCodeArgs {
  rewardType: string;
  source: string;
  campaign?: string;
  leadId?: string;
  issuedToEmail?: string;
  expiryDays?: number;
}

export async function issueRedeemCode(
  args: IssueRedeemCodeArgs
): Promise<{ code: string; expiresAt: string }> {
  const { rewardType, source, campaign, leadId, issuedToEmail, expiryDays = EXPIRY_DAYS } = args;

  const expiresDate = new Date();
  expiresDate.setDate(expiresDate.getDate() + expiryDays);
  const expiresAt = expiresDate.toISOString().replace("T", " ").slice(0, 19);

  let code = generateCode();
  // Retry on collision (extremely unlikely but safe)
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      await db.insert(redeemCodes).values({
        code,
        reward_type: rewardType,
        source,
        campaign: campaign ?? null,
        lead_id: leadId ?? null,
        issued_to_email: issuedToEmail ?? null,
        expires_at: expiresAt,
      });
      return { code, expiresAt };
    } catch {
      code = generateCode();
    }
  }

  throw new Error("Failed to generate unique redeem code after 5 attempts");
}
