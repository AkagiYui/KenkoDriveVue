<script setup lang="ts">
const BASE_URL = import.meta.env.BACKEND_URL
const version = APP_VERSION
</script>

<template>
  <div style="padding: 24px">
    后端URL: {{ BASE_URL }}<br />
    前端版本: {{ version }}
  </div>
</template>

<style scoped></style>
