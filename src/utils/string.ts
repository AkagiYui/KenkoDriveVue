/**
 * StringUtils.hasText
 * 判断是否有文本
 * @param str 字符串
 * @returns 是否有文本
 */
export function hasText(str: string | undefined): boolean {
  return str !== undefined && str !== null && str.trim() !== ""
}

/**
 * 获取JWT剩余过期时间戳
 * @param jwt JWT字符串
 * @returns 剩余过期时间戳（秒）
 */
export function getJWTExpireTime(jwt: string): number {
  const payload = jwt.split(".")[1]
  const decodedPayload = atob(payload)
  const payloadObj = JSON.parse(decodedPayload)
  return payloadObj.exp
}

/**
 * 获取JWT可用时间
 * @param jwt JWT字符串
 * @returns 可用时间（秒）
 */
export function getJWTAvailableSecond(jwt: string): number {
  return getJWTExpireTime(jwt) - Math.floor(Date.now() / 1000)
}

/**
 * 构造URL
 * @param url 请求路径
 * @param params 请求参数
 * @param baseURL 基础URL
 * @param useLocation 是否使用当前页面的origin
 * @returns 完整URL
 *
 * @example
 * buildUrl("/api", {id: 1}, "http://localhost:8080") => "http://localhost:8080/api?id=1"
 * buildUrl("/api", {id: 1}) => "/api?id=1"
 * buildUrl("/api") => "/api"
 * buildUrl("/api", {id: 1}, "/") => "/api?id=1"
 * buildUrl("/api", {id: 1}, "/base") => "/base/api?id=1"
 * buildUrl("/api", {id: 1}, "/base", true) => "http://localhost:8080/base/api?id=1"
 */
export function buildUrl(
  url: string,
  params?: Record<string, any>,
  baseURL?: string,
  useLocation: boolean = false,
): string {
  // 处理基础 URL(没有尾随斜杠/)
  let fullBaseUrl = ""
  if (baseURL && !baseURL.startsWith("/")) {
    // 如果 baseURL 是绝对路径，直接使用
    fullBaseUrl = baseURL
  } else if (useLocation) {
    // 如果 baseURL 是相对路径，且 useLocation 为 true，则使用当前页面的 origin 加上 baseURL
    fullBaseUrl = window.location.origin + (baseURL || "")
  } else { 
    // 否则使用 baseURL
    fullBaseUrl = baseURL || ""
  }
  // 去除 baseURL 尾部的斜杠
  fullBaseUrl = fullBaseUrl.replace(/\/+$/, "")

  // 确保 url 以 "/" 开头
  if (!url.startsWith("/")) {
    url = "/" + url
  }
  // 构建完整的 URL
  let fullUrl = fullBaseUrl + url

  // 添加查询参数
  if (params && Object.keys(params).length > 0) {
    const queryString = Object.entries(params)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
      .join("&")
    fullUrl += (fullUrl.includes("?") ? "&" : "?") + queryString
  }
  return fullUrl
}
