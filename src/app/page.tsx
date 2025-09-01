// src/app/(routes)/home/page.tsx

import type { Metadata } from "next";
import BackgroundVideo from "@/components/backgroundVideo/BackgroundVideo";
import TopFixedText from "@/components/TopFixedText";

export const metadata: Metadata = {
  title: "ARUYO｜秘書代行・バックオフィス支援",
  description:
    "ARUYOは、兵庫県西宮市を拠点にスケジュール調整・メール対応・資料作成などの秘書代行／バックオフィス支援を提供するリモートアシスタントサービスです。",
  openGraph: {
    title: "ARUYO｜秘書代行・バックオフィス支援",
    description:
      "スケジュール調整／メール対応／資料作成など、実務に寄り添う秘書代行・バックオフィス支援を提供します。",
    url: "https://aruyo0701.shop/",
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
  alternates: { canonical: "https://aruyo0701.shop/" },
};

export default function HomePage() {
  return (
    <main className="w-full overflow-x-hidden">
      {/* ① ファーストビュー：背景動画または画像 */}
      <section className="relative h-screen overflow-hidden">
        <BackgroundVideo />
      </section>

      {/* ② テキスト紹介セクション */}
      <section className="relative z-10 text-white px-4 py-20">
        {/* 編集可能な固定テキストコンポーネント */}
        <TopFixedText />

        {/* ページタイトルとリード文 */}
        <h1 className="text-3xl lg:text-4xl font-extrabold text-center leading-tight mb-6 text-outline">
          ARUYO
        </h1>

        <p className="max-w-3xl mx-auto text-center leading-relaxed text-outline">
          兵庫県西宮市を拠点に、スケジュール調整・メール対応・資料作成・リサーチ・経理補助など
          日々の業務を支える<strong>秘書代行／バックオフィス支援</strong>
          を提供しています。
        </p>
      </section>

      {/* ③ JSON-LD（構造化データ） */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              name: "ARUYO",
              url: "https://aruyo0701.shop/",
              description:
                "秘書代行・バックオフィス支援（スケジュール調整、メール対応、資料作成、リサーチ、経理補助など）。",
              serviceType: ["秘書代行", "バックオフィス支援", "事務代行"],
              areaServed: [{ "@type": "AdministrativeArea", name: "兵庫県" }],
              image: "https://aruyo0701.shop/ogp-home.jpg",
              address: {
                "@type": "PostalAddress",
                addressRegion: "兵庫県",
                addressLocality: "西宮市",
                streetAddress: "高須町1-1-4-613",
                postalCode: "663-8141",
              },
              telephone: "+818096047346",
              email: "aruyo0701@gmail.com",
            },
          ]),
        }}
      />
    </main>
  );
}
