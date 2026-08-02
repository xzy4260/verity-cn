# Verity-cn 特供版

Verity 模组 5.7.2 中文汉化 · 安卓适配版。基于原版 Verity 进行了中国化改造。

## 改动

### 核心改造

- 删除原版硬编码的 Groq/OpenRouter API 配置
- 新增 LLM / TTS / STT 三板块配置系统，支持 OpenAI 兼容 API + 小米 MiMo
- 全中文 GUI 配置界面和语言文件（基于 Cloth Config API，不使用 YACL）
- 安卓平台完整适配 TTS（OpenAL 播放）+ STT（ALC Capture 采集）
- MiMo 音色克隆支持

### v3.3 新增

- **友好模式**：屏蔽所有恶魔变身逻辑与恐怖内容，Verity 性格完全由 karma 驱动，适合纯助玩场景
- **游戏配方查询**：LLM 被强制在玩家询问合成/烧炼时调用 `get_recipe` 工具，实时返回真实游戏配方（支持模组物品）
- **已安装 Mod 探查**：新增 `get_all_mods` 工具，可列出当前游戏所有已安装模组
- **老版物品给予机制**：开关开启后 LLM 可指定 `item_id` 给予各种物品（默认关闭时仅给泥土）
- **自定义克隆音频开关**：音色克隆支持自定义参考音频，并提供独立开关控制
- **击杀村民开关**：独立控制 Verity 是否会击杀村民
- **配置界面「修改」标签页**：集中管理友好模式、击杀村民、老版物品给予机制等开关
- **Mixin 注入**：通过 `ModEventsMixin` / `VerityEntityMixin` 拦截物品给予与实体生成逻辑
- **稳定性修复**：LLM 请求 60 秒超时、音频通道互斥、TTS 即时打断、断线自动停止发声

### 历史版本

- v3.2：语速按钮 + 流式响应 + 自定义音色 + 黑屏开关
- v3.1：初始化配置向导 + 一系列修复
- v3.0：Verity Mod 网站深度集成 + 致谢名单

## 快速开始

1. 安装前置模组：Forge 47+、Geckolib 4.4+、Cloth Config 11+
2. 下载 `verity-cn-v3.3.jar` 放入 `mods/`
3. 主界面 → Mod → Verity Forge → 配置 → 填写 API 密钥
4. 首次加载会弹出授权与模型选择界面，按提示完成即可

## 下载

| 版本 | 链接 |
|------|------|
| v3.3 (最新) | [GitHub Releases](https://github.com/xzy4260/verity-cn/releases/tag/v3.3) |
| v3.2 | [GitHub Releases](https://github.com/xzy4260/verity-cn/releases/tag/v3.2) |
| v3.1 | [GitHub Releases](https://github.com/xzy4260/verity-cn/releases/tag/v3.1) |
| v3.0 | [GitHub Releases](https://github.com/xzy4260/verity-cn/releases/tag/v3.0) |
| v2.75 | [GitHub Releases](https://github.com/xzy4260/verity-cn/releases/tag/v2.75) |
| v2.5 | [GitHub Releases](https://github.com/xzy4260/verity-cn/releases/tag/v2.5) |
| v2.0 | [GitHub Releases](https://github.com/xzy4260/verity-cn/releases/tag/v2.0) |

## 配置说明

主配置文件 `config/verity-client.toml`（Cloth Config 生成），独立标志位 `config/verity-mod-flags.txt`。

**「修改」标签页开关**：

| 开关 | 默认 | 说明 |
|------|------|------|
| 友好模式 (FRIENDLY_MODE) | OFF | 屏蔽恐怖内容与恶魔变身，Verity 仅由 karma 驱动 |
| 击杀村民 (Kill Villager) | OFF | 控制 Verity 是否击杀村民（友好模式下强制禁用） |
| 老版物品给予机制 (Use Legacy Item Giving) | OFF | ON 时 LLM 可指定 item_id 给予各种物品 |
| 启用自定义克隆音频 | ON | 控制音色克隆是否使用自定义参考音频 |

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
