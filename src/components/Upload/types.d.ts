type UploadFileInfo = {
  name: string
  size: number
  type: string
  file: File
  status: "uploading" | "paused" | "done" | "error" | "canceled" | "waiting"
  progress: number
}
