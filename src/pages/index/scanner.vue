<route lang="json">
{
  "name": "scanner",
  "meta": {
    "title": "扫一扫"
  }
}
</route>

<script setup lang="ts">
import { BrowserQRCodeReader, NotFoundException } from "@zxing/library"
import { useRouter } from "vue-router"
import { useAssetUrl } from "@/utils"

const router = useRouter()
const selectedDeviceId = ref("")
const videoInputDevices = ref<InputDeviceInfo[]>([])
const errorMessage = ref("")
const qrCodeValue = ref("")
const codeReader = new BrowserQRCodeReader()
const isUnmounted = ref(false)

const videoRef = ref<HTMLVideoElement>()
const beepRef = ref<HTMLAudioElement>()
let stream: MediaStream | null = null

async function updateVideoInputDevices() {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices()
    videoInputDevices.value = devices.filter((device) => device.kind === "videoinput") as InputDeviceInfo[]
    if (!videoInputDevices.value.length) {
      errorMessage.value = "未检测到摄像头"
    }
    if (!selectedDeviceId.value && videoInputDevices.value.length) {
      // 如果有 facing back 的设备，优先选择
      const backDevice = videoInputDevices.value.find((device) => device.label.toLowerCase().includes("back"))
      if (backDevice) {
        selectedDeviceId.value = backDevice.deviceId
        return
      }
      // selectedDeviceId.value = backDevice?.deviceId || videoInputDevices.value[0].deviceId
      const nvidiaBroadcast = videoInputDevices.value.find((device) =>
        device.label.toLowerCase().includes("nvidia broadcast"),
      )
      if (nvidiaBroadcast) {
        selectedDeviceId.value = nvidiaBroadcast.deviceId
        return
      }
      selectedDeviceId.value = videoInputDevices.value[0].deviceId
    }
  } catch (error) {
    console.error("获取视频输入设备失败:", error)
    errorMessage.value = "获取视频设备列表失败，请确保已授予摄像头权限。"
  }
}

async function openCamera() {
  if (!selectedDeviceId.value) return

  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: { deviceId: { exact: selectedDeviceId.value } },
      audio: false,
    })

    if (videoRef.value) {
      videoRef.value.srcObject = stream
      videoRef.value.onloadedmetadata = () => {
        videoRef.value!.play()
        startScan(videoRef.value!, stream!)
      }
    }
    errorMessage.value = ""
  } catch (err) {
    console.error("打开摄像头失败:", err)
    errorMessage.value = "打开摄像头失败，请检查权限设置或尝试其他摄像头。"
  }
}

async function startScan(video: HTMLVideoElement, stream: MediaStream) {
  if (isUnmounted.value) {
    stream.getTracks().forEach((track) => track.stop())
    return
  }
  console.log("startScan")
  // 提取帧
  const image = extractFrameToDataURL(video)
  // 扫描
  try {
    const result = await codeReader.decodeFromImageUrl(image)
    qrCodeValue.value = result.getText()
    console.log("扫描结果:", result.getText())
  } catch (error) {
    if (error instanceof NotFoundException) {
      console.log("未找到二维码")
      setTimeout(() => startScan(video, stream), 500)
    } else {
      console.log("扫描失败:", error)
    }
  }
}

function extractFrameToDataURL(videoElement: HTMLVideoElement): string {
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")

  // 设置canvas尺寸与视频帧匹配
  canvas.width = videoElement.videoWidth
  canvas.height = videoElement.videoHeight

  // 将当前视频帧绘制到canvas上
  ctx?.drawImage(videoElement, 0, 0, canvas.width, canvas.height)

  // 将canvas内容转换为Data URL
  const url = canvas.toDataURL("image/png")
  canvas.remove()
  return url
}

onMounted(async () => {
  ;(await navigator.mediaDevices.getUserMedia({ video: true })).getTracks().forEach((track) => track.stop())
  await updateVideoInputDevices()
  navigator.mediaDevices.addEventListener("devicechange", updateVideoInputDevices) // 监听设备变化
})

onUnmounted(() => {
  isUnmounted.value = true
  navigator.mediaDevices.removeEventListener("devicechange", updateVideoInputDevices)
  console.debug("Scanner unmounted")
})

watch(selectedDeviceId, openCamera)
watch(qrCodeValue, (value) => {
  if (!value) return
  beepRef.value?.play()
  handleScanResult(value).then((shouldContinue) => {
    if (shouldContinue) {
      setTimeout(() => startScan(videoRef.value!, stream!), 1000)
    }
  })
})

async function handleScanResult(result: string): Promise<Boolean> {
  if (!result.startsWith("kd://")) {
    return true
  }
  if (result.startsWith("kd://login/")) {
    const token = result.slice("kd://login/".length)
    if (token) {
      console.log("二维码登录请求", token)
      window.$message.success(`扫描成功，${token}`)
      const to = router.resolve({ name: "qrlogin", query: { token } })
      router.replace(to)
      return false
    }
  }
  return true
}
</script>

<template>
  <n-flex vertical>
    <n-radio-group v-model:value="selectedDeviceId">
      <n-radio-button
        v-for="device in videoInputDevices"
        :key="device.deviceId"
        :label="device.label || `Camera ${device.deviceId.slice(0, 4)}`"
        :value="device.deviceId"
      />
    </n-radio-group>
    <span v-if="!videoInputDevices.length">未检测到摄像头</span>
    <span>选择：{{ selectedDeviceId }}</span>
    <video ref="videoRef" style="width: 100%; max-width: 400px" />
    <span v-if="errorMessage" style="color: red">{{ errorMessage }}</span>
    <span>扫描结果：{{ qrCodeValue }}</span>
    <audio ref="beepRef" :src="useAssetUrl('qrcode.mp3')" preload="auto" />
  </n-flex>
</template>
