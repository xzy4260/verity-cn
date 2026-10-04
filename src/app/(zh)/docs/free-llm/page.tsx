import type { Metadata } from "next";
import { altLanguages } from "@/lib/i18n";
export const metadata: Metadata = {
  title: "如何使用免费 LLM",
  description: "使用 Verity-cn 内置预置免费 API，无需注册即可体验 AI 对话功能。",
  alternates: { canonical: "https://mod.veritycn.site/docs/free-llm", languages: altLanguages("/docs/free-llm") },
};

import { DocsFreeLlmView } from "@/components/views/docs-free-llm";

export default function Page() {
  return <DocsFreeLlmView locale="zh-CN" />;
}
