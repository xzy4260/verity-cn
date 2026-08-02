# 更新日志

## v3.3 — 友好模式 + 游戏内工具调用 + 配置整理 (2026-08)

本次更新是 verity-cn 的又一次重大功能迭代，重点加入了 **友好模式（cn 版独有）**、**游戏内实时工具调用（配方查询 / Mod 探查）**、**老版物品给予机制回归**，以及大量稳定性修复。同时整合了「修改」配置标签页，并把 v3.3 起**移除了 YACL 依赖**。

### 友好模式（FRIENDLY_MODE · cn 版独有）

- **屏蔽所有恶魔变身逻辑与恐怖内容**：开启后 Verity 不再变身恶魔，也不再输出任何恐怖相关演出与文本
- **性格完全由 karma 驱动**：`<7` 冷淡、`7-14` 中立、`14-20` 友好、`>20` 极友好、`≥9000` 天使
- **强制阻止击杀任何实体**：友好模式下 Verity 不会击杀任何生物（含村民），旨在真正成为「游戏助手」
- 仍处于 **beta 阶段**，欢迎到 GitHub 提交 Issues 或在 QQ 群内反馈

### 游戏内工具调用

- **配方查询 `get_recipe`**：LLM 被强制在玩家询问合成 / 烧炼时调用该工具，实时返回真实游戏配方（支持模组物品），不再用 LLM 自身知识回答合成问题
- **已安装 Mod 探查 `get_all_mods`**：新增工具，可列出当前游戏所有已安装模组；玩家询问「装了什么 mod」时自动调用

### 老版物品给予机制（DROP_ITEM_LEGACY_MODE）

- 由社区成员 **@埋藏心底的悲伤** 提出并强烈请求恢复的能力
- 开关 **ON** 时，LLM 可指定 `item_id` 给予各种物品（铁锭、面包、煤炭等）；开关 **OFF（默认）** 时仅给泥土
- 通过 `ModEventsMixin` 拦截 `canDropItem` 黑名单实现

### 自定义克隆音频开关

- 音色克隆支持自定义参考音频
- 新增 `USE_CUSTOM_CLONE_AUDIO` 独立开关控制是否启用自定义参考音频
- 自定义音频目录：`config/verity/sample_audio/`

### 配置界面「修改」标签页

集中管理以下开关（位于游戏内 Mod → Verity-cn → 配置 → 修改）：

| 开关 | 默认 | 说明 |
|------|------|------|
| 友好模式 | OFF | 屏蔽恐怖内容与恶魔变身 |
| 击杀村民 | OFF | 控制 Verity 是否击杀村民 |
| 老版物品给予机制 | OFF | ON 时可指定 `item_id` 给予物品 |
| 启用自定义克隆音频 | ON | 控制自定义参考音频 |

### 稳定性修复

- **LLM 请求 60 秒超时**，防止永久阻塞
- **音频通道互斥管理**：一次只播一个声音
- **TTS 即时打断**：新请求立即替换正在播放的 TTS
- **断线自动停止发声**
- `AiAPI.getSystemPrompt` 委托 `PersonaHelper`，动态人设始终生效
- 自定义克隆音频文件名处理修复（不再重复追加扩展名）

### 技术改进

- 新增 `VerityModFlags` 独立标志位管理（不依赖 `VerityConfig`）
- 新增 `PersonaHelper` 动态人设辅助类，强制工具调用规则
- 新增 `ModEventsMixin` / `VerityEntityMixin` Mixin 注入
- 新增 `VerityRecipeHelper` 配方查询与 Mod 探查实现
- 配置文件清理：移除唱歌模式残留配置
- **v3.3 起移除 YACL 依赖**（旧版本仍需安装 YACL）

### 前置与安装

- 前置：Forge 47+ · Geckolib 4.4+ · Cloth Config 11+（v3.3 起无需 YACL）
- 安装：将 `verity-cn-v3.3.jar` 放入 `mods/` 目录即可，并使用 **Java 21 及以上** 启动游戏

---

## v3.2 — 语速按钮 + 流式响应 + 自定义音色 + 黑屏开关 (2026-07-28)

