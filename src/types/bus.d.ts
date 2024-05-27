/**
 * 添加文件事件
 */
interface AddEntriesEvent {
  /**
   * 文件句柄
   */
  file: FileSystemFileEntry[]

  /**
   * 目标文件夹ID
   */
  folderId?: string | null
}

interface AddFileListEvent {
  /**
   * 文件句柄
   */
  file: FileList

  /**
   * 目标文件夹ID
   */
  folderId?: string | null
}
