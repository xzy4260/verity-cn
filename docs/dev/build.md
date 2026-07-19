# 构建指南

## 环境要求

- JDK 21
- ForgeGradle 6.0+
- Gradle 8.5

## 目录结构

```
Verity/
├── build_project/          # Gradle 构建项目
├── lib/
│   ├── verity-5.7.2.jar   # 原版模组
│   └── verity-patched.jar  # 字节码补丁后
├── BytecodePatcher.java    # ASM 字节码补丁工具
├── tools/                  # 字节码工具类
└── verity-5.7.2-cn.jar    # 最终输出
```

## 构建步骤

### 1. 编译 Java 类

```bash
cd build_project
export JAVA_HOME=/path/to/jdk-21
./gradlew clean reobfJar
```

### 2. 应用字节码补丁

```bash
javac -cp "tools/asm-9.7.1.jar;tools/asm-util-9.7.1.jar" BytecodePatcher.java
java -cp ".;tools/asm-9.7.1.jar;tools/asm-util-9.7.1.jar" BytecodePatcher
```

### 3. 打包 JAR

```python
import zipfile

replace = {'varmite/verity/ZalithMicBridge.class',
           'varmite/verity/VerityPlatform.class', ...}

with ZipFile('verity-5.7.2-cn.jar', 'w', ZIP_DEFLATED) as dst:
    # 1. 复制 verity-patched.jar 中非替换的条目
    with ZipFile('lib/verity-patched.jar') as src:
        for entry in src.infolist():
            if entry.filename not in replace:
                dst.writestr(entry, src.read(entry.filename))

    # 2. 覆盖编译好的新类
    with ZipFile('build_project/build/reobfJar/output.jar') as new:
        for cls in replace:
            dst.writestr(cls, new.read(cls))

    # 3. 添加语言文件
    dst.write('src/main/resources/assets/verity/lang/zh_cn.json',
              'assets/verity/lang/zh_cn.json')
```

### 4. 验证

```bash
jar tf verity-5.7.2-cn.jar | grep ZalithMicBridge  # 应只有 1 条
javap -cp verity-5.7.2-cn.jar varmite.verity.ZalithMicBridge \
  | grep "org.lwjgl.system.JNI"  # 确认是新版
```

## 常见问题

### BUILD FAILED + cannot find symbol

编译缓存问题。执行 `gradlew clean` 再编译。

### 打包后仍是旧版

Python `ZipFile` mode=`'a'` 追加模式会产生重复条目，classloader 读第一个。
必须用 mode=`'w'` 从零构建。
