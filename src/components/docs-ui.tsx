"use client";

import React from "react";
import Link from "next/link";
import { Menu, ChevronUp, Info, TriangleAlert, PartyPopper } from "lucide-react";
import { usePathname } from "next/navigation";
import { useDocsToc, useDocsTocItems } from "@/components/docs-toc";

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

/** 移动端侧边栏：带滑动指示器的导航链接 */
export function MobileSidebarNav() {
  const pathname = usePathname();
  const listRef = React.useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = React.useState({ top: 0, height: 0, visible: false });

  // 计算指示器位置
  React.useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const active = list.querySelector("[data-active=true]") as HTMLElement | null;
    if (active) {
      setIndicator({
        top: active.offsetTop,
        height: active.offsetHeight,
        visible: true,
      });
    } else {
      setIndicator((prev) => ({ ...prev, visible: false }));
    }
  }, [pathname]);

  return (
    <div ref={listRef} className="relative">
      {/* 滑动指示器 */}
      <div
        aria-hidden
        className="sidebar-pill"
        style={{
          transform: `translateY(${indicator.top}px)`,
          height: indicator.height,
          opacity: indicator.visible ? 1 : 0,
        }}
      />
            {sidebarGroups.map((g) => (
        <div key={g.title} className="mb-5">
          <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60">
            {g.title}
          </p>
          <nav className="flex flex-col gap-0.5">
            {g.items.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  data-active={isActive ? "true" : "false"}
                  className={`sidebar-link relative z-10 flex items-center rounded-lg px-3 py-2 text-sm transition-colors duration-200 ${
                    isActive
                      ? "font-medium text-foreground"
                      : "text-muted-foreground hover:text-foreground"
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

/** VitePress 风格移动端本地导航栏：Menu 按钮 + 本页目录下拉 */
export function DocsLocalNav({
  onMenuToggle,
}: {
  onMenuToggle: () => void;
}) {
  const items = useDocsTocItems();
  const [outlineOpen, setOutlineOpen] = React.useState(false);
  const [activeId, setActiveId] = React.useState(items[0]?.id ?? "");
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // 滚动高亮
  React.useEffect(() => {
    if (!items.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActiveId(e.target.id);
        }
      },
      { rootMargin: "-80px 0% -60% 0%", threshold: 0 }
    );
    items.forEach((it) => {
      const el = document.getElementById(it.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [items]);

  // 点击外部关闭
  React.useEffect(() => {
    if (!outlineOpen) return;
    const onClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOutlineOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [outlineOpen]);

  // 移动端 TOC 点击：平滑滚动 + 模糊→清晰动画
  const handleTocClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 136;
    window.scrollTo({ top: y, behavior: "smooth" });
    el.classList.add("toc-highlight");
    el.addEventListener("animationend", () => el.classList.remove("toc-highlight"), { once: true });
    history.replaceState(null, "", `#${id}`);
    setOutlineOpen(false);
  };

  return (
    <div className="local-nav lg:hidden">
      <div className="local-nav-inner">
        {/* Menu 按钮 */}
        <button
          type="button"
          onClick={onMenuToggle}
          className="local-nav-btn"
        >
          <Menu className="size-4" />
          <span>Menu</span>
        </button>

        {/* 本页目录下拉 */}
        {items.length > 0 && (
          <div ref={dropdownRef} className="relative ml-auto">
            <button
              type="button"
              onClick={() => setOutlineOpen((v) => !v)}
              className="local-nav-btn"
            >
              <span>本页目录</span>
              <ChevronUp
                className={`size-3.5 transition-transform duration-200 ${
                  outlineOpen ? "" : "rotate-180"
                }`}
              />
            </button>
            {outlineOpen && (
              <div className="toc-glass-dropdown">
                <nav className="flex flex-col gap-0.5 py-2">
                  {items.map((it, i) => (
                    <a
                      key={it.id}
                      href={`#${it.id}`}
                      onClick={(e) => handleTocClick(e, it.id)}
                      className="toc-glass-item"
                      style={{
                        animationDelay: `${i * 30}ms`,
                      }}
                    >
                      {typeof it.n === "number" && (
                        <span className={`inline-flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-medium leading-none transition-colors duration-200 ${
                          activeId === it.id
                            ? "bg-primary text-primary-foreground"
                            : "border border-border/60 text-foreground"
                        }`}>
                          {it.n}
                        </span>
                      )}
                      <span className={`transition-colors duration-200 ${
                        activeId === it.id ? "font-semibold text-foreground" : "text-foreground/80"
                      }`}>
                        {it.label}
                      </span>
                    </a>
                  ))}
                </nav>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/** 文档编号步骤块 */
export function Step({
  n,
  id,
  title,
  children,
}: {
  n: number;
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  const toc = useDocsToc();

  React.useEffect(() => {
    if (!toc) return;
    toc.register({ id, label: title, n });
    return () => toc.unregister(id);
  }, [toc, id, title, n]);

  return (
    <section id={id} className="relative scroll-mt-24 pl-12">
      <div className="absolute left-0 top-0 flex size-8 items-center justify-center rounded-full border border-border bg-background text-sm font-semibold">
        {n}
      </div>
      <h2 className="pt-1 text-lg font-semibold">{title}</h2>
      <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground">
        {children}
      </div>
    </section>
  );
}

/** 文档小节（无编号） */
export function DocSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  const toc = useDocsToc();

  React.useEffect(() => {
    if (!toc) return;
    toc.register({ id, label: title });
    return () => toc.unregister(id);
  }, [toc, id, title]);

  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground">
        {children}
      </div>
    </section>
  );
}

/** 提示框 */
export function Callout({
  tone,
  children,
}: {
  tone: "info" | "warn" | "success";
  children: React.ReactNode;
}) {
  const styles = {
    info: "border-border bg-muted/40",
    warn: "border-amber-500/30 bg-amber-500/10",
    success: "border-emerald-500/30 bg-emerald-500/10",
  }[tone];
  const Icon = { info: Info, warn: TriangleAlert, success: PartyPopper }[tone];
  const color = {
    info: "text-muted-foreground",
    warn: "text-amber-600 dark:text-amber-400",
    success: "text-emerald-600 dark:text-emerald-400",
  }[tone];
  return (
    <div className={`flex gap-3 rounded-xl border p-4 ${styles}`}>
      <Icon className={`mt-0.5 size-4 shrink-0 ${color}`} />
      <div className={`text-sm leading-relaxed ${color}`}>{children}</div>
    </div>
  );
}
