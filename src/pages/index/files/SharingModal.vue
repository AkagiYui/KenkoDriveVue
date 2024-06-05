<script setup lang="ts">
import { getSharingInfoByFileId, deleteSharing, createSharing } from "@/api"

const show = defineModel<boolean>("show", { default: false })
const props = withDefaults(
  defineProps<{
    filename: string
    id: string
  }>(),
  {},
)
const loading = ref(false)
const displayData = ref<null | SharingResponse>(null)
const host = window.location.origin
const url = computed(() => {
  if (!displayData.value) {
    return ""
  }
  return `${host}/share/${displayData.value.id}`
})

async function getSharingInfo() {
  loading.value = true
  if (!props.id) {
    loading.value = false
    return
  }
  try {
    displayData.value = await getSharingInfoByFileId(props.id)
  } finally {
    loading.value = false
  }
}
watch(show, (show) => {
  if (!show) {
    return
  }
  getSharingInfo()
})
onBeforeMount(() => {
  getSharingInfo()
})

interface SharingResponse {
  id: string
  filename: string
  createTime: string
  password: string
}

function onUrlClick() {
  navigator.clipboard.writeText(url.value).then(() => {
    window.$message.success("复制成功")
  })
}

function onCreateButtonClick() {
  createSharing(props.id).then(() => {
    getSharingInfo()
  })
}

function onDeleteButtonClick() {
  if (!displayData.value) {
    return
  }
  deleteSharing(displayData.value.id).then(() => {
    getSharingInfo()
  })
}
</script>

<template>
  <n-modal
    v-model:show="show"
    preset="card"
    :mask-closable="true"
    :bordered="false"
    :title="`分享(${props.filename})`"
    style="width: 600px"
  >
    <n-spin :show="loading">
      <div v-if="displayData">
        <n-flex vertical>
          <n-flex>
            <n-text>分享链接</n-text>
            <n-text class="url" @click="onUrlClick">{{ url }}</n-text>
          </n-flex>
          <n-flex>
            <n-text>提取码</n-text>
            <n-text>{{ displayData.password }}</n-text>
          </n-flex>
          <n-flex>
            <n-text>创建时间</n-text>
            <n-text>{{ displayData.createTime }}</n-text>
          </n-flex>
          <n-flex>
            <n-text>二维码</n-text>
            <n-qr-code :value="url" error-correction-level="H" type="svg" :size="200" />
          </n-flex>
          <n-button type="error" secondary @click="onDeleteButtonClick">删除分享</n-button>
        </n-flex>
      </div>
      <div v-else>
        <n-button style="width: 100%" type="primary" secondary @click="onCreateButtonClick">创建分享</n-button>
      </div>
    </n-spin>
  </n-modal>
</template>

<style scoped>
.url {
  cursor: pointer;
}
</style>
