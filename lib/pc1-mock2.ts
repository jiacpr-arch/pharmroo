import type { McqQuestion } from "@/lib/types-mcq";
import { buildPc1Mock, PC1_MOCK_DOMAINS, type Pc1MockItem } from "@/lib/pc1-mock-builder";
import { MOCK2_DAY01 } from "@/lib/pc1-mock2-day01";
import { MOCK2_DAY02 } from "@/lib/pc1-mock2-day02";
import { MOCK2_DAY03 } from "@/lib/pc1-mock2-day03";
import { MOCK2_DAY04 } from "@/lib/pc1-mock2-day04";
import { MOCK2_REUSE } from "@/lib/pc1-mock2-reuse";

// PC1 Mock Set 2 (120 ข้อ = 12 หมวด × 10 ข้อ)
// ใช้เคสจากคลัง PC1 เดิมที่ยังไม่อยู่ในเซต 1 ก่อน แล้วเติมหมวดที่ขาดด้วยข้อใหม่
const ITEMS: Record<string, Pc1MockItem[]> = {
  cardio: [...MOCK2_REUSE.cardio],
  infection: [...MOCK2_REUSE.infection],
  renal: [...MOCK2_REUSE.renal, ...MOCK2_DAY01.renal],
  endocrine: [...MOCK2_REUSE.endocrine, ...MOCK2_DAY01.endocrine],
  neuro: [...MOCK2_DAY01.neuro],
  psych: [...MOCK2_DAY02.psych],
  resp: [...MOCK2_DAY02.resp],
  gi: [...MOCK2_DAY03.gi],
  heme: [...MOCK2_DAY03.heme],
  rheum: [...MOCK2_DAY04.rheum],
  special: [...MOCK2_DAY04.special],
  critical: [...MOCK2_DAY04.critical],
};

export const PC1_MOCK2: McqQuestion[] = buildPc1Mock(
  PC1_MOCK_DOMAINS.map((d) => ({ ...d, items: ITEMS[d.key] ?? [] })),
  { setNo: 2, createdAt: "2026-10-04 09:00:00" }
);
