<template>
  <section class="about">
    <div class="about-card">
      <div class="about-main">
        <span class="about-eyebrow">ABOUT</span>
        <h2 class="about-title">关于 Verity-cn</h2>
        <p class="about-lead">
          Verity 是一个 Minecraft Forge 1.20.1 模组，为游戏加入由 AI 驱动的伴侣角色。
          本版（verity-cn）基于原版 5.7.2 进行中国化改造，让中文玩家开箱即用。
        </p>
        <div class="about-credits">
          <a class="credit" href="https://space.bilibili.com/3706993095215271" target="_blank" rel="noopener">
            <img class="credit-avatar img" src="/avatar-xzy.jpg" alt="xzy4260" />
            <span class="credit-meta">
              <span class="credit-role">作者</span>
              <span class="credit-name">xzy4260 · B站频道 ↗</span>
            </span>
          </a>
          <a class="credit" href="https://space.bilibili.com/3461565078571133" target="_blank" rel="noopener">
            <img class="credit-avatar img" src="/avatar-juan.jpg" alt="涓星向凡" />
            <span class="credit-meta">
              <span class="credit-role">Verity Mod 网站支持和 API 支持</span>
              <span class="credit-name">涓星向凡 · B站 ↗</span>
            </span>
          </a>
        </div>
      </div>

      <div class="about-list">
        <div class="about-item">
          <span class="about-mark"></span>
          <div class="about-item-text">
            <strong>去硬编码配置</strong>
            <span>移除原版写死的 Groq / OpenRouter 绑定，配置自由可控</span>
          </div>
        </div>
        <div class="about-item">
          <span class="about-mark"></span>
          <div class="about-item-text">
            <strong>三板块配置系统</strong>
            <span>新增 LLM / TTS / STT 独立配置，模块清晰易上手</span>
          </div>
        </div>
        <div class="about-item">
          <span class="about-mark"></span>
          <div class="about-item-text">
            <strong>全中文 GUI</strong>
            <span>界面与语言包中文化，选项分组清晰，一目了然</span>
          </div>
        </div>
        <div class="about-item">
          <span class="about-mark"></span>
          <div class="about-item-text">
            <strong>安卓完整适配</strong>
            <span>主流安卓启动器均可运行，移动端体验不打折</span>
          </div>
        </div>
        <div class="about-item">
          <span class="about-mark"></span>
          <div class="about-item-text">
            <strong>Verity Mod 网站深度集成</strong>
            <span>深度对接 Verity Mod 网站 Bridge 服务，零配置开箱即用</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts"></script>

<style scoped>
.about {
  margin-top: 64px;
}

.about-card {
  max-width: 1040px;
  margin: 0 auto;
  padding: 44px 44px 40px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 22px;
  background:
    radial-gradient(120% 130% at 0% 0%, var(--v-accent-soft), transparent 42%),
    var(--vp-c-bg-soft);
  display: grid;
  grid-template-columns: 0.85fr 1.15fr;
  gap: 48px;
  position: relative;
  overflow: hidden;
}

.about-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
  background: var(--v-grad);
  background-size: 200% 200%;
  opacity: 0.85;
  animation: rainbowShift 6s linear infinite;
}

.about-eyebrow {
  display: inline-block;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  color: var(--v-accent);
  margin-bottom: 14px;
}

.about-title {
  margin: 0;
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--vp-c-text-1);
}

.about-lead {
  margin: 16px 0 0;
  color: var(--vp-c-text-2);
  line-height: 1.7;
  font-size: 1rem;
}

.about-credits {
  margin-top: 28px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.credit {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 14px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  background: var(--vp-c-bg);
  text-decoration: none;
  color: inherit;
  transition: border-color 0.25s ease, transform 0.25s ease;
}
.credit:hover {
  border-color: var(--v-accent-ring);
  transform: translateY(-2px);
}
.credit-avatar {
  flex: 0 0 auto;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  object-fit: cover;
  background: var(--vp-c-bg);
  border: 2px solid transparent;
  background-clip: padding-box;
  box-shadow: 0 0 0 2px transparent;
  transition: box-shadow 0.25s ease, transform 0.25s ease;
}
.credit:hover .credit-avatar {
  box-shadow: 0 0 0 2px var(--v-accent-ring);
  transform: scale(1.05);
}
.credit-meta {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.credit-role {
  font-size: 0.72rem;
  color: var(--vp-c-text-2);
  letter-spacing: 0.04em;
}
.credit-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.about-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  align-content: center;
}
.about-item {
  display: flex;
  gap: 14px;
  align-items: flex-start;
  padding: 14px 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  background: var(--vp-c-bg);
  transition: border-color 0.25s ease, transform 0.25s ease;
}
.about-item:hover {
  border-color: var(--v-accent-ring);
  transform: translateY(-2px);
}
.about-mark {
  flex: 0 0 auto;
  width: 8px;
  height: 8px;
  margin-top: 7px;
  border-radius: 3px;
  background: var(--v-grad);
  background-size: 200% 200%;
  box-shadow: 0 0 0 4px var(--v-accent-soft);
  animation: rainbowShift 8s linear infinite;
}
.about-item-text {
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.about-item-text strong {
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--vp-c-text-1);
}
.about-item-text span {
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  line-height: 1.55;
}

@media (max-width: 720px) {
  .about-card {
    grid-template-columns: 1fr;
    gap: 28px;
    padding: 32px 22px;
  }
  .about-title { font-size: 1.6rem; }
  .about-credits { flex-direction: row; }
  .credit { flex: 1; }
}

/* 彩虹渐变流动（与全局 custom.css 同名，确保组件内可引用） */
@keyframes rainbowShift {
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
</style>
