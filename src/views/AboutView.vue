<script setup lang="ts">
import getAssetsUrl from '@/utils/pub-use'
import QrCode from '@/components/QrCode.vue'
const frontendVersion = APP_VERSION

const owner = 'AkagiYui'
const frontendRepoUrl = 'https://github.com/AkagiYui/KenkoDriveVue'
const backendRepoUrl = 'https://github.com/AkagiYui/KenkoDrive'
</script>

<template>
  <div style="padding: 24px">
    <n-h2>关于</n-h2>
    <n-space>
      <div style='width: 400px'>
        <n-h3 prefix="bar"
          >Kenko Drive Vue 前端
          <n-tag type="info">{{frontendVersion}}</n-tag>
        </n-h3>
        <p>
          Github:
          <n-a :href="frontendRepoUrl" target="_blank">
            {{ frontendRepoUrl }}
          </n-a>
        </p>
        <p>
          Copyright (C) 2023
          <n-a :href="`https://github.com/${owner}`" target="_blank">{{ owner }}</n-a>
        </p>
        <p>MIT License</p>
        <p>
          <n-space>
            <n-button tag="a" target="_blank" :href="`${frontendRepoUrl}/issues`">
              问题反馈
            </n-button>
            <n-button tag="a" target="_blank" :href="`${frontendRepoUrl}/releases`">
              发布日志
            </n-button>
          </n-space>
        </p>
      </div>
      <QrCode :value="frontendRepoUrl" :size="180" />
    </n-space>
    <n-space>
      <div style='width: 400px'>
        <n-h3 prefix="bar"
          >Kenko Drive SpringBoot 后端
          <n-tag type="info"> 版本号</n-tag>
        </n-h3>
        <p>
          Github:
          <n-a :href="backendRepoUrl" target="_blank">
            {{ backendRepoUrl }}
          </n-a>
        </p>
        <p>
          Copyright (C) 2023
          <n-a :href="`https://github.com/${owner}`" target="_blank">{{ owner }}</n-a>
        </p>
        <p>MIT License</p>
        <p>
          <n-space>
            <n-button tag="a" target="_blank" :href="`${backendRepoUrl}/issues`">
              问题反馈</n-button
            >
            <n-button tag="a" target="_blank" :href="`${backendRepoUrl}/releases`">
              发布日志
            </n-button>
          </n-space>
        </p>
      </div>
      <QrCode :value="backendRepoUrl" :size="180" />
    </n-space>
    <n-image :src="getAssetsUrl('ji.jpg')" width="600" />
  </div>
</template>

<style scoped></style>
