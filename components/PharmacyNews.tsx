import { getPharmacyNews, type NewsTopic } from "@/lib/pharmacy-news";
import { ExternalLink } from "lucide-react";

const TOPIC_LABEL: Record<NewsTopic, { label: string; className: string }> = {
  exam: { label: "การสอบ", className: "bg-amber-100 text-amber-800" },
  pharmacy: { label: "เภสัช & ยา", className: "bg-emerald-100 text-emerald-800" },
};

function formatDate(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("th-TH", {
    day: "numeric",
    month: "short",
    year: "2-digit",
    timeZone: "Asia/Bangkok",
  });
}

export default async function PharmacyNews({ limit = 6 }: { limit?: number }) {
  const news = await getPharmacyNews(limit);

  if (news.length === 0) {
    return (
      <p className="px-4 py-8 text-center text-sm text-slate-400">
        ยังไม่มีข่าวการสอบหรือข่าวเภสัชใหม่ในช่วงนี้
      </p>
    );
  }

  return (
    <ul className="divide-y">
      {news.map((item) => {
        const topic = TOPIC_LABEL[item.topic];
        return (
          <li key={item.link}>
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-3 px-4 py-3 transition-colors hover:bg-slate-50"
            >
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span className={`rounded-full px-2 py-0.5 font-semibold ${topic.className}`}>
                    {topic.label}
                  </span>
                  {item.source && <span>{item.source}</span>}
                  {item.publishedAt && <span>· {formatDate(item.publishedAt)}</span>}
                </div>
                <p className="line-clamp-2 text-sm font-medium text-slate-800 group-hover:text-emerald-700">
                  {item.title}
                </p>
              </div>
              <ExternalLink className="mt-1 h-4 w-4 shrink-0 text-slate-300 group-hover:text-emerald-600" />
            </a>
          </li>
        );
      })}
    </ul>
  );
}

export function PharmacyNewsSkeleton() {
  return (
    <p className="px-4 py-8 text-center text-sm text-slate-400">กำลังโหลดข่าว...</p>
  );
}
