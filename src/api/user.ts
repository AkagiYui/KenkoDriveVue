import Request from './request'

export function getAllUser() {
  return Request.get(`/user`)
}
