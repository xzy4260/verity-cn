import Image from "next/image";
import { getT } from "@/lib/dictionary";
import type { LocaleCode } from "@/lib/i18n";
import type { Metadata } from "next";
import { Separator } from "@/components/ui/separator";
import { Reveal } from "@/components/reveal";
import { DownloadCard } from "@/components/download-card";
import { DownloadPrereq } from "@/components/download-prereq";




export function DownloadView({ locale }: { locale: LocaleCode }) {
  const t = getT(locale);
  const releases = [
    {
      v: "v3.5.2",
      file: "verity-cn-v3.5.2.jar",
      size: t("download.027"),
      date: "2026-10",
      latest: true,
      desc: t("download.028"),
      url: "https://github.com/xzy4260/verity-cn/releases/download/v3.5.2/verity-cn-v3.5.2.jar",
    },
    {
      v: "v3.5.1",
      file: "verity-cn-v3.5.1.jar",
      size: t("download.024"),
      date: "2026-10",
      latest: false,
      desc: t("download.025"),
      url: "https://github.com/xzy4260/verity-cn/releases/download/v3.5.1/verity-cn-v3.5.1.jar",
    },
    {
      v: "v3.5",
      file: "verity-cn-v3.5.jar",
      size: t("download.003"),
      date: "2026-09",
      latest: false,
      desc: t("download.004"),
      url: "https://github.com/xzy4260/verity-cn/releases/download/v3.5/verity-cn-v3.5.jar",
    },
    {
      v: "v3.4",
      file: "verity-cn-v3.4.jar",
      size: t("download.005"),
      date: "2026-08",
      latest: false,
      desc: t("download.006"),
      url: "https://github.com/xzy4260/verity-cn/releases/download/v3.4/verity-cn-v3.4.jar",
    },
    {
      v: "v3.3",
      file: "verity-cn-v3.3.jar",
      size: t("download.007"),
      date: "2026-08",
      latest: false,
      desc: t("download.008"),
      url: "https://github.com/xzy4260/verity-cn/releases/download/v3.3/verity-cn-v3.3.jar",
    },
    {
      v: "v3.2",
      file: "verity-cn-v3.2.jar",
      size: t("download.009"),
      date: "2026-07",
      latest: false,
      desc: t("download.010"),
      url: "https://github.com/xzy4260/verity-cn/releases/download/v3.2/verity-cn-v3.2.jar",
    },
    {
      v: "v3.1",
      file: "verity-cn-v3.1.jar",
      size: t("download.011"),
      date: "2026-07",
      latest: false,
      desc: t("download.012"),
      url: "https://github.com/xzy4260/verity-cn/releases/download/v3.1/verity-cn-v3.1.jar",
    },
    {
      v: "v3.0",
      file: "verity-cn-v3.0.jar",
      size: t("download.013"),
      date: "2026-07",
      latest: false,
      desc: t("download.014"),
      url: "https://github.com/xzy4260/verity-cn/releases/download/v3.0/verity-cn-v3.0.jar",
    },
    {
      v: "v2.75",
      file: "verity-5.7.2-cn-v2.75.jar",
      size: t("download.015"),
      date: "2026-07",
      latest: false,
      desc: t("download.016"),
      url: "https://github.com/xzy4260/verity-cn/releases/download/v2.75/verity-5.7.2-cn-v2.75-fix2.jar",
    },
    {
      v: "v2.5",
      available: false,
      state: "norelease",
      file: "verity-5.7.2-cn-v2.5.jar",
      size: t("download.017"),
      date: "2026-07",
      latest: false,
      desc: t("download.018"),
      url: "https://github.com/xzy4260/verity-cn/releases/download/v2.5/verity-5.7.2-cn-v2.5.jar",
    },
    {
      v: "v2.0",
      file: "verity-5.7.2-cn-v2.0.jar",
      size: t("download.019"),
      date: "2026-07",
      latest: false,
      desc: t("download.020"),
      url: "https://github.com/xzy4260/verity-cn/releases/download/v2.0/verity-5.7.2-cn-v2.0.jar",
    },
  ];

  const ads: { src: string; alt: string; href: string; w: number; h: number }[] = [
    { src: "/ads/recall-16x9.webp", alt: "Shiftcore Recalling v2 · recall.shiftcore.top", href: "https://recall.shiftcore.top", w: 800, h: 450 },
    { src: "/ads/notfy-16x9.webp", alt: "notfyLink · link.notfy.cn", href: "https://link.notfy.cn/", w: 800, h: 450 },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <Reveal>

        <h1 className="text-3xl font-semibold tracking-tight">{t("download.021")}</h1>
        <p className="mt-2 text-muted-foreground">{t("download.022")}<code>.minecraft/mods/</code>{t("download.023")}</p>
      </Reveal>

      {/* 广告位 */}
      <Reveal delay={40}>
        <div className="mt-8 max-w-2xl">
          <div className="mb-2 flex items-center gap-2">
            <span className="inline-flex items-center rounded-full border border-border/70 bg-muted/50 px-2 py-0.5 text-[10px] font-medium tracking-wide text-muted-foreground">
              {t("download.026")}
            </span>
            <span className="h-px flex-1 bg-border" aria-hidden="true" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {ads.map((a) => (
              <a
                key={a.href}
                href={a.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block overflow-hidden rounded-xl border transition-colors hover:border-foreground/15"
              >
                <Image src={a.src} alt={a.alt} width={a.w} height={a.h} className="h-auto w-full" />
              </a>
            ))}
          </div>
        </div>
      </Reveal>

      {/* 前置要求 */}
      <Reveal delay={60}>
        <DownloadPrereq />
      </Reveal>

      <Separator className="my-10" />

      {/* 下载 + 网盘分流：合并为一张大卡片 */}
      <Reveal delay={120}>
        <DownloadCard releases={releases} />
      </Reveal>

    </div>
  );
}
