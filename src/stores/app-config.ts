import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAppConfig = defineStore(
  'app-config',
  () => {
    return {
      isLoggedIn: ref(false),
      isDarkMode: ref(false),
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
