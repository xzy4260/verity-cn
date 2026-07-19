# 快速开始

Verity 5.7.2 中文汉化版为 Minecraft Forge 1.20.1 添加 AI 驱动的伴侣角色「Verity」。

## 安装

### 前置模组

| 模组 | 最低版本 | 说明 |
|------|----------|------|
| Forge | 47+ | Minecraft 1.20.1 |
| Geckolib | 4.4+ | 实体动画 |
| YACL | 3.6+ | 配置界面 |
| Cloth Config | 11+ | YACL 依赖 |

### 安装步骤

1. 下载 `verity-5.7.2-cn.jar`
2. 放入 `.minecraft/mods/` 目录
3. 启动游戏

## 首次配置

在游戏主界面点击 **「Mod」** → 选中 **「Verity Forge」** → 点击下方 **「配置」按钮** 打开 GUI 配置面板。

三个核心板块需要填写：

- **LLM 对话**：API 地址、密钥、模型名称
- **TTS 语音合成**：选择内置引擎或 MiMo API，设置语音角色
- **STT 语音识别**：选择本地 Whisper 或 MiMo ASR

> 💡 桌面端可以用内置 Piper TTS 和本地 Whisper（离线），安卓端请统一使用 MiMo API 模式。

## 与 Verity 交互

- **文字输入**：当 Verity 以**实体形态存在**时（非物品栏持有的物品形态），直接在聊天框打字即可对话
- **语音输入**：长按 `V` 键说话（默认按键，可在按键设置中自定义）
- **喊名字回复**：可在配置中开启「需喊名字才回复」，开启后需要在消息前加 Verity 的名字

## 获取 API 密钥

访问 [MiMo 控制台](https://platform.xiaomimimo.com/console/balance) 注册并获取 API Key。
