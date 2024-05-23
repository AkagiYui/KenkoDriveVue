/**
 * StringUtils.hasText
 * 判断是否有文本
 * @param str 字符串
 * @returns 是否有文本
 */
export function hasText(str: string | undefined): boolean {
  return str !== undefined && str !== null && str.trim() !== ""
}
