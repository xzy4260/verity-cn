import type { Metadata } from "next";
import { altLanguages } from "@/lib/i18n";
export const metadata: Metadata = {
  title: "致谢 · Verity-cn 项目贡献者与支持名单",
  description: "Verity-cn 项目的贡献者与致谢名单。",
  alternates: { canonical: "https://mod.veritycn.site/credits", languages: altLanguages("/credits") },
};

import { CreditsView } from "@/components/views/credits";

export default function Page() {
  return <CreditsView locale="zh-CN" />;
}
