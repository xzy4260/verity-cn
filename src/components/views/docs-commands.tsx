import { getT } from "@/lib/dictionary";
import type { LocaleCode } from "@/lib/i18n";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/reveal";
import { Callout, DocSection } from "@/components/docs-ui";
import { Toc } from "@/components/toc";



export function DocsCommandsView({ locale }: { locale: LocaleCode }) {
  const t = getT(locale);
  return (
    <main className="flex min-w-0 flex-1 gap-10">
      <div className="min-w-0 max-w-3xl flex-1 pb-20">
        <Reveal>
          <div className="mb-3 flex items-center gap-2">
            <Badge variant="secondary">{t("docs-commands.003")}</Badge>
            <Badge variant="outline" className="border-orange-500/40 text-orange-500">{t("docs-commands.004")}</Badge>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">{t("docs-commands.005")}</h1>
          <p className="mt-3 text-muted-foreground">{t("docs-commands.006")}<code className="mx-1 rounded bg-muted px-1.5 py-0.5 text-xs font-bold">/cnv </code>{t("docs-commands.007")}</p>
          <Callout tone="warn">{t("docs-commands.008")}</Callout>
        </Reveal>

        <div className="mt-12 space-y-14">
          <Reveal delay={40}>
            <DocSection id="compress" title="/cnv compress">
              <p>
                <span className="font-medium text-foreground">{t("docs-commands.009")}</span>{t("docs-commands.010")}</p>
            </DocSection>
          </Reveal>

          <Reveal delay={40}>
            <DocSection id="get" title="/cnv get">
              <p>
                <span className="font-medium text-foreground">{t("docs-commands.011")}</span>{t("docs-commands.012")}</p>
            </DocSection>
          </Reveal>

          <Reveal delay={40}>
            <DocSection id="karma" title="/cnv karma">
              <p>
                <span className="font-medium text-foreground">{t("docs-commands.013")}</span>。
              </p>
              <p className="mt-2">{t("docs-commands.014")}<code className="ml-1 rounded bg-muted px-1.5 py-0.5 text-xs">/cnv karma &lt;{t("docs-commands.015")};</code>
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{t("docs-commands.016")}<span className="font-medium text-foreground">0 – 20</span>{t("docs-commands.017")}</p>
            </DocSection>
          </Reveal>

          <Reveal delay={40}>
            <DocSection id="locate" title="/cnv locate">
              <p>
                <span className="font-medium text-foreground">{t("docs-commands.018")}</span>{t("docs-commands.019")}</p>
              <p className="mt-2">{t("docs-commands.020")}<code className="ml-1 rounded bg-muted px-1.5 py-0.5 text-xs">/cnv locate tp</code>
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{t("docs-commands.021")}<code className="rounded bg-muted px-1 py-0.5 text-xs">tp</code>{t("docs-commands.022")}<span className="font-medium text-foreground">{t("docs-commands.023")}</span>{t("docs-commands.024")}</p>
            </DocSection>
          </Reveal>

          <Reveal delay={40}>
            <DocSection id="music" title={t("docs-commands.025")}>
              <div className="space-y-4">
                <div className="rounded-lg border border-border/60 p-4">
                  <p className="font-medium text-foreground">
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">/cnv mplay</code>
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">{t("docs-commands.026")}</p>
                </div>
                <div className="rounded-lg border border-border/60 p-4">
                  <p className="font-medium text-foreground">
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">/cnv mplay &lt;{t("docs-commands.027")};</code>
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">{t("docs-commands.028")}</p>
                </div>
                <div className="rounded-lg border border-border/60 p-4">
                  <p className="font-medium text-foreground">
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">/cnv mplay mygal</code>
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">{t("docs-commands.029")}</p>
                </div>
                <div className="rounded-lg border border-border/60 p-4">
                  <p className="font-medium text-foreground">
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">/cnv mstop</code>
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">{t("docs-commands.030")}</p>
                </div>
                <div className="rounded-lg border border-border/60 p-4">
                  <p className="font-medium text-foreground">
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">/cnv mvolume</code>
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">{t("docs-commands.031")}</p>
                </div>
                <div className="rounded-lg border border-border/60 p-4">
                  <p className="font-medium text-foreground">
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">/cnv mvolume &lt;{t("docs-commands.032")};</code>
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">{t("docs-commands.033")}<span className="font-medium text-foreground">0 – 100</span>。
                  </p>
                </div>
              </div>
            </DocSection>
          </Reveal>

          <Reveal delay={40}>
            <DocSection id="recover" title="/cnv recover">
              <p>
                <span className="font-medium text-foreground">{t("docs-commands.034")}</span>{t("docs-commands.035")}</p>
            </DocSection>
          </Reveal>
        </div>
      </div>

      <Toc />
    </main>
  );
}
