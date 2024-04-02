/**
 * 文件信息
 */
type FileInfo = {
  id: string
  name: string
  size: number
  type: string
  createTime: string
}

/**
 * 文件夹信息
 */
type FolderInfo = {
  id: string
  name: string
  createTime: string
}

/**
 * 目录内容
 */
type FolderContent = {
  files: FileInfo[]
  folders: FolderInfo[]
  folderChain: { id: string; name: string }[]
}
