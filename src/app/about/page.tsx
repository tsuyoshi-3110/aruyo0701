import type { Metadata } from "next";
import AboutClient from "@/components/AboutClient";

export const metadata: Metadata = {
  title: "私たちの想い｜ARUYO",
  description:
    "ARUYOの想い。お客様の事業運営に寄り添い、スケジュール調整・メール対応・資料作成などの秘書代行／バックオフィス支援で、安心と余白を届けます。",
  openGraph: {
    title: "私たちの想い｜ARUYO",
    description:
      "兵庫・西宮を拠点に、オンラインで全国対応。実務に寄り添う秘書代行・バックオフィス支援で、日々の業務をスムーズに。",
    url: "https://aruyo0701.shop/about", // 本番URL
    siteName: "ARUYO",
    images: [
      {
        url: "/ogpLogo.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "ja_JP",
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <main className="px-4 py-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mt-4 text-center text-white/80 text-outline">
        ARUYOの想い
      </h1>
      <AboutClient />
    </main>
  );
}
