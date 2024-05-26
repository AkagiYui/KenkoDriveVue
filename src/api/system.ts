import Request from "./request"

/** 获取后端版本号 */
export function getBackendVersion() {
  return Request.get("/system/version")
}

/** 获取配置 */
export function getConfig(): RequestResponse<Object> {
  return Request.get("/system/setting")
}

/** 更新设置 */
export function updateSetting(key: string, value: string | number | boolean): RequestResponse<undefined> {
  return Request.put(
    `/system/setting/${key}`,
    { value },
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  )
}

/** 获取 开放注册 */
export function getRegisterEnabled(): RequestResponse<boolean> {
  return Request.get("/system/setting/register")
}
