import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Verity-cn特供版',
  description: 'Verity 5.7.2 中文汉化 · 安卓适配 · Verity 实体完全解析',
  lang: 'zh-CN',
  lastUpdated: true,
  cleanUrls: true,

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: 'data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>😄</text></svg>' }],
    ['meta', { name: 'theme-color', content: '#6366f1' }]
  ],

  themeConfig: {
    logo: { src: '/verity-icon.png', alt: 'Verity' },
    siteTitle: 'Verity-cn特供版',
    nav: [
      { text: '指南', link: '/guide/' },
      { text: '安卓版', link: '/android/' },
      { text: 'Verity 详解', link: '/guide/verity-entity' },
      { text: '开发', link: '/dev/' },
      { text: '下载', link: '/download' },
      { text: '更新日志', link: '/changelog' },
    ],

    sidebar: {
      '/guide/': [
        {
          text: '使用指南',
          items: [
            { text: '快速开始', link: '/guide/' },
            { text: 'LLM 对话配置', link: '/guide/llm' },
            { text: 'TTS 语音配置', link: '/guide/tts' },
            { text: 'STT 语音识别', link: '/guide/stt' },
            { text: 'MiMo API 设置', link: '/guide/mimo' },
            { text: 'Verity 实体详解', link: '/guide/verity-entity' },
          ]
        }
      ],
      '/android/': [
        {
          text: '安卓适配',
          items: [
            { text: '概述', link: '/android/' },
            { text: '支持的启动器', link: '/android/launchers' },
            { text: '麦克风配置', link: '/android/mic' },
            { text: '已知限制', link: '/android/limits' },
          ]
        }
      ],
      '/dev/': [
        {
          text: '开发者文档',
          items: [
            { text: '架构概述', link: '/dev/' },
            { text: '平台适配原理', link: '/dev/platform' },
            { text: 'ALC Capture 桥接', link: '/dev/alc-bridge' },
            { text: '构建指南', link: '/dev/build' },
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/xzy4260/verity-cn' }
    ],

    footer: {
      message: '作者 xzy4260 · v3.0 将与 B站 涓星向凡 合作开发',
      copyright: 'Verity 模组永久免费 · 如遇收费请举报'
    },

    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: '搜索' },
          modal: { noResultsText: '无结果', resetButtonTitle: '清除' }
        }
      }
    }
  }
})
