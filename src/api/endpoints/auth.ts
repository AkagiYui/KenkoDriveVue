import Request from "../request"

type TokenResponse = {
  token: string
  refreshToken: string
}

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
