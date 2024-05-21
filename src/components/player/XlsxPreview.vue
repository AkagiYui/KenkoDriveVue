<script lang="ts" setup>
import VueOfficeExcel from "@vue-office/excel"
import "@vue-office/excel/lib/index.css"

const props = defineProps<{
  url: string
}>()
</script>

<template>
  <VueOfficeExcel :src="props.url" style="height: 100%" />
</template>

<style scoped></style>
