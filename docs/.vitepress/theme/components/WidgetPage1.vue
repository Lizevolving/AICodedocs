<template>
  <div class="widget-page">
    <WidgetItem 
      label="支持微信/支付宝充值"
      icon="/yeka.png"
      title="Wildcard海外虚拟信用卡"
      description="支持ChatGPT、Claude订阅，Open AI API充值，无需海外手机号支持。充值优惠码：LIZ"
      actionText="立即查看"
      actionLink="https://yeka.ai/"
    />
  </div>
</template>

<script setup>
import WidgetItem from './WidgetItem.vue'
</script>

<style scoped>
.widget-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style> 