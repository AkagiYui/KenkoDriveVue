<script setup lang="ts">
import { AddOutline, RefreshOutline, SearchOutline } from '@vicons/ionicons5'
import { deleteUser, getUsers } from '@/api/user'
import { h, onBeforeMount, reactive, ref, nextTick } from 'vue'
import { NButton, NInput, NProgress, NTooltip, NText } from 'naive-ui'
import { changeColor } from 'seemly'
import { useThemeVars, type DropdownOption, type PaginationProps } from 'naive-ui'

const themeVars = useThemeVars()

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
}

onBeforeMount(() => {
  getData()
})

const showDropdown = ref(false)
const x = ref(0)
const y = ref(0)
const selectRow = ref<User>(null)
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
  }
}
const onMenuClick = (x: string) => {
  switch (x) {
    case 'edit':
      window.$message.info('编辑')
      break
    case 'delete':
      deleteUser(selectRow.value.id)
        .then(() => {
          getData()
          window.$message.success('删除成功')
        })
        .catch((e) => {
          window.$message.error('删除失败')
          console.error(e)
        })
      break
  }
}
</script>

<template>
  <div style="padding: 12px">
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
            <n-button tertiary type="primary">
              <template #icon>
                <n-icon>
                  <AddOutline />
                </n-icon>
              </template>
              新增
            </n-button>
            <NInput placeholder="搜索">
              <template #prefix>
                <n-icon :component="SearchOutline" />
              </template>
            </NInput>
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
      />
    </n-space>
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
  </div>
</template>

<style scoped></style>
