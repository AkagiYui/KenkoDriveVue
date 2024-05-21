<script lang="ts" setup>
import VueOfficeDocx from "@vue-office/docx"
import "@vue-office/docx/lib/index.css"

const props = defineProps<{
  url: string
}>()
</script>

<template>
  <VueOfficeDocx :src="props.url" style="height: 100%" />
</template>

<style scoped></style>
