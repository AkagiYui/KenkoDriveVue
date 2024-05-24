<script lang="ts" setup>
import {
  ArchiveOutline,
  CloseOutline,
  CogOutline,
  DocumentOutline,
  DocumentTextOutline,
  FilmOutline,
  HelpOutline,
  ImageOutline,
  PauseOutline,
  PlayOutline,
} from "@vicons/ionicons5"

const props = defineProps<{
  file: UploadFileInfo
}>()
const emit = defineEmits<{
  onPauseButtonClick: []
  onRemoveButtonClick: []
}>()

const file = computed<UploadFileInfo>(() => props.file)
const isConfirming = ref(false)
const icon = computed(() => {
  switch (file.value.type) {
    case "image/png":
    case "image/jpeg":
    case "image/gif":
      return ImageOutline
    case "application/zip":
    case "application/x-zip-compressed":
    case "application/x-compressed":
      return ArchiveOutline
    case "application/x-msdownload":
      return CogOutline
    case "application/pdf":
    case "text/csv":
    case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      return DocumentTextOutline
    case "video/mp4":
      return FilmOutline
  }
  const suffix = file.value.name.split(".").pop()
  console.log("unknown file type", file.value.type, suffix)
  return DocumentOutline
})
let timer: NodeJS.Timeout | number = 0

function onRemoveButtonClick() {
  if (isConfirming.value) {
    clearTimeout(timer)
    emit("onRemoveButtonClick")
  } else {
    isConfirming.value = true
  }
  timer = setTimeout(() => {
    isConfirming.value = false
  }, 3000)
}
</script>

<template>
  <n-flex id="container" :wrap="false">
    <n-icon :component="icon" size="30" />
    <n-ellipsis :line-clamp="1">{{ file.name }}</n-ellipsis>
    <n-spin
      v-show="file.status == 'waiting'"
      id="progress"
      :size="25"
      :stroke-width="18"
    ></n-spin>
    <n-progress
      v-show="file.status != 'waiting'"
      id="progress"
      :offset-degree="180"
      :percentage="file.progress"
      :processing="true"
      :show-indicator="false"
      :stroke-width="10"
      type="circle"
    />
    <n-button
      circle
      quaternary
      size="small"
      @click="emit('onPauseButtonClick')"
    >
      <n-icon
        :component="file.status == 'paused' ? PlayOutline : PauseOutline"
      />
    </n-button>
    <n-button
      :quaternary="!isConfirming"
      circle
      size="small"
      type="error"
      @click="onRemoveButtonClick"
    >
      <n-icon :component="isConfirming ? HelpOutline : CloseOutline" />
    </n-button>
  </n-flex>
</template>

<style scoped>
#container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
}

#progress {
  margin-left: auto;
  width: 25px;
}
</style>
