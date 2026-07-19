# ALC Capture 桥接

## 问题

安卓桌面 JVM 没有 `android.media.AudioRecord` 类，无法直接调用 Android 原生录音 API。

JNA（Java Native Access）在 Android ARM64 上缺少 `libjnidispatch.so`，`Native.load()` 抛出 `NoClassDefFoundError`。

## 解决方案

利用 LWJGL 3 已有的 ALC Capture 函数指针和 JNI 工具类。

### 获取函数指针

```java
ALCCapabilities caps = ALC.getCapabilities();
long pOpenDevice  = caps.alcCaptureOpenDevice;   // 函数地址
long pCaptureSamples = caps.alcCaptureSamples;
long pStart       = caps.alcCaptureStart;
long pStop        = caps.alcCaptureStop;
long pCloseDevice = caps.alcCaptureCloseDevice;
```

### 反射匹配 JNI 签名

不同 LWJGL 版本的 `JNI` 类方法签名不同，通过反射自适应匹配：

```java
Class<?> jni = Class.forName("org.lwjgl.system.JNI");
for (Method m : jni.getDeclaredMethods()) {
    if (m.getName().equals("invokePJ")
        && m.getParameterCount() == 4
        && m.getReturnType() == long.class) {
        m_invokePJ = m;  // long invokePJ(long, int, int, long)
    }
    // ... 同理匹配 invokePV, invokePPV, invokePI
}
```

### 调用链

```
m_invokePJ.invoke(null, 0L, 16000, MONO16, pOpenDevice)
  → alcCaptureOpenDevice(NULL, 16000, MONO16, bufSize) → device 句柄

m_invokePV.invoke(null, device, pStart)
  → alcCaptureStart(device)

循环:
  m_invokePPV.invoke(null, device, shortBuf, bufLen, pCaptureSamples)
    → alcCaptureSamples(device, buf, samples) → PCM 数据

m_invokePV.invoke(null, device, pStop)
  → alcCaptureStop(device)

m_invokePI.invoke(null, device, pCloseDevice)
  → alcCaptureCloseDevice(device)
```

## 已知限制

- `alcCaptureOpenDevice` 的 `bufSize` 参数通过 `invokePJ` 仅传递 3 个参数，第 4 个由寄存器残留值提供，在 Zalith 上工作正常
- 不适用于桌面 OpenAL（桌面通常无 ALC Capture 扩展）
