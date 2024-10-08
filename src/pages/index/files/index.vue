<route lang="json">
{
  "name": "files",
  "meta": {
    "title": "文件"
  }
}
</route>

<script setup lang="ts">
import { ArrowUp, Folder } from "@vicons/carbon"
import {
  AddOutline,
  ArrowUpOutline,
  RefreshOutline,
  TrashBinOutline,
  SearchOutline,
  FilterOutline,
} from "@vicons/ionicons5"
import { FolderOpenOutlined } from "@vicons/material"
import {
  ArrowDownload24Regular as DownloadIcon,
  Delete24Regular as DeleteIcon,
  Play24Regular as PlayIcon,
  Rename24Regular as RenameIcon,
  ReOrderDotsHorizontal16Regular as ReOrderIcon,
  Share24Regular as ShareIcon,
  DocumentLock24Regular,
} from "@vicons/fluent"
import { filesize } from "filesize"
import CreateFolderModal from "./CreateFolderModal.vue"
import SharingModal from "./SharingModal.vue"

const { isDarkMode, lastFolderIds } = storeToRefs(useAppConfig())
const { userId } = storeToRefs(useUserInfo())
const router = useRouter()

useBusEvent(BusEvent.UPLOAD_SUCCESS, (folderId) => {
  if (currentFolderId.value === folderId) {
    loadFolder(folderId)
  }
})

const codeFileSuffix = [
  "java",
  "js",
  "jsx",
  "tsx",
  "vue",
  "json",
  "html",
  "yaml",
  "yml",
  "css",
  "scss",
  "less",
  "lrc",
  "txt",
  "ass",
  "srt",
  "xml",
  "sql",
  "kt",
]

/**
 * 主题相关变量
 */
const themeVars = useThemeVars()

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
function rowProps(row: TableData): HTMLAttributes {
  return {
    onDblclick: () => onDoubleClick(row),
    // 当拖动开始时触发
    onDragstart: (event: DragEvent) => {
      allowDrop.value = false
      event.dataTransfer!.effectAllowed = "move" // 设置拖动指针样式
      event.dataTransfer!.setData("id", row.id) // 设置拖动数据
      event.dataTransfer!.setData("type", row.type)
    },
    // 当拖动元素在目标元素上时触发
    onDragover: (event: DragEvent) => {
      if (row.type === "folder") {
        // 只有文件夹可以放置
        event.preventDefault() // 阻止默认行为以允许放置
      }
    },
    // 当拖动元素放到目标元素上时触发
    onDrop: async (event: DragEvent) => {
      const id = event.dataTransfer!.getData("id")
      const type = event.dataTransfer!.getData("type")
      if (type === "folder") {
        onFolderMove(id, row.id)
      } else {
        onFileMove(id, row.id)
      }
      allowDrop.value = true
    },
    draggable: true, // 设置行为可拖动
  }
}

async function onFileMove(fileId: string, targetId: string | undefined) {
  await moveFile(fileId, targetId)
  window.$message.success("移动成功")
  loadFolder(currentFolderId.value)
}

