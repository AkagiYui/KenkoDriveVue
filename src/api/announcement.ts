import Request from './request'

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
  return Request.get('/announcement', {
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
export function updateAnnouncementStatus(id: string, disabled: boolean): RequestResponse<undefined> {
  return Request.put(
    `/announcement/${id}/status`,
    {
      disabled: disabled,
    },
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    },
  )
}
