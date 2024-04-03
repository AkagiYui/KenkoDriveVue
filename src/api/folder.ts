import Request from "./request"

/** 创建文件夹 */
export function createFolder(
  name: string,
  parent?: string,
): RequestResponse<undefined> {
  return Request.post("/folder", { name, parent: parent || null })
}
