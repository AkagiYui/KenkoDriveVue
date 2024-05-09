import { computed, type ComputedRef } from "vue"

/**
 * 执行函数结果带缓存
 * 需要耗时的函数计算，并且需要传参
 * 为避免每次传参都需要重新航计算，可以用该函数缓存结果
 *
 * https://www.bilibili.com/video/av1452457695
 * https://space.bilibili.com/527256540
 */
const useComputedFn = <T>(
  fn: (...args: unknown[]) => T,
): ((...args: unknown[]) => ComputedRef<T>) => {
  const cache: Map<string, ComputedRef<T>> = new Map()
  return (...args: unknown[]) => {
    const cacheKey = JSON.stringify(args)
    // 如果缓存中有该结果，直接返回缓存
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey) as ComputedRef<T>
    }
    //如果缓存中没有该结果，计算结果并缓存
    const result = computed(() => fn(...args))
    cache.set(cacheKey, result)
    return result
  }
}

export default useComputedFn
