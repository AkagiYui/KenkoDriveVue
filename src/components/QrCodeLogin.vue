<script setup lang="ts">
import { getQrStatus, getQrToken } from "@/api"
import { useUserInfo } from "@/stores/user-info"
import { useRouter } from "vue-router/auto"

const router = useRouter()
const { setToken } = useUserInfo()
const temporaryToken = ref<string>("")
const qrCodeValue = computed(() => `kd://login/${temporaryToken.value}`)
const isQrCodeValid = ref(true)
const isTaken = ref(false)
const isCanceled = ref(false)
const nickname = ref("")
let timer: ReturnType<typeof setInterval>

onMounted(refreshQrCode)
onBeforeUnmount(() => {
  timer && clearInterval(timer)
})

async function refreshQrCode() {
  temporaryToken.value = await getQrToken()
  isQrCodeValid.value = true
  isTaken.value = false
  isCanceled.value = false
  timer && clearInterval(timer)
  timer = setInterval(refreshQrCodeStatus, 2000)
}

async function refreshQrCodeStatus() {
  try {
    const result = await getQrStatus(temporaryToken.value)
    isTaken.value = result.taken
    nickname.value = result.nickname as string
    isQrCodeValid.value = true
    isCanceled.value = result.canceled
    if (isCanceled.value) {
      timer && clearInterval(timer)
    }
    if (result.confirmed) {
      timer && clearInterval(timer)
      setToken(result.token!.token)
      router.push("/")
    }
  } catch (error) {
    isQrCodeValid.value = false
    isTaken.value = false
    timer && clearInterval(timer)
  }
}
</script>

<template>
  <n-flex vertical align="center" class="qr-code-container">
    <div>使用Kenko Drive客户端扫描二维码</div>
    <div class="qr-code-wrapper">
      <n-qr-code
        :value="qrCodeValue"
        :size="150"
        background-color="#ffffff"
        color="#000000"
        error-correction-level="H"
        type="canvas"
      />
      <div v-if="!isQrCodeValid || isTaken || isCanceled" class="overlay">
        <template v-if="!isQrCodeValid">
          <p>二维码已失效</p>
          <n-button type="primary" @click="refreshQrCode">刷新</n-button>
        </template>
        <template v-if="isTaken && !isCanceled">
          <p>请确认登录</p>
          <p>{{ nickname }}</p>
        </template>
        <template v-if="isCanceled">
          <p>操作已被取消</p>
          <n-button type="primary" @click="refreshQrCode">刷新</n-button>
        </template>
      </div>
    </div>
  </n-flex>
</template>

<style scoped>
.qr-code-container {
  position: relative;
}

.qr-code-wrapper {
  position: relative;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(2px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
}

.overlay p {
  margin: 5px 0;
}
</style>
