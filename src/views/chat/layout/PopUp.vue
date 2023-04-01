<script setup lang='ts'>
import { NButton, NModal } from 'naive-ui'

interface Props {
  visible: boolean
}

defineProps<Props>()

async function callAdmin() {
  window.open('https://mp.weixin.qq.com/s?__biz=Mzg3NTY2NDU3NA==&mid=2247484467&idx=1&sn=0cc8b1a0003b2bc624610b5c4bfe8df6&chksm=cf3f41e2f848c8f4d967796a4aa699eb54314656ea12ea027bc49e6a8022c41fd1936dda3ddb#rd', '_blank')
}

async function handleJump() {
  window.open('https://login.feishu.cn/accounts/page/login?app_id=2&query_scope=all&redirect_uri=https%3A%2F%2Fw3il86yl7n.feishu.cn%2Fdocx%2FBNpPdbbDwoBV6uxn2RdceUhXnfc%3Flogin_redirect_times%3D1', '_blank')
}
</script>

<template>
  <NModal
    :show="visible" style="width: 50%; max-width: 440px"
    preset="dialog"
  >
    <div class="p-10 bg-white rounded dark:bg-slate-800">
      <div class="space-y-4">
        <header class="space-y-2">
          <h2 class="text-2xl font-bold text-center text-slate-800 dark:text-neutral-200">
            MAGICPENCIL!
          </h2>
          <p>MagicPencil旨在“构建无需翻墙稳定且快速的GPT对话服务”我们不生产模型，我们只是OPENAI的搬运工!</p>
          <p>更多资讯尽在公众号【魔术铅笔】。我们的永久发布页 <a style="color: red" href="https://lanyun1103.top" target="_blank">lanyun1103.top</a></p>
        </header>
        <NButton
          block
          color="purple"
          type="primary"
          @click="handleJump"
        >
          使用须知
        </NButton>
        <NButton
          block
          color="red"
          type="primary"
          @click="callAdmin"
        >
          联系管理员
        </NButton>
      </div>
    </div>
  </NModal>
</template>
