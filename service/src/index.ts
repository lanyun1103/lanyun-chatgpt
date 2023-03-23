import os from 'os'
import express from 'express'
import type { ChatContext, ChatMessage } from './chatgpt'
import { chatConfig, chatReplyProcess } from './chatgpt'
import { createUser, getUser, updateMac, updateTimes } from './storage/mongo'

const app = express()
const router = express.Router()

app.use(express.static('public'))
app.use(express.json())

app.all('*', (_, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'authorization, Content-Type')
  res.header('Access-Control-Allow-Methods', '*')
  next()
})

router.post('/chat-process', async (req, res) => {
  res.setHeader('Content-type', 'application/octet-stream')
  try {
    const { prompt, options = {} } = req.body as { prompt: string; options?: ChatContext }
    const authHeader = req.headers.authorization

    // 检查header是否存在
    if (!authHeader) {
      res.status(401).json({ error: 'Authorization header is missing' })
      return
    }
    let firstChunk = true
    await chatReplyProcess(prompt, options, (chat: ChatMessage) => {
      res.write(firstChunk ? JSON.stringify(chat) : `\n${JSON.stringify(chat)}`)
      firstChunk = false
    })
  }
  catch (error) {
    res.write(JSON.stringify(error))
  }
  finally {
    res.end()
  }
})

router.post('/config', async (req, res) => {
  try {
    const response = await chatConfig()
    res.send(response)
  }
  catch (error) {
    res.send(error)
  }
})
router.post('/get-mac', async (req, res) => {
  try {
    const interfaces = os.networkInterfaces()
    const macAddresses = new Set()

    Object.keys(interfaces).forEach((iface) => {
      interfaces[iface].forEach((address) => {
        if (address.mac && address.mac !== '00:00:00:00:00:00')
          macAddresses.add(address.mac)
      })
    })

    res.send(Array.from(macAddresses))
  }
  catch (error) {
    res.send(error)
  }
})

router.post('/session', async (req, res) => {
  try {
    const AUTH_SECRET_KEY = process.env.AUTH_SECRET_KEY
    const hasAuth = typeof AUTH_SECRET_KEY === 'string' && AUTH_SECRET_KEY.length > 0
    res.send({ status: 'Success', message: '', data: { auth: hasAuth } })
  }
  catch (error) {
    res.send({ status: 'Fail', message: error.message, data: null })
  }
})

router.post('/verify', async (req, res) => {
  try {
    const { token } = req.body as { token: string }
    if (!token)
      throw new Error('Secret key is empty')

    const user = await getUser(token)

    if (user === null)
      throw new Error('当前密钥不存在 | Secret key is invalid')

    // 用户绑定mac
    const macAddresses = user.mac.split(',')

    // 用户当前设备 mac 地址
    const interfaces = os.networkInterfaces()
    const macAddress = Object.keys(interfaces).map(ifname =>
      interfaces[ifname].find(addr => addr.family === 'IPv4' && !addr.internal)?.mac,
    ).filter(Boolean)

    // 非付费用户，没有存mac
    if (user.macAuth && user.mac === '')
      await updateMac(token, macAddress)

    // 验证
    const hasMatchingMacAddress: boolean = macAddress.some(address => macAddresses.includes(address))
    // 不匹配
    if (!hasMatchingMacAddress)
      throw new Error('当前设备未通过验证！新设备请重新购买授权码')
    const times = user.times
    if (times === 0)
      throw new Error('您的剩余次数为0 | Secret key is invalid')
    // if (process.env.AUTH_SECRET_KEY !== token)
    //   throw new Error('密钥无效 | Secret key is invalid')
    res.send({ status: 'Success', message: 'Verify successfully', data: null })
  }
  catch (error) {
    res.send({ status: 'Fail', message: error.message, data: null })
  }
})
router.post('/add-user', async (req, res) => {
  try {
    const { times } = req.body as { times: number }
    if (!times)
      throw new Error('Secret key is empty')

    if (times === 0)
      throw new Error('数字无效 | Secret key is invalid')
    const user = await createUser(times)
    // const times = user.data.times
    // if (process.env.AUTH_SECRET_KEY !== token)
    //   throw new Error('密钥无效 | Secret key is invalid')
    res.send({ status: 'Success', message: `${user.token} ${user.times}`, data: null })
  }
  catch (error) {
    res.send({ status: 'Fail', message: error.message, data: null })
  }
})
router.post('/cut-time', async (req, res) => {
  try {
    const { token } = req.body as { token: string }
    const user = await updateTimes(token)
    res.send({ status: 'Success', message: '更新成功', data: null })
  }
  catch (error) {
    res.send({ status: 'Fail', message: error.message, data: null })
  }
})

router.post('/get-user', async (req, res) => {
  try {
    const { token } = req.body as { token: string }
    const user = await getUser(token)
    res.send({ status: 'Success', message: '查询成功', data: user })
  }
  catch (error) {
    res.send({ status: 'Fail', message: error.message, data: null })
  }
})

app.use('', router)
app.use('/api', router)

app.listen(3002, () => globalThis.console.log('Server is running on port 3002'))
