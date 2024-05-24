<script setup lang="ts">
import {
  useLoadingBar,
  useDialog,
  useMessage,
  useNotification,
  useModal,
} from "naive-ui"

window.$loadingbar = useLoadingBar()
window.$dialog = useDialog()
window.$message = useMessage()
window.$notify = useNotification()
window.$modal = useModal()
</script>

<template>
  <slot />
</template>
