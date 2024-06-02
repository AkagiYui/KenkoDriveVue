/**
 * 显示的公告信息接口
 */
interface DisplayAnnouncementResponse {
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
interface AnnouncementResponse {
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

  /**
   * 公告创建时间戳
   */
  createTime: string

  /**
   * 公告更新时间戳
   */
  updateTime: string
}
