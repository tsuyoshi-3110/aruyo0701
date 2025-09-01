// app/layout.tsx
import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/Header";
import Script from "next/script";
import ThemeBackground from "@/components/ThemeBackground";
import WallpaperBackground from "@/components/WallpaperBackground";
import SubscriptionOverlay from "@/components/SubscriptionOverlay";
import { SITE_KEY } from "@/lib/atoms/siteKeyAtom";
import {
  kosugiMaru,
  notoSansJP,
  shipporiMincho,
  reggaeOne,
  yomogi,
  hachiMaruPop,
} from "@/lib/font";
import AnalyticsLogger from "@/components/AnalyticsLogger";

const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

// ✅ metadata から themeColor を削除
export const metadata: Metadata = {
  title: "ARUYO｜秘書代行・バックオフィス支援",
  description:
    "ARUYOは、兵庫県西宮市を拠点にスケジュール調整・メール対応・資料作成などの秘書代行／バックオフィス支援を提供するリモートアシスタントサービスです。",
  keywords: [
    "ARUYO",
    "アルヨ",
    "秘書代行",
    "オンライン秘書",
    "バーチャルアシスタント",
    "バックオフィス",
    "事務代行",
    "西宮",
    "兵庫",
    "スケジュール管理",
    "メール対応",
  ],
  authors: [{ name: "ARUYO" }],
  metadataBase: new URL("https://aruyo0701.shop"),
  alternates: {
    canonical: "https://aruyo0701.shop/",
  },
  openGraph: {
    title: "ARUYO｜秘書代行・バックオフィス支援",
    description:
      "スケジュール調整／メール対応／資料作成など、実務に寄り添う秘書代行・バックオフィス支援を提供します。",
    url: "https://aruyo0701.shop/",
    siteName: "ARUYO",
    type: "website",
    images: [
      {
        url: "https://aruyo0701.shop/ogpLogo.png",
        width: 1200,
        height: 630,
        alt: "ARUYO OGP",
      },
    ],
    locale: "ja_JP",
  },
  twitter: {
    card: "summary_large_image",
    title: "ARUYO｜秘書代行・バックオフィス支援",
    description:
      "兵庫・西宮から、スケジュール調整／メール対応／資料作成などの秘書代行を提供します。",
    images: ["https://aruyo0701.shop/ogpLogo.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico?v=4" },
      { url: "/icon.png", type: "image/png", sizes: "any" },
    ],
    apple: "/icon.png",
    shortcut: "/favicon.ico?v=4",
  },
};

// ✅ ここで themeColor を指定（root で一括適用）
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ja"
      className={`
        ${geistSans.variable} ${geistMono.variable}
        ${kosugiMaru.variable} ${notoSansJP.variable}
        ${yomogi.variable} ${hachiMaruPop.variable} ${reggaeOne.variable} ${shipporiMincho.variable}
        antialiased
      `}
    >
      <head>
        {/* OGP画像の事前読み込み */}
        <link rel="preload" as="image" href="/ogpLogo.png" type="image/png" />
        <meta
          name="google-site-verification"
          content="uN73if1NMw0L6lYoLXqKJDBt56lxDXlmbZwfurtPFNs"
        />
      </head>

      <body className="relative min-h-screen bg-[#ffffff]">
        <SubscriptionOverlay siteKey={SITE_KEY} />
        <AnalyticsLogger />
        <WallpaperBackground />
        <ThemeBackground />
        <Header />
        {children}

        {/* 構造化データ */}
        <Script
          id="ld-json"
          type="application/ld+json"
          strategy="afterInteractive"
        >
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ProfessionalService",
            name: "ARUYO",
            url: "https://aruyo0701.shop/",
            image: "https://aruyo0701.shop/ogpLogo.png",
            description:
              "秘書代行・バックオフィス支援（スケジュール調整、メール対応、資料作成など）。",
            serviceType: ["秘書代行", "バックオフィス支援", "事務代行"],
            address: {
              "@type": "PostalAddress",
              addressRegion: "兵庫県",
              addressLocality: "西宮市",
              streetAddress: "高須町1-1-4-613",
              postalCode: "663-8141",
            },
            telephone: "+818096047346",
            email: "aruyo0701@gmail.com",
            areaServed: [{ "@type": "AdministrativeArea", name: "兵庫県" }],
          })}
        </Script>
      </body>
    </html>
  );
}
