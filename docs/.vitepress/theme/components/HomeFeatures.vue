<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'

const icons: Record<string, string> = {
  // 智能对话 —— 机器人
  robot: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="4.5" y="7.5" width="15" height="11.5" rx="3.2"/><line x1="12" y1="2.6" x2="12" y2="7.5"/><circle cx="12" cy="2.1" r="0.7" fill="currentColor" stroke="none"/><circle cx="9" cy="13" r="1.35"/><circle cx="15" cy="13" r="1.35"/><path d="M9.2 16.4h5.6"/><line x1="3" y1="10.8" x2="4.5" y2="10.8"/><line x1="3" y1="14.2" x2="4.5" y2="14.2"/><line x1="19.5" y1="10.8" x2="21" y2="10.8"/><line x1="19.5" y1="14.2" x2="21" y2="14.2"/></svg>`,
  // 语音合成 TTS —— 喇叭 + 声波
  sound: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3.6 9.2h3.1L11 5.4v13.2L6.7 14.8H3.6z"/><path d="M14.4 8.8c1.4 1.1 1.4 5.3 0 6.4"/><path d="M17 6.4c2.7 2 2.7 9.2 0 11.2"/></svg>`,
  // 语音识别 STT —— 麦克风
  mic: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0"/><line x1="12" y1="17.5" x2="12" y2="21"/><line x1="8.4" y1="21" x2="15.6" y2="21"/></svg>`,
  // 网站快捷配置 —— 云
  cloud: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6.8 19a4.4 4.4 0 0 1-.6-8.75 5.8 5.8 0 0 1 11.3-1.05A3.9 3.9 0 0 1 17.7 19z"/><path d="M9.4 14.6l1.7 1.7 3.5-3.6"/></svg>`,
  // 全中文界面 —— 地球/语言
  globe: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3c2.6 2.4 2.6 15.6 0 18M12 3c-2.6 2.4-2.6 15.6 0 18"/><path d="M5 7.5c3.2 1.6 10.8 1.6 14 0M5 16.5c3.2-1.6 10.8-1.6 14 0"/></svg>`,
  // 开箱即玩 —— 礼盒/方块
  box: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 7.6 12 3l8.5 4.6v8.8L12 21l-8.5-4.6z"/><path d="M3.5 7.6 12 12l8.5-4.4"/><path d="M12 12v9"/><path d="M8.2 5.2 12 7.4l3.8-2.2"/></svg>`,
}

const features = [
  { icon: 'robot', title: '智能对话', details: '通过 Verity Mod 网站配置 API，支持 DeepSeek、豆包及任意 OpenAI 兼容接口' },
  { icon: 'sound', title: '语音合成 TTS', details: '可自定义音色，Verity 开口说话更自然、更贴合角色设定' },
  { icon: 'mic',   title: '语音识别 STT', details: '长按 V 键即可语音对话，沉浸式的语音交互体验' },
  { icon: 'cloud', title: '网站快捷配置', details: '由 @涓星向凡 开发的 veritycn.site，注册即用，配置一键下发' },
  { icon: 'globe', title: '全中文界面', details: '完整中文 GUI 与语言包，选项分组清晰，国内玩家无障碍使用' },
  { icon: 'box',   title: '开箱即玩', details: '放入 mods 文件夹，使用 Java 21 启动即可，首次进入引导配置' },
]

const wrap = ref<HTMLElement | null>(null)
let io: IntersectionObserver | null = null

onMounted(() => {
  if (!wrap.value) return
  io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          ;(e.target as HTMLElement).classList.add('in')
          io!.unobserve(e.target)
        }
      }
    },
    { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
  )
  wrap.value.querySelectorAll<HTMLElement>('.hf-card').forEach((c) => io!.observe(c))
})

onBeforeUnmount(() => io?.disconnect())
</script>

<template>
  <div class="home-features-wrap" ref="wrap">
    <div class="hf-head">
      <span class="hf-eyebrow">FEATURES</span>
      <h2 class="hf-title">为国内玩家而生</h2>
      <p class="hf-sub">开箱即用的 AI 伴侣模组，从对话到语音，每一处都为中文环境打磨。</p>
    </div>

    <div class="hf-grid">
      <article
        v-for="(f, i) in features"
        :key="f.title"
        class="hf-card reveal"
        :style="{ '--i': i }"
      >
        <span class="hf-icon" :class="'hf-icon--' + f.icon" v-html="icons[f.icon]"></span>
        <h3 class="hf-card-title">{{ f.title }}</h3>
        <p class="hf-card-details">{{ f.details }}</p>
        <span class="hf-shine"></span>
      </article>
    </div>

    <div class="hf-note">
      <span class="hf-note-dot"></span>
      本修改版 <strong>永久免费</strong>，如遇任何收费行为请立刻举报。除合理调用 AI 服务商接口外，不存在任何付费项。
    </div>
  </div>
