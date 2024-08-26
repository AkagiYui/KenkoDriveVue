<script setup lang="ts">
import { useRouter } from "vue-router/auto"
import { storeToRefs } from "pinia"
import {
  ArrowUpOutline,
  LogOutOutline,
  MoonOutline,
  PersonCircleOutline,
  SunnyOutline,
  ScanOutline,
} from "@vicons/ionicons5"
import { useAppConfig } from "@/stores/app-config"
import { useUserInfo } from "@/stores/user-info"
import { renderIcon } from "@/utils"
import QrCode from "@/components/QrCode.vue"

const { isDarkMode, isUploadDrawerShow, isDebugMode, uploadItemCount } = storeToRefs(useAppConfig())
const { nickname, isLoggedIn, avatarUrl } = storeToRefs(useUserInfo())
const { removeInfo } = useUserInfo()
const router = useRouter()

const hidePersonal = ref(true)
onMounted(async () => {
  // 在路由完成后再判断是否为播放器页面
  await router.isReady()
  const currentRoute = router.currentRoute.value
  hidePersonal.value = currentRoute.meta.isPlayer ?? currentRoute.name === "share" ?? false
})

const host = window.location.origin
const options = ref([
  {
    label: "个人信息",
    key: "info",
    icon: renderIcon(PersonCircleOutline),
  },
  {
    label: "扫一扫",
    key: "scan",
    icon: renderIcon(ScanOutline),
  },
  {
    label: "退出登录",
    key: "logout",
    icon: renderIcon(LogOutOutline),
  },
])
const onSelect = (key: string) => {
  switch (key) {
    case "info":
      router.replace("/settings")
      break
    case "scan":
      router.replace("/scanner")
      break
    case "logout":
      removeInfo()
      router.replace("/login")
      break
  }
}
</script>

<template>
  <n-layout-header style="height: 64px; display: flex; align-items: center; justify-content: space-between" bordered>
    <n-space style="margin-left: 36px; display: flex; align-items: center; height: 36px">
      <n-popover trigger="hover" title="网站二维码" :disabled="!isDebugMode">
        <template #header>
          <n-text depth="1" strong> 网站二维码，扫码立即体验</n-text>
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
      <n-button circle quaternary strong @click="isDarkMode = !isDarkMode">
        <template #icon>
          <n-icon :component="isDarkMode ? MoonOutline : SunnyOutline" />
        </template>
      </n-button>
      <n-badge v-if="isLoggedIn && !hidePersonal" :max="999" :value="uploadItemCount">
        <n-button circle secondary strong @click="isUploadDrawerShow = true">
          <template #icon>
            <n-icon :component="ArrowUpOutline" />
          </template>
        </n-button>
      </n-badge>
      <n-dropdown
        v-if="isLoggedIn && !hidePersonal"
        trigger="hover"
        :options="options"
        placement="bottom-end"
        @select="onSelect"
      >
        <n-space style="display: flex; align-items: center">
          <n-h4 style="margin: 0">
            {{ nickname }}
          </n-h4>
          <n-badge dot :show="isDebugMode">
            <n-avatar
              :size="32"
              :src="avatarUrl"
              :render-fallback="() => ''"
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
