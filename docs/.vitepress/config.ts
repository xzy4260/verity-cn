import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Verity-cn特供版',
  description: 'Verity 5.7.2 中文汉化 · 为中国玩家打造的 AI 伴侣模组',
  lang: 'zh-CN',
  lastUpdated: true,
  cleanUrls: true,
  server: {
    host: '0.0.0.0'
  },

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: 'data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>😄</text></svg>' }],
    ['meta', { name: 'theme-color', content: '#8b5cf6' }]
  ],

  themeConfig: {
    logo: { src: '/verity-icon.png', alt: 'Verity' },
    siteTitle: 'Verity-cn特供版',
    nav: [
      { text: '指南', link: '/guide/' },
      { text: 'Verity剖析', link: '/analysis/' },
      { text: '下载', link: '/download' },
      { text: '更新日志', link: '/changelog' },
      { text: '致谢', link: '/credits' },
    ],

    sidebar: {
      '/guide/': [
        {
          text: '使用指南',
          items: [
            { text: '快速开始', link: '/guide/' },
            { text: '配置 Verity', link: '/guide/config' },
            { text: '与 Verity 交互', link: '/guide/interact' },
          ]
        },
        {
          text: '进阶与参考',
          items: [
            { text: '高级自定义配置', link: '/guide/advanced' },
            { text: '免费 AI 服务商', link: '/guide/providers' },
            { text: 'AI 错误码', link: '/guide/errors' },
          ]
        }
      ]
    },

    '/analysis/': [
      {
        text: 'Verity 剖析',
        items: [
          { text: '完整行为分析', link: '/analysis/' },
          { text: 'JAR 结构与内置模型', link: '/analysis/#2-jar-顶层结构' },
          { text: '实体与恶魔机制', link: '/analysis/#5-实体与注册' },
          { text: '配置系统全解', link: '/analysis/#10-配置系统-forge-config-cloth-config' },
          { text: '语音管线与账户桥接', link: '/analysis/#9-首次运行-oauth-与账户桥接' },
          { text: '安全与依赖提示', link: '/analysis/#19-安全与依赖提示' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/xzy4260/verity-cn' }
    ],

    footer: {
      copyright: 'verity-cn · 基于 Verity 5.7.2'
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
