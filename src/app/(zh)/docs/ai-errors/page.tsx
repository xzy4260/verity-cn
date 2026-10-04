import type { Metadata } from "next";
import { altLanguages } from "@/lib/i18n";
export const metadata: Metadata = {
  title: "AI 错误码解析",
  description: "Verity-cn 调用 LLM 服务时常见 HTTP 错误码的含义与排查建议。",
  alternates: { canonical: "https://mod.veritycn.site/docs/ai-errors", languages: altLanguages("/docs/ai-errors") },
};

import { DocsAiErrorsView } from "@/components/views/docs-ai-errors";

export default function Page() {
  return <DocsAiErrorsView locale="zh-CN" />;
}
