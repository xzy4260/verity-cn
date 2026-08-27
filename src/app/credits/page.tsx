import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "致谢 · Verity-cn 项目贡献者与支持名单",
  description: "Verity-cn 项目的贡献者与致谢名单。",
  alternates: { canonical: "https://verity-cn.pages.dev/credits" },
};

const contributors: { name: string; role: string; tag: string; bilibili: string | null; desc: string; contributions: string[] }[] = [
  {
    name: "涓星向凡",
    role: "Verity Mod 网站站长",
    tag: "Verity Mod 网站支持和 API 支持",
    bilibili: "https://space.bilibili.com/3461565078571133",
    desc: "作为 Verity Mod 网站的站长，涓星向凡为 v3.0 版本的网站深度集成提供了关键支持：",
    contributions: [
      "搭建并维护 Verity Mod 网站，为模组提供了线上服务平台",
      "设计并实现 Verity Bridge 服务端 API，实现零配置开箱即用",
      "提供 License Key 授权机制，保障服务安全与用户管理",
    ],
  },
  {
    name: "埋藏心底的悲伤",
    role: "测试人员",
    tag: "核心测试人员",
    bilibili: null,
    desc: "作为 verity-cn 项目的核心测试人员，在 v3.0 版本开发期间做出了重要贡献：",
    contributions: [
      "全程参与各阶段 Beta 版本的安装与功能测试，覆盖桌面端与安卓端双平台",
      "发现并反馈大量关键问题，包括 TTS 播放中断异常、聊天消息显示错误、配置项失效等",
      "从玩家实际使用角度提出多项改进建议",
    ],
  },
];

export default function CreditsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <Reveal>
        <Button variant="ghost" size="sm" className="gap-1 mb-6" render={<Link href="/" />}>
          <ArrowLeft className="size-3" />
          返回首页
        </Button>

        <h1 className="text-3xl font-semibold tracking-tight">致谢名单</h1>
        <p className="mt-2 text-muted-foreground">
          Verity-cn 的发展离不开社区成员的支持与贡献。以下是为本项目提供过重要帮助的成员。
        </p>
      </Reveal>

      <div className="mt-10 space-y-8">
        {contributors.map((c, i) => (
          <Reveal key={c.name} delay={i * 60}>
            <div className="rounded-xl border p-6 transition-colors hover:border-foreground/15">
              <div className="flex items-start gap-4">
                <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-lg font-bold text-primary">
                  {c.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-xl font-semibold">{c.name}</h2>
                    <span className="inline-block rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                      {c.tag}
                    </span>
                  </div>
                  {c.bilibili && (
                    <a
                      href={c.bilibili}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-flex items-center gap-1 text-sm text-primary hover:underline"
                    >
                      B站主页 <ExternalLink className="size-3" />
                    </a>
                  )}

                  <p className="mt-4 text-sm text-muted-foreground">{c.desc}</p>
                  <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                    {c.contributions.map((item, j) => (
                      <li key={j} className="flex items-start gap-2">
                        <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary/40" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <Separator className="my-10" />

      <Reveal delay={200}>
        <h2 className="text-xl font-semibold tracking-tight">关于贡献</h2>
        <p className="mt-3 text-sm text-muted-foreground">
          Verity-cn 是一个开源的 Minecraft 模组中国化项目，欢迎更多社区成员参与到开发、测试、文档编写和反馈中来：
        </p>
        <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary/40" />
            <span><strong>提交 Issue</strong>：在 <a href="https://github.com/xzy4260/verity-cn" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">GitHub 仓库</a> 提交 Bug 报告或功能建议</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary/40" />
            <span><strong>参与测试</strong>：加入用户交流群，获取 Beta 版本并参与测试</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary/40" />
            <span><strong>反馈建议</strong>：在 B站 视频评论区或用户群中分享您的使用体验和改进建议</span>
          </li>
        </ul>
      </Reveal>
    </div>
  );
}
