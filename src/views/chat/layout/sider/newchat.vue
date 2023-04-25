<script setup lang="ts">
import { computed, h, ref, watch } from 'vue'
import { NInput, NSelect, NSlider, useDialog } from 'naive-ui'
import systemPrompt from './systemprompt.vue'
import { HoverButton, SvgIcon } from '@/components/common'
import { useAppStore } from '@/store'
import { useBasicLayout } from '@/hooks/useBasicLayout'
import type { Gpt } from '@/store/modules/app/helper'
import { t } from '@/locales'
const appStore = useAppStore()
const dialog = useDialog()
const { isMobile } = useBasicLayout()

const sliderValue = ref(50)

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

function handlecontent() {
  dialog.warning({
    title: t('System Role edit'),
    content: () => h(systemPrompt),
  })
}

function handlehelp() {
  dialog.warning({
    title: t('help.max'),
    content: t('help.max_tokens'),
  })
}

function handlehelp_emo() {
  dialog.warning({
    title: t('help.emo'),
    content: t('help.emotional'),
  })
}

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
  <div v-if="gpt === 'gpt-3.5-turbo'" class="p-4">
    <div class="flex justify-left items-center space-x-4">
      Chatgpt 3.5's max tokens:
      <HoverButton @click="handlehelp">
        <span class="text-xl text-[#4f555e] dark:text-white">
          <SvgIcon icon="ri:question-line" />
        </span>
      </HoverButton>
    </div>
    <NInput v-model:value="max_1_st" />
    <div>
      <NSlider v-model:value="max_1" :min="0" :max="4096" :step="1" />
    </div>
  </div>

  <div v-if="gpt === 'gpt-4'" class="p-4">
    Chatgpt 4.0's max tokens:
    <NInput v-model:value="max_2_st" />
    <div>
      <NSlider v-model:value="max_2" :min="0" :max="8196" :step="1" />
    </div>
  </div>

  <div class="p-4">
    <div class="flex justify-left items-center space-x-4">
      <div>Emotional Temperature</div>
      <HoverButton @click="handlehelp_emo">
        <span class="text-xl text-[#4f555e] dark:text-white">
          <SvgIcon icon="ri:question-line" />
        </span>
      </HoverButton>
    </div>
    <div>
      <NSlider v-model="sliderValue" :min="0" :max="2.0" :step="0.01" />
    </div>
  </div>
  <div class="p-4">
    <div class="flex justify-left items-center space-x-4">
      System Role
      <HoverButton @click="handlehelp">
        <span class="text-xl text-[#4f555e] dark:text-white">
          <SvgIcon icon="ri:question-line" />
        </span>
      </HoverButton>
    </div>
    <div class="flex items-center space-x-4">
      <div class="flex flex-wrap items-center gap-4">
        <NSelect
          v-model:value="appStore.$state.system_content_temp"
          style="width: 140px"
          :options="appStore.$state.system_content"
          @update-value="value => appStore.settemp(value)"
        />

        <HoverButton @click="handlecontent">
          <span class="text-xl text-[#4f555e] dark:text-white">
            <SvgIcon icon="ri-edit-line" />
          </span>
        </HoverButton>
        <HoverButton @click="handlecontent">
          <span class="text-xl text-[#4f555e] dark:text-white">
            <SvgIcon icon="ri-download-line" />
          </span>
        </HoverButton>
      </div>
    </div>
  </div>
</template>
