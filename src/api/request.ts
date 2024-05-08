import { useUserInfo } from "@/stores/user-info"
import axios from "axios"
import { NIcon } from "naive-ui"
import { BugReportOutlined } from "@vicons/material"

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
    if (isDev) {
      console.log("request", config)
    }
    window.$loadingbar.start()
    const userInfo = useUserInfo()
    const token = userInfo.requestToken
    if (token) {
      config.headers["Authorization"] = "Bearer " + token
    }
    return config
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  },
)

function responseSuccess(response: any) {
  // 2xx 范围内的状态码都会触发该函数。
  if (isDev) {
    console.log("response", response)
  }
  window.$loadingbar.finish()
  const contentType = response.headers["content-type"]
  if (contentType && contentType.indexOf("application/json") !== -1) {
    response.data = response.data["data"]
  }
  return response
}

// 超出 2xx 范围的状态码都会触发该函数。
function responseFailed(error: any) {
  window.$loadingbar.error()
  if (error.code === "ECONNABORTED") {
    return Promise.reject(Error("请求超时"))
  }
  const statusCode = error.response?.status
  if (statusCode === 401) {
    // 未认证，删除token并跳转到登录页
    // ! todo 如果用户在编辑内容时，会丢失编辑内容，需要提示用户
    const { deleteToken } = useUserInfo()
    deleteToken()
  } else if (statusCode === 403) {
    // 无权限
    window.$message.error("无权限")
  } else if (statusCode === 400) {
    // 参数错误、业务异常
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
  } else {
    console.log("response error", error)
  }

  return Promise.reject(error)
}

request.interceptors.response.use(responseSuccess, responseFailed)

export default request
