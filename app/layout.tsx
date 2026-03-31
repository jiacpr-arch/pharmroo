import type { Metadata } from "next";
import { Sarabun } from "next/font/google";
import { Geist_Mono } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

const sarabun = Sarabun({
  variable: "--font-sarabun",
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "ฟาร์มรู้ PharmRu — แพลตฟอร์มข้อสอบใบประกอบวิชาชีพเภสัชกรรม",
    template: "%s | ฟาร์มรู้ PharmRu",
  },
  description:
    "เตรียมสอบใบประกอบวิชาชีพเภสัชกรรม PLE-PC PLE-CC1 ออนไลน์ ครอบคลุมทุกหมวดวิชา เภสัชเคมี เภสัชวิทยา เภสัชกรรมคลินิก กฎหมายเภสัชกรรม สมุนไพร พร้อมเฉลยละเอียด",
  metadataBase: new URL("https://pharmru.com"),
  openGraph: {
    title: "ฟาร์มรู้ PharmRu — แพลตฟอร์มข้อสอบเภสัชกรรม",
    description:
      "เตรียมสอบ PLE เภสัชกรรม ข้อสอบ MCQ ออนไลน์ ครบทุกหมวด พร้อมเฉลยละเอียด",
    url: "https://pharmru.com",
    siteName: "ฟาร์มรู้ PharmRu",
    locale: "th_TH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ฟาร์มรู้ PharmRu",
    description: "แพลตฟอร์มข้อสอบใบประกอบวิชาชีพเภสัชกรรม",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="th"
      className={`${sarabun.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SessionProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
