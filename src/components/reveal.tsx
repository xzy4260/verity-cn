"use client";

import * as React from "react";

/**
 * 提前触发距离。元素在进入视口之前就把动画播完，
 * 这样向下滚动时不会出现「该有内容却是空白」的区域。
 */
const PRETRIGGER_MIN = 90;

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

export function Reveal({
  children,
  className = "",
  delay = 0,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: React.ElementType;
}) {
  const ref = React.useRef<HTMLElement>(null);
  const [visible, setVisible] = React.useState(false);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const vh = window.innerHeight || document.documentElement.clientHeight || 0;
    const margin = PRETRIGGER_MIN;

    // 首屏内（含预触发区）的内容立刻显示，保证第一帧就有内容
    if (el.getBoundingClientRect().top < vh + margin) {
      setVisible(true);
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            io.disconnect();
            return;
          }
        }
      },
      { threshold: 0, rootMargin: `0px 0px ${margin}px 0px` }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  // @ts-ignore -- polymorphic tag props
  return (
    // @ts-ignore
    <Tag
      // @ts-ignore
      ref={ref}
      // @ts-ignore
      className={`reveal ${visible ? "is-visible" : ""} ${className}`}
      // @ts-ignore
      style={{ transitionDelay: `${Math.min(delay, 100)}ms` }}
    >
      {children}
    </Tag>
  );
}
