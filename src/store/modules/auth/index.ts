import { defineStore } from 'pinia'
import { getToken, removeToken, setTimes, setToken } from './helper'
import { store } from '@/store'
import { fetchSession } from '@/api'

export interface AuthState {
  token: string | undefined
  session: { auth: boolean } | null
  times: number
}

export const useAuthStore = defineStore('auth-store', {
  state: (): AuthState => ({
    token: getToken(),
    session: null,
    times: 0,
  }),

  actions: {
    async getSession() {
      try {
        const { data } = await fetchSession<{ auth: boolean }>()
        this.session = { ...data }
        return Promise.resolve(data)
      }
      catch (error) {
        return Promise.reject(error)
      }
    },

    setToken(token: string) {
      this.token = token
      setToken(token)
    },

    removeToken() {
      this.token = undefined
      removeToken()
    },

    setTimes(times: number) {
      this.times = times
      setTimes(times)
    },
  },
  persist: {
    storage: localStorage,
  },
})

export function useAuthStoreWithout() {
  return useAuthStore(store)
}
