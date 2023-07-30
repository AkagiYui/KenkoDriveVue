import ServiceStatus from '@/types/ServiceStatus'
import { ExistException } from '@/types/ServiceException'
import { useUserInfo } from '@/stores/user-info'
import axios from 'axios'

const request = axios.create({
  baseURL: import.meta.env.BACKEND_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

request.interceptors.request.use(
  (config) => {
    window.$loadingbar.start()
    const userInfo = useUserInfo()
    const token = userInfo.requestToken
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token
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

    const contentType = response.headers['content-type']
    if (contentType && contentType.indexOf('application/json') !== -1) {
      const code: number = response.data['code']
      if (code !== ServiceStatus.SUCCESS) {
        // 发生业务错误
        window.$loadingbar.error()
        console.error('response error', response.data)
        switch (code) {
          case ServiceStatus.EXIST:
            throw new ExistException()
          default:
            throw new Error(response.data['message'])
        }
      } else {
        window.$loadingbar.finish()
      }
      response.data = response.data['data']
    } else {
      window.$loadingbar.finish()
    }
    return response
  },
  (error) => {
    // 超出 2xx 范围的状态码都会触发该函数。
    window.$loadingbar.error()

    if (error.code === 'ECONNABORTED') {
      throw new Error('请求超时')
    }
    console.log('response error', error)
    return Promise.reject(error)
  },
)

export default request
