/**
 * 显示的公告信息接口
 */
interface DisplayAnnouncement {
  /**
   * 标题
   */
  title: string

  /**
   * 内容
   */
  content: string

  /**
   * 创建时间
   */
  createTime: string

  /**
   * 更新时间
   */
  updateTime: string

  /**
   * 用户昵称
   */
  userNickname: string
}

/**
 * 系统公告
 */
interface Announcement {
  /**
   * 公告ID
   */
  id: string

  /**
   * 公告的标题
   */
  title: string

  /**
   * 公告的主要内容
   */
  content: string

  /**
   * 公告的创建时间
   * 格式：ISO 8601日期字符串（例如："2023-01-01T00:00:00.000Z"）
   */
  createTime: string

  /**
   * 公告的最后更新时间
   * 格式：ISO 8601日期字符串（例如："2023-01-01T00:00:00.000Z"）
   */
  updateTime: string

  /**
   * 创建公告的用户的ID
   */
  userId: string

  /**
   * 创建公告的用户的用户名
   */
  username: string

  /**
   * 是否启用
   */
  enabled: boolean
}
