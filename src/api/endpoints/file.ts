import Request, { baseConfig as config } from "../request"

/**
 * 获取文件临时token
 * @param id 文件ID
 */
export async function getFileTemporaryToken(id: string): Promise<string> {
  const res = await Request.get<string>(`/file/${id}/token`)
  return res.data
}

/**
 * 获取文件临时URL
 * @param id 文件ID
 * @param single 是否单线程下载
 * @param name 文件名
 */
export async function getFileTemporaryUrl(id: string, single: boolean = false, name?: string): Promise<string> {
  const token = await getFileTemporaryToken(id)
  let url = `${config.baseURL}/file/${token}/download`
  if (name) {
    url += `/${name}`
  }
  if (single) {
    url += "?single=true"
  }
  return url
}

/**
 * 删除文件链接
 * @param id 文件ID
 */
export async function deleteFile(id: string): Promise<void> {
  await Request.delete(`/file/${id}`)
}

/**
 * 删除文件
 * @param id 文件ID
 */
export async function deleteRealFile(id: string): Promise<void> {
  await Request.delete(`/file/${id}/real`)
}

/**
 * 移动文件
 * @param id 文件ID
 * @param folderId 目标文件夹ID
 */
export async function moveFile(id: string, folderId?: string | undefined): Promise<void> {
  await Request.put(`/file/${id}/move`, {
    params: {
      folder: folderId,
    },
  })
}

/**
 * 重命名文件
 * @param id 用户文件ID
 * @param name 新文件名
 */
export async function renameUserFile(id: string, name: string): Promise<void> {
  await Request.put(
    `/file/${id}/name`,
    {
      data: { name },
      dataType: "url",
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
  const expression = ref("")
  const data = ref<FileInfoResponse[]>([])
  const count = ref(0)
  const isLoading = ref(false)

  function fetchData() {
    isLoading.value = true
    Request.get<Page<FileInfoResponse>>("/file", {
      params: {
        index: index.value,
        size: size.value,
        expression: expression.value,
      },
    })
      .then((response) => {
        data.value = response.data.list
        count.value = response.data.itemCount
      })
      .finally(() => {
        isLoading.value = false
      })
  }

  fetchData()
  watch([index, size, expression], fetchData)

  return { index, size, data, count, isLoading, fetchData, expression }
}

/**
 * 锁定/解锁文件
 * @param id 文件ID
 * @param lock 是否锁定
 */
export async function lockFile(id: string, lock: boolean): Promise<void> {
  Request.put(
    `/file/${id}/lock`,
    {
      data: { locked: lock },
      dataType: "url",
    },
  )
}

/**
 * 获取文件拥有者
 * @param id 文件ID
 */
export function useFileOwner() {
  const id = ref("")
  const owner = ref<FileOwnerResponse>([])
  const isLoading = ref(false)

  async function fetchData() {
    isLoading.value = true
    try {
      const res = await Request.get<FileOwnerResponse>(`/file/${id.value}/owner`)
      owner.value = res.data
    } finally {
      isLoading.value = false
    }
  }

  watch(id, (newId) => {
    if (newId) {
      fetchData()
    }
  })

  return { id, owner, fetchData, isLoading }
}
