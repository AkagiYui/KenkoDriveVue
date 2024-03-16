<template>
  <side-menu />
  <n-layout id="app-layout" content-style="height: 100%;" :style="{}">
    <n-scrollbar :class="{ 'block-scrollbar': false }">
      <n-back-top :right="50" />
      <router-view />
    </n-scrollbar>
  </n-layout>
</template>

<script setup lang="ts">
import { onMounted } from "vue"
import SideMenu from "@/components/SideMenu.vue"
import { useUserInfo } from "@/stores/user-info"
const { renewAvatar, renewUserInfo } = useUserInfo()

onMounted(() => {
  renewAvatar()
  renewUserInfo()
})
</script>
