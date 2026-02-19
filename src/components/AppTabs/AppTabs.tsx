import type { TabPaneName } from 'element-plus'
import type { RouteLocationNormalizedLoadedGeneric } from 'vue-router'
import { Icon } from '@iconify/vue'
import { ElDropdown, ElDropdownItem, ElDropdownMenu, ElTabPane, ElTabs } from 'element-plus'
import { cloneDeep } from 'es-toolkit/compat'
import { match } from 'ts-pattern'
import { computed, defineComponent, ref, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useUserStore } from '~web/store'
import styles from './AppTabs.module.css'

export default defineComponent({
  name: 'AppTabs',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const userStore = useUserStore()

    const originalTabs = ref<Map<string, RouteLocationNormalizedLoadedGeneric>>(new Map())
    const rendererTabs = computed(() => Array.from(originalTabs.value.values()))
    const activeTab = computed(() => originalTabs.value.get(route.path))

    function handleChangeTab(path: TabPaneName) {
      router.push(path as string)
    }

    function handleCloseTab(name: TabPaneName) {
      originalTabs.value.delete(name as string)

      if (originalTabs.value.size > 0) {
        const lastPath = Array.from(originalTabs.value.keys()).pop()
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
          Array.from(originalTabs.value.keys()).forEach((path) => {
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

    return {
      activeTab,
      rendererTabs,
      handleChangeTab,
      handleCloseTab,
      handleCommand,
    }
  },
  render() {
    return (
      <div class={styles.appTabs}>
        <ElTabs class={styles.tabs} modelValue={this.activeTab?.path} type="card" editable onTabChange={this.handleChangeTab} onTabRemove={this.handleCloseTab}>
          {{
            'default': () => this.rendererTabs.map(item => <ElTabPane key={item.path} label={item.meta.title} name={item.path}></ElTabPane>),
            'add-icon': () => (
              <ElDropdown trigger="click" onCommand={this.handleCommand}>
                {{
                  default: () => <Icon icon="ep:arrow-down" style={{ outline: 'none' }} />,
                  dropdown: () => (
                    <ElDropdownMenu>
                      <ElDropdownItem command="refresh-self">刷新当前</ElDropdownItem>
                      <ElDropdownItem command="close-other">关闭其它</ElDropdownItem>
                      <ElDropdownItem command="close-all">关闭全部</ElDropdownItem>
                    </ElDropdownMenu>
                  ),
                }}
              </ElDropdown>
            ),
          }}
        </ElTabs>
      </div>
    )
  },
})
