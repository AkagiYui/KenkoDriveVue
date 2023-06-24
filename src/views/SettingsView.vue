<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useAppConfig } from '@/stores/app-config'
import { WeatherMoon16Regular, WeatherSunny16Regular } from '@vicons/fluent'

const { isDarkMode } = storeToRefs(useAppConfig())
</script>

<template>
  <div style="padding: 24px">
    <NSpace vertical>
      <NCard title="个人信息">
        <NSpace vertical>
          <NImage
            :show-toolbar="false"
            width="100"
            src="https://q1.qlogo.cn/g?b=qq&nk=1050314133&s=640"
          />
          <NButton>更换头像</NButton>
        </NSpace>
      </NCard>
      <NCard title="系统设置">
        <NSpace style="display: flex">
          <NButtonGroup>
            <span style="align-self: center; margin-right: 10px">主题</span>
            <NButton @click="isDarkMode = false" :type="!isDarkMode ? 'primary' : 'default'">
              <template #icon>
                <NIcon>
                  <WeatherSunny16Regular />
                </NIcon>
              </template>
              亮色
            </NButton>
            <NButton @click="isDarkMode = true" :type="isDarkMode ? 'primary' : 'default'">
              <template #icon>
                <NIcon>
                  <WeatherMoon16Regular />
                </NIcon>
              </template>
              暗色
            </NButton>
          </NButtonGroup>
        </NSpace>
      </NCard>
    </NSpace>
  </div>
</template>

<style scoped></style>
