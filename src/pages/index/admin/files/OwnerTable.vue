<script setup lang="ts">
const show = defineModel<boolean>("show", { default: false })
const { file = undefined } = defineProps<{
  file?: FileInfoResponse
}>()

watch(
  () => file,
  (newFile) => {
    if (newFile) {
      id.value = newFile.id
    }
  },
)

const { id, owner, isLoading } = useFileOwner()
const columns = [
  {
    title: "用户名",
    key: "username",
  },
  {
    title: "昵称",
    key: "nickname",
  },
]
</script>

<template>
  <n-modal
    v-model:show="show"
    preset="card"
    :mask-closable="true"
    :bordered="false"
    :title="`拥有者(${file?.name})`"
    style="width: 600px"
  >
    <n-data-table remote :columns="columns" :data="owner" :loading="isLoading" />
  </n-modal>
</template>
