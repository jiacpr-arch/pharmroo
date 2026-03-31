import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Student Dashboard",
  description:
    "ดูสถิติการเรียน คะแนนรายสาขา แผนติว AI และ Badge ของคุณ — ฟาร์มรู้ PharmRu",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
