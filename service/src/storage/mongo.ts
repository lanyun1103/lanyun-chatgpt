import { MongoClient } from 'mongodb'
import { generateToken } from '../utils'
import { UserInfo } from './model'

const url = process.env.MONGODB_URL
const client = new MongoClient(url)
const userCol = client.db('chatgpt').collection('user')

export async function createUser(times: number) {
  const token = generateToken()
  const userInfo = new UserInfo(token, times)
  await userCol.insertOne(userInfo)
  return userInfo
}
export async function getUser(token: string) {
  return await userCol.findOne({ token })
}

/**
 * 通过 token 更新用户绑定 mac 地址
 * @param token
 * @param newMac
 */
export async function updateMac(token: string, newMac: string[]) {
  return await userCol.findOneAndUpdate(
    { token },
    { $set: { macAddress: newMac } },
  )
}
export async function updateTimes(token: string) {
  const user = await userCol.findOne({ token })
  if (!user)
    throw new Error(`User not found with token ${token}`)

  const updatedUser = { ...user, times: user.times !== 0 ? user.times - 1 : user.times }
  await userCol.updateOne({ token }, { $set: updatedUser })
  return updatedUser
}
