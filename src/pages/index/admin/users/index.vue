<route lang="json">
{
  "name": "user-manage",
  "meta": {
    "title": "用户管理"
  }
}
</route>

<script setup lang="ts">
import { changeColor } from "seemly"
import { AddOutline, RefreshOutline, SearchOutline } from "@vicons/ionicons5"
import { NButton, NCheckbox, NFlex, NInput, NProgress, NSpace, NText, NTooltip, useThemeVars } from "naive-ui"
import type { FormInst, PaginationProps } from "naive-ui"
import { addUser, deleteUser, getUsers, updateUserDisabled, updateUserInfo, updateUserPassword } from "@/api"
import RoleTable from "./RoleTable.vue"
import ConfirmModal from "@/components/ConfirmModal.vue"
import { hasText, renderTooltip } from "@/utils"
import type { TableColumn } from "naive-ui/es/data-table/src/interface"
import { useConfirmModal } from "@/hooks"

/** naiveui主题相关变量 */
const themeVars = useThemeVars()
/** 表格加载中 */
const isLoading = ref(false)
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

const modalFormRef = ref<FormInst | null>(null)
/** 模态框信息 */
const modalData = ref({
  username: "",
  password: "",
  repeatPassword: "",
  nickname: "",
  email: "",
  phone: "",
})
/** 模态框表单校验规则 */
const rules = {
  username: {
    message: "请输入用户名",
    trigger: ["input", "blur"],
  },
  password: {
    message: "请输入密码",
    trigger: ["input", "blur"],
  },
  repeatPassword: {
    validator: (_: any, value: string) => {
      if (value !== modalData.value.password) {
        return new Error("两次输入的密码不一致")
      }
      return true
    },
    trigger: ["input", "blur"],
  },
  nickname: {
    message: "请输入昵称",
    trigger: ["input", "blur"],
  },
  email: {
    validator: (_: any, value: string) => {
      if (!hasText(value) && !hasText(modalData.value.phone)) {
        return new Error("邮箱和手机号至少填写一项")
      }
    },
    trigger: ["input", "blur"],
  },
  phone: {
    validator: (_: any, value: string) => {
      if (!hasText(value) && !hasText(modalData.value.email)) {
        return new Error("邮箱和手机号至少填写一项")
      }
    },
    trigger: ["input", "blur"],
  },
}

