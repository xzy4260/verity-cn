"use client";

import * as React from "react";
import { useDocsTocItems } from "@/components/docs-toc";

interface TocItem {
  id: string;
  label: string;
  n?: number;
}

/** 悬浮导航高度 + 间距，滚动时留出偏移 */
const HEADER_OFFSET = 136;

export function Toc({ items: itemsProp }: { items?: TocItem[] }) {
  const ctxItems = useDocsTocItems();
  // 未传 items 时自动读取 DocsTocProvider 中注册的 Step
  const items: TocItem[] = React.useMemo(
    () => (itemsProp ?? ctxItems ?? []) as TocItem[],
    [itemsProp, ctxItems]
  );

  const [active, setActive] = React.useState(items[0]?.id ?? "");

  // 滚动高亮
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        }
      },
      {
        // 顶部留出导航高度，底部留 60%，让当前阅读的 section 保持高亮
        rootMargin: `-${HEADER_OFFSET}px 0% -60% 0%`,
        threshold: 0,
      }
    );

    items.forEach((it) => {
      const el = document.getElementById(it.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  // 点击平滑滚动 + 模糊动画
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;

    // 计算目标位置（减去导航高度偏移）
    const y = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;

    window.scrollTo({ top: y, behavior: "smooth" });

    // 给目标 section 加模糊→清晰动画
    el.classList.add("toc-highlight");
    el.addEventListener(
      "animationend",
      () => el.classList.remove("toc-highlight"),
      { once: true }
    );

    // 更新 URL hash 不跳转
    history.replaceState(null, "", `#${id}`);
    setActive(id);
  };

  return (
    <aside className="hidden w-48 shrink-0 xl:block">
      <div className="sticky top-20 text-sm">
        <p className="mb-3 font-medium text-muted-foreground">本页目录</p>
        <ul className="space-y-1.5">
          {items.map((it) => (
            <li key={it.id}>
              <a
                href={`#${it.id}`}
                onClick={(e) => handleClick(e, it.id)}
                className={`flex items-center gap-1.5 border-l-2 py-0.5 pl-3 transition-colors duration-200 hover:text-foreground ${
                  active === it.id
                    ? "border-primary font-medium text-foreground"
                    : "border-transparent text-muted-foreground"
                }`}
              >
                {typeof it.n === "number" && (
                  <span className="inline-flex size-4 shrink-0 items-center justify-center rounded-full border border-border text-[10px] leading-none">
                    {it.n}
                  </span>
                )}
                <span className="block">{it.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
