<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import TopBar from '@/components/TopBar.vue'
import SideMenu from '@/components/SideMenu.vue'
import Message from '@/components/MessageApi.vue'
import { zhCN, dateZhCN, darkTheme, createLocale } from 'naive-ui'
import { useAppConfig } from '@/stores/app-config'

const { isDarkMode } = storeToRefs(useAppConfig())
const customizedLocale = createLocale(
  {
    Input: {
      placeholder: '请输入',
    },
  },
  zhCN,
)

// 用于控制banner的显示
const banner = ref(import.meta.env.DEV)

onMounted(() => {

  // 如果是生产环境，启动更新检测
  if (import.meta.env.PROD) {
    const worker = new Worker(new URL('./updateChecker.ts', import.meta.url), {
      type: 'module',
    })

    worker.postMessage({ url: `${window.location.protocol}//${window.location.host}` })
    worker.onmessage = (e) => {
      if (e.data === 1) {
        window.$message.warning('发现新版本，请刷新页面', {
          duration: 0,
          closable: true,
        })
      }
    }
  }
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
    <div class="container">
      <div class="banner" v-show="banner">
        我未来可能是一个广告位，或者是一个banner
        <n-button type="error" @click="banner = false">
          关闭
        </n-button>
      </div>
      <n-layout class="main">
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
    </div>
  </n-config-provider>
</template>

<style scoped>
.n-scrollbar.block-scrollbar > .n-scrollbar-container > .n-scrollbar-content {
  height: 100%;
  width: 100%;
  overflow: hidden;
}

.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.banner {
  height: 40px;
  padding: 0 24px;
}

.main {
  flex-grow: 1;
}
</style>
