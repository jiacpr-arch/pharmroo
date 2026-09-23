// Character registry — เกมร้านยา
//
// ตัวละครทั้งหมดเป็น "ข้อมูล" ไม่ใช่โค้ดเกม:
//   - โจทย์อ้างถึงตัวละครด้วย charId + pose เท่านั้น
//   - รูปจริงวางที่ public/images/game/characters/{charId}/{pose}.webp
//     (+ {pose}_talk.webp สำหรับเฟรมปากอ้า — มีหรือไม่มีก็ได้)
//   - ถ้ายังไม่มีรูปจริง CharacterSprite จะ fallback มาใช้ SVG placeholder
//     ในไฟล์นี้ (วาดเป็น JSX ล้วน ไม่มี innerHTML)
//   - เพิ่มตัวละครใหม่ = เพิ่ม entry ที่นี่ + วางรูปในโฟลเดอร์ ไม่ต้องแตะ engine

import type { ReactElement } from "react";
import type { Pose } from "./types";

export const POSES: Pose[] = ["idle", "talk", "panic", "stern", "happy"];

const OUT = "#0E1322";

interface FaceProps {
  pose: Pose;
  /** เฟรมปากอ้าระหว่างพิมพ์บทพูด (สลับโดย CharacterSprite) */
  mouthOpen?: boolean;
}

export interface GameCharacter {
  name: string;
  role: string;
  plate: [string, string];
  Placeholder: (props: FaceProps) => ReactElement;
}

function Eyes({ pose, x1, x2, y, iris }: { pose: Pose; x1: number; x2: number; y: number; iris: string }) {
  if (pose === "happy") {
    return (
      <>
        <path d={`M${x1 - 9},${y} Q${x1},${y - 9} ${x1 + 9},${y}`} stroke={OUT} strokeWidth="3.4" fill="none" strokeLinecap="round" />
        <path d={`M${x2 - 9},${y} Q${x2},${y - 9} ${x2 + 9},${y}`} stroke={OUT} strokeWidth="3.4" fill="none" strokeLinecap="round" />
      </>
    );
  }
  const r = pose === "panic" ? 8.5 : 7;
  const pr = pose === "panic" ? 2.6 : 3.4;
  return (
    <>
      <ellipse cx={x1} cy={y} rx={r} ry={r + 1.5} fill="#fff" stroke={OUT} strokeWidth="2.6" />
      <circle cx={x1} cy={y + 1} r={pr} fill={iris} />
      <circle cx={x1 + 1.5} cy={y - 1.5} r="1.3" fill="#fff" />
      <ellipse cx={x2} cy={y} rx={r} ry={r + 1.5} fill="#fff" stroke={OUT} strokeWidth="2.6" />
      <circle cx={x2} cy={y + 1} r={pr} fill={iris} />
      <circle cx={x2 + 1.5} cy={y - 1.5} r="1.3" fill="#fff" />
    </>
  );
}

function Brows({ pose, x1, x2, y }: { pose: Pose; x1: number; x2: number; y: number }) {
  if (pose === "stern") {
    return (
      <>
        <path d={`M${x1 - 10},${y - 6} L${x1 + 9},${y + 1}`} stroke={OUT} strokeWidth="4" strokeLinecap="round" />
        <path d={`M${x2 + 10},${y - 6} L${x2 - 9},${y + 1}`} stroke={OUT} strokeWidth="4" strokeLinecap="round" />
      </>
    );
  }
  if (pose === "panic") {
    return (
      <>
        <path d={`M${x1 - 9},${y + 1} Q${x1},${y - 8} ${x1 + 9},${y - 2}`} stroke={OUT} strokeWidth="3.6" fill="none" strokeLinecap="round" />
        <path d={`M${x2 + 9},${y + 1} Q${x2},${y - 8} ${x2 - 9},${y - 2}`} stroke={OUT} strokeWidth="3.6" fill="none" strokeLinecap="round" />
      </>
    );
  }
  return (
    <>
      <path d={`M${x1 - 9},${y - 2} Q${x1},${y - 6} ${x1 + 9},${y - 2}`} stroke={OUT} strokeWidth="3.6" fill="none" strokeLinecap="round" />
      <path d={`M${x2 - 9},${y - 2} Q${x2},${y - 6} ${x2 + 9},${y - 2}`} stroke={OUT} strokeWidth="3.6" fill="none" strokeLinecap="round" />
    </>
  );
}

