"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  DEFAULT_LOCALE,
  LOCALE_STORAGE_KEY,
  detectLocale,
  localePath,
  stripLocale,
} from "@/lib/i18n";

/**
 * 简体分支专用：首次访问（没有手动选择记录）时，按浏览器语言跳到对应语言版本。
 * 已经是带前缀的路径、或用户手动选过语言，就不跳。
 */
export function LocaleAutoRedirect() {
  const pathname = usePathname();
  const router = useRouter();

  React.useEffect(() => {
    if (pathname !== stripLocale(pathname)) return;
    let saved: string | null = null;
    try {
      saved = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    } catch {
      /* 隐私模式忽略 */
    }
    if (saved) return;
    const tags = navigator.languages?.length ? navigator.languages : [navigator.language];
    const target = detectLocale(tags);
    if (target === DEFAULT_LOCALE) return;
    router.replace(localePath(target, pathname));
  }, [pathname, router]);

  return null;
}
