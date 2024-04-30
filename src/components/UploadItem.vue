<script lang="ts" setup>
import {
  CloseOutline,
  DocumentTextOutline,
  HelpOutline,
  PauseOutline,
  PlayOutline,
} from "@vicons/ionicons5"

const isPaused = ref(false)
const isConfirming = ref(false)
const hasProgress = ref(false)
</script>

<template>
  <n-flex id="container">
    <n-icon
      :component="DocumentTextOutline"
      size="30"
      @click="hasProgress = !hasProgress"
    />
    <n-text>abc.jpg</n-text>
    <n-spin
      v-show="!hasProgress"
      id="progress"
      :size="25"
      :stroke-width="18"
    ></n-spin>
    <n-progress
      v-show="hasProgress"
      id="progress"
      :offset-degree="180"
      :percentage="60"
      :processing="true"
      :show-indicator="false"
      :stroke-width="10"
      type="circle"
    />
    <n-button circle quaternary size="small" @click="isPaused = !isPaused">
      <n-icon :component="isPaused ? PlayOutline : PauseOutline" />
    </n-button>
    <n-button
      :quaternary="!isConfirming"
      circle
      size="small"
      type="error"
      @click="isConfirming = !isConfirming"
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
