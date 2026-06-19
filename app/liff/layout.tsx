import type { Metadata, Viewport } from "next";
import { SessionProvider } from "next-auth/react";
import LiffProvider from "./providers";

export const metadata: Metadata = {
  title: "PharmRoo Mini App",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function LiffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <LiffProvider>
        <div className="min-h-screen bg-background">{children}</div>
      </LiffProvider>
    </SessionProvider>
  );
}
