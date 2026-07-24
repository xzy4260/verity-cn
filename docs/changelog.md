# 更新日志

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
