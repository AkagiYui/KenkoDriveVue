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
  CheckmarkOutline,
} from "@vicons/ionicons5"
import { useThemeVars } from "naive-ui"

const props = defineProps<{
  data: UploadDisplayInfo
}>()
const emit = defineEmits<{
  onPauseButtonClick: []
  onRemoveButtonClick: []
}>()

const info = computed<UploadDisplayInfo>(() => props.data)

// 背景进度条
const themeVars = useThemeVars()
const processedColor = themeVars.value.primaryColor
const waitingColor = themeVars.value.modalColor
// 监听进度变化并动态更新背景样式
const backgroundStyle = ref({})
watch(
  () => info.value.progress,
  (newProgress) => {
    backgroundStyle.value = {
      background: `linear-gradient(to right, ${processedColor}60 0%, ${processedColor}60 ${newProgress}%, ${waitingColor} ${newProgress}%)`,
    }
  },
  { immediate: true },
)

// 根据文件类型选择图标
const icon = computed(() => {
  switch (info.value.type) {
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
  const suffix = info.value.name.split(".").pop()
  console.log("unknown file type", info.value.type, suffix)
  return DocumentOutline
})

// 确认删除
const isConfirming = ref(false)
const onRemoveButtonClick = (() => {
  let timer: NodeJS.Timeout | number = 0
  return () => {
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
})()

// 提示文字
const text = computed(() => {
  switch (info.value.status) {
    case "uploading":
      // return `${info.value.progress.toFixed(2)}%` // 保留小数点后两位
      return `${info.value.progress.toFixed(0)}%`
    case "paused":
      return "已暂停"
    case "waiting":
      return "排队中"
    case "uploaded":
      return "上传成功"
    case "mirrored":
      return "秒传成功"
    case "error":
      return "上传失败"
    case "canceled":
      return "已取消"
  }
})
</script>

<template>
  <n-flex id="container" :wrap="false" :style="backgroundStyle">
    <n-icon :component="icon" size="30" style="margin-left: 24px" />
    <n-ellipsis :line-clamp="1" style="width: 100%">{{ info.name }}</n-ellipsis>
    <n-text style="margin-left: auto; width: 120px; text-align: right">{{
      text
    }}</n-text>
    <n-button
      v-show="false"
      circle
      quaternary
      size="small"
      :disabled="info.status === 'mirrored' || info.status === 'uploaded'"
      @click="emit('onPauseButtonClick')"
    >
      <n-icon
        :component="info.status == 'paused' ? PlayOutline : PauseOutline"
      />
    </n-button>
    <n-button
      style="margin-right: 24px"
      :quaternary="!isConfirming"
      circle
      size="small"
      :type="
        info.status === 'mirrored' || info.status === 'uploaded'
          ? 'success'
          : 'error'
      "
      @click="onRemoveButtonClick"
    >
      <n-icon
        :component="
          (() => {
            if (info.status === 'mirrored' || info.status === 'uploaded') {
              if (isConfirming) {
                return CloseOutline
              } else {
                return CheckmarkOutline
              }
            } else {
              if (isConfirming) {
                return HelpOutline
              } else {
                return CloseOutline
              }
            }
          })()
        "
      />
    </n-button>
  </n-flex>
</template>

<style scoped>
#container {
  width: 100%;
  height: 50px;
  align-items: center;
}
</style>
