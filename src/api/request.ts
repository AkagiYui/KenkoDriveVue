import axios, { type AxiosRequestConfig, type InternalAxiosRequestConfig } from "axios"
import { NIcon } from "naive-ui"
import { BugReportOutlined } from "@vicons/material"
import { useUserInfo } from "@/stores/user-info"
import { hasText } from "@/utils"
import EMD from "./ResponseMessages"

const isDev = import.meta.env.DEV
export const config = {
  baseURL: isDev ? "/api" : import.meta.env.VITE_BACKEND_BASE_URL,
  timeout: 10000,
}

const request = axios.create(config)
const loginUrl = "/auth/token"

request.interceptors.request.use(
  (config: InternalAxiosRequestConfig & ExtraConfig) => {
    if (config.showLoading !== false) {
      window.$loadingbar.start() // 显示加载条
    }
    const token = useUserInfo().requestToken // 获取token
    if (hasText(token) && config.auth !== false) {
      config.headers["Authorization"] = `Bearer ${token}`
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
  if (response.config.showLoading !== false) {
    window.$loadingbar.finish()
  }
  const contentType = response.headers["content-type"]
  if (contentType && contentType.indexOf("application/json") !== -1) {
    const data = response.data
    // 如果有code/msg/data字段
    if (data.code !== undefined && data.msg !== undefined && data.data !== undefined) {
      // 取消外层的 data 包裹
      response.data = response.data["data"]
    }
  }
  return response
}

// 超出 2xx 范围的状态码都会触发该函数。
function responseFailed(error) {
  if (error.config.showLoading !== false) {
    window.$loadingbar.error()
  }

  // 请求超时
  if (error.code === "ECONNABORTED") {
    return Promise.reject(error)
  }

  const statusCode = error.response?.status

  // 401 未认证
  if (statusCode === 401) {
    if (!error.config.url.startsWith(loginUrl)) {
      window.$message.error("登录超时，请重新登录")
    } else {
      window.$message.error("登录失败，请检查用户名和密码")
    }
    return Promise.reject(error)
  }

  // 403 无权限
  if (statusCode === 403) {
    window.$message.error("无权限")
    return Promise.reject(error)
  }

  // 400 参数错误、业务异常
  if (statusCode === 400) {
    const contentType = error.response.headers["content-type"]
    if (contentType && contentType.indexOf("application/json") !== -1) {
      // 如果code/msg/data字段存在
      if (
        error.response.data.code !== undefined &&
        error.response.data.msg !== undefined &&
        error.response.data.data !== undefined
      ) {
        const data = error.response.data
        const code = data["code"]
        window.$message.error(EMD[code] || "未知错误")

        // 如果是开发环境，弹出额外的错误提示
        if (isDev) {
          const message = data["msg"]
          window.$message.warning(message, {
            icon: () => h(NIcon, null, { default: () => h(BugReportOutlined) }),
            duration: 10000,
            keepAliveOnHover: true,
          })
        }
      }
    }

    return Promise.reject(error)
  }

  // 未知错误
  console.error("unknown response error", error)
  return Promise.reject(error)
}

request.interceptors.response.use(responseSuccess, responseFailed)

type ExtraConfig = {
  auth?: boolean
  showLoading?: boolean
}

const ex = {
  get: <T>(url: string, config?: AxiosRequestConfig & ExtraConfig) => request.get<T>(url, config),
  delete: <T>(url: string, config?: AxiosRequestConfig & ExtraConfig) => request.delete<T>(url, config),
  head: <T>(url: string, config?: AxiosRequestConfig & ExtraConfig) => request.head<T>(url, config),
  options: <T>(url: string, config?: AxiosRequestConfig & ExtraConfig) => request.options<T>(url, config),
  post: <T>(url: string, data?: any, config?: AxiosRequestConfig & ExtraConfig) => request.post<T>(url, data, config),
  put: <T>(url: string, data?: any, config?: AxiosRequestConfig & ExtraConfig) => request.put<T>(url, data, config),
  patch: <T>(url: string, data?: any, config?: AxiosRequestConfig & ExtraConfig) => request.patch<T>(url, data, config),
}

export default ex
