import { ss } from '@/utils/storage'

const LOCAL_NAME = 'appSetting'

export type Theme = 'light' | 'dark' | 'auto'

export type Gpt = 'gpt-3.5-turbo' | 'gpt-4'

export type Language = 'zh-CN' | 'zh-TW' | 'en-US'

export interface AppState {
  siderCollapsed: boolean
  theme: Theme
  language: Language
  gpt: Gpt
  max_1: number
  max_2: number
  system_content: { label: string; key: string; value: number }[]
  system_content_temp: number
}

export function defaultSetting(): AppState {
  return {
    siderCollapsed: false,
    theme: 'light',
    language: 'zh-CN',
    gpt: 'gpt-3.5-turbo',
    max_1: 4096,
    max_2: 1024,
    system_content: [
      { label: '温柔的', key: '`温柔的小猫咪', value: 0 },
      { label: '狂野的', key: '狂野的大狼狗', value: 1 },
    ],
    system_content_temp: 1,
  }
}

export function getLocalSetting(): AppState {
  const localSetting: AppState | undefined = ss.get(LOCAL_NAME)
  return { ...defaultSetting(), ...localSetting }
}

export function setLocalSetting(setting: AppState): void {
  ss.set(LOCAL_NAME, setting)
}
