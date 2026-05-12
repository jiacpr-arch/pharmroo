export type CardType = "pricing" | "register" | "ple" | "nursing";

interface FlexMessage {
  type: "flex";
  altText: string;
  contents: object;
}

const CARD_CONFIGS: Record<
  CardType,
  { title: string; body: string; action: string; url: string; color: string }
> = {
  pricing: {
    title: "แพ็กเกจ PharmRoo",
    body: "รายเดือน ฿249 | รายปี ฿1,490\nข้อสอบ PLE + NLE ไม่จำกัด + AI อธิบาย",
    action: "ดูแพ็กเกจทั้งหมด",
    url: "https://pharmroo.com/pricing",
    color: "#3B82F6",
  },
  register: {
    title: "สมัครฟรีวันนี้",
    body: "ไม่ต้องใส่บัตรเครดิต\nทดลองทำข้อสอบ PLE และ NLE ได้เลย",
    action: "สมัครฟรี",
    url: "https://pharmroo.com/register",
    color: "#10B981",
  },
  ple: {
    title: "ข้อสอบ PLE",
    body: "PLE-PC, PLE-CC1\nเฉลยละเอียด + Step-by-step คำนวณ",
    action: "เริ่มทำข้อสอบ PLE",
    url: "https://pharmroo.com/ple",
    color: "#8B5CF6",
  },
  nursing: {
    title: "ข้อสอบ NLE (พยาบาล)",
    body: "ข้อสอบ NLE ครอบคลุมทุกวิชา\nพร้อม AI อธิบายเพิ่มเติม",
    action: "เริ่มทำข้อสอบ NLE",
    url: "https://pharmroo.com/nursing",
    color: "#EC4899",
  },
};

export function buildChatbotCard(cardType: CardType): FlexMessage {
  const cfg = CARD_CONFIGS[cardType];

  return {
    type: "flex",
    altText: cfg.title,
    contents: {
      type: "bubble",
      body: {
        type: "box",
        layout: "vertical",
        spacing: "md",
        contents: [
          {
            type: "text",
            text: cfg.title,
            weight: "bold",
            size: "lg",
            color: cfg.color,
          },
          {
            type: "text",
            text: cfg.body,
            size: "sm",
            wrap: true,
            color: "#555555",
          },
        ],
      },
      footer: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "button",
            style: "primary",
            color: cfg.color,
            action: {
              type: "uri",
              label: cfg.action,
              uri: cfg.url,
            },
          },
        ],
      },
    },
  };
}

export function buildBlogAnnounceFlex(options: {
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
}): FlexMessage {
  const contents: object = {
    type: "bubble",
    hero: options.imageUrl
      ? {
          type: "image",
          url: options.imageUrl,
          size: "full",
          aspectRatio: "20:13",
          aspectMode: "cover",
        }
      : undefined,
    body: {
      type: "box",
      layout: "vertical",
      spacing: "md",
      contents: [
        {
          type: "text",
          text: "บทความใหม่จาก PharmRoo 💊",
          size: "xs",
          color: "#8B5CF6",
          weight: "bold",
        },
        {
          type: "text",
          text: options.title,
          weight: "bold",
          size: "md",
          wrap: true,
        },
        {
          type: "text",
          text: options.description,
          size: "sm",
          wrap: true,
          color: "#555555",
        },
      ],
    },
    footer: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "button",
          style: "primary",
          color: "#8B5CF6",
          action: {
            type: "uri",
            label: "อ่านบทความ",
            uri: options.url,
          },
        },
      ],
    },
  };

  return {
    type: "flex",
    altText: options.title,
    contents,
  };
}
