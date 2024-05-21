import { getCurrentInstance } from "vue"

export default function useGlobal() {
  const instance = getCurrentInstance()
  if (!instance) {
    throw new Error("useGlobal must be called within a setup function")
  }

  return instance.appContext.config.globalProperties
}