function Mouth({ pose, cx, y, mouthOpen }: { pose: Pose; cx: number; y: number; mouthOpen?: boolean }) {
  if (mouthOpen) {
    return <ellipse cx={cx} cy={y + 2} rx="7" ry="6" fill="#8C3A46" stroke={OUT} strokeWidth="2.8" />;
  }
  if (pose === "panic") return <ellipse cx={cx} cy={y + 3} rx="9" ry="11" fill="#8C3A46" stroke={OUT} strokeWidth="2.8" />;
  if (pose === "happy") return <path d={`M${cx - 12},${y} Q${cx},${y + 13} ${cx + 12},${y}`} fill="#8C3A46" stroke={OUT} strokeWidth="2.8" />;
  if (pose === "stern") return <path d={`M${cx - 10},${y + 4} Q${cx},${y - 2} ${cx + 10},${y + 4}`} stroke={OUT} strokeWidth="3" fill="none" strokeLinecap="round" />;
  return <path d={`M${cx - 8},${y + 2} Q${cx},${y + 6} ${cx + 8},${y + 2}`} stroke={OUT} strokeWidth="3" fill="none" strokeLinecap="round" />;
}

/** placeholder กลางสำหรับตัวละครที่ยังไม่มีรูปครบทุกท่า */
export function GenericPlaceholder({ pose, mouthOpen }: FaceProps) {
  const skin = "#EFC49E", shirt = "#7A8699", shirtD = "#5B6675", hair = "#3A3F4B";
  return (
    <svg viewBox="0 0 200 250" xmlns="http://www.w3.org/2000/svg">
      <path d="M28,250 L28,206 Q28,172 100,170 Q172,172 172,206 L172,250 Z" fill={shirt} stroke={OUT} strokeWidth="4" />
      <path d="M76,176 L100,200 L124,176 L118,170 L100,186 L82,170 Z" fill={shirtD} stroke={OUT} strokeWidth="3" />
      <rect x="88" y="150" width="24" height="26" fill={skin} stroke={OUT} strokeWidth="3.4" />
      <path d="M52,100 Q52,42 100,40 Q148,42 148,100 Q148,140 128,152 Q114,161 100,161 Q86,161 72,152 Q52,140 52,100 Z" fill={skin} stroke={OUT} strokeWidth="4" />
      <path d="M48,100 Q46,44 100,36 Q154,44 152,100 Q148,72 132,66 Q116,82 100,64 Q84,82 68,66 Q52,72 48,100 Z" fill={hair} stroke={OUT} strokeWidth="4" />
      <Brows pose={pose} x1={80} x2={120} y={92} />
      <Eyes pose={pose} x1={80} x2={120} y={104} iris="#4A3728" />
      <Mouth pose={pose} cx={100} y={132} mouthOpen={mouthOpen} />
    </svg>
  );
}

