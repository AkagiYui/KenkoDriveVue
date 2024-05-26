<script lang="ts" setup>
import { config as requestConfig } from "@/api/request"
import { emitBusEvent, useBusEvent, useEventListener } from "@/hooks"
import { useAppConfig } from "@/stores/app-config"
import { useUserInfo } from "@/stores/user-info"
import { BusEvent } from "@/types"
import { DocumentOutline, FolderOutline } from "@vicons/ionicons5"
import { storeToRefs } from "pinia"
import UploadItem from "./UploadItem.vue"

const { requestToken } = useUserInfo()
const { isUploadDrawerShow, uploadItemCount } = storeToRefs(useAppConfig())

// 初始化上传器
const uploader = new Worker(new URL("./uploadWorker.ts", import.meta.url), {
  type: "module",
})
uploader.postMessage({
  command: "init",
  baseUrl: `${requestConfig.baseURL}/file`,
  token: requestToken,
})
// 上传列表
const displayMap = reactive(new Map<number, UploadDisplayInfo>())
watch(displayMap, () => {
  let notDoneCount = 0
  displayMap.forEach((value) => {
    if (
      value.status !== "mirrored" &&
      value.status !== "merged" &&
      value.status !== "canceled"
    ) {
      notDoneCount++
    }
  })
  uploadItemCount.value = notDoneCount
  running = notDoneCount > 0
})
uploader.onmessage = (e) => {
  const { event } = e.data
  console.log(JSON.stringify(e.data))
  if (event === "appended") {
    const { task } = e.data
    displayMap.set(task.id, {
      id: task.id,
      name: task.filename,
      size: task.file.size,
      type: task.file.type,
      status: "waiting",
      progress: 0,
      folderId: task.folderId,
    })
  } else if (event === "started") {
    const { id } = e.data
    const info = displayMap.get(id)
    if (info) {
      info.status = "uploading"
    }
  } else if (event === "progress") {
    const { id, progress } = e.data
    const info = displayMap.get(id)
    if (info) {
      info.progress = progress * 100
    }
  } else if (event === "mirrored") {
    const { id } = e.data
    const info = displayMap.get(id)
    if (info) {
      info.status = "mirrored"
      info.progress = 100
      emitBusEvent(BusEvent.UPLOAD_SUCCESS, info.folderId)
    }
  } else if (event === "uploaded") {
    const { id } = e.data
    const info = displayMap.get(id)
    if (info) {
      info.status = "uploaded"
      info.progress = 100
    }
  } else if (event === "merged") {
    const { id } = e.data
    const info = displayMap.get(id)
    if (info) {
      info.status = "merged"
      info.progress = 100
      emitBusEvent(BusEvent.UPLOAD_SUCCESS, info.folderId)
    }
  } else if (event === "failed") {
    const { id } = e.data
    const info = displayMap.get(id)
    if (info) {
      info.status = "error"
      info.progress = 0
    }
  }
}

// 阻止关闭页面
let running = false
useEventListener(window, "beforeunload", (e) => {
  if (running) {
    e.preventDefault()
  }
})

// 设置文件选择器事件
const fileInputRef = ref<HTMLInputElement | null>(null)
const folderInputRef = ref<HTMLInputElement | null>(null)
onMounted(() => {
  fileInputRef.value?.addEventListener("change", (event: any) => {
    addFileList(event.target.files)
  })
  folderInputRef.value?.addEventListener("change", (event: any) => {
    addFileList(event.target.files)
  })
})

// 添加文件事件
useBusEvent(BusEvent.ADD_ENTRIES, ({ file, folderId }) => {
  file.forEach((f: FileSystemFileEntry) => {
    if (f.isFile) {
      f.file((file: File) => {
        addFile(file, folderId)
      })
    } else if (f.isDirectory) {
      //
    }
  })
})
useBusEvent(BusEvent.ADD_FILELIST, ({ file, folderId }) => {
  addFileList(file, folderId)
})

// 添加文件列表
function addFileList(files: FileList, folderId?: string) {
  Array.from(files).forEach((file) => {
    addFile(file, folderId)
  })
}
function addFile(file: File, folderId?: string) {
  uploader.postMessage({
    command: "append",
    file: file,
    filename: file.name,
    folderId: folderId,
  })
}

// 组件事件
function onPauseButtonClick(taskId: number) {
  uploader.postMessage({
    command: "pause",
    id: taskId,
  })
}
function onRemoveButtonClick(taskId: number) {
  const info = displayMap.get(taskId)
  if (!info) return
  if (
    info.status === "mirrored" ||
    info.status === "merged" ||
    info.status === "canceled" ||
    info.status === "error"
  ) {
    displayMap.delete(taskId)
  } else {
    uploader.postMessage({
      command: "remove",
      id: taskId,
    })
  }
}
</script>

<template>
  <input v-show="false" ref="fileInputRef" MULTIPLE type="file" />
  <input
    v-show="false"
    ref="folderInputRef"
    mozdirectory
    odirectory
    type="file"
    webkitdirectory
  />
  <n-drawer
    v-model:show="isUploadDrawerShow"
    :placement="'right'"
    :width="502"
    :auto-focus="false"
  >
    <n-drawer-content
      id="content"
      :native-scrollbar="false"
      title=""
      :body-content-style="{
        paddingRight: 0,
        paddingLeft: 0,
        paddingTop: 0,
      }"
    >
      <template #header> 上传列表</template>
      <n-empty v-if="displayMap.size === 0" id="empty" />
      <div style="margin: 00px 0 0 0">
        <UploadItem
          v-for="(item, index) in displayMap"
          :key="index"
          :data="item[1]"
          @on-pause-button-click="() => onPauseButtonClick(item[0])"
          @on-remove-button-click="() => onRemoveButtonClick(item[0])"
        />
      </div>
      <template #footer>
        <n-flex>
          <n-button @click="fileInputRef?.click()">
            上传文件
            <template #icon>
              <n-icon :component="DocumentOutline" />
            </template>
          </n-button>
          <n-button @click="folderInputRef?.click()">
            上传文件夹
            <template #icon>
              <n-icon :component="FolderOutline" />
            </template>
          </n-button>
        </n-flex>
      </template>
    </n-drawer-content>
  </n-drawer>
</template>

<style scoped>
#content {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 0;
}

#empty {
  margin-top: 50%;
}
</style>
