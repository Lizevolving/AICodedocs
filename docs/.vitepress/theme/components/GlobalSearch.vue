<template>
  <div class="global-search" :class="{ 'active': isActive }">
    <!-- 搜索蒙层 -->
    <div class="search-overlay" v-if="isActive" @click="closeSearch"></div>
    
    <!-- 搜索弹窗 -->
    <div class="search-container" v-if="isActive">
      <div class="search-box">
        <div class="search-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-search"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        </div>
        <input 
          ref="searchInput"
          type="text" 
          v-model="searchQuery" 
          placeholder="搜索文档" 
          @input="performSearch"
          @keydown.up.prevent="navigateResults(-1)" 
          @keydown.down.prevent="navigateResults(1)"
          @keydown.enter="goToResult"
          @keydown.esc="closeSearch"
        />
        <div class="search-close" @click="closeSearch">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </div>
      </div>
      
      <!-- 状态指示 -->
      <div v-if="isSearching" class="search-status">
        <div class="search-loading">搜索中...</div>
      </div>
      
      <!-- 无结果提示 -->
      <div v-else-if="searchQuery && !isSearching && searchResults.length === 0 && !recentSearches.length" class="no-results">
        <div class="no-results-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-search"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        </div>
        <div class="no-results-text">没有找到相关结果</div>
      </div>
      
      <!-- 最近搜索 -->
      <div class="recent-searches" v-if="!searchQuery && recentSearches.length">
        <h3>最近搜索</h3>
        <ul>
          <li 
            v-for="(item, index) in recentSearches" 
            :key="index"
            :class="{ 'active': activeIndex === index && !searchQuery }"
            @click="selectResult(item)"
          >
            <div class="search-item">
              <div class="item-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-clock"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              </div>
              <div class="item-content">
                <div class="item-title">{{ item.text }}</div>
                <div class="item-description">{{ formatPath(item.path) }}</div>
              </div>
              <div class="item-close" @click.stop="removeRecent(index)">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </div>
            </div>
          </li>
        </ul>
      </div>
      
      <!-- 搜索结果 -->
      <div class="search-results" v-if="searchResults.length">
        <ul>
          <li 
            v-for="(result, index) in searchResults" 
            :key="index"
            :class="{ 'active': activeIndex === index && searchQuery }"
            @click="selectResult(result)"
          >
            <div class="search-item">
              <div class="item-content">
                <div class="item-title" v-html="highlightText(result.text, searchQuery)"></div>
                <div class="item-description">{{ formatPath(result.path) }}</div>
              </div>
            </div>
          </li>
        </ul>
      </div>
      
      <!-- 键盘导航提示 -->
      <div class="keyboard-nav">
        <span><span class="key">↓</span> <span class="key">↑</span> 导航</span>
        <span><span class="key">Enter</span> 选择</span>
        <span><span class="key">Esc</span> 关闭</span>
      </div>
    </div>
    
    <!-- 搜索按钮 (固定在页面上方) -->
    <div class="search-button" @click="openSearch">
      <div class="search-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-search"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
      </div>
      <span>搜索文档</span>
      <div class="shortcut">
        <span class="key">Ctrl</span>
        <span>+</span>
        <span class="key">K</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useRouter, useData } from 'vitepress'

const MAX_RECENT_SEARCHES = 5
const MIN_SEARCH_CHARS = 2 // 至少输入两个字符才开始搜索
const SEARCH_DELAY = 300 // 搜索延迟，避免频繁触发

const router = useRouter()
const { site, theme, page } = useData()

const isActive = ref(false)
const searchQuery = ref('')
const searchInput = ref(null)
const activeIndex = ref(-1)
const isSearching = ref(false)
const searchTimeout = ref(null)

// 从 localStorage 加载最近搜索记录
const recentSearches = ref([])
onMounted(() => {
  try {
    const saved = localStorage.getItem('vitepress-recent-searches')
    if (saved) {
      recentSearches.value = JSON.parse(saved).slice(0, MAX_RECENT_SEARCHES)
    }
  } catch (e) {
    console.error('Error loading recent searches:', e)
  }
})

