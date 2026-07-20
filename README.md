# Verity-cn 特供版

Verity 模组 5.7.2 中文汉化 · 安卓适配版。基于原版 Verity 进行了中国化改造。

## 改动

- 删除原版硬编码的 Groq/OpenRouter API 配置
- 新增 LLM / TTS / STT 三板块配置系统，支持 OpenAI 兼容 API + 小米 MiMo
- 全中文 GUI 配置界面和语言文件
- 安卓平台完整适配 TTS（OpenAL 播放）+ STT（ALC Capture 采集）
- MiMo 音色克隆支持

## 快速开始

1. 安装前置模组：Forge 47+、Geckolib 4.4+、YACL 3.6+、Cloth Config 11+
2. 下载 `verity-5.7.2-cn.jar` 放入 `mods/`
3. 主界面 → Mod → Verity Forge → 配置 → 填写 API 密钥

## 下载

| 版本 | 链接 |
|------|------|
| v2.5 (最新) | [GitHub Releases](https://github.com/xzy4260/verity-cn/releases/tag/v2.5) |
| v2.0 | [GitHub Releases](https://github.com/xzy4260/verity-cn/releases/tag/v2.0) |

## 文档

在线文档：`https://verity-cn.pages.dev`

开发服务器：`npm run docs:dev`

## 作者

**xzy4260** · [B站频道](https://space.bilibili.com/3706993095215271)

v3.0 合作开发：**涓星向凡** · [B站频道](https://space.bilibili.com/3461565078571133)

## 构建

```bash
cd build_project
./gradlew clean reobfJar
# 详见 docs/dev/build 构建指南
```

## 许可

本模组永久免费，付费均为诈骗。
