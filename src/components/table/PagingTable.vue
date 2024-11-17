<script setup lang="ts">
const {
  columns,
  data,
  loading = false,
  count,
} = defineProps<{
  columns: any[]
  data: any[]
  loading?: boolean
  count: number
}>()
const emits = defineEmits<{
  (e: "update:index", i: number, s: number): void
}>()
watch(
  () => count,
  () => {
    pagination.itemCount = count
  },
)

const pagination = reactive({
  /** 当前页，从 1 开始 */
  page: 1,
  /** 每页记录数 */
  pageSize: 10,
  /** 是否显示分页器 */
  showSizePicker: true,
  /** 每页记录数选项 */
  pageSizes: [5, 10, 15, 20, 50, 100].map((i) => ({
    label: `每页 ${i} 项`,
    value: i,
  })),
  /** 总记录数 */
  itemCount: count,
  /** 总记录数显示文本 */
  prefix: (p: PaginationProps) => `共 ${p.itemCount} 项`,
})

const onIndexChange = (page: number) => {
  pagination.page = page
  emits("update:index", page, pagination.pageSize)
}
const onSizeChange = (size: number) => {
  pagination.pageSize = size
  pagination.page = 1
  emits("update:index", 1, size)
}
</script>

<template>
  <n-data-table
    v-model:pagination="pagination"
    remote
    striped
    :bordered="true"
    :columns="columns"
    :data="data"
    :loading="loading"
    @update:page="onIndexChange"
    @update:page-size="onSizeChange"
  />
</template>
