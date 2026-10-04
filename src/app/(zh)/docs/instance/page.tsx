import type { Metadata } from "next";
import { altLanguages } from "@/lib/i18n";
export const metadata: Metadata = {
  title: "配置并启动实例",
  description: "在启动器中创建 Minecraft 实例、安装 Verity-cn 模组并完成首次启动。",
  alternates: { canonical: "https://mod.veritycn.site/docs/instance", languages: altLanguages("/docs/instance") },
};

import { DocsInstanceView } from "@/components/views/docs-instance";

export default function Page() {
  return <DocsInstanceView locale="zh-CN" />;
}
