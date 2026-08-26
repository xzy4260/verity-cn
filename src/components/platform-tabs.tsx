"use client";

import * as React from "react";
import { Monitor, Smartphone } from "lucide-react";
import { Toc } from "@/components/toc";
import { Reveal } from "@/components/reveal";

type Platform = "windows" | "android";

function detectPlatform(): Platform {
  if (typeof navigator === "undefined") return "windows";
  return /Android|iPhone|iPad|Mobile|Silk/i.test(navigator.userAgent)
    ? "android"
    : "windows";
}

const noopSubscribe = () => () => {};

export function PlatformTabs({
  header,
  windows,
  android,
}: {
  header: React.ReactNode;
  windows: React.ReactNode;
  android: React.ReactNode;
}) {
  const uaPlatform = React.useSyncExternalStore(
    noopSubscribe,
    detectPlatform,
    () => "windows"
  );
  const [override, setOverride] = React.useState<Platform | null>(null);
  const platform = override ?? uaPlatform;

  const active = platform === "windows" ? windows : android;

  const options = [
    { value: "windows" as const, label: "Windows", Icon: Monitor },
    { value: "android" as const, label: "Android", Icon: Smartphone },
  ];

  return (
    <>
      <div className="min-w-0 max-w-3xl flex-1 pb-20">
        <Reveal>
          {header}
        </Reveal>

        <div className="relative mt-8 mb-8 inline-flex items-center gap-1 rounded-lg border border-border bg-muted/40 p-1">
          <div
            aria-hidden
            className={`absolute inset-y-1 left-1 w-28 rounded-md bg-background shadow-sm transition-transform duration-300 ease-out ${
              platform === "android"
                ? "translate-x-[calc(100%+0.25rem)]"
                : "translate-x-0"
            }`}
          />
          {options.map(({ value, label, Icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => setOverride(value)}
              className={`relative z-10 inline-flex w-28 items-center justify-center gap-1.5 rounded-md py-1.5 text-sm font-medium transition-colors duration-300 ${
                platform === value
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="size-4" />
              {label}
            </button>
          ))}
        </div>

        <div key={platform} className="platform-swap">
          {active}
        </div>
      </div>

      <div
        key={`toc-${platform}`}
        className="platform-swap hidden w-48 shrink-0 xl:flex"
      >
        <Toc />
      </div>
    </>
  );
}
