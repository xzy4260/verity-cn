import type { Metadata } from "next";
import { altLanguages } from "@/lib/i18n";
export const metadata: Metadata = {
  title: "指令解读 · Verity-cn /cnv 指令大全（音乐/定位/情绪）",
  description: "Verity-cn 所有 /cnv 前缀指令的完整说明，包括音乐、定位、情绪控制等。",
  alternates: { canonical: "https://mod.veritycn.site/docs/commands", languages: altLanguages("/docs/commands") },
};

import { DocsCommandsView } from "@/components/views/docs-commands";

export default function Page() {
  return <DocsCommandsView locale="zh-CN" />;
}
