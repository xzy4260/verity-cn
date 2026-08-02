# Verity 剖析：verity-3.3-cn 完整行为分析

> 以下内容基于对 `verity-3.3-cn.jar` 的反编译与行为分析，供想深入了解模组内部机制的玩家与技术爱好者参考。

> 📌 **关于分析环境**：本文是对 `verity-3.3-cn.jar` 的技术剖析，部分「构建 / 分析环境」信息（如反编译所用的 Java 版本）仅代表分析时环境；实际游戏运行所需的 Java 版本请以 [快速开始](/guide/) 中的 **Java 21 及以上** 要求为准。

> ⚠️ 本文为纯技术参考，不影响正常游玩。模组绝大多数行为都可通过 [高级自定义配置](/guide/advanced) 与 `config/verity.toml` 自行调整。

分析对象：`verity-3.3-cn.jar`（247,929,166 字节，777 个条目）；反编译工具：CFR 0.152；平台：Forge 1.20.1 / GeckoLib 4.4+。

---

## 1. 基本信息（META-INF/mods.toml）

| 字段 | 值 |
|---|---|
| modId | `verity` |
| version | `3.3` |
| displayName | `Verity-cn` |
| license | All Rights Reserved |
| 原作者 | Varmite（原作）、ThatMob（Verity 作者）、BlockMaster29、JJack |
| 中文化/修改 | xzy4260 |
| 环境 | CLIENT + SERVER |

依赖（`mods.toml`）：
- `forge [47,)`（必选）
- `cloth_config [11.0,)`（客户端必选）
- `minecraft [1.20.1,1.21)`
- `geckolib [4.4,)`

`MANIFEST.MF`：59 字节；`pack.mcmeta`：pack_format 15。
`mixins.verity.json`：客户端 mixin，包 `varmite.verity.mixin`，含 `LightTextureMixin`、`TitleScreenMixin`、`ModEventsMixin`、`VerityEntityMixin`，JAVA_17，`defaultRequire: 0`，refmap `verity.refmap.json`。

---

## 2. JAR 顶层结构

```
META-INF/            mods.toml、MANIFEST.MF
mixins.verity.json
pack.mcmeta
sherpa-onnx/         JNI 原生库（4 平台）
assets/verity/       资源（模型、音效、纹理、内置模型包、tts 包、语言文件）
data/                verity 进度 + minecraft 标签
com/k2fsa/sherpa/onnx/  101 个 sherpa-onnx Java 绑定类
varmite/verity/          108 个 mod 类
```

### sherpa-onnx 原生库（ONNX Runtime 1.24.4）

| 平台 | 文件 | 大小 |
|---|---|---|
| win-x64 | `onnxruntime.dll` | 16.0 MB |
| win-x64 | `sherpa-onnx-jni.dll` | 4.5 MB |
| linux-x64 | `libonnxruntime.so` | 25.0 MB |
| linux-x64 | `libsherpa-onnx-jni.so` | 5.1 MB |
| osx-aarch64 | `libonnxruntime.1.24.4.dylib` / `libsherpa-onnx-jni.dylib` | 35.4 / 4.2 MB |
| osx-x64 | `libonnxruntime.1.24.4.dylib` / `libsherpa-onnx-jni.dylib` | 29.6 / 4.5 MB |

运行时由 sherpa-onnx 绑定按平台/架构自动选择。

---

## 3. 内置模型包（首次启动解压）

### 3.1 语音识别 STT —— `assets/verity/sherpa-model.zip`（62,068,105 字节）
Whisper tiny.en int8（sherpa-onnx OfflineRecognizer / OfflineWhisperModelConfig）：
- `tiny.en-encoder.int8.onnx`（12,937,772 B）
- `tiny.en-decoder.int8.onnx`（89,853,865 B）
- `tiny.en-tokens.txt`（835,554 B）

`ModelExtractor` 将其解压到 `config/verity/sherpa-model`（以 `am` 目录为存在标志），`AiAPI.initLocalSTT()` 用 2 线程初始化引擎。

### 3.2 内置 TTS —— `assets/verity/tts/piper.zip`（67,457,493 B）
Piper 英语男声 `en_US-ryan-medium`：
- `en_US-ryan-medium.onnx`（63,149,198 B）+ 对应 `.onnx.json`
- `tokens.txt`、`MODEL_CARD`、`espeak-ng-data/`（355 个文件：lang/、voices/、dicts/）

