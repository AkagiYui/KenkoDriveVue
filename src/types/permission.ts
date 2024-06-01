/**
 * 权限枚举
 */
enum Permission {
  /**
   * 个人上传文件
   */
  PERSONAL_UPLOAD,
  /**
   * 个人下载文件
   */
  PERSONAL_DOWNLOAD,
  /**
   * 创建文件夹
   */
  FOLDER_CREATE,
  /**
   * 删除文件夹
   */
  FOLDER_DELETE,
  /**
   * 查看角色
   */
  ROLE_VIEW,
  /**
   * 添加角色
   */
  ROLE_ADD,
  /**
   * 更新角色
   */
  ROLE_UPDATE,
  /**
   * 删除角色
   */
  ROLE_DELETE,
  /**
   * 分配角色
   */
  ROLE_ASSIGN,
  /**
   * 查看用户
   */
  USER_VIEW,
  /**
   * 添加用户
   */
  USER_ADD,
  /**
   * 更新用户
   */
  USER_UPDATE,
  /**
   * 删除用户
   */
  USER_DELETE,
  /**
   * 添加公告
   */
  ANNOUNCEMENT_ADD,
  /**
   * 更新公告
   */
  ANNOUNCEMENT_UPDATE,
  /**
   * 删除公告
   */
  ANNOUNCEMENT_DELETE,
  /**
   * 获取所有公告
   */
  ANNOUNCEMENT_GET_ALL,
  /**
   * 获取配置信息
   */
  CONFIGURATION_GET,
  /**
   * 更新配置信息
   */
  CONFIGURATION_UPDATE,
  /**
   * 启用前端调试模式
   */
  FRONTEND_ENABLE_DEBUG_MODE,
  /**
   * 获取操作日志
   */
  ACTION_LOG_GET,
  /**
   * 获取系统信息
   */
  SYSTEM_INFO_GET,
  /**
   * 获取所有文件列表
   */
  FILE_LIST_ALL,
}

export default Permission
