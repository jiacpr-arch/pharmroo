import type { LineMessage } from "@/lib/line";

const BRAND_COLOR = "#0D9488";
const BRAND_LIGHT = "#99F6E4";
const WARN_COLOR = "#F39C12";
const DANGER_COLOR = "#E74C3C";

function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.pharmru.com").trim();
}

function statRow(label: string, value: string) {
  return {
    type: "box" as const,
    layout: "horizontal" as const,
    contents: [
      { type: "text" as const, text: label, size: "sm" as const, color: "#666666", flex: 3 },
      {
        type: "text" as const,
        text: value,
        size: "sm" as const,
        color: "#111111",
        weight: "bold" as const,
        flex: 4,
        wrap: true,
      },
    ],
  };
}

function footerButton(label: string, uri: string) {
  return {
    type: "box" as const,
    layout: "vertical" as const,
    paddingAll: "md" as const,
    contents: [
      {
        type: "button" as const,
        style: "primary" as const,
        color: BRAND_COLOR,
        action: { type: "uri" as const, label, uri },
      },
    ],
  };
}

export interface WeeklySummaryData {
  userName: string;
  totalQuestions: number;
  correctCount: number;
  accuracy: number;
}

export function buildWeeklySummaryFlex(data: WeeklySummaryData): LineMessage {
  return {
    type: "flex",
    altText: `สรุปประจำสัปดาห์: ทำ ${data.totalQuestions} ข้อ ถูก ${data.accuracy}%`,
    contents: {
      type: "bubble",
      size: "kilo",
      header: {
        type: "box",
        layout: "vertical",
        backgroundColor: BRAND_COLOR,
        paddingAll: "lg",
        contents: [
          { type: "text", text: "สรุปประจำสัปดาห์", color: "#FFFFFF", weight: "bold", size: "lg" },
          { type: "text", text: "PharmRoo Weekly Report", color: BRAND_LIGHT, size: "xs" },
        ],
      },
      body: {
        type: "box",
        layout: "vertical",
        spacing: "md",
        paddingAll: "lg",
        contents: [
          statRow("สวัสดี", data.userName || "เพื่อน PharmRoo"),
          statRow("ทำทั้งหมด", `${data.totalQuestions} ข้อ`),
          statRow("ถูกต้อง", `${data.correctCount}/${data.totalQuestions} (${data.accuracy}%)`),
        ],
      },
      footer: footerButton("ฝึกทำข้อสอบต่อ", `${siteUrl()}/ple/practice`),
    },
  };
}

export interface ExpiryWarningData {
  daysLeft: number;
  expiresAt: Date;
}

export function buildExpiryWarningMessage(data: ExpiryWarningData): LineMessage {
  const dateStr = data.expiresAt.toLocaleDateString("th-TH", {
    timeZone: "Asia/Bangkok",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const urgent = data.daysLeft <= 3;

  return {
    type: "flex",
    altText: `สมาชิก PharmRoo จะหมดอายุใน ${data.daysLeft} วัน`,
    contents: {
      type: "bubble",
      size: "kilo",
      header: {
        type: "box",
        layout: "vertical",
        backgroundColor: urgent ? DANGER_COLOR : WARN_COLOR,
        paddingAll: "lg",
        contents: [
          {
            type: "text",
            text: urgent ? "⚠️ ใกล้หมดอายุแล้ว!" : "⏰ แจ้งเตือนหมดอายุ",
            color: "#FFFFFF",
            weight: "bold",
            size: "lg",
          },
          { type: "text", text: "PharmRoo Membership", color: "#FDEBD0", size: "xs" },
        ],
      },
      body: {
        type: "box",
        layout: "vertical",
        spacing: "md",
        paddingAll: "lg",
        contents: [
          statRow("หมดอายุ", dateStr),
          statRow("เหลืออีก", `${data.daysLeft} วัน`),
          {
            type: "text",
            text: "ต่ออายุตอนนี้เพื่อไม่พลาดข้อสอบใหม่ทุกวัน!",
            size: "sm",
            color: "#666666",
            wrap: true,
            margin: "md",
          },
        ],
      },
      footer: footerButton("ต่ออายุสมาชิก", `${siteUrl()}/pricing`),
    },
  };
}

export function buildFollowGreetingFlex(bonusMessage?: string): LineMessage {
  const lines = bonusMessage
    ? [bonusMessage]
    : ["ส่งรหัสเชื่อมต่อจากหน้า Profile เพื่อรับแจ้งเตือนผ่าน LINE"];

  return {
    type: "flex",
    altText: "ยินดีต้อนรับสู่ PharmRoo 🎉",
    contents: {
      type: "bubble",
      size: "kilo",
      header: {
        type: "box",
        layout: "vertical",
        backgroundColor: BRAND_COLOR,
        paddingAll: "lg",
        contents: [
          { type: "text", text: "ยินดีต้อนรับสู่ PharmRoo 🎉", color: "#FFFFFF", weight: "bold", size: "md", wrap: true },
        ],
      },
      body: {
        type: "box",
        layout: "vertical",
        spacing: "md",
        paddingAll: "lg",
        contents: lines.map((text) => ({
          type: "text" as const,
          text,
          size: "sm" as const,
          color: "#333333",
          wrap: true,
        })),
      },
      footer: footerButton("เปิด PharmRoo", siteUrl()),
    },
  };
}
