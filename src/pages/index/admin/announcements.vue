<route lang="json">
{
  "name": "announcement-manage",
  "meta": {
    "title": "公告管理"
  }
}
</route>

<script setup lang="ts">
import { AddOutline, RefreshOutline, SearchOutline } from "@vicons/ionicons5"
import type { PaginationProps } from "naive-ui"
import { type FormInst, NButton, NInput, NSpace, NText, NTooltip } from "naive-ui"
import {
  addAnnouncement,
  deleteAnnouncement,
  getAnnouncements,
  updateAnnouncement,
  updateAnnouncementStatus,
} from "@/api/announcement"
import ConfirmModal from "@/components/ConfirmModal.vue"
import { renderTooltip } from "@/utils"

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
/** 显示删除确认模态框 */
const showDeleteConfirmModal = ref(false)
const modalFormRef = ref<FormInst | null>(null)
/** 模态框信息 */
const modalData = ref({ title: "", content: "" })
/** 模态框表单校验规则 */
const rules = {
  title: {
    required: true,
    message: "请输入标题",
    min: 1,
    trigger: ["input", "blur"],
  },
  content: {
    required: true,
    min: 1,
    message: "请输入内容",
    trigger: ["input", "blur"],
  },
}
/** 搜索表达式 */
const searchExpression = ref("")
/** 表格列 */
const tableColumns = [
  {
    title: "标题",
    key: "title",
    resizable: true,
  },
  {
    title: "发布时间",
    key: "createTime",
    maxWidth: 200,
    resizable: true,
  },
  {
    title: "发布者",
    key: "username",
    width: 100,
    resizable: true,
  },
  {
    title: "内容",
    key: "capacity",
    minWidth: "200px",
    resizable: true,
    render: (row: Announcement) => {
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
    render: (row: Announcement) => {
      return h(
        NButton,
        {
          strong: true,
          tertiary: true,
          size: "small",
          type: row.enabled ? "success" : "error",
          onClick: () => {
            updateAnnouncementStatus(row.id, row.enabled)
              .then(() => {
                row.enabled = !row.enabled
                window.$message.success("操作成功")
              })
              .catch((e) => {
                window.$message.error("操作失败")
                console.error(e)
              })
          },
        },
        { default: () => (row.enabled ? "已发布" : "已隐藏") },
      )
    },
  },
  {
    title: "操作",
    key: "actions",
    width: "140px",
    render: (row: Announcement) => {
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
const tableData = computed(() => {
  if (!requestData.value) return []
  return requestData.value.map((announcement) => {
    const n = announcement
    n.createTime = new Date(announcement.createTime).toLocaleString()
    return n
  })
})
/** 选中行 */
const selectRow = ref<Announcement | null>(null)
/** 显示编辑模态框 */
const showEditModal = ref(false)
/** 处于编辑/新增 */
const isEdit = ref(false)
/** 请求数据 */
const requestData = ref<Announcement[]>([])

/** 页码改变事件 */
function onPageChange(page: number) {
  pagination.page = page
  getData()
}

/** 每页记录数改变事件 */
function onPageSizeChange(pageSize: number) {
  pagination.pageSize = pageSize
  pagination.page = 1
  getData()
}

/** 页面挂载前事件 */
onBeforeMount(() => {
  getData()
})

/** 删除确认事件 */
function onDeleteConfirm() {
  if (!selectRow.value) return
  deleteAnnouncement(selectRow.value.id)
    .then(() => {
      getData()
      window.$message.success("删除成功")
    })
    .catch((e) => {
      window.$message.error("删除失败")
      console.error(e)
    })
  showDeleteConfirmModal.value = false
}

/** 编辑模态框关闭后事件 */
function onAfterEditModalLeave() {
  modalData.value = {
    title: "",
    content: "",
  }
}

/** 新增按钮点击事件 */
function onAddButtonClick() {
  isEdit.value = false
  showEditModal.value = true
}

/** 模态框按钮点击事件 */
function onModalPositiveButtonClick() {
  modalFormRef.value
    ?.validate()
    .then(() => {
      if (isEdit.value) {
        // 修改用户信息
        if (!selectRow.value) {
          throw new Error("未选中用户")
        }
        if (!selectRow.value.id) {
          throw new Error("未获取到用户ID")
        }
        updateAnnouncement(selectRow.value.id, modalData.value.title, modalData.value.content)
          .then(() => {
            getData()
            window.$message.success("修改成功")
          })
          .catch(() => {
            window.$message.error("修改失败")
          })
      } else {
        // 新增条目
        addAnnouncement(modalData.value)
          .then(() => {
            getData()
            window.$message.success("新增成功")
          })
          .catch(() => {
            window.$message.error("新增失败")
          })
      }
    })
    .catch(() => {})
}

/** 编辑按钮点击事件 */
function onEditButtonClick(row: Announcement) {
  isEdit.value = true
  selectRow.value = row
  modalData.value = {
    title: row.title,
    content: row.content,
  }
  showEditModal.value = true
}

/** 获取表格数据 */
function getData() {
  isLoading.value = true
  getAnnouncements(pagination.page - 1, pagination.pageSize, searchExpression.value)
    .then((res) => {
      let data: Page<any> = res.data
      requestData.value = data.list
      pagination.itemCount = data.total
    })
    .catch((e) => {
      window.$message.error("数据获取失败")
      console.error(e)
    })
    .finally(() => (isLoading.value = false))
}
</script>

<template>
  <div style="padding: 12px">
    <!-- 确认删除模态框 -->
    <ConfirmModal v-model:show="showDeleteConfirmModal" @positive-click="onDeleteConfirm" />

    <!-- 新增删除模态框 -->
    <n-modal
      v-model:show="showEditModal"
      preset="card"
      :title="isEdit ? '修改公告' : '新增公告'"
      style="width: 400px"
      :bordered="false"
      :mask-closable="false"
      @after-leave="onAfterEditModalLeave"
    >
      <n-space vertical>
        <n-form ref="modalFormRef" :model="modalData" :rules="rules" label-placement="left" label-width="auto">
          <n-form-item label="标题" path="title">
            <n-input v-model:value="modalData.title" placeholder="输入标题" />
          </n-form-item>
          <n-form-item label="内容" path="content">
            <n-input v-model:value="modalData.content" placeholder="输入内容" type="textarea" />
          </n-form-item>
        </n-form>
      </n-space>
      <n-space justify="end" style="width: 100%">
        <n-button :type="isEdit ? 'warning' : 'success'" @click="onModalPositiveButtonClick">
          {{ isEdit ? "修改" : "确定" }}
        </n-button>
      </n-space>
    </n-modal>

    <!-- 页面内容 -->
    <n-space vertical>
      <!-- 按钮区 -->
      <n-space style="margin-bottom: 4px">
        <n-button :disabled="isLoading" tertiary type="info" @click="getData">
          <template #icon>
            <n-icon :component="RefreshOutline" />
          </template>
          刷新
        </n-button>

        <n-button tertiary type="primary" @click="onAddButtonClick">
          <template #icon>
            <n-icon :component="AddOutline" />
          </template>
          新增
        </n-button>

        <n-input-group>
          <n-input
            v-model:value="searchExpression"
            :disabled="isLoading"
            placeholder="标题、内容"
            @keyup.enter="getData"
          >
            <template #prefix>
              <n-icon :component="SearchOutline" />
            </template>
          </n-input>
          <n-button :disabled="isLoading || searchExpression.length === 0" ghost @click="getData"> 搜索 </n-button>
        </n-input-group>
      </n-space>

      <!-- 表格区 -->
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