// 保存最近搜索记录到 localStorage
function saveRecentSearches() {
  try {
    localStorage.setItem('vitepress-recent-searches', JSON.stringify(recentSearches.value))
  } catch (e) {
    console.error('Error saving recent searches:', e)
  }
}

// 实际搜索结果
const searchResults = ref([])

// 延迟搜索，防止频繁请求
function performSearch() {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }
  
  if (!searchQuery.value || searchQuery.value.length < MIN_SEARCH_CHARS) {
    searchResults.value = []
    isSearching.value = false
    return
  }
  
  isSearching.value = true
  
  searchTimeout.value = setTimeout(() => {
    doSearch()
  }, SEARCH_DELAY)
}

// 执行实际搜索
function doSearch() {
  const query = searchQuery.value.toLowerCase().trim()
  if (!query || query.length < MIN_SEARCH_CHARS) {
    searchResults.value = []
    isSearching.value = false
    return
  }
  
  // 获取所有页面数据
  const allPages = getAllPages()
  
  // 执行搜索匹配
  const results = allPages
    .filter(page => {
      const text = (page.text || '').toLowerCase()
      const title = (page.title || '').toLowerCase()
      return text.includes(query) || title.includes(query)
    })
    .map(page => ({
      text: page.title || page.path,
      path: page.path
    }))
    .slice(0, 15) // 限制结果数量
  
  searchResults.value = results
  isSearching.value = false
  activeIndex.value = results.length ? 0 : -1
}

// 获取所有页面数据的辅助函数
function getAllPages() {
  // 从侧边栏配置中获取所有页面
  const pages = []
  
  function extractLinks(items) {
    if (!items) return
    
    for (const item of items) {
      if (item.link) {
        pages.push({
          path: item.link,
          title: item.text,
          text: item.text // 实际应用中可以加载页面内容
        })
      }
      
      if (item.items) {
        extractLinks(item.items)
      }
    }
  }
  
  // 从 VitePress 配置中获取侧边栏数据 
  if (Array.isArray(theme.value.sidebar)) {
    // 处理数组形式的侧边栏
    extractLinks(theme.value.sidebar)
  } else if (typeof theme.value.sidebar === 'object') {
    // 处理对象形式的侧边栏
    Object.values(theme.value.sidebar).forEach(section => {
      extractLinks(section)
    })
  }
  
  console.log('All available pages:', pages)
  return pages
}

// 打开搜索
function openSearch() {
  isActive.value = true
  activeIndex.value = -1
  searchQuery.value = ''
  searchResults.value = []
  
  // 等待DOM更新后聚焦搜索框
  nextTick(() => {
    searchInput.value?.focus()
  })
}

// 关闭搜索
function closeSearch() {
  isActive.value = false
  searchQuery.value = ''
  activeIndex.value = -1
}

// 导航搜索结果
function navigateResults(step) {
  const items = searchQuery.value ? searchResults.value : recentSearches.value
  const resultCount = items.length
  
  if (resultCount === 0) return
  
  if (activeIndex.value === -1) {
    activeIndex.value = step > 0 ? 0 : resultCount - 1
  } else {
    activeIndex.value = (activeIndex.value + step + resultCount) % resultCount
  }
}