`VerityLocalTTS.init()` 在首次使用时解压到系统临时目录 `verity_tts_engine*`，构建 `OfflineTts`（VITS，2 线程），语音 id=0、speed=1.0、silenceScale=0.2，采样率 22050 Hz。TTS 时通过 `AiAPI.cancelCurrentSpeech` 支持中断（生成回调返回 0 停止）。

### 3.3 音色克隆参考音频 `assets/verity/tts/reference/`
| 文件 | 大小 | CloneVoice 枚举 |
|---|---|---|
| `Verity.mp3` | 214,080 B | VERITY |
| `阿神同款.mp3` | 574,125 B | ASHEN |
| `老牧师.mp3` | 518,400 B | OLD_PASTOR |

---

## 4. 资源清单（assets/verity）

### 4.1 动画（animations/entity）
- `box.animation.json`（1,841 B）：`hover`（2s 循环，上下浮动+缩放）、`open`（hold_on_last_frame，easeOutCirc 开启/easeInExpo 关闭）、`flap1`（旋转）。
- `verity.animation.json`（4,608 B）：`talk`（0.4167s 循环，身体 Y 缩放 1.3）、`shake`（0.0833s 循环）、`box`（3.75s 一次性）。
- `verity_demon.animation.json`（67,981 B）：walk/sprint/death/grab/eat/attack 等全套动作。

### 4.2 模型（geo/entity、models/item）
- `box.geo.json`（813 B）、`verity_demon.geo.json`（79,135 B）。
- 物品模型：`verity_item.json`、`verity_disc.json`、`verity_edit_disc.json`、`flashlight.json`（手电筒 3D）。

### 4.3 音效（sounds/*.ogg，共 17 个）
| 文件 | 大小 | sounds.json 事件 | 用途 |
|---|---|---|---|
| box_open.ogg | 36,778 | box_open | 开盒 |
| box_click.ogg | 20,947 | box_click | 盒盖点击 |
| box_verity_0..2.ogg | 7–10 KB | box_verity_0..2 | 盒内 Verity 说话声 |
| intro.ogg | 106,163 | intro | 开场 |
| intro_video_audio.ogg | 107,273 | intro_video_audio（以及 edit 盘复用） | 开场动画配乐 |
| impact_0..2.ogg | 7.6–11 KB | impact_0..2（共用字幕） | 落地/撞击 |
| verity_disc.ogg | 1,117,330 | verity_disc（record，stream） | 唱片 |
| chase.ogg | 167,313 | chase | 恶魔追逐 |
| bone_snap.ogg / bone_break.ogg | 12.3/16 KB | bone_snap/bone_break（hostile） | 骨头断裂 |
| jumpscare.ogg | 25,653 | jumpscare（hostile） | 惊吓音效 |
| retro_coin.ogg | 8,107 | （无 JSON 条目，未使用） | — |

### 4.4 纹理
- `textures/entity/`（19 个）：16 个角色皮肤变体 `crazy`、`crazy_talking`、`evil`、`evil_talking`、`happy`、`happy_sleep`、`happy_talking`、`hurt`、`neutral`、`neutral_talking`、`noface`、`serious_1..3`、`serious_talking`、`smiling_evil`（与 `SkinManager.REQUIRED_VARIANTS` 完全对应）+ `box.png`、`preview.png`（172,988 B，设置界面预览）、`verity_demon.png`。
- `textures/item/`：上述 16 个变体的物品图标（其中 `crazy.png` 与实体版字节数不同）+ `flashlight.png`、`verity_disc.png`、`verity_edit_disc.png`。
- `textures/intro/`：248 帧开场动画 PNG（frame_0001~0248），内容三段式：视频画面（0001~0136）→ 定格帧（0166~0211 恒 20,607 B）→ 淡出/黑场（0212~0248）。24fps 约 10.3 秒，由 `IntroVideoScreen` 播放并叠加 `intro_video_audio.ogg`。
- `textures/karma_bar/`：`empty.png`、`full.png`、`happy.png`、`neutral.png`、`angry.png`（HUD 面像）。
- `textures/setup/guide.png`（110,014 B，设置引导图）、`white.png`（352 B，白色遮罩）。

---

## 5. 实体与注册

