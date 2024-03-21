<script setup lang="ts">
import { AddOutline, RefreshOutline, SearchOutline } from "@vicons/ionicons5"
import { h, onBeforeMount, reactive, ref } from "vue"
import { NButton, NInput, NSwitch, NSpace } from "naive-ui"
import type { FormInst, PaginationProps } from "naive-ui"
import ConfirmModal from "@/components/ConfirmModal.vue"
import {
  addRole,
  deleteRole,
  getPermissions,
  getRoles,
  updateRole,
  updateRoleStatus,
} from "@/api/role"
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
    render(row: Role) {
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
    render(row: Role) {
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
const tableData = ref<Role[]>([])
/** 选中行数据 */
const selectedRow = ref<Role | null>(null)
/** 是否显示删除确认模态框 */
const showDeleteConfirmModal = ref(false)
/** 模态框信息 */
const modalData = ref({
  id: "",
  name: "",
  description: "",
  default: false,
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
const modalFormRef = ref<FormInst | null>(null)
/** 权限列表 */
const permissions = ref<Permission[]>([])
/** 权限转移选项 */
const permissionTransferOptions = computed(() => {
  return permissions.value.map((p) => ({
    value: p.name,
    label: p.description,
    disabled: false,
  }))
})
const showUserTable = ref(true)

// 事件
/** 加载页面事件 */
onBeforeMount(() => {
  getData() // 获取表格数据
  getPermissions() // 获取权限列表
    .then((res) => {
      permissions.value = res.data
      console.debug("permissions", permissions.value)
    })
    .catch((e) => {
      window.$message.error("权限获取失败")
      throw e
    })
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
const onModalConfirm = () => {
  processing.value = true
  modalFormRef.value
    ?.validate()
    .then(() => {
      if (isEdit.value) {
        // 编辑
        updateRole(modalData.value.id, {
          name: modalData.value.name,
          description: modalData.value.description,
          default: modalData.value.default,
          permissions: modalData.value.permissions,
        })
          .then(() => {
            showEditModal.value = false
            window.$message.success("修改成功")
            const index = tableData.value.findIndex(
              (r) => r.id === modalData.value.id,
            )
            if (index !== -1) {
              tableData.value[index] = {
                ...tableData.value[index],
                name: modalData.value.name,
                description: modalData.value.description,
                default: modalData.value.default,
                permissions: modalData.value.permissions,
              }
            }
          })
          .catch(() => {
            window.$message.error("修改失败")
          })
          .finally(() => {
            processing.value = false
          })
      } else {
        // 新增
        addRole(modalData.value)
          .then((response) => {
            showEditModal.value = false
            window.$message.success("添加成功")
            const id = response.data
            tableData.value.push({
              id,
              name: modalData.value.name,
              description: modalData.value.description,
              default: modalData.value.default,
              permissions: modalData.value.permissions,
              userCount: 0,
              disabled: false,
            })
          })
          .catch(() => {
            window.$message.error("添加失败")
          })
          .finally(() => {
            processing.value = false
          })
      }
    })
    .catch(() => {})
}
/** 模态框关闭事件 */
const onModalClosed = () => {
  modalData.value = {
    id: "",
    name: "",
    description: "",
    default: false,
    permissions: [],
  }
}
/** 新增按钮点击事件 */
const onAddButtonClick = () => {
  isEdit.value = false
  showEditModal.value = true
}
/** 编辑按钮点击事件 */
const onEditButtonClick = (row: Role) => {
  isEdit.value = true
  modalData.value = {
    id: row.id,
    name: row.name,
    description: row.description,
    default: row.default,
    permissions: row.permissions,
  }
  showEditModal.value = true
}
/** 删除按钮点击事件 */
const onDeleteButtonClick = (row: Role) => {
  selectedRow.value = row
  showDeleteConfirmModal.value = true
}
/** 删除确认事件 */
const onDeleteConfirm = () => {
  showDeleteConfirmModal.value = false
  if (!selectedRow.value) return
  deleteRole(selectedRow.value.id)
    .then(() => {
      window.$message.success("删除成功")
      tableData.value = tableData.value.filter(
        (r) => r.id !== selectedRow.value?.id,
      )
    })
    .catch(() => {
      window.$message.error("删除失败")
    })
}
/** 启用/禁用按钮点击事件 */
const onToggleEnabledButtonClick = (row: Role) => {
  processing.value = true
  updateRoleStatus(row.id, !row.disabled)
    .then(() => {
      window.$message.success("操作成功")
      row.disabled = !row.disabled
    })
    .catch((e) => {
      window.$message.error("操作失败")
      console.error(e)
    })
    .finally(() => {
      processing.value = false
    })
}
/** 分配用户按钮点击事件 */
const onAssignUserButtonClick = (row: Role) => {
  selectedRow.value = row
  showUserTable.value = true
}

// 工具函数
/** 获取表格数据 */
const getData = () => {
  isLoading.value = true
  getRoles(pagination.page - 1, pagination.pageSize, searchExpression.value)
    .then((res) => {
      let data: Page<Role> = res.data
      tableData.value = data.list
      pagination.itemCount = data.total
    })
    .catch((e) => {
      window.$message.error("数据获取失败")
      throw e
    })
    .finally(() => (isLoading.value = false))
}
</script>

<template>
  <div style="padding: 12px">
    <!-- 确认删除模态框 -->
    <ConfirmModal
      v-model:show="showDeleteConfirmModal"
      @positive-click="onDeleteConfirm"
    />

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
        <n-form
          ref="modalFormRef"
          :model="modalData"
          :rules="rules"
          label-placement="left"
          label-width="auto"
        >
          <n-form-item path="name" label="角色名">
            <n-input
              v-model:value="modalData.name"
              clearable
              placeholder="输入角色名"
            />
          </n-form-item>
          <n-form-item path="description" label="描述">
            <n-input
              v-model:value="modalData.description"
              clearable
              placeholder="可空"
            />
          </n-form-item>
          <n-form-item path="default" label="设为默认">
            <n-switch v-model:value="modalData.default" />
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
      <n-form :show-label="false" inline :show-feedback="false">
        <n-formItem>
          <n-space>
            <n-button
              tertiary
              type="info"
              :disabled="isLoading"
              @click="getData"
            >
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
              <n-input
                v-model:value="searchExpression"
                placeholder="角色名、描述"
              >
                <template #prefix>
                  <n-icon :component="SearchOutline" />
                </template>
              </n-input>
              <n-button
                type="primary"
                ghost
                :disabled="isLoading"
                @click="getData"
              >
                搜索
              </n-button>
            </n-input-group>
          </n-space>
        </n-formItem>
      </n-form>

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
