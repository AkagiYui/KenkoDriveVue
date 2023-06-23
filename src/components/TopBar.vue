<script setup lang="ts">
import { useAppConfig } from '@/stores/app-config'
import { storeToRefs } from 'pinia'

const { isDarkMode } = storeToRefs(useAppConfig())
</script>

<template>
  <n-layout-header
    style="height: 64px; display: flex; align-items: center; justify-content: space-between"
    bordered
  >
    <div style="display: flex; align-items: center">
      <img src="/favicon.svg" style="height: 36px; margin-left: 24px" />
      <n-h1 style="margin: 0 0 0 24px"> Kenko Drive</n-h1>
      <n-popover trigger="hover">
        <template #trigger>
          <n-tag type="info" style='margin: 0 12px'>v1.0.0</n-tag>
        </template>
        <span>前端：v1.0.0，后端：v0.1.0</span>
      </n-popover>
      <n-switch v-model:value="isDarkMode" />
    </div>
    <div style="display: flex; align-items: center">
      <n-popover trigger="hover">
        <template #trigger>
          <n-avatar
            size="large"
            style="margin-right: 24px"
            src="avatar.gif"
          />
        </template>
        <span>这是头像</span>
      </n-popover>

    </div>
  </n-layout-header>
</template>

<style scoped>
.navbar {
  height: 60px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}
</style>
