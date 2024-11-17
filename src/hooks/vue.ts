import { computed, getCurrentInstance, ref } from "vue"
import type { ComputedRef } from "vue"

/**
 * 获取Vue全局属性
 * @returns Vue全局属性对象
 */
export const useGlobal = (() => {
  let cache
  return () => {
    if (!cache) {
      const instance = getCurrentInstance()
      if (!instance) {
        throw new Error("useGlobal must be called within a setup function")
      }
      cache = instance?.appContext.config.globalProperties
    }
    return cache
  }
})()

/**
 * 执行函数结果带缓存
 * 需要耗时的函数计算，并且需要传参
 * 为避免每次传参都需要重新航计算，可以用该函数缓存结果
 *
 * https://www.bilibili.com/video/av1452457695
 * https://space.bilibili.com/527256540
 * @param fn 需要缓存的函数
 * @returns 带缓存的函数
 */
export function useComputedFn<T>(fn: (...args: unknown[]) => T): (...args: unknown[]) => ComputedRef<T> {
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

/**
 * 可重置的ref
 * 
 * https://www.bilibili.com/video/av113470167064388
 * @param fn 生成响应式对象的函数
 * @returns [state, reset] 返回状态和重置函数
 */
export function useResettableRefFn<T>(fn: () => T) {
  const state = ref<T>(fn())
  const reset = () => {
    state.value = fn()
  }
  return [state, reset] as const
}

/**
 * 可重置的reactive
 * 
 * @param fn 生成响应式对象的函数
 * @returns [state, reset] 返回状态和重置函数
 */
export function useResettableReactiveFn<T extends object>(fn: () => T) {
  const state = reactive<T>(fn())
  const reset = () => {
    Object.keys(state).forEach(key => delete state[key])
    Object.assign(state, fn())
  }
  return [state, reset] as const
}
