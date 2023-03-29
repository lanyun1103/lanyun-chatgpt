import os from 'os'
import express from 'express'
import type { ChatContext, ChatMessage } from './chatgpt'
import { chatConfig, chatReplyProcess } from './chatgpt'
import { createUser, getUser, updateMac, updateTimes } from './storage/mongo'
import { uuid } from './utils'

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

    const uuid4User = uuid()
    // 非付费用户
    if (user.macAuth)
      await updateMac(token, uuid4User)

    const times: number = user.times
    if (times === 0)
      throw new Error('您的剩余次数为0 | Secret key is invalid')
    res.send({ status: 'Success', message: 'Verify successfully', data: uuid4User })
  }
  catch (error) {
    res.send({ status: 'Fail', message: error.message, data: null })
  }
})
router.post('/add-user', async (req, res) => {
  try {
    const { times, macAuth } = req.body as { times: number; macAuth: boolean }
    if (!times)
      throw new Error('Secret key is empty')

    if (times === 0)
      throw new Error('数字无效 | Secret key is invalid')
    const user = await createUser(times, macAuth)
    // const times = user.data.times
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
