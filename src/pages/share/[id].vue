<route lang="json">
{
  "name": "share",
  "meta": {
    "title": "查看分享"
  }
}
</route>

<script setup lang="ts">
const { id } = useRoute().params as { id: string }
</script>

<template>
  {{ id }}
</template>
