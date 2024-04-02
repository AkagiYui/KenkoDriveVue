<script setup lang="ts">
import { NButton, NIcon, NFlex, useThemeVars } from "naive-ui"
import type { DataTableColumns } from "naive-ui"
import { Folder, ArrowUp } from "@vicons/carbon"
import { RefreshOutline } from "@vicons/ionicons5"
import {
  FolderOpenTwotone,
  AndroidTwotone,
  GifBoxTwotone,
  InsertDriveFileTwotone,
} from "@vicons/material"
import { filesize } from "filesize"
import { getFolderContent } from "@/api/file"

/**
 * 主题相关变量
 */
const themeVars = useThemeVars()

/**
 * 根据文件类型取图标
 * @param type 文件类型
 */
function type2Icon(type: string) {
  switch (type) {
    case "apk":
      return AndroidTwotone
    case "image/gif":
      return GifBoxTwotone
    default:
      return InsertDriveFileTwotone
  }
}

/**
 * 行样式
 * @param row 行数据
 */
function rowClassName(row: TableData): string {
  return row.type === "folder" ? "folder" : "file"
}

/**
 * 行属性
 * @param row 行数据
 */
function rowProps(row: TableData): Record<string, any> {
  return {
    onDblclick: () => onDoubleClick(row),
  }
}

/**
 * 行索引
 */
function rowKey(row: TableData): string {
  return row.id
}

/**
 * 请求数据
 */
const contentResponse = ref<FolderContent>({
  folders: [],
  files: [],
  folderChain: [],
})
/**
 * 表格列
 */
const columns: DataTableColumns<TableData> = [
  { type: "selection" },
  {
    title: "文件名",
    key: "name",
    render: (row: TableData) => {
      const isFolder = row.type === "folder"
      return h(
        NFlex,
        {
          align: "center",
          wrap: false,
        },
        {
          default: () => [
            h(
              NIcon,
              { size: 30, color: themeVars.value.primaryColor, depth: 2 },
              {
                default: () =>
                  h(isFolder ? FolderOpenTwotone : type2Icon(row.fileType!)),
              },
            ),
            h(
              "span",
              {
                title: row.name,
              },
              { default: () => row.name },
            ),
          ],
        },
      )
    },
  },
  {
    title: "上传时间",
    key: "createTime",
    width: "200px",
  },
  {
    title: "大小",
    key: "size",
    width: "80px",
  },
  {
    title: "操作",
    key: "actions",
    width: "80px",
    render: (row: TableData) => {
      return h(
        NButton,
        {
          strong: true,
          tertiary: true,
          size: "small",
          onClick: () => window.$message.success("预览文件 " + row.name),
        },
        { default: () => "Play" },
      )
    },
  },
]
/**
 * 表格数据
 */
const tableData = computed(() => {
  const { folders, files } = contentResponse.value
  if (!folders || !files) {
    return []
  }
  return [
    ...folders.map((folder) => ({
      id: folder.id,
      name: folder.name,
      size: "-",
      type: "folder",
      createTime: new Date(folder.createTime).toLocaleString(),
    })),
    ...files.map((file) => ({
      id: file.id,
      name: file.name,
      size: filesize(file.size, { standard: "jedec" }),
      type: "file",
      createTime: new Date(file.createTime).toLocaleString(),
      fileType: file.type,
    })),
  ]
})

/**
 * 面包屑导航 - 除了最后一个
 */
const breadcrumbItems = computed(() => {
  // 去除最后一个
  return contentResponse.value.folderChain.slice(0, -1)
})
/**
 * 面包屑导航 - 最后一个
 */
const breadcrumbLastItem = computed(() => {
  return contentResponse.value.folderChain.slice(-1)[0]
})

/**
 * 当前文件夹id
 */
const currentFolderId = ref<string | undefined>(undefined)
/**
 * 监听文件夹id变化
 */
watch(currentFolderId, (id) => {
  loadFolder(id)
})
/**
 * 页面加载时请求数据
 */
onBeforeMount(() => {
  loadFolder()
})

/**
 * 双击事件
 * @param row 行数据
 */
function onDoubleClick(row: TableData) {
  if (row.type === "folder") {
    currentFolderId.value = row.id
  } else {
    window.$message.success("播放文件 " + row)
  }
}

/**
 * 加载文件夹内容
 * @param id 文件夹id
 */
function loadFolder(id?: string): void {
  getFolderContent(id).then((res) => {
    contentResponse.value = res.data
  })
}
</script>

<template>
  <div style="padding-top: 10px">
    <!-- 页面内容 -->
    <n-flex vertical>
      <!-- 操作按钮 -->
      <n-flex
        class="buttons-container"
        :style="{ '--color': themeVars.dividerColor }"
      >
        <n-button
          tertiary
          type="info"
          @click="() => loadFolder(currentFolderId)"
        >
          <template #icon>
            <n-icon :component="RefreshOutline" />
          </template>
          刷新
        </n-button>
        <n-button> 新建文件夹</n-button>
        <n-button :disabled="true" type="error"> 删除</n-button>
      </n-flex>

      <!-- 面包屑导航 -->
      <n-breadcrumb style="margin: 0 0 0 10px">
        <n-breadcrumb-item
          :clickable="!breadcrumbLastItem"
          @click="
            () => {
              if (!breadcrumbLastItem) {
                return
              }
              const lastItem = breadcrumbItems[breadcrumbItems.length - 1]
              const parentId = lastItem ? lastItem.id : undefined
              currentFolderId = parentId
            }
          "
        >
          <n-icon :depth="1" :component="ArrowUp" />
          <template #separator> | </template>
        </n-breadcrumb-item>
        <n-breadcrumb-item
          @click="
            () => {
              if (!breadcrumbLastItem) {
                return
              }
              currentFolderId = undefined
            }
          "
        >
          <n-icon>
            <Folder />
          </n-icon>
        </n-breadcrumb-item>

        <n-breadcrumb-item
          v-for="item in breadcrumbItems"
          :key="item.id"
          @click="currentFolderId = item.id"
          >{{ item.name }}
        </n-breadcrumb-item>
        <n-breadcrumb-item v-if="breadcrumbLastItem"
          >{{ breadcrumbLastItem.name }}
        </n-breadcrumb-item>
      </n-breadcrumb>

      <!-- 数据表格 -->
      <n-data-table
        :columns="columns"
        :data="tableData"
        :pagination="false"
        :bordered="false"
        :row-key="rowKey"
        :row-class-name="rowClassName"
        :row-props="rowProps"
        @update:checked-row-keys="
          (a) => {
            console.log(a)
          }
        "
      >
        <template #empty>
          <n-empty description="空空如也" />
        </template>
      </n-data-table>
    </n-flex>
  </div>
</template>

<style scoped>
:deep(.folder td) {
  cursor: pointer; /* 鼠标移动到文件夹上时显示手型 */
}

:deep(.file td) {
  cursor: pointer; /* 鼠标移动到文件上时显示手型 */
}

.buttons-container {
  padding: 0 10px 10px 10px;
  border-bottom: 1px solid var(--color);
  transition: border-color 0.4s ease;
}
</style>
