<template>
  <n-drawer v-model:show="isUploadDrawerShow" :placement="'right'" :width="302">
    <n-drawer-content id="content" :native-scrollbar="false" title="上传列表">
      <n-empty v-if="count === 0" id="empty" />
      <UploadItem v-for="(item, index) in count" :key="index" />
    </n-drawer-content>
  </n-drawer>
</template>

<script lang="ts" setup>
import { useAppConfig } from "@/stores/app-config"
import { storeToRefs } from "pinia"
import UploadItem from "@/components/UploadItem.vue"

const { isUploadDrawerShow, uploadItemCount } = storeToRefs(useAppConfig())
const count = ref(2)
onMounted(() => {
  uploadItemCount.value = count.value // for test
})
</script>

<style scoped>
#content {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 0;
}

#empty {
  margin-top: 50%;
}
</style>
