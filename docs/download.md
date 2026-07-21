# 下载

## Verity 5.7.2 CN

最新版本，适配桌面端和安卓平台。

### v2.75 — 模型自定义 + 皮肤系统（推荐）

<div class="download-card">
  <span class="download-icon">📦</span>
  <div class="download-info">
    <strong>verity-5.7.2-cn-v2.75.jar</strong>
    <p>v2.75 · TTS/STT 模型名可配 · 自定义皮肤系统 · 约 237MB</p>
  </div>
  <a href="https://gh-proxy.org/https://github.com/xzy4260/verity-cn/releases/download/v2.75/verity-5.7.2-cn-v2.75-fix2.jar" class="download-btn">下载 JAR ⬇</a>
</div>

### v2.5 — 中国化重构版

<div class="download-card">
  <span class="download-icon">📦</span>
  <div class="download-info">
    <strong>verity-5.7.2-cn-v2.5.jar</strong>
    <p>v2.5 · LLM/TTS/STT 全中文配置 · OpenAI 兼容 API · MiMo 深度集成 · 约 246MB</p>
  </div>
  <a href="https://gh-proxy.org/https://github.com/xzy4260/verity-cn/releases/download/v2.5/verity-5.7.2-cn-v2.5.jar" class="download-btn">下载 JAR ⬇</a>
</div>

### v2.0 — 安卓适配版

<div class="download-card">
  <span class="download-icon">📦</span>
  <div class="download-info">
    <strong>verity-5.7.2-cn-v2.0.jar</strong>
    <p>v2.0 · 桌面端 + 安卓端 TTS/STT 完整适配 · 约 235MB</p>
  </div>
  <a href="https://gh-proxy.org/https://github.com/xzy4260/verity-cn/releases/download/v2.0/verity-5.7.2-cn-v2.0.jar" class="download-btn">下载 JAR ⬇</a>
</div>

> ⚠️ 将 JAR 文件放入 `.minecraft/mods/` 目录即可。请确保已安装前置模组。

## 前置模组

| 模组 | 下载 |
|------|------|
| Forge 47+ | [Minecraft Forge](https://files.minecraftforge.net/) |
| Geckolib 4.4+ | [CurseForge](https://www.curseforge.com/minecraft/mc-mods/geckolib) |
| YACL 3.6+ | [CurseForge](https://www.curseforge.com/minecraft/mc-mods/yacl) |
| Cloth Config 11+ | [CurseForge](https://www.curseforge.com/minecraft/mc-mods/cloth-config) |

## 历史版本

| 版本 | 日期 | 说明 |
|------|------|------|
| v2.75 | 2026-07 | TTS/STT 模型名可配置 · 自定义皮肤系统 · 表情/物品栏修复 |
| v2.5 | 2026-07 | LLM/TTS/STT 三板块重构 · 全中文界面 · MiMo 音色克隆 |
| v2.0 | 2026-07 | 安卓 TTS/STT 完整适配 |
| v1.0 | 2026-07 | 首次发布，配置界面全量汉化 |

<style>
.download-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  margin: 20px 0;
  transition: border-color 0.3s, box-shadow 0.3s, transform 0.3s;
  background: var(--vp-c-bg-soft);
}
.download-card:hover {
  border-color: var(--vp-c-brand);
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.18);
  transform: translateY(-2px);
}
.download-icon { font-size: 2.5rem; flex-shrink: 0; }
.download-info { flex: 1; }
.download-info strong { font-size: 1.05rem; }
.download-info p { margin: 4px 0 0; color: var(--vp-c-text-2); font-size: 0.9rem; }
.download-btn {
  padding: 12px 28px;
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
  color: #ffffff !important;
  border-radius: 10px;
  text-decoration: none;
  font-weight: 700;
  font-size: 15px;
  white-space: nowrap;
  transition: transform 0.2s, box-shadow 0.2s, filter 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: 2px solid transparent;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.35);
  letter-spacing: 0.5px;
}
.download-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(99, 102, 241, 0.5);
  filter: brightness(1.1);
}
.download-btn::after { content: ' ⬇'; font-size: 14px; }
</style>
