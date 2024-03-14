<script setup lang="ts">
const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL
const version = __APP_VERSION__
</script>

<template>
  <div style="padding: 24px">
    后端URL: {{ BASE_URL }}<br />
    前端版本: {{ version }}
  </div>
</template>

<style scoped></style>
