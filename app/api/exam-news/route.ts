import { NextRequest, NextResponse } from "next/server";
import { getExamNews, type NewsTrack } from "@/lib/exam-news";

export async function GET(request: NextRequest) {
  const track: NewsTrack =
    request.nextUrl.searchParams.get("track") === "nursing" ? "nursing" : "pharmacy";
  const news = await getExamNews(track);
  return NextResponse.json(
    { news },
    { headers: { "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600" } }
  );
}
