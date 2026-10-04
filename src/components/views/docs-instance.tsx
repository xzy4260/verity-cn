import { getT } from "@/lib/dictionary";
import { localePath, type LocaleCode } from "@/lib/i18n";
import Image from "next/image";
import { DocsImage } from "@/components/docs-image";
import Link from "next/link";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/reveal";
import { Callout, Step , OutdatedNotice } from "@/components/docs-ui";
import { PlatformTabs } from "@/components/platform-tabs";



function Icon({ src, alt }: { src: string; alt: string }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={140}
      height={140}
      className="mx-0.5 inline-block size-6 rounded-md border align-middle"
    />
  );
}

function Shot(props: { src: string; alt: string; w?: number; h?: number }) {
  return <DocsImage {...props} />;
}

export function DocsInstanceView({ locale }: { locale: LocaleCode }) {
  const t = getT(locale);
  const header = (
    <>
      <Badge variant="secondary" className="mb-3">{t("docs-instance.003")}</Badge>
      <h1 className="text-3xl font-semibold tracking-tight">{t("docs-instance.004")}</h1>
      <p className="mt-3 text-muted-foreground">{t("docs-instance.005")}</p>
      <OutdatedNotice label={t("docs-instance.078")}>{t("docs-instance.079")}</OutdatedNotice>
    </>
  );

  return (
    <main className="flex min-w-0 flex-1 gap-10">
      <PlatformTabs
        header={header}
        windows={
          <>
            <Reveal>
              <p className="text-muted-foreground">{t("docs-instance.006")}{" "}
                <Link href={localePath(locale, "/docs/play")} className="font-medium text-primary hover:underline">{t("docs-instance.007")}</Link>
                。
              </p>
              <Callout tone="info">{t("docs-instance.008")}</Callout>
            </Reveal>

            <div className="mt-12 space-y-14">
              <Reveal delay={40}>
                <Step n={1} id="create" title={t("docs-instance.009")}>
                  <p>{t("docs-instance.010")}<span className="font-medium text-foreground">{t("docs-instance.011")}</span>{t("docs-instance.012")}</p>
                  <ol className="list-decimal space-y-2 pl-5">
                    <li>{t("docs-instance.013")}<span className="font-medium text-foreground">1.20.1</span>；</li>
                    <li>{t("docs-instance.014")}<span className="font-medium text-foreground">Forge</span>{t("docs-instance.015")}</li>
                    <li>{t("docs-instance.016")}</li>
                  </ol>
                  <Shot
                    src="/docs/instance/instance-create.png"
                    alt={t("docs-instance.017")}
                    w={1200}
                    h={720}
                  />
                  <Callout tone="info">{t("docs-instance.018")}{" "}
                    <Link href="/download" className="font-medium text-primary hover:underline">{t("docs-instance.019")}</Link>{" "}{t("docs-instance.020")}</Callout>
                </Step>
              </Reveal>

              <Reveal delay={40}>
                <Step n={2} id="mods" title={t("docs-instance.021")}>
                  <p>{t("docs-instance.022")}<span className="font-medium text-foreground">{t("docs-instance.023")}</span>：</p>
                  <ol className="list-decimal space-y-2 pl-5">
                    <li>{t("docs-instance.024")}</li>
                    <li>{t("docs-instance.025")}</li>
                    <li>{t("docs-instance.026")}</li>
                  </ol>
                  <video
                    controls
                    preload="metadata"
                    src="/docs/instance/mod.mp4"
                    className="w-full rounded-xl border shadow-sm"
                  />
                </Step>
              </Reveal>

              <Reveal delay={40}>
                <Step n={3} id="launch" title={t("docs-instance.027")}>
                  <p>{t("docs-instance.028")}</p>
                  <Callout tone="success">{t("docs-instance.029")}<Link href={localePath(locale, "/docs/verity-config")} className="mx-1 font-medium hover:underline">{t("docs-instance.030")}</Link>
                    。
                  </Callout>
                </Step>
              </Reveal>
            </div>
          </>
        }
        android={
          <>
            <Reveal>
              <p className="text-muted-foreground">{t("docs-instance.031")}{" "}
                <Link href={localePath(locale, "/docs/play")} className="font-medium text-primary hover:underline">{t("docs-instance.032")}</Link>{" "}{t("docs-instance.033")}</p>
            </Reveal>

            <div className="mt-12 space-y-14">
              <Reveal delay={40}>
                <Step n={1} id="dl-game" title={t("docs-instance.034")}>
                  <p>{t("docs-instance.035")}{" "}
                    <Icon
                      src="/docs/instance-android/zl2-mcdl.jpg"
                      alt={t("docs-instance.036")}
                    />{t("docs-instance.037")}</p>
                  <ol className="list-decimal space-y-4 pl-5">
                    <li>{t("docs-instance.038")}{" "}
                      <span className="font-medium text-foreground">1.20.1</span>{" "}{t("docs-instance.039")}<Shot
                        src="/docs/instance-android/zl2-mcv.jpg"
                        alt={t("docs-instance.040")}
                        w={2400}
                        h={1080}
                      />
                    </li>
                    <li>{t("docs-instance.041")}{" "}
                      <span className="font-medium text-foreground">Forge</span>{t("docs-instance.042")}<Shot
                        src="/docs/instance-android/zl2-forge.jpg"
                        alt={t("docs-instance.043")}
                        w={2400}
                        h={1080}
                      />
                    </li>
                    <li>{t("docs-instance.044")}{" "}
                      <Icon
                        src="/docs/instance-android/zl2-mcdl.jpg"
                        alt={t("docs-instance.045")}
                      />
                      。
                    </li>
                  </ol>
                </Step>
              </Reveal>

              <Reveal delay={40}>
                <Step n={2} id="wait-dl" title={t("docs-instance.046")}>
                  <p>{t("docs-instance.047")}</p>
                  <Shot
                    src="/docs/instance-android/zl2-downloading.jpg"
                    alt={t("docs-instance.048")}
                    w={847}
                    h={1001}
                  />
                  <Shot
                    src="/docs/instance-android/zl2-done.jpg"
                    alt={t("docs-instance.049")}
                    w={765}
                    h={505}
                  />
                </Step>
              </Reveal>

              <Reveal delay={40}>
                <Step n={3} id="install-mods" title={t("docs-instance.050")}>
                  <p>{t("docs-instance.051")}<span className="font-medium text-foreground">{t("docs-instance.052")}</span>{t("docs-instance.053")}</p>
                  <Callout tone="success">{t("docs-instance.054")}</Callout>
                </Step>
              </Reveal>

              <Reveal delay={40}>
                <Step n={4} id="import-verity" title={t("docs-instance.055")}>
                  <p>{t("docs-instance.056")}{" "}
                    <Icon
                      src="/docs/instance-android/zl2-home.jpg"
                      alt={t("docs-instance.057")}
                    />{" "}{t("docs-instance.058")}{" "}
                    <Icon
                      src="/docs/instance-android/zl2-settings.jpg"
                      alt={t("docs-instance.059")}
                    />{" "}{t("docs-instance.060")}</p>
                  <p>{t("docs-instance.061")}<span className="font-medium text-foreground">{t("docs-instance.062")}</span>{t("docs-instance.063")}<span className="font-medium text-foreground">{t("docs-instance.064")}</span>{t("docs-instance.065")}</p>
                  <Shot
                    src="/docs/instance-android/zl2-mod-manage.jpg"
                    alt={t("docs-instance.066")}
                    w={2400}
                    h={1080}
                  />
                  <p>{t("docs-instance.067")}{" "}
                    <code className="rounded bg-muted px-1 py-0.5 text-xs">{t("docs-instance.068")}</code>{" "}{t("docs-instance.069")}</p>
                  <Shot
                    src="/docs/instance-android/file-picker.jpg"
                    alt={t("docs-instance.070")}
                    w={1080}
                    h={1247}
                  />
                  <Callout tone="warn">{t("docs-instance.071")}</Callout>
                </Step>
              </Reveal>

              <Reveal delay={40}>
                <Step n={5} id="start-android" title={t("docs-instance.072")}>
                  <p>{t("docs-instance.073")}{" "}
                    <Icon
                      src="/docs/instance-android/zl2-home.jpg"
                      alt={t("docs-instance.074")}
                    />{" "}{t("docs-instance.075")}</p>
                  <Callout tone="success">{t("docs-instance.076")}<Link href={localePath(locale, "/docs/verity-config")} className="mx-1 font-medium hover:underline">{t("docs-instance.077")}</Link>
                    。
                  </Callout>
                </Step>
              </Reveal>
            </div>
          </>
        }
      />
    </main>
  );
}
