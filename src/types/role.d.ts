/** 角色 */
type Role = {
  id: string
  name: string
  description: string
  disabled: boolean
  userCount: number
  default: boolean
  permissions: string[]
}

/** 添加角色需要的数据 */
interface AddRoleData {
  name: string
  description?: string
  permissions?: string[]
  default?: boolean
}

/** 更新角色需要的数据 */
interface UpdateRoleData {
  name?: string
  description?: string
  permissions?: string[]
  default?: boolean
}

/** 权限 */
type Permission = {
  name: string
  description: string
}
