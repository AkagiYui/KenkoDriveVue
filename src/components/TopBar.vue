<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAppConfig } from '@/stores/app-config'
import { useUserInfo } from '@/stores/user-info'
import getAssetsUrl from '@/utils/pub-use'
import renderIcon from '@/utils/render-icon'
import { LogOutOutline, PersonCircleOutline } from '@vicons/ionicons5'
import QrCode from '@/components/QrCode.vue'

const { isDarkMode, isDebugMode } = storeToRefs(useAppConfig())
const { nickname, isLoggedIn, avatarUrl } = storeToRefs(useUserInfo())
const { deleteToken } = useUserInfo()
const router = useRouter()

const host = window.location.origin
const options = ref([
  {
    label: '个人信息',
    key: 'info',
    icon: renderIcon(PersonCircleOutline),
  },
  {
    label: '退出登录',
    key: 'logout',
    icon: renderIcon(LogOutOutline),
  },
])
const onSelect = (key: string) => {
  switch (key) {
    case 'info':
      router.replace('/settings')
      break
    case 'logout':
      deleteToken()
      window.location.reload()
      break
  }
}
</script>

<template>
  <n-layout-header
    style="height: 64px; display: flex; align-items: center; justify-content: space-between"
    bordered
  >
    <n-space style="margin-left: 36px; display: flex; align-items: center; height: 36px">
      <n-popover trigger="hover" title="网站二维码" :disabled="!isDebugMode">
        <template #header>
          <n-text strong depth="1"> 网站二维码，扫码立即体验</n-text>
        </template>
        <template #trigger>
          <router-link to="/">
            <n-space style="height: 36px">
              <n-image
                src="/favicon.svg"
                width="36"
                preview-disabled
                :img-props="{
                  alt: 'logo',
                }"
              />
              <n-h2> Kenko Drive</n-h2>
            </n-space>
          </router-link>
        </template>
        <QrCode :value="host" :size="200" />
      </n-popover>
    </n-space>
    <n-space style="margin-right: 24px; display: flex; align-items: center; height: 64px">
      <n-switch v-if="isDebugMode" v-model:value="isDarkMode">
        <template #checked-icon> 🌙</template>
        <template #unchecked-icon> ☀️</template>
        <template #checked> 测试阶段</template>
        <template #unchecked> 全局暗色</template>
      </n-switch>
      <n-dropdown v-if="isLoggedIn" trigger="hover" :options="options" placement="bottom-end" @select="onSelect">
        <n-space style="display: flex; align-items: center">
          <n-h4 style="margin: 0">{{ nickname }}</n-h4>
          <n-badge dot :show="isDebugMode">
            <n-avatar
              :size="32"
              :src="avatarUrl"
              :fallback-src="getAssetsUrl('default-avatar.jpg')"
              :img-props="{
                alt: 'avatar',
              }"
            />
          </n-badge>
        </n-space>
      </n-dropdown>
    </n-space>
  </n-layout-header>
</template>

<style scoped>
a {
  text-decoration: none;
}

.pop-button {
  width: 140px;
}
</style>