### 5.1 ModEntities
| ID | 实体类 | 类型 | 尺寸 |
|---|---|---|---|
| `verity` | VerityEntity | MobCategory.MISC | 0.5 × 0.5 |
| `box` | BoxEntity | MISC | — |
| `verity_demon` | VerityDemonEntity | MISC | 0.4 × 4.8（爬行时 1.8） |

三个实体的属性均在 `ModBusCommonSetup`（CommonSetupEvent）注册；动画/渲染在 `ModBusClientSetup` 注册（BoxRenderer、SphereEntityRenderer、VerityDemonRenderer）。

### 5.2 VerityEntity（主 NPC，GeckoLib GeoEntity）
- 变体系统：SynchedEntityData `VERITY_VARIANT`（字符串），NBT 键 `VerityVariant`，默认 `happy`；`clientIsTalking` 用于说话嘴型。
- 50 帧出生动画（VerityAnimation）、talk/shake/box 动画。
- 皮肤纹理运行时生成（`VerityEntityTexture`），支持 `COLOR`（色相 0–360）染色与动态说话嘴型纹理。
- 与玩家对话：按住 PTT 键（V）录音 → 转写 → LLM → 动作 + 语音回复；受 `REQUIRE_VERITY`（须包含"Verity"）约束。
- 可被 `VerityEntityMixin` 在友好模式下禁止 `transformIntoDemon`。

### 5.3 BoxEntity（盒子）
- GeckoLib GeoEntity，`hover`/`open` 动画，打开时播放 `box_open`、`box_click`、`box_verity_0..2` 音效；触发 `open_box` 进度触发器；出现 Verity 或触发后续事件。

### 5.4 VerityDemonEntity（恶魔）
实现 `Enemy`，由 Verity 在 `DAY_COUNT` 天后或 karma 过低时 `transformIntoDemon` 变身而来。**免疫火焰与虚空伤害**（忽略 FREEZE/OUT_OF_WORLD 两种伤害类型）。

#### 属性
- MAX_HEALTH 400、MOVEMENT_SPEED 0.45、FOLLOW_RANGE 512、ATTACK_DAMAGE 19、KNOCKBACK_RESISTANCE 1.0、ARMOR 1.0。

#### SynchedEntityData
`DEMON_STATE`(int)、`IS_CLIMBING`(bool)、`HUNT_PHASE`(int)、`IS_CRAWLING`(bool)、`IS_EATING`(bool)、`IS_GRABBING`(bool)、`GRABBED_ENTITY_ID`(int)。

#### 目标选择（registerGoals）
- 优先 1–5：DemonGlassBreakAndLeap → DemonBreakDoor → DemonWindowStalk → DemonStareAndBreak → DemonAttack（近战，自定义冷却）
- 6 随机游走、7 注视玩家；目标目标：HurtByTargetGoal + 2 个匿名目标目标（如最近玩家）。

#### 核心行为（tick）
- **强加载区块**：时刻 `setChunkForced` 当前所在区块，离开后释放上一个，保证 512 格追逐不卸载。
- **打破玻璃**：state==1 且有目标时，扫过自身包围盒，破坏所有树叶/含 "glass"/"pane" 方块；贴墙（水平碰撞）时破坏头顶碰撞方块并触发 `triggerAttack()`（播放 attack 动画）。
- **攀爬**：贴墙时 `IS_CLIMBING=true`。
- **爬行**：检测头顶 2/3 格硬天花板（非树叶/玻璃/窗），以及目标方向 1–5 格前方天花，进入 `IS_CRAWLING`（高度 1.8），爬行时 `setPose` 触发尺寸重算。
- **抓取/投掷**（`startGrabbing`）：38 tick 内把目标提到身前 1.5 格、高度 2.0+进度 处（玩家走 `ServerboundSetEntityMotionPacket` 强制传送），随后以 4.0/1.2/4.0+0.2 的速度抛出、播放铁砧落地声（SoundEvents.ANVIL_LAND）、造成 5 点摔落伤害。
- **吞噬**（`startEating`，杀死目标后 60 tick）：锁定移动、头顶粒子（DustParticleOptions），并把脚下 3×3 内空气替换为**火**（FIRE）。
- **受击反击**：受伤且攻击者非创造/旁观玩家时，若正在吃/抓则打断；state==0 时立即进入 state==1 + HUNT_PHASE=1。
- `hasLineOfSightThroughGlass`：仅透过玻璃/窗格/树叶判定视线（≤128 格），配合 DemonWindowStalkGoal 隔窗凝视。
- `isStuck()`：10 tick 内位移 `<0.05>` 累计 40 tick 判定卡住，由玻璃破坏目标解围。

