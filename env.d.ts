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