export const GAME_CHARACTERS: Record<string, GameCharacter> = {
  // เภสัชกรพี่เลี้ยง — เสียงของ "ครู" ตอนตอบผิด/สรุปท้ายเคส
  // มีรูปจริงที่ public/images/game/characters/pharmacist_mentor/{idle,talk,stern,happy}.webp
  // (Placeholder ด้านล่างเป็น SVG fallback เผื่อรูปโหลดไม่ขึ้น)
  pharmacist_mentor: {
    name: "ภก.พี่เก่ง",
    role: "เภสัชกรพี่เลี้ยง",
    plate: ["#0D9488", "#134E4A"],
    Placeholder({ pose, mouthOpen }: FaceProps) {
      const skin = "#EDBE96", coat = "#F4F6FB", coatD = "#C9D2E4", shirt = "#0D9488", hair = "#2B2F3A";
      return (
        <svg viewBox="0 0 200 250" xmlns="http://www.w3.org/2000/svg">
          <path d="M20,250 L20,206 Q20,168 100,166 Q180,168 180,204 L180,250 Z" fill={coat} stroke={OUT} strokeWidth="4" />
          <path d="M84,168 L100,250 L116,168 Q108,176 100,176 Q92,176 84,168 Z" fill={shirt} stroke={OUT} strokeWidth="3.4" />
          <path d="M60,170 Q76,186 84,168 L74,250 L36,250 Q28,200 60,170 Z" fill={coat} stroke={OUT} strokeWidth="4" />
          <path d="M140,170 Q124,186 116,168 L126,250 L164,250 Q172,200 140,170 Z" fill={coat} stroke={OUT} strokeWidth="4" />
          <path d="M62,176 L74,250 M138,176 L126,250" stroke={coatD} strokeWidth="3" fill="none" />
          {/* ป้ายชื่อบนเสื้อกาวน์ */}
          <rect x="130" y="196" width="30" height="12" rx="2" fill="#fff" stroke={OUT} strokeWidth="2.4" />
          <path d="M134,202 L156,202" stroke="#0D9488" strokeWidth="2.6" strokeLinecap="round" />
          <rect x="88" y="148" width="24" height="26" fill={skin} stroke={OUT} strokeWidth="3.4" />
          <path d="M54,102 Q54,46 100,44 Q146,46 146,102 Q146,138 127,150 Q113,159 100,159 Q87,159 73,150 Q54,138 54,102 Z" fill={skin} stroke={OUT} strokeWidth="4" />
          <path d="M50,96 Q54,40 100,36 Q146,40 150,96 Q146,66 128,62 Q110,74 100,60 Q90,74 72,62 Q54,66 50,96 Z" fill={hair} stroke={OUT} strokeWidth="4" />
          <Brows pose={pose} x1={79} x2={121} y={90} />
          <Eyes pose={pose} x1={79} x2={121} y={107} iris="#3A3228" />
          <Mouth pose={pose} cx={100} y={132} mouthOpen={mouthOpen} />
        </svg>
      );
    },
  },

  // ลูกค้าตามเพศ/วัย — มีรูปจริง (idle/talk/panic/happy) ยกมาจากชุด sprite ผู้ป่วยของ morroo
  // pose ที่ไม่มีรูป CharacterSprite ถอยไปใช้รูป idle ให้เอง
  cust_elderly_female: {
    name: "คุณยายสมศรี",
    role: "ลูกค้า",
    plate: ["#9A8F7A", "#75695B"],
    Placeholder: GenericPlaceholder,
  },
  cust_young_male: {
    name: "คุณต้น",
    role: "ลูกค้า · หนุ่มออฟฟิศ",
    plate: ["#6E8FA6", "#4E6B7F"],
    Placeholder: GenericPlaceholder,
  },
  cust_mother: {
    name: "คุณแม่น้องภูมิ",
    role: "ผู้ปกครอง",
    plate: ["#C9A87A", "#9A7F5B"],
    Placeholder: GenericPlaceholder,
  },
  cust_child: {
    name: "น้องภูมิ",
    role: "เด็ก 3 ขวบ",
    plate: ["#7AA0C9", "#5B7A9A"],
    Placeholder: GenericPlaceholder,
  },
  cust_female: {
    name: "ลูกค้าหญิง",
    role: "ลูกค้า",
    plate: ["#8A7A99", "#655B75"],
    Placeholder: GenericPlaceholder,
  },
  cust_generic: {
    name: "ลูกค้า",
    role: "ลูกค้า",
    plate: ["#7A8699", "#5B6675"],
    Placeholder: GenericPlaceholder,
  },
};

/** ตัวละครที่พูดแทน "ครู" ตอนตอบผิด, time-skip และสรุปท้ายเคส */
export const MENTOR_ID = "pharmacist_mentor";

export function getCharacter(charId: string): GameCharacter | null {
  return GAME_CHARACTERS[charId] || null;
}

export function characterImageUrl(charId: string, pose: Pose, talking = false): string {
  return `/images/game/characters/${charId}/${pose}${talking ? "_talk" : ""}.webp`;
}

// ---- ตัวละครจาก DB (เผื่ออนาคตเพิ่มผ่านหน้าแอดมิน) ------------------------

export type CharacterMotion = "none" | "bob" | "sway" | "pulse";

export interface GameDbCharacter {
  slug: string;
  name: string;
  role: string | null;
  plate: [string, string];
  /** key = pose หรือ `${pose}_talk` → public URL */
  images: Record<string, string>;
  motion?: CharacterMotion;
}

/** ข้อมูลตัวละครแบบรวม (built-in หรือจาก DB) ที่ runner/sprite ใช้ render */
export interface ResolvedCharacter {
  name: string;
  plate: [string, string];
  Placeholder?: GameCharacter["Placeholder"];
  images?: Record<string, string>;
  motion: CharacterMotion;
}

export function resolveCharacter(
  charId: string,
  dbCharacters?: Map<string, GameDbCharacter>,
): ResolvedCharacter | null {
  const builtin = GAME_CHARACTERS[charId];
  if (builtin) {
    return { name: builtin.name, plate: builtin.plate, Placeholder: builtin.Placeholder, motion: "none" };
  }
  const db = dbCharacters?.get(charId);
  if (db) {
    return { name: db.name, plate: db.plate, images: db.images, motion: db.motion ?? "none" };
  }
  return null;
}
