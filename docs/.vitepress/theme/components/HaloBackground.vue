<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'

let raf = 0
let cleanup = () => {}

onMounted(() => {
  const el = document.querySelector<HTMLElement>('.halo-bg')
  if (!el) return

  // 轻微跟随鼠标：幅度略增，但不明显偏离环游核心
  const onMove = (e: MouseEvent) => {
    const cx = window.innerWidth / 2
    const cy = window.innerHeight / 2
    const dx = (e.clientX - cx) * 0.03
    const dy = (e.clientY - cy) * 0.03
    const clamp = (v: number, m: number) => Math.max(-m, Math.min(m, v))
    const mx = clamp(dx, 38)
    const my = clamp(dy, 38)
    if (raf) cancelAnimationFrame(raf)
    raf = requestAnimationFrame(() => {
      el.style.setProperty('--mx', mx.toFixed(1) + 'px')
      el.style.setProperty('--my', my.toFixed(1) + 'px')
    })
  }

  window.addEventListener('mousemove', onMove, { passive: true })
  cleanup = () => window.removeEventListener('mousemove', onMove)
})

onBeforeUnmount(() => {
  if (raf) cancelAnimationFrame(raf)
  cleanup()
})
</script>

<template>
  <div class="halo-bg" aria-hidden="true">
    <div class="halo-center">
      <div class="halo-orbit">
        <!-- 不规则彩色光晕团：各自形变 + 色相旋转，叠加成发散变色的光晕 -->
        <div class="halo-blob b1"></div>
        <div class="halo-blob b2"></div>
        <div class="halo-blob b3"></div>
        <div class="halo-blob b4"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.halo-bg {
  position: fixed;
  inset: 0;
  z-index: -1;
  overflow: hidden;
  pointer-events: none;
  transform: translate3d(var(--mx, 0px), var(--my, 0px), 0);
  transition: transform 0.9s cubic-bezier(0.22, 0.7, 0.3, 1);
  will-change: transform;
}

/* 环形游动中心：屏幕中央偏上 */
.halo-center {
  position: absolute;
  top: 38%;
  left: 50%;
  width: 0;
  height: 0;
}

/* 整体缓慢绕核心小幅游动——基本不偏离核心位置 */
.halo-orbit {
  position: absolute;
  top: 0;
  left: 0;
  animation: haloOrbit 14s linear infinite;
}

/*
  不规则光晕团：
  - border-radius 取多个非对称值 + 形变动画 → 不规则轮廓，不是标准圆
  - 柔和单色径向发光（边缘透明）→ 像光晕，不做清晰渐变环
  - mix-blend-mode: screen 叠加多层不同色相 → 彩色发散感
*/
.halo-blob {
  position: absolute;
  mix-blend-mode: screen;
  filter: blur(64px);
  will-change: transform, filter, border-radius;
}

.b1 {
  width: 660px; height: 580px;
  left: -30px; top: 10px;
  margin: -300px 0 0 -330px;
  background:
    radial-gradient(58% 58% at 42% 46%, rgba(255, 95, 109, 0.85), rgba(255, 95, 109, 0) 72%),
    radial-gradient(48% 48% at 66% 62%, rgba(155, 107, 255, 0.7), rgba(155, 107, 255, 0) 72%);
  opacity: 0.72;
  animation: morph1 19s ease-in-out infinite, hue1 15s linear infinite,
             drift1 23s ease-in-out infinite;
}

.b2 {
  width: 540px; height: 620px;
  left: 40px; top: -20px;
  margin: -310px 0 0 -270px;
  background:
    radial-gradient(56% 56% at 50% 44%, rgba(79, 172, 254, 0.8), rgba(79, 172, 254, 0) 72%),
    radial-gradient(46% 46% at 38% 64%, rgba(125, 91, 255, 0.65), rgba(125, 91, 255, 0) 72%);
  opacity: 0.68;
  animation: morph2 23s ease-in-out infinite, hue2 18s linear infinite reverse,
             drift2 19s ease-in-out infinite;
}

.b3 {
  width: 460px; height: 420px;
  left: -10px; top: 30px;
  margin: -210px 0 0 -230px;
  background:
    radial-gradient(60% 60% at 46% 50%, rgba(91, 231, 169, 0.8), rgba(91, 231, 169, 0) 72%),
    radial-gradient(44% 44% at 64% 40%, rgba(255, 200, 113, 0.6), rgba(255, 200, 113, 0) 72%);
  opacity: 0.66;
  animation: morph3 15s ease-in-out infinite, hue1 12s linear infinite,
             drift3 17s ease-in-out infinite;
}

.b4 {
  width: 380px; height: 400px;
  left: 20px; top: -10px;
  margin: -200px 0 0 -190px;
  background:
    radial-gradient(58% 58% at 50% 52%, rgba(255, 216, 107, 0.75), rgba(255, 216, 107, 0) 72%),
    radial-gradient(46% 46% at 40% 44%, rgba(255, 126, 179, 0.6), rgba(255, 126, 179, 0) 72%);
  opacity: 0.6;
  animation: morph2 13s ease-in-out infinite, hue2 10s linear infinite reverse,
             drift1 15s ease-in-out infinite;
}

/* 整体环游：绕核心旋转（不偏离中心位置） */
@keyframes haloOrbit { to { transform: rotate(360deg); } }

/* 色相旋转（整体变色），模糊度保持一致 */
@keyframes hue1 { from { filter: blur(64px) hue-rotate(0deg); }   to { filter: blur(64px) hue-rotate(360deg); } }
@keyframes hue2 { from { filter: blur(64px) hue-rotate(0deg); }   to { filter: blur(64px) hue-rotate(360deg); } }

/* 不规则形变：border-radius 在几组非对称值之间流动，轮廓不再是标准圆 */
@keyframes morph1 {
  0%, 100% { border-radius: 42% 58% 63% 37% / 41% 44% 56% 59%; }
  33%      { border-radius: 60% 40% 38% 62% / 54% 60% 40% 46%; }
  66%      { border-radius: 37% 63% 55% 45% / 49% 38% 62% 51%; }
}
@keyframes morph2 {
  0%, 100% { border-radius: 55% 45% 47% 53% / 52% 58% 42% 48%; }
  34%      { border-radius: 38% 62% 60% 40% / 45% 39% 61% 55%; }
  67%      { border-radius: 63% 37% 42% 58% / 57% 47% 53% 43%; }
}
@keyframes morph3 {
  0%, 100% { border-radius: 47% 53% 58% 42% / 44% 55% 45% 56%; }
  40%      { border-radius: 58% 42% 44% 56% / 60% 41% 59% 40%; }
  70%      { border-radius: 41% 59% 53% 47% / 47% 53% 47% 53%; }
}

/* 层间轻微位移：不同方向/节奏的漂移，让相邻光团相互滑动 */
@keyframes drift1 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50%      { transform: translate(28px, -22px) scale(1.06); }
}
@keyframes drift2 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50%      { transform: translate(-26px, 20px) scale(0.94); }
}
@keyframes drift3 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50%      { transform: translate(18px, 26px) scale(1.05); }
}

@media (prefers-reduced-motion: reduce) {
  .halo-orbit,
  .halo-blob {
    animation: none !important;
  }
  .halo-bg { transform: none !important; transition: none !important; }
}
</style>
