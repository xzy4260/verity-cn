"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { GithubIcon } from "@/components/github-icon";

const navLinks = [
  { href: "/docs", label: "文档" },
  { href: "/download", label: "下载" },
  { href: "/changelog", label: "更新日志" },
  { href: "/credits", label: "致谢" },
];

export function SiteHeader() {
  const [open, setOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 sm:px-6">
      <div className="mx-auto flex h-14 max-w-5xl items-center gap-2 rounded-2xl bg-background/70 px-3 py-2 shadow-[0_1px_2px_rgba(0,0,0,0.05),0_8px_30px_rgba(0,0,0,0.06)] backdrop-blur-xl supports-[backdrop-filter]:bg-background/55 dark:shadow-[0_1px_2px_rgba(0,0,0,0.3),0_8px_30px_rgba(0,0,0,0.4)]">
        <Link href="/" className="flex shrink-0 items-center gap-2 pl-1 pr-2 font-semibold">
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
          {navLinks.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:bg-muted/70 hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1">
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
            render={<Link href="/download" />}
          >
            下载 v3.5
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="relative ml-0.5 overflow-hidden md:hidden"
            aria-label="菜单"
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
          {navLinks.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              onClick={() => setOpen(false)}
              className="rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
          <Button
            className="mt-1"
            onClick={() => setOpen(false)}
            render={<Link href="/download" />}
          >
            下载 v3.5
          </Button>
        </nav>
      </div>
    </header>
  );
}
