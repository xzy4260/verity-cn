import { getT } from "@/lib/dictionary";
import type { LocaleCode } from "@/lib/i18n";
import Link from "next/link";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/reveal";
import { Callout, DocSection } from "@/components/docs-ui";
import { Toc } from "@/components/toc";



export function DocsConceptsView({ locale }: { locale: LocaleCode }) {
  const t = getT(locale);
  return (
    <main className="flex min-w-0 flex-1 gap-10">
        <div className="min-w-0 max-w-3xl flex-1 pb-20">
          <Reveal>
            <Badge variant="secondary" className="mb-3">{t("docs-concepts.003")}</Badge>
            <h1 className="text-3xl font-semibold tracking-tight">{t("docs-concepts.004")}</h1>
            <p className="mt-3 text-muted-foreground">{t("docs-concepts.005")}</p>
          </Reveal>

          <div className="mt-12 space-y-14">
            <Reveal delay={40}>
              <DocSection id="llm" title={t("docs-concepts.006")}>
                <p>{t("docs-concepts.007")}</p>
                <p>{t("docs-concepts.008")}{" "}
                  <Link href="#key" className="font-medium text-primary hover:underline">
                    API Key
                  </Link>{t("docs-concepts.009")}</p>
              </DocSection>
            </Reveal>

            <Reveal delay={40}>
              <DocSection id="tts" title={t("docs-concepts.010")}>
                <p>{t("docs-concepts.011")}</p>
              </DocSection>
            </Reveal>

            <Reveal delay={40}>
              <DocSection id="stt" title={t("docs-concepts.012")}>
                <p>{t("docs-concepts.013")}</p>
              </DocSection>
            </Reveal>

            <Reveal delay={40}>
              <DocSection id="base-url" title={t("docs-concepts.014")}>
                <p>{t("docs-concepts.015")}{" "}
                  <code className="rounded bg-muted px-1 py-0.5 text-xs">
                    https://api.example.com/v1
                  </code>{" "}{t("docs-concepts.016")}</p>
                <p>{t("docs-concepts.017")}</p>
              </DocSection>
            </Reveal>

            <Reveal delay={40}>
              <DocSection id="key" title={t("docs-concepts.018")}>
                <p>{t("docs-concepts.019")}</p>
                <Callout tone="warn">{t("docs-concepts.020")}</Callout>
              </DocSection>
            </Reveal>

            <Reveal delay={40}>
              <DocSection id="model" title={t("docs-concepts.021")}>
                <p>{t("docs-concepts.022")}</p>
                <p>{t("docs-concepts.023")}</p>
              </DocSection>
            </Reveal>

            <Reveal delay={40}>
              <DocSection id="tts-stt-note" title={t("docs-concepts.024")}>
                <p>{t("docs-concepts.025")}{" "}
                  <span className="font-medium text-foreground">{t("docs-concepts.026")}</span>{t("docs-concepts.027")}</p>
                <p>{t("docs-concepts.028")}<span className="font-medium text-foreground">{t("docs-concepts.029")}</span>{" "}{t("docs-concepts.030")}</p>
              </DocSection>
            </Reveal>
          </div>
        </div>

        <Toc />
    </main>
  );
}
