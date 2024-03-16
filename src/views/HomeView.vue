<script setup lang="ts">
import { useUserInfo } from "@/stores/user-info"
import { storeToRefs } from "pinia"
import { onMounted, ref, onBeforeMount } from "vue"
import { getIndexAnnouncements } from "@/api/announcement"

const { nickname } = storeToRefs(useUserInfo())

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
  console.log(`currentHour: ${currentHour}, helloText: ${helloText.value}`)
}

onMounted(() => {
  updateHelloText()
  // 每一分钟执行一次更新问候语的操作
  setInterval(updateHelloText, 60000)
})

const announcements = ref<DisplayAnnouncement[]>([])

onBeforeMount(() => {
  getIndexAnnouncements().then((res) => {
    announcements.value = res.data as DisplayAnnouncement[]
    // 把 时间 字符串转换为 Date 对象
    // 格式：2023-08-25T09:05:13.497+00:00
    announcements.value.forEach((announcement) => {
      announcement.createTime = new Date(
        announcement.createTime,
      ).toLocaleString()
      announcement.updateTime = new Date(
        announcement.updateTime,
      ).toLocaleString()
    })
  })
})
</script>

<template>
  <div style="padding: 24px">
    <n-h4>
      {{ helloText }}，
      <n-h1>{{ nickname }}</n-h1>
    </n-h4>

    <n-list v-show="announcements.length > 0" bordered>
      <n-list-item
        v-for="announcement in announcements"
        :key="announcement.title"
      >
        <n-thing
          :title="announcement.title"
          :title-extra="announcement.userNickname"
          :description="announcement.updateTime"
        >
          <div v-html="announcement.content.replace('\n', '<br/>')" />
        </n-thing>
      </n-list-item>
    </n-list>
  </div>
</template>
