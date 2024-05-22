<route lang="json">
{
  "name": "docx-preview",
  "meta": {
    "title": "Docx预览",
    "isPlayer": true
  }
}
</route>

<script lang="ts" setup>
import { useRoute } from "vue-router"

const route = useRoute()
</script>

<template>
  <DocxPreview id="player" :url="route.query.url as string"></DocxPreview>
</template>

<style scoped>
#player {
  width: 100%;
  height: 100%;
}
</style>
