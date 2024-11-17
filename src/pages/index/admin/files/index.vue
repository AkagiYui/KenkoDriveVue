<route lang="json">
{
  "name": "file-manage",
  "meta": {
    "title": "文件管理"
  }
}
</route>

<script setup lang="ts">
import { filesize } from "filesize"
import { RefreshOutline, SearchOutline } from "@vicons/ionicons5"
import OwnerTable from "./OwnerTable.vue"

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
    render: (row) => {
      const { locked } = row
      return h(
        NButton,
        { type: locked ? "error" : "success", tertiary: true, size: "small", onClick: () => onLockButtonClick(row) },
        { default: () => (locked ? "已锁定" : "未锁定") },
      )
    },
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
    width: 2 * 80,
    render: (row) =>
      h(
        NFlex,
        { justify: "center" },
        {
          default: () => [
            // h(NButton, { type: "primary", size: "small", secondary: true }, { default: () => "预览" }),
            // h(NButton, { type: "info", size: "small", secondary: true }, { default: () => "下载" }),
            h(
              NButton,
              { type: "warning", size: "small", secondary: true, onClick: () => onShowFileOwnerButtonClick(row) },
              { default: () => "拥有者" },
            ),
            h(
              NButton,
              { type: "error", size: "small", secondary: true, onClick: () => onDeleteButtonClick(row) },
              { default: () => "删除" },
            ),
          ],
        },
      ),
  },
]

const { index: pageIndex, size: pageSize, expression, count, data, fetchData, isLoading } = useFileList()
const expressionInputValue = ref("")

function tableIndexChanged(index: number, size: number) {
  pageIndex.value = index - 1
  pageSize.value = size
}

async function onLockButtonClick(row: FileInfoResponse) {
  await lockFile(row.id, !row.locked)
  fetchData()
}

const { openConfirmModal } = useConfirmModal()
function onDeleteButtonClick(row: FileInfoResponse) {
  openConfirmModal(async () => {
    await deleteRealFile(row.id)
    fetchData()
  }, "文件将在所有用户的存储空间中被删除，确定删除该文件吗？")
}

const isOwnerTableShow = ref(false)
const currentFile = ref<FileInfoResponse | null>(null)
function onShowFileOwnerButtonClick(row: FileInfoResponse) {
  currentFile.value = row
  isOwnerTableShow.value = true
}
</script>

<template>
  <div class="view">
    <OwnerTable v-model:show="isOwnerTableShow" :file="currentFile!!" />
    <n-flex vertical>
      <n-space>
        <n-button tertiary type="info" :disabled="isLoading" @click="fetchData">
          <template #icon>
            <n-icon :component="RefreshOutline" />
          </template>
          刷新
        </n-button>

        <n-input-group>
          <n-input v-model:value="expressionInputValue" placeholder="文件名、类型">
            <template #prefix>
              <n-icon :component="SearchOutline" />
            </template>
          </n-input>
          <n-button ghost :disabled="isLoading" @click="expression = expressionInputValue"> 搜索 </n-button>
        </n-input-group>
      </n-space>
      <PagingTable :data="data" :columns="tableColumns" :count="count" @update:index="tableIndexChanged" />
    </n-flex>
  </div>
</template>

<style scoped>
.view {
  padding: 12px;
}
</style>
