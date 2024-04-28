import { computed, ref } from "vue"
import { useRouter } from "vue-router"
import { defineStore } from "pinia"
import { getUserAvatar, getUserInfo } from "@/api/user"
import type { AxiosResponse } from "axios"
import Permission from "@/types/permission"

export const useUserInfo = defineStore(
  "user-info",
  () => {
    const requestToken = ref("")
    const tokenExpireTime = ref(0) // 不可用 Date 类型，否则无法持久化
    const userId = ref("")
    const username = ref("")
    const nickname = ref("")
    const email = ref("")
    const avatarUrl = ref("")
    const permissions = ref<Permission[]>([])

    const isLoggedIn = computed(() => {
      if (requestToken.value !== "") {
        if (Date.now() < tokenExpireTime.value) {
          return true
        }
        deleteToken()
      }
      return false
    })

    const setToken = (token: string) => {
      requestToken.value = token
      tokenExpireTime.value = Date.now() + 1000 * 60 * 60 * 48 // 48小时

      renewUserInfo() // 获取用户信息
    }
    const deleteToken = () => {
      requestToken.value = ""
      tokenExpireTime.value = 0
      userId.value = ""
      username.value = ""
      nickname.value = ""
      email.value = ""
      avatarUrl.value = ""
    }
    const setAvatar = (imageData: ArrayBuffer) => {
      const imageUrl = URL.createObjectURL(
        new Blob([imageData], { type: "imageType" }),
      )
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
      getUserInfo()
        .then((res) => {
          renewAvatar()
          const data = res.data
          username.value = data.username
          userId.value = data.id
          email.value = data.email
          nickname.value = data.nickname || data.username
          permissions.value = (data.permissions as string[]).map((item) => {
            // TypeScript无法直接将字符串转换为枚举，这里去掉as也能正常运行，但会有类型错误
            return (Permission as Record<string, any>)[item]
          })
        })
        .catch((err) => {
          const code = err.response.status
          if (code === 401) {
            deleteToken()
            router.replace("/login")
          }
        })
    }
    const hasPermission = (permission: Permission) => {
      return permissions.value.includes(permission)
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
      permissions,
      setAvatar,
      renewAvatar,
      renewUserInfo,
      hasPermission,
    }
  },
  {
    persist: {
      storage: localStorage,
      paths: ["requestToken", "tokenExpireTime"],
    },
  },
)
