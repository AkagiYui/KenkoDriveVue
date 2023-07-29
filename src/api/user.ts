import Request from './request'

/** 获取用户分页 */
export function getUsers(index: number, size: number, filter?: string) {
  return Request.get('/user', {
    params: {
      index: index,
      size: size,
      filter: filter,
    },
  })
}

/** 删除用户 */
export function deleteUser(id: string) {
  return Request.delete(`/user/${id}`)
}

/** 获取token */
export function getToken(username: string, password: string) {
  return Request.post(
    '/user/token',
    {
      username: username,
      password: password,
    },
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    },
  )
}