本次更新围绕 TTS 体验与主菜单视觉做了一次集中迭代。语速控制从滑条改为按钮循环切换，更贴合小米 MiMo 音频标签控制规范；新增 MiMo 流式响应让 TTS 边收边播；自定义音色克隆支持用户放入自己的样本音频；主菜单黑屏背景终于做成可开关的配置项。同时修复了长期存在的 Mixin 加载失败问题。

### TTS 语速按钮控制

- **滑条改为按钮循环切换**：TTS 语速与音色克隆语速均从滑条改为按钮，点击循环切换 7 档（极慢 → 放慢 → 原速 → 稍快 → 加快 → 很快 → 极快），按钮文字直接显示当前档位名称，不再显示具体数值
- **仅适配 MiMo 模型**：通过小米文档支持的音频标签（在 assistant 消息 content 前加 `（语速加快）` 等标签）控制语速，移除了 OpenAI 兼容路径的 speed 参数双重控制，只有 MiMo 端点触发
- **参考音色克隆 Base URL 选择实现**：使用 `Option<SpeedLevel>` + `EnumControllerBuilder` + binding 实现循环切换，`EnumController` 自带循环与刷新，无需重建屏幕
- **新增 `SpeedLevel` 枚举**：7 档，`toString()` 返回中文标签，`getTag()` 返回 MiMo 音频标签
- **新增 `SpeedHelper` 桥接类**：提供 `getCurrentXxxLevel` / `setCurrentXxxLevel` 反射读写配置

### MiMo 流式响应

- **边收边播真流式**：开启后 TTS 实时返回音频流，收到第一个 SSE chunk 即开始播放，不再等待全部接收完毕
- **配置位置**：Base URL 组底部新增「启用流式响应」复选框，默认关闭
- **仅 MiMo 端点生效**：非 MiMo 地址时此选项无效；MiMo 音色克隆不提供流式（克隆本身需要时间，流式不现实）
- **技术实现**：请求时设置 `audio.format=pcm16` 和 `stream=true`，响应解析 SSE 流，base64 解码 PCM16 chunk 实时写入 `SourceDataLine`
- **新增 `StreamTtsHelper`**：独立的流式 TTS 辅助类，异常时回退到原流程（catch 块返回 false，避免静音）

### 自定义音色克隆

- **新增自定义音色克隆输入框**：位于 TTS → MiMo 音色克隆组最底部，默认为空
- **使用方式**：在 `config/verity/sample_audio/` 目录放入 mp3 样本音频，输入框填文件名（不带后缀）即可使用
- **留空回退**：输入框为空时走原流程（使用上方按钮选择的预设音色）
- **自动创建目录**：`config/verity/sample_audio/` 文件夹在模组加载时自动创建（通过 `VerityConfig.<clinit>` 末尾插入 `mkdirs()` 调用，确保游戏启动即创建）
- **文件名安全过滤**：只允许字母、数字、下划线、连字符、中文，防止路径穿越
- **提示词**：音频建议 8-30 秒，单人单语言说话，背景不要过于嘈杂

### 主菜单黑屏背景开关

- **新增「主菜单黑屏背景」配置**：位于通用设置（General）TAB 最底部，开启显示模组黑屏背景，关闭恢复 MC 原版全景背景
- **Mixin 注入实现**：通过 `TitleScreenMixin` 在 `TitleScreen.render` 中注入黑色填充
- **注入点精确定位**：注入到 `PanoramaRenderer.m_110003_`（渲染 panorama 全景背景）调用之后，避免覆盖 logo 大字和按钮 widgets
- **修复 Mixin 长期未加载问题**：
  - `mods.toml` 新增 `[[mixins]]` 声明（`config="mixins.verity.json"`）
  - jar 的 `MANIFEST.MF` 新增 `MixinConfigs: mixins.verity.json` 属性（Forge 1.20.1 通过此属性加载 mixin 配置）
  - `@Inject` 的 `at` 属性改为数组格式 `[@At("RETURN")]`
  - `ForgeConfigSpec$ConfigValue.get()` 调用从 `INVOKEINTERFACE` 改为 `INVOKEVIRTUAL`（ConfigValue 是类不是接口）
