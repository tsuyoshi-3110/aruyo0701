import type { Metadata } from "next";
import ProductsClient from "@/components/ProductsClient";

export const metadata: Metadata = {
  title: "サービス一覧｜ARUYO",
  description:
    "ARUYOのサービス一覧ページ。スケジュール調整、メール対応、資料作成、リサーチ、経理補助など、秘書代行・バックオフィス支援のメニューをご紹介します。",
  openGraph: {
    title: "サービス一覧｜ARUYO",
    description:
      "秘書代行／バックオフィス支援のサービス詳細。スケジュール調整・メール対応・資料作成・リサーチ・経理補助などを掲載しています。",
    url: "https://aruyo0701.shop/products", // 本番URL
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

export default function ProductsPage() {
  return <ProductsClient />;
}





