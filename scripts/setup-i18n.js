const fs = require("fs");
const path = require("path");
const R = "D:/KUKU/web/verity-cn/";
const IN = "D:/KUKU/web/locales-in/";
const OUT = R + "src/locales/";
const CODES = ["zh-CN", "zh-HK", "zh-MO", "en", "ja"];
const log = [];

/* 1. 简体基准已经在 src/locales/zh-CN，其余从解包目录拷入 */
for (const c of CODES) {
  if (c === "zh-CN") continue;
  const src = IN + c + "/" + c + "/";
  const dst = OUT + c + "/";
  fs.mkdirSync(dst, { recursive: true });
  let n = 0;
  for (const f of fs.readdirSync(src)) {
    if (!f.endsWith(".json") || f.startsWith("_")) continue;
    fs.copyFileSync(src + f, dst + f);
    n++;
  }
  log.push("copied " + c + " -> " + n + " files");
}

/* 2. 每个语言生成 index.ts（供运行时按命名空间取用） */
for (const c of CODES) {
  const dir = OUT + c + "/";
  const nss = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json") && !f.startsWith("_"))
    .map((f) => f.replace(/\.json$/, ""))
    .sort();
  const lines = [
    "// 由 scripts/setup-i18n.js 生成，请勿手改",
    ...nss.map((ns, i) => 'import ns' + i + ' from "./' + ns + '.json";'),
    "",
    "const dict: Record<string, Record<string, string>> = {",
    ...nss.map((ns, i) => '  "' + ns + '": ns' + i + " as Record<string, string>,"),
    "};",
    "",
    "export default dict;",
    "",
  ];
  fs.writeFileSync(dir + "index.ts", lines.join("\n"), "utf8");
  log.push("index " + c + " -> " + nss.length + " namespaces");
}

/* 3. tsconfig 需要 resolveJsonModule */
{
  const p = R + "tsconfig.json";
  const raw = fs.readFileSync(p, "utf8");
  const j = JSON.parse(raw);
  j.compilerOptions = j.compilerOptions || {};
  if (!j.compilerOptions.resolveJsonModule) {
    j.compilerOptions.resolveJsonModule = true;
    fs.writeFileSync(p, JSON.stringify(j, null, 2) + "\n", "utf8");
    log.push("tsconfig: resolveJsonModule=true 已写入");
  } else {
    log.push("tsconfig: resolveJsonModule 已存在");
  }
}

console.log(log.join("\n"));
console.log("=== src/locales 目录 ===");
for (const c of CODES) {
  const d = OUT + c + "/";
  console.log(c + ": " + fs.readdirSync(d).length + " 个文件");
}
