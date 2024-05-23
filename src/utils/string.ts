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
