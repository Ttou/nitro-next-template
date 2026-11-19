import type { ConfigProviderProps } from 'element-plus'
import zhCN from 'element-plus/es/locale/lang/zh-cn'
import plusZhCN from 'plus-pro-components/es/locale/lang/zh-cn'
import { computed } from 'vue'

export function useElementPlusConfig() {
  const config = computed<Partial<ConfigProviderProps>>(() => ({
    locale: {
      ...zhCN,
      ...plusZhCN,
    },
    size: 'default',
  }))

  return config
}
