import type { Metadata } from "next";
import { altLanguages } from "@/lib/i18n";
export const metadata: Metadata = {
  title: "如何游玩 Minecraft",
  description: "从零开始安装 Java、选择启动器、配置 Minecraft + Verity-cn 的完整流程。",
  alternates: { canonical: "https://mod.veritycn.site/docs/play", languages: altLanguages("/docs/play") },
};

import { DocsPlayView } from "@/components/views/docs-play";

export default function Page() {
  return <DocsPlayView locale="zh-CN" />;
}
