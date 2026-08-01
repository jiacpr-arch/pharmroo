import Link from "next/link";
import { SearchX, Home, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-teal-50">
        <SearchX className="h-8 w-8 text-brand" />
      </div>
      <h1 className="text-2xl font-bold">ไม่พบหน้าที่คุณต้องการ (404)</h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        หน้านี้อาจถูกย้าย ลบไปแล้ว หรือพิมพ์ลิงก์ไม่ถูกต้อง
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Link href="/">
          <Button className="gap-2 bg-brand text-white hover:bg-brand-light">
            <Home className="h-4 w-4" /> กลับหน้าแรก
          </Button>
        </Link>
        <Link href="/ple">
          <Button variant="outline" className="gap-2">
            <BookOpen className="h-4 w-4" /> ฝึกทำข้อสอบ
          </Button>
        </Link>
      </div>
    </div>
  );
}
