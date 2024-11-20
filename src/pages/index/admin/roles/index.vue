<route lang="json">
{
  "name": "role-manage",
  "meta": {
    "title": "角色管理"
  }
}
</route>

<script setup lang="ts">
import { AddOutline, RefreshOutline, SearchOutline } from "@vicons/ionicons5"
import UserTable from "./UserTable.vue"

// 数据变量
/** 表格加载中 */
const isLoading = ref(false)
/** 处理中 */
const processing = ref(false)
/** 是否显示编辑模态框 */
const showEditModal = ref(false)
/** 模态框 编辑/新增 */
const isEdit = ref(false)
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
/** 搜索表达式 */
const searchExpression = ref("")
/** 表格列 */
const tableColumns = [
  {
    title: "角色名",
    key: "name",
  },
  {
    title: "描述",
    key: "description",
  },
  {
    title: "用户数",
    key: "userCount",
  },
  {
    title: "状态",
    key: "disabled",
    width: "80px",
    render: (row: RoleResponse) => {
      return h(
        NButton,
        {
          strong: true,
          tertiary: true,
          size: "small",
          type: row.disabled ? "error" : "success",
          disabled: processing.value,
          onClick: () => onToggleEnabledButtonClick(row),
        },
        { default: () => (row.disabled ? "已禁用" : "已启用") },
      )
    },
  },
  {
    title: "操作",
    key: "action",
    width: "230px",
    render: (row: RoleResponse) => {
      return h(
        NSpace,
        {},
        {
          default: () => [
            h(
              NButton,
              {
                size: "small",
                type: "primary",
                secondary: true,
                onClick: () => onAssignUserButtonClick(row),
              },
              { default: () => "分配用户" },
            ),
            h(
              NButton,
              {
                size: "small",
                type: "info",
                secondary: true,
                onClick: () => onEditButtonClick(row),
              },
              { default: () => "编辑" },
            ),
            h(
              NButton,
              {
                size: "small",
                type: "error",
                secondary: true,
                onClick: () => onDeleteButtonClick(row),
              },
              { default: () => "删除" },
            ),
          ],
        },
      )
    },
  },
]
/** 表格数据 */
const tableData = ref<RoleResponse[]>([])
/** 选中行数据 */
const selectedRow = ref<RoleResponse | null>(null)
/** 是否显示删除确认模态框 */
const showDeleteConfirmModal = ref(false)
/** 模态框信息 */
const modalData = ref({
  id: "",
  name: "",
  description: "",
  isDefault: false,
  permissions: [] as string[],
})
/** 模态框表单校验规则 */
const rules = {
  name: {
    required: true,
    min: 1,
    message: "请输入角色名",
    trigger: ["input", "blur"],
  },
  description: {
    required: false,
  },
}
/** 模态框表单引用 */
const modalFormRef = useTemplateRef<FormInst>("modalFormRef")
/** 权限列表 */
const permissions = ref<PermissionResponse[]>([])
/** 权限转移选项 */
const permissionTransferOptions = computed(() => {
  return permissions.value.map((p) => ({
    value: p.name,
    label: p.description,
    disabled: false,
  }))
})
/** 是否显示用户表格 */
const showUserTable = ref(false)

// 事件
/** 加载页面事件 */
onBeforeMount(async () => {
  getData() // 获取表格数据
  permissions.value = await getPermissions() // 获取权限列表
})
/** 页码改变事件 */
const onPageChange = (page: number) => {
  pagination.page = page
  getData()
}
/** 每页记录数改变事件 */
const onPageSizeChange = (pageSize: number) => {
  pagination.pageSize = pageSize
  pagination.page = 1
  getData()
}
/** 模态框确认事件 */
const onModalConfirm = async () => {
  processing.value = true
  await modalFormRef.value?.validate()
  if (isEdit.value) {
    // 编辑
    await updateRole(modalData.value.id, {
      name: modalData.value.name,
      description: modalData.value.description,
      isDefault: modalData.value.isDefault,
      permissions: modalData.value.permissions,
    })
    showEditModal.value = false
    window.$message.success("修改成功")
    const index = tableData.value.findIndex((r) => r.id === modalData.value.id)
    if (index !== -1) {
      tableData.value[index] = {
        ...tableData.value[index],
        name: modalData.value.name,
        description: modalData.value.description,
        isDefault: modalData.value.isDefault,
        permissions: modalData.value.permissions,
      }
    }
    processing.value = false
  } else {
    // 新增
    const id = await addRole(modalData.value)
    showEditModal.value = false
    window.$message.success("添加成功")
    tableData.value.push({
      id: id,
      name: modalData.value.name,
      description: modalData.value.description,
      isDefault: modalData.value.isDefault,
      permissions: modalData.value.permissions,
      userCount: 0,
      disabled: false,
    })
    processing.value = false
  }
}
/** 模态框关闭事件 */
const onModalClosed = () => {
  modalData.value = {
    id: "",
    name: "",
    description: "",
    isDefault: false,
    permissions: [],
  }
}
/** 新增按钮点击事件 */
const onAddButtonClick = () => {
  isEdit.value = false
  showEditModal.value = true
}
/** 编辑按钮点击事件 */
const onEditButtonClick = (row: RoleResponse) => {
  isEdit.value = true
  modalData.value = {
    id: row.id,
    name: row.name,
    description: row.description,
    isDefault: row.isDefault,
    permissions: row.permissions,
  }
  showEditModal.value = true
}
/** 删除按钮点击事件 */
const onDeleteButtonClick = (row: RoleResponse) => {
  selectedRow.value = row
  showDeleteConfirmModal.value = true
}
/** 删除确认事件 */
const onDeleteConfirm = async () => {
  showDeleteConfirmModal.value = false
  if (!selectedRow.value) return
  await deleteRole(selectedRow.value.id)
  window.$message.success("删除成功")
  tableData.value = tableData.value.filter((r) => r.id !== selectedRow.value?.id)
}
/** 启用/禁用按钮点击事件 */
const onToggleEnabledButtonClick = async (row: RoleResponse) => {
  processing.value = true
  await updateRoleStatus(row.id, !row.disabled)
  window.$message.success("操作成功")
  row.disabled = !row.disabled
  processing.value = false
}
/** 分配用户按钮点击事件 */
const onAssignUserButtonClick = (row: RoleResponse) => {
  selectedRow.value = row
  showUserTable.value = true
}

