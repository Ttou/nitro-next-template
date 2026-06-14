import type { ConfigProviderProps } from 'element-plus'
import enUS from 'element-plus/es/locale/lang/en'
import zhCN from 'element-plus/es/locale/lang/zh-cn'
import plusEnUS from 'plus-pro-components/es/locale/lang/en'
import plusZhCN from 'plus-pro-components/es/locale/lang/zh-cn'
import { computed, unref } from 'vue'
import { useAppStore } from '~web/store'

const locales = {
  zh_CN: {
    ...zhCN,
    ...plusZhCN,
  },
  en_US: {
    ...enUS,
    ...plusEnUS,
  },
}

export function useElementPlusConfig() {
  const appStore = useAppStore()

  const locale = computed(() => appStore.locale)

  const config = computed<Partial<ConfigProviderProps>>(() => ({
    locale: locales[unref(locale)],
    size: 'default',
  }))

  return config
}
