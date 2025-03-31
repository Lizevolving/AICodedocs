<script setup>
import DefaultTheme from 'vitepress/theme'
import SideWidget from './components/SideWidget.vue'

const { Layout } = DefaultTheme
</script>

<template>
  <Layout>
    <template #layout-bottom>
      <SideWidget />
    </template>
  </Layout>
</template>

<style>
/* You can add any global styles needed for the layout here */
</style> 