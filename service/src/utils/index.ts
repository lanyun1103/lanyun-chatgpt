interface SendResponseOptions {
  type: 'Success' | 'Fail'
  message?: string
  data?: any
}

export function sendResponse(options: SendResponseOptions) {
  if (options.type === 'Success') {
    return Promise.resolve({
      message: options.message ?? null,
      data: options.data ?? null,
      status: options.type,
    })
  }

  // eslint-disable-next-line prefer-promise-reject-errors
  return Promise.reject({
    message: options.message ?? 'Failed',
    data: options.data ?? null,
    status: options.type,
  })
}
export function generateToken(): string {
  const length = 8
  const chars = '0123456789'
  let token = ''
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length)
    token += chars.charAt(randomIndex)
  }
  return token
}
export function generateGPT4(): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < 16; i++)
    result += characters.charAt(Math.floor(Math.random() * characters.length))

  return `gpt4-${result}`
}

/**
 * 生成uuid
 */
export function uuid() {
  let uuidValue = ''
  let k
  let randomValue
  for (k = 0; k < 32; k++) {
    randomValue = Math.random() * 16 | 0

    if (k === 8 || k === 12 || k === 16 || k === 20)
      uuidValue += '-'

    uuidValue += (k === 12 ? 4 : (k === 16 ? (randomValue & 3 | 8) : randomValue)).toString(16)
  }
  return uuidValue
}
