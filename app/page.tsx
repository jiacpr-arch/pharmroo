import Link from "next/link";
import { Suspense } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  BookOpen,
  Brain,
  Check,
  Clock3,
  FlaskConical,
  GraduationCap,
  Pill,
  Sparkles,
  Stethoscope,
  Target,
} from "lucide-react";
import ExamNews, { ExamNewsSkeleton } from "@/components/ExamNews";
import { CATEGORIES, PRICING_PLANS } from "@/lib/types";
import { getMcqSubjects } from "@/lib/db/queries-mcq";
import styles from "./home.module.css";
import HomeGamePreview from "@/components/game/HomeGamePreview";
import { headacheWarfarin } from "@/lib/game/scenarios";

export const revalidate = 60;

const benefits = [
  {
    icon: Brain,
    title: "เข้าใจ มากกว่าจำ",
    text: "ทบทวนแนวคิดจากเฉลยละเอียด พร้อมขั้นตอนคำนวณที่ช่วยให้มองเห็นวิธีคิด",
  },
  {
    icon: Target,
    title: "รู้จุดที่ต้องฝึกต่อ",
    text: "ติดตามผลการทำข้อสอบ แล้วกลับมาทบทวนหมวดที่ยังไม่มั่นใจได้ทุกเมื่อ",
  },
  {
    icon: Clock3,
    title: "ซ้อมก่อนสนามจริง",
    text: "เปลี่ยนจากการฝึกทีละข้อ เป็นการจำลองสอบพร้อมจับเวลาใน Mock Exam",
  },
];

function SubjectGrid({
  subjects,
}: {
  subjects: { key: string; name: string; icon: string; href: string }[];
}) {
  return (
    <div className={styles.subjects}>
      {subjects.map((subject, i) => (
        <Link href={subject.href} key={subject.key} className={styles.subject}>
          <span className={styles.subjectNumber}>
            {String(i + 1).padStart(2, "0")}
          </span>
          <span className={styles.subjectIcon} aria-hidden="true">
            {subject.icon}
          </span>
          <h3>{subject.name}</h3>
          <ArrowUpRight size={18} />
        </Link>
      ))}
    </div>
  );
}

const fallbackSubjects = CATEGORIES.map((cat) => ({
  key: cat.slug,
  name: cat.name,
  icon: cat.icon,
  href: "/ple",
}));

async function Subjects() {
  const subjects = await getMcqSubjects({ examCategory: "pharmacy" }).catch(
    () => [],
  );
  return (
    <SubjectGrid
      subjects={
        subjects.length
          ? subjects.map((subject) => ({
              key: subject.id,
              name: subject.name_th,
              icon: subject.icon || "💊",
              href: `/ple/practice?subject=${encodeURIComponent(subject.id)}`,
            }))
          : fallbackSubjects
      }
    />
  );
}

// Reuse the opening and first decision from the full game without shipping its whole story.
function GamePreview() {
  const opening = headacheWarfarin.story.find((node) => "say" in node);
  const decision = headacheWarfarin.story.find((node) => "choice" in node);
  if (!opening || !("say" in opening) || !decision || !("choice" in decision))
    return null;
  const plain = (text: string) => text.replace(/\*\*/g, "");
  return (
    <HomeGamePreview
      title={headacheWarfarin.title}
      opening={plain(opening.say.text)}
      question={decision.choice.q}
      options={decision.choice.options.map((option) => {
        const response = option.then?.find((node) => "say" in node);
        return {
          label: option.label,
          correct: option.ok,
          feedback: plain(
            option.why ||
              (response && "say" in response
                ? response.say.text
                : "ลองซักประวัติต่อในเคสเต็ม"),
          ),
        };
      })}
      href={`/game/${headacheWarfarin.slug}?start=1`}
    />
  );
}