// 格式化路径显示
function formatPath(path) {
  if (!path) return ''
  
  // 移除前缀斜杠
  let formattedPath = path.replace(/^\//, '')
  
  // 将路径分段并大写首字母
  const segments = formattedPath.split('/').filter(Boolean)
  
  if (segments.length === 0) return '首页'
  
  return segments
    .map(segment => {
      // 对于 index.md 这类默认页面，使用其目录名
      if (segment === '' || segment === 'index') {
        return null
      }
      
      // 将 kebab-case 转换为更可读的格式
      return segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ')
    })
    .filter(Boolean)
    .join(' > ')
}

// 高亮匹配文本
function highlightText(text, query) {
  if (!query || !text) return text
  
  const sanitizedText = text.replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const sanitizedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  
  return sanitizedText.replace(
    new RegExp(`(${sanitizedQuery})`, 'gi'),
    '<mark>$1</mark>'
  )
}

// 获取 BASE_URL 的辅助函数
function getBaseUrl() {
  // 尝试从 import.meta.env 获取
  if (import.meta && import.meta.env && import.meta.env.BASE_URL) {
    return import.meta.env.BASE_URL
  }
  
  // 尝试从站点配置获取
  if (site.value && site.value.base) {
    return site.value.base
  }
  
  // 回退到 /AICodeDocs/
  return '/AICodeDocs/'
}

// 规范化路径
function normalizePath(path) {
  if (!path) return ''
  
  // 确保路径以 / 开头
  let normalized = path.startsWith('/') ? path : `/${path}`
  
  // 记录和分析路径
  console.log('Original path:', path)
  console.log('Normalized path:', normalized)
  console.log('BASE_URL:', getBaseUrl())
  
  return normalized
}

// 检查路径是否是完整URL
function isExternalLink(path) {
  return /^https?:\/\//.test(path)
}

// 选择结果
function selectResult(item) {
  if (!item || !item.path) return
  
  // 添加到最近搜索
  if (searchQuery.value) {
    addToRecentSearches({
      text: searchQuery.value,
      path: item.path
    })
  }
  
  // 处理路径
  const path = item.path
  
  // 如果是外部链接，直接在新窗口打开
  if (isExternalLink(path)) {
    window.open(path, '_blank')
    closeSearch()
    return
  }
  
  console.log('Navigating to:', path)
  
  // 导航到页面 - 使用简单直接的方法
  try {
    closeSearch()
    
    // 如果基本 URL 是 /AICodeDocs/
    // 确保我们生成正确的路径
    let finalPath = path
    if (finalPath === '/') {
      // 如果是根路径，直接使用基础 URL
      finalPath = getBaseUrl()
    } else {
      // 其他路径，确保只有一个斜杠分隔
      const baseUrl = getBaseUrl().replace(/\/$/, '')
      finalPath = path.startsWith('/') ? `${baseUrl}${path}` : `${baseUrl}/${path}`
    }
    
    console.log('Final navigation path:', finalPath)
    
    // 直接使用 window.location 
    window.location.href = finalPath
  } catch (err) {
    console.error('Navigation error:', err)
  }
}

// 添加到最近搜索
function addToRecentSearches(item) {
  if (!item.text || !item.path) return
  
  // 检查是否已存在
  const existingIndex = recentSearches.value.findIndex(
    recent => recent.text === item.text
  )
  
  // 如果已存在，先移除
  if (existingIndex !== -1) {
    recentSearches.value.splice(existingIndex, 1)
  }
  
  // 添加到数组开头
  recentSearches.value.unshift(item)
  
  // 限制数量
  if (recentSearches.value.length > MAX_RECENT_SEARCHES) {
    recentSearches.value = recentSearches.value.slice(0, MAX_RECENT_SEARCHES)
  }
  
  // 保存到localStorage
  saveRecentSearches()
}

// 前往选中的结果
function goToResult() {
  const items = searchQuery.value ? searchResults.value : recentSearches.value
  
  if (activeIndex.value >= 0 && activeIndex.value < items.length) {
    // 使用相同的导航方法
    selectResult(items[activeIndex.value])
  } else if (searchQuery.value && searchResults.value.length === 0) {
    // 如果有搜索词但没有结果，可以考虑执行一些默认行为
    console.log('No results found for query:', searchQuery.value)
  }
}

// 删除最近搜索项
function removeRecent(index) {
  recentSearches.value.splice(index, 1)
  saveRecentSearches()
}

// 监听键盘快捷键
onMounted(() => {
  const handleKeydown = (e) => {
    // 检查 Ctrl+K 组合键
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault()
      isActive.value ? closeSearch() : openSearch()
    }
  }
  
  window.addEventListener('keydown', handleKeydown)
  
  // 页面卸载时移除监听器
  return () => {
    window.removeEventListener('keydown', handleKeydown)
  }
})
</script>

<style scoped>
.global-search {
  --search-bg: #1e1e2e;
  --search-input-bg: #2d2d40;
  --search-border: #3d3d50;
  --search-text: rgba(235, 235, 245, 0.9);
  --search-text-light: rgba(235, 235, 245, 0.6);
  --search-accent: #6d6dfb;
  --search-item-hover: rgba(70, 70, 100, 0.5);
  --key-bg: rgba(255, 255, 255, 0.1);
}

