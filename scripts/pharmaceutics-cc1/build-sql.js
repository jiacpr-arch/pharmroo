// Validate the Pharmaceutics (เภสัชเทคโนโลยีและการวิเคราะห์) PLE-CC1 bank and
// emit one idempotent SQL file per block into ./sql/.
//
//   node scripts/pharmaceutics-cc1/build-sql.js
//
// Day 1 = d1-a..d1-d, Day 2 = d2-a..d2-d (30 questions each → 120 per day).
// Each block's rows are tagged via ai_notes = "pharmaceutics-cc1:<block>:<n>",
// so re-running a block's SQL replaces it instead of duplicating it.

const fs = require("fs");
const path = require("path");

const SUBJECT_ID = "0a7f8e61-3786-494c-9c54-b6edc17b03b6"; // Pharmaceutics
const BLOCKS = ["d1-a", "d1-b", "d1-c", "d1-d", "d2-a", "d2-b", "d2-c", "d2-d"];
const LABELS = ["A", "B", "C", "D", "E"];
const DIR = __dirname;

function validate(block, q, i) {
  const where = `${block}#${i + 1}`;
  const errs = [];
  if (typeof q.scenario !== "string" || q.scenario.trim().length < 10) errs.push("scenario");
  if (!Array.isArray(q.choices) || q.choices.length !== 5) errs.push("choices length");
  else q.choices.forEach((c, j) => {
    if (c.label !== LABELS[j] || typeof c.text !== "string" || !c.text.trim()) errs.push(`choice ${j}`);
  });
  if (!LABELS.includes(q.correct_answer)) errs.push("correct_answer");
  if (typeof q.explanation !== "string" || !q.explanation.trim()) errs.push("explanation");
  if (!["easy", "medium", "hard"].includes(q.difficulty)) errs.push("difficulty");
  const d = q.detailed_explanation;
  if (!d || typeof d !== "object") errs.push("detailed_explanation");
  else {
    for (const k of ["summary", "reason", "key_takeaway"]) {
      if (typeof d[k] !== "string" || !d[k].trim()) errs.push(`detail.${k}`);
    }
    if (!Array.isArray(d.choices) || d.choices.length !== 5) errs.push("detail.choices length");
    else d.choices.forEach((c, j) => {
      if (c.label !== LABELS[j]) errs.push(`detail.choice ${j} label`);
      if (c.is_correct !== (c.label === q.correct_answer)) errs.push(`detail.choice ${j} is_correct`);
      if (typeof c.explanation !== "string" || !c.explanation.trim()) errs.push(`detail.choice ${j} explanation`);
    });
    if (d.calculation_steps !== undefined && !Array.isArray(d.calculation_steps)) errs.push("calculation_steps");
  }
  if (/รูป|ภาพ(?!รวม)|โครงสร้างที่แสดง|ตารางด้านล่าง/.test(q.scenario)) errs.push("refers to a figure/table");
  return errs.map((e) => `${where}: ${e}`);
}

function dollar(s) {
  if (s.includes("$q$")) throw new Error("text contains $q$");
  return `$q$${s}$q$`;
}

const errors = [];
const stats = [];
const outDir = path.join(DIR, "sql");
fs.mkdirSync(outDir, { recursive: true });

for (const block of BLOCKS) {
  const file = path.join(DIR, `${block}.json`);
  if (!fs.existsSync(file)) { errors.push(`${block}: missing`); continue; }
  const qs = JSON.parse(fs.readFileSync(file, "utf8"));
  if (qs.length !== 30) errors.push(`${block}: ${qs.length} questions (want 30)`);
  qs.forEach((q, i) => errors.push(...validate(block, q, i)));

  const day = Number(block[1]);
  const offset = (block.charCodeAt(3) - 97) * 30; // a=0, b=30, c=60, d=90
  const values = qs.map((q, i) => {
    const detail = { ...q.detailed_explanation };
    if (!detail.calculation_steps?.length) delete detail.calculation_steps;
    return `(${[
      `'${SUBJECT_ID}'`, `'PLE-CC1'`, day, offset + i + 1,
      dollar(q.scenario.trim()),
      `${dollar(JSON.stringify(q.choices))}::jsonb`,
      `'${q.correct_answer}'`,
      dollar(q.explanation.trim()),
      `${dollar(JSON.stringify(detail))}::jsonb`,
      `'${q.difficulty}'`, "true",
      `'pharmaceutics-cc1:${block}:${i + 1}'`, `'active'`,
    ].join(", ")})`;
  });
  const sql =
    `delete from mcq_questions where ai_notes like 'pharmaceutics-cc1:${block}:%';\n` +
    `insert into mcq_questions (subject_id, exam_type, exam_day, question_number, scenario, choices, correct_answer, explanation, detailed_explanation, difficulty, is_ai_enhanced, ai_notes, status) values\n` +
    values.join(",\n") + ";\n";
  fs.writeFileSync(path.join(outDir, `${block}.sql`), sql);

  const ans = Object.fromEntries(LABELS.map((l) => [l, qs.filter((q) => q.correct_answer === l).length]));
  const diff = ["easy", "medium", "hard"].map((d) => qs.filter((q) => q.difficulty === d).length).join("/");
  stats.push(`${block}: n=${qs.length} ans=${JSON.stringify(ans)} e/m/h=${diff} sql=${(sql.length / 1024).toFixed(0)}KB`);
}

console.log(stats.join("\n"));
if (errors.length) {
  console.error(`\n${errors.length} problem(s):\n` + errors.join("\n"));
  process.exit(1);
}
console.log("\nOK");
