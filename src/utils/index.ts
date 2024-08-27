export * from "./date"
export * from "./render"
export * from "./string"

/**
 * 获取 assets 静态资源
 * @param path 资源相对于assets目录的路径
 * @returns 完整资源路径
 */
export function useAssetUrl(path: string): string {
  return new URL(`../assets/${path}`, import.meta.url).href
}

/**
 * 判断是否支持 OffscreenCanvas
 * @returns 是否支持
 */
export function isOffscreenCanvasWorking() {
  try {
    return Boolean(new OffscreenCanvas(1, 1).getContext("2d"))
  } catch {
    return false
  }
}
