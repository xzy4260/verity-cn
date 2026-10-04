import type { Metadata } from "next";
import { altLanguages } from "@/lib/i18n";
export const metadata: Metadata = {
  title: "游玩 Verity · 对话/指令/音乐播放玩法指南",
  description: "进入游戏与 Verity 对话、使用指令、音乐播放等玩法指南。",
  alternates: { canonical: "https://mod.veritycn.site/docs/gameplay", languages: altLanguages("/docs/gameplay") },
};

import { DocsGameplayView } from "@/components/views/docs-gameplay";

export default function Page() {
  return <DocsGameplayView locale="zh-CN" />;
}
