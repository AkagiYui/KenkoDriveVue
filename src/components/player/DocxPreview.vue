<script lang="ts" setup>
import VueOfficeDocx from "@vue-office/docx/lib/v3/vue-office-docx.mjs"
import "@vue-office/docx/lib/v3/index.css"

const props = defineProps<{
  url: string
}>()
</script>

<template>
  <VueOfficeDocx :src="props.url" style="height: 100%" />
</template>

<style scoped></style>
