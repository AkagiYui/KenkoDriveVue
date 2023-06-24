<script setup lang="ts">
import { useUserInfo } from '@/stores/user-info'
import { storeToRefs } from 'pinia'

const { userName } = storeToRefs(useUserInfo())
</script>

<template>
  <div style="padding: 24px">
    <n-h4>
      晚上好，
      <n-h1>{{ userName }}</n-h1>
    </n-h4>
  </div>
</template>
