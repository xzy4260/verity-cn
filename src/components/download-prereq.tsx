"use client";
import { useT } from "@/components/locale-provider";
import { CircleCheck, ExternalLink } from "lucide-react";

export function DownloadPrereq() {
  const t = useT();
  return (
    <>
      <h2 className="mt-10 text-2xl font-semibold tracking-tight">{t("ui-download-prereq.001")}</h2>
      <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-6">
        <div className="flex items-start gap-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <CircleCheck className="size-5" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold">{t("ui-download-prereq.002")}</p>
            <p className="mt-1.5 text-sm text-muted-foreground">{t("ui-download-prereq.003")}{" "}
              <span className="font-medium text-foreground">{t("ui-download-prereq.004")}</span>{t("ui-download-prereq.005")}{" "}
              <code className="rounded bg-muted px-1 py-0.5 font-mono text-[0.8em]">
                .minecraft/mods/
              </code>{" "}{t("ui-download-prereq.006")}</p>
            <a
              href="https://files.minecraftforge.net/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1 text-sm text-primary hover:underline"
            >{t("ui-download-prereq.007")}<ExternalLink className="size-3" />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
