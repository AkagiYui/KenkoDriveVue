/**
 * 路由配置
 */

import { createRouter, createWebHistory } from "vue-router/auto"
import { useAppConfig } from "@/stores/app-config"
import { useUserInfo } from "@/stores/user-info"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
})

// 路由守卫
router.beforeEach((to, from) => {
  const config = useUserInfo()
  // 未登录则跳转到登录页
  if (!config.isLoggedIn && to.name !== "login") {
    return { name: "login" }
  }
  // 已登录则取消路由
  if (config.isLoggedIn && to.name === "login") {
    window.$message.success("您已登录")
    return from.name ? false : { name: "home" }
  }
  // 需要登录的页面
  if (to.meta.requiresAuth && !config.isLoggedIn) {
    window.$message.error("请先登录")
    return { name: "login" }
  }

  // 返回 false 以取消导航
  return true
})

// 显示加载条
router.beforeEach(async () => {
  window.$loadingbar.start()
})

router.afterEach((to) => {
  if (to.name === "404") {
    window.$loadingbar.error()
  } else {
    window.$loadingbar.finish()
  }

  // 修改标题
  const baseTitle = "Kenko Drive"
  const subTitle: string = (to.meta.title as string)?.trim() || ""
  document.title = subTitle ? `${subTitle} | ${baseTitle}` : baseTitle
})

router.afterEach(async (to: any) => {
  // 修改当前路由名称
  const config = useAppConfig()
  config.currentRouteName = to.name
})

router.onError((error: any) => {
  window.$loadingbar.error()
  console.log("router error", error)
})

router.isReady().then(() => {
  // 初始化完成，跳转到历史路由
  // 路由到一个不存在的路由时，在跳转到404View后，路由还会发生一次变化，导致后退按钮要点击两次才能返回上一个路由
  // const config = useAppConfig()
  // router.replace({ name: config.currentRouteName ?? 'home' })
})
export default router