#### 路径寻路（DemonPathNavigation / DemonNodeEvaluator）
将玻璃、窗格、树叶视为 `BlockPathTypes.OPEN`，节点预算翻倍，实现"穿窗而入/破门而入"。

#### 动画
movement_controller：death / grab / sprint(state==1) / walk；action_controller：eat 循环，`attack_trigger` 可触发攻击动画。

#### 音效
state==1 且客户端未播放时，`ClientSoundHandler.playDemonChaseSound` 启动 `DemonChaseSoundInstance`（CHASE，音量 3.0，音调 0.6，跟随实体）。

---

## 6. 物品与创造模式标签

### ModItems
| ID | 类 | 说明 |
|---|---|---|
| `verity_item` | VerityItem | 生成 Verity 实体 + 播放入场/对话 TTS（经 PlayTtsPayload） |
| `flashlight` | FlashlightLightBlock 对应物品 | 手电筒，客户端动态光照（DynamicLightManager） |
| `verity_disc` | RecordItem（signal 15） | 唱片，播放 verity_disc.ogg |
| `verity_edit_disc` | RecordItem | 编辑用唱片，播放 intro_video_audio.ogg（字幕 sounds.verity.edit） |

创造模式标签页 `verity_tab` 顺序：verity_item → verity_disc → verity_edit_disc → flashlight。
`data/minecraft/tags/items/music_discs.json` 把两盘唱片加入 `minecraft:music_discs`。

### 手电筒光照
`FlashlightLightBlock`：服务器端射线投射放置光源方块（客户机会移除），`FlashlightServerLogic` 按玩家维护、登出清理；`DynamicLightManager` 客户端光束渲染。

---

## 7. 网络与数据同步

### ModNetwork（`verity:main`，protocol "1"）
仅注册 `PlayTtsPayload`（C→S 播放台词，PlayTtsClientHandler 在无网场景回退显示 "Voice in Head" 字幕）。`SetEntityTalkingPacket` 存在但未注册。

### ModMessages（`verity:messages`，protocol "1.0"）
注册 `KarmaSyncS2CPacket`（PLAY_TO_CLIENT）→ `ClientKarmaData`（客户端 karma 缓存，供 HUD 与进度使用）。

### WorldSpawnData（SavedData）
- `verityKarma`（float）
- `hasSpawnedEntity` / `hasSpawnedDemon` / `hasSpawnedDemonAngered`
- `chatHistory`（ListTag，上限 10 条，用户/助手消息供 LLM 上下文）。

---

## 8. 指令

| 指令 | 权限 | 功能 |
|---|---|---|
| `/changekarma <0-20>`` | 2 | 修改 karma 并触发 karmachange 事件/进度 |
| `/recoververity` | — | 恢复 Verity（1 小时冷却） |

---

## 9. 首次运行、OAuth 与账户桥接

### 首次运行
- `VerityFirstRun` 写 `config/verity_setup_done` 标记；`VeritySetupHook` 通过 `TitleScreenMixin` 拦截主菜单，替换为 `VeritySetupScreen`（7 步：授权 → 模型准备 → OAuth 倒计时/等待/失败 → 检查模型 → 完成）。
- `PLAY_VIDEO` 开启时 `IntroVideoScreen` 在进世界时播放 248 帧开场动画。

### VerityAccountBridge（BRIDGE_BASE = `https://bridge.veritycn.site`）
- **登录**：生成 UUID 令牌，`openLogin()` 打开 `…/auth?token=<uuid>`（桌面 API + `rundll32`/`open`/`xdg-open`），并复制到剪贴板。
- **轮询**：后台线程每 3 秒 GET `…/api/auth?token=<uuid>`，120 秒超时；响应含 `"complete"` 且 `licenseKey` ≥10 字符即写入 `VERITY_BRIDGE_KEY`。
- **账户数据**：GET `…/api/user/info?licenseKey=…` → userId、username、email、balance（站内积分 credits）、deepseekBalance（DeepSeek 余额，CNY 显示 ¥）。
- **服务端模型**：GET `…/api/user/models?licenseKey=…` → llm、tts、ttsVoice、stt（写入 `VERITY_SRV_*` 只读配置）。
- **模型连通测试**：`testAllModels()` 对 `…/api/<key>/v1/{chat/completions, audio/speech, audio/transcriptions}` 发探测请求（TTS/STT 用 500ms 静音 WAV），结果写入 `VERITY_CONN_*`。
- **HTTP 客户端**：`TRUST_ALL_HTTP` 使用自签信任管理器（信任所有证书）——安全提示：代理模式下 TLS 校验被禁用。

