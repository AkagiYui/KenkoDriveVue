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

<script setup lang="ts">
import SideMenu from "@/components/SideMenu.vue"
import UploadDrawer from "@/components/UploadDrawer.vue"
import { useUserInfo } from "@/stores/user-info"

const { renewUserInfo } = useUserInfo()

onBeforeMount(() => {
  renewUserInfo()
})
</script>
