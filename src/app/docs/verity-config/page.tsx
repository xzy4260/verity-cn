import Image from "next/image";
import { ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/reveal";
import { Toc } from "@/components/toc";
import { Callout, Step } from "@/components/docs-ui";

export const metadata: Metadata = {
  title: "Verity 初始化配置",
  description: "首次启动后配置 Verity 的 API Key、模型选择、语音设置等初始化选项。",
  alternates: { canonical: "https://verity-cn.pages.dev/docs/verity-config" },
};

function Shot({
  src,
  alt,
  w,
  h,
}: {
  src: string;
  alt: string;
  w: number;
  h: number;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      width={w}
      height={h}
      className="w-full h-auto rounded-xl border shadow-sm"
    />
  );
}

export default function VerityConfigPage() {
  return (
    <main className="flex min-w-0 flex-1 gap-10">
      <div className="min-w-0 max-w-3xl flex-1 pb-20">
        <Reveal>
          <Badge variant="secondary" className="mb-3">新手教程</Badge>
          <h1 className="text-3xl font-semibold tracking-tight">
            Verity 初始化配置
          </h1>
          <p className="mt-3 text-muted-foreground">
            首次进入带有 Verity-cn Mod
            的游戏时，会弹出初始化配置向导。本篇以{" "}
            <span className="font-medium text-foreground">官方服务</span>
            为例，带你完成账号注册、LLM 代理配置和音色设置，最终回到游戏完成授权。
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-5 gap-1.5"
            render={<a href="https://veritycn.site/" target="_blank" rel="noreferrer" />}
          >
            <ExternalLink className="size-3.5" />
            打开 Verity 新生网站
          </Button>
        </Reveal>

        <div className="mt-12 space-y-14">
          <Reveal delay={40}>
            <Step n={1} id="init" title="选择官方服务">
              <p>
                启动游戏后会弹出初始化配置界面，这里我们选择{" "}
                <span className="font-medium text-foreground">
                  用官方服务为 Verity 新生网站服务
                </span>
                。
              </p>
              <Callout tone="info">
                本篇只讲解使用官方服务的流程。若想自定义服务商或使用免费模型，请参阅进阶教程（编写中）。
              </Callout>
              <Shot
                src="/docs/verity-config/init.png"
                alt="Verity-cn 初始化配置界面"
                w={854}
                h={480}
              />
            </Step>
          </Reveal>

          <Reveal delay={40}>
            <Step n={2} id="website" title="注册并登录新生网站">
              <p>
                官方服务由{" "}
                <a
                  href="https://space.bilibili.com/3461565078571133"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary hover:underline"
                >
                  @涓星向凡
                </a>{" "}
                开发的{" "}
                <a
                  href="https://veritycn.site/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary hover:underline"
                >
                  Verity 新生网站
                </a>{" "}
                提供。请自行注册并登录账号；注册需要邀请码，可在下方 QQ
                群的<span className="font-medium text-foreground">群公告</span>中获取。
              </p>
              <div className="rounded-xl border p-4 text-sm">
                <p className="font-medium text-foreground">邀请码获取（QQ 群公告）</p>
                <ul className="mt-2 space-y-1 text-muted-foreground">
                  <li>xzy4260 —— 1群：1057631803 ／ 2群：1098969416</li>
                  <li>涓星向凡 —— 5群：1063291125</li>
                </ul>
              </div>
            </Step>
          </Reveal>

          <Reveal delay={40}>
            <Step n={3} id="services" title="了解服务与签到">
              <p>
                新生网站提供三类服务：<span className="font-medium text-foreground">LLM 代理</span>（需自备模型服务商的
                Key）、<span className="font-medium text-foreground">TTS</span>
                （消耗网站积分）、<span className="font-medium text-foreground">STT</span>
                （免费）。
              </p>
              <p>
                登录后可以先在网站上<span className="font-medium text-foreground">签到</span>领取积分；
                QQ 群内也有机器人，绑定账户后同样可以签到。此外，积分还可以用 RMB
                购买，详情见网站的积分板块。
              </p>
              <Shot
                src="/docs/verity-config/sign-in.png"
                alt="新生网站签到页面"
                w={2145}
                h={717}
              />
            </Step>
          </Reveal>

          <Reveal delay={40}>
            <Step n={4} id="llm" title="添加 LLM 模型">
              <p>
                使用 LLM 代理需要在网站的「API 密钥」板块添加模型。网站为{" "}
                <span className="font-medium text-foreground">DeepSeek</span>、
                <span className="font-medium text-foreground">豆包</span>、
                <span className="font-medium text-foreground">
                  星核回响（中转站）
                </span>{" "}
                提供了便捷配置，只需填入对应的 Key 即可。
              </p>
              <Shot
                src="/docs/verity-config/api.png"
                alt="新生网站 API 密钥板块"
                w={2502}
                h={1128}
              />
              <p>
                也可以使用<span className="font-medium text-foreground">自定义</span>
                ：填写显示名称、以 <code className="rounded bg-muted px-1 py-0.5 text-xs">/v1</code>{" "}
                结尾的 OpenAI 兼容格式 Url 和 Key，再点击模型列表的
                <span className="font-medium text-foreground">自动获取</span>，
                最后点击保存。
              </p>
            </Step>
          </Reveal>

          <Reveal delay={40}>
            <Step n={5} id="proxy" title="选择代理模型">
              <p>
                添加好模型后，接着点击「代理服务」，选择提供商与要使用的模型。
              </p>
              <Shot
                src="/docs/verity-config/proxy.png"
                alt="新生网站代理服务：选择提供商与模型"
                w={835}
                h={525}
              />
            </Step>
          </Reveal>

          <Reveal delay={40}>
            <Step n={6} id="voice" title="生成配置选音色">
              <p>
                在网站左侧 TAB 点击「配置生成」。这里主要是在 AI 设置的
                「语音」里<span className="font-medium text-foreground">选择音色</span>
                ——注意此页面只用于选择音色，其他配置均无效。
              </p>
              <Shot
                src="/docs/verity-config/config-gen.png"
                alt="配置生成页面的音色选择"
                w={848}
                h={562}
              />
              <p>
                音色选择完毕后，点击下方的<span className="font-medium text-foreground">刷新按钮</span>即可。
              </p>
              <Shot
                src="/docs/verity-config/refresh.png"
                alt="配置生成页面下方的刷新按钮"
                w={888}
                h={488}
              />
            </Step>
          </Reveal>

          <Reveal delay={40}>
            <Step n={7} id="oauth" title="游戏内授权">
              <p>
                回到 Minecraft，在选择用官方服务后点击
                <span className="font-medium text-foreground">去官网登录</span>，
                会自动打开浏览器进行 OAuth 登录，完成登录授权即可返回游戏。
              </p>
              <p>返回游戏后，Verity 会执行连通性检测：</p>
              <Shot
                src="/docs/verity-config/connectivity.png"
                alt="游戏内的连通性检测结果"
                w={854}
                h={480}
              />
              <Callout tone="success">
                连通性检测通过后，就可以创建世界开始游戏了！和 Verity 打个招呼吧。
              </Callout>
            </Step>
          </Reveal>
        </div>
      </div>

        <Toc />
    </main>
  );
}
