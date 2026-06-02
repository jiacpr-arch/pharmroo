#!/usr/bin/env node
/**
 * Convert microlearning content JSON files into idempotent seed SQL.
 *
 * Emits a DO block per subject that: finds the subject by name, finds/creates its
 * learning_unit, REBUILDS the unit's lessons (deletes existing then re-inserts the
 * authored set), publishes the unit, and inserts lessons + cards.
 *
 * Quiz selection per lesson:
 *  - If the lesson has `quiz_keywords` (array), pick active mcq_questions for the
 *    subject whose scenario/explanation matches ANY keyword (topic-relevant quiz).
 *  - Otherwise fall back to a slice of the subject's active questions.
 *  - If neither yields rows, quiz_question_ids stays [] and the app pulls
 *    `quiz_count` questions by subject at runtime.
 *
 * NOTE: rebuild mode deletes a unit's existing lessons (cascading cards + progress)
 * so expanded content takes effect on re-seed. Run only for the files you intend
 * to (re)build. Content is authored by hand (no AI API).
 *
 * Usage:
 *   node scripts/learning-content-to-sql.js                 # all files
 *   node scripts/learning-content-to-sql.js Cardiovascular  # one file/subject
 */

const fs = require("fs");
const path = require("path");

const CONTENT_DIR = path.join(__dirname, "learning-content");

// Escape a value for a single-quoted SQL string literal.
function sq(v) {
  if (v === null || v === undefined) return "NULL";
  return "'" + String(v).replace(/'/g, "''") + "'";
}

// Dollar-quote body text (markdown). Picks a tag that doesn't collide.
function dollar(v) {
  let tag = "md";
  const body = String(v ?? "");
  while (body.includes("$" + tag + "$")) tag += "x";
  return `$${tag}$${body}$${tag}$`;
}

function blockFor(data) {
  const subject = data.subject;
  const unit = data.unit || {};
  const lessons = Array.isArray(data.lessons) ? data.lessons : [];
  const lines = [];

  // Outer DO block must use a tagged dollar-quote: card bodies may contain bare
  // "$$" (e.g. LaTeX display math), which would otherwise prematurely close a
  // "DO $$ ... $$" block. Pick a tag that doesn't collide with any body text.
  let doTag = "do";
  const allBodies = lessons
    .flatMap((l) => (Array.isArray(l.cards) ? l.cards : []))
    .map((c) => String(c.body_md ?? ""))
    .join("\n");
  while (allBodies.includes("$" + doTag + "$")) doTag += "x";

  const doOpen = "DO $" + doTag + "$";
  const doClose = "END $" + doTag + "$;";

  lines.push(`-- ===== ${subject} =====`);
  lines.push(doOpen);
  lines.push(
    `DECLARE v_subject text; v_unit text; v_qids text[]; l_qids text[]; l_id text;`
  );
  lines.push(`BEGIN`);
  lines.push(
    `  SELECT id INTO v_subject FROM mcq_subjects WHERE name = ${sq(subject)} LIMIT 1;`
  );
  lines.push(
    `  IF v_subject IS NULL THEN RAISE NOTICE ${sq("subject not found: " + subject)}; RETURN; END IF;`
  );
  lines.push(
    `  SELECT id INTO v_unit FROM learning_units WHERE subject_id = v_subject LIMIT 1;`
  );
  lines.push(`  IF v_unit IS NULL THEN`);
  lines.push(
    `    INSERT INTO learning_units (subject_id, title_th, description_th, icon, status)`
  );
  lines.push(
    `    VALUES (v_subject, ${sq(unit.title_th || subject)}, ${sq(unit.description_th || null)}, ${sq(unit.icon || "📘")}, 'published') RETURNING id INTO v_unit;`
  );
  lines.push(`  END IF;`);
  // Rebuild: clear existing authored lessons for this unit so expansions apply.
  lines.push(`  DELETE FROM learning_lessons WHERE unit_id = v_unit;`);
  lines.push(
    `  UPDATE learning_units SET title_th=${sq(unit.title_th || subject)}, description_th=${sq(unit.description_th || null)}, icon=${sq(unit.icon || "📘")}, status='published' WHERE id = v_unit;`
  );
  lines.push(
    `  SELECT array_agg(id) INTO v_qids FROM (SELECT id FROM mcq_questions WHERE subject_id = v_subject AND status='active' ORDER BY created_at LIMIT 100) t;`
  );

  lessons.forEach((lesson, li) => {
    const quizCount = lesson.quiz_count ?? 3;
    const kws = (
      Array.isArray(lesson.quiz_keywords) ? lesson.quiz_keywords : []
    ).filter((k) => typeof k === "string" && k.trim());

    if (kws.length > 0) {
      const ors = kws
        .map(
          (k) =>
            `scenario ILIKE '%' || ${sq(k)} || '%' OR explanation ILIKE '%' || ${sq(k)} || '%'`
        )
        .join(" OR ");
      lines.push(
        `  SELECT array_agg(id) INTO l_qids FROM (SELECT id FROM mcq_questions WHERE subject_id = v_subject AND status='active' AND (${ors}) ORDER BY created_at LIMIT ${quizCount}) t;`
      );
    } else {
      const start = li * quizCount + 1; // postgres arrays are 1-based
      const end = start + quizCount - 1;
      lines.push(`  l_qids := v_qids[${start}:${end}];`);
    }

    lines.push(
      `  INSERT INTO learning_lessons (unit_id,title_th,subtitle_th,icon,sort_order,est_minutes,xp_reward,quiz_question_ids,quiz_count,status)`
    );
    lines.push(
      `  VALUES (v_unit, ${sq(lesson.title_th)}, ${sq(lesson.subtitle_th || null)}, ${sq(lesson.icon || "⭐")}, ${li}, ${lesson.est_minutes ?? 5}, ${lesson.xp_reward ?? 10}, COALESCE(to_jsonb(l_qids),'[]'::jsonb), ${quizCount}, 'published') RETURNING id INTO l_id;`
    );
    const cards = Array.isArray(lesson.cards) ? lesson.cards : [];
    cards.forEach((card, ci) => {
      lines.push(
        `  INSERT INTO lesson_cards (lesson_id,card_type,title_th,body_md,sort_order,source) VALUES (l_id, ${sq(card.card_type || "concept")}, ${sq(card.title_th || null)}, ${dollar(card.body_md || "")}, ${ci}, 'authored');`
      );
    });
  });

  lines.push(doClose);
  return lines.join("\n");
}

function main() {
  const filter = process.argv[2];
  if (!fs.existsSync(CONTENT_DIR)) {
    console.error("no content dir");
    process.exit(1);
  }
  const files = fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".json"))
    .filter((f) => !filter || f === `${filter}.json` || f === filter);

  for (const f of files) {
    const data = JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, f), "utf-8"));
    console.log(blockFor(data));
    console.log("");
  }
}

main();
