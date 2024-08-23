<route lang="json">
{
  "name": "settings",
  "meta": {
    "title": "设置"
  }
}
</route>

<script setup lang="ts">
import { storeToRefs } from "pinia"
import { WeatherMoon16Regular, WeatherSunny16Regular } from "@vicons/fluent"
import type { UploadFileInfo } from "naive-ui"
import { useAppConfig } from "@/stores/app-config"
import { useUserInfo } from "@/stores/user-info"
import { uploadUserAvatar } from "@/api"
import { Permission } from "@/types"
import { useDebounce } from "@/hooks"

const { isDarkMode, isDebugMode } = storeToRefs(useAppConfig())
const { toggleDarkMode, reset: resetConfig } = useAppConfig()
const { avatarUrl, nickname: nicknameInStore, email, phone } = storeToRefs(useUserInfo())
const { renewAvatar, hasPermission } = useUserInfo()

const reset = () => {
  resetConfig()
  window.$message.success("已重置")
}

const avatarFileList = ref<UploadFileInfo[]>([])
const uploadAvatar = async (fileList: UploadFileInfo[]) => {
  const fileInfo = fileList[0] ?? null
  const file = fileInfo?.file ?? null
  if (!file) {
    return
  }
  await uploadUserAvatar(file)
  window.$message.success("头像上传成功")
  renewAvatar()
  // 移除元素
  fileInfo.status = "finished"
  avatarFileList.value = []
}

const nickname = ref(nicknameInStore.value)
const updateNickname = useDebounce(() => {
  nicknameInStore.value = nickname.value
  window.$message.success("昵称已更新")
}, 500)
watch(nickname, updateNickname)
</script>

<template>
  <div style="padding: 24px; margin: 0 auto; width: 500px">
    <n-form label-placement="left" label-width="auto" require-mark-placement="right-hanging" :show-feedback="true">
      <n-h3>个人信息</n-h3>
      <n-form-item label="头像">
        <n-upload
          v-model:file-list="avatarFileList"
          accept="image/*"
          :max="1"
          :show-file-list="false"
          :show-cancel-button="false"
          :default-upload="false"
          @update:file-list="uploadAvatar"
        >
          <n-upload-dragger style="margin: 0; padding: 0; height: 100px; width: 100px">
            <n-image
              object-fit="fill"
              preview-disabled
              width="96"
              height="96"
              :src="avatarUrl"
              style="margin: 0; padding: 1px; height: 100px; width: 100px"
            />
          </n-upload-dragger>
        </n-upload>
      </n-form-item>
      <n-form-item label="昵称">
        <n-input v-model:value="nickname" :input-props="{ autocomplete: 'off' }" />
      </n-form-item>
      <n-form-item label="邮箱">
        <n-space>
          <n-input :value="email" :input-props="{ autocomplete: 'off' }" />
          <n-button type="warning" secondary> 更换邮箱 </n-button>
        </n-space>
      </n-form-item>
      <n-form-item label="手机号">
        <n-space>
          <n-input :value="phone" :input-props="{ autocomplete: 'off' }" />
          <n-button type="warning" secondary>更换手机号 </n-button>
        </n-space>
      </n-form-item>
      <n-form-item label="密码">
        <n-button type="warning" secondary>修改密码 </n-button>
      </n-form-item>

      <n-divider />
      <n-h3>外观</n-h3>
      <n-form-item label="主题">
        <n-button-group>
          <n-button :type="!isDarkMode ? 'primary' : 'default'" secondary @click="toggleDarkMode">
            <template #icon>
              <n-icon>
                <WeatherSunny16Regular />
              </n-icon>
            </template>
            亮色
          </n-button>
          <n-button :type="isDarkMode ? 'primary' : 'default'" secondary @click="toggleDarkMode">
            <template #icon>
              <n-icon>
                <WeatherMoon16Regular />
              </n-icon>
            </template>
            暗色
          </n-button>
        </n-button-group>
      </n-form-item>

      <n-divider />
      <n-h3>调试</n-h3>
      <n-form-item v-if="hasPermission(Permission.FRONTEND_ENABLE_DEBUG_MODE)" label="测试组件">
        <n-switch v-model:value="isDebugMode" :round="true" />
      </n-form-item>
      <n-form-item label="重置">
        <n-popconfirm
          :positive-button-props="{
            type: 'error',
          }"
          @positive-click="reset"
        >
          <template #trigger>
            <n-button type="error"> 重置面板缓存</n-button>
          </template>
          是否要重置面板缓存？<br />该操作不会清除用户数据。
        </n-popconfirm>
      </n-form-item>
    </n-form>
  </div>
</template>

<style scoped></style>
