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
const { url } = useRoute().query as { url: string }
</script>

<template>
  <DocxPreview id="player" :url="url"></DocxPreview>
</template>

<style scoped>
#player {
  width: 100%;
  height: 100%;
}
</style>
