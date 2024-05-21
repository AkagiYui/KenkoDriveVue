<script lang="ts" setup>
import { usePDF, VuePDF } from "@tato30/vue-pdf"

const props = defineProps<{
  url: string
}>()

const { pdf, pages } = usePDF(props.url)
</script>

<template>
  <n-flex vertical>
    <div v-for="page in pages" :key="page">
      <VuePDF :page="page" :pdf="pdf" />
    </div>
  </n-flex>
</template>

<style scoped></style>
