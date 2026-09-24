import { getExamNews, type NewsTrack } from "@/lib/exam-news";
import ExamNewsList from "@/components/ExamNewsList";

export default async function ExamNews({
  track,
  limit = 6,
}: {
  track: NewsTrack;
  limit?: number;
}) {
  const news = await getExamNews(track, limit);
  return <ExamNewsList track={track} news={news} />;
}

export { ExamNewsSkeleton } from "@/components/ExamNewsList";
