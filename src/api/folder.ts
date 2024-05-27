import Request from "./request"

/** 创建文件夹 */
export function createFolder(name: string | undefined, parent?: string | null): RequestResponse<undefined> {
  return Request.post("/folder", { name: name, parent: parent || null })
}

/**
 * 移动文件夹
 * @param id 文件夹ID
 * @param parent 目标文件夹ID
 */
export function moveFolder(id: string, parent: string | undefined): RequestResponse<undefined> {
  return Request.put(
    `/folder/${id}/move`,
    {},
    {
      params: parent ? { parent } : {},
    },
  )
}

/**
 * 删除文件夹
 * @param id 文件夹ID
 */
export function deleteFolder(id: string): RequestResponse<undefined> {
  return Request.delete(`/folder/${id}`)
}

/**
 * 重命名文文件夹
 * @param id 文件夹ID
 * @param name 新文件夹名
 */
export function renameFolder(id: string, name: string): RequestResponse<null> {
  return Request.put(
    `/folder/${id}/name`,
    { name },
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
  )
}
