import type { BusEvent, EventParams } from "@/types"
import { computed, getCurrentInstance } from "vue"
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
export function useComputedFn<T>(
  fn: (...args: unknown[]) => T,
): (...args: unknown[]) => ComputedRef<T> {
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
 * 使用事件总线
 * @returns 事件总线
 */
export function useBusEvent<T extends BusEvent>(
  event: T,
  callback: (...args: EventParams[T]) => void,
) {
  const { $bus } = useGlobal()
  onMounted(() => $bus.on(event, callback as (...args: any[]) => void))
  onUnmounted(() => $bus.off(event, callback as (...args: any[]) => void))
}

/**
 * 发出事件
 */
export function emitBusEvent<T extends BusEvent>(
  event: T,
  ...args: EventParams[T]
) {
  const { $bus } = useGlobal()
  $bus.emit(event, ...args)
}

/**
 * 使用事件监听
 * @param target 事件目标
 * @param event 事件名称
 * @param callback 事件回调
 */
export function useEventListener(
  target: EventTarget,
  event: string,
  callback: EventListenerOrEventListenerObject,
) {
  onMounted(() => target.addEventListener(event, callback))
  onUnmounted(() => target.removeEventListener(event, callback))
}

/**
 * 使用定时器
 * @param callback 定时器回调
 * @param delay 定时器间隔
 * @returns 定时器
 */
export function useInterval(callback: () => void, delay: number) {
  onMounted(() => {
    callback()
    const timer = setInterval(callback, delay)
    onUnmounted(() => clearInterval(timer))
  })
}
