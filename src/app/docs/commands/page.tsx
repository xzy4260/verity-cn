import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/reveal";
import { Callout, DocSection } from "@/components/docs-ui";
import { Toc } from "@/components/toc";

export const metadata: Metadata = {
  title: "指令解读 · Verity-cn /cnv 指令大全（音乐/定位/情绪）",
  description: "Verity-cn 所有 /cnv 前缀指令的完整说明，包括音乐、定位、情绪控制等。",
  alternates: { canonical: "https://verity-cn.pages.dev/docs/commands" },
};

export default function CommandsPage() {
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
          <h1 className="text-3xl font-semibold tracking-tight">指令解读</h1>
          <p className="mt-3 text-muted-foreground">
            Verity-cn 支持通过聊天指令进行各种操作。所有指令均需使用指令前缀
            <code className="mx-1 rounded bg-muted px-1.5 py-0.5 text-xs font-bold">/cnv </code>
            （注意末尾有空格）。
          </p>
          <Callout tone="warn">
            本文为临时文档，后续将补充完整说明与使用示例。
          </Callout>
        </Reveal>

        <div className="mt-12 space-y-14">
          <Reveal delay={40}>
            <DocSection id="compress" title="/cnv compress">
              <p>
                <span className="font-medium text-foreground">上下文压缩</span>。
                当对话历史过长时，使用此指令可压缩上下文，减少 Token 占用，
                同时保留重要信息以便继续对话。
              </p>
            </DocSection>
          </Reveal>

          <Reveal delay={40}>
            <DocSection id="get" title="/cnv get">
              <p>
                <span className="font-medium text-foreground">生成 Verity</span>。
                用于触发 Verity 的生成或初始化操作。
              </p>
            </DocSection>
          </Reveal>

          <Reveal delay={40}>
            <DocSection id="karma" title="/cnv karma">
              <p>
                <span className="font-medium text-foreground">切换右侧情绪条</span>。
              </p>
              <p className="mt-2">
                用法：
                <code className="ml-1 rounded bg-muted px-1.5 py-0.5 text-xs">/cnv karma &lt;数字&gt;</code>
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                数字范围为 <span className="font-medium text-foreground">0 – 20</span>，
                用于调整 Verity 右侧显示的情绪条数值。
              </p>
            </DocSection>
          </Reveal>

          <Reveal delay={40}>
            <DocSection id="locate" title="/cnv locate">
              <p>
                <span className="font-medium text-foreground">获取 Verity 位置</span>。
                查询当前 Verity 在游戏世界中的坐标。
              </p>
              <p className="mt-2">
                用法：
                <code className="ml-1 rounded bg-muted px-1.5 py-0.5 text-xs">/cnv locate tp</code>
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                加上 <code className="rounded bg-muted px-1 py-0.5 text-xs">tp</code> 参数可直接
                <span className="font-medium text-foreground">传送</span> 到 Verity 所在位置。
              </p>
            </DocSection>
          </Reveal>

          <Reveal delay={40}>
            <DocSection id="music" title="音乐相关指令">
              <div className="space-y-4">
                <div className="rounded-lg border border-border/60 p-4">
                  <p className="font-medium text-foreground">
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">/cnv mplay</code>
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    继续播放歌曲。
                  </p>
                </div>
                <div className="rounded-lg border border-border/60 p-4">
                  <p className="font-medium text-foreground">
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">/cnv mplay &lt;网易云歌曲ID&gt;</code>
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    播放指定网易云歌曲 ID 对应的歌曲。
                  </p>
                </div>
                <div className="rounded-lg border border-border/60 p-4">
                  <p className="font-medium text-foreground">
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">/cnv mplay mygal</code>
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    播放 Verity 最爱的歌（内置歌曲列表）。
                  </p>
                </div>
                <div className="rounded-lg border border-border/60 p-4">
                  <p className="font-medium text-foreground">
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">/cnv mstop</code>
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    暂停播放歌曲。
                  </p>
                </div>
                <div className="rounded-lg border border-border/60 p-4">
                  <p className="font-medium text-foreground">
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">/cnv mvolume</code>
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    获取当前音乐音量。
                  </p>
                </div>
                <div className="rounded-lg border border-border/60 p-4">
                  <p className="font-medium text-foreground">
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">/cnv mvolume &lt;数字&gt;</code>
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    调整音乐音量，范围 <span className="font-medium text-foreground">0 – 100</span>。
                  </p>
                </div>
              </div>
            </DocSection>
          </Reveal>

          <Reveal delay={40}>
            <DocSection id="recover" title="/cnv recover">
              <p>
                <span className="font-medium text-foreground">将 Verity 从恶魔形态恢复</span>。
                当 Verity 进入恶魔形态后，使用此指令可使其恢复正常状态。
              </p>
            </DocSection>
          </Reveal>
        </div>
      </div>

      <Toc />
    </main>
  );
}
