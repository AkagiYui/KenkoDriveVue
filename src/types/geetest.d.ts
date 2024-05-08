declare interface Window {
  initGeetest4: (
    options: GeetestConfig,
    callback: (captchaObj: Geetest) => void,
  ) => void
}

type GeetestComponent = {
  validate(onFail?: (w: GeetestFailInfo) => void): Promise<GeetestSuccessInfo>
}

type GeetestConfig = {
  captchaId: string
  product?: "popup" | "float" | "bind"
  nativeButton?: { width: string; height: string }
  rem?: number
  language?:
    | "zho"
    | "eng"
    | "zho-tw"
    | "zho-hk"
    | "udm"
    | "jpn"
    | "ind"
    | "kor"
    | "rus"
    | "ara"
    | "spa"
    | "pon"
    | "por"
    | "fra"
    | "deu"
  protocol?: "http://" | "https://"
  timeout?: number
  hideBar?: string["close" | "refresh"]
  mask?: { outside: boolean; bgColor: string }
  apiServers?: string[]
  nextWidth?: string
  riskType?: string
  hideSuccess?: boolean
  offlineCb?: () => void
  onError?: () => void
  userInfo?: string
}

type Geetest = {
  appendTo(selector: string | HTMLElement)
  getValidate(): GeetestSuccessInfo
  reset(cb: () => void)
  showCaptcha()
  onReady(cb: () => void)
  onNextReady(cb: () => void)
  onSuccess(cb: () => void)
  onFail(cb: (e: GeetestFailInfo) => void)
  onError(cb: (e: GeetestErrorInfo) => void)
  onClose(cb: () => void)
  destroy(cb: () => void)

  $_BAGv: number
  $_BAHl: boolean
  isOffline(): boolean
  onBoxShow(cb: () => void)
  showBox()
  uploadExtraData(e: any, t: any)
}

type GeetestFailInfo = {
  captchaId: string
  captchaType: string
  challenge: any
  failCount: number
  lotNumber: string
}

type GeetestSuccessInfo = {
  captcha_id?: string // 仅在在线模式下存在
  isOffline?: boolean // 仅在离线模式下存在
  captcha_output: string
  gen_time: string
  lot_number: string
  pass_token: string
}

type GeetestErrorInfo = {
  code: string
  msg: string
  desc: { detail: string }
}
