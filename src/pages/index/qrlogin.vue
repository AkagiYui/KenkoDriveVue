<route lang="json">
{
  "name": "qrlogin",
  "meta": {
    "title": "扫码登录"
  }
}
</route>

<script setup lang="ts">
const router = useRouter()

// 提取参数
const params = new URLSearchParams(window.location.search)
const token = params.get("token") as string
if (!token) {
  router.back()
}

const isTokenValid = ref(false)
const takenToken = ref("")
const nickname = ref("")
const ipRegion = ref("")

onMounted(async () => {
  const data = await claimQrToken(token)
  console.log(data)
  isTokenValid.value = true
  takenToken.value = data.takenToken
  nickname.value = data.nickname
  ipRegion.value = data.ipRegion
})

const onConfirmButtonClick = async () => {
  await confirmQrLogin(token, takenToken.value)
  router.back()
  window.$message.success("登录成功")
}
const onCancelButtonClick = async () => {
  await cancelQrLogin(token, takenToken.value)
  router.back()
  window.$message.info("已取消登录")
}
</script>

<template>
  <n-flex vertical align="center">
    <h1>确认登录</h1>
    <span>{{ nickname }}</span>
    <span>登录地点：{{ ipRegion }}</span>
    <n-flex>
      <n-button secondary type="primary" @click="onConfirmButtonClick">确认登录</n-button>
      <n-button secondary @click="onCancelButtonClick">取消登录</n-button>
    </n-flex>
  </n-flex>
</template>
