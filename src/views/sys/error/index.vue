<script setup lang="ts">
import type { IStatus } from './index.define'

import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { STATUS_MAP } from './index.define'

defineOptions({
  name: 'ErrorView',
})

const route = useRoute()
const router = useRouter()

const status = computed(() => {
  return (route.query.status ?? '404') as IStatus
})

const subTitle = computed(() => STATUS_MAP[status.value].title)

const icon = computed(() => STATUS_MAP[status.value].icon)

function handleClick() {
  router.replace('/')
}
</script>

<template>
  <el-result :title="status" :sub-title="subTitle" :icon="icon">
    <template #extra>
      <el-button type="primary" @click="handleClick">
        返回首页
      </el-button>
    </template>
  </el-result>
</template>
