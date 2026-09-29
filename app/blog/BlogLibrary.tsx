"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowDown,
  ArrowUpRight,
  BookOpen,
  Clock3,
  Search,
  Sparkles,
  MoveRight,
  Pill,
  X,
} from "lucide-react";
import { clinicalSystems } from "@/lib/clinical-systems";
import styles from "./blog.module.css";

export type Article = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  category: string | null;
  cover_image: string | null;
  reading_time: number;
};

function Cover({
  post,
  featured = false,
}: {
  post: Article;
  featured?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <div className={`${styles.cover} ${featured ? styles.featureCover : ""}`}>
      {post.cover_image && !failed ? (
        <Image
          src={post.cover_image}
          alt=""
          fill
          sizes={
            featured
              ? "(max-width: 760px) 100vw, 50vw"
              : "(max-width: 760px) 100vw, 33vw"
          }
          unoptimized
          onError={() => setFailed(true)}
        />
      ) : (
        <div className={styles.coverArt} aria-hidden="true">
          <span className={styles.artLabel}>PHARMRU / STUDY NOTES</span>
          <BookOpen strokeWidth={1} />
          <span className={styles.artPill}>
            <Pill size={22} /> {post.category || "PHARMACY"}
          </span>
          <span className={styles.artCaption}>
            A little reading.
            <br />A deeper understanding.
          </span>
        </div>
      )}
    </div>
  );
}

function Meta({ post }: { post: Article }) {
  return (
    <div className={styles.meta}>
      <span>{post.category || "ความรู้เภสัช"}</span>
      <span>
        <Clock3 size={14} /> {post.reading_time} นาที
      </span>
    </div>
  );
}

