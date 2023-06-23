import ServiceStatus from '@/types/ServiceStatus'
import { ExistException } from '@/types/ServiceException'
import axios from 'axios'

const BASE_URL = 'http://localhost:6677'

const request = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

request.interceptors.request.use((config) => {
  window.$loadingbar.start()
  return config
})

request.interceptors.response.use(
  (response) => {
    const code: number = response.data['code']
    if (code !== ServiceStatus.SUCCESS) {
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
    return response
  },
  (error) => {
    window.$loadingbar.error()
    console.log('response error', error)

    if (error.code === 'ECONNABORTED') {
      throw new Error('请求超时')
    }
    throw new Error('网络错误')
  },
)

export default request
