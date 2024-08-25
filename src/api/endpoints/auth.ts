import Request from "../request"

/**
 * 使用密码获取token
 * @param username 用户名
 * @param password 密码
 */
export async function getTokenByPassword(username: string, password: string): Promise<string> {
  const res = await Request.post<TokenResponse>("/auth/token/password", { username, password })
  return res.data.token
}
export const getToken = getTokenByPassword

/**
 * 使用短信验证码获取token
 */
export async function getTokenBySms(phone: string, otp: string): Promise<string> {
  const res = await Request.post<TokenResponse>("/auth/token/sms", { phone, otp })
  return res.data.token
}

/**
 * 发送注册邮件验证码
 * @param password 密码
 * @param email 邮箱
 * @param captcha 极验验证信息
 */
export async function sendEmailRegisterOtp(
  password: string,
  email: string,
  captcha: GeetestSuccessInfo,
): Promise<void> {
  await Request.post(
    "/auth/otp/email",
    { password, email },
    {
      params: { ...captcha },
    },
  )
}

/**
 * 发送短信验证码
 * @param phone 手机号
 * @param captcha 极验验证信息
 */
export async function sendSmsOtp(phone: string, captcha: GeetestSuccessInfo): Promise<void> {
  await Request.post(
    "/auth/otp/sms",
    { phone },
    {
      params: { ...captcha },
    },
  )
}

/**
 * 确认邮件验证码注册
 * @param username 邮箱
 * @param otp 验证码
 */
export async function confirmEmailRegisterOtp(email: string, otp: string): Promise<void> {
  await Request.post("/auth/register/email", { email, otp })
}

/**
 * 申请登录二维码token
 */
export async function getQrToken(): Promise<string> {
  const res = await Request.post<string>("/auth/token/temporary")
  return res.data
}

/**
 * 获取二维码状态
 * @param token 二维码token
 */
export async function getQrStatus(token: string): Promise<TemporaryTokenStatus> {
  const res = await Request.get<TemporaryTokenStatus>(`/auth/token/temporary/${token}`)
  return res.data
}

/**
 * 认领二维码token
 * @param token 二维码token
 */
export async function claimQrToken(token: string): Promise<ClaimTokenResponse> {
  const res = await Request.post<ClaimTokenResponse>(`/auth/token/temporary/${token}`)
  return res.data
}

/**
 * 确认二维码登录
 * @param token 二维码token
 * @param takenToken 认领token
 */
export async function confirmQrLogin(token: string, takenToken: string): Promise<void> {
  await Request.post<string>(
    `/auth/token/temporary/${token}/confirm`,
    {},
    {
      headers: { ContentType: "x-www-form-urlencoded" },
      params: { token: takenToken },
    },
  )
}

/**
 * 取消二维码登录
 * @param token 二维码token
 * @param takenToken 认领token
 */
export async function cancelQrLogin(token: string, takenToken: string): Promise<void> {
  await Request.post<string>(
    `/auth/token/temporary/${token}/cancel`,
    {},
    {
      headers: { ContentType: "x-www-form-urlencoded" },
      params: { token: takenToken },
    },
  )
}
