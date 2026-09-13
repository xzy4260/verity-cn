import Link from "next/link";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/reveal";
import { Callout, DocSection } from "@/components/docs-ui";
import { Toc } from "@/components/toc";

export const metadata: Metadata = {
  title: "基础概念 · Verity-cn 的 LLM / TTS / STT / API Key 详解",
  description: "了解 LLM、TTS、STT、API Key 等 Verity-cn 配置中会反复出现的基本概念。",
  alternates: { canonical: "https://mod.veritycn.site/docs/concepts" },
};

export default function ConceptsPage() {
  return (
    <main className="flex min-w-0 flex-1 gap-10">
        <div className="min-w-0 max-w-3xl flex-1 pb-20">
          <Reveal>
            <Badge variant="secondary" className="mb-3">进阶</Badge>
            <h1 className="text-3xl font-semibold tracking-tight">基础概念</h1>
            <p className="mt-3 text-muted-foreground">
              在配置 Verity-cn 的进阶选项之前，先了解几个会反复出现的基本概念。
              理解它们之后，无论是使用官方服务还是自定义服务商都会轻松很多。
            </p>
          </Reveal>

          <div className="mt-12 space-y-14">
            <Reveal delay={40}>
              <DocSection id="llm" title="LLM（大语言模型）">
                <p>
                  LLM（Large Language Model）是 Verity 的「大脑」，负责理解你说的话并生成回复，
                  对话、记忆等能力都由它驱动。常见的 LLM 服务商有 DeepSeek、豆包等。
                </p>
                <p>
                  使用 LLM 需要在服务商处注册并创建{" "}
                  <Link href="#key" className="font-medium text-primary hover:underline">
                    API Key
                  </Link>
                  ，然后通过接口把消息发给模型、拿回回复。
                </p>
              </DocSection>
            </Reveal>

            <Reveal delay={40}>
              <DocSection id="tts" title="TTS（语音合成）">
                <p>
                  TTS（Text-to-Speech，语音合成）负责把文字变成语音——
                  你听到 Verity 说话的声音就是它生成的。
                  音色、语调等效果由服务商提供的模型决定。
                </p>
              </DocSection>
            </Reveal>

            <Reveal delay={40}>
              <DocSection id="stt" title="STT（语音识别）">
                <p>
                  STT（Speech-to-Text，语音识别）与 TTS 相反，负责把你发出的语音转成文字——
                  长按 V 键语音输入时，识别你说话内容的就是它。
                </p>
              </DocSection>
            </Reveal>

            <Reveal delay={40}>
              <DocSection id="base-url" title="Base Url（接口地址）">
                <p>
                  Base Url 是 API 服务的基础地址，通常是形如{" "}
                  <code className="rounded bg-muted px-1 py-0.5 text-xs">
                    https://api.example.com/v1
                  </code>{" "}
                  的 URL。模组会把请求发送到这个地址来使用对应的服务。
                </p>
                <p>
                  「OpenAI 兼容格式」指接口的请求与响应结构遵循 OpenAI
                  制定的通用规范——目前绝大多数 LLM 服务商都遵循它，因此只需更换
                  Base Url 和 Key 就能切换服务商。
                </p>
              </DocSection>
            </Reveal>

            <Reveal delay={40}>
              <DocSection id="key" title="Key（API 密钥）">
                <p>
                  Key 是服务商发给你的「通行证」，用来验证身份与计费。
                  在服务商的控制台创建后即可填入模组或官方新生网站使用。
                </p>
                <Callout tone="warn">
                  Key 等同于账户凭证，请妥善保管，不要泄露给他人或提交到公开场合。
                </Callout>
              </DocSection>
            </Reveal>

            <Reveal delay={40}>
              <DocSection id="model" title="Model（模型选择）">
                <p>
                  同一家服务商通常提供多个模型，例如 DeepSeek 旗下就有不同的对话模型。
                  它们在能力、响应速度和价格上各有差异：
                  能力强的模型回复更聪明但更贵、更慢，轻量模型则相反。
                </p>
                <p>
                  在「代理服务」中选择 Model，就是挑选用哪个模型来驱动 Verity。
                  不确定怎么选时，先用服务商的默认推荐即可。
                </p>
              </DocSection>
            </Reveal>

            <Reveal delay={40}>
              <DocSection id="tts-stt-note" title="关于 TTS / STT 的接入">
                <p>
                  LLM 的接口已经普遍统一为 OpenAI 兼容格式；但{" "}
                  <span className="font-medium text-foreground">
                    TTS 与 STT 的接口尚未统一
                  </span>
                  ，各厂商的实现差异较大。
                </p>
                <p>
                  因此本模组仅单独适配了<span className="font-medium text-foreground">小米 MiMo</span>{" "}
                  的 TTS 与 STT；同时也支持 OpenAI 兼容格式的 TTS / STT 接口，
                  方便接入提供该格式语音服务的平台。
                </p>
              </DocSection>
            </Reveal>
          </div>
        </div>

        <Toc />
    </main>
  );
}
