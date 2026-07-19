# 安卓适配概述

Verity 5.7.2 CN 版对安卓平台（PojavLauncher 系列启动器）进行了完整适配。

## 适配内容

| 功能 | 桌面 | 安卓 |
|------|------|------|
| LLM 对话 | HTTP API | HTTP API ✅ |
| TTS 播放 | javax.sound | LWJGL OpenAL ✅ |
| 内置 Piper TTS | ✅ | ❌（不可用） |
| MiMo TTS | HTTP→javax.sound | HTTP→OpenAL ✅ |
| STT 录音 | TargetDataLine | ALC Capture ✅ |
| 本地 Whisper | ✅ | ❌（不可用） |
| MiMo ASR | PCM→WAV→HTTP | PCM→WAV→HTTP ✅ |
| 音量电平条 | ✅ | ✅ |

## 实现原理

安卓桌面 JVM 缺少 `javax.sound.sampled` 和 `android.media.AudioRecord`，本版通过以下方式绕过：

- **音频播放**：LWJGL OpenAL（Minecraft 自带）
- **音频采集**：ALC Capture 扩展（LWJGL `ALCCapabilities` 函数指针）
- **PCM→WAV**：手动写 WAV 头，不依赖 `AudioSystem.write()`

## 自动检测

模组启动时自动检测平台，无需手动配置：
- 检查 `user.home` 路径
- 检查启动器类名（Zalith / Pojav / FCL）
- 安卓上自动切换 TTS/STT 默认值
