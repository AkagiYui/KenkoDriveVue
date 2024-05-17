<script lang="ts" setup>
import { marked } from "marked"

const props = defineProps<{
  value: string
}>()

const output = computed(() => marked(props.value))
</script>

<template>
  <div class="output" v-html="output"></div>
</template>

<style scoped>
.output {
  width: 100%;
  height: 100%;
}
</style>
