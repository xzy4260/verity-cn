import { getT } from "@/lib/dictionary";
import { localePath, type LocaleCode } from "@/lib/i18n";
import { DocsImage } from "@/components/docs-image";
import Link from "next/link";
import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/reveal";
import { Callout, Step } from "@/components/docs-ui";
import { PlatformTabs } from "@/components/platform-tabs";



function Shot(props: { src: string; alt: string; w?: number; h?: number }) {
  return <DocsImage {...props} />;
}

export function DocsPlayView({ locale }: { locale: LocaleCode }) {
  const t = getT(locale);
  const header = (
    <>
      <Badge variant="secondary" className="mb-3">{t("docs-play.003")}</Badge>
      <h1 className="text-3xl font-semibold tracking-tight">{t("docs-play.004")}</h1>
      <p className="mt-3 text-muted-foreground">{t("docs-play.005")}</p>
    </>
  );

  return (
    <main className="flex min-w-0 flex-1 gap-10">
      <PlatformTabs
        header={header}
        windows={
          <>
              <Reveal>
                <p className="text-muted-foreground">{t("docs-play.006")}{" "}
                  <span className="font-medium text-foreground">XMCL</span>{t("docs-play.007")}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-5 gap-1.5"
                  render={
                    <a
                      href="https://xmcl.app/zh/"
                      target="_blank"
                      rel="noreferrer"
                    />
                  }
                >
                  <ExternalLink className="size-3.5" />{t("docs-play.008")}</Button>
                <div className="mt-4">
                  <Callout tone="info">{t("docs-play.009")}</Callout>
                </div>
              </Reveal>

              <div className="mt-12 space-y-14">
                <Reveal delay={40}>
                  <Step n={1} id="download" title={t("docs-play.010")}>
                    <p>{t("docs-play.011")}{" "}
                      <a
                        href="https://xmcl.app/zh/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-primary hover:underline"
                      >
                        xmcl.app/zh
                      </a>{" "}{t("docs-play.012")}<span className="font-medium text-foreground">{t("docs-play.013")}</span>{t("docs-play.014")}</p>
                    <Shot
                      src="/docs/xmcl/download.png"
                      alt={t("docs-play.015")}
                      w={1176}
                      h={415}
                    />
                  </Step>
                </Reveal>

                <Reveal delay={40}>
                  <Step n={2} id="install" title={t("docs-play.016")}>
                    <p>{t("docs-play.017")}</p>
                    <video
                      controls
                      preload="metadata"
                      src="/docs/xmcl/extract.mp4"
                      className="w-full rounded-xl border shadow-sm"
                    />
                  </Step>
                </Reveal>

                <Reveal delay={40}>
                  <Step n={3} id="init" title={t("docs-play.018")}>
                    <p>{t("docs-play.019")}{" "}
                      <span className="font-medium text-foreground">
                        X Minecraft Launcher
                      </span>{" "}{t("docs-play.020")}</p>
                    <Callout tone="warn">{t("docs-play.021")}<span className="font-medium">{t("docs-play.022")}</span>
                    </Callout>
                    <p>{t("docs-play.023")}</p>
                    <ol className="list-decimal space-y-4 pl-5">
                      <li>{t("docs-play.024")}<Shot
                          src="/docs/xmcl/init-language.png"
                          alt={t("docs-play.025")}
                          w={1200}
                          h={720}
                        />
                      </li>
                      <li>{t("docs-play.026")}</li>
                      <li>{t("docs-play.027")}<Shot
                          src="/docs/xmcl/data-dir.png"
                          alt={t("docs-play.028")}
                          w={1200}
                          h={720}
                        />
                        <div className="mt-3">
                          <Callout tone="info">{t("docs-play.029")}</Callout>
                        </div>
                      </li>
                      <li>{t("docs-play.030")}</li>
                    </ol>
                  </Step>
                </Reveal>

                <Reveal delay={40}>
                  <Step n={4} id="dev-mode" title={t("docs-play.031")}>
                    <p>{t("docs-play.032")}<span className="font-medium text-foreground">{t("docs-play.033")}</span>
                    </p>
                    <Shot
                      src="/docs/xmcl/dev-mode.png"
                      alt={t("docs-play.034")}
                      w={1200}
                      h={720}
                    />
                  </Step>
                </Reveal>

                <Reveal delay={40}>
                  <Step n={5} id="account" title={t("docs-play.035")}>
                    <p>{t("docs-play.036")}</p>
                    <Shot
                      src="/docs/xmcl/account.png"
                      alt={t("docs-play.037")}
                      w={1200}
                      h={720}
                    />
                  </Step>
                </Reveal>

                <Reveal delay={40}>
                  <Callout tone="success">{t("docs-play.038")}</Callout>
                </Reveal>
              </div>
            </>
        }
        android={
          <>
            <Reveal>
                <p className="text-muted-foreground">{t("docs-play.039")}{" "}
                  <span className="font-medium text-foreground">ZL2</span>{" "}{t("docs-play.040")}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-5 gap-1.5"
                  render={
                    <a
                      href="https://www.zalithlauncher.cn/download"
                      target="_blank"
                      rel="noreferrer"
                    />
                  }
                >
                  <ExternalLink className="size-3.5" />{t("docs-play.041")}</Button>
              </Reveal>

              <div className="mt-12 space-y-14">
                <Reveal delay={40}>
                  <Step n={1} id="dl-zl2" title={t("docs-play.042")}>
                    <p>{t("docs-play.043")}<span className="font-medium text-foreground">{t("docs-play.044")}</span>{t("docs-play.045")}</p>
                    <Shot
                      src="/docs/android/zl2-dl.png"
                      alt={t("docs-play.046")}
                      w={1470}
                      h={1155}
                    />
                  </Step>
                </Reveal>

                <Reveal delay={40}>
                  <Step n={2} id="zl2-init" title={t("docs-play.047")}>
                    <p>{t("docs-play.048")}</p>
                    <Shot
                      src="/docs/android/zl2-init.jpg"
                      alt={t("docs-play.049")}
                      w={2400}
                      h={1080}
                    />
                    <Shot
                      src="/docs/android/zl2-home.jpg"
                      alt={t("docs-play.050")}
                      w={2400}
                      h={1080}
                    />
                  </Step>
                </Reveal>

                <Reveal delay={40}>
                  <Step n={3} id="zl2-account" title={t("docs-play.051")}>
                    <p>{t("docs-play.052")}</p>
                    <Shot
                      src="/docs/android/zl2-acc.jpg"
                      alt={t("docs-play.053")}
                      w={2400}
                      h={1080}
                    />
                    <p>{t("docs-play.054")}<span className="font-medium text-foreground">{t("docs-play.055")}</span>{t("docs-play.056")}<span className="font-medium text-foreground">{t("docs-play.057")}</span>{t("docs-play.058")}{" "}
                      <code className="rounded bg-muted px-1 py-0.5 text-xs">
                        https://littleskin.cn/api/yggdrasil
                      </code>{" "}{t("docs-play.059")}</p>
                    <Shot
                      src="/docs/android/zl2-addacc.jpg"
                      alt={t("docs-play.060")}
                      w={2400}
                      h={1080}
                    />
                  </Step>
                </Reveal>

                <Reveal delay={40}>
                  <Callout tone="success">{t("docs-play.061")}<Link href={localePath(locale, "/docs/instance")} className="mx-1 font-medium hover:underline">{t("docs-play.062")}</Link>{t("docs-play.063")}<Link href={localePath(locale, "/docs/verity-config")} className="mx-1 font-medium hover:underline">{t("docs-play.064")}</Link>
                    。
                  </Callout>
                </Reveal>
              </div>
            </>
        }
      />
    </main>
  );
}
