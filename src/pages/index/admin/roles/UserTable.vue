<script setup lang="ts">
import { NButton, type PaginationProps } from "naive-ui"
import { assignRoleUsers, getRoleUsers, unassignRoleUsers, getUsers } from "@/api"

/** 是否显示模态框 */
const show = defineModel<boolean>("show", { default: false })
/** 组件参数 */
const props = withDefaults(
  defineProps<{
    role: Role
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
    render: (row: User) => {
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
const tableData = ref<User[]>([])
/** 已选用户 ID */
const selectedUserIds = ref<string[]>([])
/** 是否用户在角色中 */
const isUserInRole = (user: User) => {
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
const onComponentShow = () => {
  loading.value = true
  getRoleUsers(props.role.id)
    .then((res) => {
      selectedUserIds.value = res.data
    })
    .finally(() => {
      loading.value = false
    })
}
const onActionClick = (user: User) => {
  loading.value = true
  if (isUserInRole(user)) {
    unassignRoleUsers(props.role.id, [user.id])
      .then(() => {
        window.$message.success("移除成功")
        selectedUserIds.value = selectedUserIds.value.filter((id) => id !== user.id)
      })
      .catch((e) => {
        window.$message.error("移除失败")
        throw e
      })
      .finally(() => {
        loading.value = false
      })
  } else {
    assignRoleUsers(props.role.id, [user.id])
      .then(() => {
        window.$message.success("分配成功")
        selectedUserIds.value.push(user.id)
      })
      .catch((e) => {
        window.$message.error("分配失败")
        throw e
      })
      .finally(() => {
        loading.value = false
      })
  }
}
/** 获取用户信息 */
const getUser = () => {
  loading.value = true
  getUsers(pagination.page - 1, pagination.pageSize)
    .then((res) => {
      let data: Page<User> = res.data
      tableData.value = data.list
      pagination.itemCount = data.total
    })
    .catch((e) => {
      window.$message.error("数据获取失败")
      throw e
    })
    .finally(() => {
      loading.value = false
    })
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
