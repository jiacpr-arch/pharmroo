"use client";

import { useEffect, useState } from "react";
import type { NewsItem, NewsTrack } from "@/lib/exam-news";
import ExamNewsList, { ExamNewsSkeleton } from "@/components/ExamNewsList";

export default function ExamNewsClient({ track }: { track: NewsTrack }) {
  const [news, setNews] = useState<NewsItem[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/exam-news?track=${track}`)
      .then((res) => (res.ok ? res.json() : { news: [] }))
      .then((data: { news?: NewsItem[] }) => {
        if (!cancelled) setNews(data.news ?? []);
      })
      .catch(() => {
        if (!cancelled) setNews([]);
      });
    return () => {
      cancelled = true;
    };
  }, [track]);

  if (news === null) return <ExamNewsSkeleton />;
  return <ExamNewsList track={track} news={news} />;
}
