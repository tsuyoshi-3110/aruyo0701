import type { Metadata } from "next";
import StoresClient from "@/components/StoresClient";
import { PhoneSection } from "@/components/PhoneSection";

export const metadata: Metadata = {
  title: "拠点・対応エリア｜ARUYO",
  description:
    "ARUYOの拠点・対応エリアのご案内。兵庫県西宮市を拠点に、オンラインで全国の秘書代行・バックオフィス支援に対応します。",
  openGraph: {
    title: "拠点・対応エリア｜ARUYO",
    description:
      "ARUYOの拠点情報と対応エリア。西宮市からリモートで全国対応の秘書代行／バックオフィス支援を提供します。",
    url: "https://aruyo0701.shop/stores",
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

export default function StoresPage() {
  return (
    <main className="px-4 py-16">
      {/* ページタイトル・説明文 */}
      <section className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-2xl lg:text-3xl font-extrabold mb-4 text-white text-outline">
          ARUYO ─ 拠点・対応エリア
        </h1>
        <p className="leading-relaxed text-white text-outline">
          <strong>ARUYO</strong> は
          <strong>兵庫県西宮市</strong>を拠点に、
          スケジュール調整・メール対応・資料作成など
          <strong>秘書代行／バックオフィス支援</strong>を提供しています。
          <br className="hidden lg:block" />
          オンラインでのご支援が中心のため、<strong>全国対応</strong>が可能です。
          詳細は下記の連絡先よりお気軽にお問い合わせください。
        </p>
      </section>

      {/* 電話番号や連絡先セクション */}
      <section className="max-w-4xl mx-auto text-center mb-12">
        <PhoneSection />
      </section>

      {/* 店舗カードのクライアントレンダリング（Firestore対応） */}
      <StoresClient />
    </main>
  );
}
