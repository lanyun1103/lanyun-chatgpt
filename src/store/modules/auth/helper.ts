import { ss } from '@/utils/storage'

const LOCAL_NAME = 'SECRET_TOKEN'
const TIMES_RECORD = 'LOCAL_TIMES'

export function getToken() {
  return ss.get(LOCAL_NAME)
}

export function setToken(token: string) {
  return ss.set(LOCAL_NAME, token)
}

export function removeToken() {
  return ss.remove(LOCAL_NAME)
}

export function setTimes(times: number) {
  return ss.set(TIMES_RECORD, times)
}
