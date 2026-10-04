import { getT } from "@/lib/dictionary";
import type { LocaleCode } from "@/lib/i18n";
import Image from "next/image";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/reveal";
import { Callout, DocSection , OutdatedNotice } from "@/components/docs-ui";
import { Toc } from "@/components/toc";



export function DocsFreeLlmView({ locale }: { locale: LocaleCode }) {
  const t = getT(locale);
  return (
    <main className="flex min-w-0 flex-1 gap-10">
      <div className="min-w-0 max-w-3xl flex-1 pb-20">
        <Reveal>
          <div className="mb-3 flex items-center gap-2">
            <Badge variant="secondary">{t("docs-free-llm.003")}</Badge>
            <Badge variant="outline" className="border-orange-500/40 text-orange-500">{t("docs-free-llm.004")}</Badge>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">{t("docs-free-llm.001")}</h1>
          <p className="mt-3 text-muted-foreground">{t("docs-free-llm.006")}</p>
          <OutdatedNotice label={t("docs-free-llm.030")}>{t("docs-free-llm.031")}</OutdatedNotice>
          <Callout tone="warn">{t("docs-free-llm.007")}</Callout>
        </Reveal>

        <div className="mt-12 space-y-14">
          <Reveal delay={40}>
            <DocSection id="open-config" title={t("docs-free-llm.008")}>
              <p>{t("docs-free-llm.009")}</p>
            </DocSection>
          </Reveal>

          <Reveal delay={40}>
            <DocSection id="select-llm" title={t("docs-free-llm.010")}>
              <p>{t("docs-free-llm.011")}</p>
            </DocSection>
          </Reveal>

          <Reveal delay={40}>
            <DocSection id="switch-mode" title={t("docs-free-llm.012")}>
              <p>{t("docs-free-llm.013")}<span className="font-medium text-foreground">{t("docs-free-llm.014")}</span>{t("docs-free-llm.015")}</p>
            </DocSection>
          </Reveal>

          <Reveal delay={40}>
            <DocSection id="select-provider" title={t("docs-free-llm.016")}>
              <p>{t("docs-free-llm.017")}</p>
              <div className="mt-4 space-y-4">
                <div className="rounded-lg border border-border/60 p-4">
                  <p className="font-medium text-foreground">{t("docs-free-llm.018")}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{t("docs-free-llm.019")}<span className="font-medium text-foreground">{t("docs-free-llm.020")}</span>{t("docs-free-llm.021")}</p>
                </div>
                <div className="rounded-lg border border-border/60 p-4">
                  <p className="font-medium text-foreground">{t("docs-free-llm.022")}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{t("docs-free-llm.023")}</p>
                </div>
              </div>
              <div className="mt-6 overflow-hidden rounded-lg border border-border/60">
                <Image
                  src="/llm-provider.jpg"
                  alt={t("docs-free-llm.024")}
                  width={800}
                  height={450}
                  className="w-full"
                  loading="lazy"
                />
              </div>
            </DocSection>
          </Reveal>

          <Reveal delay={40}>
            <DocSection id="errors" title={t("docs-free-llm.025")}>
              <div className="space-y-4">
                <div className="rounded-lg border border-border/60 p-4">
                  <p className="font-medium text-foreground">{t("docs-free-llm.026")}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{t("docs-free-llm.027")}</p>
                </div>
                <div className="rounded-lg border border-border/60 p-4">
                  <p className="font-medium text-foreground">{t("docs-free-llm.028")}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{t("docs-free-llm.029")}</p>
                </div>
              </div>
            </DocSection>
          </Reveal>
        </div>
      </div>

      <Toc />
    </main>
  );
}
