<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import TopBar from '@/components/TopBar.vue'
import SideMenu from '@/components/SideMenu.vue'
import Message from '@/components/MessageApi.vue'
import { zhCN, dateZhCN, darkTheme, createLocale } from 'naive-ui'
import { useAppConfig } from '@/stores/app-config'

const { isDarkMode } = storeToRefs(useAppConfig())
const vh100 = ref(window.innerHeight)
const customizedLocale = createLocale(
  {
    Input: {
      placeholder: '请输入',
    },
  },
  zhCN,
)

function resize() {
  vh100.value = window.innerHeight
}

onMounted(() => {
  window.addEventListener('resize', resize)

  // 如果是生产环境，启动更新检测
  if (import.meta.env.PROD) {
    const worker = new Worker(new URL('./updateChecker.ts', import.meta.url), {
      type: 'module',
    })

    worker.postMessage({ url: `${window.location.protocol}//${window.location.host}` })
    worker.onmessage = (e) => {
      if (e.data === 1) {
        window.$message.warning('发现新版本，请刷新页面',{
          duration: 0,
          closable: true
        })
      }
    }
  }
})
onUnmounted(() => {
  window.removeEventListener('resize', resize)
})
</script>

<template>
  <n-config-provider
    :locale="customizedLocale"
    :date-locale="dateZhCN"
    :theme="isDarkMode ? darkTheme : null"
  >
    <n-loading-bar-provider>
      <n-message-provider>
        <n-dialog-provider>
          <n-notification-provider>
            <Message />
          </n-notification-provider>
        </n-dialog-provider>
      </n-message-provider>
    </n-loading-bar-provider>
    <n-layout :style="{ height: vh100 + 'px' }">
      <top-bar />
      <n-layout position="absolute" style="top: 64px" has-sider>
        <side-menu />
        <n-layout content-style="height: 100%;" id="app-layout" :style="{}">
          <n-scrollbar :class="{ 'block-scrollbar': false }">
            <n-back-top :right="50" />
            <router-view />
          </n-scrollbar>
        </n-layout>
      </n-layout>
    </n-layout>
  </n-config-provider>
</template>

<style scoped>
.n-scrollbar.block-scrollbar > .n-scrollbar-container > .n-scrollbar-content {
  height: 100%;
  width: 100%;
  overflow: hidden;
}
</style>
