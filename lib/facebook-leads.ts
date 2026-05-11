import { createHmac, timingSafeEqual } from "crypto";

const GRAPH_API = "https://graph.facebook.com/v24.0";

export function verifyWebhookSignature(
  rawBody: string,
  signatureHeader: string
): boolean {
  const secret = process.env.FACEBOOK_APP_SECRET;
  if (!secret) return false;

  const [algo, hex] = signatureHeader.split("=");
  if (algo !== "sha256" || !hex) return false;

  const expected = createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");

  try {
    return timingSafeEqual(Buffer.from(hex, "hex"), Buffer.from(expected, "hex"));
  } catch {
    return false;
  }
}

export interface LeadgenFieldData {
  name: string;
  values: string[];
}

export interface LeadgenData {
  id: string;
  created_time: string;
  ad_id?: string;
  adset_id?: string;
  campaign_id?: string;
  form_id?: string;
  field_data: LeadgenFieldData[];
}

export async function fetchLeadgenData(
  leadgenId: string,
  pageToken: string
): Promise<LeadgenData> {
  const url = `${GRAPH_API}/${leadgenId}?fields=id,created_time,ad_id,adset_id,campaign_id,form_id,field_data&access_token=${pageToken}`;
  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Graph API error (${res.status}): ${body}`);
  }
  return res.json() as Promise<LeadgenData>;
}

const FIELD_ALIASES: Record<string, string> = {
  // English
  email: "email",
  full_name: "name",
  phone_number: "phone",
  // Thai aliases
  อีเมล: "email",
  "อีเมล์": "email",
  ชื่อ: "name",
  "ชื่อ-นามสกุล": "name",
  ชื่อนามสกุล: "name",
  "เบอร์โทร": "phone",
  "เบอร์โทรศัพท์": "phone",
  "ชั้นปี": "status_year",
  ปีการศึกษา: "status_year",
  "เป้าหมายสอบ": "exam_target",
  "ของรางวัล": "reward_choice",
};

export interface MappedLeadData {
  email?: string;
  name?: string;
  phone?: string;
  status_year?: string;
  exam_target?: string;
  reward_choice?: string;
}

export function mapFieldData(fieldData: LeadgenFieldData[]): MappedLeadData {
  const result: MappedLeadData = {};
  for (const field of fieldData) {
    const key = FIELD_ALIASES[field.name] ?? FIELD_ALIASES[field.name.toLowerCase()];
    const value = field.values[0];
    if (!key || !value) continue;
    (result as Record<string, string>)[key] = value;
  }
  return result;
}

export function rewardForForm(formId: string): string {
  const mapping = process.env.FACEBOOK_LEAD_FORM_REWARDS ?? "";
  for (const pair of mapping.split(",")) {
    const [fid, reward] = pair.trim().split("=");
    if (fid === formId) return reward ?? "monthly_1m";
  }
  return "monthly_1m";
}

export async function resolvePageAccessToken(): Promise<string> {
  return process.env.FACEBOOK_PAGE_TOKEN ?? "";
}
