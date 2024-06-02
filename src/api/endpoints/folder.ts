import Request from "../request"

/**
 * 获取文件夹内容
 * @param id 文件夹ID
 */
export async function getFolderContent(id?: string | null | undefined): Promise<FolderContentResponse> {
  type Response = {
    files: {
      id: string
      name: string
      size: number
      type: string
      createTime: number
      locked: boolean
    }[]
    folders: {
      id: string
      name: string
      createTime: number
    }[]
    folderChain: {
      id: string
      name: string
      createTime: number
    }[]
  }
  const url = id ? `/folder/${id}` : "/folder"
  const res = await Request.get<Response>(url)
  const data = res.data
  return {
    files: data.files.map((item) => {
      return {
        ...item,
        createTime: new Date(item.createTime).toLocaleString(),
      }
    }),
    folders: data.folders.map((item) => {
      return {
        ...item,
        createTime: new Date(item.createTime).toLocaleString(),
      }
    }),
    folderChain: data.folderChain.map((item) => {
      return {
        ...item,
        createTime: new Date(item.createTime).toLocaleString(),
      }
    }),
  }
}

/**
 * 创建文件夹
 * @param name 文件夹名
 * @param parent 父文件夹ID
 */
export async function createFolder(name: string | undefined, parent?: string | null | undefined): Promise<string> {
  type Response = {
    id: string
    name: string
    createTime: number
  }
  const res = await Request.post<Response>("/folder", { name: name, parent: parent || null })
  return res.data.id
}

/**
 * 移动文件夹
 * @param id 文件夹ID
 * @param parent 目标文件夹ID
 */
export async function moveFolder(id: string, parent?: string | undefined): Promise<string> {
  const res = await Request.put<FolderResponse>(`/folder/${id}/move`, undefined, {
    params: { parent },
  })
  return res.data.id
}

/**
 * 删除文件夹
 * @param id 文件夹ID
 */
export async function deleteFolder(id: string): Promise<void> {
  await Request.delete(`/folder/${id}`)
}

/**
 * 重命名文文件夹
 * @param id 文件夹ID
 * @param name 新文件夹名
 */
export async function renameFolder(id: string, name: string): Promise<void> {
  await Request.put(
    `/folder/${id}/name`,
    { name },
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
  )
}
