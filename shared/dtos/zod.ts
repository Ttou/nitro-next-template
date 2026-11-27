import { isValidPhoneNumber } from 'libphonenumber-js'
import { z } from 'zod'

/**
 * 非空文本
 *
 * 缺省、null、空串都返回同一条提示；先 trim 再判空，纯空格同样视为空
 */
export function requiredText(message: string) {
  return z.string({ error: message }).trim().min(1, { error: message })
}

/**
 * 可选文本
 *
 * `null` 归一化为 `undefined`，避免前端清空表单时把 null 透传到 service 层与数据库
 */
export function optionalText(message = '内容格式不正确') {
  return z.string({ error: message }).nullish().transform(value => value ?? undefined)
}

/**
 * 主键：UUID v7
 */
export function uuid(message = 'ID格式不正确') {
  return z.uuid({ version: 'v7', error: message })
}

/**
 * 非空的主键数组
 */
export function uuidArray(message = 'ID格式不正确', emptyMessage = 'ID数组不能为空') {
  return z.array(uuid(message), { error: emptyMessage }).nonempty({ error: emptyMessage })
}

/**
 * ISO 8601 日期时间字符串
 */
export function dateText(message = '日期格式不正确') {
  return z.string({ error: message }).refine(value => !Number.isNaN(Date.parse(value)), { error: message })
}

/**
 * 枚举值
 *
 * @param values 允许的枚举值
 * @param message 取值不合法时的提示
 * @param missingMessage 缺省时的提示，默认与取值不合法时相同
 */
export function enumOf<T extends string>(values: readonly T[], message: string, missingMessage = message) {
  return z.enum(values as unknown as [T, ...T[]], {
    error: issue => (issue.input === undefined
      ? missingMessage
      : message),
  })
}

/**
 * 可选枚举值，`null` 归一化为 `undefined`
 */
export function optionalEnumOf<T extends string>(values: readonly T[], message: string) {
  return enumOf(values, message).nullish().transform(value => value ?? undefined)
}

/**
 * 手机号码，与 class-validator 的 `@IsPhoneNumber('CN')` 保持一致（含固话）
 */
export function phoneText(message = '手机号码格式不正确') {
  return z.string({ error: message }).refine(value => isValidPhoneNumber(value, 'CN'), { error: message })
}

/**
 * 邮箱
 */
export function emailText(message = '邮箱格式不正确') {
  return z.email({ error: message })
}
