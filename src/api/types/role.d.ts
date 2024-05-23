/** 角色 */
interface Role {
  /** ID */
  id: string
  /** 名称 */
  name: string
  /** 描述 */
  description: string
  /** 是否禁用 */
  disabled: boolean
  /** 用户数量 */
  userCount: number
  /** 是否默认 */
  default: boolean
  /** 权限列表 */
  permissions: string[]
}

/** 添加角色需要的数据 */
interface AddRoleData {
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
interface UpdateRoleData {
  /** ID */
  name?: string
  /** 名称 */
  description?: string
  /** 权限列表 */
  permissions?: string[]
  /** 是否默认 */
  default?: boolean
}

/** 权限 */
interface Permission {
  /** 名称 */
  name: string
  /** 描述 */
  description: string
}
