import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import {
  ArrowDown,
  ArrowUpRight,
  Check,
  ClipboardList,
  Gamepad2,
  Play,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Trophy,
} from "lucide-react";
import { auth } from "@/lib/auth";
import {
  getGameBests,
  getGameTotals,
  type GameBest,
} from "@/lib/db/queries-game";
import { GAME_SCENARIOS } from "@/lib/game/scenarios";
import { xpToRank } from "@/lib/game/rank";
import ClaimLocalRuns from "@/components/game/ClaimLocalRuns";
import LocalProgressCard from "@/components/game/LocalProgressCard";
import CaseLibrary from "./CaseLibrary";
import styles from "./game-hub.module.css";

export const metadata: Metadata = {
  title: "เกมร้านยา — เปิดร้าน รับลูกค้า ฝึกเป็นเภสัชกร",
  description:
    "สวมบทเภสัชกรในเกมร้านยา ฝึกซักประวัติ ประเมินอาการและตัดสินใจผ่านเคสจำลอง เล่นฟรี พร้อมสะสม XP และดูพัฒนาการ",
};
export const dynamic = "force-dynamic";

export default async function GameHubPage() {
  const session = await auth();
  const userId = session?.user?.id ?? null;
  const [bests, totals] = userId
    ? await Promise.all([
        getGameBests(userId).catch(() => ({}) as Record<string, GameBest>),
        getGameTotals(userId).catch(() => null),
      ])
    : [{} as Record<string, GameBest>, null];
  const cases = GAME_SCENARIOS.map((s) => {
    const customer = s.story.find(
      (n) => "say" in n && n.say.who.startsWith("cust_"),
    );
    return {
      slug: s.slug,
      title: s.title,
      subtitle: s.subtitle,
      category: s.category ?? "other",
      character:
        customer && "say" in customer ? customer.say.who : "cust_generic",
      best: bests[s.slug] ?? null,
    };
  });
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <span className={styles.eyebrow}>
            <Gamepad2 size={16} /> PHARMRU · PHARMACY SIMULATOR
          </span>
          <div className={styles.openSign}>
            <span /> ร้านเปิดแล้ว พร้อมรับลูกค้า
          </div>
          <h1>
            ร้านยานี้…
            <br />
            มีคุณเป็น<span>เภสัชกร</span>
          </h1>
          <p>
            สวมเสื้อกาวน์ แล้วเริ่มกะของคุณ
            <br />
            ฟังเรื่องราว ซักประวัติ และตัดสินใจ
            <br />
            ทุกเคสคือโอกาสที่จะเก่งขึ้นอีกนิด
          </p>
          <div className={styles.heroActions}>
            <Link
              href={`/game/${cases[0].slug}?start=1`}
              className={styles.primary}
            >
              <Play size={18} fill="currentColor" /> เปิดร้านรับลูกค้า
            </Link>
            <a href="#cases" className={styles.secondary}>
              เลือกเคสเอง <ArrowDown size={17} />
            </a>
          </div>
          <span className={styles.freeNote}>
            <Check size={15} /> เล่นฟรีทุกเคส ไม่ต้องล็อกอิน
          </span>
        </div>
        <div className={styles.scene}>
          <Image
            src="/images/game/backgrounds/drugstore_counter.webp"
            alt="บรรยากาศร้านยาในเกม"
            fill
            sizes="(max-width: 760px) 100vw, 60vw"
            priority
            className={styles.sceneBackground}
          />
          <span className={styles.sceneTag}>
            <span /> YOUR PHARMACY · OPEN
          </span>
          <div className={styles.speech}>
            <span>ลูกค้าคนแรกมาแล้ว!</span>
            <strong>“ขอปรึกษาเรื่องยาหน่อยค่ะ”</strong>
          </div>
          <Image
            src="/images/game/characters/pharmacist_mentor/happy.webp"
            alt="เภสัชกรพี่เลี้ยงในเกม"
            width={440}
            height={580}
            className={styles.mentor}
            priority
          />
          <Image
            src="/images/game/characters/cust_elderly_female/idle-casual.png"
            alt="ตัวละครลูกค้าคุณยาย"
            width={300}
            height={400}
            className={styles.customer}
          />
          <div className={styles.sceneFooter}>
            <span>
              <Stethoscope size={19} /> เรียนรู้ผ่านการลงมือเล่น
            </span>
            <span>
              LET’S START YOUR SHIFT <ArrowUpRight size={16} />
            </span>
          </div>
        </div>
      </section>
      <div className={styles.container}>
        <div className={styles.highlights}>
          <div>
            <span className={styles.statIcon}>
              <ClipboardList size={21} />
            </span>
            <p>
              <strong>{cases.length} เคสจำลอง</strong>
              <span>หลากหลายเรื่องราวหน้าร้าน</span>
            </p>
          </div>
          <div>
            <span className={styles.statIcon}>
              <Trophy size={21} />
            </span>
            <p>
              <strong>เล่น เก็บ XP พัฒนาฝีมือ</strong>
              <span>เรียนรู้จากทุกการตัดสินใจ</span>
            </p>
          </div>
          <div>
            <span className={styles.statIcon}>
              <ShieldCheck size={21} />
            </span>
            <p>
              <strong>ลองได้ เรียนรู้ได้</strong>
              <span>สถานการณ์จำลองเพื่อการเรียนรู้</span>
            </p>
          </div>
        </div>
        <div className={styles.progress}>
          {userId && totals ? (
            <>
              <ClaimLocalRuns />
              <PharmacistCard
                xp={totals.xp}
                played={totals.played}
                wins={totals.wins}
              />
            </>
          ) : (
            <LocalProgressCard />
          )}
        </div>
        <CaseLibrary cases={cases} />
        <section className={styles.howTo} id="how-to">
          <div>
            <span className={styles.eyebrow}>YOUR FIRST SHIFT</span>
            <h2>
              กะแรกของคุณ
              <br />
              เริ่มง่าย ๆ แบบนี้
            </h2>
            <p>
              มีเภสัชกรพี่เลี้ยงคอยพาเรียนรู้
              <br />
              พร้อมทบทวนหลังจบเคส
            </p>
          </div>
          <ol>
            {[
              [
                "01",
                "ฟังและซักประวัติ",
                "คุยกับลูกค้า เก็บข้อมูลสำคัญก่อนตัดสินใจ",
              ],
              [
                "02",
                "เลือกสิ่งที่ควรทำ",
                "ประเมินอาการ เลือกยา ให้คำแนะนำ หรือส่งต่อ",
              ],
              [
                "03",
                "เรียนรู้จากผลลัพธ์",
                "ดูผลการเล่น ทบทวนจุดพลาด แล้วลองใหม่",
              ],
            ].map(([n, t, d]) => (
              <li key={n}>
                <span>{n}</span>
                <div>
                  <h3>{t}</h3>
                  <p>{d}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
        <section className={styles.bottomCta}>
          <span className={styles.reward}>
            <Sparkles size={30} />
          </span>
          <div>
            <h2>ทุกเคสที่เล่น คือประสบการณ์ที่เพิ่มขึ้น</h2>
            <p>
              ล็อกอินเพื่อเก็บ XP และ badge ไว้ในบัญชี
              แล้วกลับมาเล่นต่อได้ทุกวัน
            </p>
          </div>
          <Link href={userId ? "/dashboard" : "/login?callbackUrl=%2Fgame"}>
            {userId ? "ดูพัฒนาการของฉัน" : "เข้าสู่ระบบเก็บพัฒนาการ"}
            <ArrowUpRight size={18} />
          </Link>
        </section>
      </div>
    </main>
  );
}
function PharmacistCard({
  xp,
  played,
  wins,
}: {
  xp: number;
  played: number;
  wins: number;
}) {
  const { rank, next, xpForNext, xpIntoRank, progress } = xpToRank(xp);
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <span className="text-3xl leading-none" aria-hidden>
          {rank.icon}
        </span>
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-2 font-bold text-brand-dark">
            <Stethoscope className="h-4 w-4 text-brand" /> {rank.title}
          </p>
          <p className="text-sm text-muted-foreground">{rank.trait}</p>
          <p className="mt-1 text-sm">
            เล่นแล้ว {played} เคส · ชนะ {wins} · {xp.toLocaleString("th-TH")} XP
          </p>
          {next ? (
            <div className="mt-2">
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-brand transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                อีก {(xpForNext - xpIntoRank).toLocaleString("th-TH")} XP ถึง{" "}
                <b>{next.title}</b>
              </p>
            </div>
          ) : (
            <p className="mt-1 text-xs text-amber-700">
              ขั้นสูงสุดของสายร้านยาแล้ว
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

