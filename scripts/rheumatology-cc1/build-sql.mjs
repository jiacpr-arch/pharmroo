// Validate a rheumatology CC1 batch JSON and emit an idempotent INSERT for mcq_questions.
// Usage: node scripts/rheumatology-cc1/build-sql.mjs <batch.json> [--check | --upsert]
// --upsert overwrites existing rows with the same id (use after editing a batch that was already inserted).
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { basename } from "node:path";

// Defaults are for the rheumatology batches; other subjects set `subject_id`, `id_prefix` and `ai_notes` in the batch file.
const DEFAULT_SUBJECT_ID = "06991a85-412e-476e-89ff-32b0a7b92e6c"; // กระดูกและข้อ (Rheumatology)
const file = process.argv[2];
const checkOnly = process.argv.includes("--check");
const upsert = process.argv.includes("--upsert");
const batch = JSON.parse(readFileSync(file, "utf8"));
const name = basename(file, ".json");
const SUBJECT_ID = batch.subject_id ?? DEFAULT_SUBJECT_ID;
const ID_PREFIX = batch.id_prefix ?? "rheum-cc1";
const AI_NOTES = batch.ai_notes ?? "AI-drafted; rheumatology CC1 top-up";

const errors = [];
if (![1, 2].includes(batch.exam_day)) errors.push("exam_day must be 1 or 2");
if (!Array.isArray(batch.questions) || batch.questions.length === 0) errors.push("questions[] missing");

const ALL_LABELS = ["A", "B", "C", "D", "E"];
const seen = new Set();
batch.questions.forEach((q, i) => {
  const at = `#${i + 1}`;
  if (!q.scenario || q.scenario.length < 20) errors.push(`${at} scenario too short`);
  if (seen.has(q.scenario)) errors.push(`${at} duplicate scenario`);
  seen.add(q.scenario);
  // New questions use 4 choices; legacy rows (with an explicit id) may keep 5.
  const LABELS = ALL_LABELS.slice(0, q.id ? q.choices?.length : 4);
  if (!Array.isArray(q.choices) || q.choices.length !== LABELS.length || LABELS.length < 4) errors.push(`${at} needs exactly 4 choices (5 allowed for legacy rows)`);
  else q.choices.forEach((c, j) => {
    if (c.label !== LABELS[j]) errors.push(`${at} choice ${j} label must be ${LABELS[j]}`);
    if (!c.text) errors.push(`${at} choice ${c.label} empty`);
  });
  if (!LABELS.includes(q.correct_answer)) errors.push(`${at} correct_answer invalid`);
  if (!["easy", "medium", "hard"].includes(q.difficulty)) errors.push(`${at} difficulty invalid`);
  if (!q.explanation) errors.push(`${at} explanation missing`);
  const de = q.detailed_explanation;
  if (!de) { errors.push(`${at} detailed_explanation missing`); return; }
  for (const k of ["summary", "reason", "key_takeaway"]) if (!de[k]) errors.push(`${at} detailed_explanation.${k} missing`);
  if (!Array.isArray(de.choices) || de.choices.length !== LABELS.length) errors.push(`${at} detailed_explanation.choices must mirror choices`);
  else de.choices.forEach((c, j) => {
    if (c.label !== LABELS[j] || c.text !== q.choices[j]?.text) errors.push(`${at} de.choices[${j}] must mirror choices`);
    const mark = c.label === q.correct_answer ? "✓" : "✗";
    if (!c.explanation?.startsWith(mark)) errors.push(`${at} de.choices[${j}] explanation must start with ${mark}`);
  });
});

if (errors.length) {
  console.error(`${name}: ${errors.length} error(s)\n` + errors.join("\n"));
  process.exit(1);
}
const dist = Object.fromEntries(ALL_LABELS.map((l) => [l, batch.questions.filter((q) => q.correct_answer === l).length]));
console.error(`${name}: OK — ${batch.questions.length} questions, day ${batch.exam_day}, answers ${JSON.stringify(dist)}`);
if (checkOnly) process.exit(0);

const lit = (s) => (s == null ? "NULL" : "'" + String(s).replace(/'/g, "''") + "'");
const rows = batch.questions.map((q, i) => {
  // Legacy rows keep their original id; new rows get a stable id from file name + index.
  const id = q.id ?? createHash("md5").update(`${ID_PREFIX}:${name}:${i}`).digest("hex");
  return `(${lit(id)}, ${lit(SUBJECT_ID)}, 'PLE-CC1', 'AI-draft', ${batch.exam_day}, ${lit(q.scenario)}, ${lit(JSON.stringify(q.choices))}::jsonb, ${lit(q.correct_answer)}, ${lit(q.explanation)}, ${lit(JSON.stringify(q.detailed_explanation))}::jsonb, ${lit(q.difficulty)}, false, ${lit(AI_NOTES)}, 'active')`;
});
console.log(
  `INSERT INTO mcq_questions (id, subject_id, exam_type, exam_source, exam_day, scenario, choices, correct_answer, explanation, detailed_explanation, difficulty, is_ai_enhanced, ai_notes, status) VALUES\n` +
    rows.join(",\n") +
    (upsert
      ? `\nON CONFLICT (id) DO UPDATE SET scenario = EXCLUDED.scenario, choices = EXCLUDED.choices, correct_answer = EXCLUDED.correct_answer, explanation = EXCLUDED.explanation, detailed_explanation = EXCLUDED.detailed_explanation, difficulty = EXCLUDED.difficulty, exam_day = EXCLUDED.exam_day;`
      : `\nON CONFLICT (id) DO NOTHING;`)
);
