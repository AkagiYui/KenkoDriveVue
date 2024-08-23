type TokenResponse = {
  token: string
  refreshToken: string
}

// interface TemporaryTokenStatus {
//   taken: boolean // 是否已经被取走
//   confirmed: boolean // 是否已经被确认
//   canceled: boolean // 是否已经被取消
//   userId: string?; // 用户ID
//   nickname: string?; // 用户昵称
//   token: TokenResponse? // 二维码token
// }

interface BaseTemporaryTokenStatus {
  taken: boolean
  confirmed: boolean
  canceled: boolean
}

interface UntakenTokenStatus extends BaseTemporaryTokenStatus {
  taken: false
  userId: null
  nickname: null
  token: null
}

interface TakenTokenStatus extends BaseTemporaryTokenStatus {
  taken: true
  userId: string
  nickname: string
  token: TokenResponse
}

type TemporaryTokenStatus = UntakenTokenStatus | TakenTokenStatus

interface ClaimTokenResponse {
  takenToken: string
  nickname: string
  ipRegion: string
}
