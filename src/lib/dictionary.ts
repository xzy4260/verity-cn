import type { LocaleCode } from "./i18n";
import zhCN from "@/locales/zh-CN";
import zhHK from "@/locales/zh-HK";
import zhMO from "@/locales/zh-MO";
import en from "@/locales/en";
import ja from "@/locales/ja";
import lzh from "@/locales/lzh";

export type Namespace = Record<string, string>;
export type Messages = Record<string, Namespace>;

const DICTS: Record<LocaleCode, Messages> = {
  "zh-CN": zhCN,
  "zh-HK": zhHK,
  "zh-MO": zhMO,
  en,
  ja,
  lzh,
};

/**
 * 会下发给客户端组件的命名空间。
 * 服务端页面用的命名空间不进这个列表，页面文字因此留在 HTML 里，不会打进 JS 包。
 */
export const CLIENT_NAMESPACES = [
  "ui-site-header",
  "ui-download-card",
  "ui-download-prereq",
  "ui-docs-image", "ui-docs-sidebar",
  "ui-docs-ui",
  "ui-toc",
  "ui-spotlight-card",
  "ui-verity-model",
  "ui-component-showcase",
  "ui-code-block",
  "ui-mode-toggle",
  "data-mirrors",
  "page",
  "docs-layout",
];

const nsOf = (key: string) => {
  const i = key.indexOf(".");
  return i < 0 ? key : key.slice(0, i);
};

/** 服务端：按语言取翻译函数，缺键回落到简体 */
export function getT(locale: LocaleCode) {
  const cur = DICTS[locale] ?? DICTS["zh-CN"];
  const base = DICTS["zh-CN"];
  return (key: string): string => {
    const ns = nsOf(key);
    return cur[ns]?.[key] ?? base[ns]?.[key] ?? key;
  };
}

/** 服务端：只取客户端组件需要的命名空间，序列化后下发给 LocaleProvider */
export function getMessages(locale: LocaleCode): Messages {
  const cur = DICTS[locale] ?? DICTS["zh-CN"];
  const base = DICTS["zh-CN"];
  const out: Messages = {};
  for (const ns of CLIENT_NAMESPACES) {
    out[ns] = { ...(base[ns] ?? {}), ...(cur[ns] ?? {}) };
  }
  return out;
}
