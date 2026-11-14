import type { ILocale } from '~web/i18n'
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import i18n from '~web/i18n'

export const useAppStore = defineStore(
  'app',
  () => {
    const locale = ref<ILocale>('zh_CN')

    function setLocale(value: ILocale) {
      locale.value = value
      window.location.reload()
    }

    function mergeMessage(value: any) {
      i18n.global.mergeLocaleMessage(locale.value, value)
    }

    // 持久化恢复发生在 store 初始化之后，用 watch 跟随可保证 i18n 语言始终与 store 一致
    watch(locale, (value) => {
      i18n.global.locale.value = value
    }, { immediate: true })

    return {
      locale,
      setLocale,
      mergeMessage,
    }
  },
  {
    persist: {
      pick: ['locale'],
    },
  },
)
