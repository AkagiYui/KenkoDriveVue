/// <reference types="vite/client" />

declare interface Window {
  $message: MessageApiInjection
  $dialog: DialogApiInjection
  $loadingbar: LoadingBarInst
  $notify: NotificationApiInjection
}

interface ImportMetaEnv {
  readonly BACKEND_URL: string;
}

// eslint-disable-next-line no-unused-vars
interface ImportMeta {
  readonly env: ImportMetaEnv
}

/** 项目版本号 */
declare const APP_VERSION: string;

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const vueComponent: DefineComponent<{}, {}, any>
  export default vueComponent
}
