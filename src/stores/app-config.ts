import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAppConfig = defineStore(
  'app-config',
  () => {
    const isLoggedIn = ref(false)
    const isDarkMode = ref(false)
    const isMenuCollapsed = ref(false)
    const currentRouteName = ref('home')
    const isDebugMode = ref(false)
    const expandedMenuKeys = ref<string[]>([])

    const toggleDarkMode = () => {
      isDarkMode.value = !isDarkMode.value
    }
    const reset = () => {
      isLoggedIn.value = false
      isDarkMode.value = false
      isMenuCollapsed.value = false
      currentRouteName.value = ''
      isDebugMode.value = false
      expandedMenuKeys.value = []
    }

    return {
      isLoggedIn,
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
      enabled: true,
      strategies: [
        {
          storage: localStorage,
        },
      ],
    },
  },
)
