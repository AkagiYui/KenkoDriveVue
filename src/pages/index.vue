<route lang="json">
{
  "name": "index-layout"
}
</route>

<script lang="ts" setup>
import SideMenu from "@/components/SideMenu.vue"
import UploadDrawer from "@/components/upload/UploadDrawer.vue"
import { useUserInfo } from "@/stores/user-info"
import { useRouter } from "vue-router/auto"

const { renewUserInfo } = useUserInfo()
renewUserInfo().catch(() => {
  // 未登录
  window.$message.error("登录失效，请重新登录")
  const router = useRouter()
  router.replace("/login")
})
</script>

<template>
  <SideMenu />
  <UploadDrawer />
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
