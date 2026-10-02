import type { McqQuestion } from "@/lib/types-mcq";
import { IP1_MOCK_DOMAINS, IP1_MOCK_PER_DOMAIN, type Ip1MockDomain } from "@/lib/ip1-mock/domains";

const labels = ["A", "B", "C", "D", "E"];
// ทุก 10 ข้อมีคำตอบ A–E ตำแหน่งละ 2 ข้อ (ยกเว้นตัวเลือกเชิงตัวเลขที่คงลำดับจากน้อยไปมาก)
const KEY = [2, 0, 3, 1, 4, 1, 3, 0, 4, 2];
const isNumeric = (t: string) => /^[<>≤≥~≈±+−-]?\s?\d/.test(t);

// เซตที่ครบทุกหมวด (หมวดละ 10 ข้อ) เท่านั้นที่เปิดให้สอบ
export function isIp1MockSetReady(setNo: number, domains: Ip1MockDomain[] = IP1_MOCK_DOMAINS): boolean {
  return domains.every((d) => (d.sets[setNo - 1]?.length ?? 0) >= IP1_MOCK_PER_DOMAIN);
}

export function buildIp1Mock(setNo: number, domains: Ip1MockDomain[] = IP1_MOCK_DOMAINS): McqQuestion[] {
  const createdAt = "2026-10-02 09:00:00";
  const source = `PharmRU PLE-IP1 Mock Set ${setNo}`;
  const out: McqQuestion[] = [];
  let n = 0;
  for (const dom of domains) {
    const items = (dom.sets[setNo - 1] ?? []).slice(0, IP1_MOCK_PER_DOMAIN);
    for (const q of items) {
      n++;
      if (q.o.length !== 5 || q.w.length !== 5 || q.a < 0 || q.a > 4) {
        throw new Error(`IP1 Mock ${setNo} ${dom.key}: malformed item "${q.t}"`);
      }
      const keep = q.o.every(isNumeric);
      const order = q.o.map((_, j) => j).filter((j) => j !== q.a);
      order.splice(keep ? q.a : KEY[(n - 1) % KEY.length], 0, q.a);
      const o = order.map((j) => q.o[j]);
      const w = order.map((j) => q.w[j]);
      const ai = order.indexOf(q.a);
      const ans = labels[ai];
      out.push({
        id: `ip1m${setNo}q${String(n).padStart(3, "0")}`,
        subject_id: "ip1",
        exam_type: "PLE-CC1",
        exam_source: source,
        exam_day: null,
        question_number: n,
        scenario: q.p,
        image_url: null,
        choices: o.map((text, j) => ({ label: labels[j], text })),
        correct_answer: ans,
        explanation: `${q.r}\n\nReference: ${q.ref}`,
        detailed_explanation: {
          summary: `เฉลย ${ans}: ${o[ai]}`,
          reason: `${q.r}\n\nReference: ${q.ref}`,
          choices: o.map((text, j) => ({ label: labels[j], text, is_correct: j === ai, explanation: w[j] })),
          key_takeaway: q.k,
          ...(q.c ? { calculation_steps: q.c } : {}),
        },
        difficulty: q.d,
        is_ai_enhanced: true,
        ai_notes: `IP1 mock exam item (12-domain blueprint) · ${q.t} · technical/editorial verification recommended before commercial publication.`,
        status: "active",
        created_at: createdAt,
        mcq_subjects: {
          id: `ip1-${dom.key}`, name: "IP1", name_th: dom.name_th, icon: dom.icon,
          exam_type: "PLE-CC1", question_count: 120, created_at: createdAt,
        },
      });
    }
  }
  return out;
}
