<script setup lang="ts">
import { useFileOwner } from "@/api"

const show = defineModel<boolean>("show", { default: false })
const props = withDefaults(
  defineProps<{
    file: FileInfoResponse | null
  }>(),
  {},
)

watch(props, (newProps) => {
  if (newProps.file) {
    id.value = newProps.file.id
  }
})

const { id, owner, fetchData, isLoading } = useFileOwner()
const columns = [
  {
    title: "用户名",
    key: "username",
  },
  {
    title: "昵称",
    key: "nickname",
  }
]
</script>

<template>
  <n-modal
    v-model:show="show"
    preset="card"
    
    :mask-closable="true"
    :bordered="false"
    :title="`拥有者(${props.file?.name})`"
    style="width: 600px"
  >
    <n-data-table remote :columns="columns" :data="owner" :loading="isLoading" />
  </n-modal>
</template>
