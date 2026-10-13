import fs from "node:fs";
import path from "node:path";

/* 静态导出后修正各语言页面的 html lang 属性（根布局无法感知语言前缀） */
const OUT = "out";
const LANGS = { "zh-HK": "zh-HK", "zh-MO": "zh-MO", "lzh": "lzh", en: "en", ja: "ja" };
let n = 0;
for (const [seg, lang] of Object.entries(LANGS)) {
  const root = path.join(OUT, seg);
  if (!fs.existsSync(root)) continue;
  const walk = (d) => {
    for (const f of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, f.name);
      if (f.isDirectory()) walk(p);
      else if (f.name.endsWith(".html")) {
        const h = fs.readFileSync(p, "utf8");
        const r = h.replace('<html lang="zh-CN"', `<html lang="${lang}"`);
        if (r !== h) { fs.writeFileSync(p, r, "utf8"); n++; }
      }
    }
  };
  walk(root);
  /* 根页是 out/<seg>.html，不是目录，单独处理 */
  const flat = path.join(OUT, seg + ".html");
  if (fs.existsSync(flat)) {
    const h = fs.readFileSync(flat, "utf8");
    const r = h.replace('<html lang="zh-CN"', `<html lang="${lang}"`);
    if (r !== h) { fs.writeFileSync(flat, r, "utf8"); n++; }
  }
}
console.log(`[fix-lang] 已修正 ${n} 个页面的 html lang`);
