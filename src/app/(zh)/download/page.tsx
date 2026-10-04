import type { Metadata } from "next";
import { altLanguages } from "@/lib/i18n";
export const metadata: Metadata = {
  title: "下载 Verity-cn 模组 · Minecraft AI 伴侣 | JAR / 网盘分流",
  description: "下载 Verity-cn Minecraft AI 伴侣模组最新版本，支持 PCL2、HMCL、BakXL 等启动器。",
  alternates: { canonical: "https://mod.veritycn.site/download", languages: altLanguages("/download") },
};

import { DownloadView } from "@/components/views/download";

export default function Page() {
  return <DownloadView locale="zh-CN" />;
}
