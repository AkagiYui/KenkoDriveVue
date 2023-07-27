<template>
  <side-menu />
  <n-layout content-style="height: 100%;" id="app-layout" :style="{}">
    <n-scrollbar :class="{ 'block-scrollbar': false }">
      <n-back-top :right="50" />
      <router-view />
    </n-scrollbar>
  </n-layout>
</template>

<script setup lang="ts">
import SideMenu from '@/components/SideMenu.vue'
</script>
