"use client";

// เกมร้านยา — จอเกมทั้งหมด (title → play → debrief)
// ยกมาจาก SimRunner ของ morroo แล้วตัดส่วน ACLS (ECG/CPR/EtCO2), analytics
// และ CTA แบบ LINE ออก; บันทึกผลผ่าน /api/game/* (ดู lib/game/record.ts)

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { ArrowRight, Home, RefreshCw, ShoppingBag, Volume2, VolumeX, X, Zap } from "lucide-react";
import { MENTOR_ID, resolveCharacter, type GameDbCharacter } from "@/lib/game/characters";
import { gameBgUrl } from "@/lib/game/backgrounds";
import CharacterSprite from "@/components/game/CharacterSprite";
import {
  DEFAULT_DIFFICULTY, DIFFICULTY, applyFx, createInitialState, fmtTime,
  getDifficulty, gradeFor, nextNode, recordCorrect, recordWrong,
  scoreFor, shuffled, takeLabelDraft,
} from "@/lib/game/engine";
import { initAudio, playBeep, playSuccessSound, playWarningBeep } from "@/lib/game/sound";
import { claimPendingLocalRuns, recordGameRun, type RecordedRun } from "@/lib/game/record";
import { GAME_BADGE_NAMES } from "@/lib/game/xp";
import { xpToRank } from "@/lib/game/rank";
import { nextScenarioSlug } from "@/lib/game/scenarios";
import DebriefResultCard from "@/components/game/DebriefResultCard";
import DebriefLoginCta from "@/components/game/DebriefLoginCta";
import RankProgressCard from "@/components/game/RankProgressCard";
import {
  parseEmphasis,
  type ChoiceNode, type ChoiceOption, type NodeFx, type Pose,
  type GameScenario, type GameState, type TextSegment,
} from "@/lib/game/types";
import "./game.css";

const HISCORE_PREFIX = "pharmroo_game_hiscore";
const MUTE_KEY = "pharmroo_game_muted";
const DIFF_KEY = "pharmroo_game_difficulty";
/** เคยเห็นคำใบ้ "แตะเพื่อเล่นต่อ" แล้วหรือยัง — โชว์ครั้งเดียวต่อเครื่อง */
const TAP_COACH_KEY = "pharmroo_game_tap_coach";

const isBrowser = typeof window !== "undefined";
const hiscoreKey = (slug: string, diff: string) => `${HISCORE_PREFIX}_${slug}_${diff}`;
const readHiscore = (slug: string, diff: string) =>
  isBrowser ? Number(localStorage.getItem(hiscoreKey(slug, diff)) || 0) : 0;

// สำเนาสถานะ engine สำหรับ render (render ห้ามอ่าน ref ตรงๆ)
function snapshot(st: GameState): GameState {
  return { ...st, timeline: [...st.timeline] };
}

interface Speaker { who: string; pose: Pose; popN: number }
interface Result { won: boolean; grade: string; score: number; isHiscore: boolean }
interface LabelCard {
  drugName: string;
  patientLabel: string;
  entries: { heading: string; text: string }[];
}
type ChoiceData = ChoiceNode["choice"];

/** บทพูดที่พิมพ์ทีละตัว — reveal ตามจำนวนตัวอักษร ไม่มี HTML */
function DlgText({ segments, count }: { segments: TextSegment[]; count: number }) {
  const parts: { key: number; em: boolean; text: string }[] = [];
  let remaining = count;
  for (let i = 0; i < segments.length; i++) {
    const s = segments[i];
    const take = Math.max(0, Math.min(s.text.length, remaining));
    remaining -= take;
    if (take) parts.push({ key: i, em: s.em, text: s.text.slice(0, take) });
  }
  return (
    <>
      {parts.map((p) => (
        <span key={p.key} className={p.em ? "cbs-em" : undefined}>
          {p.text}
        </span>
      ))}
    </>
  );
}

interface GameRunnerProps {
  scenario: GameScenario;
  /** ตัวละครจาก DB (เผื่ออนาคต) — เพิ่มจาก built-in */
  characters?: GameDbCharacter[];
  /** ข้ามจอ title แล้วเข้าเกมทันที (`?start=1`) */
  autostart?: boolean;
  /**
   * XP สะสมของผู้เล่น — โชว์ยศบนจอ title ให้เห็นเป้าก่อนเริ่มเล่น
   * null = ไม่ได้ล็อกอิน (จอ title ไม่แสดงแถบยศ)
   */
  playerXp?: number | null;
}

const HUB_HREF = "/game";

