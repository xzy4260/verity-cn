# 平台适配原理

## 架构

```
                    ┌──────────────┐
                    │  Verity Mod  │
                    └──────┬───────┘
                           │ isAndroid() ?
              ┌────────────┼────────────┐
              ▼                         ▼
        ┌──────────┐            ┌──────────────┐
        │  桌面路径 │            │   安卓路径    │
        └──────────┘            └──────────────┘
              │                         │
    ┌─────────┼─────────┐     ┌────────┼────────┐
    ▼         ▼         ▼     ▼        ▼        ▼
javax.sound TargetData 本地  OpenAL  ALC     手动WAV
SourceLine   Line    Sherpa  Play   Capture   Header
 (TTS)     (STT)   (TTS/STT) (TTS)  (STT)   (PCM→WAV)
```

## 平台检测

`VerityPlatform.isAndroid()` 通过三路检测：

```java
// 1. 系统属性
vendor.contains("Android") || osName.contains("Android")

// 2. 路径特征
userHome.contains("/storage/emulated/")
|| userHome.contains("/data/data/")

// 3. 启动器类名反射
Class.forName("net.kdt.pojavlaunch.PojavLoginActivity")
Class.forName("com.movtery.zalithlauncher.ZalithLauncherActivity")
Class.forName("com.movtery.fcl.FCLApplication")
```

## TTS 路径

| 步骤 | 桌面 | 安卓 |
|------|------|------|
| HTTP 请求 MiMo API | ✅ | ✅ |
| 接收 WAV 音频 | ✅ | ✅ |
| 解析 WAV 头 | ✅ | ✅ |
| 播放 PCM | `SourceDataLine.write()` | `AL10.alBufferData()` + `alSourcePlay()` |
| 清理 | `line.drain()` + `close()` | `Thread.sleep(duration)` + `alDeleteSources()` |

## STT 路径

| 步骤 | 桌面 | 安卓 |
|------|------|------|
| 打开设备 | `AudioSystem.getTargetDataLine()` | `alcCaptureOpenDevice()` 通过 JNI |
| 采集循环 | `line.read(buffer)` | `alcCaptureSamples()` 通过 JNI |
| 关闭设备 | `line.stop()` + `close()` | `alcCaptureStop()` + `alcCaptureCloseDevice()` |
| PCM→WAV | `AudioSystem.write()` | `pcmToWav()` 手动写头 |
| Base64 | ✅ | ✅ |
| HTTP→MiMo ASR | ✅ | ✅ |
