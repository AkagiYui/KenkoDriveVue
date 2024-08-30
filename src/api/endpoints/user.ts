import { hasText } from "@/utils"
import Request from "../request"

/**
 * 获取用户分页
 * @param index 页码
 * @param size 每页数量
 * @param expression 搜索表达式
 */
export async function getUsers(index: number, size: number, expression?: string): Promise<Page<UserInfoResponse>> {
  type Response = Page<{
    id: string
    username: string
    nickname: string
    email: string
    phone: string
    hasPassword: boolean
    disabled: boolean
    registerTime: number
    permissions: string[]
  }>
  const baseParams = { index, size }
  const params = expression ? { ...baseParams, expression } : baseParams
  const res = await Request.get<Response>("/user", {
    params,
  })
  return {
    ...res.data,
    list: res.data.list.map((item) => {
      return {
        ...item,
        registerTime: new Date(item.registerTime).toLocaleString(),
      }
    }),
  }
}

/**
 * 删除用户
 * @param id 用户ID
 */
export async function deleteUser(id: string): Promise<void> {
  await Request.delete(`/user/${id}`)
}

/**
 * 新增用户
 * @param data 新增用户数据
 */
export async function addUser(data: {
  username?: string
  password?: string
  nickname?: string
  email?: string
  phone?: string
}): Promise<void> {
  if (!hasText(data.username) && !hasText(data.email) && !hasText(data.phone)) {
    throw new Error("用户名、邮箱、手机号至少填写一个")
  }
  // 检查undefined，不发送
  const requestData: any = {}
  if (hasText(data.email)) {
    requestData.email = data.email
  }
  if (hasText(data.phone)) {
    requestData.phone = data.phone
  }
  if (hasText(data.password)) {
    requestData.password = data.password
  }
  if (hasText(data.username)) {
    requestData.username = data.username
  }
  if (hasText(data.nickname)) {
    requestData.nickname = data.nickname
  }
  await Request.post("/user", {
    ...requestData,
  })
}

/**
 * 更新用户信息
 * @param id 用户ID
 * @param data 更新用户数据
 */
export async function updateUserInfo(
  id: string,
  data: { password?: string; nickname?: string; email?: string; phone?: string },
): Promise<void> {
  // 检查undefined，不发送
  const requestData: any = {}
  if (hasText(data.nickname)) {
    requestData.nickname = data.nickname
  }
  if (hasText(data.email)) {
    requestData.email = data.email
  }
  if (hasText(data.password)) {
    requestData.password = data.password
  }
  if (hasText(data.phone)) {
    requestData.phone = data.phone
  }
  await Request.put(`/user/${id}`, requestData)
}

/** 获取用户信息 */
export async function getUserInfo(): Promise<UserInfoResponse> {
  const res = await Request.get<UserInfoResponse>("/user/info")
  return res.data
}

/** 获取用户头像*/
export async function getUserAvatar(): Promise<ArrayBuffer> {
  const res = await Request.get<ArrayBuffer>("/user/avatar", { responseType: "blob" })
  return res.data
}

/**
 * 上传用户头像
 * @param file 头像文件
 */
export async function uploadUserAvatar(file: File): Promise<void> {
  // 判断文件大小
  if (file.size > 1024 * 1024 * 5) {
    throw new Error("文件大小不能超过5MB")
  }
  // 判断文件类型
  if (!["image/jpeg", "image/png", "image/gif"].includes(file.type)) {
    throw new Error("文件类型必须是图片")
  }
  const formData = new FormData()
  formData.append("avatar", file)
  await Request.post("/user/avatar", {
    data: formData,
    dataType: "form",
  })
}

/**
 * 更新用户禁用状态
 * @param id 用户ID
 * @param disabled 是否禁用
 */
export async function updateUserDisabled(id: string, disabled: boolean): Promise<void> {
  await Request.put(`/user/${id}/disable`, {
    data: { disabled },
    dataType: "url",
  })
}

/**
 * (管理员)重置密码
 * @param id 用户ID
 * @param newPassword 新密码
 */
export async function updateUserPassword(id: string, newPassword: string): Promise<void> {
  await Request.put(`/user/${id}/password`, {
    data: { newPassword },
  })
}

/**
 * (管理员)获取用户角色列表
 * @param id 用户ID
 */
export async function getUserRoles(id: string): Promise<string[]> {
  const res = await Request.get<string[]>(`/user/${id}/role`)
  return res.data
}

/**
 * (管理员)分配用户角色
 * @param id 用户ID
 * @param roles 角色列表
 */
export async function assignRoles(id: string, roles: string[]): Promise<void> {
  await Request.put(`/user/${id}/role`, { data: roles })
}

/**
 * (管理员)移除用户角色
 * @param id 用户ID
 * @param roles 角色列表
 */
export async function removeRoles(id: string, roles: string[]): Promise<void> {
  await Request.delete(`/user/${id}/role`, { data: roles })
}
