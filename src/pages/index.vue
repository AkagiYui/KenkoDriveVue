<route lang="json">
{
  "name": "index-layout"
}
</route>

<script lang="ts" setup>
import { useRouter } from "vue-router/auto"
import SideMenu from "@/components/SideMenu.vue"
import MusicPlayer from "./MusicPlayer.vue"
import UploadDrawer from "@/components/upload/UploadDrawer.vue"
import { useUserInfo } from "@/stores/user-info"

const { renewUserInfo, isLoggedIn } = useUserInfo()
const router = useRouter()

renewUserInfo().catch(() => {
  // 未登录
  if (isLoggedIn) {
    window.$message.error("服务器连接失败，请检查网络连接")
  } else {
    window.$message.error("登录失效，请重新登录")
    router.replace("/login")
  }
})
</script>

<template>
  <SideMenu />
  <UploadDrawer />
  <MusicPlayer />
  <n-layout id="app-layout" content-style="height: 100%;" :style="{}">
    <n-scrollbar :class="{ 'block-scrollbar': false }">
      <n-back-top :right="50" />
      <router-view v-slot="{ Component }">
        <KeepAlive>
          <component :is="Component" :key="$route.fullPath" />
        </KeepAlive>
      </router-view>
    </n-scrollbar>
  </n-layout>
</template>
