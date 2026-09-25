import type { McqQuestion } from "@/lib/types-mcq";

// ตัวสร้างข้อสอบ PC1 แบบ "สถานการณ์" (1 เคส หลายข้อ) ใช้ร่วมกันทุกชุดที่ต่อท้าย PC1 หลัก
// o = ตัวเลือก 5 ข้อ, a = index คำตอบ, w = เหตุผลรายตัวเลือก, c = ขั้นตอนคำนวณ (ถ้ามี), k = key takeaway
export type Pc1Q = { p: string; o: string[]; a: number; r: string; w: string[]; c?: string[]; k: string };
export type Pc1Case = { title: string; base: string; ref: string; qs: Pc1Q[] };

const labels = ["A", "B", "C", "D", "E"];
const POS = [3, 0, 4, 1, 2, 0, 3, 1, 4];

export function buildPc1Cases(
  cases: Pc1Case[],
  opts: { idPrefix: string; caseOffset: number; qOffset: number; createdAt: string }
): McqQuestion[] {
  const total = cases.reduce((s, c) => s + c.qs.length, 0);
  return cases.flatMap((c, ci) =>
    c.qs.map((q, qi) => {
      const n = cases.slice(0, ci).reduce((s, x) => s + x.qs.length, 0) + qi + 1;
      // ตัวเลือกเชิงตัวเลขคงลำดับจากน้อยไปมาก; ตัวเลือกข้อความสลับตำแหน่งคำตอบเพื่อกระจาย key
      const numeric = q.o.every((t) => /^[\d.,]+ /.test(t));
      const order = q.o.map((_, j) => j).filter((j) => j !== q.a);
      if (numeric) order.splice(q.a, 0, q.a);
      else order.splice(POS[(n - 1) % POS.length], 0, q.a);
      const o = order.map((j) => q.o[j]);
      const w = order.map((j) => q.w[j]);
      const ai = order.indexOf(q.a);
      const ans = labels[ai];
      return {
        id: `${opts.idPrefix}${String(n).padStart(3, "0")}`,
        subject_id: "pc1",
        exam_type: "PLE-PC",
        exam_source: "PharmRU PC1 Progressive Cases",
        exam_day: null,
        question_number: opts.qOffset + n,
        scenario: `Case ${opts.caseOffset + ci + 1} — ${c.title}\n${c.base}\n\nคำถาม ${qi + 1}/${c.qs.length}: ${q.p}`,
        image_url: null,
        choices: o.map((text, j) => ({ label: labels[j], text })),
        correct_answer: ans,
        explanation: `${q.r}\n\nReference: ${c.ref}`,
        detailed_explanation: {
          summary: `เฉลย ${ans}: ${o[ai]}`,
          reason: q.r,
          choices: o.map((text, j) => ({ label: labels[j], text, is_correct: j === ai, explanation: w[j] })),
          key_takeaway: q.k,
          ...(q.c ? { calculation_steps: q.c } : {}),
        },
        difficulty: "hard",
        is_ai_enhanced: true,
        ai_notes: "PC1 scenario-style (1 case, multiple items) modeled on past-exam format; clinical/editorial verification required before commercial publication.",
        status: "active",
        created_at: opts.createdAt,
        mcq_subjects: { id: "pc1", name: "PC1", name_th: "บริบาลเภสัชกรรม PC1", icon: "🩺", exam_type: "PLE-PC", question_count: opts.qOffset + total, created_at: opts.createdAt },
      };
    })
  );
}
