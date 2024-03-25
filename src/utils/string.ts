/** StringUtils.hasText */
export function hasText(str: string | undefined): boolean {
  return str !== undefined && str !== null && str.trim() !== ""
}
