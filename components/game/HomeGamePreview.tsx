"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  MessageCircle,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import styles from "./home-game-preview.module.css";

export interface HomeGamePreviewProps {
  title: string;
  opening: string;
  question: string;
  options: { label: string; correct: boolean; feedback: string }[];
  href: string;
}

export default function HomeGamePreview({
  title,
  opening,
  question,
  options,
  href,
}: HomeGamePreviewProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const answer = selected === null ? null : options[selected];

  return (
    <section className={styles.preview} aria-labelledby="game-preview-title">
      <div className={styles.heading}>
        <div>
          <p>STEP BEHIND THE COUNTER</p>
          <h2 id="game-preview-title">ลูกค้าคนแรกมาแล้ว คุณจะเริ่มอย่างไร?</h2>
          <span>ลองเล่นเคสสั้น ๆ ตรงนี้ แล้วไปเปิดร้านรับเคสเต็มกัน</span>
        </div>
        <span className={styles.badge}>
          <Sparkles size={15} /> พรีวิวเล่นได้จริง
        </span>
      </div>
      <div className={styles.game}>
        <div className={styles.scene}>
          <Image
            src="/images/game/backgrounds/drugstore_counter.webp"
            alt="ฉากเคาน์เตอร์ร้านยาจากเกม"
            fill
            sizes="(max-width: 800px) 100vw, 50vw"
            className={styles.background}
          />
          <span className={styles.sceneLabel}>
            PHARMRU PHARMACY <span>OPEN</span>
          </span>
          <div className={styles.character}>
            <Image
              src="/images/game/characters/cust_elderly_female/idle.webp"
              alt="คุณยาย ลูกค้าในเคสจำลอง"
              fill
              sizes="(max-width: 800px) 220px, 270px"
              className={styles.portrait}
            />
          </div>
          <div className={styles.dialogue}>
            <span>
              <MessageCircle size={15} /> คุณยาย · ลูกค้าหน้าร้าน
            </span>
            <p>“{opening}”</p>
          </div>
        </div>
        <div className={styles.controls}>
          <p className={styles.caseLabel}>เคสตัวอย่าง · {title}</p>
          <h3>{question}</h3>
          <p className={styles.hint}>เลือกคำตอบเพื่อคุยกับลูกค้า</p>
          <div className={styles.options}>
            {options.map((option, i) => (
              <button
                key={option.label}
                type="button"
                disabled={selected !== null}
                className={
                  selected === i
                    ? option.correct
                      ? styles.correct
                      : styles.incorrect
                    : ""
                }
                onClick={() => setSelected(i)}
              >
                <span>{String.fromCharCode(65 + i)}</span>
                {option.label}
              </button>
            ))}
          </div>
          <div aria-live="polite" aria-atomic="true">
            {answer && (
              <div
                className={`${styles.feedback} ${answer.correct ? styles.success : ""}`}
              >
                <b>
                  {answer.correct ? (
                    <>
                      <CheckCircle2 size={17} /> เริ่มต้นได้ดี!
                    </>
                  ) : (
                    "ลองเรียนรู้จากจุดนี้"
                  )}
                </b>
                <p>{answer.feedback}</p>
                <button type="button" onClick={() => setSelected(null)}>
                  <RotateCcw size={14} /> ลองอีกครั้ง
                </button>
              </div>
            )}
          </div>
          <Link className={styles.play} href={href}>
            {answer ? "ไปเล่นเคสเต็ม" : "เริ่มเล่นเคสเต็มได้เลย"}
            <ArrowRight size={18} />
          </Link>
          <div className={styles.bottom}>
            <span>ตัวอย่าง 1 คำถาม · ไม่บันทึกคะแนน</span>
            <Link href="/game">ดูเคสทั้งหมด →</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
