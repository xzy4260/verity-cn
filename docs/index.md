# Verity Forge — 模组实体完全解析

> **模组版本:** 5.7.2-cn (v2.5)  
> **Minecraft 版本:** 1.20.1 (Forge 47+)  
> **中国化作者:** xzy4260  
> **原模组作者:** Varmite, ThatMob (Creator of Verity)  
> **v3.0 合作:** [B站 涓星向凡](https://space.bilibili.com/3461565078571133)

---

## 目录

1. [模组概述](#1-模组概述)
2. [依赖与兼容性](#2-依赖与兼容性)
3. [实体系统](#3-实体系统)
4. [Karma 善恶系统](#4-karma-善恶系统)
5. [Demon 恶魔系统](#5-demon-恶魔系统)
6. [物品系统](#6-物品系统)
7. [方块与光照系统](#7-方块与光照系统)
8. [客户端渲染与 Mixin](#8-客户端渲染与-mixin)
9. [音效系统](#9-音效系统)
10. [开场动画与标题画面](#10-开场动画与标题画面)
11. [进度系统](#11-进度系统)
12. [命令系统](#12-命令系统)
13. [资源覆盖](#13-资源覆盖)
14. [配置系统](#14-配置系统)

---

## 1. 模组概述

**Verity** 是一个 Minecraft Forge 模组，将名为 Verity 的 NPC 实体引入游戏中。Verity 是一个具有完整情绪系统、复杂 AI 行为和丰富交互机制的伴侣型角色。同时，模组还包含一个恐怖的恶魔变体实体，在特定条件下会追逐、袭击玩家。

> **本文档聚焦 Verity 实体本身的机制与行为。** AI 对话（LLM/TTS/STT）的配置与使用说明见模组内配置界面。

### 核心特性一览

| 特性 | 描述 |
|------|------|
| **Verity NPC** | 具有 11 种情绪变体的 AI 伴侣实体，可跟随、对话 |
| **情绪纹理系统** | 11 种情绪 x 说话/非说话双状态 = 20+ 种纹理切换 |
| **纸箱生成动画** | Verity 从纸箱中出现的完整动画序列 |
| **Karma 善恶系统** | 好感度值，影响 Verity 的情绪、纹理和行为 |
| **恶魔系统** | 敌对变体实体，具有破窗、跟踪、破门等恐怖 AI 行为 |
| **动态手电筒** | 自定义 3D 手电筒，客户端动态光源 |
| **开场动画** | 248 帧的过场动画，替换标题画面 |
| **音乐唱片** | 两张自定义音乐唱片 |
| **进度系统** | 9 个自定义进度，追踪与 Verity 的互动 |

---

## 2. 依赖与兼容性

| 依赖 | 版本要求 |
|------|---------|
| Minecraft | 1.20.1 |
| Forge | 47+ |
| GeckoLib | 4.4+ |
| Yet Another Config Lib v3 | 3.6+ |

---

## 3. 实体系统

### 3.1 Verity NPC 实体

Verity 是模组的核心 NPC，使用 GeckoLib 进行 Bedrock 格式的模型和动画渲染。

#### 情绪纹理系统

Verity 拥有 **11 种情绪变体**，每种都有对应的说话纹理：

| 情绪 | 普通纹理 | 说话纹理 |
|------|---------|---------|
| 快乐 | `happy.png` | `happy_talking.png` |
| 快乐（睡眠） | `happy_sleep.png` | - |
| 中立 | `neutral.png` | `neutral_talking.png` |
| 严肃 1 | `serious_1.png` | `serious_talking.png` |
| 严肃 2 | `serious_2.png` | - |
| 严肃 3 | `serious_3.png` | - |
| 邪恶 | `evil.png` | `evil_talking.png` |
| 疯狂 | `crazy.png` | `crazy_talking.png` |
| 微笑邪恶 | `smiling_evil.png` | - |
| 受伤 | `hurt.png` | - |
| 无脸 | `noface.png` | - |

纹理通过 `VerityEntityTexture` 类根据当前 Karma 值和情绪状态实时切换。高 Karma 触发快乐/中立纹理，低 Karma 触发邪恶/疯狂纹理。

#### 动画系统

| 动画 | 时长 | 循环 | 描述 |
|------|------|------|------|
| `talk` | 0.42s | 是 | 说话时身体纵向缩放脉冲 (Y: 1.0 → 1.3 → 1.0) |
| `shake` | 0.08s | 是 | 快速左右抖动动画 |
| `box` | 3.75s | 否 | 从盒子中出现：下落、弹跳、拉伸压缩完整序列 |

#### 跟随 AI

Verity 包含内部 `FollowPlacerGoal`，会跟随放置它的玩家移动。移动行为受情绪状态和 Karma 值影响。

---

### 3.2 纸箱实体

纸箱是 Verity 出现的容器。当玩家使用 Verity 物品放置时，先生成纸箱，经过盒子打开动画后，Verity 从中出现。

#### 盒子模型

- 128×128 纹理
- 3 个骨骼：`box`（18×17×16 立方体）、`flap1`、`flap2`（平板盖板）

#### 盒子动画

| 动画 | 时长 | 循环 | 描述 |
|------|------|------|------|
| `hover` | 2.0s | 是 | 轻柔浮动 (Y: 0→2→0)，周期性缩放脉冲 (1.0→1.1) |
| `open` | 2.0s | 保持 | 盖板打开至 130°，盒子上升后缩小至 0.1，伴随 Verity 出现 |

#### 创造模式标签页

模组注册了名为 "Verity" 的创造模式标签页，包含所有 Verity 相关物品。

---

### 3.3 恶魔实体

详见 [第 5 节 - Demon 恶魔系统](#5-demon-恶魔系统)。

---

## 4. Karma 善恶系统

Karma 是衡量玩家与 Verity 关系好坏的核心数值系统。

### 数据模型

| 类 | 说明 |
|-----|------|
| `PlayerKarma` | 存储每个玩家的 Karma 值 |
| `PlayerKarmaProvider` | Forge Capability 提供者 |
| `ClientKarmaData` | 客户端 Karma 缓存 |

### HUD 渲染

Karma 值在屏幕快捷栏上方以进度条形式显示，使用 5 种状态纹理：

| 纹理 | 状态 |
|------|------|
| `karma_bar/angry.png` | 愤怒（低 Karma） |
| `karma_bar/empty.png` | 空条 |
| `karma_bar/full.png` | 满条 |
| `karma_bar/happy.png` | 快乐（高 Karma） |
| `karma_bar/neutral.png` | 中立 |

### 网络同步

`KarmaSyncS2CPacket` 负责服务端到客户端的 Karma 实时同步。

### Karma 行为映射

| Karma 范围 | 情绪 | 纹理 | 行为 |
|-----------|------|------|------|
| 高值 | 快乐/中立 | happy / neutral | 友好跟随、友善回应 |
| 中值 | 严肃 | serious_1/2/3 | 正常交互 |
| 低值 | 邪恶/疯狂 | evil / crazy | 敌意、可能触发恶魔 |
| 极低值 | 无脸/受伤 | noface / hurt | 求饶动画、特殊事件 |

当 Karma 变化时，`VerityPleadingHandler` 会在特定阈值触发求饶动画。进度系统也会响应 Karma 变化，触发 `karmachange`、`goodkarma`、`badkarma` 进度。

---

## 5. Demon 恶魔系统

恶魔是 Verity 的敌对变体。当 Karma 降至极低或特定条件触发时，恶魔会出现并开始猎杀玩家。

### 恶魔模型

- **纹理尺寸:** 256×256
- **实体尺寸:** 3×6.5 单位
- **骨骼结构:** 从 root 到 torso、chest、neck、head，含完整的下颚、嘴、牙齿骨骼链，以及大型翼状肩部附肢和双手指骨

### 恶魔动画 (9 种)

| 动画 | 时长 | 循环 | 描述 |
|------|------|------|------|
| `idle` | 1.0s | 是 | 呼吸摇晃，头部倾斜，手臂漂移 |
| `chase` | 0.25s | 是 | 快速奔跑步态，头部疯狂摆动 |
| `walk` | 1.0s | 是 | 标准行走，身体起伏，大手摆幅 |
| `attack` | 0.5s | 否 | 全身冲刺，双臂高举后猛击 |
| `crawl` | 0.5s | 是 | 蜘蛛式爬行，身体降至 Y=-23 |
| `climb` | 0.5s | 是 | 垂直攀爬（旋转 -90°） |
| `leap` | 1.33s | 否 | 跳跃攻击：蹲下→起跳→空中→落地→恢复 |
| `death` | 0.25s | 保持 | 身体下沉崩溃 |
| `walk_extra` | 1.17s | 是 | 附加骨骼行走周期 |

### AI Goal 系统 (5 个独立 AI 行为)

| AI Goal | 行为描述 |
|---------|---------|
| `DemonAttackGoal` | 对玩家的攻击行为控制 |
| `DemonBreakDoorGoal` | 破坏木门，强行进入建筑 |
| `DemonStareAndBreakGoal` | 凝视玩家后破坏周围方块 |
| `DemonGlassBreakAndLeapGoal` | **最恐怖行为**：打破玻璃窗、跳跃进入室内 |
| `DemonWindowStalkGoal` | 在窗外跟踪、注视玩家 |

### 自定义寻路

恶魔拥有完全自定义的路径导航系统：

- `DemonPathNavigation` — 特殊的路径搜索策略
- `DemonNodeEvaluator` — 允许恶魔穿越窗户、破坏门、攀爬墙壁等非标准路径移动

### 恶魔视觉效果

`VerityVisuals` 与 `LightTextureMixin` 协同工作，在恶魔出现时：

- 环境光照变暗
- 天空光级别被动态修改
- 创造恐怖氛围的视觉增强

### 恶魔音效

| 音效 | 类别 | 描述 |
|------|------|------|
| `chase` | ambient | 追逐时持续的恐怖背景音 |
| `bone_snap` | hostile | 骨骼折断声 |
| `bone_break` | hostile | 骨骼碎裂声 |
| `jumpscare` | hostile | 跳吓音效 |
| `impact_0/1/2` | ambient | 撞击声变体 |

`DemonChaseSoundInstance` 专门管理恶魔追逐音效的空间化播放。

---

## 6. 物品系统

### 物品列表

| 物品 | 说明 |
|------|------|
| Verity 物品 | 核心物品，右键放置纸箱，点击打开获得 Verity |
| 手电筒 | 自定义 3D 模型，动态光源 |
| Verity 唱片 | 音乐唱片 "Verity's Disc" |
| Verity 编辑唱片 | 音乐唱片 "Verity's Edit" |

### Verity 物品

- **模型:** GeckoLib 实体渲染（`minecraft:builtin/entity`）
- **情绪变体:** 通过 `VerityVariants` 支持与 NPC 相同的外观切换
- **自定义渲染:** `UnshadedBakedModel` + `VerityItemRenderer` 提供无阴影渲染

### 手电筒

- **模型:** Blockbench 3D 模型，2 个元素组成
- **纹理:** `flashlight.png`
- **功能:** 客户端动态光源（通过 `DynamicLightManager`）
- **服务端逻辑:** `FlashlightServerLogic`

### 音乐唱片

| 物品 | 音频 | 数据标签 |
|------|------|---------|
| `verity_disc` | `verity_disc.ogg` | 已添加到原版 `music_discs` 标签 |
| `verity_edit_disc` | `intro_video_audio.ogg` | 已添加到原版 `music_discs` 标签 |

---

## 7. 方块与光照系统

### 动态光源方块

手电筒使用无形的 `FlashlightLightBlock`，在玩家使用手电筒时动态生成，模拟动态光照。

光照渲染由 3 个类组成：
- `SphereEntityRenderer` — 球体实体渲染器
- `SphereMesh` — 球体网格生成
- `SphereRenderHelper` — 渲染辅助工具

### 光照 Mixin

`LightTextureMixin` 注入到 `LightTexture.updateLightTexture(float)`，在恶魔出现时动态修改天空光和方块光的色调与强度。

---

## 8. 客户端渲染与 Mixin

### Mixin 清单

| Mixin | 注入目标 | 功能 |
|-------|---------|------|
| `LightTextureMixin` | `LightTexture.updateLightTexture()` | 恶魔环境变暗、光照色调修改 |
| `TitleScreenMixin` | `TitleScreen.init()` | 替换全景背景、触发开场动画 |

### 其他客户端系统

| 组件 | 功能 |
|------|------|
| `DynamicLightManager` (含 `$Beam`) | 手电筒动态光束 |
| `AudioHudRenderer` | 屏幕上渲染音频状态 |
| `VerityPreviewTexture` | UI 中的 Verity 预览渲染 |
| `KarmaHudOverlay` | Karma 条 HUD |

---

## 9. 音效系统

### 完整音效事件

| 音效事件 | 类别 | 文件 | 说明 |
|---------|------|------|------|
| `box_open` | ambient | `box_open.ogg` | 盒子打开声 |
| `box_verity_0` | ambient | `box_verity_0.ogg` | Verity 盒子音效 |
| `box_verity_1` | ambient | `box_verity_1.ogg` | Verity 盒子音效 |
| `box_verity_2` | ambient | `box_verity_2.ogg` | Verity 盒子音效 |
| `box_click` | ambient | `box_click.ogg` | 盒子点击声 |
| `intro` | ambient | `intro.ogg` | 开场音效 |
| `impact_0/1/2` | ambient | 3 个文件 | 撞击声变体 |
| `verity_disc` | record | `verity_disc.ogg` | 唱片音乐 (流式) |
| `intro_video_audio` | ambient | `intro_video_audio.ogg` | 开场视频音频 |
| `chase` | ambient | `chase.ogg` | 恶魔追逐背景音 |
| `bone_snap` | hostile | `bone_snap.ogg` | 骨骼折断 |
| `bone_break` | hostile | `bone_break.ogg` | 骨骼碎裂 |
| `jumpscare` | hostile | `jumpscare.ogg` | 跳吓 |
| `verity_edit_disc` | record | `intro_video_audio.ogg` | 编辑唱片 (流式) |

---

## 10. 开场动画与标题画面

### 开场动画

模组包含 248 帧的过场动画：

- **帧文件:** `frame_0001.png` 至 `frame_0248.png`
- **音频:** `intro_video_audio.ogg`
- **触发:** `TitleScreenMixin` 在标题画面初始化时触发

### 标题画面修改

`TitleScreenMixin` 注入后替换：

1. **全景背景:** 6 张自定义全景图 (`panorama_0.png` 至 `panorama_5.png`)
2. **启动文本:** "He is waiting for you." (红色)
3. **开场动画:** 首次/特定条件下播放

---

## 11. 进度系统

### 进度树结构

```
root ("Hello, I'm Verity")
  └── talk ("Talk to Verity")
        ├── village ("Don't go east")  — 询问 Verity 最近的村庄
        ├── playsound ("Make a sound") — 让 Verity 发出声音
        ├── favoritesong ("Favorite Song") — 播放最爱歌曲
        └── karmachange ("Mood Change") — 影响 Verity 情绪
              ├── goodkarma ("Friendly Helper") — 让 Verity 开心
              └── badkarma ("I have feelings too") — 让 Verity 生气
```

### 自定义触发器 (8 个)

| 触发器 | 触发条件 |
|--------|---------|
| `OpenBoxTrigger` | 打开 Verity 的盒子 |
| `TalkTrigger` | 与 Verity 对话 |
| `VillageTrigger` | 询问最近的村庄 |
| `PlaySoundTrigger` | 让 Verity 发出声音 |
| `FavoriteSongTrigger` | 播放最爱歌曲 |
| `KarmaChangeTrigger` | Karma 值发生变化 |
| `GoodKarmaTrigger` | Karma 达到高值 |
| `BadKarmaTrigger` | Karma 达到低值 |

---

## 12. 命令系统

| 命令 | 功能 |
|------|------|
| `/verity karma` | 修改玩家的 Karma 值 |
| `/verity recover` | 恢复/重生 Verity 实体 |

---

## 13. 资源覆盖

### 原版资源修改

| 资源 | 说明 |
|------|------|
| `textures/colormap/foliage.png` | 自定义树叶颜色映射 |
| `textures/colormap/grass.png` | 自定义草地颜色映射 |
| `textures/gui/title/background/panorama_*.png` | 6 张自定义标题画面全景 |
| `texts/splashes.txt` | "He is waiting for you." |

### 模组资源统计

| 类型 | 数量 |
|------|------|
| GeckoLib 几何体 (`.geo.json`) | 2 |
| GeckoLib 动画 (`.animation.json`) | 3 |
| 物品模型 (`.json`) | 4 |
| 实体纹理 (`.png`) | 17+ |
| Karma HUD 纹理 | 5 |
| 开场帧 | 248 |
| 音效 (`.ogg`) | 16 |
| 语言文件 | 2 (en_us, zh_cn) |

---

## 14. 配置系统

模组使用 Yet Another Config Lib (YACL) v3 提供图形化配置界面。

v2.5 中国化版本重写了配置系统，拆分为四个独立板块：

| 板块 | 内容 |
|------|------|
| **通用** | 基础开关：可被踢出、开场动画、必须喊名字、极限黑暗、击杀村民等 |
| **个性化** | 纹理色调（360° HSL）、自定义名称、性格设置 |
| **LLM** | Base URL、API Key、模型名称（支持所有 OpenAI 兼容端点） |
| **TTS** | 三模式切换 + 音色选择 + 音色克隆（含 MiMo 端点选择） |
| **STT** | 双模式切换 + 自定义 API 配置 |

预置参考音频（音色克隆用）：Verity 默认、阿神同款、老牧师。

---

> *文档最后更新: 2026-07-21*  
> *作者: xzy4260 · [B站频道](https://space.bilibili.com/3706993095215271)*
