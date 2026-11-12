import type { MessageValue } from 'intl-messageformat'
import type { CompileError, MessageCompiler, MessageContext } from 'vue-i18n'
import IntlMessageFormat from 'intl-messageformat'

/** i18n 的 locale 使用下划线（如 zh_CN），Intl 需要 BCP 47 的连字符（zh-CN） */
function toIntlLocale(locale: string): string {
  return locale.replace(/_/g, '-')
}

/**
 * 使用 intl-messageformat 作为消息编译器，使 vue-i18n 支持 ICU Message Format。
 * @example `{count, plural, =0 {暂无数据} other {# 条数据}}`
 */
export const messageCompiler: MessageCompiler = (message, { locale, key, onError }) => {
  if (typeof message === 'string') {
    const formatter = new IntlMessageFormat(message, toIntlLocale(locale))
    return (ctx: MessageContext) =>
      formatter.format(ctx.values as Record<string, MessageValue>) as string
  }

  // 仅在构建期把消息预编译成 AST 时进入此分支；本项目消息均在运行时以 JSON 注入
  onError?.(new Error('不支持 AST 格式的消息') as CompileError)
  return () => key
}
