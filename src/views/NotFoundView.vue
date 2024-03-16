<script setup lang="ts">
import { NResult, NButton, NCard } from "naive-ui"
import { useRouter } from "vue-router"

const router = useRouter()
</script>

<template>
  <n-card class="page">
    <n-result
      class="center"
      status="error"
      title="404 页面不存在"
      size="huge"
      description="需要帮助请联系管理员"
    >
      <template #footer>
        <n-space justify="center">
          <n-button @click="router.replace('/')"> 回到首页 </n-button>
          <n-button type="primary" @click="router.go(-1)"> 返回 </n-button>
        </n-space>
      </template>
    </n-result>
  </n-card>
</template>

<style>
.center {
  position: absolute;
  left: 50%;
  top: 42%;
  transform: translate(-50%, -50%);
}
</style>
<style>
.page {
  height: 100vh;
}
</style>
