import Image from "next/image";
import { getT } from "@/lib/dictionary";
import type { LocaleCode } from "@/lib/i18n";
import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { GithubIcon } from "@/components/github-icon";
import { Reveal } from "@/components/reveal";




export function CreditsView({ locale }: { locale: LocaleCode }) {
  const t = getT(locale);
  const contributors: { name: string; role: string; tag: string; bilibili: string | null; desc: string; contributions: string[] }[] = [
  {
    name: t("credits.003"),
    role: t("credits.004"),
    tag: t("credits.005"),
    bilibili: "https://space.bilibili.com/3461565078571133",
    desc: t("credits.006"),
    contributions: [
      t("credits.007"),
      t("credits.008"),
      t("credits.009"),
    ],
  },
  {
    name: t("credits.010"),
    role: t("credits.011"),
    tag: t("credits.012"),
    bilibili: null,
    desc: t("credits.013"),
    contributions: [
      t("credits.014"),
      t("credits.015"),
      t("credits.016"),
    ],
  },
  ];

  const projects: { name: string; desc: string; href: string }[] = [
    { name: "GeckoLib", desc: t("credits.032"), href: "https://github.com/bernie-g/geckolib" },
    { name: "NetEase Cloud Music API Enhanced", desc: t("credits.033"), href: "https://github.com/neteasecloudmusicapienhanced/api-enhanced" },
    { name: "dsh-our-free-model", desc: t("credits.034"), href: "https://github.com/zouyuxuan122/dsh-our-free-model" },
  ];

  const sponsors: { src: string; label: string }[] = [
    { src: "/sponsor/wechat.png", label: t("credits.037") },
    { src: "/sponsor/alipay.png", label: t("credits.038") },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <Reveal>

        <h1 className="text-3xl font-semibold tracking-tight">{t("credits.017")}</h1>
        <p className="mt-2 text-muted-foreground">{t("credits.018")}</p>
      </Reveal>

      <div className="mt-10 space-y-8">
        {contributors.map((c, i) => (
          <Reveal key={c.name} delay={i * 60}>
            <div className="rounded-xl border p-6 transition-colors hover:border-foreground/15">
              <div className="flex items-start gap-4">
                <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-lg font-bold text-primary">
                  {c.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-xl font-semibold">{c.name}</h2>
                    <span className="inline-block rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                      {c.tag}
                    </span>
                  </div>
                  {c.bilibili && (
                    <a
                      href={c.bilibili}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-flex items-center gap-1 text-sm text-primary hover:underline"
                    >{t("credits.019")}<ExternalLink className="size-3" />
                    </a>
                  )}

                  <p className="mt-4 text-sm text-muted-foreground">{c.desc}</p>
                  <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                    {c.contributions.map((item, j) => (
                      <li key={j} className="flex items-start gap-2">
                        <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary/40" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <Separator className="my-10" />

      <Reveal delay={140}>
        <h2 className="text-xl font-semibold tracking-tight">{t("credits.030")}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{t("credits.031")}</p>
      </Reveal>

      <div className="mt-6 space-y-4">
        {projects.map((p, i) => (
          <Reveal key={p.name} delay={i * 60}>
            <div className="flex flex-col gap-3 rounded-xl border p-5 transition-colors hover:border-foreground/15 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <GithubIcon className="size-4 shrink-0 text-muted-foreground" />
                  <h3 className="text-base font-semibold">{p.name}</h3>
                </div>
                <p className="mt-1.5 text-sm text-muted-foreground">{p.desc}</p>
              </div>
              <a
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center gap-1 text-sm text-primary hover:underline"
              >
                GitHub<ExternalLink className="size-3" />
              </a>
            </div>
          </Reveal>
        ))}
      </div>

      <Separator className="my-10" />

      <Reveal delay={200}>
        <h2 className="text-xl font-semibold tracking-tight">{t("credits.020")}</h2>
        <p className="mt-3 text-sm text-muted-foreground">{t("credits.021")}</p>
        <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary/40" />
            <span><strong>{t("credits.022")}</strong>{t("credits.023")}<a href="https://github.com/xzy4260/verity-cn" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{t("credits.024")}</a>{t("credits.025")}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary/40" />
            <span><strong>{t("credits.026")}</strong>{t("credits.027")}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary/40" />
            <span><strong>{t("credits.028")}</strong>{t("credits.029")}</span>
          </li>
        </ul>
      </Reveal>
      <Separator className="my-10" />

      <Reveal delay={260}>
        <h2 className="text-xl font-semibold tracking-tight">{t("credits.035")}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{t("credits.036")}</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {sponsors.map((s) => (
            <div key={s.src} className="rounded-xl border p-5 text-center transition-colors hover:border-foreground/15">
              <div className="mx-auto w-44 max-w-full rounded-lg bg-white p-2">
                <Image src={s.src} alt={s.label} width={970} height={970} className="h-auto w-full rounded" />
              </div>
              <p className="mt-3 text-sm font-medium">{s.label}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">{t("credits.039")}</p>

        <div className="mt-6 flex flex-col gap-3 rounded-xl border p-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">{t("credits.040")}</p>
          <a
            href="https://pan.quark.cn/s/1064a79d1a04"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-1 text-sm text-primary hover:underline"
          >
            {t("credits.041")}<ExternalLink className="size-3" />
          </a>
        </div>
      </Reveal>

    </div>
  );
}
