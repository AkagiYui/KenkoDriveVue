import { computed, ref } from "vue"
import { defineStore } from "pinia"
import { getUserAvatar, getUserInfo } from "@/api"
import { Permission } from "@/types"
import { getJWTExpireTime, hasText } from "@/utils"

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
      const token = requestToken.value
      if (!hasText(token)) {
        return false
      }
      if (tokenExpireTime.value < Date.now() / 1000 + 60 * 60) {
        // 60分钟内过期
        return false
      }
      return true
    })

    /**
     * 设置token，将自动更新用户信息
     * @param token token
     */
    function setToken(token: string) {
      requestToken.value = token
      tokenExpireTime.value = getJWTExpireTime(token)
      renewUserInfo() // 获取用户信息
    }

    /**
     * 清空信息
     */
    function removeInfo() {
      requestToken.value = ""
      tokenExpireTime.value = 0
      userId.value = ""
      username.value = ""
      nickname.value = ""
      email.value = ""
      avatarUrl.value = ""
    }

    /**
     * 设置头像
     * @param imageData 图片数据
     */
    function setAvatar(imageData: ArrayBuffer) {
      const imageUrl = URL.createObjectURL(new Blob([imageData], { type: "imageType" }))
      if (hasText(avatarUrl.value)) {
        URL.revokeObjectURL(avatarUrl.value)
      }
      avatarUrl.value = imageUrl
    }

    /**
     * 更新头像
     */
    function renewAvatar() {
      if (!isLoggedIn.value) return
      getUserAvatar().then((res) => {
        const data = res.data
        setAvatar(data)
      })
    }

    /**
     * 更新用户信息
     * @returns Promise
     */
    function renewUserInfo() {
      return new Promise<void>((_, reject) => {
        if (!isLoggedIn.value) {
          reject()
          return
        }
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
          .catch(() => {
            reject()
          })
      })
    }

    /**
     * 判断是否有权限
     * @param permission 权限
     * @returns 是否有权限
     */
    function hasPermission(permission: Permission) {
      return permissions.value.includes(permission)
    }

    /**
     * 判断是否有所有权限
     * @param permissionList 权限列表
     * @returns 是否有权限
     */
    function hasAllPermissions(...permissionList: Permission[]) {
      return permissionList.every((permission) => permissions.value.includes(permission))
    }

    /**
     * 判断是否有任意权限
     * @param permissionList 权限列表
     * @returns 是否有权限
     */
    function hasAnyPermissions(...permissionList: Permission[]) {
      return permissionList.some((permission) => permissions.value.includes(permission))
    }

    return {
      requestToken,
      tokenExpireTime,
      userId,
      username,
      nickname,
      email,
      avatarUrl,
      permissions,
      isLoggedIn,
      setToken,
      renewAvatar,
      renewUserInfo,
      removeInfo,
      hasPermission,
      hasAllPermissions,
      hasAnyPermissions,
    }
  },
  {
    persist: {
      storage: localStorage,
      paths: ["requestToken", "tokenExpireTime"],
    },
  },
)
