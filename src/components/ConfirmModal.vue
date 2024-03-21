<script setup lang="ts">
/** 是否显示模态框 */
const show = defineModel<boolean>("show", { default: false })

const emit = defineEmits<{
  (e: "positiveClick"): void
  (e: "negativeClick"): void
}>()

const onNegativeClick = () => {
  emit("negativeClick")
}
</script>

<template>
  <n-modal
    v-model:show="show"
    preset="dialog"
    title="确认"
    content="此操作不可撤销，请确认是否继续？"
    positive-text="确认"
    negative-text="取消"
    type="warning"
    :closable="true"
    :positive-button-props="{
      type: 'error',
    }"
    @positive-click="emit('positiveClick')"
    @negative-click="onNegativeClick"
  />
</template>

<style scoped></style>
