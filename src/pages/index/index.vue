<route lang="json">
{
  "name": "home",
  "meta": {
    "title": "概览"
  }
}
</route>

<script setup lang="ts">
import { storeToRefs } from "pinia"
import { MdSave } from "@vicons/ionicons4"
import { getIndexAnnouncements } from "@/api/announcement"
import { useUserInfo } from "@/stores/user-info"
import { useAppConfig } from "@/stores/app-config"
import { useInterval } from "@/hooks"

const { nickname } = storeToRefs(useUserInfo())
const { isDebugMode } = storeToRefs(useAppConfig())

// 每个问候语对应的时间点
const helloLabel = {
  早上好: [6, 7, 8, 9, 10],
  中午了: [11.5, 12, 13],
  下午好: [14, 15, 16, 17],
  傍晚了: [18, 18.5],
  晚上好: [19, 20, 21, 22],
  夜深了: [23, 0, 1, 2, 3, 4, 5],
}

// 当前问候语
const helloText = ref<string>("您好")

// 找到最接近的时间点
const updateHelloText = () => {
  const date = new Date()
  const currentHour = date.getHours() + date.getMinutes() / 60

  let closestTimeDiff = Infinity
  let closestHelloText = ""

  for (const [label, hours] of Object.entries(helloLabel)) {
    for (const hour of hours) {
      const timeDiff = Math.abs(hour - currentHour)
      if (timeDiff < closestTimeDiff) {
        closestTimeDiff = timeDiff
        closestHelloText = label
      }
    }
  }
  helloText.value = closestHelloText
}

// 每一分钟执行一次更新问候语
useInterval(updateHelloText, 60000)

const announcements = ref<DisplayAnnouncement[]>([])
const lastFetchTime = ref(0)

function fetchAnnouncements() {
  getIndexAnnouncements().then((res) => {
    announcements.value = res.data as DisplayAnnouncement[]
    // 把 时间 字符串转换为 Date 对象
    // 格式：2023-08-25T09:05:13.497+00:00
    announcements.value.forEach((announcement) => {
      announcement.createTime = new Date(announcement.createTime).toLocaleString()
      announcement.updateTime = new Date(announcement.updateTime).toLocaleString()
    })
    lastFetchTime.value = Date.now()
  })
}

onBeforeMount(() => {
  fetchAnnouncements()
})

onActivated(() => {
  // 如果距离上次获取公告超过一分钟，就重新获取
  if (Date.now() - lastFetchTime.value > 60000) {
    fetchAnnouncements()
  }
})
</script>

<template>
  <div style="padding: 24px">
    <n-h4>
      {{ helloText }}，
      <n-h1>{{ nickname }}</n-h1>
    </n-h4>
    <n-h2>欢迎使用 Kenko Drive</n-h2>

    <n-flex v-if="isDebugMode" size="large">
      <n-statistic label="存储空间" :value="'99G'">
        <template #prefix>
          <n-icon>
            <md-save />
          </n-icon>
        </template>
        <template #suffix>/100G </template>
      </n-statistic>
      <n-statistic label="分享点击"> 1,234,123 </n-statistic>
    </n-flex>

    <n-list v-show="announcements.length > 0" bordered>
      <n-list-item v-for="announcement in announcements" :key="announcement.title">
        <n-thing
          :title="announcement.title"
          :title-extra="announcement.userNickname"
          :description="announcement.updateTime"
        >
          <div v-for="line in announcement.content.split('\n')" :key="line">{{ line }}<br /></div>
        </n-thing>
      </n-list-item>
    </n-list>
  </div>
</template>

<style scoped>
.n-list {
  margin-top: 12px;
}
</style>
