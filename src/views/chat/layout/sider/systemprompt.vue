<script setup lang="ts">
import { computed } from 'vue'
import { NInput } from 'naive-ui'
import { useAppStore } from '@/store'
const appStore = useAppStore()

const system_content_temp = computed({
  get() {
    return appStore.system_content_temp
  },
  set(value: number) {
    appStore.settemp(value)
  },
})
</script>

<template>
  <div>Role Name:</div>
  <NInput
    v-model:value="appStore.$state.system_content[system_content_temp].label"
  />
  <hr>
  <div>Role Content:</div>
  <NInput
    v-model:value="appStore.$state.system_content[system_content_temp].key"
  />
</template>

<style scoped>
.sub-title {
	font-size: 1.5rem;
	font-weight: bold;
	color: #333;
	margin-bottom: 20px;
}
</style>