/** 搜索表达式 */
const searchExpression = ref("")
/** 表格列 */
const tableColumns = [
  {
    title: "用户名",
    key: "username",
    ellipsis: {},
  },
  {
    title: "昵称",
    key: "nickname",
  },
  {
    title: "邮箱",
    key: "email",
  },
  {
    title: "手机号",
    key: "phone",
  },
  {
    title: "已设置密码",
    key: "hasPassword",
    width: 100,
    align: "center",
    render: (row: UserInfoResponse) => {
      return h(NCheckbox, {
        checked: !!row.hasPassword,
        disabled: false,
      })
    },
  },
  // {
  //   title: "配额",
  //   key: "capacity",
  //   minWidth: "100px",
  //   render: () => {
  //     return h(
  //       NTooltip,
  //       {
  //         placement: "bottom",
  //       },
  //       {
  //         trigger: () =>
  //           h(
  //             NProgress,
  //             {
  //               type: "line",
  //               "indicator-placement": "outside",
  //               color: themeVars.value.successColor,
  //               "rail-color": changeColor(themeVars.value.successColor, {
  //                 alpha: 0.2,
  //               }),
  //               percentage: 20,
  //             },
  //             {
  //               default: () => "20%",
  //             },
  //           ),
  //         default: () => "20G / 100G",
  //       },
  //     )
  //   },
  // },
  {
    title: () => {
      return renderTooltip(
        h(
          NText,
          {
            size: 24,
            strong: true,
          },
          { default: () => "状态" },
        ),
        "禁用后，用户将无法登录系统",
      )
    },
    key: "isDisabled",
    width: 80,
    render: (row: UserInfoResponse) => {
      return h(
        NButton,
        {
          strong: true,
          tertiary: true,
          size: "small",
          type: !row.disabled ? "success" : "error",
          onClick: async () => {
            row.disabled = !row.disabled
            await updateUserDisabled(row.id, row.disabled)
            window.$message.success("操作成功")
          },
        },
        { default: () => (!row.disabled ? "已启用" : "已禁用") },
      )
    },
  },
  {
    title: "操作",
    key: "actions",
    width: "250px",
    render: (row: UserInfoResponse) => {
      return h(
        NSpace,
        {},
        {
          default: () => [
            h(
              NButton,
              {
                size: "small",
                type: "info",
                secondary: true,
                onClick: () => onAssignRoleButtonClick(row),
              },
              { default: () => "分配角色" },
            ),
            h(
              NButton,
              {
                size: "small",
                type: "warning",
                secondary: true,
                onClick: () => onEditButtonClick(row),
              },
              { default: () => "修改信息" },
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
const tableData = ref<UserInfoResponse[]>([])
/** 选中行 */
const selectRow = ref<UserInfoResponse | null>(null)
/** 显示编辑模态框 */
const showEditModal = ref(false)
/** 处于编辑/新增 */
const isEdit = ref(false)
/** 显示角色表格 */
const showRoleTable = ref(false)

const { openConfirmModal } = useConfirmModal()
function onDeleteButtonClick(row: UserInfoResponse) {
  openConfirmModal(async () => {
    await deleteUser(row.id)
    getData()
    window.$message.success("删除成功")
  })
}

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
/** 页面挂载前开始获取数据 */
onBeforeMount(() => {
  getData()
})
/** 编辑模态框关闭后事件 */
const onAfterEditModalLeave = () => {
  modalData.value = {
    username: "",
    password: "",
    repeatPassword: "",
    nickname: "",
    email: "",
    phone: "",
  }
}
/** 新增按钮点击事件 */
const onAddButtonClick = () => {
  isEdit.value = false
  showEditModal.value = true
}
/** 模态框按钮点击事件 */
const onModalPositiveButtonClick = async () => {
  if (!isEdit.value) {
    // 新增用户
    await (modalFormRef.value as FormInst).validate()

    await addUser(modalData.value)
    window.$message.success("新增成功")
  } else {
    // 修改用户信息
    if (selectRow.value === null) {
      window.$message.error("未选中用户")
      return
    }
    await updateUserInfo(selectRow.value.id, modalData.value)
    window.$message.success("修改成功")
  }
  getData()
  showEditModal.value = false
}
/** 编辑按钮点击事件 */
const onEditButtonClick = (row: UserInfoResponse) => {
  isEdit.value = true
  selectRow.value = row
  modalData.value = {
    username: row.username,
    password: "",
    repeatPassword: "",
    nickname: row.nickname,
    email: row.email,
    phone: row.phone,
  }
  showEditModal.value = true
}

/** 分配角色按钮点击事件 */
const onAssignRoleButtonClick = (row: UserInfoResponse) => {
  selectRow.value = row
  showRoleTable.value = true
}

/** 获取表格数据 */
const getData = async () => {
  isLoading.value = true
  const data = await getUsers(pagination.page - 1, pagination.pageSize, searchExpression.value)
  tableData.value = data.list
  pagination.itemCount = data.itemCount
  isLoading.value = false
}
</script>

<template>
  <div style="padding: 12px">
    <!-- 新增编辑模态框 -->
    <n-modal
      v-model:show="showEditModal"
      preset="card"
      :style="{
        width: '400px',
      }"
      :title="isEdit ? '修改信息' : '新增用户'"
      :bordered="false"
      :mask-closable="true"
      @after-leave="onAfterEditModalLeave"
    >
      <n-space vertical>
        <n-form ref="modalFormRef" :model="modalData" :rules="rules" label-placement="left" label-width="auto">
          <n-form-item path="username" label="用户名">
            <n-tooltip :disabled="!isEdit" trigger="hover" placement="top">
              <template #trigger>
                <n-input
                  v-model:value="modalData.username"
                  clearable
                  placeholder="留空则自动生成"
                  :input-props="{ autocomplete: 'off' }"
                  :disabled="isEdit"
                />
              </template>
              用户名不可修改
            </n-tooltip>
          </n-form-item>
          <n-form-item path="password" label="密码">
            <n-input
              v-model:value="modalData.password"
              type="password"
              clearable
              :placeholder="isEdit ? '留空则不修改密码' : '输入密码'"
              :input-props="{ autocomplete: 'new-password' }"
            />
          </n-form-item>
          <n-form-item v-show="modalData.password" path="repeatPassword" label="确认密码">
            <n-input v-model:value="modalData.repeatPassword" type="password" clearable placeholder="重复密码" />
          </n-form-item>
          <n-form-item path="nickname" label="昵称">
            <n-input v-model:value="modalData.nickname" clearable placeholder="输入昵称" />
          </n-form-item>
          <n-form-item path="email" label="邮箱">
            <n-input v-model:value="modalData.email" clearable placeholder="输入邮箱" />
          </n-form-item>
          <n-form-item path="phone" label="手机号">
            <n-input v-model:value="modalData.phone" clearable placeholder="输入手机号" />
          </n-form-item>
        </n-form>
      </n-space>
      <n-space justify="end" style="width: 100%">
        <n-button :type="isEdit ? 'warning' : 'success'" @click="onModalPositiveButtonClick">
          {{ isEdit ? "修改" : "确定" }}
        </n-button>
      </n-space>
    </n-modal>

    <RoleTable v-model:show="showRoleTable" :user="selectRow!" />

    <!-- 页面内容 -->
    <n-flex vertical>
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
          <n-input
            v-model:value="searchExpression"
            :disabled="isLoading"
            placeholder="用户名、昵称、邮箱"
            @keyup.enter="getData"
          >
            <template #prefix>
              <n-icon :component="SearchOutline" />
            </template>
          </n-input>
          <n-button ghost :disabled="isLoading || searchExpression.length === 0" @click="getData"> 搜索 </n-button>
        </n-input-group>
      </n-space>

      <!-- 表格区 -->
      <n-data-table
        remote
        striped
        :bordered="true"
        :columns="tableColumns as TableColumn[]"
        :data="tableData"
        :pagination="pagination"
        :loading="isLoading"
        @update:page="onPageChange"
        @update:page-size="onPageSizeChange"
      />
    </n-flex>
  </div>
</template>
