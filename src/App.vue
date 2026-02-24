<script setup lang="ts">
import { onBeforeMount } from 'vue'
import { systemLangApi } from './apis'
import { useElementPlusConfig } from './hooks'
import { useAppStore } from './store'

const config = useElementPlusConfig()
const appStore = useAppStore()

async function loadLocale() {
  const result = await systemLangApi.findAll({ langCode: appStore.locale })

  appStore.mergeMessage(result)
}

onBeforeMount(async () => {
  await loadLocale()
})
</script>

<template>
  <el-config-provider v-bind="config">
    <el-watermark style="height: 100%;">
      <router-view />
    </el-watermark>
  </el-config-provider>
</template>
