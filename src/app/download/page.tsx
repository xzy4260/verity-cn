import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, Download, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "下载",
  description: "下载 Verity-cn Minecraft AI 伴侣模组最新版本，支持 PCL2、HMCL、BakXL 等启动器。",
  alternates: { canonical: "https://verity-cn.com/download" },
};

const releases = [
  {
    v: "v3.4",
    file: "verity-cn-v3.4.jar",
    size: "约 177MB",
    date: "2026-08",
    latest: true,
    desc: "NCM 音乐系统 · 联网搜索 · 多人卡顿修复 · 歌词同步 · Android 适配",
    url: "https://github.com/xzy4260/verity-cn/releases/download/v3.4/verity-cn-v3.4.jar",
  },
  {
    v: "v3.3",
    file: "verity-cn-v3.3.jar",
    size: "约 237MB",
    date: "2026-08",
    latest: false,
    desc: "友好模式（cn 独有）· 配方/Mod 探查工具 · 老版物品给予 · 自定义克隆音频 · 移除 YACL 依赖",
    url: "https://github.com/xzy4260/verity-cn/releases/download/v3.3/verity-cn-v3.3.jar",
  },
  {
    v: "v3.2",
    file: "verity-cn-v3.2.jar",
    size: "约 237MB",
    date: "2026-07",
    latest: false,
    desc: "TTS 语速按钮切换 · MiMo 流式响应 · 自定义音色克隆 · 主菜单黑屏开关 · Mixin 加载修复",
    url: "https://github.com/xzy4260/verity-cn/releases/download/v3.2/verity-cn-v3.2.jar",
  },
  {
    v: "v3.1",
    file: "verity-cn-v3.1.jar",
    size: "约 237MB",
    date: "2026-07",
    latest: false,
    desc: "首次启动配置向导 · 下落叫声开关修复 · OAuth 状态判断修复 · 默认启用 LLM/STT/代理",
    url: "https://github.com/xzy4260/verity-cn/releases/download/v3.1/verity-cn-v3.1.jar",
  },
  {
    v: "v3.0",
    file: "verity-cn-v3.0.jar",
    size: "约 237MB",
    date: "2026-07",
    latest: false,
    desc: "Verity Mod 网站深度集成 · TTS 即时中断 · 聊天本地化 · 摔落 TTS 开关",
    url: "https://github.com/xzy4260/verity-cn/releases/download/v3.0/verity-cn-v3.0.jar",
  },
  {
    v: "v2.75",
    file: "verity-5.7.2-cn-v2.75.jar",
    size: "约 237MB",
    date: "2026-07",
    latest: false,
    desc: "TTS/STT 模型名可配置 · 自定义皮肤系统 · 表情/物品栏修复",
    url: "https://github.com/xzy4260/verity-cn/releases/download/v2.75/verity-5.7.2-cn-v2.75-fix2.jar",
  },
  {
    v: "v2.5",
    file: "verity-5.7.2-cn-v2.5.jar",
    size: "约 246MB",
    date: "2026-07",
    latest: false,
    desc: "LLM/TTS/STT 三板块重构 · 全中文界面 · MiMo 音色克隆",
    url: "https://github.com/xzy4260/verity-cn/releases/download/v2.5/verity-5.7.2-cn-v2.5.jar",
  },
];

const mirrors = [
  { name: "夸克网盘", url: "https://pan.quark.cn/s/1064a79d1a04", note: "无需提取码", icon: "/mirrors/quark.png" },
  { name: "UC 网盘", url: "https://drive.uc.cn/s/9ebc5dcc7d004?public=1", note: "无需提取码", icon: "/mirrors/uc.png" },
  { name: "123 网盘", url: "https://1814467836.share.123pan.cn/123pan/pVBZVv-0zviv", note: "无需提取码", icon: "/mirrors/123pan.png" },
  { name: "百度网盘", url: "https://pan.baidu.com/s/1PhLz70wBtQ9JeKxcnL6HPw?pwd=4260", note: "提取码 4260", icon: "/mirrors/baidu.png" },
  { name: "光鸭云盘", url: "https://www.guangyapan.com/s/1935342246296858628_an8FiodyMIxHWiSF", note: "无需提取码", icon: "/mirrors/guangya.png" },
  { name: "中国移动云盘", url: "https://yun.139.com/shareweb/#/w/i/2wFGyiL9v9hlp", note: "提取码 dyq5", icon: "/mirrors/mobile.png" },
  { name: "天翼云盘", url: "https://cloud.189.cn/web/share?code=U7rumuN3QvEj", note: "访问码 juw4", icon: "/mirrors/tianyi.ico" },
];

