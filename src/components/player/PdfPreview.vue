<script lang="ts" setup>
import { usePDF, VuePDF } from "@tato30/vue-pdf"

const props = defineProps<{
  url: string
}>()

let pdfA = undefined as any
let pagesA = undefined as any
let blobUrl = ref("")
watch(blobUrl, () => {
  const { pdf, pages } = usePDF(blobUrl)
  pdfA = pdf
  pagesA = pages
})

function onOpenButtonClick() {
  window.open(blobUrl.value)
}

onBeforeMount(async () => {
  fetch(props.url)
    .then((res) => res.blob())
    .then((res) => {
      const blob = new Blob([res], { type: "application/pdf" })
      blobUrl.value = URL.createObjectURL(blob)
    })
})
onBeforeUnmount(() => {
  if (blobUrl.value !== "") {
    URL.revokeObjectURL(blobUrl.value)
  }
})
</script>

<template>
  <n-spin :show="blobUrl === ''">
    <n-flex :loading="true" justify="center" style="margin-top: 10px">
      <n-flex vertical>
        <n-button @click="onOpenButtonClick">使用浏览器内置阅读器打开</n-button>
        <div v-for="page in pagesA" :key="page">
          <VuePDF id="viewer" :page="page" :pdf="pdfA" />
        </div>
      </n-flex>
    </n-flex>
  </n-spin>
</template>

<style scoped>
#viewer {
  margin: 0 auto;
}
</style>
