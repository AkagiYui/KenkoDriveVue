enum Permission {
  PERSONAL_UPLOAD, // 个人上传
  PERSONAL_DOWNLOAD, // 个人下载
  FOLDER_CREATE, // 文件夹创建
  FOLDER_DELETE, // 文件夹删除
  ROLE_VIEW, // 角色查看
  ROLE_ADD, // 角色添加
  ROLE_UPDATE, // 角色更新
  ROLE_DELETE, // 角色删除
  ROLE_ASSIGN, // 角色分配
  USER_VIEW, // 用户查看
  USER_ADD, // 用户添加
  USER_UPDATE, // 用户更新
  USER_DELETE, // 用户删除
  ANNOUNCEMENT_ADD, // 公告添加
  ANNOUNCEMENT_UPDATE, // 公告更新
  ANNOUNCEMENT_DELETE, // 公告删除
  ANNOUNCEMENT_GET_ALL, // 获取所有公告
  CONFIGURATION_GET, // 配置获取
  CONFIGURATION_UPDATE, // 配置更新
  FRONTEND_ENABLE_DEBUG_MODE, // 启用前端调试模式
}

export default Permission