---

## 10. 配置系统（Forge Config / Cloth Config）

配置文件 `config/verity.toml`。以下为全部配置项（VerityConfig 静态字段，含注释原文摘要）：

### 通用（常用）
- `canCrash`（true）：允许 Verity 将你踢出服务器
- `playVideo`（true）：客户端启动播放开场动画
- `requireVerity`（false）：每句话须含 "Verity" 才交流
- `trueDarkness`（true）：极限黑暗（见 LightTextureMixin）
- `killVillagers`（true）：Verity 是否击杀村民
- `friendlyMode`（false）：友好模式，不再杀任何生物，取消恶魔变身与恐怖事件，性格随 Karma 变化
- `dropItemLegacyMode`（false）：旧版物品给予机制（跳过稀有度黑名单）
- `showKarma`（true）：快捷栏上方显示 Karma 条
- `dayCount`（5）：游戏天数达到后 Verity 变敌对/恶魔形态
- `immersiveMode`（false）：沉浸模式，隐藏所有 Verity UI
- `fallSoundEnabled`（true）：Verity 摔落时叫喊
- `menuBlackScreen`（true）：主菜单黑屏背景（关闭恢复原版全景）

### 个性化
- `colorHue`（0–360）：Verity 纹理色相，0=原始颜色
- `customName`（"Verity"）：自定义名称
- `customPersonality`（""）：自定义人设提示词，留空用默认动态人设（随天数与 Karma 演变人格），填写覆盖
- `skin`（"Verity"）：皮肤选择（textures/entity/ 子目录名）

### LLM（大语言模型）
- `llmEnabled`（true）：AI 对话总开关
- `useVerityProxyLlm`（true）：走 Verity 官方代理（bridge.veritycn.site），下方 Base URL/Key/模型名失效
- `llmBaseUrl`（`https://api.deepseek.com/v1`，OpenAI 兼容，支持 DeepSeek/通义千问/硅基流动）
- `llmApiKey`、`llmModel`（`deepseek-chat`）

### TTS（文字转语音）
- `ttsEnabled`（true）：语音播报总开关
- `useVerityProxyTts`（true）：走代理
- `ttsMode`（BUILT_IN）：内置TTS（本地 Piper）/ Base URL（MiMo 等）/ 音色克隆
- `ttsBaseModel`（`mimo-v2.5-tts`，兼容 OpenAI tts-1）
- `ttsBuiltinVoice`（`DANIEL`）：Piper 内置音色（VerityVoice 枚举：AUTUMN/DIANA/HANNAH/AUSTIN/DANIEL/TROY）
- `ttsBaseUrl`（`https://api.xiaomimimo.com/v1`）：小米端点自动走 MiMo 逻辑，其他走 OpenAI /v1/audio/speech
- `ttsMimoApiKey`（sk- 或 tp-）
- `ttsMimoVoice`（`冰糖`，alloy/echo 等）
- `ttsSpeed`（1.0，0.5–4.0 倍速，仅 MiMo 生效）
- `ttsStream`（false）：MiMo 流式响应（SSE，实时返回音频）
- `ttsCloneApiKey`（独立于 Base URL 的 Key）
- `ttsCloneEndpoint`（DEFAULT：`https://api.xiaomimimo.com/v1`；TOKEN_PLAN：`https://token-plan-cn.xiaomimimo.com/v1`）
- `ttsCloneVoice`（VERITY / ASHEN(阿神同款) / OLD_PASTOR(老牧师)，参考音频在 assets/verity/tts/reference/）
- `ttsCloneSpeed`（1.0）
- `ttsCloneCustomAudio`（""）：自定义克隆样本 mp3（放 config/verity/sample_audio/）
- `useCustomCloneAudio`（true）：是否启用自定义克隆音频