- **refmap 更新**：添加 `render` 方法映射 `Lnet/minecraft/client/gui/screens/TitleScreen;m_88315_(Lnet/minecraft/client/gui/GuiGraphics;IIF)V`

### Mods 列表信息更新

- **版本号**：`3.1` → `3.2`

### 字节码增强

- **`PatchVerityClientSpeed`**：用 `Option` + `EnumControllerBuilder` + binding 实现语速循环切换，新增 12 个 lambda 方法（getter/setter/controller 各 4 组，覆盖语速、流式、黑屏）
- **`PatchVerityConfigSpeed`**：新增 `TTS_STREAM`、`MENU_BLACK_SCREEN_ENABLED`、`TTS_CLONE_CUSTOM_AUDIO` 配置字段；在 `<clinit>` 末尾插入 `sample_audio` 目录自动创建
- **`PatchTitleScreenBlack`**：在 `TitleScreenMixin` 添加 `renderBlack` 方法，注入 panorama 渲染之后
- **`PatchAiAPISpeed`**：修复语速标签插入逻辑，移除 OpenAI 兼容路径的 speed 参数

---

## v3.1 — 修复 + 初始化配置向导 (2026-07-24)

本次更新是 v3.0 的快速修复与功能补全版本。重点修复了首次启动初始化流程、OAuth 授权状态判断、下落叫声开关失效等问题，并新增了模组加载后的全屏初始化配置向导，让用户首次使用 Verity Mod 网站集成时不再需要手动查找配置入口。

### 首次启动初始化配置向导

- **开场动画后弹出**：模组首次加载时，开场动画结束后自动弹出全屏初始化配置界面
- **Verity Mod 授权提示**：全屏界面提供「是」「否」两个选项
- **模型选择提示**：全屏界面提供「是」「否」「打开 Verity Mod 官网」三个选项
  - 官网链接：https://veritycn.site/
  - 选择「是」后引导用户在 Verity Mod 网站的「代理服务 → 提供商 → 模型」中选定模型
- **OAuth 授权流程**：选择「是」后展示 5 秒全屏提示，随后自动打开 Verity Mod OAuth 进行 Token 授权
  - 提供「取消」选项
  - 授权超时为 2 分钟
  - 授权失败提供「重试」「跳过」按钮
- **授权后页面刷新**：授权成功后立即刷新页面，显示账户信息、模型名称、语音名称以及模型连通性
  - 所有模型连通成功 → 显示成功提示
  - 任一模型连通失败 → 提示检查账户余额（DeepSeek 余额 + 积分余额）以及是否选用免费模型，并提供「刷新」按钮重新检测连通性、「跳过」按钮继续

### 下落叫声开关修复

- **修复 `FALL_SOUND_ENABLED` 配置开关失效问题**：此前开关仅作用于 `ModEvents.onVerityTakeDamage`（岩浆、方块砸落等伤害），未覆盖 `VerityEntity.causeFallDamage` 中的掉落伤害逻辑，导致开关关闭后 Verity 从高处掉落仍会发出「哎呦」声
- **补丁位置**：在 `VerityEntity.m_142535_`（即 `causeFallDamage`）方法开头插入 `FALL_SOUND_ENABLED` 检查，开关关闭时直接 `return false`，跳过整个掉落效果（TTS + 弹跳 + IMPACT 音效）

### OAuth 授权状态判断修复

- **修复授权成功后仍卡在「等待授权」状态的问题**：Bridge 认证 API 返回状态通过 `status` 字段（值 `complete` 表示成功）传递，而非 `complete` 布尔字段
- **`VeritySetupAuth.java` 修复**：改为检查 `status == "complete"`，并保留对 `complete` 布尔字段的回退兼容
- **严格化 OAuth 成功判断**：`complete` 为 `true` 且 `licenseKey` 非空且长度 ≥ 10 才视为成功
- **`testModels` 参数化**：`testModels` 接收 `licenseKey` 参数而非从配置读取，避免时序问题导致空值
- **`VeritySetupScreen` 空值防护**：传递 `licenseKey` 给 `testModels` 并增加空值防护

### 配置默认值调整

