#!/usr/bin/env python3
"""模型库校验：结构（JSON Schema）+ 语义规则。

CI 入口，失败时以非零码退出。本地可直接 `python scripts/check_catalog.py`。
"""
import json
import os
import re
import sys

try:
    import yaml
    from jsonschema import Draft202012Validator, FormatChecker
except ImportError:
    sys.exit("需要 pyyaml 与 jsonschema：pip install pyyaml jsonschema")

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CATALOG = os.path.join(ROOT, "public", "models.yaml")
SCHEMA = os.path.join(ROOT, "model-catalog.schema.json")


def main():
    catalog = yaml.safe_load(open(CATALOG, encoding="utf-8"))
    schema = json.load(open(SCHEMA, encoding="utf-8"))

    errors = []

    validator = Draft202012Validator(schema, format_checker=FormatChecker())
    for e in sorted(validator.iter_errors(catalog), key=lambda x: list(x.path)):
        path = ".".join(str(p) for p in e.path) or "<root>"
        errors.append(f"{path}: {e.message}")

    models = catalog.get("models") or []
    seen = set()
    for m in models:
        mid = m.get("id", "?")
        if mid in seen:
            errors.append(f"{mid}: id 重复")
        seen.add(mid)

        src = m.get("source") or {}
        mode = src.get("mode")
        if mode == "repository":
            if not src.get("platforms"):
                errors.append(f"{mid}: 仓库模式缺少 platforms")
            if "files" in m or "size" in m:
                errors.append(f"{mid}: 仓库模式不应带 files/size")
            default = src.get("default_download_platform")
            if default and default not in src.get("platforms", {}):
                errors.append(f"{mid}: default_download_platform 不在已配置平台中")
        elif mode == "custom":
            if "platforms" in src:
                errors.append(f"{mid}: 自定义源不应带 platforms")
            if "file_selection" in m:
                errors.append(f"{mid}: 自定义源不应带 file_selection")
            for f in src.get("files") or []:
                fid = f.get("id", "?")
                for key in ("download_url", "sha256", "size_bytes"):
                    if not f.get(key):
                        errors.append(f"{mid}/{fid}: 缺少 {key}")
        else:
            errors.append(f"{mid}: source.mode 非法（{mode}）")

        if m.get("type") == "llm":
            lim = m.get("limits") or {}
            ctx = lim.get("context_length")
            if not isinstance(ctx, int) or ctx <= 0:
                errors.append(f"{mid}: limits.context_length 必须为正整数")
            gen = m.get("generation") or {}
            defaults = gen.get("defaults") or {}
            if not defaults.get("max_new_tokens"):
                errors.append(f"{mid}: 缺少 generation.defaults.max_new_tokens")
            if not gen.get("stop"):
                errors.append(f"{mid}: 缺少 generation.stop")
            mx = lim.get("max_output_tokens")
            if isinstance(mx, int) and defaults.get("max_new_tokens", 0) > mx:
                errors.append(f"{mid}: max_new_tokens 超过 max_output_tokens")
            if not (m.get("model_metadata") or {}).get("chat_template"):
                errors.append(f"{mid}: 缺少 model_metadata.chat_template")

        desc = m.get("description") or ""
        for line in desc.split("\n"):
            if line.startswith("#") and not re.match(r"^#{2,3} ", line):
                errors.append(f"{mid}: description 标题层级不合法：{line[:12]}")
            if re.search(r"\[[^\]]+\]\([^)]+\)", line) or "![" in line:
                errors.append(f"{mid}: description 使用了不支持的 Markdown 语法")

    if errors:
        print(f"模型库校验失败，共 {len(errors)} 项：")
        for e in errors[:50]:
            print("  -", e)
        return 1

    print(f"模型库校验通过：{len(models)} 个模型"
          f"（LLM {sum(1 for m in models if m.get('type') == 'llm')}，"
          f"仓库 {sum(1 for m in models if m['source'].get('mode') == 'repository')}，"
          f"自定义 {sum(1 for m in models if m['source'].get('mode') == 'custom')}）")
    return 0


if __name__ == "__main__":
    sys.exit(main())
