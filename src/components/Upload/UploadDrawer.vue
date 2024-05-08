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
        @on-pause-button-click="console.log('on-pause-button-click')"
        @on-remove-button-click="console.log('on-remove-button-click')"
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

const { isUploadDrawerShow, uploadItemCount } = storeToRefs(useAppConfig())

const fileInputRef = ref<HTMLInputElement | null>(null)
const folderInputRef = ref<HTMLInputElement | null>(null)
onMounted(() => {
  fileInputRef.value?.addEventListener("change", onFileInputChange)
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
  addFile(list)
}

const fileList = ref<UploadFileInfo[]>([])

function addFile(files: File[]) {
  files.forEach((file) => {
    fileList.value.push({
      name: file.name,
      size: file.size,
      type: file.type,
      file: file,
      status: "waiting",
    })
  })
  uploadItemCount.value = fileList.value.length
  upload()
}

const running = ref(false)

function upload() {
  if (running.value) {
    return
  }
  running.value = true
  const file = fileList.value[0]
  const size = file.size
  // 小于 256KB
  if (size < 256 * 1024) {
    // 上传
    console.log("upload", file)
    uploadItemCount.value = fileList.value.length
    running.value = false
    return
  }
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
