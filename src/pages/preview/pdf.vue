<route lang="json">
{
  "name": "pdf-preview",
  "meta": {
    "title": "PDF预览",
    "isPlayer": true
  }
}
</route>

<script lang="ts" setup>
const { url } = useRoute().query as { url: string }
const blobUrl = ref("")

onMounted(() => {
  if (url) {
    fetch(url)
      .then((res) => res.blob())
      .then((res) => {
        const blob = new Blob([res], { type: "application/pdf" })
        blobUrl.value = URL.createObjectURL(blob)
      })
  }
})

onBeforeUnmount(() => {
  if (blobUrl.value !== "") {
    URL.revokeObjectURL(blobUrl.value)
  }
})

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
