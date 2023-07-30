import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { getUserAvatar, getUserInfo } from '@/api/user'

export const useUserInfo = defineStore(
  'user-info',
  () => {
    const requestToken = ref('')
    const tokenExpireTime = ref(0) // 不可用 Date 类型，否则无法持久化
    const userId = ref('')
    const username = ref('')
    const nickname = ref('')
    const email = ref('')
    const avatarUrl = ref('')

    const isLoggedIn = computed(() => {
      if (requestToken.value !== '') {
        if (Date.now() < tokenExpireTime.value) {
          return true
        }
        deleteToken()
      }
      return false
    })

    const setToken = (token: string) => {
      requestToken.value = token
      tokenExpireTime.value = Date.now() + 1000 * 60 * 60 * 2 // 2小时

      renewUserInfo() // 获取用户信息
      renewAvatar() // 获取用户头像
    }
    const deleteToken = () => {
      requestToken.value = ''
      tokenExpireTime.value = 0
      userId.value = ''
      username.value = ''
      nickname.value = ''
      email.value = ''
      avatarUrl.value = ''
    }
    const setAvatar = (imageData: ArrayBuffer) => {
      const imageUrl = URL.createObjectURL(new Blob([imageData], { type: 'imageType' }))
      URL.revokeObjectURL(avatarUrl.value)
      avatarUrl.value = imageUrl
    }
    const renewAvatar = () => {
      if (!isLoggedIn.value) return
      getUserAvatar().then((res) => {
        const data = res.data
        setAvatar(data)
      })
    }
    const renewUserInfo = () => {
      if (!isLoggedIn.value) return
      getUserInfo().then((res) => {
        const data = res.data
        username.value = data.username
        userId.value = data.id
        email.value = data.email
        nickname.value = data.nickname
      })
    }

    return {
      requestToken,
      tokenExpireTime,
      isLoggedIn,
      setToken,
      deleteToken,
      userId,
      username,
      nickname,
      email,
      avatarUrl,
      setAvatar,
      renewAvatar,
      renewUserInfo,
    }
  },
  {
    persist: {
      storage: localStorage,
    },
  },
)
