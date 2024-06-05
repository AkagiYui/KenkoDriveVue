<route lang="json">
{
  "name": "share",
  "meta": {
    "title": "查看分享"
  }
}
</route>

<script setup lang="ts">
import { useRoute } from "vue-router"
const params = useRoute().params
const id = params.id
</script>

<template>
  {{ id }}
</template>
