import { ElConfigProvider, ElWatermark } from 'element-plus'
import { defineComponent, onBeforeMount } from 'vue'
import { RouterView } from 'vue-router'

import { useElementPlusConfig } from './hooks/useElementPlusConfig'
import { useAppStore } from './store'

export default defineComponent({
  name: 'App',
  setup() {
    const config = useElementPlusConfig()
    const appStore = useAppStore()

    const loadLocale = async () => {
      const result = await systemLangApi.findAll({ langCode: appStore.locale })

      appStore.mergeMessage(result)
    }

    onBeforeMount(async () => {
      await loadLocale()
    })

    return {
      config,
    }
  },
  render() {
    return (
      <ElConfigProvider {...this.config}>
        <ElWatermark
          style={{
            height: '100%',
          }}
        >
          <RouterView />
        </ElWatermark>
      </ElConfigProvider>
    )
  },
})
