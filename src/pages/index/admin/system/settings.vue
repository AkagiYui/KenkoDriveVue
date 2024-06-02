<route lang="json">
{
  "name": "system-settings",
  "meta": {
    "title": "系统设置"
  }
}
</route>

<script setup lang="ts">
import { getConfig, updateSetting } from "@/api"
import type { WatchStopHandle } from "vue"
import { useDebounce } from "@/hooks"

// 全局变量
const isLoading = ref(false)
let stopper: WatchStopHandle | undefined = undefined
onActivated(async () => {
  isLoading.value = true
  if (stopper) {
    stopper()
  }
  const res = await getConfig()
  oldSettings.value = { ...res }
  settings.value = { ...res }
  stopper = watch(
    settings,
    () => {
      updateSettingsDebounced()
    },
    { deep: true },
  )
  isLoading.value = false
})

type SettingsType = {
  [key: string]: string | number | boolean
}

const oldSettings = ref<SettingsType>({})
const settings = ref<SettingsType>({
  fileUploadChunkSize: 0,
  fileUploadMaxSize: 0,
  mailFrom: "",
  mailVerifyCodeTimeout: 0,
  registerEnabled: false,
  smtpHost: "",
  smtpPassword: "",
  smtpPort: 0,
  smtpSsl: false,
  smtpUsername: "",

  aliyunSmsAccessKeyId: "",
  aliyunSmsAccessKeySecret: "",
  aliyunSmsSignName: "",
  aliyunSmsTemplateCode: "",
})

const updateSettingsDebounced = useDebounce(() => {
  const updatePromises: Promise<any>[] = []

  for (const key in settings.value) {
    if (settings.value[key] !== oldSettings.value[key]) {
      updatePromises.push(updateSetting(key, settings.value[key]))
      oldSettings.value[key] = settings.value[key]
    }
  }

  if (updatePromises.length > 0) {
    isLoading.value = true
    Promise.all(updatePromises)
      .then(() => {
        window.$message.success("设置成功")
      })
      .catch(() => {
        window.$message.error("设置失败")
      })
      .finally(() => {
        isLoading.value = false
      })
  }
}, 1000)
</script>

<template>
  <div style="padding: 20px; width: 500px; margin: 0 auto">
    <n-flex vertical>
      <n-form label-placement="left" label-width="auto" require-mark-placement="right-hanging" :show-feedback="true">
        <n-h3>用户注册</n-h3>
        <n-form-item label="开放注册">
          <n-switch v-model:value="settings.registerEnabled" :disabled="isLoading" />
        </n-form-item>
        <n-form-item label="注册需要邮箱验证">
          <n-switch :disabled="true" :value="true" />
        </n-form-item>
        <n-divider />
        <n-h3>SMTP服务</n-h3>
        <n-form-item label="SMTP服务器">
          <n-input
            v-model:value="settings.smtpHost as string"
            :disabled="isLoading"
            :input-props="{ autocomplete: 'off' }"
          />
        </n-form-item>
        <n-form-item label="SMTP端口">
          <n-input-number
            v-model:value="settings.smtpPort as number"
            :allow-input="(value: string) => !value || /^\d+$/.test(value)"
            :disabled="isLoading"
            :input-props="{ autocomplete: 'off' }"
            :max="65535"
            :min="0"
            style="width: 100%"
          />
        </n-form-item>
        <n-form-item label="使用 SSL">
          <n-switch v-model:value="settings.smtpSsl" :disabled="isLoading" />
        </n-form-item>
        <n-form-item label="SMTP用户名">
          <n-input
            v-model:value="settings.smtpUsername as string"
            :disabled="isLoading"
            :input-props="{ autocomplete: 'email' }"
          />
        </n-form-item>
        <n-form-item label="SMTP密码">
          <n-input
            v-model:value="settings.smtpPassword as string"
            :disabled="isLoading"
            :input-props="{ autocomplete: 'new-password' }"
            show-password-on="click"
            type="password"
          />
        </n-form-item>
        <n-form-item label="发件人邮箱">
          <n-input
            v-model:value="settings.mailFrom as string"
            :disabled="isLoading"
            :input-props="{ autocomplete: 'email' }"
          />
        </n-form-item>

        <n-form-item v-if="false" label="SMTP加密方式">
          <n-select
            v-if="false"
            :disabled="true"
            :options="[
              {
                label: 'Everybody\'s Got Something to Hide Except Me and My Monkey',
                value: 'song0',
                disabled: true,
              },
              {
                label: 'Drive My Car',
                value: 'song1',
              },
            ]"
          />
        </n-form-item>
        <n-divider />
        <n-h3>阿里云短信服务</n-h3>
        <n-form-item label="AccessKeyId">
          <n-input
            v-model:value="settings.aliyunSmsAccessKeyId as string"
            :disabled="isLoading"
            :input-props="{ autocomplete: 'off' }"
            show-password-on="click"
            type="password"
          />
        </n-form-item>
        <n-form-item label="AccessKeySecret">
          <n-input
            v-model:value="settings.aliyunSmsAccessKeySecret as string"
            :disabled="isLoading"
            :input-props="{ autocomplete: 'off' }"
            show-password-on="click"
            type="password"
          />
        </n-form-item>
        <n-form-item label="短信签名">
          <n-input
            v-model:value="settings.aliyunSmsSignName as string"
            :disabled="isLoading"
            :input-props="{ autocomplete: 'off' }"
          />
        </n-form-item>
        <n-form-item label="短信模板">
          <n-input
            v-model:value="settings.aliyunSmsTemplateCode as string"
            :disabled="isLoading"
            :input-props="{ autocomplete: 'off' }"
          />
        </n-form-item>
      </n-form>
    </n-flex>
  </div>
</template>

<style scoped></style>
