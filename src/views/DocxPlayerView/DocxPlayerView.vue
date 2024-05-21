<script lang="ts" setup>
import { useRoute } from "vue-router"

const route = useRoute()

onMounted(() => {
  console.log(route.query.url)
})
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
