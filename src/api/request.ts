import axios from "axios"
import { NIcon } from "naive-ui"
import { BugReportOutlined } from "@vicons/material"
import { useUserInfo } from "@/stores/user-info"
import { hasText } from "@/utils"

const isDev = import.meta.env.DEV
export const config = {
  baseURL: isDev ? "/api" : import.meta.env.VITE_BACKEND_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
}

const request = axios.create(config)

request.interceptors.request.use(
  (config) => {
    window.$loadingbar.start() // 显示加载条
    const token = useUserInfo().requestToken // 获取token
    if (config.url! !== "/user/token" && hasText(token)) {
      // 如果token存在
      config.headers["Authorization"] = `Bearer ${token}` // 设置请求头
    }
    return config
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  },
)

function responseSuccess(response) {
  // 2xx 范围内的状态码都会触发该函数。
  window.$loadingbar.finish()
  const contentType = response.headers["content-type"]
  if (contentType && contentType.indexOf("application/json") !== -1) {
    // 如果返回的数据是 JSON 格式，取消外层的 data 包裹
    response.data = response.data["data"]
  }
  return response
}

// 超出 2xx 范围的状态码都会触发该函数。
function responseFailed(error) {
  window.$loadingbar.error()

  // 请求超时
  if (error.code === "ECONNABORTED") {
    return Promise.reject(error)
  }

  const statusCode = error.response?.status

  // 401 未认证
  if (statusCode === 401) {
    window.$message.error("登录超时，请重新登录")
    return Promise.reject(error)
  }

  // 403 无权限
  if (statusCode === 403) {
    window.$message.error("无权限")
    return Promise.reject(error)
  }

  // 400 参数错误、业务异常
  if (statusCode === 400) {
    // 如果是开发环境，弹出错误提示
    if (isDev) {
      const contentType = error.response.headers["content-type"]
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const message = error.response.data["msg"]
        window.$message.warning(message, {
          icon: () => h(NIcon, null, { default: () => h(BugReportOutlined) }),
          duration: 10000,
          keepAliveOnHover: true,
        })
      }
    }
    return Promise.reject(error)
  }

  // 未知错误
  console.error("unknown response error", error)
  return Promise.reject(error)
}

request.interceptors.response.use(responseSuccess, responseFailed)

export default request
