"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const sidebarGroups = [
  {
    title: "新手教程",
    items: [
      { href: "/docs/play", label: "如何游玩 Minecraft" },
      { href: "/docs/instance", label: "配置并启动实例" },
      { href: "/docs/verity-config", label: "Verity 初始化配置" },
      { href: "/docs/gameplay", label: "游玩 Verity" },
    ],
  },
  {
    title: "进阶",
    items: [
      { href: "/docs/concepts", label: "基础概念" },
      { href: "/docs/free-llm", label: "如何使用免费 LLM" },
      { href: "/docs/ncm-music", label: "如何使用网易云音乐" },
      { href: "/docs/commands", label: "指令解读" },
      { href: "/docs/ai-errors", label: "AI 错误码解析" },
    ],
  },
];

export function DocsSidebar() {
  const pathname = usePathname();

  return (
    <div className="sticky top-20 space-y-6">
      <Button variant="ghost" size="sm" className="gap-1" render={<Link href="/" />}>
        <ArrowLeft className="size-3" />
        返回首页
      </Button>
      {sidebarGroups.map((g) => (
        <div key={g.title}>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {g.title}
          </p>
          <nav className="flex flex-col gap-0.5">
            {g.items.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
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
