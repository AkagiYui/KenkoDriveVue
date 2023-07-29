import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserInfo = defineStore(
  'user-info',
  () => {
    const userName = ref('AkagiYui晨曦·懵懂')
    const requestToken = ref('')
    const tokenExpireTime = ref(0) // 不可用 Date 类型，否则无法持久化
    const isLoggedIn = computed(() => {
      if (requestToken.value !== '') {
        if (Date.now() < tokenExpireTime.value) {
          return true
        }
        requestToken.value = ''
      }
      return false
    })
    const setToken = (token: string) => {
      requestToken.value = token
      tokenExpireTime.value = Date.now() + 1000 * 60 * 60 * 2 // 2小时
    }

    return { userName, requestToken, isLoggedIn, setToken, tokenExpireTime }
  },
  {
    persist: {
      storage: localStorage,
    },
  },
)
