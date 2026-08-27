import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: {
    default: "Verity-cn — Minecraft AI 伴侣模组",
    template: "%s — Verity-cn",
  },
  description:
    "为中国玩家打造的 Minecraft AI 伴侣模组，支持对话、语音、音色克隆，开箱即玩。",
  icons: {
    icon: "/favicon.png",
  },
  metadataBase: new URL("https://verity-cn.pages.dev"),
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: "Verity-cn",
    title: "Verity-cn — Minecraft AI 伴侣模组",
    description:
      "为中国玩家打造的 Minecraft AI 伴侣模组，支持对话、语音、音色克隆，开箱即玩。",
    images: ["/og.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Verity-cn — Minecraft AI 伴侣模组",
    description:
      "为中国玩家打造的 Minecraft AI 伴侣模组，支持对话、语音、音色克隆，开箱即玩。",
    images: ["/og.png"],
  },
  alternates: {
    canonical: "https://verity-cn.pages.dev",
  },
  other: {
    "msvalidate.01": "",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="zh-CN"
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable} h-full antialiased`}
    >
      <body className="relative min-h-full flex flex-col bg-background text-foreground">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "Verity-cn",
              applicationCategory: "GameApplication",
              operatingSystem: "Windows, Android",
              description:
                "为中国玩家打造的 Minecraft AI 伴侣模组，支持对话、语音、音色克隆，开箱即玩。",
              url: "https://verity-cn.pages.dev",
              downloadUrl: "https://verity-cn.pages.dev/download",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "CNY",
              },
            }),
          }}
        />
        {/* 页面级中性顶光（极淡背景，非主页不再单调；首页的网格辉光盖在其上） */}
        <div
          className="pointer-events-none fixed inset-0 -z-10 page-glow"
          aria-hidden="true"
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SiteHeader />
          {children}
          <div className="bg-grain" aria-hidden="true" />
        </ThemeProvider>
      </body>
    </html>
  );
}
