interface UploadDisplayInfo {
  id: number
  name: string
  size: number
  type: string
  status:
    | "uploading"
    | "paused"
    | "mirrored"
    | "uploaded"
    | "error"
    | "canceled"
    | "waiting"
  progress: number
  folderId?: string
}

interface ChunkInfo {
  blobStartIndex: number
  blobEndIndex: number
  chunkIndex: number
  hash: string
  blob: Blob
}

interface FileInfo {
  hash: string
  chunks: ChunkInfo[]
}

// interfaces in Worker
/** 上传器配置 */
interface UploaderWorkerConfig {
  /** 秒传地址 */
  mirrorUrl: string
  /** 创建任务地址 */
  createTaskUrl: string
  /** 上传地址 */
  sendChunkUrl: string
  /** 身份验证令牌 */
  accessToken?: string
  /** 线程数 */
  threadCount?: number
  /** 上传并行数 */
  parallelCount?: number
}

/** 添加文件请求 */
interface AppendFileRequest {
  /** 文件 */
  file: File
  /** 文件名 */
  filename: string
  /** 目标文件夹ID */
  folderId: string | undefined
}

/** 上传任务 */
interface UploadTask extends AppendFileRequest {
  /** 任务ID */
  id: number
}

/** 线程池任务 */
interface ThreadPoolTask {
  task: () => Promise<unknown>
  resolve: (value: unknown) => void
  reject: (reason?: any) => void
}
