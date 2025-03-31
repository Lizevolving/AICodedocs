<template>
  <div class="side-widget" :class="{ 'side-widget-expanded': isExpanded }">
    <button class="side-widget-toggle" @click="toggleExpand">
      {{ isExpanded ? '›' : '‹' }}
    </button>
    
    <transition name="slide">
      <div class="side-widget-content" v-if="isExpanded">
        <div class="side-widget-header">
          <div class="side-widget-pagination">
            <span class="side-widget-pagination-text">{{ currentPage + 1 }}/{{ pages.length }}</span>
            <div class="side-widget-pagination-dots">
              <span 
                v-for="(_, i) in pages" 
                :key="i" 
                :class="{ 'active': i === currentPage }"
                @click="currentPage = i"
              ></span>
            </div>
          </div>
        </div>
        
        <transition name="fade" mode="out-in">
          <div class="side-widget-page" :key="currentPage">
            <component 
              :is="pages[currentPage]" 
              v-if="pages.length > 0"
            />
          </div>
        </transition>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import WidgetPage1 from './WidgetPage1.vue'
import WidgetPage2 from './WidgetPage2.vue'

const isExpanded = ref(false)
const currentPage = ref(0)

// Pages to display in the widget
const pages = [
  WidgetPage1,
  WidgetPage2
]

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
}

// Auto-expand after a delay when the component is mounted
onMounted(() => {
  setTimeout(() => {
    isExpanded.value = true
  }, 2000)
  
  // Auto-rotate pages
  setInterval(() => {
    if (isExpanded.value) {
      currentPage.value = (currentPage.value + 1) % pages.length
    }
  }, 15000)
})
</script>

<style scoped>
.side-widget {
  position: fixed;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  z-index: 100;
  display: flex;
  transition: all 0.3s ease;
}

.side-widget-toggle {
  width: 24px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--vp-c-brand-3);
  color: white;
  border: none;
  border-radius: 4px 0 0 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.2s;
}

.side-widget-toggle:hover {
  background-color: var(--vp-c-brand-2);
}

.side-widget-content {
  width: 300px;
  max-height: 400px;
  background-color: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-right: none;
  border-radius: 8px 0 0 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.side-widget-header {
  padding: 12px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.side-widget-pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.side-widget-pagination-text {
  font-size: 12px;
  color: var(--vp-c-text-2);
}

.side-widget-pagination-dots {
  display: flex;
  gap: 6px;
}

.side-widget-pagination-dots span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--vp-c-gray-3);
  cursor: pointer;
  transition: background-color 0.2s;
}

.side-widget-pagination-dots span.active {
  background-color: var(--vp-c-brand-1);
}

.side-widget-page {
  padding: 16px;
  overflow-y: auto;
  flex: 1;
}

/* Transition Effects */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .side-widget-content {
    width: 280px;
    max-height: 350px;
  }
}
</style> 