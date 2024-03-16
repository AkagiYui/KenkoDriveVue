import ServiceStatus from "@/types/ServiceStatus"
import { useUserInfo } from "@/stores/user-info"
import axios from "axios"
import { useRouter } from "vue-router"

const request = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

request.interceptors.request.use(
  (config) => {
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

request.interceptors.response.use(
  (response) => {
    // 2xx 范围内的状态码都会触发该函数。

    const contentType = response.headers["content-type"]
    if (contentType && contentType.indexOf("application/json") !== -1) {
      const code: number = response.data["code"]
      if (code !== ServiceStatus.SUCCESS) {
        // 发生业务错误
        window.$loadingbar.error()
        console.error("response error", response.data)
        switch (code) {
          case ServiceStatus.EXIST:
            throw new ExistException()
          default:
            throw new Error(response.data["message"])
        }
      } else {
        window.$loadingbar.finish()
      }
      response.data = response.data["data"]
    } else {
      window.$loadingbar.finish()
    }
    return response
  },
  (error) => {
    // 超出 2xx 范围的状态码都会触发该函数。
    window.$loadingbar.error()

    if (error.code === "ECONNABORTED") {
      throw new Error("请求超时")
    }
    const statusCode = error.response?.status
    if (statusCode === 401) {
      // 未认证，删除token并跳转到登录页
      // ! todo 如果用户在编辑内容时，会丢失编辑内容，需要提示用户
      const { deleteToken } = useUserInfo()
      deleteToken()
      useRouter().replace("/login")
    }

    console.log("response error", error)
    return Promise.reject(error)
  },
)

export default request
