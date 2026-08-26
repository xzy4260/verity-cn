"use client";

import * as React from "react";
import { X } from "lucide-react";
import { DocsSidebar } from "@/components/docs-sidebar";
import { DocsLocalNav, MobileSidebarNav } from "@/components/docs-ui";
import { DocsTocProvider } from "@/components/docs-toc";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  // ESC 关闭
  React.useEffect(() => {
    if (!sidebarOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSidebarOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sidebarOpen]);

  // 点击侧边栏外部关闭
  React.useEffect(() => {
    if (!sidebarOpen) return;
    const onClick = (e: MouseEvent) => {
      if (!e.target.closest('.mobile-sidebar') && !e.target.closest('.local-nav-btn')) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [sidebarOpen]);

  return (
    <DocsTocProvider>
      <DocsLocalNav onMenuToggle={() => setSidebarOpen((v) => !v)} />

      <div className="relative mx-auto flex max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:px-8">
        <aside className="hidden w-56 shrink-0 lg:block">
          <DocsSidebar />
        </aside>

        <aside
          className={`mobile-sidebar lg:hidden ${
            sidebarOpen ? "t-mobile-sidebar-open" : ""
          }`}
        >
          <div className="flex items-center justify-between border-b border-border/40 px-4 py-3">
            <span className="text-sm font-medium">导航</span>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="flex size-7 items-center justify-center rounded-md transition-colors hover:bg-muted"
              aria-label="关闭导航"
            >
              <X className="size-4 text-muted-foreground" />
            </button>
          </div>
          <div className="overflow-y-auto p-4">
            <MobileSidebarNav />
          </div>
        </aside>

        {children}
      </div>
    </DocsTocProvider>
  );
}