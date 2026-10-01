import type { McqQuestion } from "@/lib/types-mcq";
import type { Pc1Q } from "@/lib/pc1-case-builder";
import { PC1_ALL } from "@/lib/pc1-bank";

// ตัวสร้างข้อสอบ PC1 Mock (ชุดละ 120 ข้อ, 12 หมวด × 10 ข้อ)
// - item ที่มี base = เคสต่อเนื่องหลายข้อ; ไม่มี base = ข้อเดี่ยว (ใช้ Pc1Q แบบชุดรายวัน, d ไม่ระบุ = medium)
// - { reuse: N } = ดึง Case N ทั้งเคสจากคลัง PC1 เดิม (ตัวเลือก/เฉลยคงเดิม เปลี่ยนเฉพาะเลขข้อ เลขเคส และหมวด)
export type Pc1MockNewItem = { title?: string; base?: string; ref: string; qs: Pc1Q[] };
// คำอธิบายใหม่สำหรับเคสเดิม (ใช้เฉพาะในชุด Mock): key = ลำดับข้อในเคส (0-based), w = คำอธิบายรายตัวเลือกตาม label เดิม
export type Pc1ReuseExplain = { r: string; w: Record<string, string>; k: string };
export type Pc1MockReuse = { reuse: number; ref?: string; explain?: Record<number, Pc1ReuseExplain> };
export type Pc1MockItem = Pc1MockNewItem | Pc1MockReuse;
export type Pc1MockDomain = { key: string; name_th: string; icon: string; items: Pc1MockItem[] };

// 12 หมวดของ PC1 ตามลำดับในชุดข้อสอบ
export const PC1_MOCK_DOMAINS: Omit<Pc1MockDomain, "items">[] = [
  { key: "cardio", name_th: "หัวใจและหลอดเลือด", icon: "❤️" },
  { key: "infection", name_th: "โรคติดเชื้อ", icon: "🦠" },
  { key: "renal", name_th: "ไตและอิเล็กโทรไลต์", icon: "🫘" },
  { key: "endocrine", name_th: "ต่อมไร้ท่อ", icon: "🩸" },
  { key: "neuro", name_th: "ระบบประสาท", icon: "🧠" },
  { key: "psych", name_th: "จิตเวช", icon: "💭" },
  { key: "resp", name_th: "ระบบหายใจ", icon: "🫁" },
  { key: "gi", name_th: "ทางเดินอาหารและตับ", icon: "🍽️" },
  { key: "heme", name_th: "โลหิตวิทยาและมะเร็ง", icon: "🧬" },
  { key: "rheum", name_th: "ข้อ กระดูก และความปวด", icon: "🦴" },
  { key: "special", name_th: "กลุ่มประชากรพิเศษ", icon: "👶" },
  { key: "critical", name_th: "ภาวะวิกฤตและพิษวิทยา", icon: "🚨" },
];

const labels = ["A", "B", "C", "D", "E"];
// แต่ละ 10 ข้อใหม่มีคำตอบ A–E ตำแหน่งละ 2 ข้อ (ยกเว้นตัวเลือกเชิงตัวเลขที่คงลำดับจากน้อยไปมาก)
const KEY = [2, 0, 3, 1, 4, 1, 3, 0, 4, 2];

export function buildPc1Mock(
  domains: Pc1MockDomain[],
  opts: { setNo: number; createdAt: string }
): McqQuestion[] {
  const out: McqQuestion[] = [];
  let n = 0;
  let caseNo = 0;
  const subject = (dom: Pc1MockDomain) => ({
    id: `pc1-${dom.key}`, name: "PC1", name_th: dom.name_th, icon: dom.icon,
    exam_type: "PLE-PC" as const, question_count: 120, created_at: opts.createdAt,
  });
  const id = () => `pc1m${opts.setNo}q${String(n).padStart(3, "0")}`;
  const source = `PharmRU PC1 Mock Set ${opts.setNo}`;

  for (const dom of domains) {
    for (const item of dom.items) {
      if ("reuse" in item) {
        const src = PC1_ALL.filter((q) => q.scenario.startsWith(`Case ${item.reuse} —`));
        if (!src.length) throw new Error(`PC1 case ${item.reuse} not found`);
        caseNo++;
        src.forEach((q, qi) => {
          n++;
          const ex = item.explain?.[qi];
          const d = q.detailed_explanation;
          if (ex && d) {
            const labelsInQ = q.choices.map((c) => c.label);
            const missing = labelsInQ.filter((l) => !(l in ex.w));
            if (missing.length) throw new Error(`Case ${item.reuse} Q${qi + 1}: missing explanation for ${missing.join(",")}`);
          }
          out.push({
            ...q,
            id: id(),
            exam_source: source,
            question_number: n,
            scenario: q.scenario.replace(/^Case \d+ — /, `Case ${caseNo} — `),
            mcq_subjects: subject(dom),
            ...(ex && d
              ? {
                  explanation: `${ex.r}${item.ref ? `\n\nReference: ${item.ref}` : ""}`,
                  detailed_explanation: {
                    ...d,
                    reason: ex.r,
                    key_takeaway: ex.k,
                    choices: d.choices.map((c) => ({ ...c, explanation: ex.w[c.label] })),
                  },
                }
              : {}),
          });
        });
        continue;
      }
      const isCase = !!item.base;
      if (isCase) caseNo++;
      item.qs.forEach((q, qi) => {
        n++;
        const numeric = q.o.every((t) => /^[\d.,]+ /.test(t));
        const order = q.o.map((_, j) => j).filter((j) => j !== q.a);
        order.splice(numeric ? q.a : KEY[(n - 1) % KEY.length], 0, q.a);
        const o = order.map((j) => q.o[j]);
        const w = order.map((j) => q.w[j]);
        const ai = order.indexOf(q.a);
        const ans = labels[ai];
        out.push({
          id: id(),
          subject_id: "pc1",
          exam_type: "PLE-PC",
          exam_source: source,
          exam_day: null,
          question_number: n,
          scenario: isCase
            ? `Case ${caseNo} — ${item.title}\n${item.base}\n\nคำถาม ${qi + 1}/${item.qs.length}: ${q.p}`
            : q.p,
          image_url: null,
          choices: o.map((text, j) => ({ label: labels[j], text })),
          correct_answer: ans,
          explanation: `${q.r}\n\nReference: ${item.ref}`,
          detailed_explanation: {
            summary: `เฉลย ${ans}: ${o[ai]}`,
            reason: q.r,
            choices: o.map((text, j) => ({ label: labels[j], text, is_correct: j === ai, explanation: w[j] })),
            key_takeaway: q.k,
            ...(q.c ? { calculation_steps: q.c } : {}),
          },
          difficulty: q.d ?? "medium",
          is_ai_enhanced: true,
          ai_notes: "PC1 mock exam item (12-domain blueprint); clinical/editorial verification required before commercial publication.",
          status: "active",
          created_at: opts.createdAt,
          mcq_subjects: subject(dom),
        });
      });
    }
  }
  return out;
}
