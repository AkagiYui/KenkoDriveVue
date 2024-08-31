<script setup lang="ts">
/** 是否显示模态框 */
const show = defineModel<boolean>("show", { default: false })
/** 组件参数 */
const props = withDefaults(
  defineProps<{
    role: RoleResponse
  }>(),
  {},
)

/** 组件挂载前发起获取用户信息请求 */
onBeforeMount(() => {
  getUser()
})
/** 监听是否显示模态框 */
watch(show, (show) => {
  if (!show) {
    return
  }
  onComponentShow()
})

/** 处于加载状态 */
const loading = ref(false)
/** 表格列 */
const columns = [
  {
    title: "用户名",
    key: "username",
  },
  {
    title: "昵称",
    key: "nickname",
  },
  {
    title: "操作",
    key: "actions",
    width: 100,
    render: (row: UserInfoResponse) => {
      return h(
        NButton,
        {
          strong: true,
          secondary: true,
          size: "small",
          disabled: loading.value,
          type: loading.value ? "tertiary" : isUserInRole(row) ? "error" : "primary",
          onClick: () => onActionClick(row),
        },
        { default: () => (isUserInRole(row) ? "移除角色" : "分配角色") },
      )
    },
  },
]
/** 分页器 */
const pagination = reactive({
  /** 当前页，从 1 开始 */
  page: 1,
  /** 每页记录数 */
  pageSize: 15,
  /** 是否显示分页器 */
  showSizePicker: true,
  /** 每页记录数选项 */
  pageSizes: [5, 10, 15, 20, 50, 100].map((i) => ({
    label: `每页 ${i} 项`,
    value: i,
  })),
  /** 总记录数 */
  itemCount: 0,
  /** 总记录数显示文本 */
  prefix: (p: PaginationProps) => `共 ${p.itemCount} 项`,
})
/** 表格数据 */
const tableData = ref<UserInfoResponse[]>([])
/** 已选用户 ID */
const selectedUserIds = ref<string[]>([])
/** 是否用户在角色中 */
const isUserInRole = (user: UserInfoResponse) => {
  return selectedUserIds.value.includes(user.id)
}

/** 页码改变事件 */
const onPageChange = (page: number) => {
  pagination.page = page
  getUser()
}
/** 每页记录数改变事件 */
const onPageSizeChange = (pageSize: number) => {
  pagination.pageSize = pageSize
  pagination.page = 1
  getUser()
}
/** 窗口出现事件 */
const onComponentShow = async () => {
  loading.value = true
  selectedUserIds.value = await getRoleUsers(props.role.id)
  loading.value = false
}
const onActionClick = async (user: UserInfoResponse) => {
  loading.value = true
  if (isUserInRole(user)) {
    await unassignRoleUsers(props.role.id, [user.id])
    window.$message.success("移除成功")
    selectedUserIds.value = selectedUserIds.value.filter((id) => id !== user.id)
    loading.value = false
  } else {
    await assignRoleUsers(props.role.id, [user.id])
    window.$message.success("分配成功")
    selectedUserIds.value.push(user.id)
    loading.value = false
  }
}
/** 获取用户信息 */
const getUser = async () => {
  loading.value = true
  const data = await getUsers(pagination.page - 1, pagination.pageSize)
  tableData.value = data.list
  pagination.itemCount = data.itemCount
  loading.value = false
}
</script>

<template>
  <n-modal
    v-model:show="show"
    preset="card"
    :mask-closable="false"
    :bordered="false"
    :title="`分配用户(${props.role?.name})`"
    style="width: 600px"
  >
    <n-data-table
      remote
      :columns="columns"
      :data="tableData"
      :pagination="pagination"
      :bordered="false"
      :max-height="250"
      :loading="loading"
      @update:page="onPageChange"
      @update:page-size="onPageSizeChange"
    />
  </n-modal>
</template>
