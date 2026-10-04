import type { Metadata } from "next";
import { altLanguages } from "@/lib/i18n";
export const metadata: Metadata = {
  title: "如何使用网易云音乐",
  description: "开启 Verity-cn 网易云音乐集成，播放免费歌曲与自定义歌词设置。",
  alternates: { canonical: "https://mod.veritycn.site/docs/ncm-music", languages: altLanguages("/docs/ncm-music") },
};

import { DocsNcmMusicView } from "@/components/views/docs-ncm-music";

export default function Page() {
  return <DocsNcmMusicView locale="zh-CN" />;
}
