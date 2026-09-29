import type { McqQuestion } from "@/lib/types-mcq";

// ตัวสร้างข้อสอบ PHCP1 Daily ใช้ร่วมกันทุกวัน
// o = ตัวเลือก (คำตอบที่ถูกอยู่ตัวแรก), w = เหตุผลของตัวเลือกผิดเรียงตาม o[1..4]
export type Phcp1Draft = {
  p: string;
  o: [string, string, string, string, string];
  w: [string, string, string, string];
  r: string;
  k: string;
  ref: string;
  difficulty: "medium" | "hard";
  c?: string[];
};

const labels = ["A", "B", "C", "D", "E"] as const;

// pos = ตำแหน่ง (0–4) ของคำตอบที่ถูกในแต่ละข้อ
export function buildPhcp1Day(
  drafts: Phcp1Draft[],
  opts: { day: number; pos: number[]; qOffset?: number; createdAt: string }
): McqQuestion[] {
  const dd = String(opts.day).padStart(2, "0");
  return drafts.map((d, i) => {
    const n = i + 1;
    const pos = opts.pos[i];
    const opt: { text: string; ok: boolean; why: string }[] = d.o.slice(1).map((text, j) => ({ text, ok: false, why: d.w[j] }));
    opt.splice(pos, 0, { text: d.o[0], ok: true, why: "ถูก" });
    const ans = labels[pos];
    return {
      id: `phcp1d${dd}q${String(n).padStart(3, "0")}`,
      subject_id: "phcp1",
      exam_type: "PLE-PC",
      exam_source: "PharmRU PHCP1 Daily",
      exam_day: null,
      question_number: (opts.qOffset ?? 0) + n,
      scenario: d.p,
      image_url: null,
      choices: opt.map((o, j) => ({ label: labels[j], text: o.text })),
      correct_answer: ans,
      explanation: `${d.r}\n\nReference: ${d.ref}`,
      detailed_explanation: {
        summary: `เฉลย ${ans}: ${d.o[0]}`,
        reason: d.r,
        choices: opt.map((o, j) => ({ label: labels[j], text: o.text, is_correct: o.ok, explanation: o.why })),
        key_takeaway: d.k,
        ...(d.c ? { calculation_steps: d.c } : {}),
      },
      difficulty: d.difficulty,
      is_ai_enhanced: true,
      ai_notes: `PHCP1 Daily Day ${opts.day} — original item; legal/clinical content must be verified against the latest Thai regulations and guidelines before commercial publication.`,
      status: "review",
      created_at: opts.createdAt,
      mcq_subjects: {
        id: "phcp1",
        name: "PHCP1",
        name_th: "คุ้มครองผู้บริโภคด้านยาและสุขภาพ PHCP1",
        icon: "🛡️",
        exam_type: "PLE-PC",
        question_count: drafts.length,
        created_at: opts.createdAt,
      },
    };
  });
}
