// ข่าวสอบใบประกอบฯ / เภสัช / ยา จาก Google News RSS — กรองด้วย keyword ให้เหลือเฉพาะเรื่องที่เกี่ยวข้อง

export type NewsTopic = "exam" | "pharmacy";

export interface NewsItem {
  title: string;
  link: string;
  source: string;
  publishedAt: string | null;
  topic: NewsTopic;
}

const QUERIES = [
  '"สอบใบประกอบวิชาชีพเภสัชกรรม" OR "สอบใบประกอบเภสัช" OR "ข้อสอบเภสัช" OR "ข้อสอบหลุด" OR "สภาเภสัชกรรม" when:90d',
  'เภสัชกร OR เภสัชกรรม OR ร้านยา when:30d',
  '"องค์การเภสัชกรรม" OR "ยาใหม่" OR "ยาปลอม" OR "อย. เตือน" when:30d',
];

// ต้องมีอย่างน้อย 1 คำในหัวข่าวถึงจะแสดง
const EXAM_KEYWORDS = [
  "สอบใบประกอบ",
  "ข้อสอบ",
  "วันสอบ",
  "ผลสอบ",
  "สมัครสอบ",
  "สอบเภสัช",
  "สภาเภสัชกรรม",
  "ใบประกอบวิชาชีพเภสัช",
];

const PHARMACY_KEYWORDS = [
  "เภสัช",
  "ร้านยา",
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
  "สมุนไพร",
];

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

function classify(title: string): NewsTopic | null {
  if (EXCLUDE_KEYWORDS.some((k) => title.includes(k))) return null;
  if (EXAM_KEYWORDS.some((k) => title.includes(k))) return "exam";
  if (PHARMACY_KEYWORDS.some((k) => title.includes(k))) return "pharmacy";
  return null;
}

async function fetchFeed(query: string): Promise<NewsItem[]> {
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
      const topic = classify(title);
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
    console.error("[pharmacy-news] feed failed:", err);
    return [];
  }
}

export async function getPharmacyNews(limit = 6): Promise<NewsItem[]> {
  const all = (await Promise.all(QUERIES.map(fetchFeed))).flat();
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
