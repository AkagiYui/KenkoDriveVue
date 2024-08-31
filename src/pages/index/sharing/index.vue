<route lang="json">
{
  "name": "sharing",
  "meta": {
    "title": "分享"
  }
}
</route>

<script setup lang="ts">
const { data, refresh, isLoading } = useSharingList()
const columns = [
  {
    title: "文件名",
    key: "filename",
  },
  {
    title: "密码",
    key: "password",
  },
  {
    title: "分享时间",
    key: "createTime",
  },
  {
    title: "操作",
    key: "actions",
    width: 160,
    render: (row) => {
      return h(NFlex, {}, () => [
        h(
          NButton,
          {
            type: "success",
            size: "small",
            secondary: true,
            onClick: () => onCopyUrlClick(row),
          },
          { default: () => "复制链接" },
        ),
        h(
          NButton,
          {
            type: "error",
            size: "small",
            secondary: true,
            onClick: () => onDeleteButtonClick(row),
          },
          { default: () => "删除" },
        ),
      ])
    },
  },
]
onActivated(() => {
  refresh()
})

const { openConfirmModal } = useConfirmModal()
function onDeleteButtonClick(row) {
  openConfirmModal(async () => {
    await deleteSharing(row.id)
    refresh()
  })
}

const host = window.location.origin
function onCopyUrlClick(row) {
  navigator.clipboard.writeText(`${host}/share/${row.id}`)
  window.$message.success("复制成功")
}
</script>

<template>
  <div style="padding: 10px">
    <n-data-table remote :columns="columns" :data="data" :loading="isLoading" />
  </div>
</template>
