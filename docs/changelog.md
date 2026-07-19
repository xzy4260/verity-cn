# 更新日志

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
