"use client";

import { useT } from "@/components/locale-provider";
import * as React from "react";
import { createPortal } from "react-dom";
import {
  ChevronDown,
  CircleAlert,
  Download,
  ExternalLink,
  Gauge,
  HardDrive,
  Info,
  LoaderCircle,
  Search,
  Sparkles,
  X,
  Zap,
} from "lucide-react";

import { GithubIcon } from "@/components/github-icon";
import { Reveal } from "@/components/reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MIRRORS, MOEPAL, MOEPAL_ICON, netdisksOf, PROBE_URL } from "@/lib/mirrors";
import { cn } from "@/lib/utils";

export type Release = {
  v: string;
  file: string;
  size: string;
  date: string;
  latest?: boolean;
  desc: string;
  url: string;
  /** 该版本是否已有 GitHub Release 资产 */
  available?: boolean;
  /** dev = 开发中；norelease = 暂无直链 */
  state?: string;
};

const LATENCY_TIMEOUT = 8000;
const SPEED_DURATION = 4000;
const SPEED_MAX_BYTES = 2 * 1024 * 1024;
const LATENCY_CONCURRENCY = 8;
const SPEED_CONCURRENCY = 3;
const OFFICIAL_KEY = "__official__";

/** 测速基准文件：固定用最新已发布版本的 JAR，保证任何版本都能测 */
const SPEED_PROBE =
  "https://github.com/xzy4260/verity-cn/releases/download/v3.4/verity-cn-v3.4.jar";

type Probe = number | "loading" | "fail" | "na" | "cors" | "timeout" | "empty" | "http";

async function probeLatency(base: string): Promise<number | null> {
  const ctrl = new AbortController();
  const timer = window.setTimeout(() => ctrl.abort(), LATENCY_TIMEOUT);
  const started = performance.now();
  try {
    await fetch(base + PROBE_URL, {
      mode: "no-cors",
      cache: "no-store",
      signal: ctrl.signal,
    });
    return Math.round(performance.now() - started);
  } catch {
    return null;
  } finally {
    window.clearTimeout(timer);
  }
}

async function probeSpeed(
  base: string,
  target: string
): Promise<number | "http" | "cors" | "timeout" | "empty"> {
  const ctrl = new AbortController();
  const timer = window.setTimeout(() => ctrl.abort(), SPEED_DURATION + 4000);
  try {
    const res = await fetch(base + target, {
      mode: "cors",
      cache: "no-store",
      signal: ctrl.signal,
    });
    if (!res.ok) return "http";
    if (!res.body) return "empty";
    const reader = res.body.getReader();
    const started = performance.now();
    let bytes = 0;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value ? value.byteLength : 0;
      const elapsed = performance.now() - started;
      if (bytes >= SPEED_MAX_BYTES || elapsed >= SPEED_DURATION) break;
    }
    ctrl.abort();
    const seconds = (performance.now() - started) / 1000;
    if (bytes <= 0 || seconds <= 0) return "empty";
    return bytes / 1048576 / seconds;
  } catch (e) {
    if (e instanceof DOMException && e.name === "AbortError") return "timeout";
    return "cors";
  } finally {
    window.clearTimeout(timer);
  }
}
async function runPool<T>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<void>
) {
  let cursor = 0;
  const workers = Array.from(
    { length: Math.max(1, Math.min(limit, items.length)) },
    async () => {
      for (;;) {
        const index = cursor++;
        if (index >= items.length) return;
        await fn(items[index]);
      }
    }
  );
  await Promise.all(workers);
}


function latencyTone(v: Probe | undefined) {
  if (typeof v !== "number") return "";
  if (v < 300) return "dl-lat-fast";
  if (v < 900) return "dl-lat-mid";
  return "dl-lat-slow";
}

