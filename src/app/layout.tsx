/**
 * 市相 (ShiXiang) - Root Layout
 * 根布局 - 暗色主题
 */

import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Noto_Sans_SC, Noto_Serif_SC } from "next/font/google";
import { BaiduAnalytics } from "@/components/analytics/BaiduAnalytics";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoSansSC = Noto_Sans_SC({
  variable: "--font-noto-sans-sc",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const notoSerifSC = Noto_Serif_SC({
  variable: "--font-noto-serif-sc",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "市相 - 股票八字分析",
    template: "%s | 市相",
  },
  description:
    "以股票 IPO 日期时间为生辰，运用中国传统四柱八字、五行、十神理论，提供独特的市场分析视角。新中式金融玄学。",
  keywords: ["股票", "八字", "四柱", "五行", "大运", "IPO", "金融玄学", "市相", "ShiXiang"],
  authors: [{ name: "市相" }],
  creator: "市相",
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: "市相",
    title: "市相 - 股票八字分析",
    description: "新中式金融玄学 - 用八字解读股票命理",
  },
};

export const viewport: Viewport = {
  themeColor: "#020617",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${notoSansSC.variable} ${notoSerifSC.variable} font-sans antialiased bg-slate-950 text-slate-100`}
      >
        {children}
        <BaiduAnalytics />
      </body>
    </html>
  );
}
