import type { ObjectId } from 'mongodb'

class UserInfo {
  _id: ObjectId
  token: string
  times: number
  macAuth: boolean
  createTime: string
  verifyTime?: string
  constructor(token: string, times: number, macAuth = false) {
    this.token = token
    this.times = times
    this.macAuth = macAuth
    this.createTime = new Date().toLocaleString()
    this.verifyTime = null
  }
}

export { UserInfo }
