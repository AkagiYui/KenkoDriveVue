import Request from "./request"

/** 获取首页公告 */
export function getIndexAnnouncements(): Promise<any> {
  return Request.get("/announcement/index")
}
