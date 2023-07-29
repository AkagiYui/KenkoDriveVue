<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useAppConfig } from '@/stores/app-config'
import { WeatherMoon16Regular, WeatherSunny16Regular } from '@vicons/fluent'

const { isDarkMode, isDebugMode } = storeToRefs(useAppConfig())
const { toggleDarkMode, reset: resetConfig } = useAppConfig()
const reset = () => {
  resetConfig()
  window.$message.success('已重置')
}
</script>

<template>
  <div style="padding: 24px">
    <n-space vertical>
      <n-card title="个人信息">
        <n-space vertical>
          <n-image
            :show-toolbar="false"
            width="100"
            src="https://q1.qlogo.cn/g?b=qq&nk=1050314133&s=640"
          />
          <n-button>更换头像</n-button>
        </n-space>
      </n-card>
      <n-card title="外观">
        <n-space vertical>
          <n-space style="display: flex">
            <n-button-group>
              <span style="align-self: center; margin-right: 10px">主题</span>
              <n-button @click="toggleDarkMode" :type="!isDarkMode ? 'primary' : 'default'">
                <template #icon>
                  <n-icon>
                    <WeatherSunny16Regular />
                  </n-icon>
                </template>
                亮色
              </n-button>
              <n-button @click="toggleDarkMode" :type="isDarkMode ? 'primary' : 'default'">
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
            <n-switch :round="false" v-model:value="isDebugMode" />
          </n-space>
        </n-space>
      </n-card>
      <n-card title="恢复">
        <n-space vertical>
          <n-popconfirm @positive-click="reset">
            <template #trigger>
              <n-button type="error">重置面板缓存</n-button>
            </template>
            是否要重置面板缓存？<br />该操作不会清除用户数据。
          </n-popconfirm>
        </n-space>
      </n-card>
    </n-space>
  </div>
</template>

<style scoped></style>
