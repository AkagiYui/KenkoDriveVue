<route lang="json">
{
  "name": "scanner",
  "meta": {
    "title": "扫一扫"
  }
}
</route>

<script setup lang="ts">
import { scanImageData } from "@undecaf/zbar-wasm"

const router = useRouter()

const selectedDeviceId = ref("")
const videoInputDevices = ref<InputDeviceInfo[]>([])
const hasCamera = computed(() => {
  if (videoInputDevices.value.length === 1 && videoInputDevices.value[0].deviceId === "") {
    return false
  }
  return videoInputDevices.value.length > 0
})
watch(selectedDeviceId, openCamera) // 切换设备时重新打开摄像头

const errorMessage = ref("")
const qrCodeValue = ref("")
const isScanning = ref(false)
watch(qrCodeValue, (value) => {
  // 播放提示音
  value && playAudio()
})

const videoRef = ref<HTMLVideoElement>()

let stream: MediaStream | null = null
let animationFrameId: number | null = null
const usingOffscreenCanvas = isOffscreenCanvasWorking()

onMounted(async () => {
  await updateVideoInputDevices()
  navigator.mediaDevices.addEventListener("devicechange", updateVideoInputDevices)
})
onUnmounted(() => {
  stopScanningAndStream()
  navigator.mediaDevices.removeEventListener("devicechange", updateVideoInputDevices)
  console.debug("Scanner unmounted")
})

async function updateVideoInputDevices() {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices()
    videoInputDevices.value = devices.filter((device) => device.kind === "videoinput") as InputDeviceInfo[]
    if (!hasCamera.value) {
      errorMessage.value = "未检测到摄像头"
      return
    }

    // 如果没有选择设备（首次加载），自动选择设备
    if (!selectedDeviceId.value && hasCamera.value) {
      // 如果有 facing back 的设备，优先选择
      const backDevice = videoInputDevices.value.find((device) => device.label.toLowerCase().includes("back"))
      if (backDevice) {
        selectedDeviceId.value = backDevice.deviceId
        return
      }
      // 如果有 nvidia broadcast 设备，优先选择
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
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
  }
  if (stream) {
    stream.getTracks().forEach((track) => track.stop())
    stream = null
  }
  isScanning.value = false
}

function startScan() {
  if (!videoRef.value || !stream || isScanning.value) return

  isScanning.value = true
  scanFrame(Math.floor(performance.now()))
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

let canvas: HTMLCanvasElement | OffscreenCanvas
function getCanvasCtx(width: number, height: number) {
  if (!canvas || canvas.width !== width || canvas.height !== height) {
    canvas = usingOffscreenCanvas ? new OffscreenCanvas(width, height) : document.createElement("canvas")
  }
  return canvas.getContext("2d", { willReadFrequently: true }) as OffscreenCanvasRenderingContext2D
}

async function performScan() {
  if (!videoRef.value) return
  console.debug("扫描中...")

  const ctx = getCanvasCtx(videoRef.value.videoWidth, videoRef.value.videoHeight)
  ctx.drawImage(videoRef.value, 0, 0)

  const imageData = ctx.getImageData(0, 0, videoRef.value.videoWidth, videoRef.value.videoHeight)
  const results = (await scanImageData(imageData))
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

/**
 * 处理扫描结果
 * @param result 扫描结果
 * @returns 是否继续扫描
 */
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

async function requestPermission() {
  try {
    await navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      stream.getTracks().forEach((track) => track.stop())
    })
    updateVideoInputDevices()
  } catch (_) {
    errorMessage.value = "请求摄像头权限失败，请检查权限设置。"
  }
}

const audioContext = new (window.AudioContext || window.webkitAudioContext)()
let audioContent: AudioBuffer | null
onMounted(() => {
  // 预加载音频
  fetch(useAssetUrl("qrcode.webm"))
    .then((response) => response.arrayBuffer())
    .then((arrayBuffer) => audioContext.decodeAudioData(arrayBuffer))
    .then((audioBuffer) => {
      audioContent = audioBuffer
    })
    .catch((e) => console.error("Error with decoding audio data", e))
})

function playAudio() {
  if (audioContent) {
    const source = audioContext.createBufferSource()
    source.buffer = audioContent
    source.connect(audioContext.destination)
    source.start()
  }
}
</script>

<template>
  <h1>扫一扫</h1>
  <n-flex v-if="!hasCamera" vertical>
    <h2>未检测到摄像头，请检查摄像头是否连接设备或是否授权使用摄像头。</h2>
    <n-button type="primary" @click="requestPermission">申请权限</n-button>
  </n-flex>
  <n-flex v-else vertical>
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
  </n-flex>
</template>
