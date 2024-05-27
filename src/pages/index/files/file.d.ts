/**
 * 表格数据类型
 */
type TableData = {
  id: string
  name: string
  size: string
  type: "folder" | "file"
  fileType?: string
  createTime: string
  locked: boolean
}