### STT（语音识别）
- `sttEnabled`（true）
- `useVerityProxyStt`（true）
- `sttMode`（LOCAL）：本地识别（离线 Whisper）/ Base URL（MiMo）
- `sttBaseModel`（`mimo-v2.5-asr`，兼容 OpenAI whisper-1）
- `sttBaseUrl`（`https://api.xiaomimimo.com/v1`）
- `sttMimoApiKey`

### Verity 账户（只读/回填）
- `verityBridgeKey`（Bridge OAuth License Key）
- `verityUserId`、`verityUsername`、`verityEmail`、`verityCredits`、`verityDsBalance`
- `veritySrvLlm` / `veritySrvTts` / `veritySrvTtsVoice` / `veritySrvStt`（服务端配置模型，只读）
- `verityConnLlm` / `verityConnTts` / `verityConnStt`（连通性检测结果，进设置页清空）

### 隐藏/其他（部分不在 GUI 或在 VerityModFlags）
- `VERITY_BRIDGE_KEY` 等
- `VERITY_MOD_FLAGS`：文件 `config/verity-mod-flags.txt` 内 `friendlyMode=`、`dropItemLegacyMode=` 与内存值 `MIMO_SING_ENABLED`（唱歌）、`MIMO_SING_ENDPOINT_PAYASYOUGO`（true）、`MIMO_SING_API_KEY`。

启动时创建 `config/verity/sample_audio` 目录。

---

## 11. 客户端音频/语音管线

### 11.1 采集（MicrophoneRecorder / MicrophoneManager）
- 格式 16 kHz / 16 bit / 单声道（AudioFormat(16000,16,1,true,false)）。
- `MicrophoneManager.scanForMicrophones` 枚举混音器并记住所选麦克风；按键 V 开始录音，再按结束。
- 安卓端走 `ZalithMicBridge`（JNI，3200 字节缓冲，30ms 轮询）。
- RMS 电平计算（`audioLevel`，0–1）供 `AudioHudRenderer` 麦克风电平条显示（500ms 淡出）。
- 结束后 `AiAPI.transcribeAudio(pcm, format)` 异步转写（CompletableFuture）。

### 11.2 转写（AiAPI.transcribeAudio）
- 代理开启 → `transcribeMimoSTT`（proxy URL）。
- `STT_MODE=LOCAL` → `transcribeLocalSTT`：sherpa `OfflineRecognizer`（Whisper tiny.en int8，2 线程）；首次使用懒初始化。
- `STT_MODE=MIMO` → `transcribeMimoSTT`：
  - MiMo 端点：PCM→WAV → base64 data URL → POST `/chat/completions`（messages 含 input_audio，`asr_options.language=zh`）。
  - OpenAI 兼容：multipart `/audio/transcriptions`（model + file），Bearer 认证。

### 11.3 回复 LLM（AiAPI.askLLM）
- 请求 POST `chat/completions`，temperature 0.8，max_tokens 2048，60s 超时。
- 代理模式 URL：`https://bridge.veritycn.site/api/<BRIDGE_KEY>/v1/chat/completions`（用 LlmHelper 的 TRUST_ALL 客户端）。
- 非代理：`LLM_BASE_URL + "/chat/completions"`，`Authorization: Bearer <key>`。
- system prompt 由 `PersonaHelper.getSystemPrompt(day, karma)` 动态生成（含工具调用规则；`CUSTOM_PERSONA` 覆盖默认人格但保留工具规则）。
- 注入 `WorldSpawnData.chatHistory` 最近 10 条对话。
- 解析 AI 返回 JSON：`variant`（默认 neutral）、`message`、`karma_change`、`actions[]`；清洗 ``<think>`` 与代码围栏后提取 JSON；失败时 `generateFallbackJson` 兜底。
- 动作白名单（PersonaHelper，ORIGINAL 与 LEGACY 两套）：get_coords / get_inventory / get_dimension / get_nearby_entities / get_nearest_nether_fortress / get_nearby_ores / get_nearest_ore_location / get_nearest_village / get_biome / get_own_coords / play_sound / drop_item / play_favourite_song / stop_favourite_song / return_to_player / get_block_player_is_looking_at / transform_following_day / forgive / get_player_name / get_player_health / get_light_level / get_difficulty / start_following / stop_following / get_players_mods / transform_back / get_recipe(参数 item_id) / get_all_mods。`VerityRecipeHelper` 处理配方查询。
- `ModEvents` 消费 AI JSON：`setVariant` + 逐条执行动作 + 通过 `PlayTtsPayload` 播放回复语音；写入 chatHistory。

