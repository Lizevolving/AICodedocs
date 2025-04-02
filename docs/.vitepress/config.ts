import { defineConfig } from 'vitepress'

// https://vitepress.vuejs.org/config/app-configs
export default defineConfig({
  base: '/AICodeDocs/',  // GitHub Pages 路径前缀
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
    
    // 极简配置，确保每个组都有items属性
    sidebar: [
      {
        text: '文档导航',
        items: [
          { text: '首页', link: '/' },
          { text: '设计策略', link: '/design/' },
          { text: '设计策略 - 防抖', link: '/design/Debounce' },
          { text: '设计策略 - 降级', link: '/design/FallbackStrategy' },
          { text: '设计策略 - 缓存', link: '/design/CachingStrategy' },
          { text: '设计策略 - 索引', link: '/design/DatabaseIndexing' },
          { text: '设计策略 - 错误处理', link: '/design/ErrorHandling' },
          { text: '设计策略 - 压缩', link: '/design/Compression' },
          { text: '设计策略 - CDN', link: '/design/CDN' },
          { text: '设计策略 - 异步', link: '/design/AsyncProcessing' },
          { text: '设计策略 - 懒加载', link: '/design/LazyLoading' },
          { text: '设计哲学', link: '/philosophy/' },
          { text: '设计哲学 - 简洁', link: '/philosophy/simplicity' },
          { text: '设计哲学 - 一致性', link: '/philosophy/consistency' },
          { text: '设计哲学 - 用户体验', link: '/philosophy/user-experience' },
          { text: '开发流程', link: '/development/' },
          { text: '开发 - 需求分析', link: '/development/requirements' },
          { text: '开发 - 技术选型', link: '/development/tech-stack' },
          { text: '开发 - 设计实现', link: '/development/implementation' },
          { text: '开发 - CI/CD', link: '/development/ci-cd' },
          { text: '开发 - 测试与部署', link: '/development/deployment' },
          { text: '常见问题', link: '/faq' },
          { text: '学习路径', link: '/learning-path' }
        ]
      }
    ],
    
    // 设置为空数组以隐藏导航栏
    nav: [],
    
    socialLinks: [
      { icon: 'github', link: 'https://github.com/Lizevolving/a-code-docs' }
    ],
    footer: {
      message: '使用 VitePress 构建',
      copyright: 'Copyright © 2025-present'
    },
    lastUpdatedText: '最后更新',
    outlineTitle: '目录',
    docFooter: {
      prev: '上一页',
      next: '下一页'
    }
  }
})
