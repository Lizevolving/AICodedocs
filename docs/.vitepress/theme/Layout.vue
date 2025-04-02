<script setup>
import DefaultTheme from 'vitepress/theme'
import SideWidget from './components/SideWidget.vue'
import GlobalSearch from './components/GlobalSearch.vue'

const { Layout } = DefaultTheme
</script>

<template>
  <Layout>
    <template #layout-top>
      <GlobalSearch />
    </template>
    <template #layout-bottom>
      <SideWidget />
    </template>
  </Layout>
</template>

<style>
/* You can add any global styles needed for the layout here */
</style> 