import { defineConfig } from 'vitepress'

// https://vitepress.vuejs.org/config/app-configs
export default defineConfig({
  base: '/AICodeDocs/',  // 替换为你的仓库名
  title: '技术文档库',
  description: '系统架构与设计模式的技术文档',
  lang: 'zh-CN',
  lastUpdated: true,
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'theme-color', content: '#3c8772' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
  ],
  themeConfig: {
    logo: '/logo.svg',
    nav: [
      { text: '首页', link: '/' },
      { 
        text: '技术文档',
        items: [
          { text: '设计策略', link: '/design/' },
          { text: '设计哲学', link: '/philosophy/' },
          { text: '网站开发流程', link: '/development/' }
        ]
      },
      { 
        text: '更多资源',
        items: [
          { text: '常见问题', link: '/faq' },
          { text: '学习路径', link: '/learning-path' }
        ]
      }
    ],
    sidebar: {
      '/design/': [
        {
          text: '设计策略',
          items: [
            { text: '防抖策略', link: '/design/Debounce' },
            { text: '降级策略', link: '/design/FallbackStrategy' },
            { text: '缓存策略', link: '/design/CachingStrategy' },
            { text: '数据库索引', link: '/design/DatabaseIndexing' },
            { text: '错误处理', link: '/design/ErrorHandling' },
            { text: '压缩技术', link: '/design/Compression' },
            { text: 'CDN分发', link: '/design/CDN' },
            { text: '异步处理', link: '/design/AsyncProcessing' },
            { text: '懒加载', link: '/design/LazyLoading' }
          ]
        }
      ],
      '/philosophy/': [
        {
          text: '设计哲学',
          items: [
            { text: '简介', link: '/philosophy/' },
            { text: '简洁原则', link: '/philosophy/simplicity' },
            { text: '一致性原则', link: '/philosophy/consistency' },
            { text: '用户体验', link: '/philosophy/user-experience' }
          ]
        }
      ],
      '/development/': [
        {
          text: '网站开发流程',
          items: [
            { text: '概述', link: '/development/' },
            { text: '需求分析', link: '/development/requirements' },
            { text: '技术选型', link: '/development/tech-stack' },
            { text: '设计与实现', link: '/development/implementation' },
            { text: 'CI/CD 配置', link: '/development/ci-cd' },
            { text: '测试与部署', link: '/development/deployment' }
          ]
        }
      ]
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com' }
    ],
    footer: {
      message: '使用 VitePress 构建',
      copyright: 'Copyright © 2023-present'
    },
    lastUpdatedText: '最后更新',
    outlineTitle: '目录',
    docFooter: {
      prev: '上一页',
      next: '下一页'
    }
  }
})
