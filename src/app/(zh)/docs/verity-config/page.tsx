import type { Metadata } from "next";
import { altLanguages } from "@/lib/i18n";
export const metadata: Metadata = {
  title: "Verity 初始化配置",
  description: "首次启动后配置 Verity 的 API Key、模型选择、语音设置等初始化选项。",
  alternates: { canonical: "https://mod.veritycn.site/docs/verity-config", languages: altLanguages("/docs/verity-config") },
};

import { DocsVerityConfigView } from "@/components/views/docs-verity-config";

export default function Page() {
  return <DocsVerityConfigView locale="zh-CN" />;
}
