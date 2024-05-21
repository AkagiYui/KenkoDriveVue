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
          <n-button @click="onUploadFolderButtonClick"
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

<script lang="ts" setup>
import { useAppConfig } from "@/stores/app-config"
import { storeToRefs } from "pinia"
import UploadItem from "./UploadItem.vue"
import { DocumentOutline, FolderOutline } from "@vicons/ionicons5"
import { uploadFile } from "@/api/file"
import useGlobal from "@/utils/useGlobal"
import { EVENT_ADD_ENTRIES, EVENT_UPLOAD_SUCCESS } from "@/utils/string"

const { $bus } = useGlobal()

// 阻止关闭页面
function onBeforeUnload(event: BeforeUnloadEvent) {
  if (running.value) {
    event.preventDefault()
  }
}
onMounted(() => {
  window.addEventListener("beforeunload", onBeforeUnload)
})
onBeforeUnmount(() => {
  window.removeEventListener("beforeunload", onBeforeUnload)
})

const uploadWorker = new Worker(new URL("./uploadWorker.ts", import.meta.url), {
  type: "module",
})
uploadWorker.postMessage({
  command: "init",
  url: "http://localhost:3000",
  token: "123",
})

const { isUploadDrawerShow, uploadItemCount } = storeToRefs(useAppConfig())

const fileInputRef = ref<HTMLInputElement | null>(null)
const folderInputRef = ref<HTMLInputElement | null>(null)
onMounted(() => {
  fileInputRef.value?.addEventListener("change", onFileInputChange)
  $bus.on(EVENT_ADD_ENTRIES, ({ file, folderId }: AddEntriesEvent) => {
    file
      .filter((f) => f.isFile)
      .map((f) =>
        f.file((f) => {
          addFile(f, folderId)
        }),
      )
  })
})
onBeforeUnmount(() => {
  $bus.off(EVENT_ADD_ENTRIES)
  $bus.off(EVENT_UPLOAD_SUCCESS)
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

function addFileList(files: FileList) {
  console.log(files, files)
  Array.from(files).forEach((file) => {
    fileList.push({
      name: file.name,
      size: file.size,
      type: file.type,
      file: file,
      status: "waiting",
      progress: 0,
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

const running = ref(false)

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
    $bus.emit(EVENT_UPLOAD_SUCCESS, file.folderId)
    upload()
  })
}
</script>

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
