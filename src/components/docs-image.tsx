"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ExternalLink, RotateCcw, X, ZoomIn, ZoomOut } from "lucide-react";
import { useT } from "@/components/locale-provider";

const ZMIN = 1;
const ZMAX = 4;
const ZSTEP = 0.5;
const WSTEP = 0.2;
const DRAG_MIN = 56; // 图片全貌时也允许拖拽的余量
const OVERSHOOT = 80; // 拖拽时最多能超出多少
const RUBBER = 0.35; // 超出部分的阻尼系数
const BTN =
  "inline-flex size-9 items-center justify-center rounded-full border bg-background/70 text-foreground backdrop-blur transition hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-40";

type Item = { src: string; alt: string };
type Pt = { x: number; y: number };

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/** 文档配图：正文宽度铺满，点击进入全屏查看器 */
export function DocsImage({
  src,
  alt,
  w = 854,
  h = 480,
}: {
  src: string;
  alt: string;
  w?: number;
  h?: number;
}) {
  const t = useT();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [cur, setCur] = useState<Item>({ src: "", alt: "" });
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState<Pt>({ x: 0, y: 0 });
  const [anim, setAnim] = useState(true);
  const [dragging, setDragging] = useState(false);
  const [flip, setFlip] = useState<{ dx: number; dy: number; s: number } | null>(null);
  const [closing, setClosing] = useState(false);
  const thumbRef = useRef<HTMLElement | null>(null);

  const stageRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const size = useRef({ cw: 0, ch: 0, dw: 0, dh: 0 });
  const zoomRef = useRef(1);
  const panRef = useRef<Pt>({ x: 0, y: 0 });
  const ptrs = useRef(new Map<number, Pt>());
  const gest = useRef<Record<string, number | string> | null>(null);
  const movedRef = useRef(false);

  useEffect(() => setMounted(true), []);

  /* 真实裁切量：图片完整可见时为 0（此时平移必须归零居中） */
  const overflow = useCallback((z?: number) => {
    const s = size.current;
    const zz = z ?? zoomRef.current;
    return {
      x: Math.max(0, (s.dw * zz - s.cw) / 2),
      y: Math.max(0, (s.dh * zz - s.ch) / 2),
    };
  }, []);

  const apply = useCallback((p: Pt, animate: boolean) => {
    panRef.current = p;
    setAnim(animate);
    setPan(p);
  }, []);

  /* 超出范围时阻尼拖拽，松手弹回 */
  const rubber = useCallback((v: number, limit: number) => {
    const a = Math.abs(v);
    if (a <= limit) return v;
    return Math.sign(v) * (limit + Math.min((a - limit) * RUBBER, OVERSHOOT));
  }, []);

  const settle = useCallback(() => {
    const o = overflow();
    apply({ x: clamp(panRef.current.x, -o.x, o.x), y: clamp(panRef.current.y, -o.y, o.y) }, true);
  }, [apply, overflow]);

  const flipTo = useCallback((r: DOMRect) => {
    const im = imgRef.current;
    if (!im) return null;
    const cr = im.getBoundingClientRect();
    if (!cr.width || !cr.height) return null;
    return {
      dx: r.left + r.width / 2 - (cr.left + cr.width / 2),
      dy: r.top + r.height / 2 - (cr.top + cr.height / 2),
      s: r.width / cr.width,
    };
  }, []);

  const measure = useCallback(() => {
    const el = stageRef.current;
    const im = imgRef.current;
    if (!el || !im) return;
    size.current = { cw: el.clientWidth, ch: el.clientHeight, dw: im.offsetWidth, dh: im.offsetHeight };
  }, []);

  /* 以某个屏幕点为锚点缩放，保证该点下的像素不动 */
  const zoomAt = useCallback(
    (next: number, cx?: number, cy?: number) => {
      const el = stageRef.current;
      const z2 = clamp(next, ZMIN, ZMAX);
      const z1 = zoomRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const c = { x: (cx ?? r.left + r.width / 2) - r.left - r.width / 2, y: (cy ?? r.top + r.height / 2) - r.top - r.height / 2 };
      const p = panRef.current;
      const ix = (c.x - p.x) / z1;
      const iy = (c.y - p.y) / z1;
      zoomRef.current = z2;
      setZoom(z2);
      const o = overflow(z2);
      apply({ x: clamp(c.x - ix * z2, -o.x, o.x), y: clamp(c.y - iy * z2, -o.y, o.y) }, true);
    },
    [apply, overflow]
  );

  const reset = useCallback(() => {
    zoomRef.current = 1;
    setZoom(1);
    apply({ x: 0, y: 0 }, true);
  }, [apply]);

  const openAt = useCallback((el: HTMLElement) => {
    thumbRef.current = el;
    setClosing(false);
    setCur({ src: el.dataset.src ?? "", alt: el.dataset.alt ?? "" });
    zoomRef.current = 1;
    panRef.current = { x: 0, y: 0 };
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setAnim(true);
    setOpen(true);
  }, []);

  const close = useCallback(() => {
    if (closing) return;
    const r = thumbRef.current?.getBoundingClientRect();
    const f = r && r.bottom > 0 && r.top < window.innerHeight && r.width > 0 ? flipTo(r) : null;
    setClosing(true);
    if (f) {
      setAnim(true);
      setFlip(f);
    }
    window.setTimeout(
      () => {
        setOpen(false);
        setClosing(false);
        setFlip(null);
        setAnim(true);
        zoomRef.current = 1;
        panRef.current = { x: 0, y: 0 };
        setZoom(1);
        setPan({ x: 0, y: 0 });
      },
      f ? 320 : 180
    );
  }, [closing, flipTo]);

  /* 滚轮缩放（非被动，阻止页面滚动） */
  useEffect(() => {
    const el = stageRef.current;
    if (!open || !el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      zoomAt(zoomRef.current + (e.deltaY > 0 ? -WSTEP : WSTEP), e.clientX, e.clientY);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [open, zoomAt]);

  /* 键盘 */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "+" || e.key === "=") zoomAt(zoomRef.current + ZSTEP);
      else if (e.key === "-") zoomAt(zoomRef.current - ZSTEP);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close, zoomAt]);

  /* 打开：先把图片摆到缩略图的位置，下一帧再动画到适配位置 */
  useEffect(() => {
    if (!open) return;
    let raf1 = 0;
    let raf2 = 0;
    raf1 = requestAnimationFrame(() => {
      measure();
      const r = thumbRef.current?.getBoundingClientRect();
      const f = r ? flipTo(r) : null;
      if (!f) return;
      setAnim(false);
      setFlip(f);
      raf2 = requestAnimationFrame(() => {
        setAnim(true);
        setFlip(null);
      });
    });
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      window.removeEventListener("resize", measure);
    };
  }, [open, measure, flipTo]);

  /* 打开期间锁定背景滚动 */
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = stageRef.current;
    if (!el) return;
    ptrs.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    el.setPointerCapture(e.pointerId);
    if (ptrs.current.size === 1) {
      movedRef.current = false;
      setDragging(true);
      gest.current = { mode: "pan", sx: e.clientX, sy: e.clientY, px: panRef.current.x, py: panRef.current.y };
    } else if (ptrs.current.size === 2) {
      const [a, b] = [...ptrs.current.values()];
      gest.current = {
        mode: "pinch",
        dist: Math.hypot(a.x - b.x, a.y - b.y),
        zoom: zoomRef.current,
        px: panRef.current.x,
        py: panRef.current.y,
        cx: (a.x + b.x) / 2,
        cy: (a.y + b.y) / 2,
      };
    }
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!ptrs.current.has(e.pointerId)) return;
    ptrs.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const g = gest.current;
    const el = stageRef.current;
    if (!g || !el) return;

    if (g.mode === "pan" && ptrs.current.size === 1) {
      const dx = e.clientX - (g.sx as number);
      const dy = e.clientY - (g.sy as number);
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) movedRef.current = true;
      const o = overflow();
      apply({ x: rubber((g.px as number) + dx, o.x + DRAG_MIN), y: rubber((g.py as number) + dy, o.y + DRAG_MIN) }, false);
      return;
    }

    if (g.mode === "pinch" && ptrs.current.size >= 2) {
      const [a, b] = [...ptrs.current.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y) || 1;
      const z2 = clamp((g.zoom as number) * (dist / (g.dist as number)), ZMIN, ZMAX);
      const r = el.getBoundingClientRect();
      const c = { x: (a.x + b.x) / 2 - r.left - r.width / 2, y: (a.y + b.y) / 2 - r.top - r.height / 2 };
      const c0 = { x: (g.cx as number) - r.left - r.width / 2, y: (g.cy as number) - r.top - r.height / 2 };
      const ix = (c0.x - (g.px as number)) / (g.zoom as number);
      const iy = (c0.y - (g.py as number)) / (g.zoom as number);
      zoomRef.current = z2;
      setZoom(z2);
      const o = overflow(z2);
      apply({ x: clamp(c.x - ix * z2, -o.x, o.x), y: clamp(c.y - iy * z2, -o.y, o.y) }, false);
    }
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    ptrs.current.delete(e.pointerId);
    if (ptrs.current.size === 0) {
      gest.current = null;
      setDragging(false);
      settle();
    } else if (ptrs.current.size === 1) {
      const [a] = [...ptrs.current.values()];
      gest.current = { mode: "pan", sx: a.x, sy: a.y, px: panRef.current.x, py: panRef.current.y };
      settle();
    }
  };

  const cursor = dragging ? "cursor-grabbing" : "cursor-grab";
  const cropped = (() => {
    const z = size.current;
    return z.dw * zoom > z.cw + 1 || z.dh * zoom > z.ch + 1;
  })();
  const canReset = zoom > ZMIN || cropped;
  const shift = flip ?? { dx: 0, dy: 0, s: 1 };

  return (
    <>
      <button
        type="button"
        data-docs-image
        data-src={src}
        data-alt={alt}
        onClick={(e) => openAt(e.currentTarget)}
        aria-label={alt}
        className="block w-full cursor-zoom-in rounded-xl shadow-sm outline-none focus:outline-none focus-visible:outline-none"
      >
        <Image src={src} alt={alt} width={w} height={h} draggable={false} className="h-auto w-full" />
      </button>

      {open && mounted && cur
        ? createPortal(
            <div
              className={`docview-backdrop fixed inset-0 z-[120] flex flex-col bg-background/85 backdrop-blur-xl ${closing ? "is-closing" : ""}`}
              role="dialog"
              aria-modal="true"
              aria-label={cur.alt}
              onClick={close}
            >
              <div className="flex items-center gap-3 border-b px-3 py-2 sm:px-5 sm:py-3" onClick={(e) => e.stopPropagation()}>
                <p className="min-w-0 flex-1 truncate text-sm text-muted-foreground">{cur.alt}</p>
                <div className="flex shrink-0 items-center gap-1.5">
                  <button type="button" className={BTN} aria-label={t("ui-docs-image.005")} disabled={zoom <= ZMIN} onClick={() => zoomAt(zoomRef.current - ZSTEP)}>
                    <ZoomOut className="size-4" />
                  </button>
                  <span className="w-10 text-center text-xs tabular-nums text-muted-foreground">{Math.round(zoom * 100)}%</span>
                  <button type="button" className={BTN} aria-label={t("ui-docs-image.004")} disabled={zoom >= ZMAX} onClick={() => zoomAt(zoomRef.current + ZSTEP)}>
                    <ZoomIn className="size-4" />
                  </button>
                  <button type="button" className={BTN} aria-label={t("ui-docs-image.006")} disabled={!canReset} onClick={reset}>
                    <RotateCcw className="size-4" />
                  </button>
                  <a className={BTN} aria-label={t("ui-docs-image.007")} href={cur.src} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>
                    <ExternalLink className="size-4" />
                  </a>
                  <button type="button" className={BTN} aria-label={t("ui-docs-image.001")} onClick={close}>
                    <X className="size-4" />
                  </button>
                </div>
              </div>

              <div
                ref={stageRef}
                className={`docview-stage relative flex min-h-0 flex-1 touch-none items-center justify-center overflow-hidden p-4 select-none ${cursor}`}
                onClick={(e) => e.stopPropagation()}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  ref={imgRef}
                  src={cur.src}
                  alt={cur.alt}
                  draggable={false}
                  onDragStart={(e) => e.preventDefault()}
                  onLoad={measure}
                  onClick={() => {
                    if (movedRef.current) return;
                    zoomAt(zoomRef.current > 1 ? 1 : 2);
                  }}
                  style={{
                    transform: `translate3d(${pan.x + shift.dx}px, ${pan.y + shift.dy}px, 0) scale(${zoom * shift.s})`,
                    transition: anim ? "transform 320ms cubic-bezier(0.22, 1, 0.36, 1)" : "none",
                  }}
                  className="docview-panel max-h-full max-w-full rounded-lg object-contain shadow-2xl"
                />
              </div>
            </div>,
            document.body
          )
        : null}
    </>
  );
}
