import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserInfo = defineStore(
  'user-info',
  () => {
    const userName = ref('AkagiYui晨曦·懵懂')

    return { userName }
  },
  {
    persist: {
      storage: localStorage,
    },
  },
)
