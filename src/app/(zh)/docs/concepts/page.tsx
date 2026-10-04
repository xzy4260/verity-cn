import type { Metadata } from "next";
import { altLanguages } from "@/lib/i18n";
export const metadata: Metadata = {
  title: "基础概念 · Verity-cn 的 LLM / TTS / STT / API Key 详解",
  description: "了解 LLM、TTS、STT、API Key 等 Verity-cn 配置中会反复出现的基本概念。",
  alternates: { canonical: "https://mod.veritycn.site/docs/concepts", languages: altLanguages("/docs/concepts") },
};

import { DocsConceptsView } from "@/components/views/docs-concepts";

export default function Page() {
  return <DocsConceptsView locale="zh-CN" />;
}
