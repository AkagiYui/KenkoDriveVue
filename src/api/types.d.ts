type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD" | "OPTIONS"

// 传输进度, 单位 byte
interface ProgressInfo {
  loaded: number // 已加载字节
  total: number // 总大小
}

interface RequestConfig {
  showLoading?: boolean
  auth?: boolean

  url?: string
  method?: HttpMethod

  params?: Record<string, any>
  headers?: Record<string, string>
  data?: Record<string, any> | string
  dataType?: "json" | "form" | "text" | "url"

  // 请求配置
  timeout?: number
  withCredentials?: boolean
  responseType?: "blob" | "document" | "json" | "text"

  // 回调
  onUploadProgress?: (progress: ProgressInfo) => void
  onDownloadProgress?: (progress: ProgressInfo) => void
}

interface KResponse<T> {
  data: T
  status: number
  statusText: string
  headers: Record<string, string>
}