### 11.4 播报（AiAPI.playVerityVoice）
按 `TTS_MODE` 分发：
- **BUILT_IN**：`playBuiltinTTS` → `VerityLocalTTS.generateSpeech`（Piper，22050 Hz）→ `VerityPlatform.playPCMAudio`（安卓不支持本地引擎，提示改用 Base URL）。
- **MIMO**：`playMimoTTS`；若 `ttsStream=true` 且非代理且为 MiMo 端点 → `StreamTtsHelper.tryPlayMimoTtsStream`：
  - POST `/chat/completions`，`audio.format=pcm16`，`stream=true`，`api-key` 头；SSE 逐行解析 `choices[].delta.audio.data`（base64 PCM）→ `SourceDataLine`（24 kHz）实时播放；无数据则回退普通流程。
  - 非流式 MiMo：`audio.format=wav`，base64 解码后播放。
  - OpenAI 兼容：`/audio/speech`（model/input/voice/response_format=wav）。
- **VOICE_CLONE**：`playVoiceCloneTTS` → 取参考音频（自定义 mp3 优先，其次内置 reference）→ base64 为 `data:audio/mpeg;base64,` → POST `/chat/completions`，model=`mimo-v2.5-tts-voiceclone`，messages=[user(""), assistant(带语速标签)]，`audio.voice=data URI`；参考音频 >10MB 降级为 MIMO。
- 语速：`SpeedHelper` 将 `ttsSpeed`/`ttsCloneSpeed` 映射为 `SpeedLevel` 标签（`<tag>`）前缀拼入文本（仅 MiMo 端点生效）。
- 播放：`playWavBytes` 解析 WAV 采样率后 `VerityPlatform.playPCMAudio`；`apply3DEffect` 按与 Verity 距离（≤32 格）调 MASTER_GAIN、按玩家朝向与方向向量调 PAN，实现空间音频。
- 中断：`interruptSpeech()` 双调用 `VerityPlatform.stopAudio()` + Narrator.clear()。

### 11.5 安卓（VerityPlatform）
- 检测 5 个启动器类：PojavLoginActivity、MovTery PojavLauncherActivity、ZalithLauncherActivity、FCLApplication、Minecraft MainActivity。
- 播放：安卓用 OpenAL 播放 PCM；桌面用 `SourceDataLine`；byte[]→short[] 转换。

---

## 12. 事件与处理器（event/）

| 类 | 作用 |
|---|---|
| ModEvents | 主事件核心：AI 响应分发、动作执行、变体设置、掉落/声音/村民击杀、Demon 生成、karma 事件 |
| ModClientEvents | 客户端 tick、TitleScreen 替换、动态光照调度 |
| ModBusClientSetup | 渲染器注册、模型烘焙（UnshadedBakedModel）、KarmaHudOverlay、GUI 覆盖 |
| ModBusCommonSetup | 三实体属性注册 |
| ConfigEventHandler | 配置变更响应 |
| ChestCloseHandler | 关闭箱子事件（可能触发 Verity 出现/进度） |
| VeritySpawnScheduler | 定时/条件生成调度 |
| VerityPleadingHandler | 10 格内哀求交互、60 格搜索 |
| DemonWindowSpawner | 按 Heightmap 在窗户位置生成恶魔 |
| FlashlightServerLogic | 手电筒光源方块放置/清理（按玩家） |
| VerityVisuals | 黎明雾效等视觉 |
| WorldSpawnData | SavedData（见 §7） |

---

## 13. 渲染与特效

- **UnshadedBakedModel**：`getQuads` 返回全亮（packed light `0xF000F0`），用于手电筒光束/物品不遮蔽。
- **SphereEntityRenderer / SphereMesh**：屏幕空间球体（billboard），纹理缩放 1.3。
- **VerityEntityTexture / VerityPreviewTexture**：运行时根据颜色/变体/说话状态动态生成带嘴型的纹理。
- **KarmaHudOverlay**：快捷栏上方 Karma 条（empty/full）+ 面像（happy/neutral/angry），沉浸模式隐藏。
- **IntroVideoScreen**：248 帧/24fps 开场动画 + intro_video_audio 配乐（播放 `intro` 音效事件）。
- **DemonChaseSoundInstance**：追逐音效实例（音量 3.0、音调 0.6、跟随 state==1）。
- **AudioHudRenderer**：麦克风电平 HUD（500ms 淡出）。
- **DynamicLightManager**：手电筒动态光束。
- 按键：`push_to_talk`（V）、`cycle_mic`（M）—— KeybindHandler/KeybindRegistry。

