// ข่าวสอบใบประกอบฯ / วิชาชีพ / ยา จาก Google News RSS — กรองด้วย keyword ให้เหลือเฉพาะเรื่องที่เกี่ยวข้อง

export type NewsTrack = "pharmacy" | "nursing";
export type NewsTopic = "exam" | "profession";

export interface NewsItem {
  title: string;
  link: string;
  source: string;
  publishedAt: string | null;
  topic: NewsTopic;
}

interface TrackConfig {
  queries: string[];
  // คำที่บอกว่าเป็นวิชาชีพนี้ — ข่าวสอบทั่วไป (ก.พ., TCAS ฯลฯ) ต้องมีคำนี้ด้วยถึงจะนับ
  professionMarkers: string[];
  // หัวข่าวต้องมีอย่างน้อย 1 คำถึงจะแสดง
  examKeywords: string[];
  professionKeywords: string[];
  // คำที่ลบออกก่อนจับ keyword (เช่น "โรงพยาบาล" ไม่ควรนับเป็นข่าวพยาบาล)
  ignoreWords?: string[];
}

const EXAM_KEYWORDS = [
  "สอบใบประกอบ",
  "ข้อสอบ",
  "วันสอบ",
  "ผลสอบ",
  "สมัครสอบ",
  "สนามสอบ",
  "สอบเภสัช",
  "สอบพยาบาล",
];

const DRUG_KEYWORDS = [
  "ยาใหม่",
  "ยาปลอม",
  "ยาอันตราย",
  "ยาควบคุม",
  "ยาสามัญ",
  "ยาชื่อสามัญ",
  "บัญชียา",
  "ราคายา",
  "การใช้ยา",
  "ใช้ยา",
  "จ่ายยา",
  "ขายยา",
  "สิทธิบัตรยา",
  "ผลข้างเคียง",
  "แพ้ยา",
  "ดื้อยา",
  "วัคซีน",
  "อย.",
];

const TRACKS: Record<NewsTrack, TrackConfig> = {
  pharmacy: {
    queries: [
      '"สอบใบประกอบวิชาชีพเภสัชกรรม" OR "สอบใบประกอบเภสัช" OR "ข้อสอบเภสัช" OR "ข้อสอบหลุด" OR "สภาเภสัชกรรม" when:90d',
      'เภสัชกร OR เภสัชกรรม OR ร้านยา when:30d',
      '"องค์การเภสัชกรรม" OR "ยาใหม่" OR "ยาปลอม" OR "อย. เตือน" when:30d',
    ],
    professionMarkers: ["เภสัช"],
    examKeywords: EXAM_KEYWORDS,
    professionKeywords: ["เภสัช", "ร้านยา", "สมุนไพร", ...DRUG_KEYWORDS],
  },
  nursing: {
    queries: [
      '"สอบใบประกอบวิชาชีพการพยาบาล" OR "สอบใบประกอบพยาบาล" OR "ข้อสอบพยาบาล" OR "ข้อสอบหลุด" OR "สภาการพยาบาล" when:90d',
      '"พยาบาลวิชาชีพ" OR "นักศึกษาพยาบาล" OR "วิชาชีพพยาบาล" OR "ขาดแคลนพยาบาล" when:30d',
      '"การใช้ยา" OR "ยาใหม่" OR "อย. เตือน" OR วัคซีน when:30d',
    ],
    professionMarkers: ["พยาบาล"],
    examKeywords: EXAM_KEYWORDS,
    professionKeywords: ["พยาบาล", ...DRUG_KEYWORDS],
    ignoreWords: ["โรงพยาบาล", "รักษาพยาบาล", "ปฐมพยาบาล"],
  },
};

// ข่าวที่ไม่เกี่ยว แม้จะมี keyword ตรง (เช่น ยาเสพติด / คดีอาชญากรรม)
const EXCLUDE_KEYWORDS = ["ยาเสพติด", "ยาบ้า", "ยาไอซ์", "กัญชา", "กระท่อม"];

const REVALIDATE_SECONDS = 60 * 60 * 3;

function feedUrl(query: string) {
  return `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=th&gl=TH&ceid=TH:th`;
}

function decode(s: string) {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&amp;/g, "&")
    .trim();
}

function tag(xml: string, name: string) {
  const m = xml.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`));
  return m ? decode(m[1]) : "";
}

function classify(title: string, config: TrackConfig): NewsTopic | null {
  if (EXCLUDE_KEYWORDS.some((k) => title.includes(k))) return null;
  const text = (config.ignoreWords ?? []).reduce((t, w) => t.replaceAll(w, " "), title);
  const isProfession = config.professionMarkers.some((k) => text.includes(k));
  if (isProfession && config.examKeywords.some((k) => text.includes(k))) return "exam";
  if (config.professionKeywords.some((k) => text.includes(k))) return "profession";
  return null;
}

async function fetchFeed(query: string, config: TrackConfig): Promise<NewsItem[]> {
  try {
    const res = await fetch(feedUrl(query), {
      headers: { "User-Agent": "Mozilla/5.0 pharmroo-news/1.0" },
      next: { revalidate: REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return [];
    const xml = await res.text();
    const items: NewsItem[] = [];
    for (const [, body] of xml.matchAll(/<item>([\s\S]*?)<\/item>/g)) {
      const source = tag(body, "source");
      let title = tag(body, "title");
      // Google News ต่อท้ายหัวข่าวด้วย " - ชื่อสำนักข่าว"
      if (source && title.endsWith(` - ${source}`)) {
        title = title.slice(0, -(source.length + 3));
      }
      const link = tag(body, "link");
      const topic = classify(title, config);
      if (!title || !link || !topic) continue;
      const pub = tag(body, "pubDate");
      const date = pub ? new Date(pub) : null;
      items.push({
        title,
        link,
        source,
        publishedAt: date && !isNaN(date.getTime()) ? date.toISOString() : null,
        topic,
      });
    }
    return items;
  } catch (err) {
    console.error("[exam-news] feed failed:", err);
    return [];
  }
}

export async function getExamNews(track: NewsTrack, limit = 6): Promise<NewsItem[]> {
  const config = TRACKS[track];
  const all = (await Promise.all(config.queries.map((q) => fetchFeed(q, config)))).flat();
  const seen = new Set<string>();
  return all
    .filter((i) => {
      const key = i.title.replace(/\s+/g, "");
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""))
    .slice(0, limit);
}
