import { NIcon } from "naive-ui"
import { BugReportOutlined } from "@vicons/material"
import { useUserInfo } from "@/stores/user-info"
import { hasText } from "@/utils"
import EMD from "./ResponseMessages"

const isDev = import.meta.env.DEV
export const baseConfig = {
  baseURL: isDev ? "/api" : import.meta.env.VITE_BACKEND_BASE_URL,
  timeout: 10000,
  withCredentials: false,
}
const getToken = () => useUserInfo().requestToken

// 请求前回调
function onBeforeRequest(config: RequestConfig): boolean | void {
  console.log("onBeforeRequest", config)
  if (config.showLoading !== false) {
    window.$loadingbar.start()
  }
}
// 请求正常完成后回调，无论成功或失败
function onAfterResponse(response: KResponse<any>, config: RequestConfig) {
  console.log("onAfterResponse", response, config)
  // 如果有code/msg/data字段，取消外层的 data 包裹
  if (response.headers["content-type"]?.includes("json")) {
    const data = response.data
    if (data.code !== undefined && data.msg !== undefined && data.data !== undefined) {
      response.data = data.data
    }
  }
  if (response.status == 200) {
    config.showLoading !== false && window.$loadingbar.finish()
  } else {
    window.$loadingbar.error()
    if (response.status === 401) {
      window.$message.error("登录超时，请重新登录")
    } else if (response.status === 403) {
      window.$message.error("无权限")
    } else if (response.status === 404) {
      window.$message.error("请求错误")
    } else if (response.status === 500) {
      window.$message.error("网络异常")
    } else if (response.status === 400) {
      const contentType = response.headers["content-type"]
      if (contentType && contentType.includes("application/json")) {
        const data = response.data
        if (data.code !== undefined && data.msg !== undefined && data.data !== undefined) {
          // 业务异常
          const data = response.data
          const code = data.code
          window.$message.error(EMD[code] || isDev ? data.msg : "未知错误")

          if (isDev) {
            window.$message.warning(data.msg, {
              icon: () => h(NIcon, null, { default: () => h(BugReportOutlined) }),
              duration: 10000,
              keepAliveOnHover: true,
            })
          }
        }
      }
    }
  }
}
// 请求失败后回调
function onErrorResponse(config: RequestConfig) {
  console.log("onErrorResponse", config)
  if (config.showLoading !== false) {
    window.$loadingbar.error()
  }
}

function request<T>(config: RequestConfig): Promise<KResponse<T>> {
  // 请求前回调
  if (onBeforeRequest(config) === false) {
    return Promise.reject("canceled")
  }

  // 构造请求头
  const headers = config.headers || {}
  if (config.auth !== false && hasText(getToken())) {
    headers["Authorization"] = `Bearer ${getToken()}`
  }

  if (config.data instanceof FormData) {
    config.dataType = "form"
  }
  if (config.dataType === undefined) {
    config.dataType = "json"
  }
  if (config.dataType === "json") {
    headers["Content-Type"] = "application/json"
  } else if (config.dataType === "form") {
    // headers["Content-Type"] = "multipart/form-data"
    // 此处不可设置Content-Type，否则会覆盖boundary，导致表单数据无法解析
  } else if (config.dataType === "text") {
    headers["Content-Type"] = "text/plain"
  } else if (config.dataType === "url") {
    headers["Content-Type"] = "application/x-www-form-urlencoded"
  } else {
    // 此处应该抛出异常
  }

  // 构造URL
  const baseURL = baseConfig.baseURL
  const urlObject = new URL(
    baseURL.startsWith("/") ? `${baseURL}${config.url}` : config.url || "",
    baseURL.startsWith("/") ? window.location.origin : baseConfig.baseURL,
  )
  if (config.params) {
    Object.keys(config.params).forEach((key) => {
      urlObject.searchParams.append(key, config.params![key])
    })
  }
  const url = urlObject.toString()

  // 构造请求体
  let body: any = config.data
  if (config.dataType === "text") {
    body = typeof config.data === "object" ? JSON.stringify(config.data) : config.data
  } else if (config.dataType === "url") {
    body = new URLSearchParams(config.data)
  } else if (config.dataType === "form") {
    if (config.data instanceof FormData) {
      body = config.data
    } else if (config.data) {
      const formData = new FormData()
      Object.keys(config.data).forEach((key) => {
        formData.append(key, config.data![key])
      })
      body = formData
    }
  } else if (config.dataType === "json") {
    body = JSON.stringify(config.data)
  }

  // 发送请求
  const timeout = config.timeout || baseConfig.timeout
  const withCredentials = config.withCredentials || baseConfig.withCredentials
  const xhr = new XMLHttpRequest()
  xhr.open(config.method || "GET", url, true)
  xhr.timeout = timeout
  xhr.withCredentials = withCredentials
  xhr.responseType = config.responseType || "json"
  Object.keys(headers).forEach((key) => {
    xhr.setRequestHeader(key, headers[key])
  })
  if (config.onUploadProgress) {
    xhr.upload.onprogress = (e) => {
      config.onUploadProgress?.({ loaded: e.loaded, total: e.total })
    }
  }
  if (config.onDownloadProgress) {
    xhr.onprogress = (e) => {
      config.onDownloadProgress?.({ loaded: e.loaded, total: e.total })
    }
  }

  xhr.send(body)

  return new Promise((resolve, reject) => {
    xhr.onload = () => {
      const headers: Record<string, string> = {}
      xhr
        .getAllResponseHeaders()
        .split("\r\n")
        .forEach((header) => {
          const [key, value] = header.split(": ")
          headers[key.toLowerCase()] = value
        })

      if (xhr.responseType === "json" && !headers["content-type"]?.includes("json")) {
        console.log("responseType is json, but Content-Type is not json")
      }
      const body = xhr.responseType === "" || xhr.responseType === "text" ? xhr.responseText : xhr.response
      const response: KResponse<T> = {
        data: body,
        status: xhr.status,
        statusText: xhr.statusText,
        headers: headers,
      }
      try {
        onAfterResponse(response, config)
      } catch (error) {
        console.error("onAfterResponse error", error)
        reject(error)
        return
      }
      resolve(response)
    }
    xhr.onerror = (ev) => {
      onErrorResponse(config)
      reject(xhr.statusText)
    }
    xhr.ontimeout = () => {
      onErrorResponse(config)
      reject("timeout")
    }
  })
}

export default {
  get: <T = void>(url: string, config?: RequestConfig) => request<T>({ ...config, url, method: "GET" }),
  post: <T = void>(url: string, config?: RequestConfig) => request<T>({ ...config, url, method: "POST" }),
  put: <T = void>(url: string, config?: RequestConfig) => request<T>({ ...config, url, method: "PUT" }),
  delete: <T = void>(url: string, config?: RequestConfig) => request<T>({ ...config, url, method: "DELETE" }),
}
