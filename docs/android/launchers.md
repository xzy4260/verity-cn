# 支持的启动器

| 启动器 | 版本 | TTS | STT | 备注 |
|--------|------|-----|-----|------|
| ZalithLauncher | 2.4.9+ | ✅ | ✅ | 实测通过 |
| PojavLauncher | 最新 | ✅ | ✅ | 需 LWJGL 3 |
| Fold Craft Launcher | 最新 | ✅ | ✅ | 需 LWJGL 3 |
| HMCL-PE | 最新 | ✅ | ✅ | 需 LWJGL 3 |

## 必要条件

所有启动器均需满足：

1. **LWJGL 3** 自带 `ALCCapabilities` 类（包含 `alcCaptureOpenDevice` 等函数指针）
2. **`libopenal.so`** ARM64 编译（启动器 `.apk` 内 `lib/arm64-v8a/` 目录）
3. **麦克风权限** 在启动器设置中授予

## 检测方法

模组通过多种方式检测安卓环境，兼容不同启动器：

```java
// 1. 系统属性
user.home 包含 /storage/emulated/ 或 /data/data/

// 2. 类名反射
net.kdt.pojavlaunch.PojavLoginActivity    // PojavLauncher
com.movtery.zalithlauncher.ZalithLauncherActivity  // Zalith
com.movtery.fcl.FCLApplication             // FCL
```
