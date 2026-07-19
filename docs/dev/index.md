# 开发者文档

## 技术栈

| 组件 | 版本 | 用途 |
|------|------|------|
| Forge | 47+ | Mod 加载器 |
| Minecraft | 1.20.1 | 游戏本体 |
| Java | 17 | 编译语言 |
| Geckolib | 4.4+ | 实体动画 |
| YACL | 3.6+ | 配置 GUI |
| Sherpa-ONNX | 内置 | 本地 TTS/STT |
| LWJGL 3 | 内置 | OpenGL / OpenAL |
| Gson | 内置 | JSON 解析 |

## 项目结构

```
src/main/java/varmite/verity/
├── AiProvider.java          # AI 提供商枚举 (CUSTOM 新增)
├── VerityConfig.java        # 配置管理（重写）
├── VerityClient.java        # 客户端 GUI（重写）
├── VerityPlatform.java      # 跨平台音频（新增）
├── ZalithMicBridge.java     # 安卓麦克风桥接（新增）
├── TtsMode.java             # TTS 模式枚举（新增）
├── SttMode.java             # STT 模式枚举（新增）
├── MimoApiEndpoint.java     # MiMo 端点配置（新增）
├── entity/AI/
│   └── AiAPI.java           # AI 接口核心（重写）
└── client/audio/
    ├── MicrophoneRecorder.java  # 麦克风管理（修改）
    └── MicrophoneManager.java   # 麦克风管理（保持）
```

## 核心改动

1. **配置系统重写**：从硬编码 Groq/OpenRouter → 通用 OpenAI 兼容 + MiMo
2. **跨平台音频**：`VerityPlatform` 根据 `isAndroid()` 自动选择 `javax.sound` 或 LWJGL OpenAL
3. **ALC Capture 桥接**：`ZalithMicBridge` 通过反射匹配 LWJGL JNI 签名，直调 `libopenal.so`
4. **字节码补丁**：`BytecodePatcher` 重命名原版方法，解决合并冲突
