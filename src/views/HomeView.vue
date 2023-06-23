<script setup lang="ts">
import { useCounterStore } from '@/stores/counter'

const store = useCounterStore()

window.$message.info('欢迎使用 Kenko Drive' + store.count)
</script>

<template>
  <div>
    这里是 HomeView
    <n-button @click="store.count += 1">{{ store.count }}</n-button>
  </div>
</template>