---

## 14. Mixins

| Mixin | 目标 | 效果 |
|---|---|---|
| LightTextureMixin | LightTexture | 失明/夜晚时极限黑暗（trueDarkness） |
| TitleScreenMixin | TitleScreen | 首次运行拦截进入设置流程 |
| ModEventsMixin | 事件 | friendlyMode 屏蔽生成、DROP_ITEM_LEGACY_MODE 旧版掉落 |
| VerityEntityMixin | VerityEntity | friendlyMode 下禁止 transformIntoDemon |

---

## 15. 声音系统（ModSounds / sounds.json）

`ModSounds` DeferredRegister 注册事件：`box_open`、`box_click`、`box_verity_0..2`、`intro`、`impact_0..2`（共用字幕 `sounds.verity.impact`）、`verity_disc`（record/stream）、`intro_video_audio`（字幕 intro_cinematic）、`chase`、`bone_snap`、`bone_break`、`jumpscare`（hostile）、`verity_edit_disc`（record，复用 intro_video_audio 音频，字幕 sounds.verity.edit）。
字幕键 en_us/zh_cn 完整翻译（含物品/实体/按键/标签页）。

---

## 16. 进度与触发器（data/verity/advancements）

树形结构（`data/verity/advancements/verity/`）：
```
root → talk
     → favoritesong（图标 verity_disc）
     → karmachange（图标 amethyst_shard）
         → goodkarma（图标 diamond）
         → badkarma（图标 rotten_flesh）
     → playsound
     → village
```
对应 `ModTriggers` 9 个简单条件触发器：open_box、talk、village、karmachange、goodkarma、badkarma、favoritesong、playsound。

---

## 17. sherpa-onnx Java API 绑定（com/k2fsa/sherpa/onnx/，101 个类）

包含（未逐类深入）：OfflineTts/OfflineTtsConfig/OfflineTtsVitsModelConfig、OfflineRecognizer/OfflineWhisperModelConfig/OfflineStream、GeneratedAudio/GenerationConfig、KeywordSpotter、VAD、说话人聚类/嵌入、降噪（denoise）、音频打标（audio tagging）等完整 sherpa-onnx Java 封装，配合 §3 的原生库在纯 Java 侧调用。

---

## 18. 磁盘副作用与诊断

运行后在游戏目录/配置目录生成/写入：
- `config/verity.toml`（Forge 配置）
- `config/verity/sherpa-model/`（STT 模型解压）
- `config/verity/sample_audio/`（自定义克隆音频目录）
- `config/verity_setup_done`、`config/verity-mod-flags.txt`
- 临时目录 `verity_tts_engine*`（Piper 模型解压，每次启动新目录）
- 日志 `verity_debug.log`、`verity_stream_diag.log`（游戏根目录）
- 浏览器/剪贴板 OAuth 交互

---

## 19. 安全与依赖提示

- `VerityAccountBridge.TRUST_ALL_HTTP` 信任所有 TLS 证书，代理模式下 LLM/TTS/STT 均走该客户端——中间人风险。
- 语音、对话与账户数据经 `bridge.veritycn.site`（非官方 mod 服务）传输；输入文本含 API Key 等配置。
- 依赖 sherpa-onnx + ONNX Runtime 1.24.4 原生库（4 平台内置，约 120 MB）。

---

## 20. 结语

Verity-cn 3.3 是 Verity 系列的离线增强中文整合版：保留了原作 Verity 实体、盒子、恶魔、Karma 系统，并完整内置了**离线 Whisper STT** 与 **Piper 本地 TTS**、加入 **MiMo 云端语音（TTS/克隆/唱歌）**、**OAuth 账户桥接（bridge.veritycn.site）**、多平台（含安卓启动器）语音管线、沉浸/友好模式及一整套进度触发器。全部行为均可由 `config/verity.toml` 控制。
