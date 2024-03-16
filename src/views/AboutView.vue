<script setup lang="ts">
import getAssetsUrl from "@/utils/pub-use"
import QrCode from "@/components/QrCode.vue"
import { onBeforeMount, ref } from "vue"
import { getBackendVersion } from "@/api/server"

const isDev = import.meta.env.DEV as boolean
const frontendVersion = __APP_VERSION__

const owner = "AkagiYui"
const frontendRepoUrl = "https://github.com/AkagiYui/KenkoDriveVue"
const backendRepoUrl = "https://github.com/AkagiYui/KenkoDrive"

const backendVersion = ref<string>("")

onBeforeMount(() => {
  getBackendVersion().then((res) => {
    backendVersion.value = res.data
  })
})

const showRoadMap = ref(false)

const road: OneVersion[] = []
// 从assets/changelog.json中读取更新日志
const changelogFileUrl = getAssetsUrl("changelog.json")
fetch(changelogFileUrl)
  .then((res) => res.json())
  .then((res) => {
    for (const version in res) {
      if (Object.prototype.hasOwnProperty.call(res, version)) {
        const versionStr = res[version].version
        const date = res[version].date
        const content = res[version].content
        road.push({ version: versionStr, date, content })
      }
    }
    road.sort((a, b) => {
      // 根据时间倒序
      const byTime = new Date(b.date).getTime() - new Date(a.date).getTime()
      if (byTime !== 0) {
        return byTime
      }
      // 根据版本号倒序
      return b.version.localeCompare(a.version)
    })
  })
</script>

<template>
  <n-drawer v-model:show="showRoadMap" :width="480">
    <n-drawer-content title="更新日志" :native-scrollbar="false">
      <n-timeline size="large">
        <n-timeline-item
          v-for="item in road"
          :key="item.version"
          type="success"
          :time="item.date"
          :title="item.version"
        >
          <div v-for="line in item.content.split('\n')" :key="line">
            {{ line }}
          </div>
        </n-timeline-item>
      </n-timeline>
    </n-drawer-content>
  </n-drawer>
  <div style="padding: 24px">
    <n-h2>关于</n-h2>
    <n-space>
      <div style="width: 400px">
        <n-h3 prefix="bar">
          Kenko Drive Vue 前端
          <n-popover trigger="hover">
            <template #trigger>
              <n-tag
                type="info"
                style="cursor: pointer"
                @click="showRoadMap = !showRoadMap"
              >
                {{ frontendVersion }}
              </n-tag>
            </template>
            <span>{{ road[0]?.content }}</span>
          </n-popover>
        </n-h3>
        <p>
          Github:
          <n-a :href="frontendRepoUrl" target="_blank">
            {{ frontendRepoUrl }}
          </n-a>
        </p>
        <p>
          Copyright (C) 2023
          <n-a :href="`https://github.com/${owner}`" target="_blank">
            {{ owner }}
          </n-a>
        </p>
        <p>MIT License</p>
        <p>
          <n-space>
            <n-button
              tag="a"
              target="_blank"
              :href="`${frontendRepoUrl}/issues`"
            >
              问题反馈
            </n-button>
            <n-button
              tag="a"
              target="_blank"
              :href="`${frontendRepoUrl}/releases`"
            >
              发布日志
            </n-button>
          </n-space>
        </p>
      </div>
      <QrCode :value="frontendRepoUrl" :size="180" />
    </n-space>
    <n-space>
      <div style="width: 400px">
        <n-h3 prefix="bar">
          Kenko Drive SpringBoot 后端
          <n-tag v-if="backendVersion !== ''" type="info">
            {{ backendVersion }}
          </n-tag>
        </n-h3>
        <p>
          Github:
          <n-a :href="backendRepoUrl" target="_blank">
            {{ backendRepoUrl }}
          </n-a>
        </p>
        <p>
          Copyright (C) 2023
          <n-a :href="`https://github.com/${owner}`" target="_blank">
            {{ owner }}
          </n-a>
        </p>
        <p>MIT License</p>
        <p>
          <n-space>
            <n-button
              tag="a"
              target="_blank"
              :href="`${backendRepoUrl}/issues`"
            >
              问题反馈
            </n-button>
            <n-button
              tag="a"
              target="_blank"
              :href="`${backendRepoUrl}/releases`"
            >
              发布日志
            </n-button>
          </n-space>
        </p>
      </div>
      <QrCode :value="backendRepoUrl" :size="180" />
    </n-space>
    <n-image v-if="isDev" :src="getAssetsUrl('ji.jpg')" width="600" />
  </div>
</template>

<style scoped></style>
