// Theme customization
import { defineAsyncComponent } from 'vue'
import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import './styles/font.css'
import './styles/custom.css'
import SideWidget from './components/SideWidget.vue'
import Layout from './Layout.vue'

export default {
  ...DefaultTheme,
  Layout,
  // enhance the theme with custom components if needed
  enhanceApp({ app, router, siteData }) {
    // Register custom global components if needed
    app.component('SideWidget', SideWidget)
    
    // Setup a global variable to track theme changes, which is useful for dynamic theme-aware components
    if (typeof window !== 'undefined') {
      const htmlElement = document.documentElement
      
      // Watch for theme changes
      const observer = new MutationObserver(() => {
        const isDark = htmlElement.classList.contains('dark')
        app.config.globalProperties.$isDark = isDark
      })
      
      observer.observe(htmlElement, { 
        attributes: true, 
        attributeFilter: ['class']
      })
      
      // Initialize the value
      app.config.globalProperties.$isDark = htmlElement.classList.contains('dark')
      
      // 确保所有资源引用使用正确的基础路径
      const base = siteData.base || '/AICodeDocs/'
      app.config.globalProperties.$withBase = (path) => {
        // 如果路径为空或已经是完整URL，则直接返回
        if (!path || /^(https?:)?\/\//.test(path)) {
          return path
        }
        // 确保base以/结尾，path不以/开头
        const normalizedBase = base.endsWith('/') ? base : `${base}/`
        const normalizedPath = path.startsWith('/') ? path.slice(1) : path
        return `${normalizedBase}${normalizedPath}`
      }
    }
    
    // Add any additional theme enhancements here
    DefaultTheme.enhanceApp({ app, router, siteData })
  }
} 