export default function BlogLibrary({
  posts,
  unavailable,
}: {
  posts: Article[];
  unavailable: boolean;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [shown, setShown] = useState(9);
  const categories = Array.from(
    new Set(
      posts.map((p) => p.category).filter((x): x is string => Boolean(x)),
    ),
  );
  const filtered = posts.filter(
    (p) =>
      (!category || p.category === category) &&
      `${p.title} ${p.description || ""} ${p.category || ""}`
        .toLocaleLowerCase()
        .includes(query.trim().toLocaleLowerCase()),
  );
  const featured = posts[0];
  function reset() {
    setQuery("");
    setCategory("");
    setShown(9);
  }
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div>
            <div className={styles.eyebrow}>
              <span /> PHARMRU READING ROOM
            </div>
            <h1>
              อ่านให้เข้าใจ
              <br />
              ไปได้ไกลกว่า<span>การจำ.</span>
            </h1>
            <p>
              เติมความรู้เภสัชทีละเรื่อง เชื่อมโยงแนวคิดให้เห็นภาพ
              <br className={styles.desktopBreak} /> พร้อมสำหรับข้อสอบ PLE
              และการเรียนรู้ในทุกวัน
            </p>
            <a href="#articles" className={styles.heroLink}>
              ค้นพบบทความที่อยากอ่าน <ArrowDown size={18} />
            </a>
          </div>
          <div className={styles.heroArt} aria-hidden="true">
            <div className={styles.orbit} />
            <div className={styles.book}>
              <span>THE PHARMRU COLLECTION</span>
              <BookOpen size={48} strokeWidth={1.2} />
              <strong>
                เปิดอ่าน
                <br />
                เปิดความเข้าใจ
              </strong>
              <div>PHARMACY · CONCEPT · PRACTICE</div>
            </div>
            <span className={styles.note}>
              <Sparkles size={17} /> วันละเรื่อง ก็รู้เพิ่มได้
            </span>
            <span className={styles.number}>Aa</span>
          </div>
        </div>
        <div className={styles.heroBottom}>
          <span>
            <BookOpen size={16} /> พื้นที่เล็ก ๆ ของคนรักการเรียนรู้
          </span>
          <span>READ. UNDERSTAND. GROW.</span>
        </div>
      </section>

      <div className={styles.container}>
        {featured && (
          <section
            className={styles.featureSection}
            aria-labelledby="feature-heading"
          >
            <div className={styles.sectionHeading}>
              <div>
                <span className={styles.eyebrow}>THE EDITOR’S PICK</span>
                <h2 id="feature-heading">เริ่มอ่านจากเรื่องนี้</h2>
              </div>
              <span className={styles.softText}>
                หนึ่งเรื่องน่าอ่าน สำหรับวันนี้
              </span>
            </div>
            <Link href={`/blog/${featured.slug}`} className={styles.feature}>
              <Cover post={featured} featured />
              <div className={styles.featureBody}>
                <span className={styles.featureBadge}>
                  <Sparkles size={14} /> บทความชวนอ่าน
                </span>
                <Meta post={featured} />
                <h3>{featured.title}</h3>
                <p>{featured.description}</p>
                <span className={styles.readLink}>
                  เปิดอ่านบทความ{" "}
                  <span>
                    <ArrowUpRight size={21} />
                  </span>
                </span>
              </div>
            </Link>
          </section>
        )}

        <section
          id="articles"
          className={styles.articles}
          aria-labelledby="articles-heading"
        >
          <div className={styles.sectionHeading}>
            <div>
              <span className={styles.eyebrow}>EXPLORE THE LIBRARY</span>
              <h2 id="articles-heading">วันนี้อยากอ่านเรื่องอะไร?</h2>
              <p className={styles.softText}>
                เลือกเรื่องที่สนใจ แล้วค่อย ๆ ต่อเติมความเข้าใจ
              </p>
            </div>
            <label className={styles.search}>
              <Search size={20} />
              <span className={styles.srOnly}>ค้นหาบทความ</span>
              <input
                type="search"
                placeholder="ค้นหาชื่อยา โรค หรือบทความ..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setShown(9);
                }}
              />
            </label>
          </div>
          <div className={styles.filters} aria-label="หมวดหมู่บทความ">
            <button
              type="button"
              aria-pressed={!category}
              onClick={() => {
                setCategory("");
                setShown(9);
              }}
            >
              ทั้งหมด <span>{posts.length}</span>
            </button>
            {categories.map((c) => (
              <button
                type="button"
                key={c}
                aria-pressed={category === c}
                onClick={() => {
                  setCategory(c);
                  setShown(9);
                }}
              >
                {c}
              </button>
            ))}
          </div>
          <p className={styles.resultCount} role="status">
            {unavailable
              ? "ยังโหลดคลังบทความไม่ได้"
              : `พบ ${filtered.length} บทความ${category ? ` ในหมวด ${category}` : ""}`}
            {(query || category) && (
              <button onClick={reset}>
                ล้างตัวกรอง <X size={14} />
              </button>
            )}
          </p>
          {filtered.length > 0 ? (
            <div className={styles.grid}>
              {filtered.slice(0, shown).map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className={styles.card}
                >
                  <Cover post={post} />
                  <div className={styles.cardBody}>
                    <Meta post={post} />
                    <h3>{post.title}</h3>
                    <p>{post.description}</p>
                    <span className={styles.cardLink}>
                      อ่านต่อ <ArrowUpRight size={18} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className={styles.empty}>
              <BookOpen size={32} />
              <h3>
                {unavailable
                  ? "ห้องสมุดจะกลับมาในอีกสักครู่"
                  : posts.length
                    ? "ยังไม่เจอบทความที่ตรงใจ"
                    : "กำลังเตรียมบทความน่าอ่านให้คุณ"}
              </h3>
              <p>
                {unavailable
                  ? "กรุณาลองโหลดหน้าใหม่ หรือเลือกทบทวนตามระบบด้านล่างได้เลย"
                  : posts.length
                    ? "ลองใช้คำค้นที่สั้นลง หรือเลือกดูบทความทั้งหมด"
                    : "ระหว่างนี้ เลือกสำรวจความรู้ตามโรคและระบบด้านล่างได้เลย"}
              </p>
              {unavailable ? (
                <button onClick={() => window.location.reload()}>
                  ลองโหลดอีกครั้ง <MoveRight size={16} />
                </button>
              ) : (
                posts.length > 0 && (
                  <button onClick={reset}>
                    ดูบทความทั้งหมด <MoveRight size={16} />
                  </button>
                )
              )}
            </div>
          )}
          {filtered.length > shown && (
            <button
              className={styles.loadMore}
              onClick={() => setShown((n) => n + 9)}
            >
              อ่านเพิ่มอีกหน่อย <ArrowDown size={17} />
            </button>
          )}
        </section>

        <section
          className={styles.systemSection}
          aria-labelledby="systems-heading"
        >
          <div className={styles.sectionHeading}>
            <div>
              <span className={styles.eyebrow}>CONNECT THE DOTS</span>
              <h2 id="systems-heading">เลือกอ่านตามโรคและระบบ</h2>
              <p className={styles.softText}>
                จากภาพรวมของโรค สู่ความเข้าใจเรื่องยา
              </p>
            </div>
            <span className={styles.systemCount}>
              {clinicalSystems.length} หมวดความรู้
            </span>
          </div>
          <div className={styles.systemGrid}>
            {clinicalSystems.map((system, i) => (
              <Link
                key={system.slug}
                href={`/blog/system/${system.slug}`}
                className={styles.system}
              >
                <span className={styles.systemIcon} aria-hidden="true">
                  {system.icon}
                </span>
                <div>
                  <span className={styles.systemNumber}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3>{system.name}</h3>
                  <p>{system.topics.slice(0, 3).join(" · ")}</p>
                </div>
                <ArrowUpRight size={17} />
              </Link>
            ))}
          </div>
        </section>
        <section className={styles.practice}>
          <div>
            <span className={styles.eyebrow}>
              TURN KNOWLEDGE INTO CONFIDENCE
            </span>
            <h2>
              อ่านเข้าใจแล้ว
              <br />
              ลองใช้ความรู้กันต่อ
            </h2>
            <p>เปลี่ยนสิ่งที่เพิ่งอ่าน ให้เป็นความมั่นใจกับข้อสอบ PLE</p>
          </div>
          <Link href="/ple/practice">
            เริ่มฝึกทำข้อสอบ <ArrowUpRight size={20} />
          </Link>
          <BookOpen
            className={styles.practiceArt}
            size={180}
            strokeWidth={0.6}
            aria-hidden="true"
          />
        </section>
      </div>
    </main>
  );
}
