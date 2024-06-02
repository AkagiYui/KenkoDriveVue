/** 角色 */
interface RoleResponse {
  /** ID */
  id: string
  /** 名称 */
  name: string
  /** 描述 */
  description: string
  /** 是否禁用 */
  disabled: boolean
  /** 是否默认 */
  isDefault: boolean
  /** 用户数量 */
  userCount: number
  /** 权限列表 */
  permissions: string[]
}

/** 添加角色需要的数据 */
interface AddRoleRequest {
  /** 名称 */
  name: string
  /** 描述 */
  description?: string
  /** 权限列表 */
  permissions?: string[]
  /** 是否默认 */
  default?: boolean
}

/** 更新角色需要的数据 */
interface UpdateRoleRequest {
  /** ID */
  name?: string
  /** 名称 */
  description?: string
  /** 权限列表 */
  permissions?: string[]
  /** 是否默认 */
  isDefault?: boolean
}

/** 权限 */
interface PermissionResponse {
  /** 名称 */
  name: string
  /** 描述 */
  description: string
}
