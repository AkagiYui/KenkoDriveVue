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

    return { isLoggedIn, isDarkMode, isMenuCollapsed, currentRouteName, toggleDarkMode }
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
