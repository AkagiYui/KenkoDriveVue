// 获取 assets 静态资源
export default (url: string): string => {
  return new URL(`../assets/${url}`, import.meta.url).href
}
