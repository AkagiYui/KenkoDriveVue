<script setup lang="ts">
/** 组件参数 */
const { parent } = defineProps<{
  parent?: string | null
}>()
const show = defineModel<boolean>("show", { default: false })
const emit = defineEmits<{
  (e: "success"): void
}>()

const isLoading = ref(false)
const folderName = ref("新建文件夹")
const create = async () => {
  isLoading.value = true
  await createFolder(hasText(folderName.value) ? folderName.value : undefined, parent)
  emit("success")
  show.value = false
  isLoading.value = false
}
</script>

<template>
  <n-modal
    v-model:show="show"
    preset="card"
    :mask-closable="true"
    :bordered="false"
    title="新建文件夹"
    style="width: 400px"
    @after-leave="() => (folderName = '新建文件夹')"
  >
    <n-flex vertical>
      <n-form :show-label="false" :disabled="isLoading">
        <n-form-item required>
          <n-input v-model:value="folderName" placeholder="请输入文件夹名称" @keyup.enter="create" />
        </n-form-item>
      </n-form>
      <n-flex justify="end" style="margin-top: -10px">
        <n-button type="primary" :disabled="isLoading" :loading="isLoading" @click="create">确定</n-button>
      </n-flex>
    </n-flex>
  </n-modal>
</template>