</template>

<style scoped>
.home-features-wrap {
  position: relative;
  z-index: 1;
  max-width: 1100px;
  margin: 8px auto 0;
  padding: 0 24px;
}

.hf-head {
  text-align: center;
  margin-bottom: 38px;
}
.hf-eyebrow {
  display: inline-block;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  background: var(--v-grad, linear-gradient(120deg, #3b82f6, #8b5cf6, #ec4899));
  background-size: 200% 200%;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: rainbowShift 6s linear infinite;
}
.hf-title {
  margin: 12px 0 0;
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--vp-c-text-1);
}
.hf-sub {
  margin: 10px auto 0;
  max-width: 34em;
  color: var(--vp-c-text-2);
  line-height: 1.65;
}

.hf-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
}

.hf-card {
  position: relative;
  overflow: hidden;
  padding: 28px 24px 26px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 18px;
  background: color-mix(in srgb, var(--vp-c-bg-soft) 88%, transparent);
  backdrop-filter: blur(6px);
  transition:
    transform 0.32s cubic-bezier(0.2, 0.7, 0.3, 1),
    border-color 0.3s ease,
    box-shadow 0.32s ease,
    background-color 0.3s ease;
}
.hf-card:hover {
  transform: translateY(-6px);
  border-color: var(--v-accent-ring, rgba(139, 92, 246, 0.4));
  box-shadow: 0 18px 40px rgba(124, 92, 246, 0.16);
  background: var(--vp-c-bg);
}

/* 入场动画 */
.hf-card.reveal {
  opacity: 0;
  transform: translateY(28px);
  transition:
    opacity 0.65s cubic-bezier(0.2, 0.7, 0.3, 1),
    transform 0.65s cubic-bezier(0.2, 0.7, 0.3, 1),
    border-color 0.3s ease,
    box-shadow 0.32s ease,
    background-color 0.3s ease;
  transition-delay: calc(var(--i) * 0.07s);
}
.hf-card.reveal.in {
  opacity: 1;
  transform: none;
}

.hf-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  margin-bottom: 16px;
  border-radius: 14px;
  color: #fff;
  background: var(--v-grad, linear-gradient(120deg, #8b5cf6, #ec4899));
  background-size: 160% 160%;
  box-shadow: 0 8px 20px rgba(139, 92, 246, 0.28);
  animation: rainbowShift 8s linear infinite;
  transition: transform 0.35s cubic-bezier(0.2, 0.7, 0.3, 1);
}
.hf-icon :deep(svg) {
  width: 26px;
  height: 26px;
}
.hf-card:hover .hf-icon {
  transform: translateY(-2px) scale(1.06) rotate(-3deg);
}

.hf-card-title {
  margin: 0;
  font-size: 1.08rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--vp-c-text-1);
}
.hf-card-details {
  margin: 8px 0 0;
  color: var(--vp-c-text-2);
  line-height: 1.62;
  font-size: 0.92rem;
}

/* 悬停高光扫光 */
.hf-shine {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(
    120px 120px at var(--mx, 50%) var(--my, 0%),
    rgba(255, 255, 255, 0.14),
    transparent 60%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
}
.hf-card:hover .hf-shine {
  opacity: 1;
}

.hf-note {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 30px;
  padding: 14px 18px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  background: color-mix(in srgb, var(--v-accent-soft, rgba(139, 92, 246, 0.1)) 70%, transparent);
  color: var(--vp-c-text-2);
  font-size: 0.92rem;
  text-align: center;
}
.hf-note strong {
  color: var(--v-accent, #8b5cf6);
}
.hf-note-dot {
  flex: 0 0 auto;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: var(--v-grad, linear-gradient(120deg, #8b5cf6, #ec4899));
  box-shadow: 0 0 0 4px var(--v-accent-soft, rgba(139, 92, 246, 0.12));
}

@media (max-width: 860px) {
  .hf-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 560px) {
  .hf-grid { grid-template-columns: 1fr; }
  .hf-title { font-size: 1.6rem; }
}

/* 彩虹渐变流动 */
@keyframes rainbowShift {
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@media (prefers-reduced-motion: reduce) {
  .hf-card.reveal { opacity: 1 !important; transform: none !important; transition: none !important; }
  .hf-icon, .hf-eyebrow { animation: none !important; }
}
</style>
