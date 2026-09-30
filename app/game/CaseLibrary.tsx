"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Play, Search, Trophy, Users } from "lucide-react";
import styles from "./game-hub.module.css";

type Case = {
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  character: string;
  best: { grade: string; runs: number } | null;
};
const labels: Record<string, string> = {
  otc: "จ่ายยา OTC",
  interaction: "ยาตีกัน / Interaction",
  referral: "คัดกรองและส่งต่อ",
  chronic: "โรคเรื้อรัง",
  allergy: "แพ้ / ภูมิแพ้",
  skin: "โรคผิวหนัง",
  other: "เคสร้านยา",
};
export default function CaseLibrary({ cases }: { cases: Case[] }) {
  const [category, setCategory] = useState("");
  const [query, setQuery] = useState("");
  const categories = Array.from(new Set(cases.map((c) => c.category)));
  const filtered = cases.filter(
    (c) =>
      (!category || category === c.category) &&
      `${c.title} ${c.subtitle} ${labels[c.category] || c.category}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  return (
    <section
      id="cases"
      className={styles.library}
      aria-labelledby="cases-title"
    >
      <div className={styles.sectionHeading}>
        <div>
          <span className={styles.eyebrow}>CHOOSE YOUR NEXT CUSTOMER</span>
          <h2 id="cases-title">วันนี้จะดูแลลูกค้าคนไหนดี?</h2>
          <p>เลือกเคสที่อยากฝึก แล้วเจอกันที่เคาน์เตอร์ยา</p>
        </div>
        <a href="#how-to" className={styles.howLink}>
          เล่นยังไง? <ArrowUpRight size={16} />
        </a>
      </div>
      <div className={styles.filterBar}>
        <div className={styles.filters} aria-label="ประเภทเคส">
          <button aria-pressed={!category} onClick={() => setCategory("")}>
            <Users size={15} /> ทุกเคส <span>{cases.length}</span>
          </button>
          {categories.map((c) => (
            <button
              key={c}
              aria-pressed={category === c}
              onClick={() => setCategory(c)}
            >
              {labels[c] || c}
            </button>
          ))}
        </div>
        <label className={styles.search}>
          <Search size={18} />
          <span className={styles.srOnly}>ค้นหาเคส</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="search"
            placeholder="ค้นหาอาการหรือเคส..."
          />
        </label>
      </div>
      <p className={styles.resultCount} role="status">
        {filtered.length} เคสพร้อมให้ฝึก
        {(category || query) && (
          <button
            onClick={() => {
              setCategory("");
              setQuery("");
            }}
          >
            ล้างตัวกรอง
          </button>
        )}
      </p>
      <div className={styles.caseGrid}>
        {filtered.map((c) => {
          const number = cases.findIndex((s) => s.slug === c.slug) + 1;
          return (
            <Link
              key={c.slug}
              href={`/game/${c.slug}`}
              className={styles.caseCard}
            >
              <div className={styles.caseArt} data-category={c.category}>
                <span className={styles.caseNo}>
                  CASE {String(number).padStart(2, "0")}
                </span>
                <span className={styles.caseBadge}>
                  {labels[c.category] || "เคสร้านยา"}
                </span>
                <div className={styles.artCircle} />
                <Image
                  src={`/images/game/characters/${c.character}/idle-casual.png`}
                  alt=""
                  width={230}
                  height={260}
                  className={styles.caseCharacter}
                />
                <span className={styles.caseArtLabel}>
                  PHARMRU
                  <br />
                  <b>COUNTER STORIES</b>
                </span>
                <span className={styles.artPlus} aria-hidden="true">
                  +
                </span>
              </div>
              <div className={styles.caseBody}>
                {c.best && (
                  <span className={styles.best}>
                    <Trophy size={13} /> เกรดดีสุด {c.best.grade} · เล่นแล้ว{" "}
                    {c.best.runs} รอบ
                  </span>
                )}
                <h3>{c.title}</h3>
                <p>{c.subtitle}</p>
                <span className={styles.casePlay}>
                  <span>
                    <Play size={14} fill="currentColor" /> รับลูกค้า
                  </span>
                  <ArrowUpRight size={19} />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
      {!filtered.length && (
        <div className={styles.empty}>
          <Search size={30} />
          <h3>ยังไม่พบเคสที่ค้นหา</h3>
          <p>ลองค้นหาด้วยชื่ออาการ หรือเลือกดูทุกเคส</p>
          <button
            onClick={() => {
              setCategory("");
              setQuery("");
            }}
          >
            ดูทุกเคส
          </button>
        </div>
      )}
    </section>
  );
}

