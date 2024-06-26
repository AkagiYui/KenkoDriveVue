export const ResponseMessages: { [key: number]: string } = {
  10000: "",
  10001: "General error",
  10002: "Internal error",
  10003: "Not found",
  10004: "Unauthorized",
  10005: "User exist",
  10006: "Bad request",
  10007: "Forbidden",
  10008: "Email exist",
  10009: "Verify code not found",
  10010: "Too many requests",
  10011: "Invalid Captcha",
  10012: "Client not found",
  10013: "File too large",
  10014: "File format not support",
  10015: "Folder exist",
  10016: "Register disabled",
  10017: "Task exist",
  10018: "Verify failed",
  10019: "Task not found",
  10020: "Role exist",
  10021: "Permission not exist",
  10022: "Role not exist",
  10023: "User not exist",
}

export const ResponseMessagesSimplifiedChinese: { [key: number]: string } = {
  10000: "成功",
  10001: "通用错误",
  10002: "内部错误",
  10003: "未找到",
  10004: "未认证",
  10005: "用户已存在",
  10006: "错误的请求",
  10007: "禁止访问",
  10008: "邮箱已被使用",
  10009: "验证码错误",
  10010: "请求过于频繁",
  10011: "验证码无效",
  10012: "应用不存在",
  10013: "文件过大",
  10014: "文件格式不支持",
  10015: "文件夹已存在",
  10016: "注册已关闭",
  10017: "任务已存在",
  10018: "校验失败",
  10019: "任务不存在",
  10020: "角色已存在",
  10021: "权限不存在",
  10022: "角色不存在",
  10023: "用户不存在",
  10025: "手机号已存在",
}

export function getErrorMessageDict(language: string = "zh-CN"): { [key: number]: string } {
  switch (language) {
    case "zh-CN":
      return ResponseMessagesSimplifiedChinese
    default:
      return ResponseMessages
  }
}

const EMD = getErrorMessageDict()
export default EMD
