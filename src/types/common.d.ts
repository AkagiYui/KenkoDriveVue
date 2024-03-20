/** 分页数据 */
interface Page<T> {
  list: T[]
  page: number
  pageCount: number
  size: number
  total: number
}

/** 后端接口响应 */
type BackendResponse<T> = {
  code: number
  msg: string
  data: T
}

type RequestResponse<T> = Promise<AxiosResponse<BackendResponse<T>>>
