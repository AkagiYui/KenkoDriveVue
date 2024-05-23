import type { BusEvent, EventParams } from "@/types"
import { useGlobal } from "./vue"

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
