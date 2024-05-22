/// <reference types="vite/client" />
/// <reference types="unplugin-vue-router/client" />

// 为了确保这个文件被当作一个模块，添加至少一个 `export` 声明
export {}

declare global {
  export interface Window {
    $message: MessageApiInjection
    $dialog: DialogApiInjection
    $loadingbar: LoadingBarInst
    $notify: NotificationApiInjection
  }

  /** 项目版本号 */
  export const __APP_VERSION__: string
}

interface ImportMetaEnv {
  readonly BACKEND_URL: string
}

// eslint-disable-next-line no-unused-vars
interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module "vue" {
  export interface ComponentCustomProperties {
    $geetest: GeetestComponent
  }
}

declare module "vue-router" {
  interface RouteMeta {
    isPlayer?: boolean
  }
}

declare module "default-passive-events" {}
