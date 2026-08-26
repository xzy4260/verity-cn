"use client";

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
  ShieldCheck,
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

const versions = [
  {
    v: "v3.4",
    date: "2026-08",
    desc: "NCM 音乐系统 · 联网搜索 · 多人卡顿修复 · 歌词同步 · Android 适配",
  },
  {
    v: "v3.3",
    date: "2026-08",
    desc: "友好模式 · 配方/Mod 探查工具 · 老版物品给予 · 自定义克隆音频 · 移除 YACL 依赖",
  },
  {
    v: "v3.2",
    date: "2026-07",
    desc: "TTS 语速按钮切换 · MiMo 流式响应 · 自定义音色克隆 · 主菜单黑屏开关",
  },
  {
    v: "v3.1",
    date: "2026-07",
    desc: "首次启动配置向导 · 下落叫声开关修复 · OAuth 状态判断修复 · 默认启用 LLM/STT/代理",
  },
  {
    v: "v3.0",
    date: "2026-07",
    desc: "Verity Mod 网站深度集成 · TTS 即时中断 · 聊天本地化 · 摔落 TTS 开关",
  },
  {
    v: "v2.75",
    date: "2026-07",
    desc: "TTS/STT 模型名可配置 · 自定义皮肤系统 · 表情/物品栏修复",
  },
  {
    v: "v2.5",
    date: "2026-07",
    desc: "LLM/TTS/STT 三板块重构 · 全中文界面 · MiMo 音色克隆",
  },
];

const faqs = [
  {
    q: "Verity-cn 是免费的吗？",
    a: "完全免费。如遇任何收费行为请向我们举报。你为 AI 服务（如 DeepSeek、豆包等）支付的费用由对应服务商收取，与本项目无关。",
  },
  {
    q: "需要什么环境？",
    a: "Minecraft 1.20.1（Forge 版），Java 21 及以上，前置模组 Geckolib 4.4+ 和 Cloth Config 11+。v3.3 起不再需要 YACL。",
  },
  {
    q: "支持安卓吗？",
    a: "支持。v2.0 起适配安卓端，支持 ZalithLauncher 2.4.9+、PojavLauncher、FCL、HMCL-PE 等启动器。",
  },
  {
    q: "如何配置 AI 服务？",
    a: "v3.0 起支持 Verity Mod 网站集成，一键授权即可使用。也支持自定义 OpenAI 兼容 API（DeepSeek、通义千问、硅基流动等）。",
  },
  {
    q: "音色克隆怎么用？",
    a: "在 TTS 设置中选择 MiMo 音色克隆模式，可使用预置音色或放入自定义音频（8-30 秒，单人单语言）到 config/verity/sample_audio/ 目录。",
  },
];

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

