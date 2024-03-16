<script setup lang="ts">
import { ref, onBeforeMount } from "vue"
import { storeToRefs } from "pinia"
import { useAppConfig } from "@/stores/app-config"
import { useUserInfo } from "@/stores/user-info"
import { WeatherMoon16Regular, WeatherSunny16Regular } from "@vicons/fluent"
import { type UploadFileInfo } from "naive-ui"
import { uploadUserAvatar } from "@/api/user"

const { isDarkMode, isDebugMode } = storeToRefs(useAppConfig())
const { toggleDarkMode, reset: resetConfig } = useAppConfig()
const { avatarUrl, username, nickname, email } = storeToRefs(useUserInfo())
const { renewAvatar } = useUserInfo()
const personalInfo = ref({
  nickname: "",
  email: "",
})
const rules = {
  nickname: {
    required: false,
    message: "请输入昵称",
    min: 3,
    trigger: ["input", "blur"],
    type: "email",
  },
}

onBeforeMount(() => {
  personalInfo.value.nickname = nickname.value
  personalInfo.value.email = email.value
})

const reset = () => {
  resetConfig()
  window.$message.success("已重置")
}

const avatarFileList = ref<UploadFileInfo[]>([])
const uploadAvatar = (fileList: UploadFileInfo[]) => {
  console.log("fileList: ", fileList)
  const fileInfo = fileList[0] ?? null
  const file = fileInfo?.file ?? null
  if (!file) {
    return
  }
  uploadUserAvatar(file)
    .then((res) => {
      window.$message.success("头像上传成功")
      renewAvatar()
    })
    .catch((err) => {
      window.$message.error("头像上传失败")
      console.log("err: ", err)
    })
    .finally(() => {
      // 移除元素
      fileInfo.status = "finished"
      avatarFileList.value = []
    })
}
</script>

<template>
  <div style="padding: 24px">
    <n-space vertical>
      <n-card title="个人信息">
        <n-space>
          <n-upload
            v-model:file-list="avatarFileList"
            accept="image/*"
            :max="1"
            :show-file-list="false"
            :show-cancel-button="false"
            :default-upload="false"
            @update:file-list="uploadAvatar"
          >
            <n-space vertical>
              <n-upload-dragger
                style="margin: 0; padding: 0; height: 100px; width: 100px"
              >
                <n-image
                  object-fit="fill"
                  preview-disabled
                  width="96"
                  height="96"
                  :src="avatarUrl"
                  style="margin: 0; padding: 1px; height: 100px; width: 100px"
                />
              </n-upload-dragger>
              <n-space justify="center">
                <n-button dashed size="small"> 上传头像 </n-button>
              </n-space>
            </n-space>
          </n-upload>

          <n-space>
            <n-space vertical>
              <n-input-group>
                <n-input-group-label class="info-label">
                  用户名
                </n-input-group-label>
                <n-input :value="username" disabled />
              </n-input-group>
              <n-input-group>
                <n-input-group-label class="info-label">
                  昵称
                </n-input-group-label>
                <n-input v-model:value="personalInfo.nickname" />
              </n-input-group>
              <n-input-group>
                <n-input-group-label class="info-label">
                  邮箱
                </n-input-group-label>
                <n-input v-model:value="personalInfo.email" />
              </n-input-group>
            </n-space>
            <n-button style="height: 100%"> 保存 </n-button>
          </n-space>
        </n-space>
      </n-card>

      <n-card title="外观">
        <n-space vertical>
          <n-space style="display: flex">
            <n-button-group>
              <span style="align-self: center; margin-right: 10px">主题</span>
              <n-button
                :type="!isDarkMode ? 'primary' : 'default'"
                @click="toggleDarkMode"
              >
                <template #icon>
                  <n-icon>
                    <WeatherSunny16Regular />
                  </n-icon>
                </template>
                亮色
              </n-button>
              <n-button
                :type="isDarkMode ? 'primary' : 'default'"
                @click="toggleDarkMode"
              >
                <template #icon>
                  <n-icon>
                    <WeatherMoon16Regular />
                  </n-icon>
                </template>
                暗色
              </n-button>
            </n-button-group>
          </n-space>
          <n-space style="display: flex; align-items: center">
            <n-text>调试模式</n-text>
            <n-switch v-model:value="isDebugMode" :round="false" />
          </n-space>
        </n-space>
      </n-card>
      <n-card title="恢复">
        <n-space vertical>
          <n-popconfirm @positive-click="reset">
            <template #trigger>
              <n-button type="error"> 重置面板缓存 </n-button>
            </template>
            是否要重置面板缓存？<br />该操作不会清除用户数据。
          </n-popconfirm>
        </n-space>
      </n-card>
    </n-space>
  </div>
</template>

<style scoped>
.info-label {
  width: 70px;
  text-align: center;
}
</style>
