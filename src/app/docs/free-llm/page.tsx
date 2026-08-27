import Image from "next/image";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/reveal";
import { Callout, DocSection } from "@/components/docs-ui";
import { Toc } from "@/components/toc";

export const metadata: Metadata = {
  title: "如何使用免费 LLM",
  description: "使用 Verity-cn 内置预置免费 API，无需注册即可体验 AI 对话功能。",
  alternates: { canonical: "https://verity-cn.pages.dev/docs/free-llm" },
};

export default function FreeLLMPage() {
  return (
    <main className="flex min-w-0 flex-1 gap-10">
      <div className="min-w-0 max-w-3xl flex-1 pb-20">
        <Reveal>
          <div className="mb-3 flex items-center gap-2">
            <Badge variant="secondary">进阶</Badge>
            <Badge variant="outline" className="border-orange-500/40 text-orange-500">
              临时
            </Badge>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">如何使用免费 LLM</h1>
          <p className="mt-3 text-muted-foreground">
            本文介绍如何使用 Verity-cn 内置的预置免费 API，无需自行注册服务商即可体验 LLM 对话功能。
          </p>
          <Callout tone="warn">
            本文为临时文档，后续将替换为完整的 LLM 配置详解。
          </Callout>
        </Reveal>

        <div className="mt-12 space-y-14">
          <Reveal delay={40}>
            <DocSection id="open-config" title="1. 打开 Mod 配置">
              <p>
                在启动器中打开 Verity-cn 的模组配置界面，找到 LLM 相关设置区域。
              </p>
            </DocSection>
          </Reveal>

          <Reveal delay={40}>
            <DocSection id="select-llm" title="2. 选择 LLM">
              <p>
                在配置界面中选择 LLM 服务类型。
              </p>
            </DocSection>
          </Reveal>

          <Reveal delay={40}>
            <DocSection id="switch-mode" title="3. 切换至预置免费 API">
              <p>
                将模式切换为<span className="font-medium text-foreground">「预置免费 API」</span>。
                切换后会出现 AI 提供商选择列表。
              </p>
            </DocSection>
          </Reveal>

          <Reveal delay={40}>
            <DocSection id="select-provider" title="4. 选择 AI 提供商">
              <p>
                根据需求选择一个 AI 提供商：
              </p>
              <div className="mt-4 space-y-4">
                <div className="rounded-lg border border-border/60 p-4">
                  <p className="font-medium text-foreground">
                    Kilo（推荐入门）
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    选择 Kilo 后<span className="font-medium text-foreground">无需任何额外操作</span>，选择即用。
                  </p>
                </div>
                <div className="rounded-lg border border-border/60 p-4">
                  <p className="font-medium text-foreground">
                    其他提供商（推荐 Agnes）
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    服务速度与稳定性更高。选择后需要点击对应的提供商链接，
                    在打开的分组页面中输入你的 API Key。
                  </p>
                </div>
              </div>
              <div className="mt-6 overflow-hidden rounded-lg border border-border/60">
                <Image
                  src="/llm-provider.jpg"
                  alt="AI 提供商选择界面"
                  width={800}
                  height={450}
                  className="w-full"
                  loading="lazy"
                />
              </div>
            </DocSection>
          </Reveal>

          <Reveal delay={40}>
            <DocSection id="errors" title="5. 常见问题">
              <div className="space-y-4">
                <div className="rounded-lg border border-border/60 p-4">
                  <p className="font-medium text-foreground">503 错误</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    服务暂时不可用，请稍后重试一次。
                  </p>
                </div>
                <div className="rounded-lg border border-border/60 p-4">
                  <p className="font-medium text-foreground">429 错误</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    请求频率过高，请等待一两分钟后重试，或切换到其他 AI 提供商。
                  </p>
                </div>
              </div>
            </DocSection>
          </Reveal>
        </div>
      </div>

      <Toc />
    </main>
  );
}