export function DownloadCard({ releases }: { releases: Release[] }) {
  const t = useT();
  function speedText(v: Probe | undefined) {
    if (v === undefined) return t("ui-download-card.001");
    if (v === "loading") return t("ui-download-card.002");
    if (typeof v === "number") return `${v.toFixed(2)} MB/s`;
    if (v === "cors") return t("ui-download-card.006");
    if (v === "timeout") return t("ui-download-card.003");
    if (v === "empty") return t("ui-download-card.008");
    if (v === "http") return t("ui-download-card.009");
    return t("ui-download-card.010");
  }

  function latencyText(v: Probe | undefined) {
    if (v === undefined) return t("ui-download-card.004");
    if (v === "loading") return t("ui-download-card.005");
    if (v === "fail") return t("ui-download-card.007");
    if (v === "na") return "—";
    return `${v} ms`;
  }

  const [selected, setSelected] = React.useState(releases[0]?.v ?? "");
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [latency, setLatency] = React.useState<Record<string, Probe>>({});
  const [speed, setSpeed] = React.useState<Record<string, Probe>>({});
  const [testing, setTesting] = React.useState({ latency: false, speed: false });
  const menuRef = React.useRef<HTMLDivElement>(null);
  const [modalClosing, setModalClosing] = React.useState(false);
  const [sortTick, setSortTick] = React.useState(0);
  const closeTimer = React.useRef<number | null>(null);

  const openModal = React.useCallback(() => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setModalClosing(false);
    setModalOpen(true);
  }, []);

  const closeModal = React.useCallback(() => {
    setModalClosing(true);
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => {
      setModalOpen(false);
      setModalClosing(false);
      closeTimer.current = null;
    }, 190);
  }, []);

  const release = releases.find((r) => r.v === selected) ?? releases[0];

  React.useEffect(() => setMounted(true), []);

  React.useEffect(() => {
    if (!menuOpen) return;
    const onDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  React.useEffect(() => {
    if (!modalOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [modalOpen, closeModal]);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return MIRRORS;
    return MIRRORS.filter((m) => m.host.toLowerCase().includes(q));
  }, [query]);

  const testAllLatency = React.useCallback(async () => {
    setTesting((t) => ({ ...t, latency: true }));
    setLatency(() => {
      const next: Record<string, Probe> = { [OFFICIAL_KEY]: "loading" };
      for (const m of MIRRORS) next[m.host] = "loading";
      return next;
    });
    await runPool(
      [{ base: "", host: OFFICIAL_KEY }, ...MIRRORS],
      LATENCY_CONCURRENCY,
      async (m) => {
        const ms = await probeLatency(m.base);
        setLatency((p) => ({ ...p, [m.host]: ms ?? "fail" }));
      }
    );
    setTesting((t) => ({ ...t, latency: false }));
    setSortTick((t) => t + 1);
  }, []);

  const testAllSpeed = React.useCallback(async () => {
    if (!release) return;
    setTesting((t) => ({ ...t, speed: true }));
    setSpeed(() => {
      const next: Record<string, Probe> = { [OFFICIAL_KEY]: "loading" };
      for (const m of MIRRORS) next[m.host] = "loading";
      return next;
    });
    await runPool(
      [{ base: "", host: OFFICIAL_KEY }, ...MIRRORS],
      SPEED_CONCURRENCY,
      async (m) => {
        const v = await probeSpeed(m.base, SPEED_PROBE);
        setSpeed((p) => ({ ...p, [m.host]: v ?? "empty" }));
      }
    );
    setTesting((t) => ({ ...t, speed: false }));
    setSortTick((t) => t + 1);
  }, [release]);

  const testOneLatency = React.useCallback(async (base: string, key: string) => {
    setLatency((p) => ({ ...p, [key]: "loading" }));
    const ms = await probeLatency(base);
    setLatency((p) => ({ ...p, [key]: ms ?? "fail" }));
  }, []);

  const testOneSpeed = React.useCallback(
    async (base: string, key: string) => {
      if (!release) return;
      setSpeed((p) => ({ ...p, [key]: "loading" }));
      const v = await probeSpeed(base, SPEED_PROBE);
      setSpeed((p) => ({ ...p, [key]: v ?? "empty" }));
    },
    [release]
  );

  if (!release) return null;

  const href = (base: string) => (base ? base + release.url : release.url);

  const rows: { key: string; label: string; base: string; official?: boolean }[] = [
    { key: OFFICIAL_KEY, label: t("ui-download-card.011"), base: "", official: true },
    ...MIRRORS.map((m) => ({ key: m.host, label: m.host, base: m.base })),
  ];

  const q = query.trim().toLowerCase();
  const matched = q
    ? rows.filter((r) => r.label.toLowerCase().includes(q))
    : rows;

  const num = (v: Probe | undefined) => (typeof v === "number" ? v : null);
  const latCount = matched.filter((r) => num(latency[r.key]) !== null).length;
  const spdCount = matched.filter((r) => num(speed[r.key]) !== null).length;
  const sortMode =
    latCount > 0 && spdCount > 0
      ? "mixed"
      : latCount > 0
        ? "latency"
        : spdCount > 0
          ? "speed"
          : "default";

  const rankMap = (get: (k: string) => number | null, asc: boolean) => {
    const list = matched
      .filter((r) => get(r.key) !== null)
      .sort((a, b) => (asc ? get(a.key)! - get(b.key)! : get(b.key)! - get(a.key)!));
    const map = new Map<string, number>();
    list.forEach((r, i) => map.set(r.key, list.length > 1 ? i / (list.length - 1) : 0));
    return map;
  };

  const latRank = sortMode === "speed" ? null : rankMap((k) => num(latency[k]), true);
  const spdRank = sortMode === "latency" ? null : rankMap((k) => num(speed[k]), false);
  const scoreOf = (k: string) => {
    const parts: number[] = [];
    if (latRank) parts.push(latRank.get(k) ?? 1.05);
    if (spdRank) parts.push(spdRank.get(k) ?? 1.05);
    return parts.length ? parts.reduce((a, b) => a + b, 0) / parts.length : 0;
  };

  const visibleRows =
    sortMode === "default"
      ? matched
      : [...matched].sort((a, b) => scoreOf(a.key) - scoreOf(b.key));

  return (
    <Reveal delay={180}>
      <div className="rounded-xl border p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">{t("ui-download-card.012")}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{t("ui-download-card.013")}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
          <div className="relative" ref={menuRef}>
            <span className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground">{t("ui-download-card.014")}</span>
              {release.latest && (
                <Badge variant="secondary" className="text-[10px]">{t("ui-download-card.015")}</Badge>
              )}
            </span>
            <button
              type="button"
              className="dl-trigger mt-1.5"
              data-open={menuOpen}
              aria-haspopup="listbox"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span className="flex min-w-0 items-center gap-2">
                <span className="font-medium">{release.v}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {release.date}
                </span>
              </span>
              <ChevronDown className="dl-caret size-4 shrink-0 text-muted-foreground" />
            </button>

            <div
              role="listbox"
              aria-label={t("ui-download-card.016")}
              className={cn(
                "dl-panel",
                menuOpen ? "menu-panel-open" : "menu-panel-closed"
              )}
            >
              {releases.map((r) => (
                <button
                  key={r.v}
                  type="button"
                  role="option"
                  aria-selected={r.v === selected}
                  onClick={() => {
                    setSelected(r.v);
                    setMenuOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-muted",
                    r.v === selected && "bg-muted"
                  )}
                >
                  <span className="flex items-center gap-2">
                    <span className="font-medium">{r.v}</span>
                    <span className="text-xs text-muted-foreground">{r.date}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    {r.latest && (
                      <Badge variant="secondary" className="text-[10px]">{t("ui-download-card.017")}</Badge>
                    )}
                    {r.state === "dev" && (
                      <Badge variant="outline" className="text-[10px]">{t("ui-download-card.018")}</Badge>
                    )}
                    {r.state === "norelease" && (
                      <Badge variant="outline" className="text-[10px]">{t("ui-download-card.019")}</Badge>
                    )}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <Button size="lg" onClick={() => openModal()}>
            <Download className="size-4" />{t("ui-download-card.020")}</Button>
        </div>

        <div className="mt-5 rounded-lg border bg-muted/30 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-sm font-medium">{release.file}</span>
            {release.latest && (
              <Badge variant="secondary" className="text-[10px]">{t("ui-download-card.021")}</Badge>
            )}
            {release.state === "dev" && (
              <Badge variant="outline" className="text-[10px]">{t("ui-download-card.022")}</Badge>
            )}
            {release.state === "norelease" && (
              <Badge variant="outline" className="text-[10px]">{t("ui-download-card.023")}</Badge>
            )}
          </div>
          <p className="mt-1.5 text-sm text-muted-foreground">{release.desc}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {release.size} · {release.date}{t("ui-download-card.024")}</p>
          {release.available === false && (
            <p className="mt-2 flex items-start gap-1.5 text-xs text-muted-foreground">
              <CircleAlert className="mt-0.5 size-3.5 shrink-0" />
              {release.state === "dev"
                ? t("ui-download-card.025")
                : t("ui-download-card.026")}
            </p>
          )}
        </div>

        <div className="mt-8 border-t pt-7">
          <div className="flex flex-wrap items-center gap-2">
            <HardDrive className="size-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold">{t("ui-download-card.027")}</h3>
            <Badge variant="outline" className="text-[10px]">{t("ui-download-card.028")}</Badge>
          </div>

          <p className="mt-2 text-sm text-muted-foreground">{t("ui-download-card.029")}</p>

          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {netdisksOf(t).map((m) => (
              <a
                key={m.name}
                href={m.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-3 rounded-lg border bg-background p-3 transition-colors hover:border-foreground/15"
              >
                <span className="flex min-w-0 items-center gap-2.5">
                  {/* eslint-disable-next-line @next/next/no-img-element -- 站点小图标，无需优化 */}
                  <img
                    src={m.icon}
                    alt={m.name}
                    className="size-5 shrink-0 rounded object-contain"
                  />
                  <span className="truncate text-sm font-medium">{m.name}</span>
                  {m.revenue && (
                    <Badge variant="secondary" className="shrink-0 text-[10px]">{t("ui-download-card.031")}</Badge>
                  )}
                </span>
                <span className="shrink-0 text-xs text-muted-foreground">{m.note}</span>
              </a>
            ))}
          </div>

          <div className="mt-4 rounded-lg border border-primary/20 bg-primary/5 p-4">
            <p className="flex items-start gap-2 text-sm">
              <Sparkles className="mt-0.5 size-4 shrink-0 text-primary" />
              <span>
                <span className="font-medium">{t("ui-download-card.032")}</span>{t("ui-download-card.033")}<span className="font-medium text-foreground">{t("ui-download-card.034")}</span>{t("ui-download-card.035")}</span>
            </p>
          </div>

                    <div className="mt-3 rounded-lg border bg-muted/30 p-4">
            <div className="flex items-start gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element -- 站点小图标，无需优化 */}
              <img
                src={MOEPAL_ICON}
                alt="MoePal"
                className="mt-0.5 size-6 shrink-0 rounded-md object-contain"
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm">{t("ui-download-card.036")}{" "}
                  <span className="font-medium text-foreground">MoePal</span>{" "}{t("ui-download-card.037")}</p>
                <div className="mt-2 grid gap-2 sm:grid-cols-3">
                  {MOEPAL.map((m) => (
                    <a
                      key={m.platform}
                      href={m.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between gap-2 rounded-lg border bg-background px-3 py-2 transition-colors hover:border-foreground/15"
                    >
                      <span className="inline-flex items-center gap-1.5 text-sm font-medium">
                        {m.platform}
                        <ExternalLink className="size-3 text-muted-foreground" />
                      </span>
                      <span className="shrink-0 text-xs text-muted-foreground">{t("ui-download-card.038")}{" "}
                        <code className="rounded bg-muted px-1 py-0.5 font-mono">
                          {m.code}
                        </code>
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

<p className="mt-3 flex items-start gap-1.5 text-xs text-muted-foreground">
            <Info className="mt-0.5 size-3.5 shrink-0" />{t("ui-download-card.039")}</p>
        </div>

      </div>

      {mounted &&
        modalOpen &&
        createPortal(
          <div
            className={cn("dl-overlay", modalClosing && "dl-overlay-out")}
            role="dialog"
            aria-modal="true"
            aria-label={t("ui-download-card.040")}
            onClick={closeModal}
          >
            <div className={cn("dl-modal", modalClosing && "dl-modal-out")} onClick={(e) => e.stopPropagation()}>
              <div className="flex items-start justify-between gap-4 border-b p-5">
                <div className="min-w-0">
                  <h3 className="text-lg font-semibold">{t("ui-download-card.041")}</h3>
                  <p className="mt-1 truncate text-sm text-muted-foreground">
                    {release.v} · {release.file} · {release.size}
                  </p>
                </div>
                <button
                  type="button"
                  aria-label={t("ui-download-card.042")}
                  onClick={closeModal}
                  className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <X className="size-4" />
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2 border-b px-5 py-3">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={testAllLatency}
                  disabled={testing.latency}
                >
                  {testing.latency ? (
                    <LoaderCircle className="dl-spin size-3.5" />
                  ) : (
                    <Gauge className="size-3.5" />
                  )}{t("ui-download-card.043")}</Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={testAllSpeed}
                  disabled={testing.speed}
                >
                  {testing.speed ? (
                    <LoaderCircle className="dl-spin size-3.5" />
                  ) : (
                    <Zap className="size-3.5" />
                  )}{t("ui-download-card.044")}</Button>
                {sortMode !== "default" && (
                  <span className="text-xs text-muted-foreground">
                    {sortMode === "mixed"
                      ? t("ui-download-card.045")
                      : sortMode === "latency"
                        ? t("ui-download-card.046")
                        : t("ui-download-card.047")}
                  </span>
                )}
                <div className="relative ml-auto">
                  <Search className="absolute top-1/2 left-2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t("ui-download-card.048")}
                    className="h-7 w-36 rounded-lg border bg-background pr-2 pl-7 text-xs outline-none transition-colors focus:border-foreground/25 sm:w-44"
                  />
                </div>
              </div>

              {(testing.latency || testing.speed) && (
                <div className="dl-bar mx-5 mt-3" />
              )}

              <div className="dl-scroll min-h-0 flex-1 overflow-y-auto p-3">
                <ul className="space-y-1.5">
                  {visibleRows.map((row, index) => (
                    <li
                      key={`${row.key}:${sortTick}`}
                      className="dl-row"
                      style={{ animationDelay: `${Math.min(index, 18) * 14}ms` }}
                    >
                      <div className="flex items-center gap-2 rounded-lg border bg-background/60 p-2.5 transition-colors hover:border-foreground/15">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            {row.official && (
                              <GithubIcon className="size-3.5 shrink-0" />
                            )}
                            <span
                              className={cn(
                                "truncate text-sm font-medium",
                                row.official && "font-semibold"
                              )}
                            >
                              {row.label}
                            </span>
                          </div>
                          <div className="mt-0.5 flex items-center gap-3 text-xs text-muted-foreground">
                            <span
                              className={cn(
                                "inline-flex items-center gap-1",
                                latencyTone(latency[row.key])
                              )}
                            >
                              <Gauge className="size-3" />
                              {latencyText(latency[row.key])}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <Zap className="size-3" />
                              {speedText(speed[row.key])}
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          aria-label={`${t("ui-download-card.901")} ${row.label} ${t("ui-download-card.902")}`}
                          onClick={() => testOneLatency(row.base, row.key)}
                          className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        >
                          <Gauge className="size-3.5" />
                        </button>
                        <button
                          type="button"
                          aria-label={`${t("ui-download-card.901")} ${row.label} ${t("ui-download-card.903")}`}
                          onClick={() => testOneSpeed(row.base, row.key)}
                          className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        >
                          <Zap className="size-3.5" />
                        </button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="dl-use-btn"
                          render={
                            <a
                              href={href(row.base)}
                              target="_blank"
                              rel="noreferrer"
                            />
                          }
                        >{t("ui-download-card.051")}</Button>
                      </div>
                    </li>
                  ))}
                  {visibleRows.length === 0 && (
                    <li className="px-2 py-8 text-center text-sm text-muted-foreground">{t("ui-download-card.052")}</li>
                  )}
                </ul>
              </div>

              <div className="border-t px-5 py-3 text-xs text-muted-foreground">{t("ui-download-card.053")}</div>
            </div>
          </div>,
          document.body
        )}
    </Reveal>
  );
}
