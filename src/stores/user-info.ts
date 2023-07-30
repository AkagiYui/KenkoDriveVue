import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { defineStore } from 'pinia'
import { getUserAvatar, getUserInfo } from '@/api/user'
import type { AxiosResponse } from 'axios'

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
      getUserAvatar().then((res: AxiosResponse) => {
        const data = res.data
        setAvatar(data)
      })
    }
    const renewUserInfo = () => {
      if (!isLoggedIn.value) return
      const router = useRouter()
      getUserInfo().then((res: AxiosResponse) => {
        renewAvatar()
        const data = res.data
        username.value = data.username
        userId.value = data.id
        email.value = data.email
        nickname.value = data.nickname
      }).catch((err) => {
        const code = err.response.status
        if (code === 401) {
          deleteToken()
          router.replace('/login')
        }
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
      paths: ['requestToken', 'tokenExpireTime']
    },
  },
)
