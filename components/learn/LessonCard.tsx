import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Lightbulb,
  BookOpen,
  Sparkles,
  Brain,
  AlertTriangle,
  MessageCircleQuestion,
} from "lucide-react";
import type { LessonCard as LessonCardType, CardType } from "@/lib/types-learn";
import { MiniMarkdown } from "./MiniMarkdown";

const CARD_STYLES: Record<
  CardType,
  { label: string; border: string; bg: string; title: string; icon: React.ReactNode }
> = {
  concept: {
    label: "แนวคิด",
    border: "border-brand/30",
    bg: "bg-brand/5",
    title: "text-brand-dark",
    icon: <BookOpen className="h-5 w-5 text-brand" />,
  },
  example: {
    label: "ตัวอย่าง",
    border: "border-blue-200",
    bg: "bg-blue-50/40",
    title: "text-blue-800",
    icon: <Lightbulb className="h-5 w-5 text-blue-600" />,
  },
  tip: {
    label: "เคล็ดลับ",
    border: "border-green-200",
    bg: "bg-green-50/40",
    title: "text-green-800",
    icon: <Sparkles className="h-5 w-5 text-green-600" />,
  },
  mnemonic: {
    label: "เทคนิคจำ",
    border: "border-purple-200",
    bg: "bg-purple-50/40",
    title: "text-purple-800",
    icon: <Brain className="h-5 w-5 text-purple-600" />,
  },
  warning: {
    label: "ข้อควรระวัง",
    border: "border-amber-200",
    bg: "bg-amber-50/40",
    title: "text-amber-800",
    icon: <AlertTriangle className="h-5 w-5 text-amber-600" />,
  },
  qa: {
    label: "ถาม-ตอบ",
    border: "border-teal-200",
    bg: "bg-teal-50/40",
    title: "text-teal-800",
    icon: <MessageCircleQuestion className="h-5 w-5 text-teal-600" />,
  },
};

export default function LessonCard({ card }: { card: LessonCardType }) {
  const style = CARD_STYLES[card.card_type] ?? CARD_STYLES.concept;

  return (
    <Card className={`${style.border} ${style.bg}`}>
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-3">
          {style.icon}
          <Badge variant="secondary" className="text-[11px]">
            {style.label}
          </Badge>
          {card.source === "student_qa" && (
            <Badge variant="outline" className="text-[10px]">
              จากคำถามผู้เรียน
            </Badge>
          )}
        </div>
        {card.title_th && (
          <h3 className={`font-bold text-lg mb-2 ${style.title}`}>
            {card.title_th}
          </h3>
        )}
        <div className="text-base leading-relaxed text-foreground/90">
          <MiniMarkdown source={card.body_md} />
        </div>
        {card.image_url && (
          <div className="mt-4">
            <img
              src={card.image_url}
              alt={card.title_th ?? "ภาพประกอบบทเรียน"}
              className="max-w-full rounded-lg border max-h-80 object-contain"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
