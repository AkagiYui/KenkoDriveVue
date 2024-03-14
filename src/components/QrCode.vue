<script setup lang="ts">
import { ref, watch } from "vue"
import QrcodeVue from "qrcode.vue"

const props = withDefaults(
  defineProps<{
    value: string // 是否必传
    size?: number
  }>(),
  {
    size: 100,
  },
)
const inputValue = ref<string>(props.value)
const size = ref<number>(props.size)
watch(
  () => props.value,
  (newValue: string) => {
    inputValue.value = newValue
  },
)
watch(
  () => props.size,
  (newValue: number) => {
    size.value = newValue
  },
)
</script>

<template>
  <qrcode-vue
    :value="inputValue"
    :size="size"
    render-as="svg"
    level="H"
    :background="'#ffffff'"
    :foreground="'#000000'"
    :margin="1"
  />
</template>

<style scoped></style>