- **LLM 与 STT 默认启用**：`llmEnabled` 与 `sttEnabled` 默认值改为 `true`
- **Verity 代理默认启用**：`useVerityProxyLlm`、`useVerityProxyTts`、`useVerityProxyStt` 默认值改为 `true`
- **配置文件生成修复**：`VerityConfig.SPEC` 注册类型从 `CLIENT` 改为 `COMMON`，使服务端装载模组时也能生成 `config/verity-client.toml`
  - 注意：已存在的配置文件不会被覆盖，需删除旧文件或手动开启新默认值

### Mods 列表信息更新

- **显示名**：`Verity Forge` → `Verity-cn`
- **版本号**：`5.72` → `3.1`
- **作者列表**：保留原版作者，新增修改者 `xzy4260` 与贡献者 `涓星向凡`
- **描述新增一行**：`此版本基于Verity JE 5.72修改`
- **modId 保持不变**：仍为 `verity`，保证向后兼容

### 字节码增强

- **`PatchVerityEntityFallSound`**：在 `VerityEntity.causeFallDamage` 方法开头插入 `FALL_SOUND_ENABLED` 检查
- **`IntroVideoScreen` 崩溃修复**：`fromNamespaceAndPath`（1.21+ API）替换为 `new ResourceLocation(ns, path)`，使用正确的 `NEW; DUP_X2; DUP_X2; POP; INVOKESPECIAL` 字节码序列
- **StackMapTable 重算**：使用 `ClassWriter.COMPUTE_FRAMES` 重新计算，适配修改后的方法分支结构

---

## v3.0 — Verity Mod 网站深度集成 (2026-07-24)

本次更新是 verity-cn 系列的一次重大架构升级。核心变化是**深度集成了 Verity Mod 网站**——当启用「Use Verity Mod」开关后，所有 LLM 对话、TTS 语音合成、STT 语音识别请求将统一通过 Verity Bridge 服务转发，无需再手动配置各类 API 密钥与端点，开箱即用。同时修复了大量 TTS 播放与聊天本地化问题。

### Verity Mod 网站深度集成（核心更新）

- **Bridge 服务架构**：新增 `Use Verity Mod` 全局开关。启用后，所有 LLM / TTS / STT 请求统一走 Verity Bridge 服务，自动忽略用户自定义的 Base URL / API Key / 模型名等配置，实现零配置开箱即用
- **License Key 授权系统**：授权密钥存储于 `config/verity-client.toml` 文件中（字段名 `VERITY_BRIDGE_KEY`，明文存储）。Bridge 请求通过 URL 路径携带密钥：`/api/<licenseKey>/v1/...`，无需额外 Header
- **Trust-all SSL 客户端**：Bridge 请求使用信任所有证书的 HTTP 客户端（`TRUST_ALL_HTTP`），兼容自签名证书与各类代理环境，避免 SSL 握手失败
- **LLM 请求 60 秒超时**：所有 LLM 请求强制设置 60 秒超时，防止因网络异常或服务端无响应导致客户端永久阻塞
- **代理逻辑前置检查**：TTS/STT 代理逻辑在方法入口处统一判断，而非在各模式分支内部判断，确保 Bridge 模式下所有路径都能正确转发

### TTS 语音系统增强

- **即时中断机制**：新的 TTS 请求会立即中断并替换正在播放的任何 TTS 语音。无需等待上一段播放完毕，对话体验更加流畅自然
- **OpenAL 播放路径修复**：
  - `stopAudio()` 在播放线程 lambda 的起始处调用，确保新请求到来时能正确中断旧播放
  - `stopAudio()` 同时处理两条播放路径：OpenAL（`alSourceStop` + `alDeleteSources` + `alDeleteBuffers`）和 JavaSound（`close line`）
  - 新增 `currentSource` 和 `currentBuffer`（volatile int 字段）追踪当前活跃播放资源，确保中断时精确释放
- **返回主菜单/断开时停止播放**：音频播放在返回主菜单或断开服务器连接时自动停止，避免后台残留语音

### 聊天消息本地化

三条特定的 Verity 聊天消息从英文改为中文显示，并禁用其 TTS 语音播放（避免中英混杂的朗读体验）：

