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

// ─── Daily MCQ (LINE) ───────────────────────────────────────────────────────

/** Loose shape so this file doesn't need to import from lib/daily-mcq-line.ts (which imports builders from here). */
export interface QuestionLike {
  id: string;
  scenario: string;
  choices: { label: string; text: string }[];
  correct_answer: string;
  explanation: string | null;
  difficulty: string;
}

function truncate(text: string, max: number): string {
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

function answerPostbackData(
  question: QuestionLike,
  date: string,
  category: string,
  isHard: boolean,
  label: string
): string {
  const params = new URLSearchParams({
    action: "daily_answer",
    d: date,
    c: category,
    q: question.id,
    h: isHard ? "1" : "0",
    a: label,
  });
  return params.toString();
}

export function buildDailyMcqFlex(
  question: QuestionLike,
  date: string,
  category: string,
  isHard = false
): LineMessage {
  return {
    type: "flex",
    altText: isHard ? "ข้อสอบยากประจำสัปดาห์ 🔥" : "ข้อสอบประจำวัน PharmRoo 📝",
    contents: {
      type: "bubble",
      size: "mega",
      header: {
        type: "box",
        layout: "vertical",
        backgroundColor: isHard ? DANGER_COLOR : BRAND_COLOR,
        paddingAll: "lg",
        contents: [
          {
            type: "text",
            text: isHard ? "🔥 ข้อสอบยากประจำสัปดาห์" : "📝 ข้อสอบประจำวัน",
            color: "#FFFFFF",
            weight: "bold",
            size: "md",
          },
        ],
      },
      body: {
        type: "box",
        layout: "vertical",
        spacing: "md",
        paddingAll: "lg",
        contents: [
          { type: "text", text: truncate(question.scenario, 300), size: "sm", color: "#333333", wrap: true },
        ],
      },
      footer: {
        type: "box",
        layout: "vertical",
        spacing: "sm",
        paddingAll: "md",
        contents: question.choices.map((choice) => ({
          type: "button" as const,
          style: "secondary" as const,
          action: {
            type: "postback" as const,
            label: `${choice.label}. ${truncate(choice.text, 30)}`,
            data: answerPostbackData(question, date, category, isHard, choice.label),
            displayText: `ตอบข้อ ${choice.label}`,
          },
        })),
      },
    },
  };
}

export function buildDailyMcqResultFlex(
  question: QuestionLike,
  selectedLabel: string,
  isCorrect: boolean
): LineMessage {
  const correctChoice = question.choices.find((c) => c.label === question.correct_answer);
  return {
    type: "flex",
    altText: isCorrect ? "✅ ตอบถูกต้อง!" : "❌ ตอบผิด",
    contents: {
      type: "bubble",
      size: "kilo",
      header: {
        type: "box",
        layout: "vertical",
        backgroundColor: isCorrect ? BRAND_COLOR : DANGER_COLOR,
        paddingAll: "lg",
        contents: [
          {
            type: "text",
            text: isCorrect ? "✅ ตอบถูกต้อง!" : `❌ ตอบผิด (คุณเลือก ${selectedLabel})`,
            color: "#FFFFFF",
            weight: "bold",
            size: "md",
            wrap: true,
          },
        ],
      },
      body: {
        type: "box",
        layout: "vertical",
        spacing: "md",
        paddingAll: "lg",
        contents: [
          statRow("เฉลย", `${question.correct_answer}. ${truncate(correctChoice?.text ?? "", 60)}`),
          ...(question.explanation
            ? [
                { type: "separator" as const, margin: "md" as const },
                {
                  type: "text" as const,
                  text: truncate(question.explanation, 250),
                  size: "xs" as const,
                  color: "#666666",
                  wrap: true,
                  margin: "md" as const,
                },
              ]
            : []),
        ],
      },
      footer: footerButton("ฝึกทำข้อสอบเพิ่ม", `${siteUrl()}/ple/practice`),
    },
  };
}

export interface StreakNudgeData {
  userName: string;
  daysSinceLastAttempt: number;
}

export function buildStreakNudgeFlex(data: StreakNudgeData): LineMessage {
  return {
    type: "flex",
    altText: "คิดถึงจัง! กลับมาฝึกข้อสอบกันเถอะ 👋",
    contents: {
      type: "bubble",
      size: "kilo",
      header: {
        type: "box",
        layout: "vertical",
        backgroundColor: WARN_COLOR,
        paddingAll: "lg",
        contents: [
          { type: "text", text: "👋 คิดถึงจัง!", color: "#FFFFFF", weight: "bold", size: "lg" },
        ],
      },
      body: {
        type: "box",
        layout: "vertical",
        spacing: "md",
        paddingAll: "lg",
        contents: [
          {
            type: "text",
            text: `ไม่ได้ทำข้อสอบมา ${data.daysSinceLastAttempt} วันแล้วนะ กลับมาฝึกต่อกันเถอะ!`,
            size: "sm",
            color: "#333333",
            wrap: true,
          },
        ],
      },
      footer: footerButton("กลับไปฝึกทำข้อสอบ", `${siteUrl()}/ple/practice`),
    },
  };
}

// ─── Chatbot CTA cards ──────────────────────────────────────────────────────

const CHATBOT_CARD_COPY: Record<string, { title: string; body: string; buttonLabel: string; path: string }> = {
  pricing: {
    title: "💳 ดูแพ็กเกจ PharmRoo",
    body: "รายเดือน ฿249 หรือรายปี ฿1,490 ดูเฉลยละเอียดได้ไม่อั้นทุกข้อ",
    buttonLabel: "ดูแพ็กเกจ",
    path: "/pricing",
  },
  register: {
    title: "🎉 สมัคร PharmRoo ฟรี",
    body: "สมัครฟรี 30 วินาที เริ่มฝึกข้อสอบได้ทันที",
    buttonLabel: "สมัครเลย",
    path: "/register",
  },
  practice: {
    title: "📝 เริ่มฝึกข้อสอบ",
    body: "ฝึกข้อสอบ PLE/NLE พร้อมเฉลยและ AI ช่วยอธิบาย",
    buttonLabel: "ฝึกข้อสอบ",
    path: "/ple/practice",
  },
};

export function buildChatbotCard(card: "pricing" | "register" | "practice"): LineMessage {
  const copy = CHATBOT_CARD_COPY[card];
  return {
    type: "flex",
    altText: copy.title,
    contents: {
      type: "bubble",
      size: "kilo",
      body: {
        type: "box",
        layout: "vertical",
        spacing: "md",
        paddingAll: "lg",
        contents: [
          { type: "text", text: copy.title, weight: "bold", size: "md", wrap: true },
          { type: "text", text: copy.body, size: "sm", color: "#666666", wrap: true },
        ],
      },
      footer: footerButton(copy.buttonLabel, `${siteUrl()}${copy.path}`),
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
