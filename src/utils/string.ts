/** StringUtils.hasText */
export function hasText(str: string | undefined): boolean {
  return str !== undefined && str !== null && str.trim() !== ""
}

export const EVENT_ADD_ENTRIES = "add:entries"
export const EVENT_UPLOAD_SUCCESS = "upload:success"
