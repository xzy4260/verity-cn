# TTS 语音合成

让 Verity 开口说话。

## 模式对比

| | 内置 TTS (BUILT_IN) | MiMo API (MIMO) |
|---|---|---|
| 引擎 | Piper (Sherpa-ONNX) | MiMo TTS API |
| 网络 | 离线 | 需要联网 |
| 语音 | 英文 | 中文（冰糖等） |
| 平台 | 仅桌面 | 桌面 + 安卓 |
| 音质 | 一般 | 优秀 |

## 桌面端

可以选择内置 TTS（离线）或 MiMo API（云端）。

内置 TTS 首次启动会自动解压模型文件，需要约 100MB 磁盘空间。

## 安卓端

**仅支持 MiMo API 模式**。安卓无法加载 Sherpa-ONNX 本地引擎。

MiMo 返回的音频通过 LWJGL OpenAL 播放，适配了 OpenSL 后端。

## 语音角色

MiMo TTS 支持以下预置音色：

| 音色名 | Voice ID | 语言 | 性别 |
|--------|----------|------|------|
| 冰糖（默认） | `冰糖` | 中文 | 女 |
| 茉莉 | `茉莉` | 中文 | 女 |
| 苏打 | `苏打` | 中文 | 男 |
| 白桦 | `白桦` | 中文 | 男 |
| Mia | `Mia` | 英文 | 女 |
| Chloe | `Chloe` | 英文 | 女 |
| Milo | `Milo` | 英文 | 男 |
| Dean | `Dean` | 英文 | 男 |

> 参考：[MiMo 预置音色列表](https://mimo.mi.com/docs/zh-CN/quick-start/usage-guide/audio/speech-synthesis-v2.5?target=预置音色列表)

可在 GUI 配置界面的「TTS 语音角色」中切换。
