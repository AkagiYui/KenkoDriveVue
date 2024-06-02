<script setup lang="ts">
const value = defineModel<string>("value")
const size = defineModel<number>("size", { default: 100 })
</script>

<template>
  <n-qr-code
    :value="value"
    :size="size"
    icon-src="/favicon.svg"
    background-color="#ffffff"
    color="#000000"
    error-correction-level="H"
    type="svg"
  />
</template>

<style scoped></style>
