# Verity 实体详解

> 本文档聚焦 Verity 实体的完整机制 —— 情绪系统、Karma 善恶、恶魔系统、物品、动画、进度。**不涉及 AI / LLM / TTS / STT 配置。**

## Verity NPC

Verity 是模组核心 NPC，使用 GeckoLib 渲染 Bedrock 格式模型。

### 情绪纹理 (11 种)

Verity 根据 Karma 值实时切换外观纹理，每种情绪都有对应说话和下说话两种状态：

| 情绪 | 纹理 | 说话纹理 | 触发条件 |
|------|------|---------|---------|
| 快乐 | `happy.png` | `happy_talking.png` | 高 Karma |
| 快乐（睡眠） | `happy_sleep.png` | - | 夜晚 / 休息 |
| 中立 | `neutral.png` | `neutral_talking.png` | 默认 |
| 严肃 1 | `serious_1.png` | `serious_talking.png` | 中低 Karma |
| 严肃 2 | `serious_2.png` | - | Karma 持续下降 |
| 严肃 3 | `serious_3.png` | - | Karma 临界 |
| 邪恶 | `evil.png` | `evil_talking.png` | 低 Karma |
| 疯狂 | `crazy.png` | `crazy_talking.png` | 极低 Karma |
| 微笑邪恶 | `smiling_evil.png` | - | 特定事件 |
| 受伤 | `hurt.png` | - | 受伤害时 |
| 无脸 | `noface.png` | - | 极恶意状态 |

### 动画

| 动画 | 时长 | 循环 | 描述 |
|------|------|------|------|
| `talk` | 0.42s | 是 | 说话时身体伸缩 (Y: 1.0→1.3→1.0) |
| `shake` | 0.08s | 是 | 左右抖动 |
| `box` | 3.75s | 否 | 从盒子出现：下落→弹跳→压缩拉伸 |

### 跟随 AI

Verity 内置 `FollowPlacerGoal`，自动跟随放置者。移动行为随情绪改变——快乐时紧跟、愤怒时保持距离。

---

## 纸箱实体

纸箱是 Verity 的容器。放置 Verity 物品时，先生成纸箱，开箱后 Verity 从中出现。

| 动画 | 时长 | 描述 |
|------|------|------|
| `hover` | 2.0s | 浮动：Y→2→0，缩放脉冲 1.0→1.1 |
| `open` | 2.0s | 开箱：盖板 130°，盒子上升后缩小消失 |

---

## Karma 善恶系统

Karma 是 Verity 的行为中枢，以 HUD 条显示在快捷栏上方。

| Karma 范围 | 情绪 | 纹理 | 行为 |
|-----------|------|------|------|
| 高 | 快乐/中立 | happy / neutral | 友好跟随、友善回应 |
| 中 | 严肃 | serious_1/2/3 | 正常交互 |
| 低 | 邪恶/疯狂 | evil / crazy | 敌意、可能触发恶魔 |
| 极低 | 无脸/受伤 | noface / hurt | 求饶动画、特殊事件 |

Karma HUD 使用 5 种状态条：`angry` / `empty` / `full` / `happy` / `neutral`。数值通过 `KarmaSyncS2CPacket` 实时同步。

---

## 恶魔系统

当 Karma 降至极低或特定条件触发时，恶魔出现并猎杀玩家。

### 模型

- 256×256 纹理 · 3×6.5 单位 · 含下颚/牙齿/翼状附肢/手指骨骼链

### 动画

| 动画 | 时长 | 描述 |
|------|------|------|
| `idle` | 1.0s | 呼吸摇晃，头部倾斜 |
| `chase` | 0.25s | 快速奔跑，头疯狂摆动 |
| `walk` | 1.0s | 身体起伏行走 |
| `attack` | 0.5s | 双臂高举猛击 |
| `crawl` | 0.5s | 蜘蛛式爬行 (Y=下降23单位) |
| `climb` | 0.5s | 垂直攀爬 |
| `leap` | 1.33s | 跳跃攻击：蹲→跳→空中→落地 |
| `death` | 0.25s | 崩溃死亡 |

### 5 个 AI 行为

| AI | 行为 |
|----|------|
| `DemonAttackGoal` | 攻击玩家 |
| `DemonBreakDoorGoal` | 破坏木门 |
| `DemonStareAndBreakGoal` | 凝视后破坏方块 |
| `DemonGlassBreakAndLeapGoal` | **打破玻璃跳入** |
| `DemonWindowStalkGoal` | 窗外跟踪 |

### 自定义寻路

恶魔拥有完全自定义的寻路系统 (`DemonPathNavigation` + `DemonNodeEvaluator`)，可穿越窗户、破坏门、攀爬墙壁。

### 视觉效果

`VerityVisuals` + `LightTextureMixin` 在恶魔出现时动态降低环境光照、修改天空光色调。

### 音效

| 音效 | 类型 | 描述 |
|------|------|------|
| `chase` | ambient | 追逐背景音 |
| `bone_snap` | hostile | 骨骼折断 |
| `bone_break` | hostile | 骨骼碎裂 |
| `jumpscare` | hostile | 跳吓 |
| `impact_0/1/2` | ambient | 撞击声变体 |

---

## 物品

| 物品 | 说明 |
|------|------|
| Verity 物品 | 右击放置纸箱，点击开箱获得 Verity（GeckoLib 实体渲染，11 种情绪变体） |
| 手电筒 | 3D Blockbench 模型，动态光源 |
| Verity 唱片 | `verity_disc` — 原声音乐 |
| Verity 编辑唱片 | `verity_edit_disc` — 复用开场音频 |

## 音效 (16 事件)

盒子音效：`box_open` / `box_verity_0~2` / `box_click`  
开场音效：`intro` / `intro_video_audio`  
唱片：`verity_disc` / `verity_edit_disc`（流式）  
恶魔音效：见上

---

## 开场动画

- 248 帧 (`frame_0001.png` ~ `frame_0248.png`) + `intro_video_audio.ogg`
- `TitleScreenMixin` 注入触发，替换标题画面全景 + 启动文本 "He is waiting for you."

---

## 进度系统 (9 个)

```
root → talk → village / playsound / favoritesong / karmachange
                                  karmachange → goodkarma / badkarma
```

8 个自定义触发器：`OpenBox` / `Talk` / `Village` / `PlaySound` / `FavoriteSong` / `KarmaChange` / `GoodKarma` / `BadKarma`

---

## 命令

| 命令 | 功能 |
|------|------|
| `/verity karma` | 修改 Karma 值 |
| `/verity recover` | 恢复 Verity 实体 |

---

> 更新于 2026-07-21 · 作者 xzy4260
