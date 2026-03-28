import type { Metadata } from "next";
import { Sarabun } from "next/font/google";
import { Geist_Mono } from "next/font/google";
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
    default: "PharmRoo (ภ.รู้) — แพลตฟอร์มข้อสอบใบประกอบวิชาชีพเภสัชกรรม",
    template: "%s | PharmRoo ภ.รู้",
  },
  description:
    "เตรียมสอบใบประกอบวิชาชีพเภสัชกรรม PLE-PC PLE-CC1 ออนไลน์ ครอบคลุมทุกหมวดวิชา Pharmacotherapy เทคโนโลยีเภสัชกรรม เภสัชวิเคราะห์ เภสัชจลนศาสตร์ กฎหมายยา พร้อมเฉลยละเอียด",
  metadataBase: new URL("https://pharma.morroo.com"),
  openGraph: {
    title: "PharmRoo (ภ.รู้) — แพลตฟอร์มข้อสอบเภสัชกรรม",
    description:
      "เตรียมสอบ PLE เภสัชกรรม ข้อสอบ MCQ ออนไลน์ ครบทุกหมวด พร้อมเฉลยละเอียด",
    url: "https://pharma.morroo.com",
    siteName: "PharmRoo ภ.รู้",
    locale: "th_TH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PharmRoo (ภ.รู้)",
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
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
