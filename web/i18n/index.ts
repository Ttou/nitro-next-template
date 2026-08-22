import { createI18n } from 'vue-i18n'

import appEnUS from './langs/en_US.json'
import appZhCN from './langs/zh_CN.json'

const messages = {
  zh_CN: {
    ...appZhCN,
  },
  en_US: {
    ...appEnUS,
  },
}

export type ILocale = keyof typeof messages

const i18n = createI18n({
  legacy: false,
  fallbackLocale: 'en_US',
  fallbackWarn: false,
  missingWarn: false,
  messages,
})

export default i18n
