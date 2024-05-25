<route lang="json">
{
  "name": "about",
  "meta": {
    "title": "关于"
  }
}
</route>

<script lang="ts" setup>
import { useAssetUrl } from "@/utils"
import QrCode from "@/components/QrCode.vue"
import { getBackendVersion } from "@/api/server"

const isDev = import.meta.env.DEV as boolean
const frontendVersion = ref<string>(__APP_VERSION__)

const owner = "AkagiYui"
const frontendRepoUrl = "https://github.com/AkagiYui/KenkoDriveVue"
const backendRepoUrl = "https://github.com/AkagiYui/KenkoDrive"

const backendVersion = ref<string>("")
const showRoadMap = ref(false)
const road: OneVersion[] = []

onBeforeMount(async () => {
  // 从assets/changelog.json中读取更新日志
  fetch(useAssetUrl("changelog.json"))
    .then((res) => res.json())
    .then((res) => {
      for (const version in res) {
        if (Object.prototype.hasOwnProperty.call(res, version)) {
          const versionStr = res[version].version
          const date = res[version].date
          const content = res[version].content
          road.push({ version: versionStr, date: date, content: content })
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
      frontendVersion.value = road[0].version
    })
  getBackendVersion().then((res) => {
    backendVersion.value = res.data
  })
})
</script>

<template>
  <n-drawer v-model:show="showRoadMap" :width="480">
    <n-drawer-content :native-scrollbar="false" title="更新日志">
      <n-timeline size="large">
        <n-timeline-item
          v-for="item in road"
          :key="item.version"
          :time="item.date"
          :title="item.version"
          type="success"
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
                style="cursor: pointer"
                type="info"
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
              :href="`${frontendRepoUrl}/issues`"
              tag="a"
              target="_blank"
            >
              问题反馈
            </n-button>
            <n-button
              :href="`${frontendRepoUrl}/releases`"
              tag="a"
              target="_blank"
            >
              发布日志
            </n-button>
          </n-space>
        </p>
      </div>
      <QrCode :size="180" :value="frontendRepoUrl" />
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
              :href="`${backendRepoUrl}/issues`"
              tag="a"
              target="_blank"
            >
              问题反馈
            </n-button>
            <n-button
              :href="`${backendRepoUrl}/releases`"
              tag="a"
              target="_blank"
            >
              发布日志
            </n-button>
          </n-space>
        </p>
      </div>
      <QrCode :size="180" :value="backendRepoUrl" />
    </n-space>
    <n-image v-if="isDev" :src="useAssetUrl('ji.jpg')" width="600" />
    <n-image
      v-if="!isDev"
      src="https://repobeats.axiom.co/api/embed/0ed4941f9e91671fd7d675d4ee71c21c1c497a85.svg"
      width="600"
    />
  </div>
</template>

<style scoped></style>
