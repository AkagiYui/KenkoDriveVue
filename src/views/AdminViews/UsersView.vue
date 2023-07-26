<script setup lang="ts">
import { AddOutline, RefreshOutline, SearchOutline } from '@vicons/ionicons5'
import { deleteUser, getUsers } from '@/api/user'
import { h, onBeforeMount, reactive, ref, nextTick } from 'vue'
import { NButton, NInput, NProgress, NTooltip, NText } from 'naive-ui'
import { changeColor } from 'seemly'
import { useThemeVars, type DropdownOption, type PaginationProps } from 'naive-ui'
import ConfirmModal from '@/components/ConfirmModal.vue'

const themeVars = useThemeVars()

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

/** 表格列 */
const tableColumns = [
  {
    title: '用户名',
    key: 'username',
  },
  {
    title: '昵称',
    key: 'nickname',
  },
  {
    title: '邮箱',
    key: 'email',
  },
  {
    title: '配额',
    key: 'capacity',
    minWidth: '200px',
    render(row: User) {
      return h(
        NTooltip,
        {
          placement: 'bottom',
        },
        {
          trigger: () =>
            h(
              NProgress,
              {
                type: 'line',
                'indicator-placement': 'outside',
                color: themeVars.value.successColor,
                'rail-color': changeColor(themeVars.value.successColor, { alpha: 0.2 }),
                percentage: 20,
              },
              {
                default: () => '20%',
              },
            ),
          default: () => '20G / 100G',
        },
      )
    },
  },
  {
    title: '状态',
    key: 'isDisabled',
    width: '100px',
    render(row: User) {
      return h(
        NButton,
        {
          strong: true,
          tertiary: true,
          size: 'small',
          type: row.disabled ? 'success' : 'error',
          onClick: () => (row.disabled = !row.disabled),
        },
        { default: () => (row.disabled ? '已启用' : '已禁用') },
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
      window.$message.error('数据获取失败')
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
    label: '编辑',
    key: 'edit',
  },
  {
    label: () => h(NText, { type: 'error' }, () => '删除'),
    key: 'delete',
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
    ondblclick: (e: MouseEvent) => {
      e.preventDefault()
      selectRow.value = row
      onEditUser()
    },
  }
}
const onEditUser = () => {
  window.$message.info('编辑：' + selectRow.value.nickname)
}
const toDeleteUser = () => {
  deleteUser(selectRow.value.id)
    .then(() => {
      getData()
      window.$message.success('删除成功')
    })
    .catch((e) => {
      window.$message.error('删除失败')
      console.error(e)
    })
}
const onMenuClick = (x: string) => {
  switch (x) {
    case 'edit':
      onEditUser()
      break
    case 'delete':
      if (!selectRow.value) return
      showDeleteConfirmModal.value = true
      break
  }
}
const showDeleteConfirmModal = ref(false)

/** 模态框信息 */
const modalData = ref({ name: '', number: '', className: '' })
/** 模态框表单校验规则 */
const rules = {
  number: {
    required: true,
    message: '请输入学号',
    min: 3,
    trigger: ['input', 'blur'],
  },
  name: {
    required: true,
    min: 2,
    message: '请输入姓名',
    trigger: ['input', 'blur'],
  },

  className: {
    required: true,
    min: 3,
    message: '请输入班级',
    trigger: ['input', 'blur'],
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
          :model="modalData"
          ref="modalFormRef"
          :rules="rules"
          label-placement="left"
          label-width="auto"
        >
          <NFormItem path="number" label="用户名">
            <NInput clearable placeholder="输入用户名" v-model:value="modalData.number" />
          </NFormItem>
          <NFormItem path="number" label="密码">
            <NInput clearable placeholder="输入密码" v-model:value="modalData.number" />
          </NFormItem>
          <NFormItem path="number" label="确认密码">
            <NInput clearable placeholder="" v-model:value="modalData.number" />
          </NFormItem>
          <NFormItem path="name" label="昵称">
            <NInput clearable placeholder="输入昵称" v-model:value="modalData.name" />
          </NFormItem>
          <NFormItem path="className" label="邮箱">
            <NInput clearable placeholder="输入邮箱" v-model:value="modalData.className" />
          </NFormItem>
        </NForm>
      </NSpace>
      <template #action>
        <NSpace justify="end" style="width: 100%">
          <NButton @click="true ? addData() : updateData()" :type="true ? 'success' : 'warning'">
            {{ true ? '确定' : '修改' }}
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
            <n-button tertiary type="primary" @click="ppp = true">
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
              <n-button type="primary" ghost> 搜索 </n-button>
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
        @update:page="onPageChange"
        @update:page-size="onPageSizeChange"
        :row-props="rowProps"
        :loading="isLoading"
      />
    </n-space>
  </div>
</template>

<style scoped></style>
