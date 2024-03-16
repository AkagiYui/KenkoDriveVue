<script setup lang="ts">
import { AddOutline, RefreshOutline, SearchOutline } from "@vicons/ionicons5"
import { deleteUser, getUsers, updateUserDisabled } from "@/api/user"
import { h, onBeforeMount, reactive, ref, nextTick } from "vue"
import { NButton, NInput, NTooltip, NText, NSpace } from "naive-ui"
import { type DropdownOption, type PaginationProps } from "naive-ui"
import ConfirmModal from "@/components/ConfirmModal.vue"

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

const renderTooltip = (trigger: any, content: string) => {
  return h(NTooltip, null, {
    trigger: () => trigger,
    default: () => content,
  })
}

/** 表格列 */
const tableColumns = [
  {
    title: "标题",
    key: "title",
  },
  {
    title: "发布时间",
    key: "createTime",
  },
  {
    title: "发布者",
    key: "email",
  },
  {
    title: "内容",
    key: "capacity",
    minWidth: "200px",
    render(row: Announcement) {
      return h(
        NTooltip,
        {
          placement: "bottom",
        },
        {
          trigger: () =>
            h(
              NText,
              {},
              {
                default: () => row.content,
              },
            ),
          default: () => row.content,
        },
      )
    },
  },
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
        "禁用后，用户将无法看到该公告",
      )
    },
    key: "isDisabled",
    width: "100px",
    render(row: User) {
      return h(
        NButton,
        {
          strong: true,
          tertiary: true,
          size: "small",
          type: !row.disabled ? "success" : "error",
          onClick: () => {
            row.disabled = !row.disabled
            updateUserDisabled(row.id, row.disabled)
              .then(() => {
                window.$message.success("操作成功")
              })
              .catch((e) => {
                window.$message.error("操作失败")
                console.error(e)
              })
          },
        },
        { default: () => (!row.disabled ? "已发布" : "已隐藏") },
      )
    },
  },
  {
    title: "操作",
    key: "actions",
    width: "140px",
    render(row: User) {
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
                onClick: () => onEditUser(),
              },
              { default: () => "编辑" },
            ),
            h(
              NButton,
              {
                size: "small",
                type: "error",
                secondary: true,
                onClick: () => {
                  selectRow.value = row
                  if (!selectRow.value) return
                  showDeleteConfirmModal.value = true
                },
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
const tableData = ref<User[]>([])
/** 获取表格数据 */
const getData = () => {
  isLoading.value = true
  getUsers(pagination.page - 1, pagination.pageSize)
    .then((res) => {
      let data: Page<User> = res.data
      tableData.value = data.list
      pagination.itemCount = data.total
    })
    .catch((e) => {
      window.$message.error("数据获取失败")
      console.error(e)
    })
    .finally(() => (isLoading.value = false))
}

onBeforeMount(() => {
  getData()
})

const showDropdown = ref(false)
const x = ref(0)
const y = ref(0)
const selectRow = ref<User | null>(null)
const options = ref<DropdownOption[]>([
  {
    label: "编辑",
    key: "edit",
  },
  {
    label: () => h(NText, { type: "error" }, () => "删除"),
    key: "delete",
  },
])
const rowProps = (row: User) => {
  return {
    onContextmenu: (e: MouseEvent) => {
      e.preventDefault()
      showDropdown.value = false
      nextTick().then(() => {
        selectRow.value = row
        showDropdown.value = true
        x.value = e.clientX
        y.value = e.clientY
      })
    },
    // ondblclick: (e: MouseEvent) => {
    //   e.preventDefault()
    //   selectRow.value = row
    //   onEditUser()
    // },
  }
}
const onEditUser = () => {
  if (!selectRow.value) return
  window.$message.info("编辑：" + selectRow.value.nickname)
}
const toDeleteUser = () => {
  if (!selectRow.value) return
  deleteUser(selectRow.value.id)
    .then(() => {
      getData()
      window.$message.success("删除成功")
    })
    .catch((e) => {
      window.$message.error("删除失败")
      console.error(e)
    })
}
const onMenuClick = (x: string) => {
  switch (x) {
    case "edit":
      onEditUser()
      break
    case "delete":
      if (!selectRow.value) return
      showDeleteConfirmModal.value = true
      break
  }
}
const showDeleteConfirmModal = ref(false)

/** 模态框信息 */
const modalData = ref({ name: "", number: "", className: "" })
/** 模态框表单校验规则 */
const rules = {
  number: {
    required: true,
    message: "请输入学号",
    min: 3,
    trigger: ["input", "blur"],
  },
  name: {
    required: true,
    min: 2,
    message: "请输入姓名",
    trigger: ["input", "blur"],
  },

  className: {
    required: true,
    min: 3,
    message: "请输入班级",
    trigger: ["input", "blur"],
  },
}
</script>

<template>
  <div style="padding: 12px">
    <!-- 确认删除模态框 -->
    <ConfirmModal
      v-model:show="showDeleteConfirmModal"
      @positive-click="
        () => {
          toDeleteUser()
          showDeleteConfirmModal = false
        }
      "
    />

    <!-- 新增删除模态框 -->
    <NModal
      :show="false"
      preset="card"
      :style="{
        width: '400px',
      }"
      :title="true ? '新增用户' : '修改信息'"
      :bordered="false"
      :mask-closable="false"
      @after-leave="() => {}"
    >
      <NSpace vertical>
        <NForm
          ref="modalFormRef"
          :model="modalData"
          :rules="rules"
          label-placement="left"
          label-width="auto"
        >
          <NFormItem path="number" label="用户名">
            <NInput
              v-model:value="modalData.number"
              clearable
              placeholder="输入用户名"
            />
          </NFormItem>
          <NFormItem path="number" label="密码">
            <NInput
              v-model:value="modalData.number"
              clearable
              placeholder="输入密码"
            />
          </NFormItem>
          <NFormItem path="number" label="确认密码">
            <NInput v-model:value="modalData.number" clearable placeholder="" />
          </NFormItem>
          <NFormItem path="name" label="昵称">
            <NInput
              v-model:value="modalData.name"
              clearable
              placeholder="输入昵称"
            />
          </NFormItem>
          <NFormItem path="className" label="邮箱">
            <NInput
              v-model:value="modalData.className"
              clearable
              placeholder="输入邮箱"
            />
          </NFormItem>
        </NForm>
      </NSpace>
      <template #action>
        <NSpace justify="end" style="width: 100%">
          <NButton
            :type="true ? 'success' : 'warning'"
            @click="true ? addData() : updateData()"
          >
            {{ true ? "确定" : "修改" }}
          </NButton>
        </NSpace>
      </template>
    </NModal>

    <!-- 表格右键菜单 -->
    <n-dropdown
      placement="bottom-start"
      trigger="manual"
      :x="x"
      :y="y"
      :options="options"
      :show="showDropdown"
      :on-clickoutside="() => (showDropdown = false)"
      @select="
        (x: string) => {
          showDropdown = false
          onMenuClick(x)
        }
      "
    />
    <n-space vertical>
      <n-form :show-label="false" inline :show-feedback="false">
        <n-formItem path="学号">
          <n-space>
            <n-button tertiary type="info" @click="getData">
              <template #icon>
                <n-icon>
                  <RefreshOutline />
                </n-icon>
              </template>
              刷新
            </n-button>
            <n-button
              tertiary
              type="primary"
              :disabled="true"
              @click="ppp = true"
            >
              <template #icon>
                <n-icon>
                  <AddOutline />
                </n-icon>
              </template>
              新增
            </n-button>
            <n-input-group>
              <n-input>
                <template #prefix>
                  <n-icon :component="SearchOutline" />
                </template>
              </n-input>
              <n-button type="primary" ghost :disabled="true"> 搜索 </n-button>
            </n-input-group>
          </n-space>
        </n-formItem>
      </n-form>
      <n-data-table
        remote
        striped
        :bordered="true"
        :columns="tableColumns"
        :data="tableData"
        :pagination="pagination"
        :row-props="rowProps"
        :loading="isLoading"
        @update:page="onPageChange"
        @update:page-size="onPageSizeChange"
      />
    </n-space>
  </div>
</template>

<style scoped></style>
