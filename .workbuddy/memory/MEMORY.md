# Verity 模组汉化与 AI 配置重构

## 项目概述
Minecraft Forge 1.20.1 模组 Verity 5.7.2 的中国化改造：
- 删除旧的 Groq/OpenRouter 硬编码 AI 配置
- 新增 LLM/TTS/STT 三板块配置，支持自定义 OpenAI 兼容 API
- 新增小米 MiMo TTS (mimo-v2.5-tts) 和 ASR (mimo-v2.5-asr) 支持
- 全中文配置界面和 zh_cn.json 语言文件

## 技术栈
- Forge 47+, Minecraft 1.20.1, Java 17
- Geckolib 4.4+, YACL 3.6+
- Sherpa-ONNX (本地 TTS: Piper, 本地 STT: Whisper tiny.en)
- MiMo API (非标准接口，TTS/ASR 均通过 /v1/chat/completions)

## 修改内容
- 新增: TtsMode.java, SttMode.java, MimoApiEndpoint.java, BytecodePatcher.java
- 重写: VerityConfig.java, AiAPI.java, VerityClient.java
- 修改: AiProvider.java (添加 CUSTOM 枚举)
- 字节码补丁: VerityEntity, ModEvents, PlayTtsClientHandler (方法重命名)
- 新增资源: zh_cn.json

## 编译状态
- 简单枚举和 VerityConfig: 已编译 ✅
- AiAPI / VerityClient: 需 ForgeGradle 环境编译 ⚠️
- 方法重命名: 已通过 ASM 字节码补丁完成 ✅

## 交付物
- verity-5.7.2-lite.jar: 字节码补丁 + 中文语言（可直接使用）
- verity-5.7.2-cn-partial.jar: 含已编译类（待完整编译后替换 AiAPI/VerityClient）
- src/: 完整源代码
- build.gradle: ForgeGradle 构建脚本
