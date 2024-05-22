import Request, { config } from "./request"
import type { AxiosProgressEvent } from "axios"

/** 获取目录内容 */
export function getFolderContent(
  id: string | null = null,
): RequestResponse<FolderContent> {
  return Request.get("/file", { params: { folder: id } })
}

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
export function getFileTemporaryUrl(
  id: string,
  single: boolean = false,
  name?: string,
): Promise<string> {
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
export function moveFile(id: string, folderId: string): RequestResponse<null> {
  return Request.put(
    `/file/${id}/move`,
    {},
    {
      params: {
        folder: folderId,
      },
    },
  )
}
