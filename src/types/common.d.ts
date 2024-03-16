/** 分页数据 */
interface Page<T> {
  list: T[]
  page: number
  pageCount: number
  size: number
  total: number
}
