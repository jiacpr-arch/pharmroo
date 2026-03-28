"use client";

import { use } from "react";
import { redirect } from "next/navigation";

export default function AdminExamDetailPage({ params }: { params: Promise<{ id: string }> }) {
  use(params);
  redirect("/admin/exams");
}
