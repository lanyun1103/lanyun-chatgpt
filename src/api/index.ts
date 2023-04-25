import type { AxiosProgressEvent, GenericAbortSignal } from 'axios'
import { post } from '@/utils/request'

export function fetchChatAPI<T = any>(
  prompt: string,
  options?: { conversationId?: string; parentMessageId?: string },
  signal?: GenericAbortSignal,
) {
  return post<T>({
    url: '/chat',
    data: { prompt, options },
    signal,
  })
}

export function fetchChatConfig<T = any>() {
  return post<T>({
    url: '/config',
  })
}

export function fetchChatAPIProcess<T = any>(
  params: {
    prompt: string
    maxModelToken: number
    model: string
    temperature: number
    token: string
    options?: { conversationId?: string; parentMessageId?: string }
    signal?: GenericAbortSignal
    onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void },
) {
  return post<T>({
    url: '/chat-process',
    data: { prompt: params.prompt, options: params.options, maxModelToken: params.maxModelToken, model: params.model, temperature: params.temperature, token: params.token },
    signal: params.signal,
    onDownloadProgress: params.onDownloadProgress,
  })
}

export function fetchSession<T>() {
  return post<T>({
    url: '/session',
  })
}

/**
 * 检查是否可用
 * @param token
 */
export function fetchVerify<T = any>(token: string) {
  return post<T>({
    url: '/verify',
    data: { token },
  })
}
/**
 * 检查是否可用
 * @param token
 */
export function fetchCutTimes<T>(token: string) {
  return post<T>({
    url: '/cut-time',
    data: { token },
  })
}
/**
 * 减少字数
 * @param token
 */
export function fetchReduceTimes<T>(token: string, times: number) {
  return post<T>({
    url: '/reduce-times',
    data: { token, times },
  })
}

/**
 * 获取用户信息
 * @param token
 */
export function fetchGetUser<T = any>(token: string) {
  return post<T>({
    url: '/get-user',
    data: { token },
  })
}
