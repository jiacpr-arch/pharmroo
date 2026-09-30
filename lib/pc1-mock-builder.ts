import type { McqQuestion } from "@/lib/types-mcq";
import type { Pc1Q } from "@/lib/pc1-case-builder";

// ตัวสร้างข้อสอบ PC1 Mock (ชุดละ 120 ข้อ, 12 หมวด × 10 ข้อ)
// item ที่มี base = เคสต่อเนื่องหลายข้อ; item ที่ไม่มี base = ข้อเดี่ยว
// ใช้ Pc1Q แบบเดียวกับชุดรายวัน (d ไม่ระบุ = medium)
export type Pc1MockItem = { title?: string; base?: string; ref: string; qs: Pc1Q[] };
export type Pc1MockDomain = { key: string; name_th: string; icon: string; items: Pc1MockItem[] };

const labels = ["A", "B", "C", "D", "E"];
// แต่ละ 10 ข้อมีคำตอบ A–E ตำแหน่งละ 2 ข้อ → ชุด 120 ข้อได้ A–E ละ 24 ข้อ (ยกเว้นตัวเลือกเชิงตัวเลข)
const KEY = [2, 0, 3, 1, 4, 1, 3, 0, 4, 2];

export function buildPc1Mock(
  domains: Pc1MockDomain[],
  opts: { setNo: number; qOffset: number; caseOffset: number; createdAt: string }
): McqQuestion[] {
  const out: McqQuestion[] = [];
  let n = opts.qOffset;
  let caseNo = opts.caseOffset;
  for (const dom of domains) {
    for (const item of dom.items) {
      const isCase = !!item.base;
      if (isCase) caseNo++;
      item.qs.forEach((q, qi) => {
        n++;
        // ตัวเลือกเชิงตัวเลขคงลำดับจากน้อยไปมาก; ตัวเลือกข้อความวางคำตอบตาม KEY
        const numeric = q.o.every((t) => /^[\d.,]+ /.test(t));
        const order = q.o.map((_, j) => j).filter((j) => j !== q.a);
        order.splice(numeric ? q.a : KEY[(n - 1) % KEY.length], 0, q.a);
        const o = order.map((j) => q.o[j]);
        const w = order.map((j) => q.w[j]);
        const ai = order.indexOf(q.a);
        const ans = labels[ai];
        const stem = isCase
          ? `Case ${caseNo} — ${item.title}\n${item.base}\n\nคำถาม ${qi + 1}/${item.qs.length}: ${q.p}`
          : q.p;
        out.push({
          id: `pc1m${opts.setNo}q${String(n).padStart(3, "0")}`,
          subject_id: "pc1",
          exam_type: "PLE-PC",
          exam_source: `PharmRU PC1 Mock Set ${opts.setNo}`,
          exam_day: null,
          question_number: n,
          scenario: stem,
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
          mcq_subjects: { id: `pc1-${dom.key}`, name: "PC1", name_th: dom.name_th, icon: dom.icon, exam_type: "PLE-PC", question_count: 120, created_at: opts.createdAt },
        });
      });
    }
  }
  return out;
}
