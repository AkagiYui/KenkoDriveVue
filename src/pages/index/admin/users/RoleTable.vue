<script setup lang="ts">
import { NButton, type PaginationProps } from "naive-ui"
import { assignRoles, getUserRoles, removeRoles, getRoles } from "@/api"

/** 是否显示模态框 */
const show = defineModel<boolean>("show", { default: false })
/** 组件参数 */
const props = withDefaults(
  defineProps<{
    user: UserInfoResponse
  }>(),
  {},
)

/** 组件挂载前发起获取用户信息请求 */
onBeforeMount(() => {
  getRole()
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
    title: "角色名",
    key: "name",
    width: "120px",
  },
  {
    title: "描述",
    key: "description",
  },
  {
    title: "操作",
    key: "actions",
    width: "100px",
    render: (row: RoleResponse) => {
      return h(
        NButton,
        {
          strong: true,
          secondary: true,
          size: "small",
          disabled: loading.value,
          type: loading.value ? "tertiary" : isRoleInUser(row) ? "error" : "primary",
          onClick: () => onActionClick(row),
        },
        { default: () => (isRoleInUser(row) ? "移除角色" : "分配角色") },
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
const tableData = ref<RoleResponse[]>([])
/** 已选角色 ID */
const selectedRoleIds = ref<string[]>([])
/** 是否用户在角色中 */
const isRoleInUser = (role: RoleResponse) => {
  return selectedRoleIds.value.includes(role.id)
}

/** 页码改变事件 */
const onPageChange = (page: number) => {
  pagination.page = page
  getRole()
}
/** 每页记录数改变事件 */
const onPageSizeChange = (pageSize: number) => {
  pagination.pageSize = pageSize
  pagination.page = 1
  getRole()
}
/** 窗口出现事件 */
const onComponentShow = async () => {
  loading.value = true
  selectedRoleIds.value = await getUserRoles(props.user.id)
  loading.value = false
}
/** 操作按钮点击事件 */
const onActionClick = async (role: RoleResponse) => {
  loading.value = true
  if (isRoleInUser(role)) {
    await removeRoles(props.user.id, [role.id])
    window.$message.success("移除成功")
    selectedRoleIds.value = selectedRoleIds.value.filter((id) => id !== role.id)
    loading.value = false
  } else {
    await assignRoles(props.user.id, [role.id])
    window.$message.success("分配成功")
    selectedRoleIds.value.push(role.id)
    loading.value = false
  }
}
/** 获取用户信息 */
const getRole = async () => {
  loading.value = true
  const data = await getRoles(pagination.page - 1, pagination.pageSize)
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
    :title="`分配角色(${props.user?.username})`"
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
