<route lang="json">
{
  "name": "xlsx-preview",
  "meta": {
    "title": "Excel预览",
    "isPlayer": true
  }
}
</route>

<script lang="ts" setup>
import { useRoute } from "vue-router"

const route = useRoute()
</script>

<template>
  <XlsxPreview id="player" :url="route.query.url as string"></XlsxPreview>
</template>

<style scoped>
#player {
  width: 100%;
  height: 100%;
}
</style>
