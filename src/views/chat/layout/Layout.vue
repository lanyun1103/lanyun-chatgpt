<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { NLayout, NLayoutContent } from 'naive-ui'
import { useRouter } from 'vue-router'
import Sider from './sider/index.vue'
import Permission from './Permission.vue'
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { useAppStore, useAuthStore, useChatStore } from '@/store'
import { fetchGetUser } from '@/api'
import PopUp from '@/views/chat/layout/PopUp.vue'

const router = useRouter()
const appStore = useAppStore()
const chatStore = useChatStore()
const authStore = useAuthStore()
// const prompt = ref<string>('')

router.replace({ name: 'Chat', params: { uuid: chatStore.active } })

const { isMobile } = useBasicLayout()

const collapsed = computed(() => appStore.siderCollapsed)

const showModal = ref(false)

const needPermission = computed(() => {
  const model = appStore.gpt
	console.log(model)
  if (model === 'gpt-3.5-turbo') {
    if (authStore.token)
      return false
    // 没有token，判断缓存是否大于4
    return parseInt(localStorage.getItem('accessAuth') || '') >= 4
  }
  else if (model === 'gpt-4') {
    if (authStore.token)
      return false
  }
  return true
})

// const getMobileClass = computed(() => {
//   if (isMobile.value)
//     return ['rounded-none', 'shadow-none']
//   return ['border', 'rounded-md', 'shadow-md', 'dark:border-neutral-800']
// })

const getContainerClass = computed(() => {
  return ['h-full', { 'pl-[260px]': !isMobile.value && !collapsed.value }]
})


onMounted(async () => {
  const userInfo = await fetchGetUser(authStore.token || '')
  if (userInfo.data === null) {
    if (userInfo.data === null)
      authStore.removeToken()
    authStore.setTimes(4)
  }
  else { authStore.setTimes(userInfo.data.times) }
  if (!localStorage.getItem('accessAuth'))
    localStorage.setItem('accessAuth', '0')
})
</script>

<template>
  <div
    class="h-full dark:bg-[#24272e] transition-all m-auto"
    :class="[isMobile ? 'p-0' : 'p-4']"
  >
    <div class="h-full overflow-hidden">
      <NLayout
        class="z-40 transition"
        :class="getContainerClass"
        has-sider
        style="height: 90vh; width: 95vw"
      >
        <Sider />

        <NLayoutContent class="h-full">
          <RouterView v-slot="{ Component, route }">
            <component :is="Component" :key="route.fullPath" />
          </RouterView>
        </NLayoutContent>
      </NLayout>
    </div>
    <Permission :visible="needPermission" />
    <PopUp :visible="showModal" />
  </div>
</template>
