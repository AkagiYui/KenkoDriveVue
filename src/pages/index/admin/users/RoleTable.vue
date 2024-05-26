<script setup lang="ts">
import { NButton, type PaginationProps } from "naive-ui"
import { getRoles } from "@/api/role"
import { assignRoles, getUserRoles, removeRoles } from "@/api/user"

/** 是否显示模态框 */
const show = defineModel<boolean>("show", { default: false })
/** 组件参数 */
const props = withDefaults(
  defineProps<{
    user: User
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
    render: (row: Role) => {
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
const tableData = ref<Role[]>([])
/** 已选角色 ID */
const selectedRoleIds = ref<string[]>([])
/** 是否用户在角色中 */
const isRoleInUser = (role: Role) => {
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
const onComponentShow = () => {
  loading.value = true
  getUserRoles(props.user.id)
    .then((res) => {
      selectedRoleIds.value = res.data
    })
    .finally(() => {
      loading.value = false
    })
}
/** 操作按钮点击事件 */
const onActionClick = (role: Role) => {
  loading.value = true
  if (isRoleInUser(role)) {
    removeRoles(props.user.id, [role.id])
      .then(() => {
        window.$message.success("移除成功")
        selectedRoleIds.value = selectedRoleIds.value.filter((id) => id !== role.id)
      })
      .catch((e) => {
        window.$message.error("移除失败")
        throw e
      })
      .finally(() => {
        loading.value = false
      })
  } else {
    assignRoles(props.user.id, [role.id])
      .then(() => {
        window.$message.success("分配成功")
        selectedRoleIds.value.push(role.id)
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
const getRole = () => {
  loading.value = true
  getRoles(pagination.page - 1, pagination.pageSize)
    .then((res) => {
      let data: Page<Role> = res.data
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
    :title="`分配角色(${props.user.username})`"
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
