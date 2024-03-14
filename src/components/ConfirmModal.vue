<script setup lang="ts">
withDefaults(
  defineProps<{
    show: boolean
  }>(),
  {},
)

const emit = defineEmits<{
  positiveClick?: []
  negativeClick?: []
  "update:show"?: [value: boolean]
}>()

const onNegativeClick = () => {
  emit("update:show", false)
  emit("negativeClick")
}
</script>

<template>
  <n-modal
    :show="$props.show"
    preset="dialog"
    title="确认"
    content="此操作不可撤销，请确认是否继续？"
    positive-text="确认"
    negative-text="取消"
    @positive-click="emit('positiveClick')"
    @negative-click="onNegativeClick"
    @close="onNegativeClick"
    @mask-click="onNegativeClick"
    type="warning"
    :positive-button-props="{
      type: 'error',
    }"
  />
</template>

<style scoped></style>
