import Request from "./request"

/** 获取目录内容 */
export function getFolderContent(
  id: string | null = null,
): RequestResponse<FolderContent> {
  return Request.get("/file", { params: { folder: id } })
}
