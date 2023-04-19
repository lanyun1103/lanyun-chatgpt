<script setup lang='ts'>
import { computed, ref } from 'vue'
import { NButton, NInput, NModal, useMessage } from 'naive-ui'
import { fetchVerify } from '@/api'
import { useAuthStore } from '@/store'
import Icon403 from '@/icons/403.vue'

interface Props {
  visible: boolean
}

defineProps<Props>()

const authStore = useAuthStore()

const ms = useMessage()

const loading = ref(false)
const token = ref('')

const disabled = computed(() => !token.value.trim() || loading.value)

async function handleVerify() {
  const secretKey = token.value.trim()

  if (!secretKey)
    return

  try {
    loading.value = true
    const response = await fetchVerify(secretKey)
    const uuid: string = response.data
    authStore.setToken(secretKey)
    // 用户登录唯一键
    localStorage.setItem('uniqueKey', uuid)
    ms.success('success')
    window.location.reload()
  }
  catch (error: any) {
    ms.error(error.message ?? 'error')
    authStore.removeToken()
    token.value = ''
  }
  finally {
    loading.value = false
  }
}

async function handleJump() {
  window.open('https://www.vifaka.com/list/97171ae5d1327582', '_blank')
  window.open('https://www.vifaka.com/list/b3d8053fd1da9530', '_blank')
}

function handlePress(event: KeyboardEvent) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    handleVerify()
  }
}
</script>

<template>
  <NModal :show="visible" style="width: 90%; max-width: 640px">
    <div class="p-10 bg-white rounded dark:bg-slate-800">
      <div class="space-y-4">
        <header class="space-y-2">
          <h2 class="text-2xl font-bold text-center text-slate-800 dark:text-neutral-200">
            403
          </h2>
          <p class="text-base text-center text-slate-500 dark:text-slate-500">
            {{ $t('common.unauthorizedTips') }}
          </p>
          <Icon403 class="w-[200px] m-auto" />
          <p>本站提供稳定且高速的GPT对话服务，现已支持GPT-4，但运营成本不断上升，GPT4接口费用为GPT3.5-Turbo费用的30倍。为让更多用户了解和体验，我们推出优惠活动，分享指定文案可获2千字个人授权码和共用授权码。您可关注公众号，了解具体步骤，也可直接购买服务。访问域名发布页获取更多服务信息。让GPT-3.5, GPT-4帮您更好地处理工作。合作+V: 17390763166</p>
          <p>本站提供稳定且高速的GPT对话服务，但运营成本不断上升，GPT4接口费用为GPT3.5-Turbo费用的30倍。为让更多用户了解和体验，我们推出优惠活动，分享指定文案可获2千字个人授权码和共用授权码。您可关注公众号，了解具体步骤，也可直接购买服务。访问域名发布页获取更多服务信息。让GPT-3.5, GPT-4帮您更好地处理工作。合作+V: 17390763166</p>
        </header>
        <NInput v-model:value="token" type="password" placeholder="" @keypress="handlePress" />
        <NButton
          block
          color="red"
          type="primary"
          @click="handleJump"
        >
          跳转购买
        </NButton>
        <NButton
          block
          type="primary"
          :disabled="disabled"
          :loading="loading"
          @click="handleVerify"
        >
          {{ $t('common.verify') }}
        </NButton>
      </div>
    </div>
  </NModal>
</template>
