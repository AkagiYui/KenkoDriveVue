/// <reference types="vite/client" />

// eslint-disable-next-line @typescript-eslint/no-unused-vars

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
