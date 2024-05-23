<route lang="json">
{
  "name": "video-preview",
  "meta": {
    "title": "视频预览",
    "isPlayer": true
  }
}
</route>

<script lang="ts" setup>
import { useRoute } from "vue-router"

const route = useRoute()
</script>

<template>
  <VideoPlayer id="player" :url="route.query.url as string"></VideoPlayer>
</template>

<style scoped>
#player {
  width: 100%;
  height: 100%;
}
</style>
