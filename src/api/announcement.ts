import Request from "./request"
import { hasText } from "@/utils/string"

/** 获取首页公告 */
export function getIndexAnnouncements(): Promise<any> {
  return Request.get("/announcement/index")
}

/**
 * 分页获取公告
 */
export function getAnnouncements(
  index: number = 0,
  size: number = 10,
  expression?: string,
): RequestResponse<Page<Announcement>> {
  return Request.get("/announcement", {
    params: {
      index: index,
      size: size,
      expression: expression,
    },
  })
}

/**
 * 更新公告状态
 */
export function updateAnnouncementStatus(
  id: string,
  disabled: boolean,
): RequestResponse<undefined> {
  return Request.put(
    `/announcement/${id}/status`,
    {
      disabled: disabled,
    },
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
  )
}

/**
 * 删除公告
 */
export function deleteAnnouncement(id: string): RequestResponse<undefined> {
  return Request.delete(`/announcement/${id}`)
}

/**
 * 修改公告
 */
export function updateAnnouncement(
  id: string,
  title?: string,
  content?: string,
): RequestResponse<undefined> {
  const requestData: { title?: string; content?: string } = {}
  if (hasText(title)) {
    requestData.title = title
  }
  if (hasText(content)) {
    requestData.content = content
  }
  return Request.put(`/announcement/${id}`, requestData)
}

/**
 * 新增公告
 *
 * @param data 公告信息
 * @returns 公告ID
 */
export function addAnnouncement(data: {
  title: string
  content: string
}): RequestResponse<string> {
  return Request.post("/announcement", data)
}
