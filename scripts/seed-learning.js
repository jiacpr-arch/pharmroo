#!/usr/bin/env node
/**
 * Seed microlearning content (Duolingo-style) into the learning_* tables.
 *
 * - Ensures one learning_unit per mcq_subject (covers all subjects structurally).
 * - For subjects that have a content file in scripts/learning-content/<name>.json,
 *   inserts the authored lessons + cards and publishes them.
 * - Quizzes reuse the existing mcq_questions bank: each lesson is given the first
 *   N active question ids for its subject (else falls back to quiz_count at runtime).
 *
 * NOTE: content is authored by hand (Claude Code) — this script does NOT call any AI API.
 *
 * Usage:  node scripts/seed-learning.js
 *
 * Requires DATABASE_URL in .env.local (same DB the app uses).
 */

const fs = require("fs");
const path = require("path");
const { randomUUID } = require("crypto");
const { Client } = require("pg");

const PROJECT_ROOT = path.join(__dirname, "..");
const CONTENT_DIR = path.join(__dirname, "learning-content");

// ---- load DATABASE_URL from .env.local ----
function loadEnv() {
  const envPath = path.join(PROJECT_ROOT, ".env.local");
  if (!fs.existsSync(envPath)) {
    console.error("❌ ไม่พบ .env.local — ต้องมี DATABASE_URL");
    process.exit(1);
  }
  const env = {};
  fs.readFileSync(envPath, "utf-8")
    .split("\n")
    .forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) return;
      const [key, ...vals] = trimmed.split("=");
      if (key && vals.length) env[key.trim()] = vals.join("=").trim();
    });
  return env;
}

function loadContentFiles() {
  if (!fs.existsSync(CONTENT_DIR)) return {};
  const map = {};
  for (const file of fs.readdirSync(CONTENT_DIR)) {
    if (!file.endsWith(".json")) continue;
    try {
      const data = JSON.parse(
        fs.readFileSync(path.join(CONTENT_DIR, file), "utf-8")
      );
      if (data.subject) map[data.subject] = data;
    } catch (e) {
      console.warn(`⚠️  ข้ามไฟล์ ${file}: ${e.message}`);
    }
  }
  return map;
}

