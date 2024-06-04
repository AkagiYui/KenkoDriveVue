/** 用户信息 */
interface UserInfoResponse {
  /** ID */
  id: string
  /** 用户名 */
  username: string
  /** 昵称 */
  nickname: string
  /** 是否有密码 */
  hasPassword: boolean
  /** 邮箱 */
  email: string
  /** 手机号 */
  phone: string
  /** 是否禁用 */
  disabled: boolean
  /** 注册时间 */
  registerTime: string
  /** 权限 */
  permissions: string[]
}