| 原英文消息 | 中文消息 | TTS |
|-----------|---------|-----|
| `I'm alone...` | 我好孤单……你去哪了？ | 已禁用 |
| `Ayo chat...` | 喂喂喂，怎么就让我这样消失了 | 已禁用 |
| `The darkness...` | 黑暗……消散了。谢谢你。 | 已禁用 |

### 摔落伤害 TTS

- **新增 `FALL_SOUND_ENABLED` 配置开关**：位于通用设置（General）分类下，默认开启。控制摔落伤害时的 TTS 语音播报
- 摔落伤害 TTS 使用英文 prompt 触发：`[SYSTEM OVERRIDE: The player just dropped a heavy block on you!...]`
- 其他伤害类型（岩浆、火焰等）不受此开关影响，保持原有行为

### 配置系统调整

- **VerityConfig.SPEC 注册类型修正**：仅注册为 `CLIENT` 类型，移除了原有的 `COMMON` 注册，避免服务端/客户端配置不同步的问题
- 新增 `Use Verity Mod` 开关与 `VERITY_BRIDGE_KEY` 字段，统一管理 Bridge 服务连接

### 字节码增强

- `stopAudio()` 方法通过 ASM 字节码补丁实现完整替换（非重复定义）：跳过原始方法创建，在 `visitEnd` 中注入新实现
- 确保接口方法（如 `javax.sound.sampled.SourceDataLine`）使用 `INVOKEINTERFACE` 而非 `INVOKEVIRTUAL`
- `StackMapTable` 使用 `ClassWriter.COMPUTE_FRAMES` 重新计算，适配包含分支与 try-catch 的方法修改

### 致谢

- 新增**致谢页面**，感谢为本项目做出贡献的社区成员
- **@涓星向凡** — Verity Mod 网站站长，提供 Verity Mod 网站支持与 API 支持
- **@埋藏心底的悲伤** — 测试人员，积极参与 beta 版测试并及时反馈相关 bug

---

## v2.75 — 模型自定义 + 皮肤系统 (2026-07-21)

### TTS/STT 模型名可配置
- **TTS 模型名**：用户手动输入，默认 `mimo-v2.5-tts`（兼容 `tts-1` 等 OpenAI 模型）
- **STT 模型名**：用户手动输入，默认 `mimo-v2.5-asr`（兼容 `whisper-1` 等 OpenAI 模型）
- 后端路由逻辑不变：`xiaomimimo.com` → MiMo 协议，其他 → OpenAI 标准协议

### 自定义皮肤系统
- **皮肤 ZIP 加载**：将 16 张变体贴图（1024×1024 PNG）打包为 ZIP，放入 `config/verity/skins/` 目录
- **配置切换**：GUI 中输入 ZIP 文件名（不含 .zip）即可切换，切换瞬间生效
- **智能回退**：皮肤名无效或输入 `Verity` 时自动使用内置默认皮肤
- **物品栏同步**：切换皮肤后物品栏中的 Verity 预览同步更新

### 修复
- 修复皮肤表情固定不变（总是 `crazy.png`）的 bug — 改为精确按变体名匹配
- 修复物品栏中 Verity 不显示自定义皮肤的 bug — 预注册 16 张 DynamicTexture 覆盖原路径
- 修复文档 `/guide/mimo` 中不存在的「按 0 打开 GUI 配置面板」描述

### 字节码增强
- `SkinManager.onTextureLoad()` + `applySkin()` 通过 ASM 插入 `setBaseTexture` 前后，实现零侵入皮肤注入

---

## v2.5 — 中国化重构 (2026-07-21)

### AI 配置系统重构
- **LLM / TTS / STT 三板块独立配置**：删除旧的 Groq/OpenRouter 硬编码，每个板块独立管理
- **LLM 板块**：支持任意 OpenAI 兼容 API（DeepSeek、通义千问、硅基流动等），自定义 Base URL / API Key / 模型名称
- **TTS 板块**：三种模式 — 内置 Piper 引擎 / Base URL 自定义 API / **MiMo 音色克隆**
- **STT 板块**：两种模式 — 本地 Whisper / Base URL 自定义 API