export default function Home() {
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
                  </span>
                  v3.4 最新版
                </Badge>
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
                <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
                  为中国玩家打造的 Minecraft AI 伴侣模组
                  <br />
                  <span className="text-base">对话 · 语音 · 音色克隆 · 开箱即玩</span>
                </p>
              </Reveal>

              <Reveal delay={180}>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button size="lg" className="group" render={<Link href="/docs" />}>
                    阅读文档
                    <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="group"
                    render={<Link href="/download" />}
                  >
                    <Download className="size-4" />
                    下载 v3.4
                  </Button>
                </div>
              </Reveal>

              <Reveal delay={240}>
                <div className="flex flex-wrap gap-2 pt-2">
                  {["AI 对话", "语音交互", "MiMo 音色克隆", "友好模式", "自定义皮肤"].map(
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
          <p className="text-center text-sm font-medium text-muted-foreground">
            基于 Verity 5.7.2 · Minecraft Forge 1.20.1 · Java 21+
          </p>
        </div>
      </section>

      {/* ============ 特性 Bento ============ */}
      <section className="mx-auto max-w-7xl px-4 py-16 lg:py-24 sm:px-6 lg:px-8">
        <Reveal className="max-w-2xl">
          <p className="text-sm font-medium text-muted-foreground">核心功能</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            不只是对话，是真正的游戏伙伴
          </h2>
          <p className="mt-4 text-muted-foreground">
            Verity-cn 在原版基础上深度改造，为中国玩家提供全中文界面、国产 AI 接口支持、音色克隆、友好模式等独有功能。
          </p>
        </Reveal>

        <div className="mt-10 lg:mt-12 grid gap-4 lg:grid-cols-6 lg:items-start">
          {/* 大卡：AI 对话 */}
          <Reveal className="lg:col-span-4">
            <SpotlightCard
              icon={<MessageCircle className="size-5" />}
              title="AI 智能对话"
              description="支持任意 OpenAI 兼容 API（DeepSeek、通义千问、硅基流动等），自定义系统提示词，LLM 可实时查询游戏配方与已安装 Mod。"
            >
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="inline-flex items-center rounded-full border border-border bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground">
                  DeepSeek
                </span>
                <span className="inline-flex items-center rounded-full border border-border bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground">
                  通义千问
                </span>
                <span className="inline-flex items-center rounded-full border border-border bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground">
                  MiMo
                </span>
                <span className="inline-flex items-center rounded-full border border-border bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground">
                  任意 OpenAI 兼容
                </span>
              </div>
            </SpotlightCard>
          </Reveal>

          {/* 小卡：语音交互 */}
          <Reveal delay={60} className="lg:col-span-2">
            <SpotlightCard
              icon={<Mic className="size-5" />}
              title="语音交互"
              description="TTS 语音合成 + STT 语音识别，支持 MiMo 流式响应，边收边播。7 档语速切换，安卓/桌面双端适配。"
            >
              <span className="mt-2 inline-flex items-center rounded-full border border-border bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground">
                TTS + STT
              </span>
            </SpotlightCard>
          </Reveal>

          {/* 小卡：友好模式 */}
          <Reveal delay={80} className="lg:col-span-2">
            <SpotlightCard
              icon={<ShieldCheck className="size-5" />}
              title="友好模式"
              description="cn 版独有。屏蔽恐怖内容与恶魔变身，Verity 化身真正的游戏助手，不会击杀任何生物。"
            >
              <span className="mt-2 inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                cn 独有
              </span>
            </SpotlightCard>
          </Reveal>

          {/* 宽卡：音色克隆 */}
          <Reveal delay={120} className="lg:col-span-4">
            <SpotlightCard
              icon={<Sparkles className="size-5" />}
              title="MiMo 音色克隆"
              description="基于小米 MiMo 模型，预置 3 组参考音频（Verity 默认、阿神同款、老牧师），也支持放入自定义音频克隆你想要的任何音色。"
            >
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="inline-flex items-center rounded-full border border-border bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground">
                  预置 3 组音色
                </span>
                <span className="inline-flex items-center rounded-full border border-border bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground">
                  自定义克隆
                </span>
                <span className="inline-flex items-center rounded-full border border-border bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground">
                  7 档语速
                </span>
              </div>
            </SpotlightCard>
          </Reveal>

          {/* 小卡：游戏工具 */}
          <Reveal delay={100} className="lg:col-span-3">
            <SpotlightCard
              icon={<Wrench className="size-5" />}
              title="游戏内工具调用"
              description="LLM 自动调用配方查询与 Mod 探查工具，实时返回真实游戏数据，不再用 AI 自身知识猜测。"
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
              title="自定义皮肤"
              description="将 16 张变体贴图打包为 ZIP 放入 skins 目录，GUI 中输入文件名即可切换，切换瞬间生效。"
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
            <p className="text-sm font-medium text-muted-foreground">cn 版特色</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              不只是对话，把「好用」刻进细节
            </h2>
            <p className="mt-4 text-muted-foreground">
              配方反查、联网搜索、网易云点歌、三步配好 LLM……这些都是在原版 Verity
              基础上从零打磨的独有能力。
            </p>
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
                title="配方查询，还能反查"
                desc="直接问任意物品怎么合成；也可以反过来丢给它一堆材料，让它告诉你能做什么。LLM 实时读取真实游戏数据作答，不靠猜。"
              />
            </Reveal>
            <Reveal delay={60}>
              <ShotCard
                src="/features/web-search.png"
                w={665}
                h={76}
                label="web-search"
                icon={<Globe className="size-5" />}
                title="联网搜索"
                desc="新版本机制、Mod 用法、冷门攻略——Verity 能联网检索最新资料再回答，不再局限于模型的训练数据。"
              />
            </Reveal>
            <Reveal delay={40}>
              <ShotCard
                src="/features/netease-music.png"
                w={1920}
                h={1017}
                label="netease-cloud-music"
                icon={<Music2 className="size-5" />}
                title="网易云音乐播放"
                desc="接入网易云音乐：点歌、暂停、切歌全靠一句话，边挖矿边听歌，BGM 再也不用手动切。"
              />
            </Reveal>
            <Reveal delay={100}>
              <ShotCard
                src="/features/llm-config.png"
                w={1920}
                h={1017}
                label="config-wizard"
                icon={<SlidersHorizontal className="size-5" />}
                title="简化 LLM 配置"
                desc="重新设计的配置流程：选服务商 → 填 Key → 开聊，三步完成，不用再面对一屏看不懂的参数。"
              />
            </Reveal>
          </div>

          {/* 五格特性带 */}
          <Reveal delay={80}>
            <div className="mt-4 grid overflow-hidden rounded-xl border border-border/60 bg-card sm:grid-cols-2 lg:grid-cols-5 lg:divide-x lg:divide-border/60">
              {[
                {
                  icon: <KeyRound className="size-4" />,
                  title: "预置免费 AI API",
                  desc: "内置多家免费接口，官网获取 Key 填入即用。",
                },
                {
                  icon: <Brain className="size-4" />,
                  title: "更优记忆机制",
                  desc: "重构上下文记忆，越玩越懂你。",
                },
                {
                  icon: <PackagePlus className="size-4" />,
                  title: "老版物品索要",
                  desc: "回归老版索要机制，讨要物品更直接。",
                },
                {
                  icon: <UserCheck className="size-4" />,
                  title: "玩家信息识别",
                  desc: "分清服务器里的每个玩家，不再混为一人。",
                },
                {
                  icon: <Network className="size-4" />,
                  title: "多人游戏优化",
                  desc: "联机场景多处细节打磨，开黑更顺畅。",
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
            <p className="text-sm font-medium text-muted-foreground">三步上手</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              安装只需一分钟
            </h2>
          </Reveal>

          <div className="mt-10 lg:mt-12 grid gap-6 sm:grid-cols-3">
            {[
              {
                step: "01",
                title: "下载模组",
                desc: "从 GitHub Releases 或网盘分流下载 verity-cn-v3.4.jar（约 177MB）。",
              },
              {
                step: "02",
                title: "放入 mods",
                desc: "将 JAR 文件放入 .minecraft/mods/ 目录，确保已安装 Geckolib 和 Cloth Config。",
              },
              {
                step: "03",
                title: "启动游戏",
                desc: "使用 Java 21+ 启动游戏，首次进入会弹出配置向导，按提示完成即可。",
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
          <p className="text-sm font-medium text-muted-foreground">持续更新</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            版本历史
          </h2>
        </Reveal>

        <div className="mt-10 lg:mt-12 space-y-4">
          {versions.map((v, i) => (
            <Reveal key={v.v} delay={i * 40}>
              <div className="flex items-start gap-4 rounded-xl border p-4 transition-colors sm:p-5 hover:border-foreground/15">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                  {v.v.replace("v", "")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{v.v}</span>
                    <span className="text-xs text-muted-foreground">{v.date}</span>
                    {v.v === "v3.4" && (
                      <Badge variant="secondary" className="text-xs">
                        最新
                      </Badge>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{v.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section className="border-t bg-muted/20">
        <div className="mx-auto max-w-3xl px-4 py-16 lg:py-24 sm:px-6 lg:px-8">
          <Reveal>
            <p className="text-sm font-medium text-muted-foreground">常见问题</p>
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
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              准备好让 Verity 陪你冒险了吗？
            </h2>
            <p className="mt-4 text-muted-foreground">
              下载 Verity-cn v3.4，一分钟安装，立即拥有你的 AI 游戏伙伴。
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button size="lg" className="group" render={<Link href="/docs" />}>
                阅读文档
                <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
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
            <Link href="/docs" className="hover:text-foreground">文档</Link>
            <Link href="/download" className="hover:text-foreground">下载</Link>
            <Link href="/changelog" className="hover:text-foreground">更新日志</Link>
            <Link
              href="https://github.com/xzy4260/verity-cn"
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground"
            >
              GitHub
            </Link>
          </nav>
          <p className="text-xs text-muted-foreground">
            基于 Verity 5.7.2 修改 · 本修改版永久免费
          </p>
        </div>
      </footer>
    </main>
  );
}
