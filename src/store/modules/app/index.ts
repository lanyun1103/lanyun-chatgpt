import { createPinia, defineStore } from 'pinia'
import type { AppState, Gpt, Language, Theme } from './helper'
import { getLocalSetting, setLocalSetting } from './helper'

const store = createPinia()

export const useAppStore = defineStore('app-store', {
  state: (): AppState => getLocalSetting(),
  actions: {
    setSiderCollapsed(collapsed: boolean) {
      this.siderCollapsed = collapsed
      this.recordState()
    },

    setTheme(theme: Theme) {
      this.theme = theme
      this.recordState()
    },

    setLanguage(language: Language) {
      if (this.language !== language) {
        this.language = language
        this.recordState()
      }
    },

    setgpt(gpt: Gpt) {
      if (this.gpt !== gpt) {
        this.gpt = gpt
        this.recordState()
      }
    },

    setmax_1(max: number) {
      if (this.max_1 !== max) {
        this.max_1 = max
        this.recordState()
      }
    },

    setmax_2(max: number) {
      if (this.max_2 !== max) {
        this.max_2 = max
        this.recordState()
      }
    },

    settemp(max: number) {
      if (this.system_content_temp !== max) {
        this.system_content_temp = max
        this.recordState()
      }
    },

    recordState() {
      setLocalSetting(this.$state)
    },
  },
})

export function useAppStoreWithOut() {
  return useAppStore(store)
}
