# Verity-cn 站点文案（简体中文基准）

每个文件对应一个页面或一组组件，键名格式为 `<命名空间>.<序号>`，序号按文案在源文件里出现的先后排列。
翻译时请保持键名不变，只替换值；`_sources.json` 记录了每个键来自哪个源文件，`_README.md` 和 `_sources.json` 本身不需要翻译。

注意：被行内元素（如 `{" "}`、`<span>`、`<code>`）打断的句子会被拆成相邻的几个键，翻译时把它们当作同一句话处理。
含占位符的文案（如 `{}`、`${}`）请保持占位符原样。

## 不要翻译的内容

以下内容必须原样保留，**不要翻译、不要加空格、不要转换繁简**：

- **网址与域名**：例如 `https://ghf.无名氏.top/` 中的「无名氏」是域名的一部分，繁体、英文、日文版都必须写成 `无名氏`，不能改成「無名氏 / Anonymous / 匿名」。
- **命令、路径、文件名**、代码标识符。
- **占位符**：如 `{}`、`${}`、`%s` 等保持原样。
- **产品名与专有名词**：如 Minecraft、Forge、Verity-cn、HMCL、PCL2 等保持原文。

| 命名空间 | 条数 | 源文件 |
| --- | --- | --- |
| changelog | 878 | src/components/views/changelog.tsx |
| credits | 34 | src/app/credits/page.tsx |
| data-mirrors | 16 | src/lib/mirrors.ts |
| docs-ai-errors | 37 | src/app/docs/ai-errors/page.tsx |
| docs-commands | 35 | src/app/docs/commands/page.tsx |
| docs-concepts | 30 | src/app/docs/concepts/page.tsx |
| docs-free-llm | 31 | src/app/docs/free-llm/page.tsx |
| docs-gameplay | 37 | src/app/docs/gameplay/page.tsx |
| docs-instance | 79 | src/app/docs/instance/page.tsx |
| docs-layout | 2 | src/app/docs/layout.tsx |
| docs-ncm-music | 31 | src/app/docs/ncm-music/page.tsx |
| docs-play | 64 | src/app/docs/play/page.tsx |
| docs-verity-config | 67 | src/app/docs/verity-config/page.tsx |
| download | 25 | src/app/download/page.tsx |
| layout | 7 | src/app/layout.tsx |
| page | 102 | src/app/page.tsx |
| ui-code-block | 1 | src/components/code-block.tsx |
| ui-component-showcase | 20 | src/components/component-showcase.tsx |
| ui-docs-image | 7 | src/components/docs-image.tsx |
| ui-docs-sidebar | 12 | src/components/docs-sidebar.tsx |
| ui-docs-ui | 12 | src/components/docs-ui.tsx |
| ui-download-card | 56 | src/components/download-card.tsx |
| ui-download-prereq | 7 | src/components/download-prereq.tsx |
| ui-mode-toggle | 1 | src/components/mode-toggle.tsx |
| ui-site-header | 8 | src/components/site-header.tsx |
| ui-spotlight-card | 1 | src/components/spotlight-card.tsx |
| ui-toc | 1 | src/components/toc.tsx |
| ui-verity-model | 10 | src/components/verity-model.tsx |
