"use client";

import * as React from "react";

/**
 * SpotlightCard — 跟随鼠标的径向光斑卡片（Vercel / Linear 风格细节）。
 * 用在特性 Bento 区，营造"被光照到"的高级微交互；尊重 reduced-motion。
 */
export function SpotlightCard({
  icon,
  title,
  description,
  children,
  className = "",
  horizontal = false,
}: {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
  horizontal?: boolean;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [pos, setPos] = React.useState({ x: 0, y: 0 });

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      className={`group relative overflow-hidden rounded-xl border border-border/60 bg-card transition-[border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-foreground/15 ${className}`}
    >
      {/* 跟随鼠标的高光 */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(360px circle at ${pos.x}px ${pos.y}px, color-mix(in oklch, var(--foreground) 7%, transparent), transparent 70%)`,
        }}
      />
      <div
        className={`relative flex h-full gap-5 p-6 ${
          horizontal ? "flex-row items-center" : "flex-col"
        }`}
      >
        {icon && (
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
            {icon}
          </div>
        )}
        <div className={horizontal ? "min-w-0 flex-1" : "flex min-w-0 flex-col flex-1"}>
          {title && (
            <h3 className={horizontal ? "font-semibold" : "text-lg font-semibold"}>
              {title}
            </h3>
          )}
          {description && (
            <p className="mt-2 text-sm text-muted-foreground">{description}</p>
          )}
          {children && <div className="mt-auto pt-5">{children}</div>}
        </div>
      </div>
    </div>
  );
}
