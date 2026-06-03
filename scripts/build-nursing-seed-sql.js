// Generates per-LESSON SQL files for nursing seed — each file is small
// enough to fit in a single MCP execute_sql call.
const fs = require("fs");
const path = require("path");
const { randomBytes } = require("crypto");

const SUBJECT_IDS = {
  NursingAdult: "16adacf2-d4eb-4e9c-bd77-ff3b3109bc18",
  NursingCommunity: "9eda2b26-b92f-4f30-9da3-8f444fdbb8eb",
  NursingGeriatric: "cb723939-6a70-41a9-be90-ee716258b43f",
  NursingLawEthics: "dc47bfd3-1b77-4711-a549-55ae09ab5504",
  NursingMaternal: "325b8e2e-d327-41a9-ae4b-ddde9bd50fdb",
  NursingMidwifery: "5326e080-3f7c-453a-b952-e1b880c36ee8",
  NursingPediatric: "68672cdf-5c26-4d4e-9b7b-32af8640eba9",
  NursingPsych: "a8a8047e-e2e9-4f3f-95a4-7e9788de7e0e",
};
const UNIT_IDS = {
  NursingAdult: "887c7c635c98fb9df9fc4c532939aaa9",
  NursingCommunity: "d61fb856fa1d5ac60ba3219a07da4d95",
  NursingGeriatric: "6b9cc5c71a529fda6ddca43b350a1509",
  NursingLawEthics: "17850d738010c0d2eb484f822523eab5",
  NursingMaternal: "03e5f54202f9718111711ba749eb5dc3",
  NursingMidwifery: "f139ccce8cd06aa46dbbbd56125ea9fe",
  NursingPediatric: "0e61b486173e9cd1d506a53ea7a238a7",
  NursingPsych: "246a48ce22c04768bbb08b7cb3392eb3",
};

const hexId = () => randomBytes(16).toString("hex");
const esc = (v) => v === null || v === undefined ? "NULL" : typeof v === "number" ? String(v) : typeof v === "boolean" ? (v ? "TRUE" : "FALSE") : "'" + String(v).replace(/'/g, "''") + "'";
const jsn = (v) => v === null || v === undefined ? "NULL::jsonb" : esc(JSON.stringify(v)) + "::jsonb";

const outdir = process.argv[2] || "/tmp/nursing-seed";
fs.mkdirSync(outdir, { recursive: true });
const CONTENT_DIR = path.join(__dirname, "learning-content");

// Combined delete + unit updates
const setupLines = [
  `DELETE FROM learning_lessons WHERE unit_id IN (${Object.values(UNIT_IDS).map(esc).join(", ")});`,
];
for (const [subjectName, subjectId] of Object.entries(SUBJECT_IDS)) {
  const file = path.join(CONTENT_DIR, `${subjectName}.json`);
  if (!fs.existsSync(file)) continue;
  const data = JSON.parse(fs.readFileSync(file, "utf-8"));
  const unitId = UNIT_IDS[subjectName];
  setupLines.push(
    `UPDATE learning_units SET title_th = ${esc(data.unit.title_th)}, description_th = ${esc(data.unit.description_th)}, icon = ${esc(data.unit.icon || "📘")}, status = 'published' WHERE id = ${esc(unitId)};`
  );
}
fs.writeFileSync(path.join(outdir, "00-setup.sql"), setupLines.join("\n") + "\n");

// One file per lesson
let fileIdx = 1;
for (const [subjectName, subjectId] of Object.entries(SUBJECT_IDS)) {
  const file = path.join(CONTENT_DIR, `${subjectName}.json`);
  if (!fs.existsSync(file)) continue;
  const data = JSON.parse(fs.readFileSync(file, "utf-8"));
  const unitId = UNIT_IDS[subjectName];

  data.lessons.forEach((lesson, li) => {
    const lessonId = hexId();
    const qq = Array.isArray(lesson.quiz_questions) ? lesson.quiz_questions : [];
    const quizIds = [];
    const lines = [];

    for (const q of qq) {
      const qid = hexId();
      lines.push(
        `INSERT INTO mcq_questions (id, subject_id, exam_type, scenario, choices, correct_answer, explanation, detailed_explanation, difficulty, status) VALUES (${esc(qid)}, ${esc(subjectId)}, ${esc(q.exam_type || "NLE")}, ${esc(q.scenario)}, ${jsn(q.choices)}, ${esc(q.correct_answer)}, ${esc(q.explanation || null)}, ${jsn(q.detailed_explanation || null)}, ${esc(q.difficulty || "medium")}, 'active');`
      );
      quizIds.push(qid);
    }
    lines.push(
      `INSERT INTO learning_lessons (id, unit_id, title_th, subtitle_th, icon, sort_order, est_minutes, xp_reward, quiz_question_ids, quiz_count, status) VALUES (${esc(lessonId)}, ${esc(unitId)}, ${esc(lesson.title_th)}, ${esc(lesson.subtitle_th || null)}, ${esc(lesson.icon || "⭐")}, ${li}, ${lesson.est_minutes || 5}, ${lesson.xp_reward || 10}, ${jsn(quizIds)}, ${quizIds.length || (lesson.quiz_count || 3)}, 'published');`
    );
    (lesson.cards || []).forEach((card, ci) => {
      lines.push(
        `INSERT INTO lesson_cards (id, lesson_id, card_type, title_th, body_md, sort_order, source) VALUES (${esc(hexId())}, ${esc(lessonId)}, ${esc(card.card_type || "concept")}, ${esc(card.title_th || null)}, ${esc(card.body_md || "")}, ${ci}, 'authored');`
      );
    });
    const safeName = subjectName + "-" + li;
    const outfile = path.join(outdir, `${String(fileIdx).padStart(2, "0")}-${safeName}.sql`);
    fs.writeFileSync(outfile, lines.join("\n") + "\n");
    const size = fs.statSync(outfile).size;
    console.error(`${String(fileIdx).padStart(2, "0")} ${subjectName}[${li}] ${lesson.title_th.slice(0,40)}: ${lines.length} stmts, ${size}B`);
    fileIdx++;
  });
}
