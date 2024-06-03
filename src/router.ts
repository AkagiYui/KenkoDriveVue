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
  // 显示加载条
  window.$loadingbar.start()

  const { isLoggedIn } = useUserInfo()
  // 已登录则返回或跳转到首页
  if (isLoggedIn && to.name === "login") {
    return from.name ? false : { name: "home" }
  }
  // 需要登录的页面
  if (to.meta.requireAuth && !isLoggedIn) {
    window.$message.error("未登录")
    return { name: "login" }
  }

  // 返回 false 以取消导航
  return true
})

router.afterEach((to) => {
  // 修改标题
  const baseTitle = "Kenko Drive"
  const subTitle: string = (to.meta.title as string)?.trim() || ""
  document.title = subTitle ? `${subTitle} | ${baseTitle}` : baseTitle

  // 记录当前路由名称
  useAppConfig().currentRouteName = to.name

  // 隐藏加载条
  const bar = window.$loadingbar
  const state = to.name === "404" ? bar.error : bar.finish
  state()
})

router.onError((error: any) => {
  window.$loadingbar.error()
  console.error("router error", error)
})

router.isReady().then(() => {
  // 初始化完成，跳转到历史路由
  // 路由到一个不存在的路由时，在跳转到404View后，路由还会发生一次变化，导致后退按钮要点击两次才能返回上一个路由
  // const config = useAppConfig()
  // router.replace({ name: config.currentRouteName ?? 'home' })
})
export default router
