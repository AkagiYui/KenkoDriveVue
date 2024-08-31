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
const { url } = useRoute().query as { url: string }
</script>

<template>
  <VideoPlayer id="player" :url="url"></VideoPlayer>
</template>

<style scoped>
#player {
  width: 100%;
  height: 100%;
}
</style>
