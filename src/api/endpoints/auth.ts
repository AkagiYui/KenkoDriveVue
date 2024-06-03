import Request from "../request"

type TokenResponse = {
  token: string
  refreshToken: string
}

/**
 * 获取注册邮件验证码
 * @param username 邮箱
 * @param password 密码
 * @param email 邮箱
 * @param captcha 极验验证信息
 */
export async function sendRegisterEmailCode(
  username: string,
  password: string,
  email: string,
  captcha: GeetestSuccessInfo,
): Promise<void> {
  await Request.post(
    "/auth/register/email",
    {
      username: username,
      password: password,
      email: email,
    },
    {
      params: { ...captcha },
    },
  )
}

/**
 * 确认邮件验证码注册
 * @param username 邮箱
 * @param code 验证码
 */
export async function confirmRegisterEmailCode(username: string, code: string): Promise<void> {
  await Request.post("/auth/register", {
    email: username,
    verifyCode: code,
  })
}

/**
 * 获取短信验证码
 * @param phone 手机号
 * @param captcha 极验验证信息
 */
export async function sendSmsCode(phone: string, captcha: GeetestSuccessInfo): Promise<void> {
  await Request.post(
    "/auth/sms",
    {
      ...captcha,
      phone,
    },
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
  )
}

/**
 * 确认短信验证码登录
 */
export async function confirmSmsCode(phone: string, code: string): Promise<string> {
  const res = await Request.get<TokenResponse>("/auth/token/sms", {
    params: {
      phone: phone,
      code: code,
    },
  })
  return res.data.token
}

/**
 * 获取token
 * @param username 用户名
 * @param password 密码
 */
export async function getToken(username: string, password: string): Promise<string> {
  const res = await Request.post<TokenResponse>(
    "/auth/token",
    { username, password },
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
  )
  return res.data.token
}
