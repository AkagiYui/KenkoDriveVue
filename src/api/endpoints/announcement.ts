import Request from "../request"
import { hasText } from "@/utils"

/** 获取首页公告 */
export async function getDisplayAnnouncements(): Promise<DisplayAnnouncementResponse[]> {
  type Response = {
    title: string
    content?: string
    userNickname: string
    createTime: number
    updateTime: number
  }[]
  const res = await Request.get<Response>("/announcement/index")
  return res.data.map((item) => {
    return {
      ...item,
      content: item.content || "",
      createTime: new Date(item.createTime).toLocaleString(),
      updateTime: new Date(item.updateTime).toLocaleString(),
    }
  })
}

/**
 * 分页获取公告
 * @param {number} index 页码
 * @param {number} size 每页数量
 * @param {string} expression 搜索表达式
 * @return {Promise<Page<AnnouncementResponse>>} 公告分页
 */
export async function getAnnouncements(
  index: number = 0,
  size: number = 10,
  expression?: string,
): Promise<Page<AnnouncementResponse>> {
  type Response = Page<{
    id: string
    title: string
    content?: string
    userId: string
    username: string
    enabled: boolean
    createTime: number
    updateTime: number
  }>
  const res = await Request.get<Response>("/announcement", {
    params: {
      index: index,
      size: size,
      expression: expression,
    },
  })
  return {
    ...res.data,
    list: res.data.list.map((item) => {
      return {
        ...item,
        content: item.content || "",
        createTime: new Date(item.createTime).toLocaleString(),
        updateTime: new Date(item.updateTime).toLocaleString(),
      }
    }),
  }
}

/**
 * 更新公告状态
 * @param id 公告ID
 * @param disabled 是否禁用
 */
export async function updateAnnouncementStatus(id: string, disabled: boolean): Promise<void> {
  await Request.put(`/announcement/${id}/status`, {
    data: { disabled },
    dataType: "url",
  })
}

/**
 * 删除公告
 * @param id 公告ID
 */
export async function deleteAnnouncement(id: string): Promise<void> {
  await Request.delete(`/announcement/${id}`)
}

/**
 * 修改公告
 * @param id 公告ID
 * @param title 标题
 * @param content 内容
 */
export async function updateAnnouncement(id: string, title?: string, content?: string): Promise<void> {
  const requestData: { title?: string; content?: string } = {}
  if (hasText(title)) {
    requestData.title = title
  }
  if (hasText(content)) {
    requestData.content = content
  }
  await Request.put(`/announcement/${id}`, { data: requestData })
}

/**
 * 新增公告
 *
 * @param data 公告信息
 * @returns 公告ID
 */
export async function addAnnouncement(data: { title: string; content: string }): Promise<string> {
  const res = await Request.post<string>("/announcement", { data })
  return res.data
}
