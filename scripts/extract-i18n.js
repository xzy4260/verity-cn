const fs = require("fs");
const path = require("path");

const ROOT = "D:/KUKU/web/verity-cn/";
const SRC = ROOT + "src/";
const OUT = SRC + "locales/zh-CN/";
const CJK = /[\u3400-\u9FFF]/;

/* ---------- 收集文件 ---------- */
const files = [];
function walk(d, skipDir) {
  for (const f of fs.readdirSync(d, { withFileTypes: true })) {
    const fp = path.join(d, f.name).replace(/\\/g, "/");
    if (f.isDirectory()) {
      if (skipDir && skipDir.test(fp)) continue;
      walk(fp, skipDir);
    } else if (/\.(tsx|ts)$/.test(fp)) {
      files.push(fp);
    }
  }
}
walk(SRC + "app", /\/ui$/);
walk(SRC + "components", /\/ui$/);
files.push(SRC + "lib/mirrors.ts");

/* ---------- 命名空间 ---------- */
function nsOf(fp) {
  const rel = fp.replace(SRC, "");
  let m;
  if ((m = rel.match(/^app\/docs\/(.+)\.tsx$/))) return "docs-" + m[1].replace(/\/page$/, "").replace(/\//g, "-");
  if ((m = rel.match(/^app\/(.+)\.tsx$/))) return m[1].replace(/\/page$/, "").replace(/\//g, "-");
  if ((m = rel.match(/^components\/(.+)\.tsx$/))) return "ui-" + m[1];
  if ((m = rel.match(/^lib\/(.+)\.ts$/))) return "data-" + m[1];
  return rel.replace(/[\/.]/g, "-");
}

/* ---------- 抽取 ---------- */
function extract(src) {
  const found = [];
  const spans = [];
  const litRe = /(["'`])((?:\\.|(?!\1)[^\\])*?)\1/g;
  let m;
  while ((m = litRe.exec(src))) {
    spans.push([m.index, m.index + m[0].length]);
    if (CJK.test(m[2])) found.push({ idx: m.index, text: m[2].replace(/\s+/g, " ").trim() });
  }
  const arr = src.split("");
  for (const [a, b] of spans) for (let i = a; i < b; i++) arr[i] = " ";
  let rest = arr.join("");
  rest = rest.replace(/\/\*[\s\S]*?\*\//g, (t) => " ".repeat(t.length));
  rest = rest.replace(/\/\/[^\n]*/g, (t) => " ".repeat(t.length));

  const txtRe = /[^<>{}"'`;=()\[\]|]*[\u3400-\u9FFF][^<>{}"'`;=()\[\]|]*/g;
  while ((m = txtRe.exec(rest))) {
    const t = m[0].replace(/\s+/g, " ").trim();
    if (t) found.push({ idx: m.index, text: t });
  }
  found.sort((a, b) => a.idx - b.idx);
  return found;
}

/* ---------- 输出 ---------- */
fs.mkdirSync(OUT, { recursive: true });
const summary = [];
const sources = {};
let total = 0;

for (const fp of files) {
  const src = fs.readFileSync(fp, "utf8");
  if (!CJK.test(src)) continue;
  const items = extract(src);
  if (!items.length) continue;
  const ns = nsOf(fp);
  const obj = {};
  items.forEach((it, i) => {
    const key = ns + "." + String(i + 1).padStart(3, "0");
    obj[key] = it.text;
    sources[key] = fp.replace(ROOT, "");
  });
  fs.writeFileSync(OUT + ns + ".json", JSON.stringify(obj, null, 2) + "\n", "utf8");
  summary.push(ns + " | " + items.length + " | " + fp.replace(ROOT, ""));
  total += items.length;
}

fs.writeFileSync(OUT + "_sources.json", JSON.stringify(sources, null, 2) + "\n", "utf8");
fs.writeFileSync(
  OUT + "_README.md",
  [
    "# Verity-cn 站点文案（简体中文基准）",
    "",
    "每个文件对应一个页面或一组组件，键名格式为 `<命名空间>.<序号>`，序号按文案在源文件里出现的先后排列。",
    "翻译时请保持键名不变，只替换值；`_sources.json` 记录了每个键来自哪个源文件，`_README.md` 和 `_sources.json` 本身不需要翻译。",
    "",
    "注意：被行内元素（如 `{\" \"}`、`<span>`、`<code>`）打断的句子会被拆成相邻的几个键，翻译时把它们当作同一句话处理。",
    "含占位符的文案（如 `{}`、`${}`）请保持占位符原样。",
    "",
    "| 命名空间 | 条数 | 源文件 |",
    "| --- | --- | --- |",
    ...summary.map((s) => "| " + s.split(" | ").join(" | ") + " |"),
    "",
    "合计 " + total + " 条。",
    "",
  ].join("\n"),
  "utf8"
);

console.log("namespaces=" + summary.length + " strings=" + total);
console.log(summary.join("\n"));
