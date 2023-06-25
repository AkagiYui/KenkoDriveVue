import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAppConfig = defineStore(
  'app-config',
  () => {
    const isLoggedIn = ref(false)
    const isDarkMode = ref(false)
    const isMenuCollapsed = ref(false)
    const currentRouteName = ref('')

    const toggleDarkMode = () => { isDarkMode.value = !isDarkMode.value }
    const reset = () => {
      isLoggedIn.value = false
      isDarkMode.value = false
      isMenuCollapsed.value = false
      currentRouteName.value = ''
    }

    return { isLoggedIn, isDarkMode, isMenuCollapsed, currentRouteName, toggleDarkMode, reset }
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
