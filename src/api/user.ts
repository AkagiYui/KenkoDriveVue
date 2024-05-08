import { hasText } from "@/utils/string"
import Request from "./request"

/** 获取用户分页 */
export function getUsers(index: number, size: number, filter?: string) {
  return Request.get("/user", {
    params: {
      index: index,
      size: size,
      expression: filter,
    },
  })
}

/** 删除用户 */
export function deleteUser(id: string) {
  return Request.delete(`/user/${id}`)
}

/** 新增用户 */
export function addUser(data: {
  username: string
  password: string
  nickname?: string
  email?: string
}) {
  // 检查undefined，不发送
  const requestData: any = {}
  if (hasText(data.nickname)) {
    requestData.nickname = data.nickname
  }
  if (hasText(data.email)) {
    requestData.email = data.email
  }
  return Request.post("/user", {
    username: data.username,
    password: data.password,
    ...requestData,
  })
}

/** 更新用户信息 */
export function updateUserInfo(
  id: string,
  data: { password?: string; nickname?: string; email?: string },
) {
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
  return Request.put(`/user/${id}`, requestData)
}

/** 获取token */
export function getToken(username: string, password: string) {
  return Request.post(
    "/user/token",
    {
      username: username,
      password: password,
    },
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
  )
}

/** 获取用户信息 */
export function getUserInfo() {
  return Request.get("/user/info")
}

/** 获取用户头像*/
export function getUserAvatar() {
  return Request.get("/user/avatar", { responseType: "blob" })
}

/** 上传用户头像 */
export function uploadUserAvatar(file: File) {
  // 判断文件大小
  if (file.size > 1024 * 1024 * 5) {
    return Promise.reject("文件大小不能超过5MB")
  }
  // 判断文件类型
  if (!["image/jpeg", "image/png", "image/gif"].includes(file.type)) {
    return Promise.reject("文件类型必须是图片")
  }

  const formData = new FormData()
  formData.append("avatar", file)
  return Request.post("/user/avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
}

/**
 * 更新用户禁用状态
 */
export function updateUserDisabled(
  id: string,
  disabled: boolean,
): Promise<any> {
  return Request.put(
    `/user/${id}/disable`,
    {
      disabled: disabled,
    },
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
  )
}

/**
 * (管理员)重置密码
 */
export function updateUserPassword(
  id: string,
  newPassword: string,
): Promise<any> {
  return Request.put(`/user/${id}/password`, {
    newPassword: newPassword,
  })
}

/**
 * (管理员)获取用户角色列表
 */
export function getUserRoles(id: string): RequestResponse<string[]> {
  return Request.get(`/user/${id}/role`)
}

/**
 * (管理员)分配用户角色
 */
export function assignRoles(
  id: string,
  roles: string[],
): RequestResponse<null> {
  return Request.put(`/user/${id}/role`, roles)
}

/**
 * (管理员)移除用户角色
 */
export function removeRoles(
  id: string,
  roles: string[],
): RequestResponse<null> {
  return Request.delete(`/user/${id}/role`, { data: roles })
}

/**
 * 获取注册邮件验证码
 */
export function sendRegisterEmailCode(
  username: string,
  password: string,
  email: string,
  captcha: GeetestSuccessInfo,
) {
  return Request.post(
    "/user/register/email",
    {
      username: username,
      password: password,
      email: email,
    },
    {
      params: { ...captcha },
    },
  )
}

/**
 * 确认邮件验证码注册
 */
export function confirmRegisterEmailCode(username: string, code: string) {
  return Request.post("/user/register", {
    email: username,
    verifyCode: code,
  })
}