async function onFolderMove(folderId: string, targetId: string | undefined) {
  if (folderId === targetId) {
    window.$message.error("不能移动到自己")
    return
  }
  await moveFolder(folderId, targetId)
  window.$message.success("移动成功")
  loadFolder(currentFolderId.value)
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
const contentResponse = ref<FolderContentResponse>({
  folders: [],
  files: [],
  folderChain: [],
})
/**
 * 表格列
 */
const columns: DataTableColumns<TableData> = [
  // { type: "selection" },
  {
    title: "文件名",
    key: "name",
    render: (row: TableData) => {
      const isFolder = row.type === "folder"
      const isLocked = row.locked
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
              { size: 30, color: isLocked ? themeVars.value.errorColor : themeVars.value.primaryColor, depth: 2 },
              {
                default: () =>
                  h(
                    isFolder
                      ? FolderOpenOutlined
                      : isLocked
                        ? DocumentLock24Regular
                        : type2Icon(row.fileType, row.name),
                  ),
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
    width: "100px",
  },
  {
    title: "操作",
    key: "actions",
    width: "80px",
    render: (row: TableData) => {
      return h(
        NDropdown,
        {
          options: row.type === "folder" ? options : fileOptions,
          trigger: "hover",
          onSelect: (key) => onActionSelect(key, row),
        },
        {
          default: () =>
            h(
              NButton,
              {
                strong: true,
                secondary: true,
                circle: true,
              },
              {
                icon: renderIcon(ReOrderIcon),
              },
            ),
        },
      )
    },
  },
]

function onActionSelect(key: string, row: TableData) {
  switch (key) {
    case "share":
      shareFile(row)
      break
    case "rename":
      renameItem(row)
      break
    case "delete":
      deleteItem(row)
      break
    case "play":
      playFile(row)
      break
    case "download":
      downloadFile(row)
      break
  }
}

function shareFile(row: TableData) {
  sharingModalProps.value = { filename: row.name, id: row.id }
  showSharingModal.value = true
}

const { openConfirmModal } = useConfirmModal()
function deleteItem(row: TableData) {
  openConfirmModal(async () => {
    const endpoint = row.type === "folder" ? deleteFolder : deleteFile
    await endpoint(row.id)
    window.$message.success("删除成功")
    loadFolder(currentFolderId.value)
  })
}
const { openRenameModal } = useRenameModal()
function renameItem(row: TableData) {
  openRenameModal(row.name, async (newName) => {
    if (!newName) {
      return
    }
    const endpoint = row.type === "folder" ? renameFolder : renameUserFile
    await endpoint(row.id, newName)
    window.$message.success("重命名成功")
    loadFolder(currentFolderId.value)
  })
}

const imagePreviewUrl = ref("")

async function playFile(row: TableData) {
  if (row.type === "folder") {
    return
  }
  if (row.locked) {
    window.$message.error("文件已锁定，无法加载")
    return
  }

  const fileType = row.fileType!

  // 图片预览
  if (fileType.startsWith("image")) {
    const url = await getFileTemporaryUrl(row.id)
    imagePreviewUrl.value = url
    window.$loadingbar.start()
    return
  }

  // 视频、音频播放
  if (fileType.startsWith("video")) {
    const url = await getFileTemporaryUrl(row.id)
    const route = router.resolve({
      name: "video-preview",
      query: { url },
    })
    window.open(route.href, "_blank")
    emitBusEvent(BusEvent.PAUSE_MUSIC)
    return
  }
  if (fileType.startsWith("audio")) {
    const url = await getFileTemporaryUrl(row.id)
    emitBusEvent(BusEvent.PLAY_MUSIC, url)
    return
  }

  // PDF 预览
  if (fileType === "application/pdf") {
    const url = await getFileTemporaryUrl(row.id)
    // 使用浏览器打开
    // fetch(url)
    //   .then((res) => res.blob())
    //   .then((res) => {
    //     const blob = new Blob([res], { type: "application/pdf" })
    //     const url = URL.createObjectURL(blob)
    //     window.open(url, "_blank")
    //   })

    // 使用内置 PDF 阅读器
    const route = router.resolve({
      name: "pdf-preview",
      query: { url },
    })
    window.open(route.href, "_blank")
    return
  }

  // docx
  if (fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
    const url = await getFileTemporaryUrl(row.id)
    const route = router.resolve({
      name: "docx-preview",
      query: { url },
    })
    window.open(route.href, "_blank")
    return
  }
  // xlsx
  if (fileType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
    const url = await getFileTemporaryUrl(row.id)
    const route = router.resolve({
      name: "xlsx-preview",
      query: { url },
    })
    window.open(route.href, "_blank")
    return
  }

  // 未知文件类型，使用后缀
  const suffix = row.name.split(".").pop()
  if (["md", "markdown"].includes(suffix!)) {
    getFileTemporaryUrl(row.id).then((res) => {
      window.$loadingbar.start()
      fetch(res)
        .then((res) => res.text())
        .then((res) => {
          window.$loadingbar.finish()
          markdownPreviewValue.value = res
          showMarkdownPreview.value = true
        })
    })
    return
  }
  if (codeFileSuffix.includes(suffix!)) {
    const url = await getFileTemporaryUrl(row.id)
    window.$loadingbar.start()
    monacoPreviewValue.value = await fetch(url).then((res) => res.text())
    window.$loadingbar.finish()
    monacoLanguage.value = suffix!
    showMonaco.value = true
    return
  }

  // 不支持的文件类型
  window.$message.error("暂不支持该文件类型的预览")
  console.log("unknown file type", fileType, row.name)
}

async function downloadFile(row: TableData) {
  if (row.locked) {
    window.$message.error("文件已锁定，无法下载")
    return
  }
  const url = await getFileTemporaryUrl(row.id, false, row.name)
  // 创建a标签
  const a = document.createElement("a")
  a.href = url
  a.download = row.name
  a.click()
  a.remove()
}

function onImageLoaded() {
  window.$loadingbar.finish()
  imageRef?.value?.click()
}

const options = [
  {
    label: "重命名",
    key: "rename",
    icon: renderIcon(RenameIcon),
  },
  {
    label: "删除",
    key: "delete",
    icon: renderIcon(DeleteIcon),
  },
]
const fileOptions = [
  {
    label: "预览",
    key: "play",
    icon: renderIcon(PlayIcon),
  },
  {
    label: "下载",
    key: "download",
    icon: renderIcon(DownloadIcon),
  },
  {
    label: "分享",
    key: "share",
    icon: renderIcon(ShareIcon),
  },
  ...options,
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
    ...folders
      .map((folder) => ({
        id: folder.id,
        name: folder.name,
        size: "-",
        type: "folder",
        createTime: new Date(folder.createTime).toLocaleString(),
        locked: false,
      }))
      .filter(({ name }) => name.includes(filterInputValue.value)),
    ...files
      .map((file) => ({
        id: file.id,
        name: file.name,
        size: filesize(file.size, { standard: "jedec" }),
        type: "file",
        createTime: new Date(file.createTime).toLocaleString(),
        fileType: file.type,
        locked: file.locked,
      }))
      .filter(({ name }) => name.includes(filterInputValue.value)),
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

/** 当前文件夹id */
const currentFolderId = ref<string | null>(null)
/** 监听文件夹id变化 */
watch(currentFolderId, (id) => {
  lastFolderIds.value[userId.value] = id
  loadFolder(id)
})
function updateFolderIdAndLoad() {
  const lastFolderId = lastFolderIds.value[userId.value]
  currentFolderId.value = lastFolderId || null // 如果没有lastFolderId，则设置为null
  if (currentFolderId.value) {
    loadFolder(currentFolderId.value)
  } else {
    loadFolder() // 如果没有folderId，则调用loadFolder()加载默认数据
  }
}
let firstLoaded = false
watchEffect(() => {
  // userId变化时，更新文件夹id并加载
  if (!firstLoaded && userId.value) {
    updateFolderIdAndLoad()
  }
})

/**
 * 双击事件
 * @param row 行数据
 */
function onDoubleClick(row: TableData) {
  if (row.type === "folder") {
    currentFolderId.value = row.id
  } else {
    playFile(row)
  }
}

/**
 * 加载文件夹内容
 * @param id 文件夹id
 */
async function loadFolder(id?: string | null, filter?: string) {
  firstLoaded = true
  contentResponse.value = await getFolderContent(id, filter)
}

const showCreateFolderModal = ref(false)
const imageRef = ref<typeof NImage | null>(null)
const showMarkdownPreview = ref(false)
const markdownPreviewValue = ref("")

const showMonaco = ref(false)
const monacoPreviewValue = ref("")
const monacoLanguage = ref("plaintext")

const allowDrop = ref(true)

function onDrop(file: FileSystemFileEntry[]) {
  if (!file.length) return
  const folderId = currentFolderId.value
  emitBusEvent(BusEvent.ADD_ENTRIES, { file, folderId })
}

const fileInputRef = ref<HTMLInputElement | null>(null)
function onUploadFileButtonClick() {
  fileInputRef.value?.click()
}
onMounted(() => {
  fileInputRef.value?.addEventListener("change", (event: any) => {
    if (!event.target.files) return
    emitBusEvent(BusEvent.ADD_FILELIST, {
      file: event.target.files,
      folderId: currentFolderId.value,
    })
  })
})

function onBreadcrumbDrop(folderId: string | undefined, event: DragEvent) {
  const id = event.dataTransfer!.getData("id")
  const type = event.dataTransfer!.getData("type")
  if (type === "folder") {
    onFolderMove(id, folderId)
  } else {
    onFileMove(id, folderId)
  }
}

const expressionInputValue = ref("")
function onSearchButtonClick() {
  if (expressionInputValue.value) {
    loadFolder(currentFolderId.value, expressionInputValue.value)
  }
}

const filterInputValue = ref("")

const showSharingModal = ref(false)
const sharingModalProps = ref({ filename: "", id: "" })
</script>

<template>
  <FullScreenDrag v-if="allowDrop" @drop="onDrop"></FullScreenDrag>

  <input v-show="false" ref="fileInputRef" MULTIPLE type="file" />

  <n-image
    ref="imageRef"
    :show-toolbar-tooltip="true"
    :src="imagePreviewUrl"
    style="display: none; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%)"
    @load="onImageLoaded"
  />

  <n-modal v-model:show="showMarkdownPreview" preset="card" style="width: 70%" title="Markdown 预览">
    <MarkdownPreview :value="markdownPreviewValue" />
  </n-modal>

  <n-modal v-model:show="showMonaco" preset="card" style="width: 80%; height: 80vh" title="代码预览">
    <MonacoEditor :content="monacoPreviewValue" :dark="isDarkMode" :language="monacoLanguage" />
  </n-modal>

  <CreateFolderModal
    v-model:show="showCreateFolderModal"
    :parent="currentFolderId"
    @success="() => loadFolder(currentFolderId)"
  />

  <SharingModal :id="sharingModalProps.id" v-model:show="showSharingModal" :filename="sharingModalProps.filename" />

  <div style="padding-top: 10px">
    <!-- 页面内容 -->
    <n-flex vertical>
      <!-- 操作按钮 -->
      <n-space class="buttons-container" :style="{ '--color': themeVars.dividerColor }">
        <n-button
          tertiary
          type="info"
          @click="
            () => {
              filterInputValue = ''
              loadFolder(currentFolderId)
            }
          "
        >
          <template #icon>
            <n-icon :component="RefreshOutline" />
          </template>
          刷新
        </n-button>
        <n-button type="success" secondary @click="onUploadFileButtonClick">
          <template #icon>
            <n-icon :component="ArrowUpOutline" />
          </template>
          上传
        </n-button>
        <n-button secondary @click="showCreateFolderModal = true">
          <template #icon>
            <n-icon :component="AddOutline" />
          </template>
          新建文件夹
        </n-button>
        <n-button v-if="false" type="error">
          <template #icon>
            <n-icon :component="TrashBinOutline" />
          </template>
          删除
        </n-button>
        <n-input-group>
          <n-input v-model:value="expressionInputValue" placeholder="文件名" @keyup.enter="onSearchButtonClick">
            <template #prefix>
              <n-icon :component="SearchOutline" />
            </template>
          </n-input>
          <n-button ghost @click="onSearchButtonClick"> 搜索 </n-button>
        </n-input-group>
        <n-input-group>
          <n-input v-model:value="filterInputValue" placeholder="当前目录筛选">
            <template #prefix>
              <n-icon :component="FilterOutline" />
            </template>
          </n-input>
        </n-input-group>
      </n-space>

      <!-- 面包屑导航 -->
      <n-breadcrumb style="margin: 0 0 0 10px">
        <!-- 返回上级目录 -->
        <n-breadcrumb-item
          :clickable="!!breadcrumbLastItem"
          @click="
            () => {
              if (expressionInputValue) {
                loadFolder()
              }
              if (!breadcrumbLastItem) {
                return
              }
              const lastItem = breadcrumbItems[breadcrumbItems.length - 1]
              currentFolderId = lastItem ? lastItem.id : null
            }
          "
          @dragover="
            (e) => {
              // 如果当前目录不是根目录，则允许拖放
              if (currentFolderId) {
                e.preventDefault()
              }
            }
          "
          @drop="
            (e) => {
              const lastItem = breadcrumbItems[breadcrumbItems.length - 1]
              onBreadcrumbDrop(lastItem ? lastItem.id : undefined, e)
            }
          "
        >
          <n-icon :depth="1" :component="ArrowUp" />
          <template #separator> |</template>
        </n-breadcrumb-item>

        <!-- 根目录 -->
        <n-breadcrumb-item
          @click="
            () => {
              if (expressionInputValue) {
                loadFolder()
              }
              if (!breadcrumbLastItem) {
                return
              }
              currentFolderId = null
            }
          "
          @dragover="
            (e) => {
              // 如果当前目录不是根目录，则允许拖放
              if (currentFolderId) {
                e.preventDefault()
              }
            }
          "
          @drop="(e) => onBreadcrumbDrop(undefined, e)"
        >
          <n-icon :component="Folder" />
        </n-breadcrumb-item>

        <n-breadcrumb-item
          v-for="item in breadcrumbItems"
          :key="item.id"
          @click="currentFolderId = item.id"
          @dragover="(e) => e.preventDefault()"
          @drop="(e) => onBreadcrumbDrop(item.id, e)"
        >
          {{ item.name }}
        </n-breadcrumb-item>

        <!-- 当前目录 -->
        <n-breadcrumb-item v-if="breadcrumbLastItem">
          {{ breadcrumbLastItem.name }}
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
  --color: 1; /** to prevent missing variable error */
  padding: 0 10px 10px 10px;
  border-bottom: 1px solid var(--color);
  transition: border-color 0.4s ease;
}
</style>
