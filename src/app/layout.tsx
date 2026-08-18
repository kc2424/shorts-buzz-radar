import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Header } from "@/components/Header";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Buzz Style — 今バズってるShortsの型",
    template: "%s | Buzz Style",
  },
  description:
    "YouTube Shortsで今バズっている動画を、個別のランキングではなく「型（フォーマット）」として抽出して見せるツール。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={inter.variable}>
      <body>
        <Header />
        <main className="min-h-[calc(100vh-4rem)] py-10">{children}</main>
        <footer className="border-t border-line py-8">
          <div className="container-main flex flex-col gap-2 text-xs text-ink-faint sm:flex-row sm:justify-between">
            <p>© 2026 Buzz Style</p>
            <p>YouTube Shorts バズ型レーダー · 登録不要・完全無料</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
