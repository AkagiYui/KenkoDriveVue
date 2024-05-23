<route lang="json">
{
  "name": "index-layout"
}
</route>

<script lang="ts" setup>
import SideMenu from "@/components/SideMenu.vue"
import UploadDrawer from "@/components/upload/UploadDrawer.vue"
import { useUserInfo } from "@/stores/user-info"

const { renewUserInfo } = useUserInfo()
renewUserInfo()
</script>

<template>
  <SideMenu />
  <UploadDrawer />
  <n-layout id="app-layout" content-style="height: 100%;" :style="{}">
    <n-scrollbar :class="{ 'block-scrollbar': false }">
      <n-back-top :right="50" />
      <router-view />
    </n-scrollbar>
  </n-layout>
</template>
