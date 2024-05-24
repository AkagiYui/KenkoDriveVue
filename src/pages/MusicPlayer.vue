<script setup lang="ts">
import "APlayer/dist/APlayer.min.css"
import APlayer from "APlayer"
import * as musicMetadata from "music-metadata-browser"
import { useBusEvent } from "@/hooks"
import { BusEvent } from "@/types"

const playerRef = ref<HTMLDivElement | null>(null)
const showPlayer = ref(false)

let ap
onMounted(() => {
  ap = new APlayer({
    container: playerRef.value!,
    fixed: true,
    autoplay: false,
    theme: "#36ad6a",
    loop: "none",
  })
})
onUnmounted(() => {
  ap.destroy()
})

let musicUrl
onBeforeUnmount(() => {
  if (musicUrl) {
    URL.revokeObjectURL(musicUrl)
  }
})

useBusEvent(BusEvent.PLAY_MUSIC, async (url) => {
  const music = await fetch(url)
  const musicBlob = await music.blob()
  musicUrl = URL.createObjectURL(musicBlob)

  const metadata = await musicMetadata.parseBlob(musicBlob)
  console.debug("music metadata", metadata)
  const title = metadata.common.title
  const artist = metadata.common.artist
  const coverPicture = metadata.common.picture?.[0]!
  let cover
  if (coverPicture) {
    const coverArray = coverPicture.data
    const coverFormat = coverPicture.format
    cover = URL.createObjectURL(new Blob([coverArray], { type: coverFormat }))
  }

  ap.list.clear()
  ap.list.add({
    url: musicUrl,
    title: title,
    artist: artist,
    cover: cover,
  })
  showPlayer.value = true
  ap.play()
})

useBusEvent(BusEvent.PAUSE_MUSIC, () => {
  ap.pause()
})

function closePlayer() {
  showPlayer.value = false
  ap.pause()
}
</script>

<template>
  <div v-show="showPlayer" ref="playerRef" @click.ctrl="closePlayer" />
</template>
