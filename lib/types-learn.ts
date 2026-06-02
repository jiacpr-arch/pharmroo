import type { McqQuestion } from "./types-mcq";

export type LessonStatus = "draft" | "published";
export type ProgressStatus = "not_started" | "in_progress" | "completed";
export type CardType =
  | "concept"
  | "example"
  | "tip"
  | "mnemonic"
  | "warning"
  | "qa";
export type CardSource = "authored" | "student_qa";

export interface LearningUnit {
  id: string;
  subject_id: string | null;
  title_th: string;
  description_th: string | null;
  icon: string;
  sort_order: number;
  status: LessonStatus;
  created_at: string;
}

export interface LearningLesson {
  id: string;
  unit_id: string;
  title_th: string;
  subtitle_th: string | null;
  icon: string;
  sort_order: number;
  est_minutes: number;
  xp_reward: number;
  quiz_question_ids: string[];
  quiz_count: number;
  status: LessonStatus;
  created_at: string;
}

export interface LessonCard {
  id: string;
  lesson_id: string;
  card_type: CardType;
  title_th: string | null;
  body_md: string;
  image_url: string | null;
  sort_order: number;
  source: CardSource;
  created_at: string;
}

export interface LessonQuestion {
  id: string;
  user_id: string;
  lesson_id: string;
  question: string;
  answer_md: string | null;
  card_id: string | null;
  status: "answered" | "failed";
  created_at: string;
}

/** A lesson node on the learning path, with the current user's progress state. */
export interface PathLessonNode {
  id: string;
  title_th: string;
  subtitle_th: string | null;
  icon: string;
  est_minutes: number;
  xp_reward: number;
  sort_order: number;
  progress_status: ProgressStatus | "not_started";
  score: number;
  quiz_total: number;
  locked: boolean;
}

/** A unit section on the learning path. */
export interface PathUnitSection {
  id: string;
  subject_id: string | null;
  title_th: string;
  description_th: string | null;
  icon: string;
  sort_order: number;
  lessons: PathLessonNode[];
}

/** Full lesson payload for the player. */
export interface LessonForPlayer {
  lesson: LearningLesson;
  unit: LearningUnit | null;
  cards: LessonCard[];
  questions: McqQuestion[];
  progress: {
    status: ProgressStatus | "not_started";
    last_card_index: number;
  } | null;
}

/** Unit with its lessons, for the admin authoring UI. */
export interface UnitWithLessons extends LearningUnit {
  subject_name_th: string | null;
  lessons: LearningLesson[];
}
