import { getT } from "@/lib/dictionary";
import type { LocaleCode } from "@/lib/i18n";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/reveal";
import { Callout, DocSection , OutdatedNotice } from "@/components/docs-ui";
import { Toc } from "@/components/toc";



export function DocsNcmMusicView({ locale }: { locale: LocaleCode }) {
  const t = getT(locale);
  return (
    <main className="flex min-w-0 flex-1 gap-10">
      <div className="min-w-0 max-w-3xl flex-1 pb-20">
        <Reveal>
          <div className="mb-3 flex items-center gap-2">
            <Badge variant="secondary">{t("docs-ncm-music.003")}</Badge>
            <Badge variant="outline" className="border-orange-500/40 text-orange-500">{t("docs-ncm-music.004")}</Badge>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">{t("docs-ncm-music.001")}</h1>
          <p className="mt-3 text-muted-foreground">{t("docs-ncm-music.006")}</p>
          <OutdatedNotice label={t("docs-ncm-music.030")}>{t("docs-ncm-music.031")}</OutdatedNotice>
          <Callout tone="warn">{t("docs-ncm-music.007")}</Callout>
        </Reveal>

        <div className="mt-12 space-y-14">
          <Reveal delay={40}>
            <DocSection id="enable" title={t("docs-ncm-music.008")}>
              <p>{t("docs-ncm-music.009")}<span className="font-medium text-foreground">{t("docs-ncm-music.010")}</span>{t("docs-ncm-music.011")}<span className="font-medium text-foreground">{t("docs-ncm-music.012")}</span>{t("docs-ncm-music.013")}</p>
              <div className="mt-4 overflow-hidden rounded-lg border border-border/60">
                <Image
                  src="/ncm-settings.jpg"
                  alt={t("docs-ncm-music.014")}
                  width={800}
                  height={450}
                  className="w-full"
                  loading="lazy"
                />
              </div>
            </DocSection>
          </Reveal>

          <Reveal delay={40}>
            <DocSection id="free-songs" title={t("docs-ncm-music.015")}>
              <Callout tone="info">{t("docs-ncm-music.016")}<span className="font-medium text-foreground">{t("docs-ncm-music.017")}</span>{t("docs-ncm-music.018")}</Callout>
            </DocSection>
          </Reveal>

          <Reveal delay={40}>
            <DocSection id="music-u" title={t("docs-ncm-music.019")}>
              <p>{t("docs-ncm-music.020")}{" "}
                <span className="font-medium text-foreground">MUSIC_U</span>。
              </p>
              <p className="mt-2">{t("docs-ncm-music.021")}</p>
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
                <span className="font-medium text-foreground">{t("docs-ncm-music.022")}</span>{t("docs-ncm-music.023")}</Callout>
            </DocSection>
          </Reveal>

          <Reveal delay={40}>
            <DocSection id="lyrics" title={t("docs-ncm-music.024")}>
              <p>{t("docs-ncm-music.025")}</p>
            </DocSection>
          </Reveal>

          <Reveal delay={40}>
            <DocSection id="ncm-settings" title={t("docs-ncm-music.026")}>
              <Callout tone="warn">{t("docs-ncm-music.027")}<span className="font-medium text-foreground">{t("docs-ncm-music.028")}</span>{t("docs-ncm-music.029")}</Callout>
            </DocSection>
          </Reveal>
        </div>
      </div>

      <Toc />
    </main>
  );
}
