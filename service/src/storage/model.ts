import type { ObjectId } from 'mongodb'

class UserInfo {
  _id: ObjectId
  token: string
  times: number
  mac: string
  macAuth: boolean
  createTime: string
  verifyTime?: string
  constructor(token: string, times: number, macAuth = false) {
    this.token = token
    this.times = times
    this.mac = ''
    this.macAuth = macAuth
    this.createTime = new Date().toLocaleString()
    this.verifyTime = null
  }
}

export { UserInfo }
