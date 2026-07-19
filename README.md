# Verity-cn 特供版

Verity 模组 5.7.2 中文汉化 · 安卓适配版。基于原版 Verity 进行了中国化改造。

## 改动

- 删除原版硬编码的 Groq/OpenRouter API 配置
- 新增 LLM / TTS / STT 三板块配置系统，支持 OpenAI 兼容 API
- 全中文 GUI 配置界面和语言文件
- 安卓平台完整适配 TTS（OpenAL 播放）+ STT（ALC Capture 采集）

## 快速开始

1. 安装前置模组：Forge 47+、Geckolib 4.4+、YACL 3.6+、Cloth Config 11+
2. 下载 `verity-5.7.2-cn.jar` 放入 `mods/`
3. 主界面 → Mod → Verity Forge → 配置 → 填写 MiMo API 密钥

## 构建

```bash
cd build_project
./gradlew clean reobfJar
# 详见 docs/dev/build 构建指南
```

## 文档

开发服务器：`npm run docs:dev`
在线文档部署于 Cloudflare Pages。

## 许可

本模组永久免费，付费均为诈骗。
