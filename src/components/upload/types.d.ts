interface UploadDisplayInfo {
  id: number
  name: string
  size: number
  type: string
  status:
    | "uploading" // 上传中
    | "paused" // 已暂停
    | "mirrored" // 已秒传
    | "uploaded" // 已上传
    | "merged" // 文件在服务端已合并
    | "error" // 发生错误
    | "canceled" // 被取消
    | "waiting" // 等待上传
  progress: number
  folderId?: string
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
  folderId: string | null
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
