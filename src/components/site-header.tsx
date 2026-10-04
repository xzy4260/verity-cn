"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Check, Languages, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { GithubIcon } from "@/components/github-icon";
import { useLocale, useT } from "@/components/locale-provider";
import { LOCALES, localePath, persistLocale, stripLocale, type LocaleCode } from "@/lib/i18n";

const NAV = [
  { href: "/docs", key: "ui-site-header.001" },
  { href: "/download", key: "ui-site-header.002" },
  { href: "/changelog", key: "ui-site-header.003" },
  { href: "/credits", key: "ui-site-header.004" },
];

function LocaleMenu() {
  const t = useT();
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const pick = (code: LocaleCode) => {
    persistLocale(code);
    setOpen(false);
    if (code !== locale) router.push(localePath(code, stripLocale(pathname)));
  };

  const current = LOCALES.find((l) => l.code === locale) ?? LOCALES[0];

  return (
    <div className="relative" ref={ref}>
      <Button
        variant="ghost"
        size="icon"
        aria-label={`${t("ui-site-header.008")}: ${current.native}`}
        aria-haspopup="menu"
        aria-expanded={open}
        className="text-muted-foreground"
        onClick={() => setOpen((v) => !v)}
      >
        <Languages className="size-4" />
      </Button>
      {open && (
        <div
          role="menu"
          className="locale-drop absolute right-0 top-full z-50 mt-2 w-44 rounded-xl border border-border/60 bg-background/90 p-1.5 shadow-lg backdrop-blur-xl"
        >
          {LOCALES.map((l) => (
            <button
              key={l.code}
              type="button"
              role="menuitemradio"
              aria-checked={l.code === locale}
              onClick={() => pick(l.code)}
              className="flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm text-muted-foreground transition-colors duration-200 hover:bg-muted/70 hover:text-foreground"
            >
              <span>{l.native}</span>
              {l.code === locale && <Check className="size-3.5 text-primary" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function SiteHeader() {
  const [open, setOpen] = React.useState(false);
  const locale = useLocale();
  const t = useT();
  const L = (href: string) => localePath(locale, href);

  return (
    <header className="sticky top-0 z-50 sm:px-6">
      <div className="mx-auto flex h-14 max-w-5xl items-center gap-2 rounded-2xl bg-background/70 px-3 py-2 shadow-[0_1px_2px_rgba(0,0,0,0.05),0_8px_30px_rgba(0,0,0,0.06)] backdrop-blur-xl supports-[backdrop-filter]:bg-background/55 dark:shadow-[0_1px_2px_rgba(0,0,0,0.3),0_8px_30px_rgba(0,0,0,0.4)]">
        <Link
          href={L("/")}
          className="flex shrink-0 items-center gap-2 pl-1 pr-2 font-semibold"
        >
          <Image
            src="/verity-icon.png"
            alt="Verity"
            width={28}
            height={28}
            className="rounded-md"
          />
          <span className="hidden sm:inline">Verity-cn</span>
        </Link>

        <nav className="ml-2 hidden items-center gap-1 md:flex">
          {NAV.map((l) => (
            <Link
              key={l.href}
              href={L(l.href)}
              className="rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:bg-muted/70 hover:text-foreground"
            >
              {t(l.key)}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <LocaleMenu />
          <Button
            variant="ghost"
            size="icon"
            aria-label="GitHub"
            className="text-muted-foreground"
            render={
              <Link
                href="https://github.com/xzy4260/verity-cn"
                target="_blank"
                rel="noreferrer"
              />
            }
          >
            <GithubIcon className="size-4" />
          </Button>
          <ModeToggle />
          <Button
            className="ml-1 hidden sm:inline-flex"
            render={<Link href={L("/download")} />}
          >
            {t("ui-site-header.005")}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="relative ml-0.5 overflow-hidden md:hidden"
            aria-label={t("ui-site-header.006")}
            onClick={() => setOpen((v) => !v)}
          >
            <Menu
              className={`absolute size-4 transition-all duration-300 ${
                open ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
              }`}
            />
            <X
              className={`absolute size-4 transition-all duration-300 ${
                open ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"
              }`}
            />
          </Button>
        </div>
      </div>

      {/* 面板始终渲染，靠 CSS 控制显隐 + 缩放动画 */}
      <div
        className={`menu-panel mx-auto max-w-5xl rounded-2xl border border-border/60 bg-background/90 p-2 shadow-lg backdrop-blur-xl md:hidden ${
          open ? "menu-panel-open" : "menu-panel-closed"
        }`}
      >
        <nav className="flex flex-col">
          {NAV.map((l) => (
            <Link
              key={l.href}
              href={L(l.href)}
              onClick={() => setOpen(false)}
              className="rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {t(l.key)}
            </Link>
          ))}
          <Button
            className="mt-1"
            onClick={() => setOpen(false)}
            render={<Link href={L("/download")} />}
          >
            {t("ui-site-header.007")}
          </Button>
        </nav>
      </div>
    </header>
  );
}
