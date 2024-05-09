/**
 * 通常，我们检测浏览器是通过获取 navigator.userAgent，
 * 但 ua 是可以通过浏览器设置或浏览器插件人为更改的，这种方法就不够准确。
 *
 * https://flapypan.top/notes/web
 */

/**
 * 获取所有 ComputedStyle 检测 CSS 前缀
 */
export function detectBrowserTypeByComputedStyle() {
  const computedStyle = window.getComputedStyle(document.documentElement, "")
  const match = Array.prototype.slice
    .call(computedStyle)
    .join("")
    .match(/-(moz|webkit|ms)-/)
  const prefix = match ? match[1] : ""
  return {
    webkit: prefix === "webkit",
    moz: prefix === "moz",
    ms: prefix === "ms",
    o: prefix === "o",
  }
}

/**
 * 通过 feature 检测浏览器
 */
export function detectBrowserByFeature() {
  // Opera 8.0+
  const isOpera =
    (!!window.opr && !!opr.addons) ||
    !!window.opera ||
    navigator.userAgent.indexOf(" OPR/") >= 0
  // Firefox 1.0+
  const isFirefox = typeof InstallTrigger !== "undefined"
  // Safari 3.0+
  const isSafari =
    /constructor/i.test(window.HTMLElement) ||
    (
      typeof safari !== "undefined" && window["safari"].pushNotification
    ).toString() === "[object SafariRemoteNotification]"
  // Internet Explorer 6-11
  const isIE =
    !!window.ActiveXObject ||
    "ActiveXObject" in window ||
    !!document.documentMode
  // 旧 Edge 20+
  const isEdge = !isIE && !!window.StyleMedia
  // Chrome 1 - 79
  const isChrome = !!window.chrome
  // 新 Edge
  const isEdgeChromium = isChrome && navigator.userAgent.indexOf("Edg") != -1
  // Blink 渲染引擎
  const isBlink = (isChrome || isOpera) && !!window.CSS

  return {
    isOpera,
    isFirefox,
    isSafari,
    isIE,
    isEdge,
    isChrome,
    isEdgeChromium,
    isBlink,
  }
}
