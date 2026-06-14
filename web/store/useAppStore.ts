import type { ILocale } from '~web/i18n'
import { defineStore } from 'pinia'
import { ref } from 'vue'
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

    if (locale.value) {
      i18n.global.locale.value = locale.value
    }

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
