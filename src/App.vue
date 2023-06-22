<script setup lang="ts">
import { RouterView } from 'vue-router'
import Message from '@/components/MessageApi.vue'
import { zhCN, dateZhCN, darkTheme } from 'naive-ui'
</script>

<template>
  <n-config-provider :locale="zhCN" :date-locale="dateZhCN" :theme="null">
    <n-loading-bar-provider>
      <n-message-provider>
        <n-dialog-provider>
          <n-notification-provider>
            <Message />
          </n-notification-provider>
        </n-dialog-provider>
      </n-message-provider>
    </n-loading-bar-provider>
    <RouterView />
  </n-config-provider>
</template>

<style scoped></style>
