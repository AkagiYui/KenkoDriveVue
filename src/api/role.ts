import Request from "./request"

/** 获取所有角色 */
export function getRoles(index: number = 0, size: number = 10, expression?: string): RequestResponse<Page<Role>> {
  return Request.get("/role", {
    params: {
      index: index,
      size: size,
      expression: expression,
    },
  })
}

/** 获取所有权限 */
export function getPermissions(): RequestResponse<Permission[]> {
  return Request.get("/role/permissions")
}

/** 新增角色 */
export function addRole(data: AddRoleData): RequestResponse<string> {
  return Request.post("/role", data)
}

/** 删除角色 */
export function deleteRole(id: string): RequestResponse<null> {
  return Request.delete(`/role/${id}`)
}

/** 更新角色信息 */
export function updateRole(id: string, data: UpdateRoleData): RequestResponse<null> {
  return Request.put(`/role/${id}`, data)
}

/** 更新角色状态 */
export function updateRoleStatus(id: string, disabled?: boolean): RequestResponse<null> {
  const requestData: any = {}
  if (disabled !== undefined) {
    requestData.disabled = disabled
  }
  return Request.put(`/role/${id}/status`, requestData, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  })
}

/** 获取某一角色拥有的用户ID */
export function getRoleUsers(id: string): RequestResponse<string[]> {
  return Request.get(`/role/${id}/users`)
}

/** 分配角色用户 */
export function assignRoleUsers(id: string, userIds: string[]): RequestResponse<null> {
  return Request.put(`/role/${id}/users`, userIds)
}

/** 取消分配角色用户 */
export function unassignRoleUsers(id: string, userIds: string[]): RequestResponse<null> {
  return Request.delete(`/role/${id}/users`, {
    data: userIds,
  })
}
