<route lang="json">
{
  "name": "index-layout",
  "meta": {
    "requireAuth": true
  }
}
</route>

<script lang="ts" setup>
import MusicPlayer from "./MusicPlayer.vue"

const { renewUserInfo, isLoggedIn } = useUserInfo()
const router = useRouter()

renewUserInfo().catch(() => {
  // 未登录
  if (isLoggedIn) {
    window.$message.error("服务器连接失败，请检查网络连接")
  } else {
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
        <KeepAlive :exclude="['scanner']">
          <component :is="Component" :key="$route.fullPath" />
        </KeepAlive>
      </router-view>
    </n-scrollbar>
  </n-layout>
</template>
