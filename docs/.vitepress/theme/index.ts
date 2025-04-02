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
    }
    
    // Add any additional theme enhancements here
    DefaultTheme.enhanceApp({ app, router, siteData })
  }
} 