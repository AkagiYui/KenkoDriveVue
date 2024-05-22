<script lang="ts" setup>
import ArtPlayer from "artplayer"

const props = defineProps<{
  url: string
}>()

let instance: ArtPlayer | undefined = undefined
const artRef = ref<HTMLDivElement | null>(null)
onMounted(() => {
  instance = new ArtPlayer({
    url: props.url,
    container: artRef.value!,
    fullscreen: true,
    theme: "#36ad6a",
    setting: true,
    pip: true,
    playbackRate: true,
    flip: true,
    aspectRatio: true,
  })
})
onUnmounted(() => {
  instance?.destroy()
})
</script>

<template>
  <div ref="artRef"></div>
</template>

<style scoped></style>
