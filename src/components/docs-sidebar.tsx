"use client";

import { useLocale, useT } from "@/components/locale-provider";
import Link from "next/link";
import { localePath } from "@/lib/i18n";
import { usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";


export function DocsSidebar() {
  const locale = useLocale();
  const t = useT();
  const sidebarGroups = [
    {
      title: t("ui-docs-sidebar.001"),
      items: [
        { href: "/docs/play", label: t("ui-docs-sidebar.002") },
        { href: "/docs/instance", label: t("ui-docs-sidebar.003") },
        { href: "/docs/verity-config", label: t("ui-docs-sidebar.004") },
        { href: "/docs/gameplay", label: t("ui-docs-sidebar.005") },
      ],
    },
    {
      title: t("ui-docs-sidebar.006"),
      items: [
        { href: "/docs/concepts", label: t("ui-docs-sidebar.007") },
        { href: "/docs/free-llm", label: t("ui-docs-sidebar.008") },
        { href: "/docs/ncm-music", label: t("ui-docs-sidebar.009") },
        { href: "/docs/commands", label: t("ui-docs-sidebar.010") },
        { href: "/docs/ai-errors", label: t("ui-docs-sidebar.011") },
      ],
    },
  ];

  const pathname = usePathname();

  return (
    <div className="sticky top-20 space-y-6">
      <Button variant="ghost" size="sm" className="gap-1" render={<Link href={localePath(locale, "/")} />}>
        <ArrowLeft className="size-3" />{t("ui-docs-sidebar.012")}</Button>
      {sidebarGroups.map((g) => (
        <div key={g.title}>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {g.title}
          </p>
          <nav className="flex flex-col gap-0.5">
            {g.items.map((item) => {
              const isActive = pathname === localePath(locale, item.href);
              return (
                <Link
                  key={item.href}
                  href={localePath(locale, item.href)}
                  className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                    isActive
                      ? "bg-muted font-medium text-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      ))}
    </div>
  );
}
