/**
 * 分页数据
 */
interface Page<T> {
  index: number
  size: number
  pageCount: number
  itemCount: number
  list: T[]
}
