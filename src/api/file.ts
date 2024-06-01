import Request, { config } from "./request"
import type { AxiosProgressEvent } from "axios"

/**
 * 获取文件临时token
 * @param id 文件ID
 */
export function getFileTemporaryToken(id: string): RequestResponse<string> {
  return Request.get(`/file/${id}/token`)
}

/**
 * 获取文件临时URL
 * @param id 文件ID
 * @param single 是否单线程下载
 * @param name 文件名
 */
export function getFileTemporaryUrl(id: string, single: boolean = false, name?: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    getFileTemporaryToken(id)
      .then((response) => {
        let url = `${config.baseURL}/file/${response.data}/download`
        if (name) {
          url += `/${name}`
        }
        if (single) {
          url += "?single=true"
        }
        resolve(url)
      })
      .catch(reject)
  })
}

/**
 * 上传文件
 * @param file 文件
 * @param name 文件名
 * @param folder 文件夹
 * @param onUploadProgress 上传进度回调
 */
export function uploadFile(
  file: File,
  name?: string,
  folder?: string,
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void,
): { requestPromise: RequestResponse<any>; cancelTrigger: () => void } {
  const formData = new FormData()
  formData.append("file", file)
  formData.append("name", name || file.name)
  formData.append("folder", folder || "")

  const abortController = new AbortController()
  return {
    requestPromise: Request.post("/file", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: onUploadProgress || (() => {}),
      timeout: 0,
      signal: abortController.signal,
    }),
    cancelTrigger: () => {
      abortController.abort()
    },
  }
}

/**
 * 删除文件
 * @param id 文件ID
 */
export function deleteFile(id: string): RequestResponse<null> {
  return Request.delete(`/file/${id}`)
}

/**
 * 移动文件
 * @param id 文件ID
 * @param folderId 目标文件夹ID
 */
export function moveFile(id: string, folderId: string | undefined): RequestResponse<null> {
  return Request.put(
    `/file/${id}/move`,
    {},
    {
      params: folderId
        ? {
            folder: folderId,
          }
        : {},
    },
  )
}

/**
 * 重命名文件
 * @param id 用户文件ID
 * @param name 新文件名
 */
export function renameUserFile(id: string, name: string): RequestResponse<null> {
  return Request.put(
    `/file/${id}/name`,
    { name },
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
  )
}

/**
 * 获取文件列表
 * @param pageIndex 初始页码
 * @param pageSize 页大小
 */
export function useFileList(pageIndex: number = 0, pageSize: number = 10) {
  const index = ref(pageIndex)
  const size = ref(pageSize)
  const data = ref<FileInfoResponse[]>([])
  const count = ref(0)
  const isLoading = ref(false)

  function fetchData() {
    isLoading.value = true
    Request.get<Page<FileInfoResponse>>("/file", {
      params: {
        index: index.value,
        size: size.value,
      },
    })
      .then((response) => {
        data.value = response.data.list
        count.value = response.data.total
      })
      .finally(() => {
        isLoading.value = false
      })
  }

  fetchData()
  watch([index, size], fetchData)

  return { index, size, data, count, isLoading, fetchData }
}