export default function GameRunner({
  scenario, characters, autostart = false, playerXp = null,
}: GameRunnerProps) {
  const dbCharacters = useMemo(
    () => new Map((characters ?? []).map((c) => [c.slug, c])),
    [characters],
  );
  const { status } = useSession();
  // endCase เป็น plain function ที่ถูกเรียกจาก timer — อ่านผ่าน ref เพื่อให้ได้ค่าล่าสุดเสมอ
  const loggedInRef = useRef(false);
  useEffect(() => { loggedInRef.current = status === "authenticated"; }, [status]);

  const [reducedMotion] = useState(
    () => isBrowser && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  const [difficulty, setDifficulty] = useState(
    () => (isBrowser && localStorage.getItem(DIFF_KEY)) || DEFAULT_DIFFICULTY,
  );
  const [muted, setMuted] = useState(() => isBrowser && localStorage.getItem(MUTE_KEY) === "1");
  const mutedRef = useRef(muted);
  useEffect(() => { mutedRef.current = muted; }, [muted]);

  // เพิ่งล็อกอินจาก CTA ท้ายเกมแล้วเด้งกลับมา — ยกเคสที่เล่นไว้เข้าบัญชีทันที
  useEffect(() => {
    if (playerXp === null) return;
    void claimPendingLocalRuns();
  }, [playerXp]);

  // ---- engine state: mutable ใน ref (logic) + snapshot state (render) ----
  const S = useRef<GameState>(createInitialState(DEFAULT_DIFFICULTY));
  const [view, setView] = useState<GameState>(() => snapshot(createInitialState(DEFAULT_DIFFICULTY)));

  const [screen, setScreen] = useState<"title" | "game" | "debrief">("title");
  const [confirmExit, setConfirmExit] = useState(false);
  const [speaker, setSpeaker] = useState<Speaker | null>(null);
  const [plate, setPlate] = useState<{ name: string } | null>(null); // override (time-skip)
  const [dlgSegments, setDlgSegments] = useState<TextSegment[]>([]);
  const [dlgCount, setDlgCount] = useState(0);
  const [typing, setTyping] = useState(false);
  const [choice, setChoice] = useState<{ q: string; options: ChoiceOption[]; hintTgt: string | null; tried: Set<string>; shelf: boolean } | null>(null);
  const [decisionLeft, setDecisionLeft] = useState(getDifficulty(difficulty).decisionTime);
  const [drama, setDrama] = useState<"red" | "white" | null>(null);
  const [inter, setInter] = useState<{ text: string; green: boolean } | null>(null);
  const [labelCard, setLabelCard] = useState<LabelCard | null>(null);
  const [flashN, setFlashN] = useState(0);
  const [redN, setRedN] = useState(0);
  const [shaking, setShaking] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [reward, setReward] = useState<RecordedRun | null>(null);
  const [hiscore, setHiscore] = useState(() => readHiscore(scenario.slug, difficulty));

  const timers = useRef<{
    type: ReturnType<typeof setTimeout> | null;
    dec: ReturnType<typeof setInterval> | null;
    misc: ReturnType<typeof setTimeout>[];
  }>({ type: null, dec: null, misc: [] });
  const busyRef = useRef(false);
  const [awaitTap, setAwaitTap] = useState(false);
  // คำใบ้เต็มจอตอนเปิดเกมครั้งแรก — โหมด autostart มาเจอบทพูดค่อยๆ พิมพ์โดยไม่มีปุ่มอะไรเลย
  const [tapCoach, setTapCoach] = useState(false);
  const currentChoiceRef = useRef<ChoiceData | null>(null);
  const retryChoiceRef = useRef<ChoiceData | null>(null);
  // ข้อที่ตอบผิดไปแล้วของคำถามปัจจุบัน — ขีดฆ่า + ปิดไม่ให้เลือกซ้ำตอนตอบใหม่
  const wrongPicksRef = useRef<Set<string>>(new Set());
  const hintUsedRef = useRef(false); // โหมดง่าย: ใบ้หมวดหลังตอบผิดครั้งแรกของแต่ละจุด
  const typeDoneRef = useRef<(() => void) | null>(null);
  const fullSegmentsRef = useRef<TextSegment[]>([]);
  const popCounter = useRef(0);

  const clearAllTimers = useCallback(() => {
    const t = timers.current;
    if (t.type) clearTimeout(t.type);
    if (t.dec) clearInterval(t.dec);
    t.misc.forEach(clearTimeout);
    t.type = null; t.dec = null; t.misc = [];
  }, []);
  useEffect(() => clearAllTimers, [clearAllTimers]);

  // เข้าเกมทันทีโดยไม่ต้องกดจอ title ก่อน — ยิงครั้งเดียวตอน mount
  const autostartedRef = useRef(false);
  useEffect(() => {
    if (!autostart || autostartedRef.current) return;
    autostartedRef.current = true;
    startGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autostart]);

  // ---- flow ทั้งหมดเป็น plain functions: เรียกไขว้/เรียกซ้ำกันได้อิสระ
  //      ปลอดภัยจาก stale closure เพราะแตะเฉพาะ ref + state setter (stable) ----

  function syncView() {
    setView(snapshot(S.current));
  }

  function later(fn: () => void, ms: number) {
    timers.current.misc.push(setTimeout(fn, ms));
  }

  function vibrate(pattern: number[]) {
    if (isBrowser && navigator.vibrate) navigator.vibrate(pattern);
  }

  function sfx(fn: () => void) {
    if (!mutedRef.current) fn();
  }

  function soundForFx(fx?: NodeFx) {
    if (!fx) return;
    if (fx.alert) sfx(playWarningBeep);
  }

  function totalChars(segments: TextSegment[]) {
    return segments.reduce((n, s) => n + s.text.length, 0);
  }

  function finishTyping() {
    if (timers.current.type) clearTimeout(timers.current.type);
    timers.current.type = null;
    setDlgCount(totalChars(fullSegmentsRef.current));
    setTyping(false);
    const done = typeDoneRef.current;
    typeDoneRef.current = null;
    if (done) done();
  }

  function typeText(text: string, onDone?: () => void) {
    if (timers.current.type) clearTimeout(timers.current.type);
    const segments = parseEmphasis(text);
    fullSegmentsRef.current = segments;
    typeDoneRef.current = onDone || null;
    setTyping(true);
    setDlgSegments(segments);
    setDlgCount(0);
    const total = totalChars(segments);
    let i = 0;
    const step = () => {
      if (i >= total) { finishTyping(); return; }
      i += 1;
      setDlgCount(i);
      timers.current.type = setTimeout(step, reducedMotion ? 0 : 16);
    };
    step();
  }

  function doShake() {
    setShaking(true);
    later(() => setShaking(false), 450);
  }

  function doBigMoment() {
    vibrate([90, 50, 160]);
    if (!reducedMotion) {
      setFlashN((n) => n + 1);
      doShake();
    }
  }

  function endCase(won: boolean) {
    clearAllTimers();
    const st = S.current;
    const grade = gradeFor(st, won);
    const score = scoreFor(st, won);
    const key = hiscoreKey(scenario.slug, st.difficulty);
    let isHiscore = false;
    if (isBrowser && score > Number(localStorage.getItem(key) || 0)) {
      localStorage.setItem(key, String(score));
      setHiscore(score);
      isHiscore = score > 0;
    }
    if (won) sfx(playSuccessSound);
    // บันทึกผล + XP/Badge เบื้องหลัง — จอ debrief โชว์ทันที รางวัลตามมา
    setReward(null);
    void recordGameRun(scenario.slug, st, { won, grade, score }, loggedInRef.current).then(setReward);
    syncView();
    setResult({ won, grade, score, isHiscore });
    setChoice(null);
    setInter(null);
    setLabelCard(null);
    setScreen("debrief");
    if (isBrowser) window.scrollTo(0, 0);
  }

  function showChoice(c: ChoiceData) {
    if (currentChoiceRef.current !== c) wrongPicksRef.current = new Set();
    currentChoiceRef.current = c;
    setDrama("white");
    const diff = getDifficulty(S.current.difficulty);
    // โหมดง่าย: หลังพลาดจุดนี้ไปแล้วครั้งนึง ใบ้หมวดที่ถูก + dim ตัวที่ผิด
    const hintTgt = diff.hints && hintUsedRef.current
      ? (c.options.find((o) => o.ok)?.tgt || null)
      : null;
    setChoice({ q: c.q, options: shuffled(c.options), hintTgt, tried: new Set(wrongPicksRef.current), shelf: !!c.shelf });
    setDecisionLeft(diff.decisionTime);
    if (timers.current.dec) clearInterval(timers.current.dec);
    let left = diff.decisionTime;
    timers.current.dec = setInterval(() => {
      left -= 0.25;
      setDecisionLeft(left);
      if (left <= 0) {
        if (timers.current.dec) clearInterval(timers.current.dec);
        timers.current.dec = null;
        pick({
          tgt: "—",
          label: "",
          ok: false,
          timeout: true,
          why: "หมดเวลา — ลูกค้ายืนรอที่เคาน์เตอร์ และคุณยังไม่ได้ตัดสินใจ",
          worsen: true,
        });
      }
    }, 250);
  }

  function runNode(node: NonNullable<ReturnType<typeof nextNode>>) {
    const st = S.current;
    if ("t" in node && node.t) st.simTime += node.t;
    syncView();

    if ("say" in node) {
      const { who, pose, text, fx } = node.say;
      soundForFx(fx);
      applyFx(st, fx);
      setDrama(pose === "panic" ? "red" : null);
      popCounter.current += 1;
      setSpeaker({ who, pose, popN: popCounter.current });
      setPlate(null);
      setAwaitTap(true);
      typeText(text);
      syncView();
      return;
    }

    if ("inter" in node) {
      busyRef.current = true;
      soundForFx(node.fx);
      applyFx(st, node.fx);
      if (node.drama) setDrama(node.drama);
      syncView();
      doBigMoment();
      setInter({ text: node.inter, green: !!node.green });
      later(() => {
        setInter(null);
        busyRef.current = false;
        advance();
      }, reducedMotion ? 350 : 1050);
      return;
    }

    if ("skip" in node) {
      busyRef.current = true;
      setDrama(null);
      popCounter.current += 1;
      setSpeaker({ who: MENTOR_ID, pose: "idle", popN: popCounter.current });
      setPlate({ name: "— เวลาเดินต่อ —" });
      setAwaitTap(false);
      typeText(`⏩ ${node.skip}…`, () => {
        later(() => {
          busyRef.current = false;
          advance();
        }, reducedMotion ? 200 : 700);
      });
      return;
    }

    if ("choice" in node) {
      showChoice(node.choice);
      return;
    }

    if ("labelPreview" in node) {
      busyRef.current = true;
      setDrama(null);
      setAwaitTap(false);
      const entries = takeLabelDraft(st);
      setLabelCard({ drugName: node.labelPreview.drugName, patientLabel: node.labelPreview.patientLabel, entries });
      syncView();
      return;
    }

    if ("end" in node) {
      endCase(true);
      return;
    }

    advance();
  }

  function advance() {
    const node = nextNode(S.current, scenario.story);
    if (!node) { endCase(true); return; }
    runNode(node);
  }

  function pick(option: ChoiceOption) {
    if (timers.current.dec) { clearInterval(timers.current.dec); timers.current.dec = null; }
    setChoice(null);
    const st = S.current;

    if (option.ok) {
      recordCorrect(st, option);
      currentChoiceRef.current = null;
      hintUsedRef.current = false; // จุดถัดไปเริ่มใหม่ ไม่ใบ้
      syncView();
      advance();
      return;
    }

    recordWrong(st, option);
    if (option.label) wrongPicksRef.current.add(option.label); // timeout ไม่มี label — ไม่ต้องขีด
    hintUsedRef.current = true; // จุดนี้เคยพลาด — โหมดง่ายจะใบ้ตอนเล่นซ้ำ
    vibrate([60, 40, 60]);
    sfx(() => playBeep(160, 0.28, 0.35)); // เสียงผิดต่ำ
    if (!reducedMotion) {
      setRedN((n) => n + 1);
      doShake();
    }
    syncView();

    popCounter.current += 1;
    setSpeaker({ who: MENTOR_ID, pose: "stern", popN: popCounter.current });
    setPlate(null);
    setDrama("red");

    // โหมดยาก: ไม่เฉลยเหตุผลตอนพลาด (เก็บไว้ debrief) — เพิ่มความกดดัน
    const showWhy = getDifficulty(st.difficulty).showWhyOnWrong;
    const whyText = showWhy && option.why ? ` ${option.why}` : "";

    if (st.hp <= 0) {
      setAwaitTap(false);
      typeText(`**ผู้ป่วยได้รับอันตรายจากยา…**${whyText}`, () => {
        later(() => endCase(false), reducedMotion ? 400 : 1400);
      });
      return;
    }

    // เตือนแล้วให้ตัดสินใจข้อเดิมซ้ำ (สภาพแย่ลงแล้ว)
    retryChoiceRef.current = currentChoiceRef.current;
    setAwaitTap(true);
    typeText(
      `**เดี๋ยวก่อน!**${whyText}${option.worsen ? " — อาการผู้ป่วยแย่ลง!" : ""} แตะจอเพื่อ**ตอบใหม่** (ข้อที่ผิดถูกขีดฆ่าไว้แล้ว)`,
    );
  }

  function onDialogTap() {
    // โหมด autostart ไม่มี user gesture ตอน startGame — ปลดล็อก AudioContext ที่การแตะครั้งแรกแทน
    if (!mutedRef.current) initAudio();
    if (tapCoach) {
      setTapCoach(false);
      if (isBrowser) {
        try { localStorage.setItem(TAP_COACH_KEY, "1"); } catch { /* โหมดส่วนตัว */ }
      }
    }
    if (busyRef.current) return;
    if (timers.current.type) { finishTyping(); return; }
    if (!awaitTap) return;
    setAwaitTap(false);
    if (retryChoiceRef.current) {
      const c = retryChoiceRef.current;
      retryChoiceRef.current = null;
      showChoice(c);
      return;
    }
    advance();
  }

  function onLabelCardTap() {
    setLabelCard(null);
    busyRef.current = false;
    advance();
  }

  function startGame() {
    clearAllTimers();
    if (!mutedRef.current) initAudio(); // ปลดล็อก AudioContext ตอนผู้ใช้แตะปุ่ม
    S.current = createInitialState(difficulty);
    syncView();
    busyRef.current = false;
    setAwaitTap(false);
    currentChoiceRef.current = null;
    retryChoiceRef.current = null;
    wrongPicksRef.current = new Set();
    hintUsedRef.current = false;
    setResult(null);
    setReward(null);
    setChoice(null);
    setInter(null);
    setLabelCard(null);
    setDrama(null);
    setSpeaker(null);
    setPlate(null);
    setDlgSegments([]);
    setDlgCount(0);
    setScreen("game");
    // สอนเฉพาะคนที่ไม่เคยเล่น — คนเล่นซ้ำไม่ต้องเจอซ้ำ
    if (isBrowser) {
      try { setTapCoach(localStorage.getItem(TAP_COACH_KEY) !== "1"); } catch { setTapCoach(false); }
    }
    later(() => advance(), reducedMotion ? 100 : 400);
  }

  function chooseDifficulty(id: string) {
    setDifficulty(id);
    if (isBrowser) localStorage.setItem(DIFF_KEY, id);
    setHiscore(readHiscore(scenario.slug, id));
  }

  function toggleMute() {
    setMuted((m) => {
      const next = !m;
      if (isBrowser) localStorage.setItem(MUTE_KEY, next ? "1" : "0");
      return next;
    });
  }

  const nextSlug = nextScenarioSlug(scenario.slug);

  // ============ TITLE ============
  if (screen === "title") {
    return (
      <div className="cbs-app">
        <section className="cbs-title">
          <div className="cbs-eyebrow">Drugstore · Counter Shift</div>
          <h1>
            ฟาร์มรู้<br />
            <span className="cbs-gold-text">เกมร้านยา</span><br />
            {scenario.title}
          </h1>
          <p className="cbs-title-sub">
            {scenario.subtitle}<br />
            คุณคือ <b>เภสัชกรประจำร้าน</b> — ทุกคำถามและทุกเม็ดยาที่จ่ายมีผลต่อผู้ป่วย<br />
            ซักประวัติไม่ครบ จ่ายผิด อาการแย่ลงจริง เวลาไม่เคยรอใคร
          </p>
          <div className="cbs-diff-group" role="group" aria-label="เลือกระดับความยาก">
            <span className="cbs-diff-label">ระดับความยาก</span>
            <div className="cbs-diff-btns">
              {Object.values(DIFFICULTY).map((d) => (
                <button
                  key={d.id}
                  type="button"
                  className={`cbs-diff-btn ${difficulty === d.id ? "cbs-diff-on" : ""}`}
                  onClick={() => chooseDifficulty(d.id)}
                  aria-pressed={difficulty === d.id}
                >
                  <span className="cbs-diff-name">{d.label}</span>
                  <span className="cbs-diff-meta">{d.decisionTime}s · ♥{d.hp}</span>
                </button>
              ))}
            </div>
          </div>
          {playerXp !== null && (() => {
            const { rank, next, xpForNext, xpIntoRank } = xpToRank(playerXp);
            return (
              <div className="cbs-title-rank">
                <span aria-hidden>{rank.icon}</span>
                <span className="cbs-title-rank-name">{rank.title}</span>
                {next && (
                  <span className="cbs-title-rank-next">
                    อีก {(xpForNext - xpIntoRank).toLocaleString("th-TH")} XP ถึง{next.title}
                  </span>
                )}
              </div>
            );
          })()}
          <div className="cbs-title-row">
            {hiscore > 0 && <div className="cbs-hiscore-chip">HI-SCORE {hiscore}</div>}
            <button
              type="button"
              className="cbs-icon-btn"
              onClick={toggleMute}
              aria-label={muted ? "เปิดเสียง" : "ปิดเสียง"}
            >
              {muted ? <VolumeX size={16} strokeWidth={2.4} /> : <Volume2 size={16} strokeWidth={2.4} />}
            </button>
          </div>
          <button type="button" className="cbs-btn-main" onClick={startGame}>
            <ShoppingBag size={18} strokeWidth={2.6} style={{ display: "inline", verticalAlign: "-3px", marginRight: 8 }} />
            รับลูกค้า
          </button>
          <Link href={HUB_HREF} className="cbs-btn-ghost">
            <Home size={15} strokeWidth={2.4} style={{ display: "inline", verticalAlign: "-2px", marginRight: 6 }} />
            เลือกเคสอื่น
          </Link>
          <div className="cbs-note">DECISION GAME · COMMUNITY PHARMACY · PHARMRU</div>
        </section>
      </div>
    );
  }

  // ============ DEBRIEF ============
  if (screen === "debrief" && result) {
    const st = view;
    return (
      <div className="cbs-app">
        <section className={`cbs-debrief ${result.won ? "cbs-winbg" : "cbs-losebg"}`}>
          <div className={`cbs-stamp ${result.won ? "cbs-win" : "cbs-lose"}`}>
            {result.won ? "จ่ายยาสำเร็จ" : "เกิดเหตุไม่พึงประสงค์"}
          </div>
          <div className="cbs-diff-badge">โหมด {getDifficulty(st.difficulty).label}</div>
          <p className="cbs-verdict-sub">
            {result.won
              ? "ซักประวัติครบ จ่ายยาถูกต้อง แนะนำครบถ้วน — เคสนี้เป็นของคุณ"
              : "ผู้ป่วยได้รับผลกระทบจากการตัดสินใจที่พลาด — อ่าน debrief ด้านล่าง แล้วกลับมาแก้มือ"}
            {result.isHiscore && <><br />🏆 New Hi-Score: {result.score}</>}
          </p>
          {(st.referred || st.dispensed > 0 || st.counseled) && (
            <div className="cbs-outcome-row">
              {st.referred && <span className="cbs-outcome-chip cbs-outcome-refer">ส่งต่อแพทย์ ✓</span>}
              {st.dispensed > 0 && <span className="cbs-outcome-chip">จ่ายยา {st.dispensed} รายการ</span>}
              {st.counseled && <span className="cbs-outcome-chip">ให้คำแนะนำครบ ✓</span>}
            </div>
          )}
          {reward && reward.loggedIn && reward.xpEarned > 0 && (
            <div className="cbs-reward-row">
              <span className="cbs-xp-pill"><Zap size={13} strokeWidth={2.6} /> +{reward.xpEarned} XP</span>
              {reward.newBadges.map((id) => (
                <span key={id} className="cbs-badge-pill">🏅 {GAME_BADGE_NAMES[id] ?? id}</span>
              ))}
            </div>
          )}
          <DebriefResultCard result={result} state={st} />
          {reward && (reward.loggedIn || reward.isLocal) && <RankProgressCard {...reward} />}
          {reward && !reward.loggedIn && (
            <DebriefLoginCta
              slug={scenario.slug}
              localRuns={reward.localRuns}
              rankTitle={reward.rankAfter?.rank.title ?? null}
            />
          )}
          <div className="cbs-tl-title">TIMELINE การตัดสินใจของคุณ</div>
          <div className="cbs-timeline">
            {st.timeline.map((it, i) => (
              <div key={i} className={`cbs-tl-item ${it.ok ? "cbs-ok" : "cbs-err"}`}>
                <span className="cbs-tl-time">{fmtTime(it.t)}</span>
                <span className="cbs-tl-dot" />
                <span>
                  {it.text}
                  {it.note && <span className="cbs-tl-note">{it.note}</span>}
                </span>
              </div>
            ))}
          </div>
          <div className="cbs-debrief-actions">
            <button type="button" className="cbs-btn-main" onClick={startGame}>
              <RefreshCw size={16} strokeWidth={2.6} style={{ display: "inline", verticalAlign: "-2px", marginRight: 8 }} />
              เล่นเคสนี้อีกครั้ง
            </button>
            {nextSlug !== scenario.slug && (
              <Link href={`/game/${nextSlug}?start=1`} className="cbs-btn-ghost">
                <ArrowRight size={15} strokeWidth={2.4} style={{ display: "inline", verticalAlign: "-2px", marginRight: 6 }} />
                เล่นเคสถัดไป
              </Link>
            )}
            <Link href={HUB_HREF} className="cbs-btn-ghost">เลือกเคสอื่น</Link>
          </div>
        </section>
      </div>
    );
  }

  // ============ GAME ============
  const st = view;
  const char = speaker ? resolveCharacter(speaker.who, dbCharacters) : null;
  const plateName = plate?.name || char?.name || " ";
  const plateColors = plate ? null : char?.plate || null;
  const gameDiff = getDifficulty(st.difficulty);
  const maxHp = st.maxHp || gameDiff.hp;
  const timerPct = Math.max(0, (decisionLeft / gameDiff.decisionTime) * 100);

  return (
    <div className={`cbs-app ${shaking ? "cbs-shake" : ""}`}>
      <section className="cbs-game">
        {/* พื้นที่แตะ = ทั้งเวที ไม่ใช่แค่กล่องบทพูด (onDialogTap กันไว้อยู่แล้ว
            เมื่อกำลังแสดงตัวเลือก จึงไม่ชนกับปุ่มตอบ) */}
        <div
          className={`cbs-stage ${drama === "red" ? "cbs-drama-red" : drama === "white" ? "cbs-drama" : ""}`}
          style={{ "--cbs-bg": `url('${gameBgUrl(scenario.bg)}')` } as React.CSSProperties}
          onClick={onDialogTap}
        >
          <div className="cbs-hud">
            <div className="cbs-hud-brand">ร้านยาฟาร์มรู้</div>
            <div className="cbs-hud-right">
              <div className="cbs-gauge">
                <span className="cbs-gauge-label">ความปลอดภัย</span>
                <div className="cbs-gauge-cells">
                  {Array.from({ length: maxHp }).map((_, i) => (
                    <span
                      key={i}
                      className={`cbs-cell ${i >= st.hp ? "cbs-off" : (st.hp === 1 && i === 0 ? "cbs-last" : "")}`}
                    />
                  ))}
                </div>
              </div>
              <div className="cbs-timechip">{fmtTime(st.simTime)}</div>
              <button
                type="button"
                className="cbs-exit"
                // กันไม่ให้เด้งไปที่ตัวจับแตะของเวที ไม่งั้นกด "ออก" แล้วบทพูดเดินหน้าไปด้วย
                onClick={(e) => { e.stopPropagation(); setConfirmExit(true); }}
                aria-label="ออกจากเคสนี้"
              >
                <X size={14} strokeWidth={3} /> ออก
              </button>
            </div>
          </div>

          {confirmExit && (
            <div
              className="cbs-exit-overlay"
              role="dialog"
              aria-modal="true"
              aria-label="ยืนยันออกจากเคส"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="cbs-exit-box">
                <p className="cbs-exit-title">ออกจากเคสนี้?</p>
                <p className="cbs-exit-sub">ความคืบหน้าในเคสนี้จะไม่ถูกบันทึก</p>
                <div className="cbs-exit-actions">
                  <button type="button" className="cbs-btn-main" onClick={() => setConfirmExit(false)}>
                    เล่นต่อ
                  </button>
                  <Link href={HUB_HREF} className="cbs-btn-ghost">
                    ออกไปเลือกเคสอื่น
                  </Link>
                </div>
              </div>
            </div>
          )}

          {speaker && (
            <div className={`cbs-sprite ${reducedMotion ? "" : "cbs-pop"}`} key={`sp-${speaker.popN}`}>
              <div className={!reducedMotion && char?.motion && char.motion !== "none" ? `cbs-motion-${char.motion}` : undefined}>
                <CharacterSprite
                  charId={speaker.who}
                  pose={speaker.pose}
                  talking={typing}
                  images={char?.images}
                  name={char?.name}
                />
              </div>
            </div>
          )}

          {choice && (
            <div className="cbs-choices">
              {choice.tried.size > 0 && (
                <div className="cbs-retry-banner">✗ ตอบผิดไปแล้ว {choice.tried.size} ข้อ — เลือกตอบใหม่อีกครั้ง</div>
              )}
              <div className="cbs-qbanner">⚖ {choice.q}</div>
              {choice.hintTgt && (
                <div className="cbs-hint">💡 ลองใช้แนวทาง <b>{choice.hintTgt}</b> ดูสิ</div>
              )}
              {choice.shelf ? (
                <div className="cbs-shelf-grid">
                  {choice.options.map((o, i) => {
                    const tried = choice.tried.has(o.label);
                    const dim = !tried && choice.hintTgt && o.tgt !== choice.hintTgt;
                    const glow = choice.hintTgt && o.tgt === choice.hintTgt;
                    return (
                      <button
                        key={i}
                        type="button"
                        disabled={tried}
                        className={`cbs-shelf-item ${tried ? "cbs-choice-tried" : ""} ${dim ? "cbs-choice-dim" : ""} ${glow ? "cbs-choice-hint" : ""}`}
                        onClick={() => pick(o)}
                      >
                        <span className="cbs-shelf-icon" aria-hidden>💊</span>
                        <span className="cbs-shelf-name">{o.label}</span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                choice.options.map((o, i) => {
                  const tried = choice.tried.has(o.label);
                  const dim = !tried && choice.hintTgt && o.tgt !== choice.hintTgt;
                  const glow = choice.hintTgt && o.tgt === choice.hintTgt;
                  return (
                    <button
                      key={i}
                      type="button"
                      disabled={tried}
                      className={`cbs-choice ${tried ? "cbs-choice-tried" : ""} ${dim ? "cbs-choice-dim" : ""} ${glow ? "cbs-choice-hint" : ""}`}
                      onClick={() => pick(o)}
                    >
                      <span className="cbs-choice-tgt">▸ {o.tgt}</span>
                      {o.label}
                    </button>
                  );
                })
              )}
              <div className="cbs-choice-timer">
                <div
                  className={`cbs-choice-timer-fill ${timerPct < 30 ? "cbs-low" : ""}`}
                  style={{ width: `${timerPct}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="cbs-dlg-area">
          {/* กล่องบทพูดแบบ visual novel: แตะเพื่อข้าม/ไปต่อ */}
          <div
            className="cbs-dlg"
            onClick={onDialogTap}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onDialogTap(); }
            }}
          >
            <div
              className="cbs-nameplate"
              style={plateColors ? { background: `linear-gradient(180deg, ${plateColors[0]}, ${plateColors[1]})` } : undefined}
            >
              {plateName}
            </div>
            <div className="cbs-dlg-text">
              <DlgText segments={dlgSegments} count={dlgCount} />
            </div>
            {(typing || awaitTap) && (
              <div className={`cbs-adv ${typing ? "cbs-adv-typing" : ""}`}>
                {typing ? "แตะเพื่อข้าม" : "แตะเพื่อไปต่อ"}
                <span className="cbs-adv-caret" aria-hidden>▼</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* คำใบ้ครั้งแรก — pointer-events: none เพื่อให้แตะทะลุไปโดนเวทีจริง */}
      {tapCoach && (
        <div className="cbs-tap-coach" aria-hidden>
          <div className="cbs-tap-coach-ring" />
          <p className="cbs-tap-coach-text">แตะที่หน้าจอเพื่อเล่นต่อ</p>
        </div>
      )}

      {inter && (
        <div className="cbs-inter">
          <div className="cbs-inter-burst" />
          <div className={`cbs-inter-bubble ${inter.green ? "cbs-green-bubble" : ""}`}>
            <span className="cbs-inter-text">{inter.text}</span>
          </div>
        </div>
      )}
      {labelCard && (
        <div
          className="cbs-label-overlay"
          onClick={onLabelCardTap}
          role="button"
          tabIndex={0}
          aria-label="ปิดฉลากยา แล้วไปต่อ"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onLabelCardTap(); }
          }}
        >
          <div className="cbs-label-card" onClick={(e) => e.stopPropagation()}>
            <div className="cbs-label-head">
              <span className="cbs-label-pharmacy">ร้านยาฟาร์มรู้</span>
              <span className="cbs-label-rx">ฉลากยา</span>
            </div>
            <div className="cbs-label-drug">{labelCard.drugName}</div>
            <div className="cbs-label-patient">{labelCard.patientLabel}</div>
            <div className="cbs-label-rows">
              {labelCard.entries.map((e, i) => (
                <div key={i} className="cbs-label-row">
                  <span className="cbs-label-row-h">{e.heading}</span>
                  <span className="cbs-label-row-t">{e.text}</span>
                </div>
              ))}
            </div>
            <button type="button" className="cbs-label-close" onClick={onLabelCardTap}>
              ติดฉลาก แล้วไปต่อ
            </button>
          </div>
        </div>
      )}
      {flashN > 0 && <div key={`fl-${flashN}`} className="cbs-flash cbs-go" />}
      {redN > 0 && <div key={`rf-${redN}`} className="cbs-redflash cbs-go" />}
    </div>
  );
}
