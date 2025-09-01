// src/app/(routes)/news/page.tsx
import type { Metadata } from "next";
import NewsClient from "@/components/NewsClient";

export const metadata: Metadata = {
  title: "お知らせ｜ARUYO",
  description:
    "ARUYOの最新情報やご案内。秘書代行・バックオフィス支援（スケジュール調整、メール対応、資料作成など）に関する更新情報を掲載します。",
  openGraph: {
    title: "お知らせ｜ARUYO",
    description:
      "ARUYOの最新のお知らせ。サービス更新、スケジュール、キャンペーン情報などを随時ご案内します。",
    url: "https://aruyo0701.shop/news",
    siteName: "ARUYO",
    images: [{ url: "/ogpLogo.png", width: 1200, height: 630 }],
    locale: "ja_JP",
    type: "website",
  },
  alternates: { canonical: "https://aruyo0701.shop/news" },
};

export default function NewsPage() {
  return (
    <main className="px-4 py-12 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mt-6 mb-6 text-center text-white/80">
        お知らせ
      </h1>
      <NewsClient />
    </main>
  );
}
