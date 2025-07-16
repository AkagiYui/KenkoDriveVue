<script lang="ts" setup>
import VueOfficeExcel from "@vue-office/excel/lib/v3/vue-office-excel.mjs"
import "@vue-office/excel/lib/v3/index.css"

const props = defineProps<{
  url: string
}>()
</script>

<template>
  <VueOfficeExcel :src="props.url" style="height: 100%" />
</template>

<style scoped></style>
