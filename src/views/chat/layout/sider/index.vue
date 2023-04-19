<script setup lang="ts">
import type { CSSProperties } from 'vue'
import { computed, h, ref, watch } from 'vue'
import { NButton, NLayoutSider, NSelect, useDialog } from 'naive-ui'
import newchat from './newchat.vue'
import List from './List.vue'
import Footer from './Footer.vue'
import { PromptStore } from '@/components/common'
import { useAppStore, useAuthStore, useChatStore } from '@/store'
import { useBasicLayout } from '@/hooks/useBasicLayout'
import type { Gpt } from '@/store/modules/app/helper'
import { t } from '@/locales'
const appStore = useAppStore()
const chatStore = useChatStore()
const authStore = useAuthStore()
const dialog = useDialog()

const { isMobile } = useBasicLayout()
const show = ref(false)

const serveOptions: { label: string; key: string; value: string }[] = [
  { label: '1', key: '3.5', value: '3.5' },
  { label: '2', key: '3.5', value: '4.0' },
]

const system_content = computed({
  get() {
    return appStore.system_content
  },
  set(value: { label: string; key: string; value: string }[]) {
    appStore.settemp(value)
  },
})
const collapsed = computed(() => appStore.siderCollapsed)

const system_content_temp = computed({
  get() {
    return appStore.system_content_temp
  },
  set(value: number) {
    appStore.settemp(value)
  },
})
const gpt = computed({
  get() {
    return appStore.gpt
  },
  set(value: Gpt) {
    appStore.setgpt(value)
  },
})

function handlehelp() {
  dialog.warning({
    title: t('system content'),
    content: t(' 设置AI的语言风格和人格特征'),
  })
}

function handleAdd() {
  dialog.warning({
    title: t('参数设定'),
    content: () => h(newchat),
    positiveText: t('common.yes'),
    negativeText: t('common.no'),
    onPositiveClick: async () => {
      chatStore.addHistory({ title: 'New Chat', uuid: Date.now(), isEdit: false })
    },
  })
}

function handleUpdateCollapsed() {
  appStore.setSiderCollapsed(!collapsed.value)
}

function clearToken() {
  authStore.removeToken()
}

const getMobileClass = computed<CSSProperties>(() => {
  if (isMobile.value) {
    return {
      position: 'fixed',
      zIndex: 50,
    }
  }
  return {}
})

const mobileSafeArea = computed(() => {
  if (isMobile.value) {
    return {
      paddingBottom: 'env(safe-area-inset-bottom)',
    }
  }
  return {}
})

watch(
  isMobile,
  (val) => {
    appStore.setSiderCollapsed(val)
  },
  {
    immediate: true,
    flush: 'post',
  },
)
</script>

<template>
  <NLayoutSider
    :collapsed="collapsed"
    :collapsed-width="0"
    :width="260"
    :show-trigger="isMobile ? false : 'arrow-circle'"
    collapse-mode="transform"
    position="absolute"
    bordered
    :style="getMobileClass"
    @update-collapsed="handleUpdateCollapsed"
  >
    <div class="flex flex-col h-full" :style="mobileSafeArea">
      <main class="flex flex-col flex-1 min-h-0">
        <div class="p-4">
          <NButton dashed block @click="handleAdd">
            New chat
          </NButton>
        </div>
        <div class="flex-1 min-h-0 pb-4 overflow-hidden">
          <List />
        </div>

        <div class="p-4">
          累计访问人数：
        </div>

        <div class="p-4">
          <div class="flex items-center space-x-4">
            选择服务器：

            <div class="flex flex-wrap items-center gap-4">
              <NSelect style="width: 140px" :options="serveOptions" />
            </div>
          </div>
        </div>

        <div class="p-4">
          <NButton block @click="show = true">
            Prompt Store
          </NButton>
        </div>
        <div class="p-4">
          <NButton block @click="clearToken()">
            退出登录
          </NButton>
        </div>
      </main>
      <Footer />
    </div>
  </NLayoutSider>
  <template v-if="isMobile">
    <div
      v-show="!collapsed"
      class="fixed inset-0 z-40 bg-black/40"
      @click="handleUpdateCollapsed"
    />
  </template>
  <PromptStore v-model:visible="show" />
  <div ref="container" />
</template>
