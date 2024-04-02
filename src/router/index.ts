import { createRouter, createWebHistory } from "vue-router"
import { useAppConfig } from "@/stores/app-config"
import { useUserInfo } from "@/stores/user-info"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "console",
      component: () => import("../views/ConsoleView.vue"),
      meta: {
        title: "控制台",
        requiresAuth: true,
      },
      children: [
        {
          path: "/",
          name: "home",
          component: () => import("../views/HomeView.vue"),
          meta: {
            title: "主页",
          },
        },
        {
          path: "/files",
          name: "file",
          component: () => import("../views/FilesView/FilesView.vue"),
          meta: {
            title: "文件",
          },
        },
        {
          path: "/about",
          name: "about",
          component: () => import("../views/AboutView.vue"),
          meta: {
            title: "关于",
          },
        },
        {
          path: "/settings",
          name: "settings",
          component: () => import("../views/SettingsView.vue"),
          meta: {
            title: "设置",
          },
        },
        {
          path: "/test",
          name: "test",
          component: () => import("../views/TestView.vue"),
          meta: {
            title: "测试",
          },
        },
        {
          path: "/users",
          name: "users",
          component: () =>
            import("../views/AdminViews/UsersView/UsersView.vue"),
          meta: {
            title: "用户信息",
          },
        },
        {
          path: "/roles",
          name: "roles",
          component: () =>
            import("../views/AdminViews/RolesView/RolesView.vue"),
          meta: {
            title: "角色权限",
          },
        },
        {
          path: "/system",
          name: "system",
          component: () => import("../views/AdminViews/SystemStatusView.vue"),
          meta: {
            title: "系统状态",
          },
        },
        {
          path: "/announcements",
          name: "announcements",
          component: () => import("../views/AdminViews/AnnouncementsView.vue"),
          meta: {
            title: "公告管理",
          },
        },
      ],
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../views/LoginView.vue"),
      meta: {
        title: "登录",
      },
    },
    {
      path: "/:pathMatch(.*)*",
      name: "not-found",
      component: () => import("../views/NotFoundView.vue"),
      meta: {
        title: "404",
      },
    },
  ],
})

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

router.afterEach((to: any) => {
  if (to.name === "not-found") {
    window.$loadingbar.error()
  } else {
    window.$loadingbar.finish()
  }

  // 修改标题
  const baseTitle = "Kenko Drive"
  const subTitle: string = to.meta?.title?.trim() || ""
  document.title = subTitle ? `${baseTitle} | ${subTitle}` : baseTitle
})

router.afterEach(async (to: any) => {
  // 修改当前路由名称
  const config = useAppConfig()
  config.currentRouteName = to.name
})

router.onError((error: any) => {
  window.$loadingbar.error()
  console.log(error)
})

router.isReady().then(() => {
  // 初始化完成，跳转到历史路由
  // 路由到一个不存在的路由时，在跳转到404View后，路由还会发生一次变化，导致后退按钮要点击两次才能返回上一个路由
  // const config = useAppConfig()
  // router.replace({ name: config.currentRouteName ?? 'home' })
})
export default router
