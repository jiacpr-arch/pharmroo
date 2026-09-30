import type { McqQuestion } from "@/lib/types-mcq";
import { buildPc1Mock, PC1_MOCK_DOMAINS, type Pc1MockItem } from "@/lib/pc1-mock-builder";
import { MOCK1_DAY01 } from "@/lib/pc1-mock1-day01";
import { MOCK1_DAY02 } from "@/lib/pc1-mock1-day02";
import { MOCK1_DAY03 } from "@/lib/pc1-mock1-day03";

// PC1 Mock Set 1 (120 ข้อ = 12 หมวด × 10 ข้อ)
// ใช้เคสจากคลัง PC1 เดิมก่อน ({ reuse: เลขเคส }) แล้วเติมหมวดที่ขาดด้วยข้อใหม่ของชุด Mock
// เคสเดิมหมวดหัวใจ/ติดเชื้อที่เกินจะกระจายไปเซต 2–5
const ITEMS: Record<string, Pc1MockItem[]> = {
  cardio: [...MOCK1_DAY01.cardio],
  infection: [...MOCK1_DAY01.infection],
  renal: [{ reuse: 27 }, { reuse: 28 }],
  endocrine: [{ reuse: 29 }, { reuse: 32 }],
  neuro: [{ reuse: 12 }, ...MOCK1_DAY02.neuro],
  psych: [{ reuse: 6 }, ...MOCK1_DAY02.psych],
  resp: [{ reuse: 8 }, ...MOCK1_DAY02.resp],
  gi: [{ reuse: 26 }, ...MOCK1_DAY03.gi],
  heme: [{ reuse: 16 }, { reuse: 20 }],
  rheum: [{ reuse: 5 }, { reuse: 7 }, ...MOCK1_DAY03.rheum],
  special: [{ reuse: 14 }, ...MOCK1_DAY03.special],
  critical: [{ reuse: 21 }, { reuse: 13 }],
};

export const PC1_MOCK1: McqQuestion[] = buildPc1Mock(
  PC1_MOCK_DOMAINS.map((d) => ({ ...d, items: ITEMS[d.key] ?? [] })),
  { setNo: 1, createdAt: "2026-10-03 09:00:00" }
);
