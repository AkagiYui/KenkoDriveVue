<script lang="ts" setup>
import { useRoute } from "vue-router"

const route = useRoute()
const blobUrl = ref("")

onBeforeUnmount(() => {
  if (blobUrl.value !== "") {
    URL.revokeObjectURL(blobUrl.value)
  }
})

if (route.query.url) {
  fetch(route.query.url as string)
    .then((res) => res.blob())
    .then((res) => {
      const blob = new Blob([res], { type: "application/pdf" })
      blobUrl.value = URL.createObjectURL(blob)
    })
}

function onOpenButtonClick() {
  window.open(blobUrl.value)
}
</script>

<template>
  <n-spin :show="blobUrl === ''">
    <n-flex justify="center" style="margin-top: 10px; width: 100vw">
      <n-flex vertical>
        <n-button @click="onOpenButtonClick">使用浏览器内置阅读器打开</n-button>
        <PdfPreview v-if="blobUrl !== ''" id="player" :url="blobUrl" />
        <!-- <VueOfficePdf
        v-if="blobUrl !== ''"
        :src="blobUrl"
        style="width: 100%; height: 100vh;"
    /> -->
      </n-flex>
    </n-flex>
  </n-spin>
</template>

<style scoped></style>
