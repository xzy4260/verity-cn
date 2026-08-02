<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import { useRoute } from 'vitepress'
import HomeFeatures from './components/HomeFeatures.vue'
import HaloBackground from './components/HaloBackground.vue'

const { Layout } = DefaultTheme
const route = useRoute()
</script>

<template>
  <Layout>
    <template #home-hero-before>
      <HaloBackground v-if="route.path === '/'" />
    </template>
    <template #home-hero-info-before>
      <a v-if="route.path === '/'" class="hero-badge" href="/changelog/">
        <span class="hero-badge-dot"></span>
        v3.3 现已发布
        <span class="hero-badge-arrow">↗</span>
      </a>
    </template>
    <template #home-features-before>
      <HomeFeatures v-if="route.path === '/'" />
    </template>
  </Layout>
</template>

<style scoped>
.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin: 0 auto 18px;
  padding: 6px 14px 6px 12px;
  border: 1px solid var(--v-accent-ring, rgba(139, 92, 246, 0.4));
  border-radius: 999px;
  background: var(--v-accent-soft, rgba(139, 92, 246, 0.1));
  color: var(--v-accent, #8b5cf6);
  font-size: 0.85rem;
  font-weight: 600;
  text-decoration: none;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}
.hero-badge:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(139, 92, 246, 0.2);
}
.hero-badge-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #22c55e;
  box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.18);
  animation: heroPulse 2s ease-in-out infinite;
}
.hero-badge-arrow {
  opacity: 0.7;
}
@keyframes heroPulse {
  0%, 100% { box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.18); }
  50% { box-shadow: 0 0 0 7px rgba(34, 197, 94, 0.05); }
}
@media (prefers-reduced-motion: reduce) {
  .hero-badge-dot { animation: none; }
}
</style>
