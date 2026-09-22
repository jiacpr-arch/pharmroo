// ยศเภสัชกร — "ตัวละคร" ของผู้เล่น คิดจาก XP สะสมของเกมร้านยา
//
// pure ทั้งไฟล์ (ไม่มี I/O) — ใช้ได้ทั้ง server component, client component
// และเทสต์

export interface PharmacistRank {
  tier: number;
  title: string;
  short: string;
  minXp: number;
  trait: string;
  icon: string;
}

/**
 * บันไดยศ 6 ขั้น — ระยะห่างตั้งจากอัตราของเกม (ชนะเคสได้ 30–150 XP ตาม GAME_XP)
 * ขั้นแรก ๆ ไต่ได้ในไม่กี่เคส แล้วค่อยถ่างออกให้ปลายทางเป็นเป้าระยะยาว
 */
export const PHARMACIST_RANKS: readonly PharmacistRank[] = [
  { tier: 1, title: "นักศึกษาเภสัชฝึกงาน", short: "นศภ.", minXp: 0, trait: "เพิ่งยืนหลังเคาน์เตอร์ครั้งแรก — ยังต้องมีพี่เลี้ยงคอยดู", icon: "🎒" },
  { tier: 2, title: "เภสัชกรจบใหม่", short: "ภก. ใหม่", minXp: 250, trait: "ซักประวัติได้เป็นระบบ ไม่ตกประเด็นสำคัญ", icon: "📋" },
  { tier: 3, title: "เภสัชกรประจำร้าน", short: "ภก. ประจำร้าน", minXp: 700, trait: "จ่ายยา OTC ได้มั่นใจ รู้ว่าเมื่อไรต้องส่งต่อ", icon: "💊" },
  { tier: 4, title: "เภสัชกรอาวุโส", short: "ภก. อาวุโส", minXp: 1500, trait: "จับ drug interaction และ red flag ได้ไว", icon: "🔬" },
  { tier: 5, title: "ผู้จัดการร้านยา", short: "ผู้จัดการ", minXp: 2800, trait: "คุมคุณภาพการจ่ายยาทั้งร้าน และสอนรุ่นน้องได้", icon: "🏪" },
  { tier: 6, title: "เภสัชกรผู้เชี่ยวชาญ", short: "ผู้เชี่ยวชาญ", minXp: 4500, trait: "สูงสุดของสายร้านยา — เคสไหนเข้ามาก็เอาอยู่", icon: "👑" },
] as const;

export interface RankProgress {
  rank: PharmacistRank;
  /** ยศขั้นถัดไป — null เมื่อถึงขั้นสูงสุดแล้ว */
  next: PharmacistRank | null;
  xpIntoRank: number;
  xpForNext: number;
  /** 0–100 (ขั้นสูงสุด = 100) */
  progress: number;
}

export function xpToRank(xp: number): RankProgress {
  const safeXp = Number.isFinite(xp) && xp > 0 ? Math.floor(xp) : 0;
  let index = 0;
  for (let i = PHARMACIST_RANKS.length - 1; i >= 0; i--) {
    if (safeXp >= PHARMACIST_RANKS[i].minXp) {
      index = i;
      break;
    }
  }
  const rank = PHARMACIST_RANKS[index];
  const next = PHARMACIST_RANKS[index + 1] ?? null;
  if (!next) {
    return { rank, next: null, xpIntoRank: safeXp - rank.minXp, xpForNext: 0, progress: 100 };
  }
  const xpForNext = next.minXp - rank.minXp;
  const xpIntoRank = safeXp - rank.minXp;
  return {
    rank,
    next,
    xpIntoRank,
    xpForNext,
    progress: Math.min(100, Math.round((xpIntoRank / xpForNext) * 100)),
  };
}

export interface RankDelta {
  /** ยศก่อน/หลังรอบนี้ — null เมื่ออ่าน XP ไม่สำเร็จ */
  rankBefore: RankProgress | null;
  rankAfter: RankProgress | null;
  rankedUp: boolean;
}

export const NO_RANK_DELTA: RankDelta = { rankBefore: null, rankAfter: null, rankedUp: false };

/** เทียบยศก่อน/หลัง — คืน NO_RANK_DELTA เมื่อฝั่งใดฝั่งหนึ่งอ่านไม่ได้ */
export function rankDelta(xpBefore: number | null, xpAfter: number | null): RankDelta {
  if (xpBefore === null || xpAfter === null) return NO_RANK_DELTA;
  const rankBefore = xpToRank(xpBefore);
  const rankAfter = xpToRank(xpAfter);
  return { rankBefore, rankAfter, rankedUp: rankAfter.rank.tier > rankBefore.rank.tier };
}
