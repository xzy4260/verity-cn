import { getT } from "@/lib/dictionary";
import { localePath, type LocaleCode } from "@/lib/i18n";
import { DocsImage } from "@/components/docs-image";
import Link from "next/link";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/reveal";
import { Callout, Step } from "@/components/docs-ui";
import { Toc } from "@/components/toc";



function Shot(props: { src: string; alt: string; w?: number; h?: number }) {
  return <DocsImage {...props} />;
}

export function DocsGameplayView({ locale }: { locale: LocaleCode }) {
  const t = getT(locale);
  return (
    <main className="flex min-w-0 flex-1 gap-10">
        <div className="min-w-0 max-w-3xl flex-1 pb-20">
          <Reveal>
            <Badge variant="secondary" className="mb-3">{t("docs-gameplay.003")}</Badge>
            <h1 className="text-3xl font-semibold tracking-tight">{t("docs-gameplay.004")}</h1>
            <p className="mt-3 text-muted-foreground">{t("docs-gameplay.005")}</p>
          </Reveal>

          <div className="mt-12 space-y-14">
            <Reveal delay={40}>
              <Step n={1} id="create-world" title={t("docs-gameplay.006")}>
                <p>{t("docs-gameplay.007")}<Link href={localePath(locale, "/docs/verity-config")} className="font-medium text-primary hover:underline">{t("docs-gameplay.008")}</Link>{t("docs-gameplay.009")}<span className="font-medium text-foreground">{t("docs-gameplay.010")}</span>{t("docs-gameplay.011")}</p>
              </Step>
            </Reveal>

            <Reveal delay={40}>
              <Step n={2} id="ime" title={t("docs-gameplay.012")}>
                <p>{t("docs-gameplay.013")}<span className="font-medium text-foreground">{t("docs-gameplay.014")}</span>。</p>
                <Callout tone="info">{t("docs-gameplay.015")}<span className="font-medium">{t("docs-gameplay.016")}</span>{t("docs-gameplay.017")}</Callout>
              </Step>
            </Reveal>

            <Reveal delay={40}>
              <Step n={3} id="open-box" title={t("docs-gameplay.018")}>
                <p>{t("docs-gameplay.019")}<span className="font-medium text-foreground">{t("docs-gameplay.020")}</span>：
                </p>
                <Shot
                  src="/docs/gameplay/cardboard-box.png"
                  alt={t("docs-gameplay.021")}
                />
                <p>
                  <span className="font-medium text-foreground">{t("docs-gameplay.022")}</span>{t("docs-gameplay.023")}</p>
              </Step>
            </Reveal>

            <Reveal delay={40}>
              <Step n={4} id="talk" title={t("docs-gameplay.024")}>
                <p>{t("docs-gameplay.025")}<span className="font-medium text-foreground">{t("docs-gameplay.026")}</span>{t("docs-gameplay.027")}</p>
                <Callout tone="info">{t("docs-gameplay.028")}{" "}
                  <span className="font-medium">{t("docs-gameplay.029")}</span>{" "}{t("docs-gameplay.030")}</Callout>
                <Shot
                  src="/docs/gameplay/keybind.png"
                  alt={t("docs-gameplay.031")}
                />
                <p>{t("docs-gameplay.032")}</p>
                <Shot
                  src="/docs/gameplay/voice-level.png"
                  alt={t("docs-gameplay.033")}
                />
              </Step>
            </Reveal>

            <Reveal delay={40}>
              <Step n={5} id="reply" title={t("docs-gameplay.034")}>
                <p>{t("docs-gameplay.035")}</p>
                <Shot src="/docs/gameplay/chat-reply.png" alt={t("docs-gameplay.036")} />
                <Callout tone="success">{t("docs-gameplay.037")}</Callout>
              </Step>
            </Reveal>
          </div>
        </div>

        <Toc />
    </main>
  );
}
