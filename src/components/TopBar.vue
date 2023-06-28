<script setup lang="ts">
import QrcodeVue from 'qrcode.vue'
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppConfig } from '@/stores/app-config'
import { useUserInfo } from '@/stores/user-info'
import getAssetsUrl from '@/utils/pub-use'
import renderIcon from '@/utils/render-icon'
import { LogOutOutline, PersonCircleOutline } from '@vicons/ionicons5'

const { isDarkMode, isDebugMode } = storeToRefs(useAppConfig())
const { userName } = storeToRefs(useUserInfo())

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
        <qrcode-vue :value="host" :size="200" render-as="canvas" level="H" />
      </n-popover>
    </n-space>
    <n-space style="margin-right: 24px; display: flex; align-items: center; height: 64px">
      <n-switch v-if="isDebugMode" v-model:value="isDarkMode">
        <template #checked-icon> 🌙</template>
        <template #unchecked-icon> ☀️</template>
        <template #checked> 测试阶段</template>
        <template #unchecked> 全局暗色</template>
      </n-switch>
      <n-dropdown trigger="hover" :options="options">
        <n-space style="display: flex; align-items: center">
          <n-h4>{{ userName }}</n-h4>
          <n-badge dot :show="true">
            <n-avatar
              bordered
              :size="46"
              src="https://gravatar.loli.net/avatar/f481f2a9c66b7414da397c36868a2285"
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
