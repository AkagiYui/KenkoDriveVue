import Request from "../request"

/**
 * 获取所有角色
 * @param index 页码
 * @param size 每页数量
 * @param expression 搜索表达式
 */
export async function getRoles(index: number = 0, size: number = 10, expression?: string): Promise<Page<RoleResponse>> {
  type Response = Page<RoleResponse>
  const res = await Request.get<Response>("/role", {
    params: {
      index: index,
      size: size,
      expression: expression,
    },
  })
  return res.data
}

/** 获取所有权限 */
export async function getPermissions(): Promise<PermissionResponse[]> {
  type Response = PermissionResponse[]
  const res = await Request.get<Response>("/role/permissions")
  return res.data
}

/**
 * 新增角色
 * @param data 新增角色数据
 */
export async function addRole(data: AddRoleRequest): Promise<string> {
  const res = await Request.post<string>("/role", {data})
  return res.data
}

/**
 * 删除角色
 * @param id 角色ID
 */
export async function deleteRole(id: string): Promise<void> {
  await Request.delete(`/role/${id}`)
}

/**
 * 更新角色信息
 * @param id 角色ID
 * @param data 更新角色数据
 */
export async function updateRole(id: string, data: UpdateRoleRequest): Promise<void> {
  await Request.put(`/role/${id}`, {data})
}

/**
 * 更新角色状态
 * @param id 角色ID
 * @param disabled 是否禁用
 */
export async function updateRoleStatus(id: string, disabled?: boolean): Promise<void> {
  const requestData: any = {}
  if (disabled !== undefined) {
    requestData.disabled = disabled
  }
  await Request.put(`/role/${id}/status`, {
    data: requestData,
    dataType: "url",
  })
}

/**
 * 获取某一角色拥有的用户ID
 * @param id 角色ID
 */
export async function getRoleUsers(id: string): Promise<string[]> {
  const res = await Request.get<string[]>(`/role/${id}/users`)
  return res.data
}

/**
 * 分配角色用户
 * @param id 角色ID
 * @param userIds 用户ID列表
 */
export async function assignRoleUsers(id: string, userIds: string[]): Promise<void> {
  await Request.put(`/role/${id}/users`, {data: userIds})
}

/**
 * 取消分配角色用户
 * @param id 角色ID
 * @param userIds 用户ID列表
 */
export async function unassignRoleUsers(id: string, userIds: string[]): Promise<void> {
  await Request.delete(`/role/${id}/users`, {
    data: userIds,
  })
}
