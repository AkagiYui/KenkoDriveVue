<script lang="ts" setup>
import { type2Icon } from "@/utils"
import { CheckmarkOutline, CloseOutline, HelpOutline, PauseOutline, PlayOutline } from "@vicons/ionicons5"
import { useThemeVars } from "naive-ui"

const props = defineProps<{
  data: UploadDisplayInfo
}>()
const emit = defineEmits<{
  onPauseButtonClick: []
  onRemoveButtonClick: []
}>()

const info = computed<UploadDisplayInfo>(() => props.data)

// 进度条
const themeVars = useThemeVars()
const progress = computed(() => info.value.progress)
const progressText = computed(() => `${progress.value.toFixed(2)}%`)
const finished = computed(() => info.value.status === "mirrored" || info.value.status === "merged")
const progressColor = computed(() => {
  switch (info.value.status) {
    case "uploading":
    case "waiting":
      return `${themeVars.value.primaryColor}50`
    case "paused":
      return `${themeVars.value.warningColor}50`
    case "error":
      return `${themeVars.value.errorColor}50`
  }
  return "transparent"
})

// 根据文件类型选择图标
const icon = computed(() => {
  return type2Icon(info.value.file.type, info.value.file.name)
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
      return `${Math.min(progress.value, 100).toFixed(0)}%`
    case "paused":
      return "已暂停"
    case "waiting":
      return "排队中"
    case "uploaded":
      return "处理中"
    case "merged":
      return "上传成功"
    case "mirrored":
      return "秒传成功"
    case "error":
      return "上传失败"
    case "canceled":
      return "已取消"
  }
})
// 提示图标
const buttonIcon = computed(() => {
  if (finished.value) {
    if (isConfirming.value) return CloseOutline
    return CheckmarkOutline
  }
  if (isConfirming.value) return HelpOutline
  return CloseOutline
})
</script>

<template>
  <n-flex class="container" :wrap="false" align="center">
    <n-icon :component="icon" size="30" style="margin-left: 24px" />
    <n-ellipsis :line-clamp="1" style="width: 100%">{{ info.file.name }}</n-ellipsis>
    <n-text style="margin-left: auto; width: 120px; text-align: right">{{ text }}</n-text>
    <n-button v-show="false" circle quaternary size="small" :disabled="finished" @click="emit('onPauseButtonClick')">
      <n-icon :component="info.status == 'paused' ? PlayOutline : PauseOutline" />
    </n-button>
    <n-button
      style="margin-right: 24px"
      :quaternary="!isConfirming"
      circle
      size="small"
      :type="finished ? 'success' : 'error'"
      @click="onRemoveButtonClick"
    >
      <n-icon :component="buttonIcon" />
    </n-button>
  </n-flex>
</template>

<style scoped>
.container {
  width: 100%;
  height: 50px;
  position: relative;
}

.container::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  transform: scaleX(v-bind(progressText));
  transform-origin: left;
  background-color: v-bind(progressColor);
  transition:
    transform 0.2s linear,
    background-color 0.5s;
}
</style>
