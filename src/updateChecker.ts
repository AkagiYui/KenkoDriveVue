/**
 * 通过Web Worker实现文件更新检测
 * 1. 主线程向Worker线程发送请求url postMessage({url: url})
 * 2. Worker线程通过fetch请求url，获取响应头中的etag或者last-modified字段作为时间戳
 * 3. Worker线程每隔10分钟请求一次url，获取最新的时间戳
 * 4. Worker线程对比上一次请求的时间戳和最新的时间戳，如果不一致，说明文件发生变化
 * 5. Worker线程向主线程发送消息postMessage(1)
 * 6. 主线程接收到消息后，执行更新逻辑
 * 7. Worker线程清除定时器
 */

let previousTimeTag: string | null // 时间戳，响应头中的etag和last-modified字段其中之一
let url: string // 请求的url
let interval: ReturnType<typeof setInterval> // 轮询的定时器

/** 获取当前最新的时间戳 */
async function getTimeTag() {
  const response = await fetch(url, {
    method: "HEAD",
    cache: "no-cache",
  })
  // 以响应体的etag或者last-modified为时间戳
  return response.headers.get("etag") || response.headers.get("last-modified")
}

/** 判断Tag是否发生变化 */
async function judge() {
  const currentTimeTag = await getTimeTag()
  // 检测到最新请求的时间戳和上一次不一致，即文件发生变化
  if (previousTimeTag !== currentTimeTag) {
    // 更新逻辑
    clearInterval(interval)
    self.postMessage(1)
  }
}

self.onmessage = function (e) {
  const data = e.data
  if ("url" in data) {
    url = data["url"]
    // 立即执行函数，记录首次请求的时间戳，以便与后面轮询得出的时间戳进行对比
    ;(async function () {
      previousTimeTag = await getTimeTag()
      interval && clearInterval(interval)
      // 开启轮询执行judge函数
      interval = setInterval(judge, 10 * 60 * 1000) // 10分钟
    })()
  } else {
    console.error(`Worker got unknown message: ${data}`)
  }
}
