<script setup lang="ts">
import type { CSSProperties } from 'vue'
import { computed, ref, watch } from 'vue'
import { NButton, NInput, NLayoutSider, NSelect, NSlider } from 'naive-ui'
import List from './List.vue'
import Footer from './Footer.vue'
import { useAppStore, useAuthStore, useChatStore } from '@/store'
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { PromptStore } from '@/components/common'
import type { Gpt } from '@/store/modules/app/helper'
const appStore = useAppStore()
const chatStore = useChatStore()
const authStore = useAuthStore()

const { isMobile } = useBasicLayout()
const show = ref(false)
// const modelOptions: { label: string; key: string; value: string }[] = [
//   { label: 'Chatgpt3.5', key: '3.5', value: 'gpt-3.5-turbo' },
//   { label: 'Chatgpt4.0', key: '3.5', value: 'gpt-4' },
// ]

const serveOptions: { label: string; key: string; value: string }[] = [
  { label: '1', key: '3.5', value: '3.5' },
  { label: '2', key: '3.5', value: '4.0' },
]

const collapsed = computed(() => appStore.siderCollapsed)

const gpt = computed({
  get() {
    return appStore.gpt
  },
  set(value: Gpt) {
    appStore.setgpt(value)
  },
})

const max_1 = computed({
  get() {
    return appStore.max_1
  },
  set(value: number) {
    appStore.setmax_1(value)
  },
})

const max_1_st = computed({
  get() {
    return appStore.max_1.toString()
  },
  set(value: string) {
    appStore.setmax_1(parseInt(value))
  },
})

const max_2 = computed({
  get() {
    return appStore.max_2
  },
  set(value: number) {
    appStore.setmax_2(value)
  },
})

const max_2_st = computed({
  get() {
    return appStore.max_2.toString()
  },
  set(value: string) {
    appStore.setmax_2(parseInt(value))
  },
})

function handleAdd() {
  chatStore.addHistory({ title: 'New Chat', uuid: Date.now(), isEdit: false })
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

        <div v-if="gpt === 'gpt-3.5-turbo'" class="p-4">
          Chatgpt 3.5's max token:
          <NInput v-model:value="max_1_st" />
          <div>
            <NSlider v-model:value="max_1" :min="0" :max="4096" :step="1" />
          </div>
        </div>

        <div v-if="gpt === 'gpt-4'" class="p-4">
          Chatgpt 4.0's max token:
          <NInput v-model:value="max_2_st" />
          <div>
            <NSlider v-model:value="max_2" :min="0" :max="8196" :step="1" />
          </div>
        </div>
        <div class="p-4">
          累计访问人数：
        </div>
        <!--        <div class="p-4"> -->
        <!--          <div class="flex items-center space-x-4"> -->
        <!--            选择模型 ： -->

        <!--            <div class="flex flex-wrap items-center gap-4"> -->
        <!--              <NSelect -->
        <!--                style="width: 140px" -->
        <!--                :options="modelOptions" -->
        <!--                :value="gpt" -->
        <!--                @update-value="(value) => appStore.setgpt(value)" -->
        <!--              /> -->
        <!--            </div> -->
        <!--          </div> -->
        <!--        </div> -->

        <div class="p-4">
          <div class="flex items-center space-x-4">
            选择服务器：

            <div class="flex flex-wrap items-center gap-4">
              <NSelect
                style="width: 140px"
                :options="serveOptions"
                @update-value="(value) => appStore.setLanguage(value)"
              />
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
</template>
