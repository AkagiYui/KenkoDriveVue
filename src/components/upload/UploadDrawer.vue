<script lang="ts" setup>
import { storeToRefs } from "pinia"
import { DocumentOutline, FolderOutline } from "@vicons/ionicons5"
import { useAppConfig } from "@/stores/app-config"
import { uploadFile } from "@/api/file"
import { emitBusEvent, useBusEvent, useEventListener } from "@/hooks"
import UploadItem from "./UploadItem.vue"
import { BusEvent } from "@/types"

const running = ref(false)
// 阻止关闭页面
useEventListener(window, "beforeunload", (e) => {
  if (running.value) {
    e.preventDefault()
  }
})

const { isUploadDrawerShow, uploadItemCount } = storeToRefs(useAppConfig())

const fileInputRef = ref<HTMLInputElement | null>(null)
const folderInputRef = ref<HTMLInputElement | null>(null)
onMounted(() => {
  fileInputRef.value?.addEventListener("change", onFileInputChange)
})

useBusEvent(BusEvent.ADD_ENTRIES, ({ file, folderId }) => {
  file
    .filter((f) => f.isFile)
    .map((f) =>
      f.file((f) => {
        addFile(f, folderId)
      }),
    )
})
useBusEvent(BusEvent.ADD_FILELIST, ({ file, folderId }) => {
  addFileList(file, folderId)
})

function onUploadFileButtonClick() {
  fileInputRef.value?.click()
}

function onUploadFolderButtonClick() {
  folderInputRef.value?.click()
}

function onFileInputChange(event: any) {
  const list = event.target.files
  if (list.length === 0) {
    return
  }
  addFileList(list)
}

const fileList = reactive<UploadFileInfo[]>([])
watch(fileList, () => {
  uploadItemCount.value = fileList.length
})

function addFileList(files: FileList, folderId?: string) {
  Array.from(files).forEach((file) => {
    fileList.push({
      name: file.name,
      size: file.size,
      type: file.type,
      file: file,
      status: "waiting",
      progress: 0,
      folderId,
    })
  })
  upload()
}

function addFile(file: File, folderId?: string) {
  fileList.push({
    name: file.name,
    size: file.size,
    type: file.type,
    file: file,
    status: "waiting",
    progress: 0,
    folderId,
  })
  upload()
}

function upload() {
  if (running.value) {
    return
  }
  running.value = true
  if (fileList.length === 0) {
    running.value = false
    return
  }
  const file = fileList[0]
  const size = file.size
  // 上传
  console.log("upload", file)
  const { requestPromise: request, cancelTrigger: cancel } = uploadFile(
    file.file,
    file.name,
    file.folderId,
    (progress) => {
      console.log("progress", progress)
      file.status = "uploading"
      file.progress = progress.progress! * 100
    },
  )
  request.then(() => {
    fileList.shift()
    running.value = false
    emitBusEvent(BusEvent.UPLOAD_SUCCESS, file.folderId)
    upload()
  })
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
  <n-drawer v-model:show="isUploadDrawerShow" :placement="'right'" :width="502">
    <n-drawer-content id="content" :native-scrollbar="false" title="">
      <template #header> 上传列表</template>
      <n-empty v-if="fileList.length === 0" id="empty" />
      <UploadItem
        v-for="(item, index) in fileList"
        :key="index"
        :file="item"
        @on-pause-button-click="console.log('on-pause-button-click', item)"
        @on-remove-button-click="console.log('on-remove-button-click', item)"
      />
      <template #footer>
        <n-flex>
          <n-button @click="onUploadFileButtonClick"
            >上传文件
            <template #icon>
              <n-icon :component="DocumentOutline" />
            </template>
          </n-button>
          <n-button v-if="false" @click="onUploadFolderButtonClick"
            >上传文件夹
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
