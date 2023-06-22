<script setup lang="ts">
import { useCounterStore } from '@/stores/counter'
const store = useCounterStore()

window.$message.info('欢迎使用 Kenko Drive' + store.count)
</script>

<template>
  这里是 HomeView
  <n-gradient-text :size="36" type="info">
    Live Forever
  </n-gradient-text>
  <n-button @click="store.count+=1">{{ store.count }}</n-button>
</template>
