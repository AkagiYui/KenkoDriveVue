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
const { url } = useRoute().query as { url: string }
</script>

<template>
  <XlsxPreview id="player" :url="url"></XlsxPreview>
</template>

<style scoped>
#player {
  width: 100%;
  height: 100%;
}
</style>
