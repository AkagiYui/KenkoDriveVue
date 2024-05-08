import Request, { config } from "./request"

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
 */
export function getFileTemporaryUrl(id: string, single: boolean = false): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    getFileTemporaryToken(id)
      .then((response) => {
        const url = `${config.baseURL}/file/${response.data}/download`
        resolve(!single ? url : `${url}?single=true`)
      })
      .catch(reject)
  })
}
