<script lang="ts" setup>
import Request from "@/api/request"
import { emitBusEvent, useBusEvent, useEventListener } from "@/hooks"
import { useAppConfig } from "@/stores/app-config"
import { useUserInfo } from "@/stores/user-info"
import { BusEvent } from "@/types"
import { DocumentOutline, FolderOutline } from "@vicons/ionicons5"
import { storeToRefs } from "pinia"
import UploadItem from "./UploadItem.vue"

const { config: requestConfig } = Request
const { requestToken } = useUserInfo()
const { isUploadDrawerShow, uploadItemCount } = storeToRefs(useAppConfig())

// 上传列表
const uploadFileMap = reactive(new Map<string, UploadDisplayInfo>())
// 初始化上传器
const uploaderCount = 3 // 考虑下怎么动态调整并发数量
const uploaderStatus = reactive<boolean[]>(Array(uploaderCount).fill(true))
const uploaderPool = Array.from({ length: uploaderCount }, (_, i) => {
  const uploader = new Worker(new URL("./uploadWorker.ts", import.meta.url), {
    type: "module",
  })
  uploader.postMessage({
    command: "init",
    baseUrl: `${requestConfig.baseURL}/file`,
    token: requestToken,
  })
  uploader.onmessage = (e) => {
    const { event } = e.data
    console.log(JSON.stringify(e.data))
    if (event === "progress") {
      const { id, progress } = e.data
      const info = uploadFileMap.get(id)
      if (info) {
        info.progress = progress * 100
      }
    } else if (event === "mirrored") {
      const { id } = e.data
      const info = uploadFileMap.get(id)
      if (info) {
        info.status = "mirrored"
        info.progress = 100
        emitBusEvent(BusEvent.UPLOAD_SUCCESS, info.folderId)
      }
      uploaderStatus[i] = true
      uploadNext()
    } else if (event === "uploaded") {
      const { id } = e.data
      const info = uploadFileMap.get(id)
      if (info) {
        info.status = "uploaded"
        info.progress = 100
      }
    } else if (event === "merged") {
      const { id } = e.data
      const info = uploadFileMap.get(id)
      if (info) {
        info.status = "merged"
        info.progress = 100
        emitBusEvent(BusEvent.UPLOAD_SUCCESS, info.folderId)
      }
      uploaderStatus[i] = true
      uploadNext()
    } else if (event === "failed") {
      const { id } = e.data
      const info = uploadFileMap.get(id)
      if (info) {
        info.status = "error"
        info.progress = 0
      }
      uploaderStatus[i] = true
      uploadNext()
    }
  }
  return uploader
})

// 阻止关闭页面
let running = false
watch(uploadFileMap, () => {
  const notDoneCount = Array.from(uploadFileMap.values()).filter(
    (value) => value.status !== "mirrored" && value.status !== "merged" && value.status !== "canceled",
  ).length
  uploadItemCount.value = notDoneCount
  running = notDoneCount > 0
})
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
  addFileList(file, folderId || null)
})

// 添加文件列表
function addFileList(files: FileList, folderId?: string | null) {
  Array.from(files).forEach((file) => {
    addFile(file, folderId)
  })
}

// 非安全上下文环境下无法使用crypto.randomUUID
const uuid = crypto.randomUUID || (() => Math.random().toString(36).slice(2))
function addFile(file: File, folderId?: string | null) {
  const id = uuid()
  const info: UploadDisplayInfo = {
    id,
    file,
    status: "waiting",
    progress: 0,
    folderId,
    uploaderIndex: -1,
  }
  uploadFileMap.set(id, info)
  dispatchUpload(info)
}

function dispatchUpload(info: UploadDisplayInfo) {
  for (let i = 0; i < uploaderStatus.length; i++) {
    const status = uploaderStatus[i]
    if (status) {
      uploaderStatus[i] = false
      info.status = "uploading"
      uploaderPool[i].postMessage({
        command: "append",
        id: info.id,
        file: info.file,
        filename: info.file.name,
        folderId: info.folderId,
      })
      break
    }
  }
}

function uploadNext() {
  for (const info of uploadFileMap.values()) {
    if (info.status === "waiting") {
      dispatchUpload(info)
      break
    }
  }
}

// 组件事件
function onPauseButtonClick(taskId: string) {
  const info = uploadFileMap.get(taskId)
  if (!info) return
  const i = info.uploaderIndex!
  uploaderPool[i].postMessage({
    command: "pause",
    id: taskId,
  })
}
function onRemoveButtonClick(taskId: string) {
  const info = uploadFileMap.get(taskId)
  if (!info) return
  const i = info.uploaderIndex!
  if (info.status === "mirrored" || info.status === "merged" || info.status === "canceled" || info.status === "error") {
    uploadFileMap.delete(taskId)
  } else {
    uploaderPool[i].postMessage({
      command: "remove",
      id: taskId,
    })
  }
}
</script>

<template>
  <input v-show="false" ref="fileInputRef" MULTIPLE type="file" />
  <input v-show="false" ref="folderInputRef" mozdirectory odirectory type="file" webkitdirectory />
  <n-drawer v-model:show="isUploadDrawerShow" :placement="'right'" :width="502" :auto-focus="false">
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
      <n-empty v-if="uploadFileMap.size === 0" id="empty" />
      <div style="margin: 0 0 0 0">
        <UploadItem
          v-for="[id, item] in uploadFileMap"
          :key="id"
          :data="item"
          @on-pause-button-click="() => onPauseButtonClick(id)"
          @on-remove-button-click="() => onRemoveButtonClick(id)"
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
