/**
 * 文件夹信息
 */
interface FolderResponse {
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
interface FolderContentResponse {
  /**
   * 文件列表
   */
  files: UserFileResponse[]

  /**
   * 文件夹列表
   */
  folders: FolderInfoResponse[]

  /**
   * 目录链
   */
  folderChain: { id: string; name: string }[]
}
