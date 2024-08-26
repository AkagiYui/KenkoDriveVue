/**
 * 入口文件，创建Vue实例并挂载到DOM上
 */

import { createApp } from "vue"
import { createPinia } from "pinia"
import mitt from "mitt"
import piniaPersist from "pinia-plugin-persistedstate"
import VueDOMPurifyHTML from "vue-dompurify-html"
import "normalize.css/normalize.css"
import "./assets/Lato.css"
import App from "./App.vue"
import router from "./router"

const pinia = createPinia()
pinia.use(piniaPersist)

const app = createApp(App)
app.use(pinia)
app.use(router)
app.use(VueDOMPurifyHTML)

// Catch unhandled errors.
app.config.errorHandler = (err) => {
  // 如果是[[{message: string, fieldValue: any, field: string}], ...], 则为表单验证错误，不提示
  if (Array.isArray(err) && err.length > 0 && Array.isArray(err[0]) && err[0].length > 0 && err[0][0].message) {
    return
  }

  console.error("Vue Error Handler", err)
}

// Catch unhandled rejections.
window.addEventListener("unhandledrejection", (event) => {
  const err = event.reason
  // 如果是[[{message: string, fieldValue: any, field: string}], ...], 则为表单验证错误，不提示
  if (Array.isArray(err) && err.length > 0 && Array.isArray(err[0]) && err[0].length > 0 && err[0][0].message) {
    return
  }

  console.error("Unhandled Rejection", event.reason)
})

function injectUmami() {
  // 读取环境变量
  const url = import.meta.env.VITE_UMAMI_SCRIPT_URL
  const id = import.meta.env.VITE_UMAMI_WEBSITE_ID

  // 创建一个新的script元素
  const script = document.createElement("script")
  script.async = true
  script.src = url
  script.setAttribute("data-website-id", id)
  // 将script标签添加到document的head中
  document.head.appendChild(script)
}

// 仅在生产环境中注入umami统计脚本
if (import.meta.env.PROD) {
  injectUmami()
} else {
  console.debug("Development mode")
}

function createGeetest(): GeetestComponent {
  let geetest: Geetest
  // 注入极验验证码脚本
  const script = document.createElement("script")
  script.src = "/gt4.js"
  script.onload = () => {
    window.initGeetest4(
      {
        language: "zho",
        captchaId: import.meta.env.VITE_GEETEST_CAPTCHA_ID,
        product: "bind",
        hideSuccess: true,
      },
      (e) => {
        e.onReady(() => (geetest = e))
      },
    )
  }
  document.head.appendChild(script)
  return {
    validate: async (onFail: (w: GeetestFailInfo) => void = () => {}): Promise<GeetestSuccessInfo> => {
      if (!geetest) {
        throw new Error("geetest not ready")
      }

      return new Promise<GeetestSuccessInfo>((resolve, reject) => {
        geetest.onSuccess(() => resolve(geetest.getValidate()))
        geetest.onFail(onFail)
        geetest.onError(reject)
        geetest.showCaptcha()
      })
    },
  }
}

app.config.globalProperties.$geetest = createGeetest()
app.config.globalProperties.$bus = mitt()

app.mount("#app")

const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.log(entry)
  }
})

observer.observe({ entryTypes: ["longtask"] })
