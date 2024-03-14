import { ref } from "vue"
import { defineStore } from "pinia"

export const useAppConfig = defineStore(
  "app-config",
  () => {
    const isDarkMode = ref(false)
    const isMenuCollapsed = ref(false)
    const currentRouteName = ref("home")
    const isDebugMode = ref(false)
    const expandedMenuKeys = ref<string[]>([])

    const toggleDarkMode = () => {
      isDarkMode.value = !isDarkMode.value
    }
    const reset = () => {
      isDarkMode.value = false
      isMenuCollapsed.value = false
      currentRouteName.value = ""
      isDebugMode.value = false
      expandedMenuKeys.value = []
    }

    return {
      isDarkMode,
      isMenuCollapsed,
      currentRouteName,
      toggleDarkMode,
      reset,
      isDebugMode,
      expandedMenuKeys,
    }
  },
  {
    persist: {
      storage: localStorage,
    },
  },
)
