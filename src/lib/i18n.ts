export type LocaleCode =
  | "zh-CN"
  | "zh-HK"
  | "zh-MO"
  | "en"
  | "ja"
  | "cy"
  | "de"
  | "eo"
  | "es"
  | "fr"
  | "is"
  | "it"
  | "nl"
  | "pl"
  | "pt"
  | "sw"
  | "lzh";

export type LocaleMeta = {
  code: LocaleCode;
  /** 该语言自己的写法，切换菜单里显示这个 */
  native: string;
  /** 中文写法，用于无障碍标签 */
  zh: string;
};

export const LOCALES: LocaleMeta[] = [
  { code: "zh-CN", native: "简体中文", zh: "简体中文" },
  { code: "zh-HK", native: "繁體中文（香港）", zh: "繁体中文（香港）" },
  { code: "zh-MO", native: "繁體中文（澳門）", zh: "繁体中文（澳门）" },
  { code: "lzh", native: "文言文", zh: "文言文" },
  { code: "en", native: "English", zh: "英文" },
  { code: "ja", native: "日本語", zh: "日文" },
  { code: "cy", native: "Cymraeg", zh: "威尔士语" },
  { code: "de", native: "Deutsch", zh: "德语" },
  { code: "eo", native: "Esperanto", zh: "世界语" },
  { code: "es", native: "Español", zh: "西班牙语" },
  { code: "fr", native: "Français", zh: "法语" },
  { code: "is", native: "Íslenska", zh: "冰岛语" },
  { code: "it", native: "Italiano", zh: "意大利语" },
  { code: "nl", native: "Nederlands", zh: "荷兰语" },
  { code: "pl", native: "Polski", zh: "波兰语" },
  { code: "pt", native: "Português", zh: "葡萄牙语" },
  { code: "sw", native: "Kiswahili", zh: "斯瓦希里语" },
];

export const DEFAULT_LOCALE: LocaleCode = "zh-CN";

/** 手动选择后存在 localStorage，下次访问优先用它 */
export const LOCALE_STORAGE_KEY = "verity-locale";

export function isLocaleCode(v: string): v is LocaleCode {
  return LOCALES.some((l) => l.code === v);
}

/** 把浏览器语言标签归一到受支持的 locale；繁体按地区细分到 HK / MO */
export function matchLocale(tag: string): LocaleCode | null {
  if (!tag) return null;
  const t = tag.toLowerCase().replace(/_/g, "-");
  if (t.startsWith("zh")) {
    if (t.includes("mo")) return "zh-MO";
    if (t.includes("hk") || t.includes("tw") || t.includes("hant")) return "zh-HK";
    return "zh-CN";
  }
  if (t.startsWith("ja")) return "ja";
  if (t.startsWith("en")) return "en";
  if (t.startsWith("lzh")) return "lzh";
  if (t.startsWith("cy")) return "cy";
  if (t.startsWith("de")) return "de";
  if (t.startsWith("eo")) return "eo";
  if (t.startsWith("es")) return "es";
  if (t.startsWith("fr")) return "fr";
  if (t.startsWith("is")) return "is";
  if (t.startsWith("it")) return "it";
  if (t.startsWith("nl")) return "nl";
  if (t.startsWith("pl")) return "pl";
  if (t.startsWith("pt")) return "pt";
  if (t.startsWith("sw")) return "sw";
  return null;
}

/** 按浏览器语言优先级列表挑第一个能匹配的；都匹配不上则回落到简体中文 */
export function detectLocale(tags: readonly string[]): LocaleCode {
  for (const tag of tags) {
    const hit = matchLocale(tag);
    if (hit) return hit;
  }
  return DEFAULT_LOCALE;
}

/** 客户端读取：手动选择 > 浏览器语言 > 简体中文 */
export function resolveClientLocale(): LocaleCode {
  if (typeof window === "undefined") return DEFAULT_LOCALE;
  try {
    const saved = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    if (saved && isLocaleCode(saved)) return saved;
  } catch {
    /* 隐私模式下 localStorage 不可用，忽略 */
  }
  const tags = navigator.languages?.length ? navigator.languages : [navigator.language];
  return detectLocale(tags);
}

export function persistLocale(code: LocaleCode): void {
  try {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, code);
  } catch {
    /* 忽略 */
  }
  document.documentElement.lang = code;
}

/** 需要带语言前缀的语言；简体中文沿用无前缀 URL */
export const PREFIXED_LOCALES: LocaleCode[] = [
  "zh-HK",
  "zh-MO",
  "lzh",
  "en",
  "ja",
  "cy",
  "de",
  "eo",
  "es",
  "fr",
  "is",
  "it",
  "nl",
  "pl",
  "pt",
  "sw",
];

export function isPrefixedLocale(v: string): v is LocaleCode {
  return (PREFIXED_LOCALES as string[]).includes(v);
}

/** 拼出某个语言下的路径；简体不加前缀 */
export function localePath(locale: LocaleCode, path: string): string {
  const clean = path === "/" ? "" : path;
  return locale === DEFAULT_LOCALE ? clean || "/" : "/" + locale + clean;
}

/** 去掉路径上的语言前缀，还原成简体路径 */
export function stripLocale(pathname: string): string {
  const seg = pathname.split("/")[1];
  if (seg && isPrefixedLocale(seg)) {
    const rest = pathname.slice(seg.length + 1);
    return rest || "/";
  }
  return pathname;
}

/** Open Graph 语言代码（og:locale） */
export const OG_LOCALE: Record<LocaleCode, string> = {
  "zh-CN": "zh_CN",
  "zh-HK": "zh_HK",
  "zh-MO": "zh_MO",
  lzh: "lzh",
  en: "en_US",
  ja: "ja_JP",
  cy: "cy_GB",
  de: "de_DE",
  eo: "eo",
  es: "es_ES",
  fr: "fr_FR",
  is: "is_IS",
  it: "it_IT",
  nl: "nl_NL",
  pl: "pl_PL",
  pt: "pt_PT",
  sw: "sw_KE",
};

/** 站点正式域名 */
export const SITE_URL = "https://mod.veritycn.site";

/** 某路径在全部语言下的绝对 URL，用于 hreflang */
export function altLanguages(path: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const l of LOCALES) out[l.code] = SITE_URL + localePath(l.code, path);
  return out;
}