const prereqs = [
  { name: "Forge（最新版）", url: "https://files.minecraftforge.net/", desc: "Minecraft 1.20.1" },
  { name: "Geckolib 4.4+", url: "https://www.curseforge.com/minecraft/mc-mods/geckolib", desc: "实体动画" },
  { name: "Cloth Config 11+", url: "https://www.curseforge.com/minecraft/mc-mods/cloth-config", desc: "配置依赖" },
];

export default function DownloadPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <Reveal>
        <Button variant="ghost" size="sm" className="gap-1 mb-6" render={<Link href="/" />}>
          <ArrowLeft className="size-3" />
          返回首页
        </Button>

        <h1 className="text-3xl font-semibold tracking-tight">下载</h1>
        <p className="mt-2 text-muted-foreground">
          Verity-cn 是基于原版 Verity 5.7.2 进行中国化改造的 AI 伴侣模组特供版。将 JAR 文件放入 <code>.minecraft/mods/</code> 目录即可。
        </p>
      </Reveal>

      {/* 前置模组 */}
      <Reveal delay={60}>
        <h2 className="mt-10 text-2xl font-semibold tracking-tight">前置模组</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-2 text-left font-medium">模组</th>
                <th className="py-2 text-left font-medium">说明</th>
                <th className="py-2 text-left font-medium">下载</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              {prereqs.map((p) => (
                <tr key={p.name} className="border-b">
                  <td className="py-2 font-medium text-foreground">{p.name}</td>
                  <td className="py-2">{p.desc}</td>
                  <td className="py-2">
                    <a href={p.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      前往下载
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Reveal>

      <Separator className="my-10" />

      {/* 网盘分流 */}
      <Reveal delay={120}>
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-6">
          <h2 className="text-lg font-semibold">网盘分流</h2>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {mirrors.map((m) => (
              <a
                key={m.name}
                href={m.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-lg border bg-background p-3 transition-colors hover:border-foreground/15"
              >
                <span className="flex items-center gap-2.5">
                  {/* eslint-disable-next-line @next/next/no-img-element -- 站点小图标，无需优化 */}
                  <img src={m.icon} alt="" className="size-5 rounded object-contain" />
                  <span className="text-sm font-medium">{m.name}</span>
                </span>
                <span className="text-xs text-muted-foreground">{m.note}</span>
              </a>
            ))}
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            想支持我们，用夸克网盘或 UC 网盘转存即可。夸克网盘可用 MoePal（萌娘助手）免费解析下载。
          </p>
        </div>
      </Reveal>

      <Separator className="my-10" />

      {/* 版本列表 */}
      <Reveal delay={180}>
        <h2 className="text-2xl font-semibold tracking-tight">版本列表</h2>
        <div className="mt-6 space-y-4">
          {releases.map((r) => (
            <div key={r.v} className="rounded-xl border p-5 transition-colors hover:border-foreground/15">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{r.v}</span>
                    <span className="text-xs text-muted-foreground">{r.date}</span>
                    {r.latest && <Badge variant="secondary" className="text-xs">最新</Badge>}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{r.desc}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{r.file} · {r.size}</p>
                </div>
                <Button
                  size="sm"
                  render={
                    <Link href={r.url} target="_blank" rel="noreferrer" />
                  }
                >
                  <Download className="size-3" />
                  下载
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </div>
  );
}
