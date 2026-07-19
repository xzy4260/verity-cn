# 麦克风配置

安卓端使用 LWJGL 的 ALC Capture 扩展采集麦克风音频。

## 权限设置

在启动器设置中开启**麦克风权限**：

### ZalithLauncher

系统设置 → 应用 → Zalith Launcher → 权限 → 麦克风 → 允许

### FCL / PojavLauncher

同理在系统设置的权限管理中授予。

## 工作流程

```
按住 V 键
  ↓
androidRecordLoop 启动
  ↓ 每 50ms 循环
  ├── alcCaptureSamples → short[] 样本
  ├── 计算 RMS → 实时更新电平条
  └── 写入 audioStream
  ↓ 松键
isRecording = false → 循环退出
  ↓
完整 PCM → pcmToWav() → Base64 → MiMo ASR API
  ↓
识别文本返回 → Verity 对话
```

## 电平条

按住 V 键时屏幕中央显示音量电平条：
- 随声音实时跳动
- 绿色 = 正常音量
- 红色 = 音量过大
- 始终居中 = 麦克风未工作（检查权限）
