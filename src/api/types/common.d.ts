/**
 * 分页数据
 * @template T 数据类型
 * @property {T[]} list 数据列表
 * @property {number} page 当前页码
 * @property {number} pageCount 总页数
 * @property {number} size 每页数量
 * @property {number} total 总数量
 */
interface Page<T> {
  list: T[]
  page: number
  pageCount: number
  size: number
  total: number
}

/**
 * 后端接口响应
 * @template T 数据类型
 * @property {number} code 状态码
 * @property {string} msg 消息
 * @property {T} data 数据
 */
interface BackendResponse<T> {
  code: number
  msg: string
  data: T
}

/**
 * 请求响应
 * @template T 数据类型
 */
type RequestResponse<T> = Promise<AxiosResponse<BackendResponse<T>>>
