<route lang="json">
{
  "name": "scanner",
  "meta": {
    "title": "扫一扫"
  }
}
</route>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from "vue"
import { createCanvas } from "canvas"
import { scanImageData } from "@undecaf/zbar-wasm"
import { useRouter } from "vue-router"
import { isOffscreenCanvasWorking, useAssetUrl } from "@/utils"

const router = useRouter()
const selectedDeviceId = ref("")
const videoInputDevices = ref<InputDeviceInfo[]>([])
const errorMessage = ref("")
const qrCodeValue = ref("")
const isScanning = ref(false)

const videoRef = ref<HTMLVideoElement>()
const beepRef = ref<HTMLAudioElement>()

let stream: MediaStream | null = null
let animationFrameId: number | null = null
const usingOffscreenCanvas = isOffscreenCanvasWorking()

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
    // 停止之前的扫描和流
    stopScanningAndStream()

    stream = await navigator.mediaDevices.getUserMedia({
      video: { deviceId: { exact: selectedDeviceId.value } },
      audio: false,
    })

    if (videoRef.value) {
      videoRef.value.srcObject = stream
      videoRef.value.onloadedmetadata = () => {
        videoRef.value!.play()
        startScan()
      }
    }
    errorMessage.value = ""
  } catch (err) {
    console.error("打开摄像头失败:", err)
    errorMessage.value = "打开摄像头失败，请检查权限设置或尝试其他摄像头。"
  }
}

function stopScanningAndStream() {
  isScanning.value = false
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
  }
  if (stream) {
    stream.getTracks().forEach((track) => track.stop())
    stream = null
  }
}

function startScan() {
  if (!videoRef.value || !stream || isScanning.value) return

  isScanning.value = true
  scanFrame(0)
}

let lastScanTime = 0
const SCAN_INTERVAL = 1000 // 1秒的扫描间隔

async function scanFrame(timestamp: number) {
  if (!isScanning.value) return

  if (timestamp - lastScanTime >= SCAN_INTERVAL) {
    lastScanTime = timestamp
    await performScan()
  }

  animationFrameId = requestAnimationFrame(scanFrame)
}

let offCanvas

async function performScan() {
  if (!videoRef.value) return
  console.debug("扫描中...")

  const canvas = createCanvas()
  canvas.width = videoRef.value.videoWidth
  canvas.height = videoRef.value.videoHeight
  const ctx = canvas.getContext("2d")

  function getOffCtx2d(width, height) {
    if (usingOffscreenCanvas) {
      if (!offCanvas || offCanvas.width !== width || offCanvas.height !== height) {
        offCanvas = new OffscreenCanvas(width, height)
        offCanvas.willReadFrequently = true
      }
      return offCanvas.getContext("2d")
    }
  }
  const offCtx = getOffCtx2d(canvas.width, canvas.height) || ctx

  offCtx.drawImage(videoRef.value, 0, 0)

  const imageData = offCtx.getImageData(0, 0, canvas.width, canvas.height)
  const symbols = await scanImageData(imageData)
  const results = symbols
    .filter((symbol) => symbol.typeName.toLowerCase().includes("qrcode"))
    .map((symbol) => symbol.decode())

  if (results.length) {
    qrCodeValue.value = results.join(" | ")
    for (const symbol of results) {
      console.debug("扫描结果:", symbol)
      const shouldContinue = await handleScanResult(symbol)
      if (!shouldContinue) {
        stopScanningAndStream()
        break
      }
    }
  }
}

onMounted(async () => {
  const initialStream = await navigator.mediaDevices.getUserMedia({ video: true })
  initialStream.getTracks().forEach((track) => track.stop())

  await updateVideoInputDevices()
  navigator.mediaDevices.addEventListener("devicechange", updateVideoInputDevices)
})

onUnmounted(() => {
  stopScanningAndStream()
  navigator.mediaDevices.removeEventListener("devicechange", updateVideoInputDevices)
  console.debug("Scanner unmounted")
})

watch(selectedDeviceId, openCamera)
watch(qrCodeValue, (value) => {
  if (value) {
    beepRef.value?.play()
  }
})

async function handleScanResult(result: string): Promise<boolean> {
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
