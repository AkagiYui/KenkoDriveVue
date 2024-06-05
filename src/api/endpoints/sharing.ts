import Request from "../request"

/**
 * 创建分享
 * @param fileId 用户文件ID
 */
export async function createSharing(fileId: string): Promise<SharingResponse> {
  type Response = {
    id: string
    filename: string
    createTime: number
    password: string
  }
  const res = await Request.post<Response>(`/share/${fileId}`)
  return {
    ...res.data,
    createTime: new Date(res.data.createTime).toLocaleString(),
  }
}

/**
 * 获取分享列表
 */
export function useSharingList() {
  const isLoading = ref(false)
  const list = ref<SharingResponse[]>([])
  const data = computed(() =>
    list.value.map((item) => {
      return {
        ...item,
        createTime: new Date(item.createTime).toLocaleString(),
      }
    }),
  )
  async function refresh() {
    isLoading.value = true
    try {
      list.value = (await Request.get<SharingResponse[]>("/share")).data
    } finally {
      isLoading.value = false
    }
  }

  return { data, refresh, isLoading }
}

/**
 * 删除分享
 * @param id 分享ID
 */
export async function deleteSharing(id: string): Promise<void> {
  await Request.delete(`/share/${id}`)
}

/**
 * 获取分享信息
 * @param id 分享ID
 */
export async function getSharingInfo(id: string): Promise<SharingResponse | null> {
  const res = (await Request.get<SharingResponse | null>(`/share/${id}`)).data
  return res
    ? {
        ...res,
        createTime: new Date(res.createTime).toLocaleString(),
      }
    : null
}

/**
 * 根据用户文件ID获取分享信息
 * @param fileId 用户文件ID
 */
export async function getSharingInfoByFileId(fileId: string): Promise<SharingResponse | null> {
  const res = (await Request.get<SharingResponse>(`/share/file/${fileId}`)).data
  return res
    ? {
        ...res,
        createTime: new Date(res.createTime).toLocaleString(),
      }
    : null
}
