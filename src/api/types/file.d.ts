/**
 * 文件信息
 */
interface UserFileResponse {
  /**
   * 文件ID
   */
  id: string

  /**
   * 文件名
   */
  name: string

  /**
   * 文件大小（字节）
   */
  size: number

  /**
   * 文件类型
   */
  type: string

  /**
   * 创建时间
   */
  createTime: string

  /**
   * 已被锁定
   */
  locked: boolean
}

interface FileInfoResponse {
  id: string
  name: string
  size: number
  type: string
  createTime: number
  locked: boolean
  downloadCount: number
}