// 工具函数
/** 获取表格数据 */
const getData = async () => {
  isLoading.value = true
  const data = await getRoles(pagination.page - 1, pagination.pageSize, searchExpression.value)
  tableData.value = data.list
  pagination.itemCount = data.itemCount
  isLoading.value = false
}
</script>

<template>
  <div style="padding: 12px">
    <!-- 确认删除模态框 -->
    <ConfirmModal v-model:show="showDeleteConfirmModal" @positive-click="onDeleteConfirm" />

    <!-- 新增编辑模态框 -->
    <n-modal
      v-model:show="showEditModal"
      preset="card"
      :style="{
        width: '500px',
      }"
      :title="isEdit ? '编辑角色' : '新增角色'"
      :bordered="false"
      :mask-closable="false"
      @after-leave="onModalClosed"
    >
      <n-flex vertical>
        <n-form ref="modalFormRef" :model="modalData" :rules="rules" label-placement="left" label-width="auto">
          <n-form-item path="name" label="角色名">
            <n-input v-model:value="modalData.name" clearable placeholder="输入角色名" />
          </n-form-item>
          <n-form-item path="description" label="描述">
            <n-input v-model:value="modalData.description" clearable placeholder="可空" />
          </n-form-item>
          <n-form-item path="default" label="设为默认">
            <n-switch v-model:value="modalData.isDefault" />
          </n-form-item>
          <n-transfer
            ref="transfer"
            v-model:value="modalData.permissions"
            :options="permissionTransferOptions"
            source-title="所有权限"
            target-title="已选权限"
          />
        </n-form>
        <n-flex justify="end" style="width: 100%">
          <n-button
            :type="isEdit ? 'warning' : 'success'"
            :loading="processing"
            :disabled="processing"
            @click="onModalConfirm"
          >
            {{ isEdit ? "修改" : "确定" }}
          </n-button>
        </n-flex>
      </n-flex>
    </n-modal>

    <!-- 角色用户表格 -->
    <UserTable v-model:show="showUserTable" :role="selectedRow!" />

    <!-- 页面内容 -->
    <n-space vertical>
      <!-- 按钮区 -->
      <n-space>
        <n-button tertiary type="info" :disabled="isLoading" @click="getData">
          <template #icon>
            <n-icon>
              <RefreshOutline />
            </n-icon>
          </template>
          刷新
        </n-button>

        <n-button tertiary type="primary" @click="onAddButtonClick">
          <template #icon>
            <n-icon>
              <AddOutline />
            </n-icon>
          </template>
          新增
        </n-button>

        <n-input-group>
          <n-input v-model:value="searchExpression" placeholder="角色名、描述">
            <template #prefix>
              <n-icon :component="SearchOutline" />
            </template>
          </n-input>
          <n-button ghost :disabled="isLoading" @click="getData"> 搜索 </n-button>
        </n-input-group>
      </n-space>

      <!-- 表格 -->
      <n-data-table
        remote
        striped
        :bordered="true"
        :columns="tableColumns"
        :data="tableData"
        :pagination="pagination"
        :loading="isLoading"
        @update:page="onPageChange"
        @update:page-size="onPageSizeChange"
      />
    </n-space>
  </div>
</template>

<style scoped></style>
