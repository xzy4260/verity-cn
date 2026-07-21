# MiMo API 设置

小米 MiMo API 是本版 Verity 推荐的 AI 后端，同时支持 LLM 对话、TTS 语音合成和 STT 语音识别。

## 接口规格

MiMo API 使用非标准接口，但兼容 OpenAI 格式：

| 功能 | 端点 | 模型 |
|------|------|------|
| LLM 对话 | `/v1/chat/completions` | `mimo-v2.5` |
| TTS 合成 | `/v1/chat/completions` | `mimo-v2.5-tts` |
| ASR 识别 | `/v1/chat/completions` | `mimo-v2.5-asr` |

> 注意：TTS 和 ASR 都通过 Chat Completions 端点，非标准 OpenAI TTS/STT 端点。三块功能共用同一套 API URL 和密钥。

## 配置方法

在主界面点击 **Mod** → 选中 **Verity Forge** → 点击 **配置** 按钮打开 GUI 配置面板。

1. **LLM 配置**：
   - Base URL：`https://api.xiaomimimo.com/v1`
   - API Key：在 [MiMo 控制台](https://platform.xiaomimimo.com/console/balance) 获取
   - Model：`mimo-v2.5`

2. **TTS 配置**：
   - 模式选择「MiMo API」
   - 语音角色从预置音色中选择（冰糖、茉莉、苏打、白桦等）

3. **STT 配置**：
   - 模式选择「MiMo API」
   - API 端点和密钥复用 LLM/TTS 的配置

## 获取密钥

访问 [MiMo 控制台](https://platform.xiaomimimo.com/console/balance) → 注册账号 → 创建 API Token。
