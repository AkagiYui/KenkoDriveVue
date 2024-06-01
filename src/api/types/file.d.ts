/**
 * 文件信息
 */
interface FileUserResponse {
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

/**
 * 文件夹信息
 */
interface FolderInfo {
  /**
   * 文件夹ID
   */
  id: string

  /**
   * 文件夹名
   */
  name: string

  /**
   * 创建时间
   */
  createTime: string
}

/**
 * 目录内容
 */
type FolderContent = {
  /**
   * 文件列表
   */
  files: FileUserResponse[]

  /**
   * 文件夹列表
   */
  folders: FolderInfo[]

  /**
   * 目录链
   */
  folderChain: { id: string; name: string }[]
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
