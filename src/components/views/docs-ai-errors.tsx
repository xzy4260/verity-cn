import { getT } from "@/lib/dictionary";
import type { LocaleCode } from "@/lib/i18n";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/reveal";
import { DocSection } from "@/components/docs-ui";
import { Toc } from "@/components/toc";



export function DocsAiErrorsView({ locale }: { locale: LocaleCode }) {
  const t = getT(locale);
  return (
    <main className="flex min-w-0 flex-1 gap-10">
      <div className="min-w-0 max-w-3xl flex-1 pb-20">
        <Reveal>
          <div className="mb-3 flex items-center gap-2">
            <Badge variant="secondary">{t("docs-ai-errors.003")}</Badge>
            <Badge variant="outline" className="border-orange-500/40 text-orange-500">{t("docs-ai-errors.004")}</Badge>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">{t("docs-ai-errors.001")}</h1>
          <p className="mt-3 text-muted-foreground">{t("docs-ai-errors.006")}</p>
        </Reveal>

        <div className="mt-12 space-y-14">
          <Reveal delay={40}>
            <DocSection id="client-errors" title={t("docs-ai-errors.007")}>
              <div className="space-y-4">
                <ErrorRow
                  code="400"
                  title={t("docs-ai-errors.008")}
                  desc={t("docs-ai-errors.009")}
                />
                <ErrorRow
                  code="401"
                  title={t("docs-ai-errors.010")}
                  desc={t("docs-ai-errors.011")}
                />
                <ErrorRow
                  code="403"
                  title={t("docs-ai-errors.012")}
                  desc={t("docs-ai-errors.013")}
                />
                <ErrorRow
                  code="404"
                  title={t("docs-ai-errors.014")}
                  desc={t("docs-ai-errors.015")}
                />
                <ErrorRow
                  code="408"
                  title={t("docs-ai-errors.016")}
                  desc={t("docs-ai-errors.017")}
                />
                <ErrorRow
                  code="422"
                  title={t("docs-ai-errors.018")}
                  desc={t("docs-ai-errors.019")}
                />
                <ErrorRow
                  code="429"
                  title={t("docs-ai-errors.020")}
                  desc={t("docs-ai-errors.021")}
                />
              </div>
            </DocSection>
          </Reveal>

          <Reveal delay={40}>
            <DocSection id="server-errors" title={t("docs-ai-errors.022")}>
              <div className="space-y-4">
                <ErrorRow
                  code="500"
                  title={t("docs-ai-errors.023")}
                  desc={t("docs-ai-errors.024")}
                />
                <ErrorRow
                  code="502"
                  title={t("docs-ai-errors.025")}
                  desc={t("docs-ai-errors.026")}
                />
                <ErrorRow
                  code="503"
                  title={t("docs-ai-errors.027")}
                  desc={t("docs-ai-errors.028")}
                />
                <ErrorRow
                  code="504"
                  title={t("docs-ai-errors.029")}
                  desc={t("docs-ai-errors.030")}
                />
              </div>
            </DocSection>
          </Reveal>

          <Reveal delay={40}>
            <DocSection id="tips" title={t("docs-ai-errors.031")}>
              <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
                <li>{t("docs-ai-errors.032")}<span className="font-medium text-foreground">429</span>{t("docs-ai-errors.033")}</li>
                <li>{t("docs-ai-errors.034")}<span className="font-medium text-foreground">503</span>{t("docs-ai-errors.035")}</li>
                <li>{t("docs-ai-errors.036")}</li>
                <li>{t("docs-ai-errors.037")}</li>
              </ul>
            </DocSection>
          </Reveal>
        </div>
      </div>

      <Toc />
    </main>
  );
}

function ErrorRow({
  code,
  title,
  desc,
}: {
  code: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-lg border border-border/60 p-4">
      <div className="flex items-center gap-2">
        <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-xs font-bold text-foreground">
          {code}
        </span>
        <span className="font-medium text-foreground">{title}</span>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}
