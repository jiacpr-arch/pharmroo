import type { Metadata } from "next";
import { Sarabun } from "next/font/google";
import { Geist_Mono } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
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
    default: "ฟาร์มรู้ PharmRu — แพลตฟอร์มข้อสอบ PLE และ NLE",
    template: "%s | ฟาร์มรู้ PharmRu",
  },
  description:
    "เตรียมสอบใบประกอบวิชาชีพเภสัชกรรม (PLE-PC, PLE-CC1) และพยาบาล (NLE) ออนไลน์ ครอบคลุมทุกหมวดวิชา พร้อมเฉลยละเอียด — ฝึกฟรี เริ่มต้นที่ 0 บาท",
  keywords: [
    "PLE", "PLE-PC", "PLE-CC1", "ข้อสอบเภสัช", "ใบประกอบเภสัชกรรม",
    "NLE", "ข้อสอบพยาบาล", "ใบประกอบพยาบาล", "สภาการพยาบาล",
    "ข้อสอบ MCQ", "เตรียมสอบใบประกอบวิชาชีพ",
  ],
  metadataBase: new URL("https://pharmru.com"),
  openGraph: {
    title: "ฟาร์มรู้ PharmRu — ข้อสอบ PLE เภสัช และ NLE พยาบาล",
    description:
      "เตรียมสอบ PLE (เภสัช) และ NLE (พยาบาล) ออนไลน์ ข้อสอบ MCQ ครบทุกหมวด พร้อมเฉลยละเอียด ฝึกฟรีไม่จำกัด",
    url: "https://pharmru.com",
    siteName: "ฟาร์มรู้ PharmRu",
    locale: "th_TH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ฟาร์มรู้ PharmRu",
    description: "แพลตฟอร์มข้อสอบใบประกอบวิชาชีพเภสัชและพยาบาล",
  },
};

const organizationLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "ฟาร์มรู้ PharmRu",
  alternateName: "PharmRoo",
  url: "https://pharmru.com",
  description:
    "แพลตฟอร์มข้อสอบใบประกอบวิชาชีพเภสัชกรรม (PLE) และพยาบาล (NLE) ออนไลน์",
  contactPoint: {
    "@type": "ContactPoint",
    email: "jiacpr@gmail.com",
    contactType: "customer support",
    availableLanguage: ["Thai", "English"],
  },
  areaServed: "TH",
  inLanguage: "th",
};

const websiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "ฟาร์มรู้ PharmRu",
  url: "https://pharmru.com",
  inLanguage: "th",
  publisher: { "@type": "Organization", name: "ฟาร์มรู้ PharmRu" },
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
        <JsonLd data={organizationLd} />
        <JsonLd data={websiteLd} />
        <SessionProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
