/// <reference types="vite/client" />

/* eslint-disable no-undef */
declare interface Window {
  $message: MessageApiInjection
  $dialog: DialogApiInjection
  $loadingbar: LoadingBarInst
  $notify: NotificationApiInjection
}

interface ImportMetaEnv {
  readonly BACKEND_URL: string
}

// eslint-disable-next-line no-unused-vars
interface ImportMeta {
  readonly env: ImportMetaEnv
}

/** 项目版本号 */
declare const __APP_VERSION__: string

declare module "*.vue" {
  import type { DefineComponent } from "vue"
  const vueComponent: DefineComponent<{}, {}, any>
  export default vueComponent
}
