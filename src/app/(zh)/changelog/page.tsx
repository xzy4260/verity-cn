import type { Metadata } from "next";
import { altLanguages } from "@/lib/i18n";
export const metadata: Metadata = {
  title: "更新日志 · Verity-cn Minecraft AI 伴侣模组版本记录",
  description: "Verity-cn Minecraft AI 伴侣模组的版本更新记录与新功能说明。",
  alternates: { canonical: "https://mod.veritycn.site/changelog", languages: altLanguages("/changelog") },
};

import { ChangelogView } from "@/components/views/changelog";

export default function Page() {
  return <ChangelogView locale="zh-CN" />;
}
