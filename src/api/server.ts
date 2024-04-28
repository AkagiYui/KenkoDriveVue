import Request from "./request"

/** 获取后端版本号 */
export function getBackendVersion() {
  return Request.get("/system/version")
}

/** 获取配置 */
export function getConfig(): RequestResponse<Object> {
  return Request.get("/system/setting")
}

/** 设置 开放注册 */
export function setRegisterEnabled(
  enabled: boolean,
): RequestResponse<undefined> {
  return Request.put("/system/setting/register", { enabled })
}

/** 获取 开放注册 */
export function getRegisterEnabled(): RequestResponse<boolean> {
  return Request.get("/system/setting/register")
}