export default function HomePage() {
  return (
    <div className={styles.home}>
      <section className={styles.hero} aria-labelledby="hero-title">
        <div className={styles.heroGrid}>
          <div className={styles.heroCopy}>
            <div className={styles.eyebrow}>
              <span /> YOUR PLE JOURNEY STARTS HERE
            </div>
            <h1 id="hero-title">
              เตรียมสอบ PLE
              <br />
              สู่การเป็น<span className={styles.highlight}>เภสัชกร</span>
              <br />
              อย่างมั่นใจ
            </h1>
            <p className={styles.heroDescription}>
              คลังข้อสอบใบประกอบวิชาชีพเภสัชกรรม PLE-PC และ PLE-CC1
              <br className={styles.desktopBreak} /> ฝึกให้เข้าใจ ทบทวนให้ตรงจุด
              ก้าวสู่สนามสอบอย่างมั่นใจ
            </p>
            <div className={styles.actions}>
              <Link href="/ple/practice" className={styles.primary}>
                เริ่มฝึกข้อสอบ PLE <ArrowUpRight size={20} />
              </Link>
              <Link href="/ple/mock" className={styles.secondary}>
                จำลองสอบ PLE <Clock3 size={18} />
              </Link>
            </div>
            <div className={styles.heroNote}>
              <Check size={15} /> เริ่มต้นฟรี <span>·</span> เรียนรู้ได้ทุกที่
              ทุกอุปกรณ์
            </div>
          </div>
          <div
            className={styles.visual}
            aria-label="ภาพประกอบเส้นทางการเรียนรู้"
          >
            <div className={styles.orbit} aria-hidden="true" />
            <div className={styles.orbitTwo} aria-hidden="true" />
            <div className={styles.floatIcon} aria-hidden="true">
              <FlaskConical size={28} />
            </div>
            <div className={styles.pillShape} aria-hidden="true">
              <span />
              <span />
            </div>
            <div className={styles.studyCard}>
              <div className={styles.cardTop}>
                <span className={styles.miniLogo}>
                  <Pill size={19} /> ฟาร์มรู้
                </span>
                <span className={styles.cardTag}>PLE LEARNING JOURNEY</span>
              </div>
              <div className={styles.cardHeading}>
                อีกก้าวของคุณ
                <br />
                <strong>ใกล้เป็นเภสัชกรขึ้นทุกวัน</strong>
              </div>
              <div className={styles.journey}>
                <div>
                  <span>
                    <BookOpen size={19} />
                  </span>
                  <p>
                    <b>ฝึกทำข้อสอบ</b>
                    <small>เริ่มจากหมวดที่อยากทบทวน</small>
                  </p>
                  <Check size={17} />
                </div>
                <div>
                  <span>
                    <Brain size={19} />
                  </span>
                  <p>
                    <b>เข้าใจเหตุผล</b>
                    <small>เรียนรู้จากเฉลยทีละขั้นตอน</small>
                  </p>
                  <Check size={17} />
                </div>
                <div>
                  <span>
                    <GraduationCap size={21} />
                  </span>
                  <p>
                    <b>พร้อมสู่สนามจริง</b>
                    <small>ทดสอบตัวเองด้วย Mock Exam</small>
                  </p>
                  <ArrowUpRight size={18} />
                </div>
              </div>
              <Link href="/learn" className={styles.cardLink}>
                เปิดเส้นทางการเรียนรู้ <ArrowRight size={17} />
              </Link>
            </div>
            <div className={styles.floatingLabel}>
              <Sparkles size={22} />
              <div>
                <b>Small steps. Big dreams.</b>
                <span>ทีละข้อ ทีละก้าว ไปด้วยกัน</span>
              </div>
            </div>
            <div className={styles.visualCaption}>LEARN · PRACTICE · GROW</div>
          </div>
        </div>
        <div className={styles.heroBottom}>
          <span>
            <Pill size={17} /> PLE-PC / PLE-CC1
          </span>
          <span>
            <FlaskConical size={17} /> ทบทวนวิชาเภสัช
          </span>
          <span>
            <BookOpen size={17} /> เฉลยพร้อมแนวคิด
          </span>
          <span>
            <Clock3 size={17} /> จำลองสอบจริง
          </span>
        </div>
      </section>

      <section
        className={styles.section}
        id="choose-track"
        aria-labelledby="track-title"
      >
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.kicker}>CHOOSE YOUR PLE PRACTICE</p>
            <h2 id="track-title">เตรียมสอบ PLE ในแบบของคุณ</h2>
          </div>
          <p>
            เริ่มจากทบทวนทีละข้อ
            <br />
            แล้ววัดความพร้อมก่อนลงสนามจริง
          </p>
        </div>
        <div className={styles.trackGrid}>
          <Link
            href="/ple/practice?track=cc1"
            className={`${styles.track} ${styles.pharmacy}`}
          >
            <div className={styles.trackTop}>
              <Pill size={29} />
              <span>YEAR 4 / PLE-CC</span>
              <ArrowUpRight size={26} />
            </div>
            <h3>
              ฝึกทำข้อสอบ ปี 4<span>PLE-CC</span>
            </h3>
            <p>
              ทบทวนพื้นฐานวิชาชีพเภสัชกรรม
              <br />
              ฝึกข้อสอบ PLE-CC ให้พร้อมก่อนลงสนามจริง
            </p>
            <div className={styles.trackFooter}>
              <span>เริ่มฝึก PLE-CC</span>
              <ArrowRight size={20} />
            </div>
          </Link>
          <article className={`${styles.track} ${styles.mock}`}>
            <div className={styles.trackTop}>
              <GraduationCap size={29} />
              <span>YEAR 6 / PLE-PC · IP · PHCP</span>
            </div>
            <h3>
              ฝึกทำข้อสอบ ปี 6<span>PLE-PC · IP · PHCP</span>
            </h3>
            <p>
              เตรียมความพร้อมในสายวิชาชีพที่เลือก
              <br />
              เลือกกลุ่มข้อสอบ แล้วเริ่มฝึกได้ทันที
            </p>
            <div className={styles.trackChoices}>
              <Link href="/ple/pc1-pilot">
                PLE-PC <ArrowUpRight size={16} />
              </Link>
              <Link href="/ple/practice?track=ip1">
                IP <ArrowUpRight size={16} />
              </Link>
              <Link href="/ple/practice?track=phcp1">
                PHCP <ArrowUpRight size={16} />
              </Link>
            </div>
          </article>
        </div>
      </section>

      <section
        className={styles.subjectSection}
        aria-labelledby="subject-title"
      >
        <div className={styles.section}>
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.kicker}>A LITTLE PRACTICE, EVERY DAY</p>
              <h2 id="subject-title">วันนี้อยากฝึกอะไร?</h2>
              <p className={styles.sectionSubtitle}>
                เลือกหมวดข้อสอบแล้วเริ่มทำได้ทันที
              </p>
            </div>
            <Link href="/ple" className={styles.textLink}>
              เลือกหมวดแล้วเริ่มฝึก <ArrowUpRight size={19} />
            </Link>
          </div>
          <Suspense fallback={<SubjectGrid subjects={fallbackSubjects} />}>
            <Subjects />
          </Suspense>
          <div className={styles.statStrip}>
            <div>
              <strong>PLE-PC / PLE-CC1</strong>
              <span>ทบทวนองค์ความรู้เภสัชกรรม พร้อมสู่สนามสอบ</span>
            </div>
            <p>
              เปลี่ยนเวลาว่าง
              <br />
              <b>ให้เป็นความพร้อมครั้งต่อไป</b>
            </p>
            <Link href="/ple/practice" className={styles.darkButton}>
              เริ่มฝึกวันนี้ <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="benefits-title">
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.kicker}>BUILT FOR YOUR NEXT STEP</p>
            <h2 id="benefits-title">เพื่อนคู่คิด ก่อนวันสอบจริง</h2>
          </div>
          <p>
            ออกแบบให้การทบทวนมีความหมาย
            <br />
            ตั้งแต่ข้อแรก จนถึงสนามสอบ
          </p>
        </div>
        <div className={styles.benefits}>
          {benefits.map((item, i) => (
            <article key={item.title}>
              <div className={styles.benefitTop}>
                <item.icon size={26} />
                <span>0{i + 1}</span>
              </div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
        <GamePreview />
      </section>

      <section
        className={styles.pricingSection}
        id="pricing"
        aria-labelledby="pricing-title"
      >
        <div className={styles.section}>
          <div className={styles.centerHeading}>
            <p className={styles.kicker}>INVEST IN YOUR FUTURE</p>
            <h2 id="pricing-title">ความพร้อมที่เลือกได้</h2>
            <p>เริ่มฝึกฟรี แล้วเลือกแพ็กเกจที่เหมาะกับจังหวะของคุณ</p>
          </div>
          <div className={styles.pricingGrid}>
            {PRICING_PLANS.map((plan) => (
              <article
                key={plan.type}
                className={`${styles.priceCard} ${plan.popular ? styles.featuredPrice : ""}`}
              >
                <div className={styles.priceTop}>
                  <h3>{plan.name}</h3>
                  {plan.popular && <span>แนะนำ</span>}
                </div>
                <p>{plan.description}</p>
                <div className={styles.price}>
                  {plan.price === 0
                    ? "ฟรี"
                    : `฿${plan.price.toLocaleString("th-TH")}`}
                  <small>{plan.period}</small>
                </div>
                <Link
                  href={
                    plan.type === "free" ? "/register" : `/payment/${plan.type}`
                  }
                  className={plan.popular ? styles.primary : styles.darkButton}
                >
                  {plan.cta}
                  <ArrowUpRight size={18} />
                </Link>
                <ul>
                  {plan.features.map((feature) => (
                    <li key={feature}>
                      <Check size={16} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="news-title">
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.kicker}>STAY CURIOUS</p>
            <h2 id="news-title">อัปเดตความรู้ ไม่หยุดเรียน</h2>
          </div>
          <Link href="/blog" className={styles.textLink}>
            อ่านบทความ <ArrowUpRight size={19} />
          </Link>
        </div>
        <div className={styles.news}>
          <Suspense fallback={<ExamNewsSkeleton />}>
            <ExamNews track="pharmacy" />
          </Suspense>
        </div>
      </section>
      <aside className={styles.nursingNote}>
        <Stethoscope size={20} />
        <span>สำหรับนักศึกษาพยาบาล เรามีข้อสอบ NLE เช่นกัน</span>
        <Link href="/nursing">
          ไปหน้า NLE <ArrowUpRight size={16} />
        </Link>
      </aside>
      <section className={styles.finalCta}>
        <span className={styles.kicker}>YOUR FUTURE IS WORTH IT</span>
        <h2>
          วันสอบที่มั่นใจ
          <br />
          เริ่มได้จาก<span>วันนี้</span>
        </h2>
        <p>ให้ฟาร์มรู้เป็นเพื่อนคู่คิด บนเส้นทางสู่วิชาชีพเภสัชกรรม</p>
        <Link href="/register" className={styles.primary}>
          เริ่มต้นเส้นทางของคุณ ฟรี <ArrowUpRight size={21} />
        </Link>
      </section>
    </div>
  );
}
