# Pharmaceutics (เภสัชเทคโนโลยีและการวิเคราะห์) — PLE-CC1 question bank spec

Target: 240 original MCQs for the Thai Pharmacy Licensure Exam (PLE-CC1),
subject `Pharmaceutics` — 120 for exam Day 1, 120 for exam Day 2,
written in 8 blocks of 30 questions.

## Output format

Each block is a JSON file `scripts/pharmaceutics-cc1/<block>.json` containing an
array of exactly 30 objects:

```json
{
  "scenario": "โจทย์ (ภาษาไทย ปนศัพท์เทคนิคภาษาอังกฤษ)",
  "choices": [
    { "label": "A", "text": "..." },
    { "label": "B", "text": "..." },
    { "label": "C", "text": "..." },
    { "label": "D", "text": "..." },
    { "label": "E", "text": "..." }
  ],
  "correct_answer": "C",
  "explanation": "สรุปเหตุผลสั้น 1–2 ประโยค",
  "detailed_explanation": {
    "summary": "คำตอบที่ถูกต้อง: C. <ข้อความคำตอบ> — <ใจความหลักหนึ่งประโยค>",
    "reason": "อธิบายละเอียด 5–10 ประโยค: หลักการ/กลไก/ทฤษฎีเบื้องหลัง, ทำไมคำตอบนี้ถูก, บริบทที่ใช้จริงในการผลิต/QC, ตัวเลขหรือช่วงความเข้มข้นที่ควรรู้",
    "choices": [
      { "label": "A", "text": "<same text as choice A>", "is_correct": false, "explanation": "ทำไมผิด 2–3 ประโยค และตัวเลือกนี้จริง ๆ คืออะไร/ใช้ทำอะไร" },
      ...ครบ A–E...
    ],
    "key_takeaway": "จุดจำสำหรับสอบ 1–2 ประโยค (mnemonic/ตาราง/เกณฑ์ตัวเลข)",
    "calculation_steps": ["ขั้นที่ 1 ...", "ขั้นที่ 2 ..."]
  },
  "difficulty": "easy" | "medium" | "hard"
}
```

`calculation_steps` — include ONLY for calculation questions (omit the key otherwise),
showing every step with units.

## Rules

- 5 choices A–E, exactly one correct; distractors plausible (common confusions).
- Spread correct answers roughly evenly across A–E within the block (≈6 each), no long runs.
- Difficulty mix per block: ~8 easy, ~14 medium, ~8 hard.
- Style: PLE-CC1 — many questions should be applied/scenario-based (a formulation with
  ingredient list and asking role of an ingredient, a manufacturing/QC problem to troubleshoot,
  a calculation from given data, a USP/ICH test result to interpret), not only recall.
- Must be self-contained text — NO reference to figures, structures, tables or images not in the text.
- Scientific accuracy is paramount: follow USP/BP/ICH/Thai FDA conventions; numbers must be correct;
  recompute every calculation twice. If unsure about a fact, choose a different question.
- Explanations in Thai with English technical terms, as in the existing bank. Be detailed —
  the user specifically asked for thorough reasoning.
- No duplicate questions within the block; avoid trivial rephrasings of the same fact.
- Valid JSON (UTF-8, no trailing commas, no comments). Escape double quotes inside strings.
