"use client";

import { useT } from "@/components/locale-provider";
import type { LocaleCode } from "@/lib/i18n";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BookOpen,
  Brain,
  Download,
  Gamepad2,
  Globe,
  KeyRound,
  MessageCircle,
  Mic,
  Music2,
  Network,
  PackagePlus,
  Palette,
  Search,
  SlidersHorizontal,
  Sparkles,
  UserCheck,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { GithubIcon } from "@/components/github-icon";
import { VerityModel } from "@/components/verity-model";
import { MusicPlayer } from "@/components/music-player";
import { Reveal } from "@/components/reveal";
import { SpotlightCard } from "@/components/spotlight-card";



/** Vercel 风格截图卡：说明在上，产品截图装在带窗口栏的框架里 */
function ShotCard({
  src,
  w,
  h,
  label,
  icon,
  title,
  desc,
}: {
  src: string;
  w: number;
  h: number;
  label: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-border/60 bg-card transition-[border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-foreground/15">
      <div className="flex flex-col gap-2 p-6 pb-5">
        <div className="flex items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
            {icon}
          </div>
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">{desc}</p>
      </div>
      <div className="mt-auto border-t">
        <div className="flex items-center gap-1.5 border-b bg-muted/40 px-3 py-2">
          <span className="size-2 rounded-full bg-border" />
          <span className="size-2 rounded-full bg-border" />
          <span className="size-2 rounded-full bg-border" />
          <span className="ml-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            {label}
          </span>
        </div>
        <Image src={src} alt={title} width={w} height={h} className="h-auto w-full" />
      </div>
    </div>
  );
}

export function HomeView({ locale }: { locale: LocaleCode }) {
  const t = useT();
  const faqs = [
    {
      q: t("page.009"),
      a: t("page.010"),
    },
    {
      q: t("page.011"),
      a: t("page.012"),
    },
    {
      q: t("page.013"),
      a: t("page.014"),
    },
    {
      q: t("page.015"),
      a: t("page.016"),
    },
    {
      q: t("page.017"),
      a: t("page.018"),
    },
  ];

  const versions = [
    {
      v: "v3.5",
      date: "2026-09",
      desc: t("page.001"),
    },
    {
      v: "v3.4",
      date: "2026-08",
      desc: t("page.002"),
    },
    {
      v: "v3.3",
      date: "2026-08",
      desc: t("page.003"),
    },
    {
      v: "v3.2",
      date: "2026-07",
      desc: t("page.004"),
    },
    {
      v: "v3.1",
      date: "2026-07",
      desc: t("page.005"),
    },
    {
      v: "v3.0",
      date: "2026-07",
      desc: t("page.006"),
    },
    {
      v: "v2.75",
      date: "2026-07",
      desc: t("page.007"),
    },
    {
      v: "v2.5",
      date: "2026-07",
      desc: t("page.008"),
    },
  ];

  return (
    <main className="flex-1">
      {/* ============ Hero ============ */}
      <section className="relative overflow-hidden border-b bg-gradient-to-b from-background/80 to-background">
        {/* 辉光：始终显示，移动端全宽；网格：lg 起才显示，仅覆盖左侧文字区 */}
        <div
          className="pointer-events-none absolute top-0 left-0 z-10 h-full w-full lg:w-1/2"
          style={{
            maskImage: "linear-gradient(to bottom, #000 0%, #000 70%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, #000 0%, #000 70%, transparent 100%)",
          }}
          aria-hidden="true"
        >
          <div className="absolute inset-0 glow-top" />
          <div className="absolute inset-0 bg-grid hidden lg:block" />
        </div>
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:gap-12 items-center">
            {/* 左侧：标题 + 标语 + 按钮 */}
            <div className="flex flex-col gap-6">
              <Reveal>
                <Badge
                  variant="secondary"
                  className="w-fit gap-2 border-border/60 py-1 pl-2 pr-3"
                >
                  <span className="relative flex size-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                    <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
                  </span>{t("page.019")}</Badge>
              </Reveal>

              <Reveal delay={60}>
                <div className="flex items-center gap-4">
                  <Image
                    src="/verity-icon.png"
                    alt="Verity"
                    width={56}
                    height={56}
                    className="rounded-xl ring-1 ring-border/50 shadow-lg"
                    priority
                  />
                  <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                    Verity-cn
                  </h1>
                </div>
              </Reveal>

              <Reveal delay={120}>
                <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">{t("page.020")}<br />
                  <span className="text-base">{t("page.021")}</span>
                </p>
              </Reveal>

              <Reveal delay={180}>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button size="lg" className="group" render={<Link href="/docs" />}>{t("page.022")}<ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="group"
                    render={<Link href="/download" />}
                  >
                    <Download className="size-4" />{t("page.023")}</Button>
                </div>
              </Reveal>

              <Reveal delay={240}>
                <div className="flex flex-wrap gap-2 pt-2">
                  {[t("page.024"), t("page.025"), t("page.026"), t("page.027")].map(
                    (tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground"
                      >
                        {tag}
                      </span>
                    )
                  )}
                </div>
              </Reveal>
            </div>

            {/* 右侧：音乐频谱 + 3D 模型（移动端纵向堆叠，sm 起双列；小幅右移利用页边距） */}
            <Reveal delay={60} className="lg:-mr-8">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="relative h-72 rounded-2xl border border-border/50 bg-gradient-to-br from-background to-muted/30 overflow-hidden shadow-2xl sm:aspect-square sm:h-auto">
                  <MusicPlayer />
                </div>
                <div className="relative h-72 rounded-2xl border border-border/50 bg-gradient-to-br from-background to-muted/30 overflow-hidden shadow-2xl sm:aspect-square sm:h-auto">
                  <VerityModel />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============ 信任条 ============ */}
      <section className="border-b bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <p className="text-center text-sm font-medium text-muted-foreground">{t("page.029")}</p>
        </div>
      </section>

      {/* ============ 特性 Bento ============ */}
      <section className="mx-auto max-w-7xl px-4 py-16 lg:py-24 sm:px-6 lg:px-8">
        <Reveal className="max-w-2xl">
          <p className="text-sm font-medium text-muted-foreground">{t("page.030")}</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{t("page.031")}</h2>
          <p className="mt-4 text-muted-foreground">{t("page.032")}</p>
        </Reveal>

        <div className="mt-10 lg:mt-12 grid gap-4 lg:grid-cols-6 lg:items-start">
          {/* 大卡：AI 对话 */}
          <Reveal className="lg:col-span-4">
            <SpotlightCard
              icon={<MessageCircle className="size-5" />}
              title={t("page.033")}
              description={t("page.034")}
            >
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="inline-flex items-center rounded-full border border-border bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground">
                  DeepSeek
                </span>
                <span className="inline-flex items-center rounded-full border border-border bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground">{t("page.035")}</span>
                <span className="inline-flex items-center rounded-full border border-border bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground">
                  MiMo
                </span>
                <span className="inline-flex items-center rounded-full border border-border bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground">{t("page.036")}</span>
              </div>
            </SpotlightCard>
          </Reveal>

          {/* 小卡：语音交互 */}
          <Reveal delay={60} className="lg:col-span-2">
            <SpotlightCard
              icon={<Mic className="size-5" />}
              title={t("page.037")}
              description={t("page.038")}
            >
              <span className="mt-2 inline-flex items-center rounded-full border border-border bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground">
                TTS + STT
              </span>
            </SpotlightCard>
          </Reveal>

          {/* 小卡：零前置依赖 */}
          <Reveal delay={80} className="lg:col-span-2">
            <SpotlightCard
              icon={<PackagePlus className="size-5" />}
              title={t("page.039")}
              description={t("page.040")}
            >
              <span className="mt-2 inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">{t("page.041")}</span>
            </SpotlightCard>
          </Reveal>

          {/* 宽卡：音色克隆 */}
          <Reveal delay={120} className="lg:col-span-4">
            <SpotlightCard
              icon={<Sparkles className="size-5" />}
              title={t("page.042")}
              description={t("page.043")}
            >
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="inline-flex items-center rounded-full border border-border bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground">{t("page.044")}</span>
                <span className="inline-flex items-center rounded-full border border-border bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground">{t("page.045")}</span>
                <span className="inline-flex items-center rounded-full border border-border bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground">{t("page.046")}</span>
              </div>
            </SpotlightCard>
          </Reveal>

          {/* 小卡：游戏工具 */}
          <Reveal delay={100} className="lg:col-span-3">
            <SpotlightCard
              icon={<Wrench className="size-5" />}
              title={t("page.047")}
              description={t("page.048")}
            >
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="inline-flex items-center rounded-full border border-border bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground">
                  get_recipe
                </span>
                <span className="inline-flex items-center rounded-full border border-border bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground">
                  get_all_mods
                </span>
              </div>
            </SpotlightCard>
          </Reveal>

          {/* 小卡：自定义皮肤 */}
          <Reveal delay={140} className="lg:col-span-3">
            <SpotlightCard
              icon={<Palette className="size-5" />}
              title={t("page.049")}
              description={t("page.050")}
            >
              <span className="mt-2 inline-flex items-center rounded-full border border-border bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground">
                1024×1024 PNG
              </span>
            </SpotlightCard>
          </Reveal>
        </div>
      </section>

      {/* ============ cn 版特色（截图展示） ============ */}
      <section className="border-t bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 py-16 lg:py-24 sm:px-6 lg:px-8">
          <Reveal className="max-w-2xl">
            <p className="text-sm font-medium text-muted-foreground">{t("page.051")}</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{t("page.052")}</h2>
            <p className="mt-4 text-muted-foreground">{t("page.053")}</p>
          </Reveal>

          {/* 截图卡 2×2 */}
          <div className="mt-10 lg:mt-12 grid gap-4 lg:grid-cols-2">
            <Reveal>
              <ShotCard
                src="/features/recipe-search.png"
                w={664}
                h={92}
                label="ingame-chat"
                icon={<Search className="size-5" />}
                title={t("page.054")}
                desc={t("page.055")}
              />
            </Reveal>
            <Reveal delay={60}>
              <ShotCard
                src="/features/web-search.png"
                w={665}
                h={76}
                label="web-search"
                icon={<Globe className="size-5" />}
                title={t("page.056")}
                desc={t("page.057")}
              />
            </Reveal>
            <Reveal delay={40}>
              <ShotCard
                src="/features/netease-music.png"
                w={1920}
                h={1017}
                label="netease-cloud-music"
                icon={<Music2 className="size-5" />}
                title={t("page.058")}
                desc={t("page.059")}
              />
            </Reveal>
            <Reveal delay={100}>
              <ShotCard
                src="/features/llm-config.png"
                w={1920}
                h={1017}
                label="config-wizard"
                icon={<SlidersHorizontal className="size-5" />}
                title={t("page.060")}
                desc={t("page.061")}
              />
            </Reveal>
          </div>

          {/* 五格特性带 */}
          <Reveal delay={80}>
            <div className="mt-4 grid overflow-hidden rounded-xl border border-border/60 bg-card sm:grid-cols-2 lg:grid-cols-5 lg:divide-x lg:divide-border/60">
              {[
                {
                  icon: <KeyRound className="size-4" />,
                  title: t("page.062"),
                  desc: t("page.063"),
                },
                {
                  icon: <Brain className="size-4" />,
                  title: t("page.064"),
                  desc: t("page.065"),
                },
                {
                  icon: <PackagePlus className="size-4" />,
                  title: t("page.066"),
                  desc: t("page.067"),
                },
                {
                  icon: <UserCheck className="size-4" />,
                  title: t("page.068"),
                  desc: t("page.069"),
                },
                {
                  icon: <Network className="size-4" />,
                  title: t("page.070"),
                  desc: t("page.071"),
                },
              ].map((f, i) => (
                <div
                  key={f.title}
                  className={`group flex flex-col gap-2 p-5 transition-colors hover:bg-muted/40 ${
                    i > 0 ? "border-t border-border/60 sm:border-t-0" : ""
                  } ${i === 1 ? "sm:border-l" : ""} ${
                    i >= 2 ? "sm:border-t sm:border-border/60 lg:border-t-0 lg:border-l" : ""
                  }`}
                >
                  <div className="flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
                    {f.icon}
                  </div>
                  <p className="text-sm font-semibold">{f.title}</p>
                  <p className="text-xs leading-relaxed text-muted-foreground">{f.desc}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ 安装 ============ */}
      <section className="border-y bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 py-16 lg:py-24 sm:px-6 lg:px-8">
          <Reveal className="max-w-2xl">
            <p className="text-sm font-medium text-muted-foreground">{t("page.072")}</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{t("page.073")}</h2>
          </Reveal>

          <div className="mt-10 lg:mt-12 grid gap-6 sm:grid-cols-3">
            {[
              {
                step: "01",
                title: t("page.074"),
                desc: t("page.075"),
              },
              {
                step: "02",
                title: t("page.076"),
                desc: t("page.077"),
              },
              {
                step: "03",
                title: t("page.078"),
                desc: t("page.079"),
              },
            ].map((item) => (
              <Reveal key={item.step}>
                <Card className="h-full">
                  <CardHeader>
                    <span className="text-3xl font-bold text-muted-foreground/30">
                      {item.step}
                    </span>
                    <CardTitle className="mt-2">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 版本历史 ============ */}
      <section className="mx-auto max-w-7xl px-4 py-16 lg:py-24 sm:px-6 lg:px-8">
        <Reveal className="max-w-2xl">
          <p className="text-sm font-medium text-muted-foreground">{t("page.080")}</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{t("page.081")}</h2>
        </Reveal>

        <div className="mt-10 lg:mt-12 space-y-4">
          {versions.slice(0, 5).map((v, i) => (
            <Reveal key={v.v} delay={i * 40}>
              <div className="flex items-start gap-4 rounded-xl border p-4 transition-colors sm:p-5 hover:border-foreground/15">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                  {v.v.replace("v", "")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{v.v}</span>
                    <span className="text-xs text-muted-foreground">{v.date}</span>
                    {v.v === "v3.5" && (
                      <Badge variant="secondary" className="text-xs">{t("page.082")}</Badge>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{v.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}

          {versions.length > 5 && (
            <Reveal delay={200}>
              <div
                className="flex items-center justify-center rounded-xl border border-dashed px-4 py-3 text-muted-foreground"
                aria-hidden="true"
              >
                <span className="text-base leading-none tracking-[0.4em]">···</span>
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section className="border-t bg-muted/20">
        <div className="mx-auto max-w-3xl px-4 py-16 lg:py-24 sm:px-6 lg:px-8">
          <Reveal>
            <p className="text-sm font-medium text-muted-foreground">{t("page.083")}</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              FAQ
            </h2>
          </Reveal>

          <Reveal delay={120}>
            <Accordion className="mt-10 lg:mt-12 w-full">
              {faqs.map((f, i) => (
                <AccordionItem key={i} value={`faq-${i}`}>
                  <AccordionTrigger>{f.q}</AccordionTrigger>
                  <AccordionContent>{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="relative overflow-hidden border-t">
        <div className="pointer-events-none absolute inset-0 -z-10 glow-top opacity-40" />
        <div className="mx-auto max-w-3xl px-4 py-16 lg:py-24 text-center sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{t("page.084")}</h2>
            <p className="mt-4 text-muted-foreground">{t("page.085")}</p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button size="lg" className="group" render={<Link href="/docs" />}>{t("page.086")}<ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="group"
                render={
                  <Link
                    href="https://github.com/xzy4260/verity-cn"
                    target="_blank"
                    rel="noreferrer"
                  />
                }
              >
                <GithubIcon className="size-4" />
                GitHub
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ 页脚 ============ */}
      <footer className="border-t">
        <div className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:px-8">
          <p className="text-sm font-medium text-muted-foreground">{t("page.093")}</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { href: "https://www.minecraft.net/", site: "minecraft.net", key: "page.094", icon: "/links/minecraft.png" },
              { href: "https://zh.minecraft.wiki/", site: "zh.minecraft.wiki", key: "page.095", icon: "/links/minecraft-wiki.png" },
              { href: "https://www.mcmod.cn/", site: "mcmod.cn", key: "page.096", icon: "/links/mcmod.ico" },
              { href: "https://foldcraftlauncher.cn/", site: "foldcraftlauncher.cn", key: "page.097", icon: "/links/fcl.avif" },
              { href: "https://hmcl.huangyuhui.net/", site: "hmcl.huangyuhui.net", key: "page.098", icon: "/links/hmcl.ico" },
              { href: "https://meloong.com/pcl", site: "meloong.com/pcl", key: "page.099", icon: "/links/pcl2.png" },
              { href: "https://xmcl.app/", site: "xmcl.app", key: "page.100", icon: "/links/xmcl.svg" },
              { href: "https://www.zalithlauncher.cn/", site: "zalithlauncher.cn", key: "page.101", icon: "/links/zalith.webp" },
              { href: "https://link.notfy.cn/", site: "link.notfy.cn", key: "page.092", icon: "/links/notfy.ico" },
              { href: "https://veritycn.site/", site: "veritycn.site", key: "page.091" },
            ].map((l) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-3 rounded-xl border px-4 py-3 transition-colors hover:border-foreground/15"
              >
                {l.icon ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={l.icon}
                    alt=""
                    aria-hidden="true"
                    width={20}
                    height={20}
                    loading="lazy"
                    className="size-5 shrink-0 rounded object-contain"
                  />
                ) : null}
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium group-hover:text-primary">{t(l.key)}</span>
                  <span className="mt-0.5 block truncate text-xs text-muted-foreground">{l.site}</span>
                </span>
              </a>
            ))}
          </div>
        </div>
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-12 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div className="flex items-center gap-2">
            <Image
              src="/verity.png"
              alt="Verity"
              width={20}
              height={20}
              className="rounded"
            />
            <span className="text-sm font-semibold">Verity-cn</span>
          </div>
          <nav className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <Link href="/docs" className="hover:text-foreground">{t("page.087")}</Link>
            <Link href="/download" className="hover:text-foreground">{t("page.088")}</Link>
            <Link href="/changelog" className="hover:text-foreground">{t("page.089")}</Link>
            <Link
              href="https://github.com/xzy4260/verity-cn"
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground"
            >
              GitHub
            </Link>
          </nav>
          <p className="text-xs text-muted-foreground">{t("page.090")}</p>
        </div>
      </footer>
    </main>
  );
}
