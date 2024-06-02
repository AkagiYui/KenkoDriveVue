<route lang="json">
{
  "name": "file-manage",
  "meta": {
    "title": "文件管理"
  }
}
</route>

<script setup lang="ts">
import { useFileList } from "@/api"
import PagingTable from "@/components/table/PagingTable.vue"
import { filesize } from "filesize"
import { NButton, NFlex } from "naive-ui"

const tableColumns = [
  {
    title: "文件名",
    key: "name",
    ellipsis: {},
    minWidth: 123,
  },
  {
    title: "大小",
    key: "size",
    align: "right",
    render: ({ size }) => filesize(size),
    width: 100,
  },
  {
    title: "类型",
    key: "type",
    ellipsis: {},
    width: 160,
  },
  {
    title: "下载次数",
    key: "downloadCount",
    align: "right",
    //minWidth: 80,
    width: 80,
  },
  {
    title: "锁定",
    key: "locked",
    width: 80,
    render: ({ locked }) =>
      h(
        NButton,
        { type: locked ? "error" : "success", tertiary: true, size: "small" },
        { default: () => (locked ? "已锁定" : "未锁定") },
      ),
  },
  {
    title: "上传时间",
    key: "createTime",
    width: 160,
    render: ({ createTime }) => new Date(createTime).toLocaleString(),
  },
  {
    title: "操作",
    key: "action",
    width: 280,
    render: () =>
      h(
        NFlex,
        { justify: "center" },
        {
          default: () => [
            h(NButton, { type: "primary", size: "small", secondary: true }, { default: () => "预览" }),
            h(NButton, { type: "info", size: "small", secondary: true }, { default: () => "下载" }),
            h(NButton, { type: "warning", size: "small", secondary: true }, { default: () => "拥有者" }),
            h(NButton, { type: "error", size: "small", secondary: true }, { default: () => "删除" }),
          ],
        },
      ),
  },
]

const { index: pageIndex, size: pageSize, count, data, isLoading } = useFileList()
watch(count, () => {
  console.log("count", count.value)
})

function tableIndexChanged(index: number, size: number) {
  pageIndex.value = index - 1
  pageSize.value = size
}
</script>

<template>
  <div class="view">
    <PagingTable
      :data="data"
      :columns="tableColumns"
      :count="count"
      :loading="isLoading"
      @update:index="tableIndexChanged"
    />
  </div>
</template>

<style scoped>
.view {
  padding: 12px;
}
</style>