### MiMo 深度集成
- **mimo-v2.5-tts**（预置音色）+ **mimo-v2.5-tts-voiceclone**（音色克隆）+ **mimo-v2.5-asr**（语音识别）
- 填入 `xiaomimimo.com` 地址自动走 MiMo 协议，其他走标准 OpenAI 协议
- 预置 3 组参考音频：Verity 默认、阿神同款、老牧师
- `MimoApiEndpoint` 端点选择（按量付费 / Token Plan）

### 界面完全重写
- YACL GUI 全中文：OptionGroup 分组标题、选项名、描述全部本地化
- TTS/STT 模式下拉菜单显示中文名称
- 枚举 `toString()` 覆盖确保下拉菜单与分组标题统一

### 构建修复
- VerityClient 移至 `varmite.verity.gui` 子包，解决 Gradle 字母序编译依赖问题
- 新增 `VerityClientBootstrap` 引导类，分离事件订阅与 GUI 构建

---

## v2.0 — 安卓适配 (2026-07)

### TTS 语音合成
- **安卓端**：通过 LWJGL OpenAL 播放 MiMo TTS 音频，适配了 OpenSL 后端
  - 关键修复：`AL_SOURCE_RELATIVE=true` + `AL_GAIN=1.0f` 解决 OpenSL 后端无声问题
- **桌面端**：保持 `javax.sound.SourceDataLine` 不变
- **新增**：手动 WAV 头写入（`pcmToWav`），替代 `javax.sound.AudioSystem.write()`，兼容安卓桌面 JVM

### STT 语音识别
- **安卓端**：通过 LWJGL `ALCCapabilities` 函数指针 + JNI 反射直接采集麦克风
  - 方案演进：`AudioRecord` 反射 ❌ → JNA ❌ → LWJGL JNI ✅
  - 采用流式录音循环（`androidRecordLoop`），每 50ms 读取一次，实时更新音量电平条
- **桌面端**：保持 `TargetDataLine` 不变
- **平台自动检测**：通过 system properties + 路径特征 + 类名反射三路检测安卓环境
- **支持启动器**：ZalithLauncher 2.4.9+、PojavLauncher、FCL、HMCL-PE

### 构建修复
- 修复 Gradle 编译缓存问题（`gradlew clean` 清理陈旧 class）
- 修复打包脚本重复条目（`ZipFile` mode=`'w'` 替代 mode=`'a'`）

---

## v1.0 — 首个中文版 (2026-07)

### 配置系统重构
- **新增 `VerityConfig.java`**：完整的 LLM / TTS / STT 三板块配置系统
  - LLM 板块：`USE_LLM`、`LLM_BASE_URL`、`LLM_API_KEY`、`LLM_MODEL`、`LLM_SYSTEM_PROMPT`
  - TTS 板块：`USE_TTS`、`TTS_MODE`（BUILT_IN / MIMO）、`TTS_MIMO_*` 配置组
  - STT 板块：`STT_MODE`（LOCAL / MIMO）、`STT_MIMO_*` 配置组
- **删除**原版硬编码的 Groq API Key 和 OpenRouter 配置
- **新增 `AiProvider` 枚举**：添加 `CUSTOM` 选项，支持任意 OpenAI 兼容 API
- **新增 `TtsMode` / `SttMode` / `MimoApiEndpoint`**：三枚举控制模式切换和端点选择
- **重写 `AiAPI.java`**：LLM 对话、TTS 合成、STT 识别三入口统一调度

### 界面汉化
- **YACL 配置 GUI** 全量中文化：所有选项名称、描述、分组标题、按钮文本
- **`zh_cn.json` 语言文件**：覆盖模组内所有可见文本
- **AI 系统提示词** 改为中文，角色设定贴合中国用户习惯

### 修复
- **中文用户名麦克风崩溃**：重构麦克风管理器，修复 TargetDataLine 获取时对非 ASCII 用户名的兼容问题
- **首次启动 TTS 模型解压**：修正模型路径，确保 Sherpa-ONNX 在中文路径下正常工作

### 字节码
- **`BytecodePatcher.java`**：ASM 字节码补丁工具
  - 重命名 `VerityEntity` / `ModEvents` / `PlayTtsClientHandler` 中的冲突方法
  - 确保与重构后的 API 签名兼容
