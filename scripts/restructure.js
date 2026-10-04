const fs = require("fs");
const path = require("path");
const R = "D:/KUKU/web/verity-cn/";
const APP = R + "src/app/";
const VIEWS = R + "src/components/views/";
const log = [];
fs.mkdirSync(VIEWS, { recursive: true });

const pages = [
  { p: "page.tsx", v: "home" },
  { p: "download/page.tsx", v: "download" },
  { p: "changelog/page.tsx", v: "changelog" },
  { p: "credits/page.tsx", v: "credits" },
  { p: "docs/page.tsx", v: "docs-index" },
  { p: "docs/ai-errors/page.tsx", v: "docs-ai-errors" },
  { p: "docs/commands/page.tsx", v: "docs-commands" },
  { p: "docs/concepts/page.tsx", v: "docs-concepts" },
  { p: "docs/free-llm/page.tsx", v: "docs-free-llm" },
  { p: "docs/gameplay/page.tsx", v: "docs-gameplay" },
  { p: "docs/instance/page.tsx", v: "docs-instance" },
  { p: "docs/ncm-music/page.tsx", v: "docs-ncm-music" },
  { p: "docs/play/page.tsx", v: "docs-play" },
  { p: "docs/verity-config/page.tsx", v: "docs-verity-config" },
];

const pascal = (s) => s.split("-").map((x) => x[0].toUpperCase() + x.slice(1)).join("");

for (const { p, v } of pages) {
  let src = fs.readFileSync(APP + p, "utf8");
  const eol = src.includes("\r\n") ? "\r\n" : "\n";
  let meta = "";
  const mi = src.indexOf("export const metadata");
  if (mi >= 0) {
    const end = src.indexOf("\n};", mi);
    meta = src.slice(mi, end + 3).trim();
    src = (src.slice(0, mi) + src.slice(end + 3)).replace(/\n{3,}/g, "\n\n");
  }
  const name = pascal(v) + "View";
  const before = src;
  let body = src.replace(
    /export default (async )?function\s+\w+\s*\(\s*\)\s*\{/,
    "export function " + name + "({ locale }: { locale: LocaleCode }) {"
  );
  if (body === before) {
    body = src.replace(
      /export default (async )?function\s+\w+\s*\([^)]*\)\s*\{/,
      "export function " + name + "({ locale }: { locale: LocaleCode }) {"
    );
  }
  if (body === before) log.push("!! 未改名 " + p);

  const importLine = 'import type { LocaleCode } from "@/lib/i18n";';
  if (!body.includes(importLine)) {
    if (/^\s*"use client";/.test(body)) {
      body = body.replace(/^(\s*"use client";\s*\r?\n)/, "$1" + importLine + eol);
    } else {
      body = importLine + eol + body;
    }
  }
  fs.writeFileSync(VIEWS + v + ".tsx", body, "utf8");

  const zhWrapper =
    (meta ? meta + eol + eol : "") +
    'import { ' + name + ' } from "@/components/views/' + v + '";' +
    eol + eol +
    "export default function Page() {" + eol +
    '  return <' + name + ' locale="zh-CN" />;' + eol +
    "}" + eol;
  fs.writeFileSync(APP + p, zhWrapper, "utf8");

  const dir = APP + "[locale]/" + path.dirname(p);
  fs.mkdirSync(dir, { recursive: true });
  const locWrapper =
    'import { notFound } from "next/navigation";' + eol +
    'import { isLocaleCode, isPrefixedLocale } from "@/lib/i18n";' + eol +
    'import { ' + name + ' } from "@/components/views/' + v + '";' + eol + eol +
    "export default async function Page({" + eol +
    "  params," + eol +
    "}: {" + eol +
    "  params: Promise<{ locale: string }>;" + eol +
    "}) {" + eol +
    "  const { locale } = await params;" + eol +
    "  if (!isLocaleCode(locale) || !isPrefixedLocale(locale)) notFound();" + eol +
    "  return <" + name + " locale={locale} />;" + eol +
    "}" + eol;
  fs.writeFileSync(dir + "/page.tsx", locWrapper, "utf8");

  log.push(v + " -> " + name + (meta ? " [+metadata]" : ""));
}
console.log(log.join("\n"));
console.log("views=" + fs.readdirSync(VIEWS).length);
