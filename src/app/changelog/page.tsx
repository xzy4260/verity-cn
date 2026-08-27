import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "更新日志 · Verity-cn Minecraft AI 伴侣模组版本记录",
  description: "Verity-cn Minecraft AI 伴侣模组的版本更新记录与新功能说明。",
  alternates: { canonical: "https://verity-cn.pages.dev/changelog" },
};

const changelog = [
  {
    v: "v3.4",
    date: "2026-08-21",
    title: "NCM 音乐系统 + 联网搜索 + 多人性能优化",
    sections: [
      {
        title: "NCM 音乐系统（全新）",
        items: [
          "歌曲搜索与播放：ncm_search 返回带编号的结果，AI 只需返回编号即可播放；搜索结果隐藏原始 ID，杜绝 LLM 编造歌曲",
          "保留 song_id 直接播放，用户明确给出 ID 时仍然可用",
          "多人游戏同步：主机音频去重不重复收听、新玩家中途加入自动同步播放进度与歌词、退出世界自动停止播放",
          "音乐音量 Ducking：TTS 播放时音乐 300ms 淡出至 15%，TTS 结束后 800ms 缓缓恢复",
        ],
      },
      {
        title: "联网搜索配置（全新）",
        items: [
          "新增「联网搜索」配置标签页，独立启用/禁用开关",
          "支持 Tavily、Brave、AnySearch 三种搜索引擎的 API Key 管理",
        ],
      },
      {
        title: "Android 平台适配",
        items: [
          "NCM 音乐走 OpenAL 播放：流式缓冲 PCM 后转 WAV 播放，动态选择 stereo/mono 格式",
          "修复 alGenBuffers 残留错误导致的播放失败",
          "Android 跳过流式 TTS 回退非流式路径；OpenAL 播放期间歌词位置精确同步",
        ],
      },
      {
        title: "性能优化",
        items: [
          "修复多人模式卡顿根因：记忆模块每 tick 扫描全世界实体，现改为 40 tick 节流 + 缓存最近玩家结果，扫描频率降低 98.75%",
        ],
      },
      {
        title: "歌词与口型动画",
        items: [
          "歌词闪烁修复：空歌词不再重置行索引；进度波动时行索引只向前跳，不来回跳变",
          "口型动画仅由 TTS 触发，听歌不再带动嘴巴；仅在剩余时间不足时延长，避免口型停不下来",
        ],
      },
      {
        title: "指令系统",
        items: [
          "/cnv locate tp：一键传送到 Verity 位置（背包→玩家位置，实体→实体坐标）",
          "/cnv mplay <songid>：直接播放指定歌曲 ID",
        ],
      },
      {
        title: "稳定性修复",
        items: [
          "麦克风 16000Hz 不支持时自动降级 44100Hz，修复部分设备崩溃",
          "OpenAL 音频格式按声道数动态选择；停止音乐时彻底清理 OpenAL 播放",
        ],
      },
      {
        title: "技术改进",
        items: [
          "新增 NCM 同步体系：NcmNetwork / NcmBroadcastHelper / NcmClientPlayer / NcmSyncS2CPacket / NcmClientExit",
          "新增补丁：PatchMicrophoneFallback（麦克风降级）/ PatchVerityPlatformOpenAl（OpenAL 错误清除）/ PatchNcmClientPlayerAndroid（Android 歌词位置）",
          "重构 NcmHelper（编号搜索 + index 播放）、VerityPlatform（完整 OpenAL 播放）、LyricHudRenderer、VerityTalkState、MemoryHelper、PersonaHelper、CnvCommand 等核心文件",
        ],
      },
    ],
  },
  {
    v: "v3.3",
    date: "2026-08",
    title: "友好模式 + 游戏内工具调用 + 配置整理",
    sections: [
      {
        title: "友好模式（FRIENDLY_MODE · cn 版独有）",
        items: [
          "屏蔽所有恶魔变身逻辑与恐怖内容",
          "性格完全由 karma 驱动：<7 冷淡、7-14 中立、14-20 友好、>20 极友好、≥9000 天使",
          "强制阻止击杀任何实体（含村民），真正成为「游戏助手」",
          "仍处于 beta 阶段，欢迎反馈",
        ],
      },
      {
        title: "游戏内工具调用",
        items: [
          "配方查询 get_recipe：LLM 被强制在玩家询问合成/烧炼时调用，实时返回真实游戏配方",
          "已安装 Mod 探查 get_all_mods：可列出当前游戏所有已安装模组",
        ],
      },
      {
        title: "老版物品给予机制（DROP_ITEM_LEGACY_MODE）",
        items: [
          "由 @埋藏心底的悲伤 提出并强烈请求恢复的能力",
          "开关 ON 时 LLM 可指定 item_id 给予各种物品；开关 OFF（默认）时仅给泥土",
        ],
      },
      {
        title: "自定义克隆音频开关",
        items: [
          "音色克隆支持自定义参考音频",
          "新增 USE_CUSTOM_CLONE_AUDIO 独立开关",
          "自定义音频目录：config/verity/sample_audio/",
        ],
      },
      {
        title: "稳定性修复",
        items: [
          "LLM 请求 60 秒超时，防止永久阻塞",
          "音频通道互斥管理：一次只播一个声音",
          "TTS 即时打断：新请求立即替换正在播放的 TTS",
          "断线自动停止发声",
        ],
      },
      {
        title: "技术改进",
        items: [
          "新增 VerityModFlags 独立标志位管理",
          "新增 PersonaHelper 动态人设辅助类",
          "新增 ModEventsMixin / VerityEntityMixin Mixin 注入",
          "v3.3 起移除 YACL 依赖",
        ],
      },
    ],
  },
  {
    v: "v3.2",
    date: "2026-07-28",
    title: "语速按钮 + 流式响应 + 自定义音色 + 黑屏开关",
    sections: [
      {
        title: "TTS 语速按钮控制",
        items: [
          "滑条改为按钮循环切换 7 档：极慢 → 放慢 → 原速 → 稍快 → 加快 → 很快 → 极快",
          "仅适配 MiMo 模型，通过音频标签控制语速",
          "新增 SpeedLevel 枚举与 SpeedHelper 桥接类",
        ],
      },
      {
        title: "MiMo 流式响应",
        items: [
          "边收边播真流式：收到第一个 SSE chunk 即开始播放",
          "仅 MiMo 端点生效，配置位置：Base URL 组底部「启用流式响应」",
        ],
      },
      {
        title: "自定义音色克隆",
        items: [
          "在 config/verity/sample_audio/ 目录放入 mp3 样本音频",
          "输入框填文件名（不带后缀）即可使用，留空回退预设音色",
          "音频建议 8-30 秒，单人单语言说话",
        ],
      },
      {
        title: "主菜单黑屏背景开关",
        items: [
          "新增「主菜单黑屏背景」配置，开启显示模组黑屏背景，关闭恢复 MC 原版全景",
          "修复 Mixin 长期未加载问题",
        ],
      },
    ],
  },
  {
    v: "v3.1",
    date: "2026-07-24",
    title: "修复 + 初始化配置向导",
    sections: [
      {
        title: "首次启动初始化配置向导",
        items: [
          "开场动画后弹出全屏初始化配置界面",
          "Verity Mod 授权提示 + 模型选择提示",
          "OAuth 授权流程：5 秒全屏提示 → 自动打开浏览器 → 2 分钟超时",
          "授权成功后检测模型连通性",
        ],
      },
      {
        title: "修复",
        items: [
          "下落叫声开关修复：FALL_SOUND_ENABLED 现在覆盖 causeFallDamage",
          "OAuth 授权状态判断修复：改为检查 status == complete",
          "LLM/STT/代理默认启用",
        ],
      },
    ],
  },
  {
    v: "v3.0",
    date: "2026-07-24",
    title: "Verity Mod 网站深度集成",
    sections: [
      {
        title: "Verity Mod 网站深度集成（核心更新）",
        items: [
          "Bridge 服务架构：启用后所有 LLM/TTS/STT 请求统一走 Verity Bridge 服务",
          "License Key 授权系统：密钥存储于 config/verity-client.toml",
          "Trust-all SSL 客户端：兼容自签名证书与各类代理环境",
          "LLM 请求 60 秒超时",
        ],
      },
      {
        title: "TTS 语音系统增强",
        items: [
          "即时中断机制：新 TTS 请求立即中断并替换正在播放的语音",
          "OpenAL 播放路径修复",
          "返回主菜单/断开时自动停止播放",
        ],
      },
      {
        title: "聊天消息本地化",
        items: [
          "I'm alone... → 我好孤单……你去哪了？",
          "Ayo chat... → 喂喂喂，怎么就让我这样消失了",
          "The darkness... → 黑暗……消散了。谢谢你。",
        ],
      },
    ],
  },
  {
    v: "v2.75",
    date: "2026-07-21",
    title: "模型自定义 + 皮肤系统",
    sections: [
      {
        title: "TTS/STT 模型名可配置",
        items: [
          "TTS 模型名：用户手动输入，默认 mimo-v2.5-tts",
          "STT 模型名：用户手动输入，默认 mimo-v2.5-asr",
        ],
      },
      {
        title: "自定义皮肤系统",
        items: [
          "将 16 张变体贴图（1024×1024 PNG）打包为 ZIP 放入 config/verity/skins/",
          "GUI 中输入 ZIP 文件名即可切换，切换瞬间生效",
          "智能回退：皮肤名无效时自动使用内置默认皮肤",
        ],
      },
    ],
  },
  {
    v: "v2.5",
    date: "2026-07-21",
    title: "中国化重构",
    sections: [
      {
        title: "AI 配置系统重构",
        items: [
          "LLM / TTS / STT 三板块独立配置",
          "LLM：支持任意 OpenAI 兼容 API（DeepSeek、通义千问、硅基流动等）",
          "TTS：三种模式 — 内置 Piper / Base URL / MiMo 音色克隆",
          "STT：两种模式 — 本地 Whisper / Base URL",
        ],
      },
      {
        title: "MiMo 深度集成",
        items: [
          "mimo-v2.5-tts + mimo-v2.5-tts-voiceclone + mimo-v2.5-asr",
          "预置 3 组参考音频：Verity 默认、阿神同款、老牧师",
        ],
      },
      {
        title: "界面完全重写",
        items: [
          "YACL GUI 全中文：分组标题、选项名、描述全部本地化",
          "TTS/STT 模式下拉菜单显示中文名称",
        ],
      },
    ],
  },
  {
    v: "v2.0",
    date: "2026-07",
    title: "安卓适配",
    sections: [
      {
        title: "TTS 语音合成",
        items: [
          "安卓端：通过 LWJGL OpenAL 播放 MiMo TTS 音频，适配 OpenSL 后端",
          "桌面端：保持 javax.sound.SourceDataLine 不变",
        ],
      },
      {
        title: "STT 语音识别",
        items: [
          "安卓端：通过 LWJGL JNI 直接采集麦克风",
          "支持启动器：ZalithLauncher 2.4.9+、PojavLauncher、FCL、HMCL-PE",
        ],
      },
    ],
  },
  {
    v: "v1.0",
    date: "2026-07",
    title: "首个中文版",
    sections: [
      {
        title: "配置系统重构",
        items: [
          "新增 VerityConfig.java：完整的 LLM/TTS/STT 三板块配置系统",
          "删除原版硬编码的 Groq API Key 和 OpenRouter 配置",
          "新增 AiProvider 枚举：添加 CUSTOM 选项，支持任意 OpenAI 兼容 API",
        ],
      },
      {
        title: "界面汉化",
        items: [
          "YACL 配置 GUI 全量中文化",
          "zh_cn.json 语言文件覆盖模组内所有可见文本",
          "AI 系统提示词改为中文",
        ],
      },
      {
        title: "修复",
        items: [
          "中文用户名麦克风崩溃修复",
          "首次启动 TTS 模型解压路径修复",
        ],
      },
    ],
  },
];

export default function ChangelogPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <Reveal>
        <Button variant="ghost" size="sm" className="gap-1 mb-6" render={<Link href="/" />}>
          <ArrowLeft className="size-3" />
          返回首页
        </Button>

        <h1 className="text-3xl font-semibold tracking-tight">更新日志</h1>
        <p className="mt-2 text-muted-foreground">
          Verity-cn 的版本更新记录。
        </p>
      </Reveal>

      <div className="mt-10 space-y-10">
        {changelog.map((c, i) => (
          <Reveal key={c.v} delay={i * 40}>
            <div className="rounded-xl border p-6">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold">{c.v}</h2>
                <span className="text-sm text-muted-foreground">{c.date}</span>
                {c.v === "v3.4" && <Badge variant="secondary" className="text-xs">最新</Badge>}
              </div>
              <p className="mt-1 text-sm font-medium text-muted-foreground">{c.title}</p>

              <div className="mt-6 space-y-5">
                {c.sections.map((s) => (
                  <div key={s.title}>
                    <h3 className="text-sm font-semibold">{s.title}</h3>
                    <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                      {s.items.map((item, j) => (
                        <li key={j}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
