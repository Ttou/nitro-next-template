<script setup lang="ts">
import type { TabPaneName } from 'element-plus'
import type { RouteLocationNormalizedLoadedGeneric } from 'vue-router'
import { Icon } from '@iconify/vue'
import { cloneDeep } from 'es-toolkit/compat'
import { match } from 'ts-pattern'
import { computed, ref, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '~web/store'

defineOptions({
  name: 'AppTabs',
})

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const originalTabs = ref<Map<string, RouteLocationNormalizedLoadedGeneric>>(new Map())
const rendererTabs = computed(() => [...originalTabs.value.values()])
const activeTab = computed(() => originalTabs.value.get(route.path)!)

function handleChangeTab(path: TabPaneName) {
  router.push(path as string)
}

function handleCloseTab(name: TabPaneName) {
  originalTabs.value.delete(name as string)

  if (originalTabs.value.size > 0) {
    const lastPath = [...originalTabs.value.keys()].pop()
    router.push(lastPath!)
  }
  else {
    if (route.path === userStore.homePath) {
      router.replace({ path: `/redirect${userStore.homePath}` })
    }
    else {
      router.replace(userStore.homePath)
    }
  }
}

function handleCommand(command: 'refresh-self' | 'close-other' | 'close-all') {
  match(command)
    .with('refresh-self', () => {
      router.replace({ path: `/redirect${route.path}`, query: route.query ?? {} })
    })
    .with('close-other', () => {
      [...originalTabs.value.keys()].forEach((path) => {
        if (path !== route.path) {
          originalTabs.value.delete(path)
        }
      })
    })
    .with('close-all', () => {
      originalTabs.value.clear()
      router.replace(userStore.homePath)
    })
    .exhaustive()
}

watchEffect(() => {
  if (!route.path.includes('/redirect')) {
    originalTabs.value.set(route.path, cloneDeep(route))
  }
})
</script>

<template>
  <div class="appTabs">
    <el-tabs class="tabs" :model-value="activeTab?.path" type="card" editable @tab-change="handleChangeTab" @tab-remove="handleCloseTab">
      <el-tab-pane v-for="item in rendererTabs" :key="item.path" :label="item.meta?.title" :name="item.path" />
      <template #add-icon>
        <el-dropdown trigger="click" @command="handleCommand">
          <Icon icon="ep:arrow-down" style="outline: none;" />
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="refresh-self">
                刷新当前
              </el-dropdown-item>
              <el-dropdown-item command="close-other">
                关闭其它
              </el-dropdown-item>
              <el-dropdown-item command="close-all">
                关闭全部
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </template>
    </el-tabs>
  </div>
</template>

<style scoped>
.appTabs  {
  padding: 20px 20px 0;
}

.tabs {
  --el-tabs-header-height: 36px;
}

.tabs :deep(.el-tabs__header) {
  margin-bottom: 0;
}
</style>