async function run() {
  const env = loadEnv();
  const connectionString = env.DATABASE_URL;
  if (!connectionString) {
    console.error("❌ ไม่พบ DATABASE_URL ใน .env.local");
    process.exit(1);
  }

  const content = loadContentFiles();
  const client = new Client({
    connectionString,
    ssl: connectionString.includes("localhost")
      ? false
      : { rejectUnauthorized: false },
  });
  await client.connect();

  const { rows: subjects } = await client.query(
    "SELECT id, name, name_th, icon FROM mcq_subjects ORDER BY name_th"
  );

  let unitsCreated = 0;
  let lessonsCreated = 0;
  let cardsCreated = 0;

  for (const subject of subjects) {
    const c = content[subject.name];
    const unitTitle = c?.unit?.title_th || subject.name_th;
    const unitDesc = c?.unit?.description_th || null;
    const unitIcon = c?.unit?.icon || subject.icon || "📘";
    // Units with real content get published; structural stubs stay draft.
    const unitStatus = c ? "published" : "draft";

    // Find or create the unit for this subject.
    const existing = await client.query(
      "SELECT id FROM learning_units WHERE subject_id = $1 LIMIT 1",
      [subject.id]
    );
    let unitId;
    if (existing.rows.length > 0) {
      unitId = existing.rows[0].id;
    } else {
      unitId = randomUUID();
      await client.query(
        `INSERT INTO learning_units (id, subject_id, title_th, description_th, icon, sort_order, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [unitId, subject.id, unitTitle, unitDesc, unitIcon, unitsCreated, unitStatus]
      );
      unitsCreated++;
      console.log(`📘 unit: ${unitTitle} (${subject.name}) [${unitStatus}]`);
    }

    if (!c || !Array.isArray(c.lessons) || c.lessons.length === 0) continue;

    // Skip if this unit already has lessons (idempotent — don't duplicate).
    const lessonCountRes = await client.query(
      "SELECT count(*)::int AS n FROM learning_lessons WHERE unit_id = $1",
      [unitId]
    );
    if (lessonCountRes.rows[0].n > 0) {
      console.log(`   ↳ มีบทเรียนอยู่แล้ว ข้าม (${unitTitle})`);
      continue;
    }

    // Active questions for this subject → fallback when a lesson doesn't
    // author its own inline quiz_questions.
    const qRes = await client.query(
      "SELECT id FROM mcq_questions WHERE subject_id = $1 AND status = 'active' LIMIT 50",
      [subject.id]
    );
    const fallbackQuestionIds = qRes.rows.map((r) => r.id);

    for (let li = 0; li < c.lessons.length; li++) {
      const lesson = c.lessons[li];
      const lessonId = randomUUID();
      const quizCount = lesson.quiz_count ?? 3;

      // Prefer inline quiz_questions authored alongside the lesson — these
      // are inserted into mcq_questions and bound to the lesson 1:1.
      let quizIds;
      const inlineQuiz = Array.isArray(lesson.quiz_questions)
        ? lesson.quiz_questions
        : [];
      if (inlineQuiz.length > 0) {
        quizIds = [];
        for (let qi = 0; qi < inlineQuiz.length; qi++) {
          const q = inlineQuiz[qi];
          const qid = randomUUID();
          await client.query(
            `INSERT INTO mcq_questions
               (id, subject_id, exam_type, scenario, choices, correct_answer,
                explanation, detailed_explanation, difficulty, status)
             VALUES ($1,$2,$3,$4,$5::jsonb,$6,$7,$8::jsonb,$9,'active')`,
            [
              qid,
              subject.id,
              q.exam_type ?? "NLE",
              q.scenario,
              JSON.stringify(q.choices),
              q.correct_answer,
              q.explanation ?? null,
              q.detailed_explanation ? JSON.stringify(q.detailed_explanation) : null,
              q.difficulty ?? "medium",
            ]
          );
          quizIds.push(qid);
        }
      } else {
        // Fallback: distinct slice of pre-existing question ids per lesson.
        const start = li * quizCount;
        quizIds = fallbackQuestionIds.slice(start, start + quizCount);
      }

      await client.query(
        `INSERT INTO learning_lessons
           (id, unit_id, title_th, subtitle_th, icon, sort_order, est_minutes, xp_reward, quiz_question_ids, quiz_count, status)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9::jsonb,$10,'published')`,
        [
          lessonId,
          unitId,
          lesson.title_th,
          lesson.subtitle_th ?? null,
          lesson.icon ?? "⭐",
          li,
          lesson.est_minutes ?? 5,
          lesson.xp_reward ?? 10,
          JSON.stringify(quizIds),
          quizIds.length || quizCount,
        ]
      );
      lessonsCreated++;

      const cards = Array.isArray(lesson.cards) ? lesson.cards : [];
      for (let ci = 0; ci < cards.length; ci++) {
        const card = cards[ci];
        await client.query(
          `INSERT INTO lesson_cards
             (id, lesson_id, card_type, title_th, body_md, sort_order, source)
           VALUES ($1,$2,$3,$4,$5,$6,'authored')`,
          [
            randomUUID(),
            lessonId,
            card.card_type ?? "concept",
            card.title_th ?? null,
            card.body_md ?? "",
            ci,
          ]
        );
        cardsCreated++;
      }
      console.log(
        `   ✅ lesson: ${lesson.title_th} (${cards.length} cards, quiz ${quizIds.length})`
      );
    }
  }

  console.log(
    `\n🎉 เสร็จ: +${unitsCreated} units, +${lessonsCreated} lessons, +${cardsCreated} cards`
  );
  await client.end();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
