import Request from "./request"

/** 获取后端版本号 */
export function getBackendVersion() {
  return Request.get("/server/version")
}
