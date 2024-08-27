export * from "./naive-ui"
export * from "./bus"
export * from "./vue"

/**
 * 使用事件监听
 * @param target 事件目标
 * @param event 事件名称
 * @param callback 事件回调
 */
export function useEventListener(target: EventTarget, event: string, callback: EventListenerOrEventListenerObject) {
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

/**
 * 防抖
 * @param callback 回调
 * @param delay 延迟(ms)
 */
export function useDebounce(callback: () => void, delay: number) {
  let timer: ReturnType<typeof setTimeout>
  return () => {
    clearTimeout(timer)
    timer = setTimeout(callback, delay)
  }
}
