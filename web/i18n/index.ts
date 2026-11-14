import { createI18n } from 'vue-i18n'
import builtinEnUS from '../../resource/locales/en_US.json'
import builtinZhCN from '../../resource/locales/zh_CN.json'

import { messageCompiler } from './compilation'
import appEnUS from './langs/en_US.json'
import appZhCN from './langs/zh_CN.json'

/**
 * 内置词条与前端词条合并，前端词条优先。
 * 内置词条保证首屏（含模块顶层常量、ref 初始值）在服务端词条加载前也能正确翻译；
 * App.vue 加载服务端词条后会 merge 覆盖，管理台自定义译文优先生效。
 */
const messages = {
  zh_CN: {
    ...builtinZhCN,
    ...appZhCN,
  },
  en_US: {
    ...builtinEnUS,
    ...appEnUS,
  },
}

export type ILocale = keyof typeof messages

/**
 * createI18n 默认 locale 为 en-US，与项目的 zh_CN / en_US 不匹配，会让首屏词条回退到英文。
 * 这里与 useAppStore 持久化的语言保持一致，保证 store 创建前求值的词条（如路由 meta）语言正确。
 */
function initialLocale(): ILocale {
  if (typeof window === 'undefined')
    return 'zh_CN'
  try {
    const persisted = JSON.parse(window.localStorage.getItem('app') ?? '{}')
    return persisted?.locale === 'en_US'
      ? 'en_US'
      : 'zh_CN'
  }
  catch {
    return 'zh_CN'
  }
}

const i18n = createI18n({
  legacy: false,
  locale: initialLocale(),
  fallbackLocale: 'en_US',
  fallbackWarn: false,
  missingWarn: false,
  messageCompiler,
  messages,
})

/**
 * 在 <script setup>、hooks 与普通模块中翻译词条。
 * 模板内可直接使用 vue-i18n 注入的 `$t`。
 * @example t('common.confirm.deleteWithName', { name: row.nickName })
 */
export function t(key: string, values?: Record<string, unknown>): string {
  return i18n.global.t(key, values ?? {}) as string
}

export default i18n
