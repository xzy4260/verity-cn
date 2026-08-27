import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/reveal";
import { Callout, Step } from "@/components/docs-ui";
import { Toc } from "@/components/toc";

export const metadata: Metadata = {
  title: "游玩 Verity · 对话/指令/音乐播放玩法指南",
  description: "进入游戏与 Verity 对话、使用指令、音乐播放等玩法指南。",
  alternates: { canonical: "https://verity-cn.pages.dev/docs/gameplay" },
};

function Shot({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      width={854}
      height={480}
      className="w-full h-auto rounded-xl border shadow-sm"
    />
  );
}

export default function GameplayPage() {
  return (
    <main className="flex min-w-0 flex-1 gap-10">
        <div className="min-w-0 max-w-3xl flex-1 pb-20">
          <Reveal>
            <Badge variant="secondary" className="mb-3">新手教程</Badge>
            <h1 className="text-3xl font-semibold tracking-tight">游玩 Verity</h1>
            <p className="mt-3 text-muted-foreground">
              配置完成后，进入游戏创建世界，找到 Verity 并开始你们的第一次对话吧！
              本篇为通用教程，Windows 与 Android 玩法一致。
            </p>
          </Reveal>

          <div className="mt-12 space-y-14">
            <Reveal delay={40}>
              <Step n={1} id="create-world" title="创建世界进入游戏">
                <p>
                  在通过官方服务完成初始化配置（
                  <Link href="/docs/verity-config" className="font-medium text-primary hover:underline">
                    Verity 初始化配置
                  </Link>
                  ）之后，点击<span className="font-medium text-foreground">单人游戏</span>，
                  创建新的世界并进入。
                </p>
              </Step>
            </Reveal>

            <Reveal delay={40}>
              <Step n={2} id="ime" title="输入法注意事项">
                <p>进入游戏前，请确保输入法处于<span className="font-medium text-foreground">英文模式</span>。</p>
                <Callout tone="info">
                  建议在输入法的相关设置中<span className="font-medium">取消 Shift 切换大小写</span>
                  ，因为这个按键在游戏中比较常用。禁用 Shift
                  切换后，仍可以通过 Ctrl + Space（空格）切换大小写，或者按 CAPS
                  键切换大写模式。
                </Callout>
              </Step>
            </Reveal>

            <Reveal delay={40}>
              <Step n={3} id="open-box" title="打开纸箱">
                <p>
                  进入世界后，Verity 会包装在纸箱内、<span className="font-medium text-foreground">在你的附近生成</span>：
                </p>
                <Shot
                  src="/docs/gameplay/cardboard-box.png"
                  alt="Verity 包装在纸箱中生成在玩家附近"
                />
                <p>
                  <span className="font-medium text-foreground">按鼠标右键</span>打开它，
                  然后就可以与 Verity 对话了！
                </p>
              </Step>
            </Reveal>

            <Reveal delay={40}>
              <Step n={4} id="talk" title="与 Verity 对话">
                <p>
                  你可以在聊天栏直接输入文字，也可以
                  <span className="font-medium text-foreground">长按 V 键</span>进行语音输入
                  （请确保麦克风工作正常）。
                </p>
                <Callout tone="info">
                  如果 V 键与其他模组的按键冲突，可以到{" "}
                  <span className="font-medium">选项 → 按键控制 → 按键绑定</span>{" "}
                  处向下滑，找到对应选项并更改。
                </Callout>
                <Shot
                  src="/docs/gameplay/keybind.png"
                  alt="按键绑定设置中的 Verity 语音按键"
                />
                <p>使用语音输入时，请确保界面上方的电平条显示正常：</p>
                <Shot
                  src="/docs/gameplay/voice-level.png"
                  alt="语音输入的电平条显示正常"
                />
              </Step>
            </Reveal>

            <Reveal delay={40}>
              <Step n={5} id="reply" title="收到回复">
                <p>发送消息后，即可看到 Verity 的正常回复：</p>
                <Shot src="/docs/gameplay/chat-reply.png" alt="Verity 在聊天栏中正常回复" />
                <Callout tone="success">
                  恭喜你完成了全部上手流程！接下来就尽情和 Verity
                  聊天、探索世界吧。
                </Callout>
              </Step>
            </Reveal>
          </div>
        </div>

        <Toc />
    </main>
  );
}