.dark .global-search {
  --search-bg: #1e1e2e;
  --search-input-bg: #2d2d40;
  --search-border: #3d3d50;
  --search-text: rgba(235, 235, 245, 0.9);
  --search-text-light: rgba(235, 235, 245, 0.6);
}

:not(.dark) .global-search {
  --search-bg: #ffffff;
  --search-input-bg: #f5f5f5;
  --search-border: #e0e0e0;
  --search-text: rgba(60, 60, 67, 0.9);
  --search-text-light: rgba(60, 60, 67, 0.6);
}

/* 固定的搜索按钮 */
.search-button {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  display: flex;
  align-items: center;
  background-color: var(--search-input-bg);
  border: 1px solid var(--search-border);
  border-radius: 8px;
  padding: 8px 12px;
  color: var(--search-text);
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.2s ease;
  gap: 8px;
  width: auto;
  max-width: 300px;
}

.search-button:hover {
  background-color: var(--search-item-hover);
}

.search-button .search-icon {
  display: flex;
  color: var(--search-text-light);
}

.search-button .shortcut {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 2px;
  color: var(--search-text-light);
  font-size: 0.8rem;
}

.search-button .key {
  background-color: var(--key-bg);
  padding: 2px 4px;
  border-radius: 3px;
  font-size: 0.7rem;
}

/* 搜索蒙层 */
.search-overlay {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 999;
}

/* 搜索容器 */
.search-container {
  position: fixed;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 650px;
  max-height: calc(100vh - 160px);
  background-color: var(--search-bg);
  border-radius: 12px;
  z-index: 1000;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
}

/* 搜索框 */
.search-box {
  display: flex;
  align-items: center;
  padding: 16px;
  background-color: var(--search-bg);
  border-bottom: 1px solid var(--search-border);
}

.search-box input {
  flex: 1;
  background: transparent;
  border: none;
  padding: 8px 12px;
  font-size: 16px;
  color: var(--search-text);
  outline: none;
}

.search-box .search-icon,
.search-box .search-close {
  display: flex;
  color: var(--search-text-light);
  cursor: pointer;
}

.search-box .search-close:hover {
  color: var(--search-text);
}

/* 状态指示器 */
.search-status {
  padding: 20px;
  text-align: center;
  color: var(--search-text-light);
}

.no-results {
  padding: 30px 20px;
  text-align: center;
  color: var(--search-text-light);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.no-results-icon {
  opacity: 0.5;
}

/* 最近搜索和搜索结果样式 */
.recent-searches,
.search-results {
  padding: 8px 16px;
  overflow-y: auto;
  max-height: 50vh;
}

.recent-searches h3 {
  font-size: 12px;
  color: var(--search-text-light);
  text-transform: uppercase;
  margin: 8px 0;
  padding-bottom: 4px;
}

.recent-searches ul,
.search-results ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

li {
  margin: 4px 0;
  border-radius: 8px;
}

li.active,
li:hover {
  background-color: var(--search-item-hover);
}

.search-item {
  display: flex;
  align-items: flex-start;
  padding: 12px;
  cursor: pointer;
}

.item-icon {
  margin-right: 12px;
  color: var(--search-text-light);
}

.item-content {
  flex: 1;
}

.item-title {
  font-weight: 500;
  color: var(--search-text);
  margin-bottom: 4px;
}

.item-title :deep(mark) {
  background-color: rgba(109, 109, 251, 0.2);
  color: var(--search-accent);
  border-radius: 2px;
  padding: 0 2px;
}

.item-description {
  font-size: 0.85rem;
  color: var(--search-text-light);
}

.item-close {
  opacity: 0;
  color: var(--search-text-light);
  transition: opacity 0.2s;
}

.search-item:hover .item-close {
  opacity: 1;
}

/* 键盘导航提示 */
.keyboard-nav {
  display: flex;
  justify-content: space-between;
  padding: 12px 16px;
  border-top: 1px solid var(--search-border);
  color: var(--search-text-light);
  font-size: 0.8rem;
}

.keyboard-nav .key {
  background-color: var(--key-bg);
  padding: 2px 4px;
  border-radius: 3px;
  margin: 0 2px;
}
</style> 