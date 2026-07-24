import DefaultTheme from 'vitepress/theme'
import { onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRoute } from 'vitepress'
import AboutSection from './components/AboutSection.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('AboutSection', AboutSection)
  },
  setup() {
    const route = useRoute()
    let io: IntersectionObserver | null = null

    // 数字滚动计数（进入视口时触发一次）
    const runCounters = (root: ParentNode) => {
      root.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
        if (el.dataset.counted) return
        el.dataset.counted = '1'
        const target = parseFloat(el.dataset.count || '0')
        const suffix = el.dataset.suffix || ''
        const dur = 1300
        const start = performance.now()
        const tick = (now: number) => {
          const p = Math.min((now - start) / dur, 1)
          const eased = 1 - Math.pow(1 - p, 3)
          el.textContent = Math.round(target * eased) + suffix
          if (p < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      })
    }

    // 滚动观察：给 .reveal / .VPFeatures 加 .in，并触发内部计数
    const init = () => {
      const targets = document.querySelectorAll<HTMLElement>('.reveal, .VPFeatures')
      if (io) io.disconnect()
      io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue
            const el = entry.target as HTMLElement
            el.classList.add('in')
            runCounters(el)
            io!.unobserve(el)
          }
        },
        { threshold: 0.15, rootMargin: '0px 0px -6% 0px' }
      )
      targets.forEach((t) => io!.observe(t))
    }

    onMounted(() => init())
    watch(
      () => route.path,
      () => nextTick(() => init())
    )
    onUnmounted(() => io?.disconnect())
  }
}
