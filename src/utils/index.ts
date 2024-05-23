/**
 * 获取 assets 静态资源
 * @param path 资源相对于assets目录的路径
 * @returns 完整资源路径
 */
export function useAssetUrl(path: string): string {
  return new URL(`../assets/${path}`, import.meta.url).href
}
