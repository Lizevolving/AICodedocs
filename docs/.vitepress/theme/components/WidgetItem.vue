<template>
  <div class="widget-item">
    <div class="widget-item-label" v-if="label">{{ label }}</div>
    <div class="widget-item-content">
      <div class="widget-item-header">
        <div class="widget-item-icon" v-if="icon">
          <img :src="icon" :alt="title" class="widget-icon-image"/>
        </div>
        <div class="widget-item-title">{{ title }}</div>
      </div>
      <div class="widget-item-description">{{ description }}</div>
      <a 
        v-if="actionLink"
        :href="actionLink" 
        class="widget-item-action" 
        :target="isExternalLink(actionLink) ? '_blank' : '_self'"
      >
        {{ actionText }}
      </a>
    </div>
  </div>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  actionText: {
    type: String,
    default: '立即查看'
  },
  actionLink: {
    type: String,
    default: ''
  }
})

const isExternalLink = (link) => {
  return /^https?:\/\//.test(link)
}
</script>

<style scoped>
.widget-item {
  background-color: var(--vp-c-bg-soft);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  position: relative;
  transition: transform 0.2s, box-shadow 0.2s;
}

.widget-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
}

.widget-item-label {
  position: absolute;
  top: -10px;
  left: 16px;
  background-color: var(--vp-c-brand-1);
  color: white;
  font-size: 12px;
  font-weight: 500;
  padding: 2px 8px;
  border-radius: 12px;
}

.widget-item-header {
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.widget-item-icon {
  width: 30px;
  height: 30px;
  flex-shrink: 0;
}

.widget-icon-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.widget-item-title {
  font-weight: 600;
  font-size: 16px;
  color: var(--vp-c-text-1);
}

.widget-item-description {
  font-size: 14px;
  color: var(--vp-c-text-2);
  margin-bottom: 12px;
  line-height: 1.4;
}

.widget-item-action {
  display: inline-block;
  background-color: var(--vp-c-brand-3);
  color: white;
  font-size: 14px;
  font-weight: 500;
  padding: 6px 12px;
  border-radius: 4px;
  text-decoration: none;
  transition: background-color 0.2s;
}

.widget-item-action:hover {
  background-color: var(--vp-c-brand-2);
}
</style> 