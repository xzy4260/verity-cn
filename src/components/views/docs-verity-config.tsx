import { getT } from "@/lib/dictionary";
import type { LocaleCode } from "@/lib/i18n";
import { DocsImage } from "@/components/docs-image";
import { ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/reveal";
import { Toc } from "@/components/toc";
import { Callout, Step , OutdatedNotice } from "@/components/docs-ui";


function Shot(props: { src: string; alt: string; w?: number; h?: number }) {
  return <DocsImage {...props} />;
}

export function DocsVerityConfigView({ locale }: { locale: LocaleCode }) {
  const t = getT(locale);
  return (
    <main className="flex min-w-0 flex-1 gap-10">
      <div className="min-w-0 max-w-3xl flex-1 pb-20">
        <Reveal>
          <Badge variant="secondary" className="mb-3">{t("docs-verity-config.003")}</Badge>
          <h1 className="text-3xl font-semibold tracking-tight">{t("docs-verity-config.001")}</h1>
          <p className="mt-3 text-muted-foreground">{t("docs-verity-config.005")}{" "}
            <span className="font-medium text-foreground">{t("docs-verity-config.006")}</span>{t("docs-verity-config.007")}</p>
          <OutdatedNotice label={t("docs-verity-config.066")}>{t("docs-verity-config.067")}</OutdatedNotice>
          <Button
            variant="outline"
            size="sm"
            className="mt-5 gap-1.5"
            render={<a href="https://veritycn.site/" target="_blank" rel="noreferrer" />}
          >
            <ExternalLink className="size-3.5" />{t("docs-verity-config.008")}</Button>
        </Reveal>

        <div className="mt-12 space-y-14">
          <Reveal delay={40}>
            <Step n={1} id="init" title={t("docs-verity-config.009")}>
              <p>{t("docs-verity-config.010")}{" "}
                <span className="font-medium text-foreground">{t("docs-verity-config.011")}</span>
                。
              </p>
              <Callout tone="info">{t("docs-verity-config.012")}</Callout>
              <Shot
                src="/docs/verity-config/init.png"
                alt={t("docs-verity-config.013")}
                w={854}
                h={480}
              />
            </Step>
          </Reveal>

          <Reveal delay={40}>
            <Step n={2} id="website" title={t("docs-verity-config.014")}>
              <p>{t("docs-verity-config.015")}{" "}
                <a
                  href="https://space.bilibili.com/3461565078571133"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary hover:underline"
                >{t("docs-verity-config.016")}</a>{" "}{t("docs-verity-config.017")}{" "}
                <a
                  href="https://veritycn.site/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary hover:underline"
                >{t("docs-verity-config.018")}</a>{" "}{t("docs-verity-config.019")}<span className="font-medium text-foreground">{t("docs-verity-config.020")}</span>{t("docs-verity-config.021")}</p>
              <div className="rounded-xl border p-4 text-sm">
                <p className="font-medium text-foreground">{t("docs-verity-config.022")}</p>
                <ul className="mt-2 space-y-1 text-muted-foreground">
                  <li>{t("docs-verity-config.023")}</li>
                  <li>{t("docs-verity-config.024")}</li>
                </ul>
              </div>
            </Step>
          </Reveal>

          <Reveal delay={40}>
            <Step n={3} id="services" title={t("docs-verity-config.025")}>
              <p>{t("docs-verity-config.026")}<span className="font-medium text-foreground">{t("docs-verity-config.027")}</span>{t("docs-verity-config.028")}<span className="font-medium text-foreground">TTS</span>{t("docs-verity-config.029")}<span className="font-medium text-foreground">STT</span>{t("docs-verity-config.030")}</p>
              <p>{t("docs-verity-config.031")}<span className="font-medium text-foreground">{t("docs-verity-config.032")}</span>{t("docs-verity-config.033")}</p>
              <Shot
                src="/docs/verity-config/sign-in.png"
                alt={t("docs-verity-config.034")}
                w={2145}
                h={717}
              />
            </Step>
          </Reveal>

          <Reveal delay={40}>
            <Step n={4} id="llm" title={t("docs-verity-config.035")}>
              <p>{t("docs-verity-config.036")}{" "}
                <span className="font-medium text-foreground">DeepSeek</span>、
                <span className="font-medium text-foreground">{t("docs-verity-config.037")}</span>、
                <span className="font-medium text-foreground">{t("docs-verity-config.038")}</span>{" "}{t("docs-verity-config.039")}</p>
              <Shot
                src="/docs/verity-config/api.png"
                alt={t("docs-verity-config.040")}
                w={2502}
                h={1128}
              />
              <p>{t("docs-verity-config.041")}<span className="font-medium text-foreground">{t("docs-verity-config.042")}</span>{t("docs-verity-config.043")}<code className="rounded bg-muted px-1 py-0.5 text-xs">/v1</code>{" "}{t("docs-verity-config.044")}<span className="font-medium text-foreground">{t("docs-verity-config.045")}</span>{t("docs-verity-config.046")}</p>
            </Step>
          </Reveal>

          <Reveal delay={40}>
            <Step n={5} id="proxy" title={t("docs-verity-config.047")}>
              <p>{t("docs-verity-config.048")}</p>
              <Shot
                src="/docs/verity-config/proxy.png"
                alt={t("docs-verity-config.049")}
                w={835}
                h={525}
              />
            </Step>
          </Reveal>

          <Reveal delay={40}>
            <Step n={6} id="voice" title={t("docs-verity-config.050")}>
              <p>{t("docs-verity-config.051")}<span className="font-medium text-foreground">{t("docs-verity-config.052")}</span>{t("docs-verity-config.053")}</p>
              <Shot
                src="/docs/verity-config/config-gen.png"
                alt={t("docs-verity-config.054")}
                w={848}
                h={562}
              />
              <p>{t("docs-verity-config.055")}<span className="font-medium text-foreground">{t("docs-verity-config.056")}</span>{t("docs-verity-config.057")}</p>
              <Shot
                src="/docs/verity-config/refresh.png"
                alt={t("docs-verity-config.058")}
                w={888}
                h={488}
              />
            </Step>
          </Reveal>

          <Reveal delay={40}>
            <Step n={7} id="oauth" title={t("docs-verity-config.059")}>
              <p>{t("docs-verity-config.060")}<span className="font-medium text-foreground">{t("docs-verity-config.061")}</span>{t("docs-verity-config.062")}</p>
              <p>{t("docs-verity-config.063")}</p>
              <Shot
                src="/docs/verity-config/connectivity.png"
                alt={t("docs-verity-config.064")}
                w={854}
                h={480}
              />
              <Callout tone="success">{t("docs-verity-config.065")}</Callout>
            </Step>
          </Reveal>
        </div>
      </div>

        <Toc />
    </main>
  );
}
