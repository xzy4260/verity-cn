# 已知限制

## 本地模型不可用

安卓端无法使用内置 Piper TTS 和本地 Whisper STT。

**原因**：Sherpa-ONNX 的本地库（`.so` 文件）是为桌面平台编译的，安卓 ARM64 无对应二进制。

**解决**：使用 MiMo API 替代。配置界面已自动将默认值设为 MIMO 模式。

## 首次 STT 延迟

按下 V 键后约 1-2 秒才开始采集音频。

**原因**：ALC Capture 设备初始化需要时间。

## 性能说明

- 单机模式（进存档自动开服务器）在手机上可能导致 `Can't keep up!` 提示
- 建议降低视距和粒子效果
- 不影响模组功能，仅影响帧率

## 构建环境限制

- 编译环境（ForgeGradle）依赖 `javax.sound.sampled`，不可在安卓上编译
- JNA 不可用于 Android ARM64（缺少 `libjnidispatch.so`）
- 本版通过 LWJGL JNI 反射调用绕过这些限制
