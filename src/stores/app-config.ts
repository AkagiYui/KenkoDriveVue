import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAppConfig = defineStore(
  'app-config',
  () => {
    const isLoggedIn = ref(false)
    const isDarkMode = ref(false)
    const switchDarkMode = () => {
      isDarkMode.value = !isDarkMode.value
    }

    return { isLoggedIn, isDarkMode, switchDarkMode }
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
