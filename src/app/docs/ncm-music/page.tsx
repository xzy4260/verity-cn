import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/reveal";
import { Callout, DocSection } from "@/components/docs-ui";
import { Toc } from "@/components/toc";

export const metadata: Metadata = {
  title: "如何使用网易云音乐",
  description: "开启 Verity-cn 网易云音乐集成，播放免费歌曲与自定义歌词设置。",
  alternates: { canonical: "https://verity-cn.pages.dev/docs/ncm-music" },
};

export default function NCMMusicPage() {
  return (
    <main className="flex min-w-0 flex-1 gap-10">
      <div className="min-w-0 max-w-3xl flex-1 pb-20">
        <Reveal>
          <div className="mb-3 flex items-center gap-2">
            <Badge variant="secondary">进阶</Badge>
            <Badge variant="outline" className="border-orange-500/40 text-orange-500">
              临时
            </Badge>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">如何使用网易云音乐</h1>
          <p className="mt-3 text-muted-foreground">
            Verity-cn 内置了网易云音乐集成，可以让 Verity 播放歌曲、展示歌词。
          </p>
          <Callout tone="warn">
            本文为临时文档，后续将替换为完整的音乐配置详解。
          </Callout>
        </Reveal>

        <div className="mt-12 space-y-14">
          <Reveal delay={40}>
            <DocSection id="enable" title="1. 开启网易云音乐">
              <p>
                打开 Mod 配置界面，找到<span className="font-medium text-foreground">音乐分类</span>，
                将下方的<span className="font-medium text-foreground">「网易云音乐」总开关</span>打开即可。
              </p>
              <div className="mt-4 overflow-hidden rounded-lg border border-border/60">
                <Image
                  src="/ncm-settings.jpg"
                  alt="网易云音乐设置界面"
                  width={800}
                  height={450}
                  className="w-full"
                  loading="lazy"
                />
              </div>
            </DocSection>
          </Reveal>

          <Reveal delay={40}>
            <DocSection id="free-songs" title="2. 免费歌曲">
              <Callout tone="info">
                本项目<span className="font-medium text-foreground">不会也绝对不会</span>对网易云音乐进行
                VIP 破解等服务，仅可播放免费歌曲。
              </Callout>
            </DocSection>
          </Reveal>

          <Reveal delay={40}>
            <DocSection id="music-u" title="3. 播放会员歌曲（MUSIC_U）">
              <p>
                如需播放会员歌曲，需要填写个人的{" "}
                <span className="font-medium text-foreground">MUSIC_U</span>。
              </p>
              <p className="mt-2">
                获取方式：从下方链接下载浏览器扩展，自行安装后获取。
              </p>
              <div className="mt-3 rounded-lg border border-border/60 p-4">
                <Link
                  href="https://pan.quark.cn/s/c4dad77a6839"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  https://pan.quark.cn/s/c4dad77a6839
                </Link>
              </div>
              <Callout tone="warn">
                <span className="font-medium text-foreground">请务必从本来源获取</span>，
                其他渠道的浏览器插件导致的数据泄露与本人无关。
                此插件完全离线，无联网权限，请放心使用。
              </Callout>
            </DocSection>
          </Reveal>

          <Reveal delay={40}>
            <DocSection id="lyrics" title="4. 歌词自定义">
              <p>
                网易云音乐设置下方还有歌词相关配置项，可对歌词显示进行一定程度的自定义，
                请根据个人喜好自行设置。
              </p>
            </DocSection>
          </Reveal>

          <Reveal delay={40}>
            <DocSection id="ncm-settings" title="5. NCM 服务设置">
              <Callout tone="warn">
                NCM 服务相关设置<span className="font-medium text-foreground">不懂请不要乱动</span>，
                错误配置可能导致音乐功能异常。
              </Callout>
            </DocSection>
          </Reveal>
        </div>
      </div>

      <Toc />
    </main>
  );
}
