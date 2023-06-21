

<template>
  
  <n-config-provider :locale="zhCN" :date-locale="dateZhCN">
    <LayoutHead></LayoutHead>
    <router-view />
  </n-config-provider>
</template>

<script setup lang="ts">
  import { NConfigProvider, NInput, NDatePicker, NSpace } from 'naive-ui'
  import { zhCN, dateZhCN } from 'naive-ui'
  import LayoutHead from './components/layout/head.vue'
</script>

<style scoped>

</style>