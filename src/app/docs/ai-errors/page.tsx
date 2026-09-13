import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/reveal";
import { DocSection } from "@/components/docs-ui";
import { Toc } from "@/components/toc";

export const metadata: Metadata = {
  title: "AI 错误码解析",
  description: "Verity-cn 调用 LLM 服务时常见 HTTP 错误码的含义与排查建议。",
  alternates: { canonical: "https://mod.veritycn.site/docs/ai-errors" },
};

export default function AIErrorsPage() {
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
          <h1 className="text-3xl font-semibold tracking-tight">AI 错误码解析</h1>
          <p className="mt-3 text-muted-foreground">
            当 Verity 调用 LLM 服务失败时，会返回对应的 HTTP 错误码。
            本文列出常见的错误码及其含义，帮助你快速定位问题。
          </p>
        </Reveal>

        <div className="mt-12 space-y-14">
          <Reveal delay={40}>
            <DocSection id="client-errors" title="客户端错误（4xx）">
              <div className="space-y-4">
                <ErrorRow
                  code="400"
                  title="Bad Request（请求格式错误）"
                  desc="发送给 API 的请求参数不正确，例如 JSON 格式错误、缺少必填字段或参数值不合法。通常由客户端配置问题引起。"
                />
                <ErrorRow
                  code="401"
                  title="Unauthorized（未授权）"
                  desc="API Key 无效、已过期或未提供。请检查你的 Key 是否正确，或在服务商控制台重新生成。"
                />
                <ErrorRow
                  code="403"
                  title="Forbidden（禁止访问）"
                  desc="Key 有效但没有权限访问所请求的资源。可能是账户未完成实名认证，或所选模型未开通。"
                />
                <ErrorRow
                  code="404"
                  title="Not Found（资源不存在）"
                  desc="请求的模型或接口地址不存在。请检查 Base URL 和 Model 名称是否正确。"
                />
                <ErrorRow
                  code="408"
                  title="Request Timeout（请求超时）"
                  desc="服务器在规定时间内未收到完整请求。可能因网络不稳定导致，建议检查网络后重试。"
                />
                <ErrorRow
                  code="422"
                  title="Unprocessable Entity（参数无法处理）"
                  desc="请求格式正确但内容不合法，例如消息内容过长、包含不支持的参数等。"
                />
                <ErrorRow
                  code="429"
                  title="Too Many Requests（请求频率过高）"
                  desc="在短时间内发送了过多请求，触发了服务商的速率限制。建议等待 1–2 分钟后重试，或切换到其他 AI 提供商。"
                />
              </div>
            </DocSection>
          </Reveal>

          <Reveal delay={40}>
            <DocSection id="server-errors" title="服务端错误（5xx）">
              <div className="space-y-4">
                <ErrorRow
                  code="500"
                  title="Internal Server Error（服务器内部错误）"
                  desc="服务商内部出现异常。这不是你的问题，通常服务商会在短时间内修复。请稍后重试。"
                />
                <ErrorRow
                  code="502"
                  title="Bad Gateway（网关错误）"
                  desc="网关从上游服务器收到了无效响应。通常是服务商临时故障，稍等片刻重试即可。"
                />
                <ErrorRow
                  code="503"
                  title="Service Unavailable（服务不可用）"
                  desc="服务暂时过载或正在维护中。请稍后重试一次。如果持续出现，可尝试切换到其他 AI 提供商。"
                />
                <ErrorRow
                  code="504"
                  title="Gateway Timeout（网关超时）"
                  desc="网关等待上游服务器响应超时。可能是服务商负载较高，建议等待后重试。"
                />
              </div>
            </DocSection>
          </Reveal>

          <Reveal delay={40}>
            <DocSection id="tips" title="排查建议">
              <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
                <li>
                  遇到 <span className="font-medium text-foreground">429</span> 时，
                  等待一两分钟再重试，或直接切换到其他 AI 提供商。
                </li>
                <li>
                  遇到 <span className="font-medium text-foreground">503</span> 时，
                  通常只需再试一次即可恢复。
                </li>
                <li>
                  持续出现 4xx 错误时，优先检查 API Key 和 Base URL 配置是否正确。
                </li>
                <li>
                  如果所有提供商都不可用，可能是本地网络问题，
                  请检查网络连接或代理设置。
                </li>
              </ul>
            </DocSection>
          </Reveal>
        </div>
      </div>

      <Toc />
    </main>
  );
}

function ErrorRow({
  code,
  title,
  desc,
}: {
  code: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-lg border border-border/60 p-4">
      <div className="flex items-center gap-2">
        <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-xs font-bold text-foreground">
          {code}
        </span>
        <span className="font-medium text-foreground">{title}</span>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}
