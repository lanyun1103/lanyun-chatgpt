<script lang="ts" setup>
import { NButton, NLayoutHeader } from 'naive-ui'
import { computed } from 'vue'
import { useAuthStore } from '@/store'

const authStore = useAuthStore()
const times = computed(() => {
  return authStore.times
})

function issue() {
  window.open('https://w3il86yl7n.feishu.cn/docx/GMTMdYABIo5PBUxPdEQcQ4ExnVc?from=from_copylink', '_blank')
}

function toBuy() {
  window.open('https://www.vifaka.com/list/97171ae5d1327582', '_blank')
}
</script>

<template>
  <div class="w-full max-w-screen-xl m-auto">
    <div class="flex items-center justify-between space-x-2">
      <NLayoutHeader style="height: 10vh; width: 76vw">
        <div style="transform: translate(30%, 0%)">
          <NButton type="primary" @click="issue">
            常见问题
          </NButton>

          剩余提问字数 : <NText>{{ times }}</NText>

          <NButton type="primary" @click="toBuy">
            购买卡密
          </NButton>
          <NButton type="primary" >
            联系管理员
          </NButton>
        </div>
      </NLayoutHeader>
    </div>
  </div>
</template>

<style scoped>

</style>
