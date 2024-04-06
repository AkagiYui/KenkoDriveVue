<script setup lang="ts">
import { getConfig, setRegisterEnabled } from "@/api/server"

// 全局变量
const isLoading = ref(false)
onBeforeMount(() => {
  isLoading.value = true
  getConfig()
    .then((res) => {
      const data = res.data
      allowRegister.value = data.registerEnabled
    })
    .finally(() => {
      isLoading.value = false
    })
})

// 开放注册
const allowRegister = ref(false)
const allowRegisterLoading = ref(false)
function onAllowRegisterChange(value: boolean) {
  if (allowRegisterLoading.value) return
  allowRegisterLoading.value = true
  setRegisterEnabled(value)
    .then(() => {
      allowRegister.value = value
    })
    .finally(() => {
      allowRegisterLoading.value = false
    })
}
</script>

<template>
  <div style="padding: 20px; width: 500px; margin: 0 auto">
    <n-flex vertical>
      <n-form
        label-placement="left"
        label-width="auto"
        require-mark-placement="right-hanging"
        :show-feedback="true"
      >
        <n-h3>用户注册</n-h3>
        <n-form-item label="开放注册">
          <n-switch
            v-model:value="allowRegister"
            :loading="allowRegisterLoading"
            :disabled="isLoading"
            @update:value="onAllowRegisterChange"
          />
        </n-form-item>
        <n-form-item label="注册需要邮箱验证">
          <n-switch :disabled="true" />
        </n-form-item>
        <n-divider />
        <n-h3>SMTP设置</n-h3>
        <n-form-item label="SMTP服务器">
          <n-input :disabled="true" />
        </n-form-item>
        <n-form-item label="SMTP端口">
          <n-input :disabled="true" />
        </n-form-item>
        <n-form-item label="SMTP用户名">
          <n-input :disabled="true" />
        </n-form-item>
        <n-form-item label="SMTP密码">
          <n-input :disabled="true" />
        </n-form-item>
        <n-form-item label="SMTP加密方式">
          <n-select
            :disabled="true"
            :options="[
              {
                label:
                  'Everybody\'s Got Something to Hide Except Me and My Monkey',
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
      </n-form>
    </n-flex>
  </div>
</template>

<style scoped></style>
