import { createApp } from "vue"
import { createPinia } from "pinia"
import piniaPersist from "pinia-plugin-persistedstate"
import "./vfonts/Lato.css"
import "normalize.css/normalize.css"

import App from "./App.vue"
import router from "./router"

const pinia = createPinia()
pinia.use(piniaPersist)

const app = createApp(App)
app.use(pinia)
app.use(router)

// Catch unhandled errors.
app.config.errorHandler = (err) => {
  console.error("Vue Error Handler: " + err)
}

// Catch unhandled rejections.
window.addEventListener("unhandledrejection", (event) => {
  console.error("Unhandled Rejection: " + event.reason)
})

app.mount('#app')
app.mount("#app")
