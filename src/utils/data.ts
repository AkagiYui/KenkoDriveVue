/**
 * 将视频帧提取为Data URL
 * @param videoElement 视频元素
 */
export function extractFrameToDataURL(videoElement: HTMLVideoElement): string {
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
