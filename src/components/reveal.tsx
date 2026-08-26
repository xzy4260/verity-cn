"use client";

import * as React from "react";

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

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
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
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}
